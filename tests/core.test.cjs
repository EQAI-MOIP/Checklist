'use strict';
// Run with: node --test tests/core.test.cjs
// Node is a development-test tool only; the delivered app requires no installation.
const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../js/core.js');

const rules = { categories: [
  { id: 'search', title: '선행기술', items: [
    { id: 'source', title: '인용문헌 확인', critical: true, appliesTo: ['notice', 'registration'] },
    { id: 'range', title: '검색범위 확인', critical: false, appliesTo: ['notice'] }
  ] },
  { id: 'document', title: '문서 작성', items: [
    { id: 'notice', title: '통지서 확인', critical: true, appliesTo: ['notice'] },
    { id: 'registered', title: '등록청구항 확인', critical: true, appliesTo: ['registration'] }
  ] }
] };
function makeCase(overrides) {
  return Core.createCase(Object.assign({ applicationNo: '1020260000001', title: '합성 시험용 발명' }, overrides));
}
function makeWorkspace() {
  const state = Core.blankWorkspace();
  state.cases.push(makeCase());
  return state;
}
function response(overrides) { return Object.assign(Core.blankResponse(), overrides); }
function memoryStorage() {
  const map = new Map();
  return {
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(k, String(v)); },
    removeItem(k) { map.delete(k); },
    map
  };
}

test('13자리 특허·실용신안 번호만 정규화하고 문자 혼입을 거부한다', () => {
  assert.equal(Core.normalizeNumber(' 10-2026-0000001 '), '10-2026-0000001');
  assert.equal(Core.normalizeNumber(2020260000001), '20-2026-0000001');
  assert.equal(Core.normalizeNumber('10 2026 0000001'), '10-2026-0000001');
  for (const bad of ['10-2026-000001', '30-2026-0000001', 'A1020260000001', '10/2026/0000001', '', null, '<script>', '10-2026-0000001e0']) {
    assert.throws(() => Core.normalizeNumber(bad));
  }
});

test('새 출원은 미확인 상태로 시작하고 불가능한 날짜·청구항 수를 거부한다', () => {
  const c = makeCase({ claimCount: '5', dueDate: '2028-02-29', title: '  명칭  ' });
  assert.equal(c.claimCount, 5);
  assert.equal(c.title, '명칭');
  assert.deepEqual(c.responses, {});
  assert.equal(c.completedAt, null);
  assert.throws(() => makeCase({ dueDate: '2026-02-29' }));
  assert.throws(() => makeCase({ claimCount: 201 }));
  assert.throws(() => makeCase({ claimCount: -1 }));
  assert.throws(() => makeCase({ claimCount: 1.3 }));
  assert.throws(() => makeCase({ type: 'unknown' }));
});

test('검토 유형에 해당하는 규칙만 집계하며 숨은 응답을 보존한다', () => {
  const c = makeCase({ type: 'registration' });
  c.responses.notice = response({ status: 'issue', memo: '이전 통지 단계의 기록' });
  assert.deepEqual(Core.applicableItems(c, rules).map(x => x.id), ['source', 'registered']);
  const p = Core.progress(c, rules);
  assert.equal(p.total, 2);
  assert.equal(p.issues, 0);
  assert.equal(c.responses.notice.memo, '이전 통지 단계의 기록');
});

test('미확인과 핵심항목 근거 누락은 완료를 막고 진척도를 부풀리지 않는다', () => {
  const c = makeCase();
  c.responses.source = response({ status: 'pass' });
  c.responses.range = response({ status: 'pass' });
  const p = Core.progress(c, rules);
  assert.equal(p.total, 3);
  assert.equal(p.answered, 2);
  assert.equal(p.ready, 1);
  assert.equal(p.pending, 1);
  assert.equal(p.missingEvidence, 1);
  assert.equal(p.percent, 33);
  assert.deepEqual(p.blockers.map(x => x.itemId), ['source', 'notice']);
  assert.equal(p.categories[0].ready, 1);
  assert.equal(Core.progress(c, rules, false).ready, 2);
});

test('해당없음에는 사유가 필요하며 공백만 입력한 사유는 인정하지 않는다', () => {
  const c = makeCase();
  c.responses.source = response({ status: 'na', memo: '  ' });
  assert.equal(Core.progress(c, rules).missingReasons, 1);
  c.responses.source.memo = '본 건에는 인용문헌이 없어 해당없음';
  assert.equal(Core.progress(c, rules).missingReasons, 0);
});

