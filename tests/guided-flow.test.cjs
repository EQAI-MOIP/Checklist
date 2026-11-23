'use strict';
// Development tests only. The delivered app runs with native browser APIs.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../js/core.js');
const F = require('../js/guided-flow.js');
require('../js/rules-data.js');
const R = globalThis.QURI_RULES;
const makeCase = (overrides = {}) => C.createCase({ applicationNo: '10-2026-0004321', ...overrides });
const pending = (...ids) => ({ blockers: ids.map(itemId => ({ itemId })) });

test('네 유형의 안내 순서는 적용 기준의 순서를 유지하고 개별 청구항을 마지막에 둔다', () => {
  const counts = { notice: 51, final: 52, rejection: 59, registration: 59 };
  for (const [type, count] of Object.entries(counts)) {
    const c = makeCase({ type, claimCount: 3 });
    const steps = F.sequence(c, R);
    const items = C.applicableItems(c, R);
    assert.equal(steps.length, count + 3);
    assert.deepEqual(steps.slice(0, count).map(s => s.id), items.map(i => i.id));
    for (const step of steps.slice(0, count)) {
      const category = R.categories.find(cat => cat.id === step.categoryId);
      const original = category.items.find(item => item.id === step.id);
      assert.equal(step.claim, false);
      assert.equal(step.categoryTitle, category.title);
      assert.equal(step.title, original.title);
      assert.equal(step.question, original.question);
      assert.equal(step.item, original);
    }
    assert.deepEqual(steps.slice(-3), [1, 2, 3].map(number => ({
      id: 'claim:' + number, categoryId: 'claims', categoryTitle: '청구항별 점검',
      title: '청구항 ' + number, claim: true, number
    })));
  }
});

test('유효한 재개 위치는 완료 여부와 관계없이 유지하고 오래된 위치는 첫 유효 누락으로 이동한다', () => {
  const c = makeCase({ claimCount: 2 });
  const steps = F.sequence(c, R);
  const p = pending('removed-rule', steps[4].id, steps[1].id);
  assert.equal(F.resolve(c, R, steps[2].id, p), steps[2].id);
  assert.equal(F.resolve(c, R, 'claim:2', p), 'claim:2');
  assert.equal(F.resolve(c, R, 'deleted-cursor', p), steps[4].id);
  assert.equal(F.resolve(c, R, null, pending('removed-rule')), steps[0].id);
  assert.equal(F.resolve(c, R, null, { blockers: [] }), steps[0].id);
});

test('유형 변경과 청구항 수 감소 후 적용되지 않는 재개 위치를 안전하게 건너뛴다', () => {
  const c = makeCase({ type: 'registration', claimCount: 3 });
  const oldSteps = F.sequence(c, R);
  const registrationOnly = oldSteps.find(s => !s.claim && !s.item.appliesTo.includes('notice'));
  assert.ok(registrationOnly);
  c.type = 'notice';
  c.claimCount = 1;
  const p = C.progress(c, R, true);
  assert.equal(F.resolve(c, R, registrationOnly.id, p), p.blockers[0].itemId);
  assert.equal(F.resolve(c, R, 'claim:3', p), p.blockers[0].itemId);
  assert.equal(F.resolve(c, R, 'claim:1', p), 'claim:1');
});

test('다음 미완료는 현재 뒤부터 찾고 마지막에서 처음으로 순환하며 현재 항목은 마지막에 확인한다', () => {
  const c = makeCase({ claimCount: 2 });
  const steps = F.sequence(c, R);
  const p = pending(steps[1].id, steps[4].id, steps[4].id, 'claim:2', 'removed-rule');
  assert.equal(F.nextIncomplete(c, R, steps[1].id, p), steps[4].id);
  assert.equal(F.nextIncomplete(c, R, steps[4].id, p), 'claim:2');
  assert.equal(F.nextIncomplete(c, R, 'claim:2', p), steps[1].id);
  assert.equal(F.nextIncomplete(c, R, 'unknown', p), steps[1].id);
  assert.equal(F.nextIncomplete(c, R, steps[4].id, pending(steps[4].id)), steps[4].id);
  assert.equal(F.nextIncomplete(c, R, steps[4].id, pending('removed-rule')), null);
  assert.equal(F.nextIncomplete(c, R, steps[4].id, { blockers: [] }), null);
});

