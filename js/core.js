/* QURI Examiner Checklist — original, dependency-free offline data model. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.QuriCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var APP_ID = 'quri-examiner-checklist';
  var SCHEMA_VERSION = 1;
  var STORAGE_KEY = 'quri.examiner.workspace.v1';
  var TYPES = ['notice', 'final', 'rejection', 'registration'];
  var STATUSES = ['pending', 'pass', 'issue', 'na'];
  var MAX_BACKUP_LENGTH = 32 * 1024 * 1024;
  var FORBIDDEN = ['__proto__', 'prototype', 'constructor'];
  var own = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };
  var now = function () { return new Date().toISOString(); };
  var uid = function () {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }
    return 'quri-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  };
  function fail(message) { throw new Error(message); }
  function object(value, label, allowed) {
    if (value === null || typeof value !== 'object' || Array.isArray(value) ||
        (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
      fail(label + ': 올바른 객체가 아닙니다.');
    }
    if (Object.getOwnPropertySymbols(value).length) fail(label + ': 허용되지 않는 키가 있습니다.');
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN.indexOf(key) !== -1 || (allowed && allowed.indexOf(key) === -1)) {
        fail(label + ': 허용되지 않는 항목(' + key.slice(0, 80) + ')이 있습니다.');
      }
    });
    return value;
  }
  function text(value, label, max, fallback) {
    if (value === undefined && fallback !== undefined) return fallback;
    if (typeof value !== 'string') fail(label + ': 문자열이어야 합니다.');
    if (value.length > max) fail(label + ': 최대 ' + max + '자까지 저장할 수 있습니다.');
    if (value.indexOf('\u0000') !== -1) fail(label + ': NUL 문자는 사용할 수 없습니다.');
    return value;
  }
  function bool(value, label, fallback) {
    if (value === undefined && fallback !== undefined) return fallback;
    if (typeof value !== 'boolean') fail(label + ': 참/거짓 값이어야 합니다.');
    return value;
  }
  function integer(value, label, min, max, fallback) {
    if (value === undefined && fallback !== undefined) return fallback;
    if (!Number.isSafeInteger(value) || value < min || value > max) fail(label + ': ' + min + '~' + max + ' 사이의 정수여야 합니다.');
    return value;
  }
  function choice(value, label, options, fallback) {
    if (value === undefined && fallback !== undefined) return fallback;
    if (options.indexOf(value) === -1) fail(label + ': 허용되지 않는 값입니다.');
    return value;
  }
  function timestamp(value, label) {
    text(value, label, 40);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) {
      fail(label + ': 올바른 일시가 아닙니다.');
    }
    return value;
  }
  function date(value, label) {
    text(value, label, 10);
    if (value === '') return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(label + ': YYYY-MM-DD 형식이어야 합니다.');
    var parsed = new Date(value + 'T00:00:00.000Z');
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail(label + ': 실제 달력 날짜가 아닙니다.');
    return value;
  }
  function identifier(value, label) {
    text(value, label, 120);
    if (!/^[a-zA-Z0-9_.:/-]+$/.test(value) || FORBIDDEN.indexOf(value) !== -1) fail(label + ': 올바른 식별자가 아닙니다.');
    return value;
  }
  function normalizeNumber(input) {
    if (typeof input === 'number' && Number.isSafeInteger(input)) input = String(input);
    if (typeof input !== 'string' || input.length > 50 || /[^0-9\s-]/.test(input)) {
      fail('출원번호는 숫자, 공백, 하이픈만 입력할 수 있습니다.');
    }
    var digits = input.replace(/[\s-]/g, '');
    if (!/^(10|20)\d{11}$/.test(digits)) fail('출원번호를 10-2026-0000001 또는 20-2026-0000001 형식의 13자리로 입력해 주세요.');
    return digits.slice(0, 2) + '-' + digits.slice(2, 6) + '-' + digits.slice(6);
  }
  function blankResponse() {
    return { status: 'pending', memo: '', evidence: '', claims: '', action: '', resolved: false, updatedAt: now() };
  }
  function blankWorkspace() {
    return {
      app: APP_ID, schemaVersion: SCHEMA_VERSION, revision: 0, updatedAt: now(),
      settings: { name: '', reduceMotion: false, strictEvidence: true }, cases: []
    };
  }
  function createCase(input) {
    object(input, '새 출원');
    var count = input.claimCount === undefined || input.claimCount === '' ? 0 : Number(input.claimCount);
    var at = now();
    return {
      id: uid(), applicationNo: normalizeNumber(input.applicationNo),
      title: text(input.title, '발명의 명칭', 500, '').trim(),
      examiner: text(input.examiner, '심사관 이름', 100, '').trim(),
      dueDate: date(input.dueDate === undefined ? '' : input.dueDate, '예정일'),
      type: choice(input.type, '점검 유형', TYPES, 'notice'),
      claimCount: integer(count, '청구항 수', 0, 200),
      createdAt: at, updatedAt: at, completedAt: null, archived: false,
      responses: {}, claimReviews: {}, notes: '', events: []
    };
  }
  function validateResponse(value, label) {
    object(value, label, ['status', 'memo', 'evidence', 'claims', 'action', 'resolved', 'updatedAt']);
    var result = {
      status: choice(value.status, label + ' 상태', STATUSES, 'pending'),
      memo: text(value.memo, label + ' 메모', 12000, ''),
      evidence: text(value.evidence, label + ' 근거', 12000, ''),
      claims: text(value.claims, label + ' 청구항', 1000, ''),
      action: text(value.action, label + ' 조치', 12000, ''),
      resolved: bool(value.resolved, label + ' 보완 완료', false),
      updatedAt: value.updatedAt === undefined ? '' : value.updatedAt
    };
    if (result.updatedAt !== '') timestamp(result.updatedAt, label + ' 수정 일시');
    if (result.status !== 'issue' && result.resolved) fail(label + ': 보완 완료 표시는 보완필요 항목에서만 사용할 수 있습니다.');
    return result;
  }
  function validateResponses(value, label, claims) {
    object(value, label);
    var keys = Object.keys(value);
    if (keys.length > (claims ? 200 : 2000)) fail(label + ': 항목 수가 제한을 초과했습니다.');
    var result = {};
    keys.forEach(function (key) {
      if (claims) {
        if (!/^[1-9]\d{0,2}$/.test(key) || Number(key) > 200) fail(label + ': 청구항 번호는 1~200 사이여야 합니다.');
      } else identifier(key, label + ' 항목 ID');
      result[key] = validateResponse(value[key], label + ' ' + key);
    });
    return result;
  }
  function validateEvents(value, label) {
    if (!Array.isArray(value) || value.length > 2000) fail(label + ': 이력은 최대 2,000건의 배열이어야 합니다.');
    return value.map(function (event) {
      object(event, label, ['id', 'at', 'type', 'message']);
      var out = {
        at: timestamp(event.at, label + ' 일시'),
        type: text(event.type, label + ' 종류', 80),
        message: text(event.message, label + ' 내용', 2000)
      };
      if (event.id !== undefined) out.id = identifier(event.id, label + ' ID');
      return out;
    });
  }
  function validateCase(value, index) {
    var label = '출원 ' + (index + 1);
    object(value, label, ['id', 'applicationNo', 'title', 'examiner', 'dueDate', 'type', 'claimCount', 'createdAt', 'updatedAt', 'completedAt', 'archived', 'responses', 'claimReviews', 'notes', 'events']);
    return {
      id: identifier(value.id, label + ' ID'),
      applicationNo: normalizeNumber(value.applicationNo),
      title: text(value.title, label + ' 명칭', 500, ''),
      examiner: text(value.examiner, label + ' 심사관', 100, ''),
      dueDate: date(value.dueDate === undefined ? '' : value.dueDate, label + ' 예정일'),
      type: choice(value.type, label + ' 유형', TYPES),
      claimCount: integer(value.claimCount, label + ' 청구항 수', 0, 200, 0),
      createdAt: timestamp(value.createdAt, label + ' 생성 일시'),
      updatedAt: timestamp(value.updatedAt, label + ' 수정 일시'),
      completedAt: value.completedAt === null || value.completedAt === undefined ? null : timestamp(value.completedAt, label + ' 완료 일시'),
      archived: bool(value.archived, label + ' 보관 여부', false),
      responses: validateResponses(value.responses === undefined ? {} : value.responses, label + ' 체크리스트', false),
      claimReviews: validateResponses(value.claimReviews === undefined ? {} : value.claimReviews, label + ' 청구항별 점검', true),
      notes: text(value.notes, label + ' 종합 메모', 40000, ''),
      events: validateEvents(value.events === undefined ? [] : value.events, label + ' 변경 이력')
    };
  }
  function validateWorkspace(value) {
    object(value, '작업 데이터', ['app', 'schemaVersion', 'revision', 'updatedAt', 'settings', 'cases']);
    if (value.app !== APP_ID) fail('이 앱에서 만든 작업 데이터가 아닙니다.');
    if (value.schemaVersion !== SCHEMA_VERSION) fail('지원하지 않는 데이터 버전입니다. 이 앱은 버전 ' + SCHEMA_VERSION + '을 지원합니다.');
    object(value.settings, '설정', ['name', 'reduceMotion', 'strictEvidence']);
    if (!Array.isArray(value.cases) || value.cases.length > 2000) fail('출원 목록은 최대 2,000건의 배열이어야 합니다.');
    var ids = new Set(), numbers = new Set();
    var cases = value.cases.map(function (entry, index) {
      var c = validateCase(entry, index);
      if (ids.has(c.id)) fail('서로 다른 출원에 중복 ID가 있습니다.');
      if (numbers.has(c.applicationNo)) fail('출원번호 ' + c.applicationNo + '가 중복되어 있습니다.');
      ids.add(c.id); numbers.add(c.applicationNo);
      return c;
    });
    return {
      app: APP_ID, schemaVersion: SCHEMA_VERSION,
      revision: integer(value.revision, '저장 버전', 0, Number.MAX_SAFE_INTEGER - 1),
      updatedAt: timestamp(value.updatedAt, '작업 데이터 수정 일시'),
      settings: {
        name: text(value.settings.name, '기본 심사관 이름', 100, ''),
        reduceMotion: bool(value.settings.reduceMotion, '애니메이션 줄이기', false),
        strictEvidence: bool(value.settings.strictEvidence, '핵심항목 근거 필수', true)
      }, cases: cases
    };
  }
  function applicableItems(c, rules) {
    if (!rules || !Array.isArray(rules.categories)) fail('진단기준을 불러오지 못했습니다. rules-data.js 파일을 확인해 주세요.');
    var result = [];
    rules.categories.forEach(function (category) {
      if (!Array.isArray(category.items)) fail('진단기준의 관점별 항목이 올바르지 않습니다.');
      category.items.forEach(function (item) {
        if (!Array.isArray(item.appliesTo) || item.appliesTo.indexOf(c.type) !== -1) {
          result.push(Object.assign({}, item, { categoryId: category.id, categoryTitle: category.title }));
        }
      });
    });
    return result;
  }
  function filled(value) { return typeof value === 'string' && value.trim().length > 0; }
  function progress(c, rules, strictEvidence) {
    if (strictEvidence === undefined) strictEvidence = true;
    var items = applicableItems(c, rules), blockers = [], categories = [], categoryMap = {};
    var out = { total: items.length, answered: 0, ready: 0, pending: 0, issues: 0, unresolved: 0,
      missingEvidence: 0, missingReasons: 0, claimPending: 0, claimTotal: c.claimCount || 0,
      claimAnswered: 0, claimReady: 0, claimIssues: 0, claimUnresolved: 0, percent: 0, blockers: blockers, categories: categories };
    function block(kind, item, message) {
      blockers.push({ kind: kind, itemId: item.id, categoryId: item.categoryId, title: item.title, message: message });
    }
    items.forEach(function (item) {
      var category = categoryMap[item.categoryId];
      if (!category) {
        category = { id: item.categoryId, total: 0, answered: 0, ready: 0, pending: 0, issues: 0, percent: 0 };
        categoryMap[item.categoryId] = category; categories.push(category);
      }
      category.total++;
      var response = c.responses && c.responses[item.id] || {};
      var status = response.status || 'pending', before = blockers.length;
      if (status === 'pending') {
        out.pending++; category.pending++;
        block('pending', item, '아직 확인하지 않았습니다. 점검 결과를 선택해 주세요.');
      } else {
        out.answered++; category.answered++;
        if (status === 'pass' && item.critical && strictEvidence && !filled(response.evidence)) {
          out.missingEvidence++;
          block('evidence', item, '핵심 점검항목입니다. 확인한 문서·쪽·청구항 등 근거를 기록해 주세요.');
        }
        if (status === 'na' && !filled(response.memo)) {
          out.missingReasons++;
          block('reason', item, '해당없음으로 판단한 사유를 기록해 주세요.');
        }
        if (status === 'issue') {
          out.issues++; category.issues++;
          var missingReason = false;
          if (!filled(response.memo)) { missingReason = true; block('reason', item, '발견한 보완사항을 메모에 기록해 주세요.'); }
          if (!filled(response.action)) { missingReason = true; block('action', item, '보완한 내용 또는 처리 결과를 기록해 주세요.'); }
          if (missingReason) out.missingReasons++;
          if (!filled(response.evidence)) {
            out.missingEvidence++;
            block('evidence', item, '보완사항을 확인할 수 있는 문서·쪽·청구항 등 근거를 기록해 주세요.');
          }
          if (response.resolved !== true) block('issue', item, '보완사항을 처리한 뒤 보완 완료를 표시해 주세요.');
          if (blockers.length > before) out.unresolved++;
        }
        if (STATUSES.indexOf(status) === -1) block('invalid', item, '점검 결과를 다시 선택해 주세요.');
      }
      if (blockers.length === before) { out.ready++; category.ready++; }
    });
    for (var n = 1; n <= (c.claimCount || 0); n++) {
      var r = c.claimReviews && c.claimReviews[String(n)] || {};
      var row = { id: 'claim:' + n, categoryId: 'claims', title: '청구항 ' + n };
      var beforeClaim = blockers.length;
      if (!r.status || r.status === 'pending') {
        out.claimPending++;
        block('claim-pending', row, '청구항 ' + n + '의 개별 점검 결과를 선택해 주세요.');
      } else {
        out.claimAnswered++;
        if (r.status === 'na' && !filled(r.memo)) {
          out.missingReasons++;
          block('claim-reason', row, '청구항 ' + n + '을 해당없음으로 판단한 사유를 기록해 주세요.');
        }
        if (r.status === 'issue') {
          out.issues++; out.claimIssues++;
          if (!filled(r.memo) || !filled(r.action)) out.missingReasons++;
          if (!filled(r.memo)) block('claim-reason', row, '청구항 ' + n + '의 보완사항을 기록해 주세요.');
          if (!filled(r.action)) block('claim-action', row, '청구항 ' + n + '의 보완 처리 결과를 기록해 주세요.');
          if (!filled(r.evidence)) {
            out.missingEvidence++;
            block('claim-evidence', row, '청구항 ' + n + '의 보완사항을 확인할 수 있는 문서·쪽 등 근거를 기록해 주세요.');
          }
          if (r.resolved !== true) block('claim-issue', row, '청구항 ' + n + '의 보완을 마치고 보완 완료를 표시해 주세요.');
          if (blockers.length > beforeClaim) { out.unresolved++; out.claimUnresolved++; }
        }
        if (STATUSES.indexOf(r.status) === -1) block('claim-invalid', row, '청구항별 점검 결과를 다시 선택해 주세요.');
      }
      if (blockers.length === beforeClaim) out.claimReady++;
    }
    categories.forEach(function (category) { category.percent = category.total ? Math.round(category.ready / category.total * 100) : 100; });
    out.percent = out.total ? Math.round(out.ready / out.total * 100) : 100;
    return out;
  }
  function encodeBackup(workspace) {
    var checked = validateWorkspace(workspace);
    return JSON.stringify({ format: 'quri-checklist-backup', version: 1, exportedAt: now(), workspace: checked }, null, 2);
  }
  function decodeBackup(contents) {
    if (typeof contents !== 'string' || contents.length > MAX_BACKUP_LENGTH) fail('백업 파일은 32 MiB 이하의 JSON 텍스트여야 합니다.');
    var parsed;
    try { parsed = JSON.parse(contents.replace(/^\uFEFF/, '')); } catch (_) { fail('백업 파일의 JSON 형식이 손상되었습니다. 원본 파일을 다시 선택해 주세요.'); }
    object(parsed, '백업 파일', ['format', 'version', 'exportedAt', 'workspace']);
    if (parsed.format !== 'quri-checklist-backup') fail('QURI 심사 체크리스트의 백업 파일이 아닙니다.');
    if (parsed.version !== 1) fail('지원하지 않는 백업 형식 버전입니다.');
    timestamp(parsed.exportedAt, '백업 생성 일시');
    return validateWorkspace(parsed.workspace);
  }
  function mergeWorkspaces(current, incoming) {
    var workspace = validateWorkspace(current), source = validateWorkspace(incoming);
    var numbers = new Set(workspace.cases.map(function (c) { return c.applicationNo; }));
    var ids = new Set(workspace.cases.map(function (c) { return c.id; }));
    var added = 0, skipped = 0;
    source.cases.forEach(function (c) {
      if (numbers.has(c.applicationNo)) { skipped++; return; }
      if (workspace.cases.length >= 2000) fail('합친 출원이 2,000건을 초과합니다. 일부 출원을 먼저 별도로 백업해 주세요.');
      if (ids.has(c.id)) c.id = uid();
      numbers.add(c.applicationNo); ids.add(c.id); workspace.cases.push(c); added++;
    });
    if (added) workspace.updatedAt = now();
    return { workspace: workspace, added: added, skipped: skipped };
  }
  function storageMessage(error) {
    if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      return '브라우저 저장 공간이 부족합니다. 현재 데이터를 백업 파일로 저장한 뒤 공간을 확보해 주세요.';
    }
    if (error && error.name === 'SecurityError') return '이 브라우저에서 파일의 자동 저장을 허용하지 않습니다. 백업 파일 저장 기능을 사용해 주세요.';
    return error && error.message ? error.message : '브라우저 저장소에 접근할 수 없습니다. 현재 데이터를 백업 파일로 저장해 주세요.';
  }
  function createStorage(storage) {
    function read() {
      if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') fail('브라우저 자동 저장을 사용할 수 없습니다. 백업 파일 저장 기능을 사용해 주세요.');
      return storage.getItem(STORAGE_KEY);
    }
    function load() {
      var raw = null;
      try {
        raw = read();
        if (raw === null) return { workspace: blankWorkspace(), recovery: false, error: null, raw: null };
        if (raw.length > MAX_BACKUP_LENGTH) fail('저장 데이터가 최대 크기를 초과했습니다.');
        var workspace = validateWorkspace(JSON.parse(raw));
        return { workspace: workspace, recovery: false, error: null, raw: raw };
      } catch (error) {
        return { workspace: blankWorkspace(), recovery: true, error: '기존 자동 저장 데이터를 읽을 수 없습니다. ' + storageMessage(error), raw: raw };
      }
    }
    function writeVerified(workspace, previousRaw, revision) {
      var next = validateWorkspace(workspace);
      next.revision = revision;
      next.updatedAt = now();
      var serialized = JSON.stringify(next);
      if (serialized.length > MAX_BACKUP_LENGTH) fail('작업 데이터가 최대 저장 크기를 초과했습니다. 일부 출원을 별도로 백업해 주세요.');
      storage.setItem(STORAGE_KEY, serialized);
      var after = read();
      if (after !== serialized) {
        return { ok: false, workspace: workspace, error: '저장 직후 데이터가 달라졌습니다. 다른 창의 변경 내용을 확인하고 현재 작업을 별도 백업해 주세요.', conflict: true };
      }
      return { ok: true, workspace: next, error: null, conflict: false };
    }
    function save(workspace, expectedRevision) {
      try {
        integer(expectedRevision, '예상 저장 버전', 0, Number.MAX_SAFE_INTEGER - 2);
        var raw = read(), currentRevision = 0;
        if (raw !== null) {
          var current;
          try { current = validateWorkspace(JSON.parse(raw)); }
          catch (_) { return { ok: false, workspace: workspace, error: '기존 저장 데이터가 손상되어 덮어쓰기를 중단했습니다. 원본을 보관하고 백업 파일로 복구해 주세요.', conflict: false, recovery: true }; }
          currentRevision = current.revision;
        }
        if (currentRevision !== expectedRevision) {
          return { ok: false, workspace: workspace, error: '다른 창 또는 다른 작업에서 데이터가 변경되었습니다. 현재 작업을 백업한 뒤 다시 불러와 주세요.', conflict: true };
        }
        return writeVerified(workspace, raw, expectedRevision + 1);
      } catch (error) {
        return { ok: false, workspace: workspace, error: storageMessage(error), conflict: false };
      }
    }
    function recover(workspace, expectedRaw) {
      try {
        if (expectedRaw !== null && typeof expectedRaw !== 'string') fail('복구하려는 기존 저장 원문을 확인할 수 없습니다.');
        var raw = read();
        if (raw !== expectedRaw) return { ok: false, workspace: workspace, error: '복구를 준비하는 동안 기존 데이터가 변경되었습니다. 다시 확인해 주세요.', conflict: true };
        var revision = 0;
        try { revision = validateWorkspace(JSON.parse(raw)).revision; } catch (_) { /* Explicit recovery can replace invalid JSON only after exact raw match. */ }
        return writeVerified(workspace, raw, revision + 1);
      } catch (error) {
        return { ok: false, workspace: workspace, error: storageMessage(error), conflict: false };
      }
    }
    return { load: load, save: save, recover: recover };
  }
  function escapeCsv(value) {
    var string = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@\t\r\n]/.test(string) || /^\s*[=+\-@]/.test(string)) string = "'" + string;
    return '"' + string.replace(/"/g, '""') + '"';
  }
  return {
    APP_ID: APP_ID, SCHEMA_VERSION: SCHEMA_VERSION, STORAGE_KEY: STORAGE_KEY,
    TYPES: TYPES.slice(), STATUSES: STATUSES.slice(), now: now, uid: uid,
    normalizeNumber: normalizeNumber, blankResponse: blankResponse, blankWorkspace: blankWorkspace,
    createCase: createCase, applicableItems: applicableItems, progress: progress,
    validateWorkspace: validateWorkspace, decodeBackup: decodeBackup, encodeBackup: encodeBackup,
    mergeWorkspaces: mergeWorkspaces, createStorage: createStorage, escapeCsv: escapeCsv
  };
});