test('보완필요는 근거·메모·처리 내용·보완 완료를 모두 충족해야 종료된다', () => {
  const c = makeCase();
  c.responses.source = response({ status: 'issue' });
  let p = Core.progress(c, rules);
  assert.equal(p.issues, 1);
  assert.equal(p.unresolved, 1);
  assert.equal(p.missingEvidence, 1);
  assert.equal(p.blockers.filter(x => x.itemId === 'source').length, 4);
  c.responses.source = response({ status: 'issue', memo: '문헌 번호 불일치', evidence: '통지서 3쪽·인용문헌 표지', action: '원문과 대조하여 번호 수정', resolved: true });
  p = Core.progress(c, rules);
  assert.equal(p.issues, 1); // 기록을 삭제하거나 pass로 바꾸지 않는다.
  assert.equal(p.unresolved, 0);
  assert.equal(p.ready, 1);
  assert.equal(p.blockers.filter(x => x.itemId === 'source').length, 0);
});

test('모든 체크항목과 개별 청구항을 마쳐야 전체 blockers가 비어 있다', () => {
  const c = makeCase({ claimCount: 2 });
  for (const item of Core.applicableItems(c, rules)) c.responses[item.id] = response({ status: 'pass', evidence: '확인 문서 1쪽' });
  let p = Core.progress(c, rules);
  assert.equal(p.ready, 3);
  assert.equal(p.claimPending, 2);
  assert.equal(p.blockers.length, 2);
  c.claimReviews['1'] = response({ status: 'pass' });
  c.claimReviews['2'] = response({ status: 'issue', memo: '용어 불명확', evidence: '보정서 1쪽', action: '용어 정리', resolved: false });
  p = Core.progress(c, rules);
  assert.equal(p.claimPending, 0);
  assert.equal(p.claimReady, 1);
  assert.equal(p.blockers[0].kind, 'claim-issue');
  c.claimReviews['2'].resolved = true;
  p = Core.progress(c, rules);
  assert.equal(p.blockers.length, 0);
  assert.equal(p.claimReady, 2);
});

test('청구항 보완 완료 표시가 있어도 보완 근거가 없으면 완료되지 않는다', () => {
  const c = makeCase({ claimCount: 1 });
  c.claimReviews['1'] = response({ status: 'issue', memo: '구성 불명확', action: '구성 명확화', resolved: true });
  let p = Core.progress(c, rules);
  assert.equal(p.claimReady, 0);
  assert.equal(p.missingEvidence, 1);
  assert.equal(p.unresolved, 1);
  assert.equal(p.claimUnresolved, 1);
  assert.equal(p.issues, 1);
  assert.ok(p.blockers.some(b => b.kind === 'claim-evidence' && b.itemId === 'claim:1'));
  c.claimReviews['1'].evidence = '최종 보정서 2쪽·청구항 1';
  p = Core.progress(c, rules);
  assert.equal(p.claimReady, 1);
  assert.equal(p.unresolved, 0);
  assert.equal(p.claimUnresolved, 0);
  assert.ok(!p.blockers.some(b => b.itemId === 'claim:1'));
});

test('알 수 없는 상태를 미확인 완료로 간주하지 않는다', () => {
  const c = makeCase();
  c.responses.source = { status: 'maybe' };
  assert.equal(Core.progress(c, rules).ready, 0);
  assert.equal(Core.progress(c, rules).blockers[0].kind, 'invalid');
});

test('한글·따옴표·줄바꿈 및 해결 이력은 백업 왕복에서 정확히 유지된다', () => {
  const w = makeWorkspace();
  w.settings.name = '합성 심사관';
  w.cases[0].notes = '검토 첫 줄\n"둘째 줄"과 Ω';
  w.cases[0].responses.source = response({ status: 'issue', memo: '이슈', evidence: '청구항 1', action: '조치 기록', resolved: true });
  w.cases[0].events.push({ at: Core.now(), type: 'check', message: '근거 확인 완료' });
  assert.deepEqual(Core.decodeBackup(Core.encodeBackup(w)), Core.validateWorkspace(w));
  assert.deepEqual(Core.decodeBackup('\uFEFF' + Core.encodeBackup(w)), Core.validateWorkspace(w));
  assert.throws(() => Core.decodeBackup(JSON.stringify(w)), /백업 파일/);
  assert.throws(() => Core.decodeBackup('깨진 JSON'), /손상/);
});

