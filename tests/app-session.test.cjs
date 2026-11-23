'use strict';
// Simulated DOM integration tests, using Node built-ins only.
// These execute the actual classic scripts and event handlers; they do not
// constitute browser, CSS/layout, native dialog, download, or file:// testing.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../js/core.js');
require('../js/rules-data.js');
const R = globalThis.QURI_RULES;
const root = path.join(__dirname, '..');

const decode = text => String(text).replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, entity => ({
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'"
})[entity]);
const encode = text => String(text).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function simulatedDOM() {
  const errors = [], downloads = [];
  let document;
  class Node {
    constructor(tag, text = '') {
      this.tagName = tag.toUpperCase(); this.rawText = text; this.attrs = {}; this.childNodes = []; this.parentNode = null;
      this.events = {}; this.style = {}; this._value = undefined; this._checked = undefined; this.open = false;
      this.dataset = new Proxy({}, {
        get: (_, key) => this.getAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase())),
        set: (_, key, value) => { this.setAttribute('data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase()), value); return true; }
      });
      this.classList = {
        add: (...names) => { this.className = [...new Set(this.className.split(/\s+/).filter(Boolean).concat(names))].join(' '); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
        contains: name => this.className.split(/\s+/).includes(name),
        toggle: (name, force) => {
          const add = force === undefined ? !this.classList.contains(name) : force;
          this.classList[add ? 'add' : 'remove'](name); return add;
        }
      };
    }
    get children() { return this.childNodes.filter(node => node.tagName !== '#TEXT'); }
    get parentElement() { return this.parentNode; }
    get isConnected() { return this === document?.body || Boolean(this.parentNode?.isConnected); }
    get id() { return this.getAttribute('id') || ''; }
    set id(value) { this.setAttribute('id', value); }
    get className() { return this.getAttribute('class') || ''; }
    set className(value) { this.setAttribute('class', value); }
    get type() { return this.getAttribute('type') || ''; }
    get name() { return this.getAttribute('name') || ''; }
    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value) { value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }
    get hidden() { return this.hasAttribute('hidden'); }
    set hidden(value) { value ? this.setAttribute('hidden', '') : this.removeAttribute('hidden'); }
    get checked() { return this._checked === undefined ? this.hasAttribute('checked') : this._checked; }
    set checked(value) { this._checked = Boolean(value); }
    get value() {
      if (this._value !== undefined) return this._value;
      if (this.tagName === 'TEXTAREA') return this.textContent;
      if (this.tagName === 'SELECT') {
        const options = this.querySelectorAll('option');
        return (options.find(option => option.hasAttribute('selected')) || options[0])?.value || '';
      }
      return this.getAttribute('value') || '';
    }
    set value(value) { this._value = String(value); }
    get textContent() { return this.tagName === '#TEXT' ? this.rawText : this.childNodes.map(node => node.textContent).join(''); }
    set textContent(value) { this.childNodes = []; this.appendChild(new Node('#text', String(value))); }
    get innerHTML() { return this.childNodes.map(node => node.outerHTML).join(''); }
    set innerHTML(value) { this.childNodes.forEach(node => { node.parentNode = null; }); this.childNodes = []; parse(String(value), this); }
    get outerHTML() {
      if (this.tagName === '#TEXT') return encode(this.rawText);
      const tag = this.tagName.toLowerCase(), attrs = Object.entries(this.attrs).map(([name, value]) => ' ' + name + '="' + encode(value) + '"').join('');
      return '<' + tag + attrs + '>' + (voidTags.has(tag) ? '' : this.innerHTML + '</' + tag + '>');
    }
    set outerHTML(value) {
      const parent = this.parentNode, index = parent.childNodes.indexOf(this), fragment = new Node('fragment');
      parse(String(value), fragment);
      fragment.childNodes.forEach(node => { node.parentNode = parent; });
      parent.childNodes.splice(index, 1, ...fragment.childNodes); this.parentNode = null;
    }
    setAttribute(name, value) { this.attrs[name] = String(value); }
    getAttribute(name) { return Object.hasOwn(this.attrs, name) ? this.attrs[name] : null; }
    hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    removeAttribute(name) { delete this.attrs[name]; }
    appendChild(node) { node.parentNode = this; this.childNodes.push(node); return node; }
    remove() { if (this.parentNode) { this.parentNode.childNodes = this.parentNode.childNodes.filter(node => node !== this); this.parentNode = null; } }
    querySelectorAll(selector) {
      const found = [];
      const visit = node => node.children.forEach(child => { if (matches(child, selector)) found.push(child); visit(child); });
      visit(this); return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    closest(selector) { for (let node = this; node; node = node.parentNode) if (matches(node, selector)) return node; return null; }
    contains(other) { for (let node = other; node; node = node.parentNode) if (node === this) return true; return false; }
    focus() { document.activeElement = this; }
    scrollIntoView() {}
    addEventListener(type, listener) { (this.events[type] ||= []).push(listener); }
    showModal() { this.open = true; }
    close() { this.open = false; }
    reportValidity() { return this.querySelectorAll('[required]').every(field => Boolean(field.value.trim())); }
    click() {
      if (this.tagName === 'A' && this.download) downloads.push({ name: this.download, url: this.href });
      dispatch('click', this);
    }
  }
  function simpleMatch(node, selector) {
    let rest = selector.replace(/\\(.)/g, '$1');
    const tag = rest.match(/^[a-zA-Z][\w-]*/);
    if (tag) { if (node.tagName !== tag[0].toUpperCase()) return false; rest = rest.slice(tag[0].length); }
    const pattern = /([#.])([\w:-]+)|\[([^\]=\s]+)(?:\s*=\s*["']?([^\]"']*)["']?)?\]/g;
    let match;
    while ((match = pattern.exec(rest))) {
      if (match[1] === '#' && node.id !== match[2]) return false;
      if (match[1] === '.' && !node.classList.contains(match[2])) return false;
      if (match[3] && (!node.hasAttribute(match[3]) || (match[4] !== undefined && node.getAttribute(match[3]) !== match[4]))) return false;
    }
    return rest.replace(pattern, '').trim() === '';
  }
  function matches(node, selector) {
    return selector.split(',').some(part => {
      const chain = part.trim().split(/\s+(?![^\[]*\])/);
      if (!simpleMatch(node, chain.pop())) return false;
      let ancestor = node.parentNode;
      while (chain.length) {
        const previous = chain.pop();
        while (ancestor && !simpleMatch(ancestor, previous)) ancestor = ancestor.parentNode;
        if (!ancestor) return false;
        ancestor = ancestor.parentNode;
      }
      return true;
    });
  }
  function parse(html, parent) {
    const stack = [parent];
    for (const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || []) {
      if (/^<!/.test(token)) continue;
      if (/^<\//.test(token)) { if (stack.length > 1) stack.pop(); continue; }
      if (!token.startsWith('<')) { stack.at(-1).appendChild(new Node('#text', decode(token))); continue; }
      const head = token.match(/^<([\w-]+)/); if (!head) continue;
      const node = new Node(head[1]);
      const attrs = token.slice(head[0].length).replace(/\/?\s*>$/, '');
      for (const match of attrs.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/g)) {
        node.setAttribute(match[1], decode(match[2] ?? match[3] ?? match[4] ?? ''));
      }
      stack.at(-1).appendChild(node);
      if (!voidTags.has(head[1].toLowerCase()) && !/\/>$/.test(token)) stack.push(node);
    }
  }
  function dispatch(type, target, extra = {}) {
    const event = { type, target, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extra };
    for (const listener of [...(target.events?.[type] || []), ...(document.events[type] || [])]) {
      try { Promise.resolve(listener(event)).catch(error => errors.push(error)); } catch (error) { errors.push(error); }
    }
    return event;
  }
  document = {
    body: new Node('body'), events: {}, activeElement: null, hidden: false, title: '', currentScript: null,
    querySelector(selector) { return this.body.querySelector(selector); },
    querySelectorAll(selector) { return this.body.querySelectorAll(selector); },
    getElementById(id) { return this.querySelectorAll('[id]').find(node => node.id === id) || null; },
    createElement(tag) { return new Node(tag); },
    addEventListener(type, listener) { (this.events[type] ||= []).push(listener); }
  };
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
  return { document, dispatch, downloads, errors };
}

function makeStorage(workspace) {
  const map = new Map();
  if (workspace) map.set(C.STORAGE_KEY, JSON.stringify(workspace));
  return {
    map, readError: null, writeError: null,
    getItem(key) { if (this.readError) throw this.readError; return map.get(key) ?? null; },
    setItem(key, value) { if (this.writeError) throw this.writeError; map.set(key, String(value)); },
    removeItem(key) { map.delete(key); }
  };
}

function session({ storage = makeStorage(), hash = '#dashboard', unavailable = false } = {}) {
  const dom = simulatedDOM(), timers = new Map(), events = {}, blobs = new Map();
  let clock = 0, timerId = 0, currentHash = hash, blobId = 0;
  const setTimeout = (callback, delay = 0) => { const id = ++timerId; timers.set(id, { callback, at: clock + delay }); return id; };
  function advance(ms = 0) {
    const target = clock + ms; let count = 0;
    while (true) {
      const due = [...timers].filter(([, task]) => task.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      assert.ok(count++ < 1000, 'simulated timer loop exceeded limit');
      timers.delete(due[0]); clock = due[1].at; due[1].callback();
    }
    clock = target;
  }
  class TestURL extends URL {
    static createObjectURL(blob) { const url = 'blob:simulated-' + (++blobId); blobs.set(url, blob); return url; }
    static revokeObjectURL(url) { blobs.delete(url); }
  }
  const context = {
    document: dom.document, console, URL: TestURL, Blob,
    setTimeout, clearTimeout: id => timers.delete(id),
    CSS: { escape: value => String(value).replace(/[^\w-]/g, character => '\\' + character) },
    FormData: class {
      constructor(form) { this.values = form.querySelectorAll('input,select,textarea').filter(field => field.name && !field.disabled).map(field => [field.name, field.value]); }
      entries() { return this.values[Symbol.iterator](); }
    },
    history: { replaceState(_, __, value) { currentHash = value; } },
    location: {
      get hash() { return currentHash; },
      set hash(value) { const next = value.startsWith('#') ? value : '#' + value; if (next !== currentHash) { currentHash = next; setTimeout(() => (events.hashchange || []).forEach(listener => listener()), 0); } }
    },
    addEventListener(type, listener) { (events[type] ||= []).push(listener); },
    matchMedia() { return { matches: false, addEventListener() {} }; },
    scrollTo() {}, print() {},
    fetch() { throw Error('Unexpected network call in offline app'); }
  };
  Object.defineProperty(context, 'localStorage', { get() { if (unavailable) throw Object.assign(new Error('Storage unavailable'), { name: 'SecurityError' }); return storage; } });
  context.window = context;
  vm.createContext(context);
  for (const file of ['rules-data.js', 'core.js', 'guided-flow.js', 'quri-sprite.js', 'app.js']) {
    dom.document.currentScript = { src: 'file:///simulated-checklist/js/' + file };
    vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context, { filename: file });
  }
  async function settle() {
    for (let turn = 0; turn < 8; turn++) { advance(); await Promise.resolve(); }
    assert.deepEqual(dom.errors, []);
    assert.doesNotMatch(dom.document.querySelector('#toast')?.textContent || '', /^작업 중 오류가 발생했습니다\./);
  }
  function el(selector) { const element = dom.document.querySelector(selector); assert.ok(element, 'Missing simulated DOM element: ' + selector); return element; }
  return {
    ...dom, storage, context, blobs, advance, settle, el,
    workspace() { return JSON.parse(storage.map.get(C.STORAGE_KEY)); },
    async click(selector) { const element = el(selector); assert.equal(element.disabled, false, 'Cannot activate disabled button'); dom.dispatch('click', element); await settle(); },
    async input(selector, value, eventType = 'input') { const element = el(selector); if (element.type === 'checkbox') element.checked = value; else element.value = value; dom.dispatch(eventType, element); await settle(); },
    async submit(selector) { dom.dispatch('submit', el(selector)); await settle(); },
    async route(value) { context.location.hash = value; await settle(); },
    async backup() { await this.click('[data-action="backup-all"]'); const file = dom.downloads.at(-1); assert.ok(file); return JSON.parse(await blobs.get(file.url).text()); }
  };
}

test('simulated DOM: 실제 classic scripts가 저장소와 대시보드를 초기화한다', () => {
  const app = session();
  assert.match(app.el('#view').textContent, /심사/);
  assert.equal(typeof app.context.QuriFlow.next, 'function');
  assert.equal(app.el('#quick-start').querySelectorAll('input').length, 1);
  assert.equal(app.document.querySelector('#form-examiner'), null);
  assert.deepEqual(app.errors, []);
});

async function start(app, number = '1020260004321', type = 'notice') {
  await app.input('#application-number', number);
  await app.submit('#quick-start');
  if (type) await app.click('[data-action="choose-type"][data-type="' + type + '"]');
}
const currentItem = app => app.el('#checklist-main').querySelector('[data-item]')?.dataset.item;
function legacyWorkspace(overrides = {}) {
  const workspace = C.blankWorkspace();
  workspace.settings.name = '이전 기본 표시명';
  const c = C.createCase({ applicationNo: '10-2026-0004321', examiner: '이전 심사관 기록', title: '합성 이전 심사건', ...overrides });
  workspace.cases.push(c); return workspace;
}

test('simulated DOM: 출원번호만 제출하고 문서를 선택하며 중복 제출·동일 번호는 기존 건을 재개한다', async () => {
  const app = session();
  await app.input('#application-number', '잘못된번호');
  await app.submit('#quick-start');
  assert.equal(app.storage.map.has(C.STORAGE_KEY), false);
  assert.equal(app.el('#start-error').hidden, false);
  assert.equal(app.el('#application-number').getAttribute('aria-invalid'), 'true');
  await app.input('#application-number', '1020260004321');
  const form = app.el('#quick-start');
  app.dispatch('submit', form); app.dispatch('submit', form); await app.settle();
  let record = app.workspace().cases[0];
  assert.equal(app.workspace().cases.length, 1);
  assert.equal(record.applicationNo, '10-2026-0004321');
  assert.equal(record.examiner, ''); assert.equal(record.title, '');
  assert.equal(app.document.querySelectorAll('[data-action="choose-type"]').length, 4);
  assert.equal(app.document.querySelector('.check-card'), null);
  await app.click('[data-action="choose-type"][data-type="rejection"]');
  record = app.workspace().cases[0];
  assert.equal(record.type, 'rejection');
  assert.equal(currentItem(app), 'PREP-01');
  const id = record.id;
  await app.route('#dashboard');
  await start(app, '10-2026-0004321', null);
  assert.equal(app.workspace().cases.length, 1);
  assert.equal(app.context.location.hash, '#case/' + id);
  assert.equal(app.workspace().cases[0].type, 'rejection');
  assert.equal(app.document.querySelector('[data-action="choose-type"]'), null);
});

test('simulated DOM: 필수 근거 없는 다음 이동은 막고 나중에 확인·재개 위치를 보존한다', async () => {
  const app = session(); await start(app);
  assert.equal(currentItem(app), 'PREP-01');
  await app.click('[data-action="item-status"][data-id="PREP-01"][data-status="pass"]');
  assert.equal(app.el('[data-response-field="evidence"]').getAttribute('aria-required'), 'true');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-01');
  assert.equal(app.document.activeElement.dataset.responseField, 'evidence');
  await app.input('[data-response-field="evidence"]', '합성 문서 1쪽 · 청구항 1');
  app.advance(350); await app.settle();
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-02');
  assert.equal(app.document.activeElement.id, 'current-question');
  await app.click('[data-action="guided-defer"]');
  assert.equal(currentItem(app), 'PREP-03');
  const c = app.workspace().cases[0], p = C.progress(c, R, true);
  assert.equal(c.responses['PREP-01'].evidence, '합성 문서 1쪽 · 청구항 1');
  assert.ok(p.blockers.some(block => block.itemId === 'PREP-02'));
  assert.equal(c.responses['PREP-02'], undefined);
  const reopened = session({ storage: app.storage, hash: '#case/' + c.id });
  assert.equal(currentItem(reopened), 'PREP-03');
  await reopened.click('[data-action="category"][data-category="review"]');
  assert.ok(reopened.el('#checklist-main').querySelector('[data-action="jump-item"][data-id="PREP-02"]'));
  assert.equal(reopened.el('#final-ack').disabled, true);
});

test('simulated DOM: 문서 선택 전 새로고침해도 미선택 화면을 재개하고 선택 후 해당 유형을 저장한다', async () => {
  const app = session(); await start(app, '2020260004321', null);
  const c = app.workspace().cases[0];
  const reopened = session({ storage: app.storage, hash: '#case/' + c.id });
  assert.equal(reopened.document.querySelectorAll('[data-action="choose-type"]').length, 4);
  assert.equal(reopened.document.querySelector('.check-card'), null);
  await reopened.click('[data-action="choose-type"][data-type="registration"]');
  assert.equal(reopened.workspace().cases[0].type, 'registration');
  assert.equal(currentItem(reopened), 'PREP-01');
  assert.equal(C.progress(reopened.workspace().cases[0], R, true).total, 59);
});

test('simulated DOM: 재개 위치가 없는 백업에서도 문서 미선택 상태를 복원하고 확인한 유형은 유지한다', async () => {
  const app = session(); await start(app, '1020260004321', null);
  const backup = await app.backup(), imported = C.decodeBackup(JSON.stringify(backup)), c = imported.cases[0];
  assert.equal(imported.schemaVersion, 1);
  const restored = session({ storage: makeStorage(imported), hash: '#case/' + c.id });
  assert.equal(restored.document.querySelectorAll('[data-action="choose-type"]').length, 4);
  assert.equal(restored.document.querySelector('.check-card'), null);
  await restored.click('[data-action="choose-type"][data-type="final"]');
  restored.storage.removeItem('quri.examiner.cursor.v1');
  const confirmed = session({ storage: restored.storage, hash: '#case/' + c.id });
  assert.equal(confirmed.document.querySelector('[data-action="choose-type"]'), null);
  assert.equal(confirmed.workspace().cases[0].type, 'final');
  assert.equal(currentItem(confirmed), 'PREP-01');
});

test('simulated DOM: 본문 바로가기는 출원 경로와 점검 위치를 유지하면서 본문에 초점을 둔다', async () => {
  const app = session(); await start(app);
  await app.click('[data-action="guided-defer"]');
  const hash = app.context.location.hash, cursor = app.storage.map.get('quri.examiner.cursor.v1');
  const event = app.dispatch('click', app.el('.skip-link')); await app.settle();
  assert.equal(event.defaultPrevented, true);
  assert.equal(app.context.location.hash, hash);
  assert.equal(currentItem(app), 'PREP-02');
  assert.equal(app.document.activeElement.id, 'view');
  assert.equal(app.storage.map.get('quri.examiner.cursor.v1'), cursor);
});

test('simulated DOM: 근거와 보완 입력에 맞춰 항목·청구항 표시와 접근성 상태를 갱신한다', async () => {
  const app = session(); await start(app);
  const dot = () => app.el('.item-dot[data-id="PREP-01"]');
  assert.match(dot().getAttribute('aria-label'), /미확인$/);
  await app.click('[data-action="item-status"][data-status="pass"]');
  assert.equal(dot().classList.contains('ready'), false);
  await app.input('[data-response-field="evidence"]', '합성 확인 문서 1쪽');
  app.advance(200); await app.settle();
  assert.equal(dot().textContent, '✓');
  assert.match(dot().getAttribute('aria-label'), /기록 완료$/);
  await app.input('[data-response-field="evidence"]', '');
  app.advance(200); await app.settle();
  assert.equal(dot().classList.contains('ready'), false);
  assert.equal(dot().textContent, '1');
  assert.doesNotMatch(dot().getAttribute('aria-label'), /기록 완료/);

  const workspace = legacyWorkspace({ claimCount: 1 }), c = workspace.cases[0];
  for (const item of C.applicableItems(c, R)) c.responses[item.id] = { ...C.blankResponse(), status: 'pass', evidence: '합성 확인 근거' };
  const claims = session({ storage: makeStorage(workspace), hash: '#case/' + c.id });
  await claims.click('[data-action="claim-status"][data-status="issue"]');
  assert.match(claims.el('.claim-pill').getAttribute('aria-label'), /보완필요$/);
  await claims.input('[data-claim-field="memo"]', '합성 발견 내용');
  await claims.input('[data-claim-field="evidence"]', '합성 문서 청구항 1');
  await claims.input('[data-claim-field="action"]', '합성 조치 내용');
  await claims.input('[data-claim-field="resolved"]', true);
  claims.advance(200); await claims.settle();
  assert.match(claims.el('.claim-pill').getAttribute('aria-label'), /기록 완료$/);
  assert.equal(claims.el('.claim-pill small').textContent, '기록 완료');
});

test('simulated DOM: 전체 애니메이션 정지는 항목 이동 후 유지되고 같은 화면에서 다시 재생된다', async () => {
  const app = session(); await start(app);
  assert.equal(app.el('#quri-guide .quri-sprite').dataset.quriPlaying, 'true');
  await app.click('[data-action="toggle-motion"]');
  assert.equal(app.workspace().settings.reduceMotion, true);
  assert.equal(app.el('#quri-guide .quri-sprite').dataset.quriPlaying, 'false');
  await app.click('[data-action="guided-defer"]');
  assert.equal(app.el('#quri-guide .quri-sprite').dataset.quriPlaying, 'false');
  assert.equal(app.el('[data-action="toggle-motion"]').getAttribute('aria-pressed'), 'true');
  await app.click('[data-action="toggle-motion"]');
  assert.equal(app.workspace().settings.reduceMotion, false);
  assert.equal(app.el('#quri-guide .quri-sprite').dataset.quriPlaying, 'true');
  assert.equal(app.el('[data-action="toggle-motion"]').getAttribute('aria-pressed'), 'false');
});

test('simulated DOM: 해당없음 사유와 보완 네 요건을 개별 표시하고 모두 충족해야 이동한다', async () => {
  const app = session(); await start(app);
  await app.click('[data-action="item-status"][data-status="na"]');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-01');
  assert.equal(app.document.activeElement.dataset.responseField, 'memo');
  await app.input('[data-response-field="memo"]', '합성 해당없음 사유');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-02');
  await app.click('[data-action="item-status"][data-status="issue"]');
  const missing = app.el('[data-feedback="PREP-02"]').querySelectorAll('[data-action="focus-missing"]');
  assert.deepEqual(missing.map(button => button.dataset.kind).sort(), ['action', 'evidence', 'issue', 'reason']);
  await app.input('[data-response-field="memo"]', '합성 발견 내용');
  await app.input('[data-response-field="evidence"]', '합성 보정서 2쪽');
  await app.input('[data-response-field="action"]', '합성 보완 처리 결과');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-02');
  assert.equal(app.document.activeElement.dataset.responseField, 'resolved');
  await app.input('[data-response-field="resolved"]', true);
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-03');
  const response = app.workspace().cases[0].responses['PREP-02'];
  assert.equal(response.status, 'issue'); assert.equal(response.resolved, true);
  assert.equal(C.progress(app.workspace().cases[0], R, true).unresolved, 0);
});

test('simulated DOM: 전체 보기에서 수정한 항목에 큐리 안내와 한 항목 보기 위치가 함께 맞춰진다', async () => {
  const app = session(); await start(app);
  await app.click('[data-action="view-mode"][data-mode="overview"]');
  await app.click('[data-action="item-status"][data-id="PREP-02"][data-status="issue"]');
  assert.match(app.el('.coach-title').textContent, /보완/);
  assert.equal(app.el('#quri-guide .quri-sprite').dataset.quriState, 'decision');
  await app.click('[data-action="view-mode"][data-mode="guided"]');
  assert.equal(currentItem(app), 'PREP-02');
});

test('simulated DOM: 기존 이름·숨겨진 기록은 추가 정보 수정과 유형 변경 후에도 유지한다', async () => {
  const workspace = legacyWorkspace({ type: 'registration', claimCount: 3 }), c = workspace.cases[0];
  const registrationOnly = C.applicableItems(c, R).find(item => !item.appliesTo.includes('notice'));
  c.responses[registrationOnly.id] = { ...C.blankResponse(), status: 'na', memo: '이전 등록 검토 기록' };
  c.claimReviews['3'] = { ...C.blankResponse(), status: 'issue', memo: '이전 청구항별 기록' };
  const app = session({ storage: makeStorage(workspace), hash: '#case/' + c.id });
  await app.click('[data-action="edit-case"]');
  assert.equal(app.document.querySelector('#form-examiner'), null);
  await app.input('#form-title', '수정한 합성 명칭');
  await app.input('#form-type', 'notice', 'change');
  await app.input('#form-claims', '1');
  await app.submit('#case-form');
  const saved = app.workspace();
  assert.equal(saved.settings.name, '이전 기본 표시명');
  assert.equal(saved.cases[0].examiner, '이전 심사관 기록');
  assert.equal(saved.cases[0].title, '수정한 합성 명칭');
  assert.equal(saved.cases[0].type, 'notice');
  assert.equal(saved.cases[0].claimCount, 1);
  assert.deepEqual(saved.cases[0].responses[registrationOnly.id], c.responses[registrationOnly.id]);
  assert.deepEqual(saved.cases[0].claimReviews['3'], c.claimReviews['3']);
  assert.equal(app.el('#app-dialog').open, false);
});

test('simulated DOM: 마지막 관점 이후 청구항을 이어 확인하고 최종 확인 체크 후에만 완료한다', async () => {
  const workspace = legacyWorkspace({ claimCount: 2 }), c = workspace.cases[0];
  for (const item of C.applicableItems(c, R)) c.responses[item.id] = { ...C.blankResponse(), status: 'pass', evidence: '합성 확인 근거' };
  const app = session({ storage: makeStorage(workspace), hash: '#case/' + c.id });
  assert.equal(currentItem(app), 'claim:1');
  await app.click('[data-action="guided-prev"]');
  assert.equal(currentItem(app), C.applicableItems(c, R).at(-1).id);
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'claim:1');
  await app.click('[data-action="claim-status"][data-status="pass"]');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'claim:2');
  await app.click('[data-action="claim-status"][data-status="na"]');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'claim:2');
  assert.equal(app.document.activeElement.dataset.claimField, 'memo');
  await app.input('[data-claim-field="memo"]', '합성 보정서에서 삭제된 청구항');
  await app.click('[data-action="guided-next"]');
  assert.equal(app.el('#final-ack').disabled, false);
  assert.equal(app.workspace().cases[0].completedAt, null);
  await app.click('[data-action="complete"]');
  assert.equal(app.workspace().cases[0].completedAt, null);
  assert.equal(app.document.activeElement.id, 'final-ack');
  await app.input('#final-ack', true);
  await app.click('[data-action="complete"]');
  assert.ok(app.workspace().cases[0].completedAt);
  assert.equal(C.progress(app.workspace().cases[0], R, true).blockers.length, 0);
  assert.equal(app.el('[data-action="edit-case"]').disabled, true);
});