test('일반 다음·이전은 관점과 청구항 경계를 이어 주며 양 끝에서는 순환하지 않는다', () => {
  const c = makeCase({ claimCount: 2 });
  const items = C.applicableItems(c, R);
  const lastItem = items.at(-1).id;
  const categoryBoundary = items.findIndex((item, i) => i > 0 && item.categoryId !== items[i - 1].categoryId);
  assert.equal(F.next(c, R, items[0].id, -1), null);
  assert.equal(F.next(c, R, items[categoryBoundary - 1].id), items[categoryBoundary].id);
  assert.equal(F.next(c, R, lastItem), 'claim:1');
  assert.equal(F.next(c, R, 'claim:1', -1), lastItem);
  assert.equal(F.next(c, R, 'claim:1'), 'claim:2');
  assert.equal(F.next(c, R, 'claim:2'), null);
  assert.equal(F.next(c, R, 'unknown'), null);
  assert.equal(F.next(c, R, lastItem, 0), null);
  c.claimCount = 0;
  assert.equal(F.next(c, R, lastItem), null);
});

test('필수 근거·해당없음 사유·보완 기록 여부는 전달된 canonical blockers를 그대로 따른다', () => {
  const c = makeCase();
  const items = C.applicableItems(c, R);
  for (const item of items) c.responses[item.id] = { ...C.blankResponse(), status: 'pass', evidence: '합성 근거 1쪽' };
  const critical = items.find(item => item.critical);
  c.responses[critical.id].evidence = '';
  assert.equal(F.nextIncomplete(c, R, critical.id, C.progress(c, R, true)), critical.id);
  assert.equal(F.nextIncomplete(c, R, critical.id, C.progress(c, R, false)), null);
  c.responses[critical.id].status = 'na';
  assert.equal(F.nextIncomplete(c, R, critical.id, C.progress(c, R, false)), critical.id);
  c.responses[critical.id].memo = '합성 해당없음 사유';
  assert.equal(F.nextIncomplete(c, R, critical.id, C.progress(c, R, true)), null);
  c.responses[critical.id] = { ...C.blankResponse(), status: 'issue', resolved: true };
  assert.equal(F.nextIncomplete(c, R, critical.id, C.progress(c, R, true)), critical.id);
});

test('안내 위치 계산은 숨겨진 응답·청구항 기록·기준·진행 결과를 변경하지 않는다', () => {
  const c = makeCase({ type: 'notice', claimCount: 1 });
  c.responses['hidden-rule'] = { ...C.blankResponse(), status: 'na', memo: '이전 유형의 판단' };
  c.claimReviews['3'] = { ...C.blankResponse(), status: 'issue', memo: '과거 청구항의 보완' };
  const p = C.progress(c, R, true);
  const beforeCase = JSON.stringify(c), beforeRules = JSON.stringify(R), beforeProgress = JSON.stringify(p);
  for (const step of F.sequence(c, R)) {
    F.resolve(c, R, step.id, p);
    F.nextIncomplete(c, R, step.id, p);
    F.next(c, R, step.id);
    F.next(c, R, step.id, -1);
  }
  assert.equal(JSON.stringify(c), beforeCase);
  assert.equal(JSON.stringify(R), beforeRules);
  assert.equal(JSON.stringify(p), beforeProgress);
});

test('빈 카탈로그 및 선택적 진행정보에서도 안내 경계를 안전하게 처리한다', () => {
  const c = makeCase(), rules = { categories: [] };
  assert.deepEqual(F.sequence(c, rules), []);
  assert.equal(F.resolve(c, rules, 'old', pending('old')), null);
  assert.equal(F.nextIncomplete(c, rules, 'old', pending('old')), null);
  assert.equal(F.next(c, rules, 'old'), null);
  const first = F.sequence(c, R)[0].id;
  assert.equal(F.resolve(c, R, null), first);
  assert.equal(F.nextIncomplete(c, R, first), null);
});

test('file:// classic script 형식으로 로드하며 브라우저 전역 API를 제공한다', () => {
  const context = { QuriCore: C };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/guided-flow.js'), 'utf8'), context);
  const c = makeCase();
  assert.equal(typeof context.QuriFlow.sequence, 'function');
  assert.equal(context.QuriFlow.sequence(c, R)[0].id, F.sequence(c, R)[0].id);
  assert.ok(Object.isFrozen(context.QuriFlow));
});