test('지원하지 않는 앱·데이터 버전·백업 버전을 조용히 초기화하지 않는다', () => {
  const w = makeWorkspace();
  assert.throws(() => Core.validateWorkspace({ ...w, app: 'other-app' }));
  assert.throws(() => Core.validateWorkspace({ ...w, schemaVersion: 2 }), /버전/);
  const envelope = JSON.parse(Core.encodeBackup(w));
  envelope.version = 9;
  assert.throws(() => Core.decodeBackup(JSON.stringify(envelope)), /버전/);
});

test('위험 키·미지의 필드·잘못된 타입을 포함한 백업을 거부한다', () => {
  const w = makeWorkspace();
  const poisoned = JSON.parse(JSON.stringify(w));
  poisoned.cases[0].responses = JSON.parse('{"__proto__":{"polluted":true}}');
  assert.throws(() => Core.validateWorkspace(poisoned), /허용되지 않는/);
  const unknown = JSON.parse(JSON.stringify(w));
  unknown.cases[0].serverUrl = 'https://example.invalid';
  assert.throws(() => Core.validateWorkspace(unknown), /허용되지 않는/);
  const badBool = JSON.parse(JSON.stringify(w));
  badBool.settings.strictEvidence = 'false';
  assert.throws(() => Core.validateWorkspace(badBool), /참\/거짓/);
  const badStatus = JSON.parse(JSON.stringify(w));
  badStatus.cases[0].responses.source = { status: 'maybe' };
  assert.throws(() => Core.validateWorkspace(badStatus), /허용되지 않는 값/);
  assert.equal({}.polluted, undefined);
});

test('중복 출원·중복 ID·해결 표시의 잘못된 조합을 거부한다', () => {
  const w = makeWorkspace();
  w.cases.push({ ...makeCase(), id: 'another-id' });
  assert.throws(() => Core.validateWorkspace(w), /중복/);
  w.cases[1].applicationNo = '10-2026-0000002';
  w.cases[1].id = w.cases[0].id;
  assert.throws(() => Core.validateWorkspace(w), /중복 ID/);
  w.cases.pop();
  w.cases[0].responses.source = response({ status: 'pass', resolved: true });
  assert.throws(() => Core.validateWorkspace(w), /보완필요/);
});

test('응답 기본값을 채우되 원래 객체를 변경하지 않는다', () => {
  const w = makeWorkspace();
  w.cases[0].responses.source = { status: 'pass', evidence: '1쪽' };
  const out = Core.validateWorkspace(w);
  assert.equal(out.cases[0].responses.source.memo, '');
  assert.equal(out.cases[0].responses.source.updatedAt, '');
  assert.equal(w.cases[0].responses.source.memo, undefined);
  out.cases[0].title = '다른 값';
  assert.notEqual(out.cases[0].title, w.cases[0].title);
});

test('병합은 같은 출원번호를 덮어쓰지 않고 새로운 건만 추가한다', () => {
  const current = makeWorkspace();
  current.cases[0].notes = '현재 원본';
  const incoming = makeWorkspace();
  incoming.cases[0].notes = '가져온 충돌 내용';
  const added = makeCase({ applicationNo: '20-2026-0000002' });
  added.id = current.cases[0].id; // 새 출원이 기존 ID와 충돌해도 분리한다.
  incoming.cases.push(added);
  const result = Core.mergeWorkspaces(current, incoming);
  assert.equal(result.added, 1);
  assert.equal(result.skipped, 1);
  assert.equal(result.workspace.cases[0].notes, '현재 원본');
  assert.notEqual(result.workspace.cases[0].id, result.workspace.cases[1].id);
  assert.equal(current.cases.length, 1);
  assert.equal(incoming.cases[1].id, current.cases[0].id);
});

test('정상 저장은 재읽기 검증과 버전 증가 후에만 성공한다', () => {
  const store = Core.createStorage(memoryStorage());
  const loaded = store.load();
  assert.equal(loaded.recovery, false);
  const w = makeWorkspace();
  const result = store.save(w, loaded.workspace.revision);
  assert.equal(result.ok, true);
  assert.equal(result.workspace.revision, 1);
  assert.equal(w.revision, 0);
  assert.deepEqual(store.load().workspace, result.workspace);
});