test('simulated DOM: 완료·보관 건은 최종 확인으로 열리고 결과 입력을 잠근다', async () => {
  for (const kind of ['completed', 'archived']) {
    const workspace = legacyWorkspace(), c = workspace.cases[0];
    if (kind === 'completed') {
      for (const item of C.applicableItems(c, R)) c.responses[item.id] = { ...C.blankResponse(), status: 'pass', evidence: '합성 확인 근거' };
      c.completedAt = C.now();
    } else c.archived = true;
    const storage = makeStorage(workspace), before = storage.map.get(C.STORAGE_KEY);
    const app = session({ storage, hash: '#case/' + c.id });
    assert.equal(app.el('.category-nav [data-category="review"]').classList.contains('active'), true);
    assert.equal(app.el('[data-action="edit-case"]').disabled, true);
    assert.equal(app.el('[data-action="choose-type-screen"]').disabled, true);
    await app.click('[data-action="category"][data-category="preparation"]');
    const buttons = app.document.querySelectorAll('[data-action="item-status"]');
    assert.ok(buttons.length > 0); assert.ok(buttons.every(button => button.disabled));
    // Exercise the handler's lock guard independently of native disabled behavior.
    app.dispatch('click', buttons[0]); await app.settle();
    assert.equal(storage.map.get(C.STORAGE_KEY), before);
  }
});

