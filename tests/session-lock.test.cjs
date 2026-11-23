'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Guard = require('../js/session-lock.js');
const Core = require('../js/core.js');

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Like navigator.locks, the manager reserves a lease before invoking the callback
// and retains it until the callback's returned promise settles. Requests and
// callbacks are scheduled asynchronously; unavailable ifAvailable requests do
// not wait for the owner. This exposes lifecycle races hidden by a boolean mock.
function manager() {
  const held = new Map(), calls = [];
  let gate = null, nextError = null;
  return {
    held, calls,
    holdDelivery() { gate = deferred(); return gate; },
    failNext(error) { nextError = error; },
    request(name, options, callback) {
      assert.equal(options.mode, 'exclusive');
      assert.equal(options.ifAvailable, true);
      calls.push({ name, options });
      const wait = gate ? gate.promise : Promise.resolve();
      gate = null;
      const failure = nextError; nextError = null;
      return wait.then(async () => {
        if (failure) throw failure;
        if (held.has(name)) return callback(null);
        const lease = { name, mode: 'exclusive' };
        held.set(name, lease);
        try { return await callback(lease); }
        finally { if (held.get(name) === lease) held.delete(name); }
      });
    }
  };
}

async function drain() {
  for (let turn = 0; turn < 12; turn++) await Promise.resolve();
}

test('unsupported browsers expose a distinct advisory state without requesting a lock', async () => {
  for (const locks of [undefined, null, {}]) {
    const guard = Guard.create({ locks });
    assert.equal(guard.getState(), 'unsupported');
    assert.equal(await guard.start(), 'unsupported');
    assert.equal(await guard.retry(), 'unsupported');
    assert.equal(await guard.release(), 'unsupported');
    assert.equal(guard.getError(), null);
  }
  assert.equal(Guard.LOCK_NAME, Core.STORAGE_KEY + '.writer');
});

test('one owner holds the lease; a second window becomes viewer without waiting', async () => {
  const locks = manager(), states = [];
  const a = Guard.create({ locks, onChange: state => states.push(state) });
  const b = Guard.create({ locks });
  assert.equal(a.getState(), 'pending');
  assert.equal(await a.start(), 'owner');
  assert.equal(a.getState(), 'owner');
  assert.equal(locks.held.size, 1, 'start resolves while the lease stays held');
  assert.equal(await b.start(), 'viewer');
  assert.equal(b.getState(), 'viewer');
  assert.equal(locks.held.size, 1);
  await a.release();
  assert.equal(a.getState(), 'viewer');
  assert.equal(locks.held.size, 0, 'release resolves after the lease is gone');
  assert.equal(await b.retry(), 'owner');
  await b.release();
  assert.deepEqual(states, ['owner', 'viewer']);
});

test('repeated starts/retries reuse the pending attempt and never stack owner leases', async () => {
  const locks = manager(), gate = locks.holdDelivery();
  const guard = Guard.create({ locks });
  const first = guard.start();
  assert.equal(guard.start(), first);
  assert.equal(guard.retry(), first);
  await drain();
  assert.equal(locks.calls.length, 1);
  gate.resolve();
  assert.equal(await first, 'owner');
  assert.equal(await guard.start(), 'owner');
  assert.equal(await guard.retry(), 'owner');
  assert.equal(locks.calls.length, 1);
  await guard.release();
});

test('release before the request starts cancels it and settles the pending decision', async () => {
  const locks = manager(), states = [];
  const guard = Guard.create({ locks, onChange: state => states.push(state) });
  const decision = guard.start();
  await guard.release();
  assert.equal(await decision, 'viewer');
  assert.equal(locks.calls.length, 0);
  assert.equal(guard.getState(), 'viewer');
  assert.deepEqual(states, ['viewer']);
});

