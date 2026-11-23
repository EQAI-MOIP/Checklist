/* One writable QURI window per origin. Native Web Locks only; no network I/O. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.QuriSessionLock = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var LOCK_NAME = 'quri.examiner.workspace.v1.writer';

  function create(options) {
    options = options || {};
    var locks = options.locks;
    var supported = Boolean(locks && typeof locks.request === 'function');
    var state = supported ? 'pending' : 'unsupported';
    var error = null, active = null;
    var releasing = Promise.resolve();

    function change(next, reason) {
      var message = reason ? String(reason.message || reason) : null;
      if (state === next && error === message) return;
      state = next; error = message;
      if (typeof options.onChange === 'function') {
        // A rendering failure must not reject the lock callback or strand a lease.
        try { options.onChange(state, error); } catch (_) { /* Consumer owns UI errors. */ }
      }
    }

    function start() {
      if (!supported) return Promise.resolve('unsupported');
      if (active) return active.decision;

      var resolveDecision;
      var attempt = {
        decision: new Promise(function (resolve) { resolveDecision = resolve; }),
        finish: function (value) { resolveDecision(value); },
        releaseHold: null,
        request: null
      };
      active = attempt;
      // A pageshow/retry may arrive before pagehide's lease has actually ended.
      // Wait for that release before making the next non-blocking request.
      attempt.request = releasing.then(function () {
        if (active !== attempt) return;
        return locks.request(LOCK_NAME, { mode: 'exclusive', ifAvailable: true }, function (lock) {
          // Late grants after release() must never make this window writable.
          if (active !== attempt) return;
          if (!lock) {
            active = null;
            releasing = attempt.request;
            change('viewer');
            attempt.finish('viewer');
            return;
          }
          return new Promise(function (resolve) {
            attempt.releaseHold = resolve;
            change('owner');
            attempt.finish(active === attempt ? 'owner' : state);
          });
        });
      }).catch(function (reason) {
        if (active === attempt) {
          active = null;
          releasing = attempt.request;
          change('error', reason);
          attempt.finish('error');
        }
      }).then(function () {
        if (active === attempt) active = null;
      });
      change('pending');
      return attempt.decision;
    }

    function release() {
      if (!supported) return Promise.resolve('unsupported');
      var attempt = active;
      active = null;
      if (attempt) {
        attempt.finish('viewer');
        if (attempt.releaseHold) attempt.releaseHold();
        releasing = attempt.request;
      }
      change('viewer');
      return releasing.then(function () { return state; });
    }

    return {
      getState: function () { return state; },
      getError: function () { return error; },
      start: start,
      retry: start,
      release: release
    };
  }

  return { LOCK_NAME: LOCK_NAME, create: create };
});