test('simulated DOM: 자동 저장 불가 모드에서도 점검·이동·JSON 백업으로 기록을 보존한다', async () => {
  const app = session({ unavailable: true }); await start(app);
  assert.match(app.el('#save-state').textContent, /파일 백업 필요/);
  assert.equal(app.el('#storage-banner').hidden, false);
  await app.click('[data-action="item-status"][data-status="na"]');
  await app.input('[data-response-field="memo"]', '메모리 모드에서 작성한 합성 사유');
  await app.click('[data-action="guided-next"]');
  assert.equal(currentItem(app), 'PREP-02');
  const backup = await app.backup();
  assert.equal(backup.workspace.cases.length, 1);
  assert.equal(backup.workspace.cases[0].responses['PREP-01'].memo, '메모리 모드에서 작성한 합성 사유');
  assert.equal(app.storage.map.has(C.STORAGE_KEY), false);
});

test('simulated DOM: 저장 실패는 성공으로 표시하지 않으며 기존 저장본과 현재 작업 백업을 구분한다', async () => {
  const workspace = legacyWorkspace(), c = workspace.cases[0], storage = makeStorage(workspace);
  const app = session({ storage, hash: '#case/' + c.id });
  const original = storage.map.get(C.STORAGE_KEY);
  storage.writeError = Object.assign(new Error('Simulated full storage'), { name: 'QuotaExceededError' });
  await app.click('[data-action="item-status"][data-status="na"]');
  await app.input('[data-response-field="memo"]', '저장 실패 중에도 남긴 합성 사유');
  app.advance(350); await app.settle();
  assert.match(app.el('#save-state').textContent, /자동 저장 확인 필요/);
  assert.equal(app.el('#storage-banner').hidden, false);
  assert.equal(storage.map.get(C.STORAGE_KEY), original);
  const backup = await app.backup();
  assert.equal(backup.workspace.cases[0].responses['PREP-01'].memo, '저장 실패 중에도 남긴 합성 사유');
  assert.equal(storage.map.get(C.STORAGE_KEY), original);
});