test('a late grant after release is dropped; immediate retry waits for its release', async () => {
  const locks = manager(), gate = locks.holdDelivery(), states = [];
  const guard = Guard.create({ locks, onChange: state => states.push(state) });
  const oldDecision = guard.start();
  await drain();
  assert.equal(locks.calls.length, 1);
  const released = guard.release();
  assert.equal(await oldDecision, 'viewer');
  const nextDecision = guard.retry();
  await drain();
  assert.equal(guard.getState(), 'pending');
  assert.equal(locks.calls.length, 1, 'the second request waits for the old one');
  gate.resolve();
  await released;
  assert.equal(await nextDecision, 'owner');
  assert.equal(locks.calls.length, 2);
  assert.deepEqual(states, ['viewer', 'pending', 'owner'], 'the stale grant never reports owner');
  await guard.release();
});

test('owner can release and reacquire immediately as during pagehide/pageshow', async () => {
  const locks = manager(), guard = Guard.create({ locks });
  assert.equal(await guard.start(), 'owner');
  const release = guard.release();
  assert.equal(guard.getState(), 'viewer', 'write permission ends synchronously');
  const acquire = guard.start();
  assert.equal(guard.getState(), 'pending');
  await release;
  assert.equal(await acquire, 'owner');
  assert.equal(locks.calls.length, 2);
  assert.equal(locks.held.size, 1);
  await guard.release();
});

test('request rejection stays read-only and retry can recover', async () => {
  const locks = manager(), guard = Guard.create({ locks });
  locks.failNext(new Error('Lock access denied'));
  assert.equal(await guard.start(), 'error');
  assert.equal(guard.getState(), 'error');
  assert.equal(guard.getError(), 'Lock access denied');
  assert.equal(await guard.retry(), 'owner');
  assert.equal(guard.getError(), null);
  await guard.release();
});

test('a synchronous API failure becomes error and does not strand the decision', async () => {
  let broken = true;
  const native = manager();
  const locks = { request(...args) { if (broken) throw new Error('SecurityError'); return native.request(...args); } };
  const guard = Guard.create({ locks });
  assert.equal(await guard.start(), 'error');
  broken = false;
  assert.equal(await guard.retry(), 'owner');
  await guard.release();
});

test('a rejected stale request cannot replace the state of a newer retry', async () => {
  const locks = manager(), gate = locks.holdDelivery();
  locks.failNext(new Error('old failure'));
  const guard = Guard.create({ locks });
  const old = guard.start();
  await drain();
  const release = guard.release(), next = guard.retry();
  gate.resolve();
  assert.equal(await old, 'viewer');
  await release;
  assert.equal(await next, 'owner');
  assert.equal(guard.getError(), null);
  await guard.release();
});

test('an observer throwing or releasing synchronously cannot leak the lease', async () => {
  const locks = manager();
  const throwing = Guard.create({ locks, onChange() { throw new Error('UI failure'); } });
  assert.equal(await throwing.start(), 'owner');
  await throwing.release();
  assert.equal(locks.held.size, 0);
  let guard;
  guard = Guard.create({ locks, onChange(state) { if (state === 'owner') guard.release(); } });
  assert.equal(await guard.start(), 'viewer');
  await drain();
  assert.equal(guard.getState(), 'viewer');
  assert.equal(locks.held.size, 0);
});

test('retry immediately after viewer makes a new request', async () => {
  const locks = manager(), a = Guard.create({ locks }), b = Guard.create({ locks });
  await a.start();
  assert.equal(await b.start(), 'viewer');
  assert.equal(await b.retry(), 'viewer');
  assert.equal(locks.calls.length, 3);
  await a.release();
  assert.equal(await b.retry(), 'owner');
  await b.release();
});

test('release from a pending-state observer safely cancels retry', async () => {
  const locks = manager();
  let guard, cancelPending = false;
  guard = Guard.create({ locks, onChange(state) {
    if (state === 'pending' && cancelPending) guard.release();
  } });
  await guard.start();
  await guard.release();
  cancelPending = true;
  assert.equal(await guard.retry(), 'viewer');
  await drain();
  assert.equal(guard.getState(), 'viewer');
  assert.equal(locks.held.size, 0);
});
