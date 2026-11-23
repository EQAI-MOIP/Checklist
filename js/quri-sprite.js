/* QURI Checklist: original, dependency-free local sprite player.
 * Art: EQAI-MOIP/AI_Reviewer, pinned source and hashes in assets/README.txt.
 * This file works as a classic script over file://; it makes no network calls.
 */
(function (root) {
  'use strict';
  var doc = root.document;
  if (!doc) return;
  var script = doc.currentScript;
  var assetRoot = script && script.src ? new URL('../assets/', script.src).href : 'assets/';
  var active = new Set();
  var sequence = [0, 1, 2, 3, 2, 1];
  var media = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var globalPaused = false;
  var states = {
    welcome: { row: 0, duration: 2800, label: '반갑게 인사하는 큐리' },
    review: { row: 1, duration: 3200, label: '확인할 항목을 알려 주는 큐리' },
    thinking: { row: 2, duration: 3600, label: '근거를 꼼꼼하게 살펴보는 큐리' },
    attention: { row: 2, duration: 0, label: '추가 확인이 필요한 항목을 안내하는 큐리' },
    success: { row: 3, duration: 3000, label: '점검 완료를 안내하는 큐리' },
    save: { row: 3, duration: 3000, label: '점검 기록의 보관을 안내하는 큐리' }
  };
  var poses = {
    welcome: [0, 0, '반갑게 인사하는 큐리'],
    upload: [1, 0, '점검 자료를 정리하는 큐리'],
    compare: [2, 0, '두 문서를 대조하는 큐리'],
    thoughtful: [0, 1, '확인할 근거를 살펴보는 큐리'],
    explain: [1, 1, '점검 방법을 설명하는 큐리'],
    complete: [2, 1, '체크리스트를 정리하는 큐리']
  };
  var perElement = new WeakMap();
  function label(el, value) {
    if (el.getAttribute('aria-hidden') !== 'true') {
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', value);
    }
  }
  function background(el, file, size) {
    el.style.backgroundImage = 'url("' + assetRoot + file + '")';
    el.style.backgroundSize = size;
    el.style.backgroundRepeat = 'no-repeat';
    el.style.aspectRatio = '1';
  }
  function Controller(el, options) {
    options = options || {};
    this.element = el;
    this.state = states[options.state] ? options.state : 'welcome';
    this.paused = Boolean(options.paused);
    this.visible = true;
    this.dead = false;
    this.timer = null;
    this.frame = 0;
    this.observer = null;
    background(el, 'quri-v3-motion-16frames.webp', '400% 400%');
    var self = this;
    if (typeof root.IntersectionObserver === 'function') {
      this.observer = new root.IntersectionObserver(function (entries) {
        if (self.dead) return;
        entries.forEach(function (entry) {
          if (entry.target === self.element) self.visible = entry.isIntersecting;
        });
        self.sync();
      }, { threshold: 0.01 });
      this.observer.observe(el);
    }
    active.add(this);
    perElement.set(el, this);
    this.sync();
  }
  Controller.prototype.paint = function () {
    var config = states[this.state];
    this.element.style.backgroundPosition = (sequence[this.frame] * 100 / 3) + '% ' + (config.row * 100 / 3) + '%';
    this.element.dataset.quriState = this.state;
    this.element.dataset.quriFrame = String(sequence[this.frame]);
    label(this.element, config.label);
  };
  Controller.prototype.canPlay = function () {
    return !this.dead && !this.paused && !globalPaused && !(media && media.matches) && !doc.hidden && this.visible && states[this.state].duration > 0;
  };
  Controller.prototype.sync = function () {
    if (this.dead) return;
    if (this.timer !== null) root.clearTimeout(this.timer);
    this.timer = null;
    if (this.paused || globalPaused || (media && media.matches) || states[this.state].duration === 0) this.frame = 0;
    this.paint();
    this.element.dataset.quriPlaying = String(this.canPlay());
    if (!this.canPlay()) return;
    var self = this;
    this.timer = root.setTimeout(function () {
      self.timer = null;
      if (self.dead) return;
      if (!self.element.isConnected) { self.destroy(); return; }
      if (self.canPlay()) self.frame = (self.frame + 1) % sequence.length;
      self.sync();
    }, states[this.state].duration / sequence.length);
  };
  Controller.prototype.setState = function (state) {
    if (this.dead || !states[state]) return this;
    if (this.state !== state) { this.state = state; this.frame = 0; }
    this.sync();
    return this;
  };
  Controller.prototype.setPaused = function (paused) {
    this.paused = Boolean(paused);
    this.sync();
    return this;
  };
  Controller.prototype.destroy = function () {
    if (this.dead) return;
    this.dead = true;
    if (this.timer !== null) root.clearTimeout(this.timer);
    this.timer = null;
    if (this.observer) this.observer.disconnect();
    this.element.dataset.quriPlaying = 'false';
    active.delete(this);
    perElement.delete(this.element);
  };
  function refresh() {
    active.forEach(function (controller) {
      if (!controller.element.isConnected) controller.destroy();
      else controller.sync();
    });
  }
  function attach(element, options) {
    if (!element || !element.style) throw new TypeError('QuriSprite.attach requires an HTML element.');
    var previous = perElement.get(element);
    if (previous) previous.destroy();
    return new Controller(element, options);
  }
  function pose(element, name) {
    if (!element || !element.style) throw new TypeError('QuriSprite.pose requires an HTML element.');
    var previous = perElement.get(element);
    if (previous) previous.destroy();
    var selected = poses[name] || poses.explain;
    background(element, 'quri-v2-guide-6frames.webp', '300% 200%');
    element.style.backgroundPosition = (selected[0] * 50) + '% ' + (selected[1] * 100) + '%';
    element.dataset.quriState = name;
    element.dataset.quriPlaying = 'false';
    label(element, selected[2]);
    return element;
  }
  doc.addEventListener('visibilitychange', refresh);
  if (media && media.addEventListener) media.addEventListener('change', refresh);
  else if (media && media.addListener) media.addListener(refresh);
  root.QuriSprite = Object.freeze({
    version: '1.0.0', attach: attach, pose: pose, refresh: refresh,
    setState: function (state) { active.forEach(function (item) { item.setState(state); }); },
    setPaused: function (paused) { globalPaused = Boolean(paused); refresh(); },
    destroy: function () { active.forEach(function (item) { item.destroy(); }); }
  });
})(typeof window !== 'undefined' ? window : globalThis);
