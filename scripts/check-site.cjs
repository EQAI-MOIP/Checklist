'use strict';

// Development-only publication gate. The browser never loads this file.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function inspectSite(root = path.resolve(__dirname, '..')) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = new Set(['index.html']);
  const base = new URL('https://example.invalid/Checklist/');
  const directives = new Map();
  const policy = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
  assert.ok(policy, 'A Content-Security-Policy must precede app resources.');
  for (const part of policy[1].split(';')) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) directives.set(name, values.join(' '));
  }
  for (const name of ['default-src', 'connect-src', 'object-src', 'base-uri', 'form-action']) {
    assert.equal(directives.get(name), "'none'", name + ' must block unintended connections or content.');
  }
  assert.equal(directives.get('script-src'), "'self'", 'Only bundled scripts may execute.');
  assert.match(html, /<meta\s+name="referrer"\s+content="no-referrer"/i, 'Do not send the page URL as a referrer.');
  assert.ok(fs.existsSync(path.join(root, '.nojekyll')), 'Publish static files without a Jekyll transformation.');
  assert.ok(html.indexOf(policy[0]) < html.search(/<(?:script|link)\b/i), 'Apply CSP before loading resources.');
  assert.doesNotMatch(html, /<base\b|\son[a-z]+\s*=|<iframe\b|<object\b|<embed\b/i);
  assert.doesNotMatch(html, /<script\b[^>]*\btype\s*=\s*["']module["']/i, 'Preserve direct file:// execution.');

  function localAsset(value, from = 'index.html') {
    if (value.startsWith('data:')) return;
    assert.ok(!/^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(value), 'Asset must use a relative path: ' + value);
    const resolved = new URL(value, new URL(from, base));
    assert.ok(resolved.href.startsWith(base.href), 'Asset escapes the /Checklist/ project path: ' + value);
    assert.ok(!resolved.search && !resolved.hash, 'App assets must not include user data or query strings: ' + value);
    const relative = decodeURIComponent(resolved.pathname.slice(base.pathname.length));
    const filename = path.join(root, relative);
    assert.ok(fs.existsSync(filename) && fs.statSync(filename).isFile(), 'Missing published asset: ' + relative);
    files.add(relative);
    return relative;
  }

  for (const tag of html.matchAll(/<(script|link|img|source)\b[^>]*>/gi)) {
    const attribute = tag[0].match(/\b(?:src|href)\s*=\s*["']([^"']+)["']/i);
    if (attribute) localAsset(attribute[1]);
    if (tag[1].toLowerCase() === 'script') {
      assert.ok(attribute, 'Inline executable scripts are not permitted.');
      assert.match(tag[0], /\bdefer\b/, 'Load classic scripts in a predictable order.');
    }
  }
  for (const file of [...files].filter(name => name.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(css, /@import\b/i, 'Bundle stylesheets; no remote imports.');
    for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) localAsset(match[1], file);
  }
  const runtime = [...files].filter(name => name.endsWith('.js'));
  for (const file of runtime) {
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(code, /\bfetch\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource|RTCPeerConnection)\b|\bsendBeacon\s*\(|\bserviceWorker\s*\.|\bimport\s*\(|\bimportScripts\s*\(/,
      file + ': network-capable APIs require a new privacy review.');
    assert.doesNotMatch(code, /\b(?:eval|Function)\s*\(/, file + ': do not execute strings as code.');
  }
  // Sprite URLs are assigned by the local animation controller rather than HTML.
  for (const name of fs.readdirSync(path.join(root, 'assets')).filter(name => name.endsWith('.webp'))) {
    const file = 'assets/' + name;
    const data = fs.readFileSync(path.join(root, file));
    assert.equal(data.toString('ascii', 0, 4), 'RIFF', file + ': invalid WebP header');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP', file + ': invalid WebP format');
    files.add(file);
  }
  return { files: [...files].sort(), scriptCount: runtime.length, basePath: base.pathname };
}

module.exports = { inspectSite };
if (require.main === module) {
  try {
    const result = inspectSite();
    console.log('Publication checks passed: ' + result.files.length + ' local app files; /Checklist/ paths, CSP, referrer policy, classic scripts, and network API gate.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
