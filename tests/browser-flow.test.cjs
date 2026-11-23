'use strict';

/* Optional real-browser acceptance tests, never loaded by the distributed app.
 * Run in a machine that permits browser execution:
 *   QURI_BROWSER_TEST=1 node --test tests/browser-flow.test.cjs
 * Playwright must already be available to Node (or under
 * CODEX_PRIMARY_RUNTIME_NODE_MODULES). No packages are downloaded by this test.
 * Set QURI_CHROMIUM to an installed Chromium/Chrome executable if needed.
 * Set QURI_SCREENSHOT_DIR to save the checked screens for manual visual review.
 * A launch failure when explicitly enabled is a failure, not a skipped pass.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const Core = require('../js/core.js');
require('../js/rules-data.js');
const Rules = globalThis.QURI_RULES;
const appUrl = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const enabled = process.env.QURI_BROWSER_TEST === '1';

function loadPlaywright() {
  try { return require('playwright'); }
  catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    if (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) {
      return require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
    }
    throw new Error('Browser tests require an existing development installation of Playwright. The app itself has no such dependency.');
  }
}

function makeFixture(options = {}) {
  const workspace = Core.blankWorkspace();
  const record = Core.createCase({
    applicationNo: options.applicationNo || '1020260000099',
    type: options.type || 'notice',
    title: '합성 브라우저 시험 자료',
    examiner: options.examiner || '',
    claimCount: options.claimCount || 0
  });
  if (options.ready) {
    for (const item of Core.applicableItems(record, Rules)) {
      record.responses[item.id] = { ...Core.blankResponse(), status: 'pass', evidence: '합성 문서 1쪽, 청구항 1' };
    }
    for (let n = 1; n <= record.claimCount; n++) {
      record.claimReviews[n] = { ...Core.blankResponse(), status: 'pass', evidence: '합성 청구항 ' + n };
    }
  }
  workspace.settings.name = options.name || '';
  workspace.cases.push(record);
  return { workspace, record };
}

async function saved(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), Core.STORAGE_KEY);
}

async function loadBackup(page, workspace) {
  await page.locator('#backup-file').setInputFiles({
    name: 'synthetic-v1-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(Core.encodeBackup(workspace))
  });
  await page.locator('[data-action="import-replace"]').click();
  await page.locator('[data-action="confirm-yes"]').click();
  await page.locator('#app-dialog').waitFor({ state: 'hidden' });
  await page.evaluate(id => { location.hash = 'case/' + id; }, workspace.cases[0].id);
  await page.locator('.case-heading').waitFor();
}

async function start(page, number = '1020260000001', type = 'notice') {
  await page.locator('#application-number').fill(number);
  await page.locator('#application-number').press('Enter');
  await page.locator('[data-action="choose-type"][data-type="' + type + '"]').click();
  await page.locator('article[data-item]').waitFor();
}

async function focusId(page) {
  assert.equal(await page.locator('article[data-item]').count(), 1, 'one checklist question is shown at a time');
  return page.locator('article[data-item]').getAttribute('data-item');
}

async function tryNext(page) {
  const next = page.locator('[data-action="guided-next"]');
  if (await next.isEnabled()) await next.click();
}

async function screenshot(page, name) {
  if (!process.env.QURI_SCREENSHOT_DIR) return;
  const destination = path.resolve(process.env.QURI_SCREENSHOT_DIR);
  await fs.mkdir(destination, { recursive: true });
  await page.screenshot({ path: path.join(destination, name + '.png'), fullPage: true });
}

test('offline guided flow in a real Chromium browser', {
  skip: enabled ? false : 'Set QURI_BROWSER_TEST=1 in an environment that permits local browser execution.',
  timeout: 180000
}, async t => {
  const { chromium } = loadPlaywright();
  const executablePath = process.env.QURI_CHROMIUM || (process.platform === 'linux' ? '/usr/bin/chromium' : undefined);
  const browser = await chromium.launch({ headless: true, executablePath });
  t.after(() => browser.close());

  async function fresh(callback, options = {}) {
    const context = await browser.newContext({
      offline: true, acceptDownloads: true,
      viewport: { width: 1440, height: 1000 }, ...options
    });
    const page = await context.newPage();
    const errors = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (/^https?:/i.test(request.url())) external.push(request.url());
    });
    try {
      await page.goto(appUrl);
      await page.locator('#quick-start').waitFor();
      await callback(page, context);
      assert.deepEqual(errors, [], 'no uncaught JavaScript errors');
      assert.deepEqual(external, [], 'the app must not attempt external HTTP requests');
    } finally { await context.close(); }
  }

  await t.test('file:// loads local WebP, number-only start and normalized duplicate resume', async () => {
    await fresh(async page => {
      assert.equal(await page.locator('input[name="examiner"], #setting-name').count(), 0);
      assert.match(page.url(), /^file:/);
      const image = await page.evaluate(() => new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve([image.naturalWidth, image.naturalHeight]);
        image.onerror = () => resolve(null);
        image.src = new URL('assets/quri-v3-motion-16frames.webp', location.href).href;
      }));
      assert.deepEqual(image, [1254, 1254], 'the shipped WebP must decode while offline');
      await screenshot(page, 'dashboard');
      await page.locator('#application-number').fill('123');
      await page.locator('#application-number').press('Enter');
      assert.equal((await saved(page))?.cases.length || 0, 0, 'invalid number must not create a case');
      await start(page);
      const first = await saved(page);
      assert.equal(first.cases.length, 1);
      assert.equal(first.cases[0].applicationNo, '10-2026-0000001');
      assert.equal(first.cases[0].examiner, '');
      await page.evaluate(() => { location.hash = 'dashboard'; });
      await page.locator('#application-number').fill('10-2026-0000001');
      await page.locator('#application-number').press('Enter');
      await page.locator('article[data-item]').waitFor();
      assert.equal((await saved(page)).cases.length, 1, 'duplicate number resumes the same case');
      assert.equal((await saved(page)).cases[0].id, first.cases[0].id);
    });
  });

  await t.test('required evidence, NA reason and every issue requirement gate Next', async () => {
    await fresh(async page => {
      await start(page);
      const firstId = await focusId(page);
      const record = (await saved(page)).cases[0];
      const firstItem = Core.applicableItems(record, Rules).find(item => item.id === firstId);
      assert.equal(firstItem.critical, true, 'fixture starts with a critical document check');
      await page.locator('[data-action="item-status"][data-status="pass"]').click();
      await tryNext(page);
      assert.equal(await focusId(page), firstId, 'a pass without required evidence must stay on the item');
      await page.locator('[data-response-field="evidence"]').fill('합성 명세서 2쪽');
      await page.locator('[data-action="guided-next"]').click();
      const secondId = await focusId(page);
      assert.notEqual(secondId, firstId);
      await page.locator('[data-action="item-status"][data-status="na"]').click();
      await tryNext(page);
      assert.equal(await focusId(page), secondId);
      await page.locator('[data-response-field="memo"]').fill('합성 시험: 해당 조건이 없는 유형');
      await page.locator('[data-action="guided-next"]').click();
      const issueId = await focusId(page);
      await page.locator('[data-action="item-status"][data-status="issue"]').click();
      const state = await saved(page);
      const blockers = Core.progress(state.cases[0], Rules, state.settings.strictEvidence).blockers.filter(row => row.itemId === issueId);
      assert.equal(blockers.length, 4);
      const content = await page.locator('#checklist-main').innerText();
      for (const blocker of blockers) assert.ok(content.includes(blocker.message), 'show every requirement: ' + blocker.message);
      await tryNext(page);
      assert.equal(await focusId(page), issueId);
      await screenshot(page, 'issue-requirements');
      await page.locator('[data-response-field="evidence"]').fill('합성 인용문헌 3쪽');
      await page.locator('[data-response-field="memo"]').fill('합성 시험: 인용문헌 번호 확인 필요');
      await page.locator('[data-response-field="action"]').fill('합성 시험: 원문과 대조하여 번호를 정정함');
      await page.locator('[data-response-field="resolved"]').check();
      await page.locator('[data-action="guided-next"]').click();
      assert.notEqual(await focusId(page), issueId);
      assert.ok(await page.evaluate(() => document.activeElement !== document.body), 'navigation must leave a useful keyboard focus');
    });
  });

  await t.test('defer preserves pending, cursor survives reload and missing item remains visible', async () => {
    await fresh(async page => {
      await start(page);
      const deferred = await focusId(page);
      await page.locator('[data-action="guided-defer"]').click();
      const nextId = await focusId(page);
      assert.notEqual(nextId, deferred);
      assert.equal((await saved(page)).cases[0].responses[deferred]?.status || 'pending', 'pending');
      await page.reload();
      await page.locator('article[data-item]').waitFor();
      assert.equal(await focusId(page), nextId, 'resume at the saved valid item');
      await page.locator('.category-nav [data-action="category"][data-category="review"]').click();
      assert.equal(await page.locator('[data-action="jump-item"][data-id="' + deferred + '"]').count(), 1);
      await page.locator('[data-action="jump-item"][data-id="' + deferred + '"]').click();
      assert.equal(await focusId(page), deferred);
    });
  });

  await t.test('four explicit document types select their own applicable checklist', async () => {
    await fresh(async page => {
      for (const [index, type] of Core.TYPES.entries()) {
        if (index) {
          await page.evaluate(() => { location.hash = 'dashboard'; });
          await page.locator('#quick-start').waitFor();
        }
        await start(page, '102026000001' + index, type);
        const state = await saved(page);
        const record = state.cases.find(record => record.applicationNo.endsWith('000001' + index));
        assert.equal(record.type, type);
        assert.equal(await focusId(page), Core.applicableItems(record, Rules)[0].id);
        assert.match(await page.locator('.case-heading').innerText(), /의견제출통지|최후통지|거절결정|등록결정/);
      }
    });
  });

  await t.test('legacy v1 import and optional metadata preserve hidden names and previous records', async () => {
    await fresh(async page => {
      const { workspace, record } = makeFixture({ examiner: '이전 기록의 이름', name: '이전 기본 이름', claimCount: 3 });
      const registration = Core.createCase({ applicationNo: record.applicationNo, type: 'registration' });
      const historical = Core.applicableItems(registration, Rules).find(item => !Core.applicableItems(record, Rules).some(current => current.id === item.id));
      assert.ok(historical);
      record.responses[historical.id] = { ...Core.blankResponse(), status: 'na', memo: '이전 등록 유형 검토 기록' };
      record.claimReviews['3'] = { ...Core.blankResponse(), status: 'pass', evidence: '이전 청구항 3 기록' };
      await loadBackup(page, workspace);
      await page.locator('[data-action="edit-case"]').click();
      assert.equal(await page.locator('#form-examiner').count(), 0);
      await page.locator('#form-title').fill('명칭만 수정한 합성 시험');
      await page.locator('#form-claims').fill('1');
      await page.locator('[data-action="save-case-form"]').click();
      const output = (await saved(page)).cases[0];
      assert.equal(output.examiner, '이전 기록의 이름');
      assert.equal(output.responses[historical.id].memo, '이전 등록 유형 검토 기록');
      assert.equal(output.claimReviews['3'].evidence, '이전 청구항 3 기록');
      const downloadReady = page.waitForEvent('download');
      await page.locator('[data-action="backup-all"]').first().click();
      const download = await downloadReady;
      const restored = Core.decodeBackup(await fs.readFile(await download.path(), 'utf8'));
      assert.equal(restored.cases[0].examiner, '이전 기록의 이름');
      assert.equal(restored.cases[0].responses[historical.id].memo, '이전 등록 유형 검토 기록');
    });
  });

  await t.test('final acknowledgement, completion lock, reopen and archive remain usable', async () => {
    await fresh(async page => {
      const { workspace } = makeFixture({ ready: true, claimCount: 2 });
      await loadBackup(page, workspace);
      await page.locator('.category-nav [data-action="category"][data-category="review"]').click();
      await page.locator('[data-action="complete"]').click();
      assert.equal((await saved(page)).cases[0].completedAt, null, 'final direct-review acknowledgement is required');
      await page.locator('#final-ack').check();
      await page.locator('[data-action="complete"]').click();
      assert.ok((await saved(page)).cases[0].completedAt);
      await screenshot(page, 'completed-review');
      assert.equal(await page.locator('[data-action="edit-case"]').isDisabled(), true);
      await page.locator('[data-action="reopen"]').click();
      await page.locator('[data-action="confirm-yes"]').click();
      assert.equal((await saved(page)).cases[0].completedAt, null);
      await page.locator('[data-action="case-menu"]').click();
      await page.locator('[data-action="archive"]').click();
      await page.locator('[data-action="confirm-yes"]').click();
      assert.equal((await saved(page)).cases[0].archived, true);
      assert.equal(await page.locator('[data-action="edit-case"]').isDisabled(), true);
      await page.locator('[data-action="unarchive"]').click();
      assert.equal((await saved(page)).cases[0].archived, false);
    });
  });

  await t.test('responsive layout, contextual animation and operating-system reduced motion', async () => {
    await fresh(async page => {
      await start(page);
      for (const width of [1440, 1024, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
        assert.ok(dimensions.content <= dimensions.viewport + 1, 'no horizontal page overflow at ' + width + 'px');
        await screenshot(page, 'guided-' + width);
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      const sprite = page.locator('#quri-guide [data-quri]').first();
      await sprite.scrollIntoViewIfNeeded();
      assert.ok(await sprite.getAttribute('aria-label'));
      assert.ok(['document', 'review', 'thinking', 'compare', 'evidence', 'decision'].includes(await sprite.getAttribute('data-quri-state')));
      await page.waitForFunction(() => document.querySelector('#quri-guide [data-quri]')?.dataset.quriPlaying === 'true');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => document.querySelector('#quri-guide [data-quri]')?.dataset.quriPlaying === 'false');
      const frame = await sprite.getAttribute('data-quri-frame');
      await page.waitForTimeout(650);
      assert.equal(await sprite.getAttribute('data-quri-frame'), frame, 'reduced motion freezes real frame advancement');
    });
  });
});