test('오래된 창의 저장 요청은 최신 저장본을 덮어쓰지 않는다', () => {
  const memory = memoryStorage();
  const storeA = Core.createStorage(memory), storeB = Core.createStorage(memory);
  const original = makeWorkspace();
  const initial = storeA.save(original, 0).workspace;
  const stale = storeB.load().workspace;
  initial.cases[0].notes = '새 기록';
  const latest = storeA.save(initial, 1);
  stale.cases[0].notes = '오래된 창 기록';
  const denied = storeB.save(stale, 1);
  assert.equal(denied.ok, false);
  assert.equal(denied.conflict, true);
  assert.equal(storeA.load().workspace.cases[0].notes, '새 기록');
  assert.equal(storeA.load().workspace.revision, latest.workspace.revision);
});

test('저장소 할당량 오류는 성공으로 표시하지 않고 기존 데이터를 유지한다', () => {
  const memory = memoryStorage(), store = Core.createStorage(memory);
  const initial = store.save(makeWorkspace(), 0).workspace;
  const original = memory.getItem(Core.STORAGE_KEY);
  memory.setItem = () => { const err = new Error('full'); err.name = 'QuotaExceededError'; throw err; };
  initial.cases[0].notes = '미저장 변경';
  const failed = store.save(initial, 1);
  assert.equal(failed.ok, false);
  assert.match(failed.error, /저장 공간/);
  assert.equal(memory.getItem(Core.STORAGE_KEY), original);
});

test('저장 준비 도중 달라진 원문을 발견하면 쓰기 전에 충돌을 알린다', () => {
  const memory = memoryStorage(), store = Core.createStorage(memory);
  const initial = store.save(makeWorkspace(), 0).workspace;
  const newer = Core.validateWorkspace(initial);
  newer.revision++;
  newer.cases[0].notes = '다른 탭에서 먼저 저장한 내용';
  const beforeRead = memory.getItem.bind(memory);
  let reads = 0, writes = 0;
  memory.getItem = key => {
    if (++reads === 2) memory.map.set(key, JSON.stringify(newer));
    return beforeRead(key);
  };
  memory.setItem = () => { writes++; };
  initial.cases[0].notes = '아직 저장되지 않은 현재 입력';
  const result = store.save(initial, initial.revision);
  assert.equal(result.ok, false);
  assert.equal(result.conflict, true);
  assert.equal(writes, 0);
  assert.equal(JSON.parse(memory.map.get(Core.STORAGE_KEY)).cases[0].notes, newer.cases[0].notes);
  assert.equal(result.workspace.cases[0].notes, '아직 저장되지 않은 현재 입력');
});

test('손상된 저장 원문은 자동 초기화하거나 저장으로 덮어쓰지 않는다', () => {
  const memory = memoryStorage(), store = Core.createStorage(memory);
  const damaged = '{"unfinished":';
  memory.setItem(Core.STORAGE_KEY, damaged);
  const loaded = store.load();
  assert.equal(loaded.recovery, true);
  assert.equal(loaded.raw, damaged);
  assert.equal(store.save(makeWorkspace(), 0).ok, false);
  assert.equal(memory.getItem(Core.STORAGE_KEY), damaged);
  assert.equal(store.recover(makeWorkspace(), 'different').conflict, true);
  const recovered = store.recover(makeWorkspace(), damaged);
  assert.equal(recovered.ok, true);
  assert.equal(store.load().recovery, false);
});

test('읽기 불가 저장소와 저장 직후 변경도 확인된 성공으로 표시하지 않는다', () => {
  const unavailable = Core.createStorage(null);
  assert.equal(unavailable.load().recovery, true);
  assert.equal(unavailable.save(makeWorkspace(), 0).ok, false);
  const memory = memoryStorage();
  const originalSet = memory.setItem;
  memory.setItem = (key, value) => originalSet(key, value + ' ');
  const out = Core.createStorage(memory).save(makeWorkspace(), 0);
  assert.equal(out.ok, false);
  assert.equal(out.conflict, true);
});

test('CSV 출력은 따옴표·줄바꿈을 보존하며 수식 실행 시작문자를 무력화한다', () => {
  assert.equal(Core.escapeCsv('한글,"내용"\n다음'), '"한글,""내용""\n다음"');
  for (const input of ['=1+1', '+SUM(A1)', '-2', '@cmd', '\t=1', '\r=1', '   =1']) {
    assert.ok(Core.escapeCsv(input).startsWith('"\''));
  }
  assert.equal(Core.escapeCsv('일반 내용'), '"일반 내용"');
  assert.equal(Core.escapeCsv(null), '""');
});
