'use strict';

// Optional real-browser test of the exact static app mounted below /Checklist/.
// QURI_BROWSER_TEST=1 node --test tests/public-site.test.cjs
// Uses an already installed Playwright only for development; no package install.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { once } = require('node:events');
const Core = require('../js/core.js');
const { inspectSite } = require('../scripts/check-site.cjs');
const root = path.resolve(__dirname, '..');

function loadPlaywright() {
  try { return require('playwright'); }
  catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    if (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) return require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
    throw new Error('Install Playwright in a development environment before explicitly enabling browser tests.');
  }
}

async function screenshot(page, name) {
  if (!process.env.QURI_SCREENSHOT_DIR) return;
  const directory = path.resolve(process.env.QURI_SCREENSHOT_DIR);
  await fs.mkdir(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, name + '.png'), fullPage: true });
}

test('public static app: relative paths and restrictive browser policy', () => {
  const result = inspectSite(root);
  assert.ok(result.files.includes('assets/quri-v3-motion-16frames.webp'));
  assert.ok(result.scriptCount >= 5);
});

test('GitHub Pages-style /Checklist/ hosting preserves local records without sending inputs', {
  skip: process.env.QURI_BROWSER_TEST !== '1' ? 'Set QURI_BROWSER_TEST=1 to run installed Chromium.' : false,
  timeout: 90000
}, async t => {
  const site = inspectSite(root);
  const allowed = new Set(site.files);
  const requests = [];
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp' };
  const server = http.createServer(async (req, res) => {
    const body = [];
    for await (const chunk of req) body.push(chunk);
    requests.push({ method: req.method, url: req.url, body: Buffer.concat(body).toString('utf8') });
    const requestUrl = new URL(req.url, 'http://localhost');
    const relative = requestUrl.pathname === '/Checklist/' ? 'index.html' : requestUrl.pathname.slice('/Checklist/'.length);
    if (!requestUrl.pathname.startsWith('/Checklist/') || !allowed.has(relative) || req.method !== 'GET') {
      res.writeHead(404); res.end(); return;
    }
    try {
      const data = await fs.readFile(path.join(root, relative));
      res.writeHead(200, { 'Content-Type': types[path.extname(relative)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    } catch (_) { res.writeHead(500); res.end(); }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.QURI_CHROMIUM || (process.platform === 'linux' ? '/usr/bin/chromium' : undefined) });
  t.after(() => browser.close());
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [], browserRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => browserRequests.push({ url: request.url(), method: request.method(), data: request.postData() }));
  await page.goto(origin + '/Checklist/');
  await page.locator('#quick-start').waitFor();
  await screenshot(page, 'hosted-dashboard');
  await page.locator('#application-number').fill('1020260000197');
  await page.locator('#application-number').press('Enter');
  await page.locator('[data-action="choose-type"][data-type="notice"]').click();
  await page.locator('[data-action="item-status"][data-status="pass"]').click();
  const evidence = '합성 공개사이트 시험 문서 17쪽 / PRIVATE_LOCAL_SENTINEL_197';
  await page.locator('[data-response-field="evidence"]').fill(evidence);
  await page.locator('[data-action="guided-next"]').click();
  await page.reload();
  await page.locator('.case-heading').waitFor();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), Core.STORAGE_KEY);
  assert.equal(saved.cases.length, 1);
  assert.equal(saved.cases[0].applicationNo, '10-2026-0000197');
  assert.ok(Object.values(saved.cases[0].responses).some(response => response.evidence === evidence), 'Edits survive a reload in this browser profile.');
  assert.doesNotMatch(page.url(), /0000197|PRIVATE_LOCAL_SENTINEL/, 'Do not put examination input in navigable URLs.');
  assert.doesNotMatch(await page.title(), /0000197|PRIVATE_LOCAL_SENTINEL/, 'Keep examination input out of browser-history titles.');
  await screenshot(page, 'hosted-checklist');
  await t.test('hosted checklist fits desktop/mobile and keyboard navigation focuses the next question', async () => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const before = await page.locator('article[data-item]').getAttribute('data-item');
      const later = page.locator('[data-action="guided-defer"]');
      await later.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(id => document.querySelector('article[data-item]')?.dataset.item !== id, before);
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'current-question', 'Keyboard activation places focus on the new question.');
      const dimensions = await page.evaluate(() => {
        const question = document.getElementById('current-question').getBoundingClientRect();
        return { viewport: innerWidth, content: document.documentElement.scrollWidth, top: question.top, height: innerHeight };
      });
      assert.ok(dimensions.content <= dimensions.viewport + 1, 'No horizontal checklist overflow at ' + width + 'px.');
      assert.ok(dimensions.top >= 0 && dimensions.top < dimensions.height, 'The focused question is within the visible viewport.');
      await screenshot(page, 'hosted-keyboard-checklist-' + width);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.topbar [data-action="backup-all"]').click();
  const download = await downloadEvent;
  const backup = Core.decodeBackup(await fs.readFile(await download.path(), 'utf8'));
  assert.equal(backup.cases[0].applicationNo, saved.cases[0].applicationNo);
  assert.ok(Object.values(backup.cases[0].responses).some(response => response.evidence === evidence));
  await page.evaluate(() => { location.hash = 'privacy'; });
  await page.waitForFunction(() => document.querySelector('#view')?.textContent.includes('GitHub'));
  assert.match(await page.locator('#view').innerText(), /브라우저/);
  assert.match(await page.locator('#view').innerText(), /GitHub/);
  await screenshot(page, 'hosted-privacy');
  await page.setViewportSize({ width: 390, height: 844 });
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
  assert.ok(dimensions.content <= dimensions.viewport + 1, 'The storage explanation must remain readable without horizontal scrolling on mobile.');
  await screenshot(page, 'hosted-privacy-mobile');

  for (const request of browserRequests) {
    const url = new URL(request.url);
    assert.equal(url.origin, origin, 'No external service is contacted.');
    assert.equal(request.method, 'GET');
    assert.equal(request.data, null);
    assert.equal(url.search, '', 'No input is attached to an asset query.');
  }
  assert.ok(requests.length > 5, 'Observe real HTTP asset requests.');
  for (const request of requests) {
    assert.equal(request.method, 'GET');
    assert.equal(request.body, '');
    assert.doesNotMatch(request.url, /0000197|PRIVATE_LOCAL_SENTINEL|%EC%/);
  }
  assert.deepEqual(errors, [], 'No uncaught app errors under a project subpath.');

  // A separate browser profile must never see another profile's examination work.
  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  await otherPage.goto(origin + '/Checklist/');
  await otherPage.locator('#quick-start').waitFor();
  assert.equal(await otherPage.evaluate(key => JSON.parse(localStorage.getItem(key))?.cases?.length || 0, Core.STORAGE_KEY), 0);
  await otherContext.close();

  // Exercise the browser's CSP enforcement, not just the source string.
  const blocked = await page.evaluate(async () => {
    try { await fetch('/collector', { method: 'POST', body: 'SYNTHETIC_POLICY_TEST' }); return false; }
    catch (_) { return true; }
  });
  assert.equal(blocked, true, 'connect-src none must reject a transmission attempt.');
  assert.ok(!requests.some(request => request.url === '/collector'), 'The forbidden POST never reaches the server.');

  await t.test('a second tab is read-only, then resumes the newest records after the owner closes', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(id => { location.hash = 'case/' + id; }, saved.cases[0].id);
    await page.locator('.case-heading').waitFor();
    await page.locator('.category-button[data-action="category"]').first().click();
    const firstId = Object.entries(saved.cases[0].responses).find(([, response]) => response.evidence === evidence)[0];
    await page.locator('[data-action="guided-goto"][data-id="' + firstId + '"]').click();
    const viewer = await context.newPage();
    viewer.on('pageerror', error => errors.push(error.message));
    await viewer.goto(origin + '/Checklist/#case/' + saved.cases[0].id);
    await viewer.locator('.case-heading').waitFor();
    await viewer.waitForFunction(() => document.getElementById('storage-banner')?.textContent.includes('다른 탭에서 편집 중'));
    assert.equal(await viewer.locator('[data-action="item-status"][data-status="pass"]').isDisabled(), true);
    assert.equal(await viewer.locator('[data-response-field="evidence"]').isDisabled(), true);
    assert.equal(await viewer.locator('.topbar [data-action="backup-all"]').isEnabled(), true, 'Read-only tabs can still export a backup.');
    await screenshot(viewer, 'hosted-second-tab-readonly');

    const latestEvidence = evidence + ' / owner latest revision';
    await page.locator('[data-response-field="evidence"]').fill(latestEvidence);
    await page.waitForFunction(({ key, item, expected }) => JSON.parse(localStorage.getItem(key)).cases[0].responses[item].evidence === expected,
      { key: Core.STORAGE_KEY, item: firstId, expected: latestEvidence });
    await viewer.waitForFunction(expected => document.querySelector('[data-response-field="evidence"]')?.value === expected, latestEvidence);
    assert.equal(await viewer.locator('[data-response-field="evidence"]').isDisabled(), true, 'A storage event does not unlock the viewer.');
    const lastRevision = await viewer.evaluate(key => JSON.parse(localStorage.getItem(key)).revision, Core.STORAGE_KEY);
    await page.close();
    await viewer.waitForFunction(async () => !(await navigator.locks.query()).held.some(lock => lock.name === 'quri.examiner.workspace.v1.writer'));
    await viewer.locator('[data-action="retry-writer"]').click();
    await viewer.waitForFunction(() => {
      const input = document.querySelector('[data-response-field="evidence"]');
      return input && !input.disabled;
    });
    assert.equal(await viewer.locator('[data-response-field="evidence"]').inputValue(), latestEvidence, 'Taking ownership preserves the newest saved content.');
    const resumedEvidence = latestEvidence + ' / continued in second tab';
    await viewer.locator('[data-response-field="evidence"]').fill(resumedEvidence);
    await viewer.waitForFunction(({ key, item, expected }) => JSON.parse(localStorage.getItem(key)).cases[0].responses[item].evidence === expected,
      { key: Core.STORAGE_KEY, item: firstId, expected: resumedEvidence });
    const resumed = await viewer.evaluate(key => JSON.parse(localStorage.getItem(key)), Core.STORAGE_KEY);
    assert.ok(resumed.revision > lastRevision);
    assert.equal(resumed.cases.length, 1);
    assert.equal(resumed.cases[0].id, saved.cases[0].id);
    assert.equal(await viewer.locator('#storage-banner').isVisible(), false);
    assert.deepEqual(errors, []);
    await screenshot(viewer, 'hosted-second-tab-resumed');
    await viewer.close();
  });
  await context.close();
});
