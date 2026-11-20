import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { overlayCode } = require('./overlay.js');
const HERE = path.dirname(fileURLToPath(import.meta.url));

// a fake Playwright page: records what the helper does, in order
function fakePage(matches = 2) {
  const calls = [];
  const handle = { evaluate: async (fn, arg) => { calls.push(['frame', arg]); } };
  return { calls, page: {
    locator: (sel) => ({ elementHandles: async () => { calls.push(['locator', sel]); return Array.from({ length: matches }, () => handle); } }),
    evaluate: async (fn, arg) => { calls.push([String(fn).includes('qa-evidence-label') && String(fn).includes('remove') ? 'cleanup' : 'caption', arg]); },
    screenshot: async (o) => { calls.push(['shot', o]); },
  } };
}

const opts = { test: 'ETM-8692', n: 4, did: 'Looked for "Ramp Down" </script>', see: "no `Ramp Down` line, it's gone", selectors: ['aria-ref=e12', '.gantt'], out: '/run/evidence/ETM-8692/step-4.png' };

test('the code is one async (page) => function: frames, caption, full-page shot to the given path, then removes the overlay', async () => {
  const code = overlayCode(opts);
  assert.match(code, /^async \(page\) =>/);
  const fn = eval(code); // the MCP code tool evaluates the same string
  const f = fakePage(2);
  const r = await fn(f.page);
  const kinds = f.calls.map((c) => c[0]);
  assert.deepEqual(kinds, ['locator', 'frame', 'frame', 'locator', 'frame', 'frame', 'caption', 'shot', 'cleanup']);
  assert.deepEqual(f.calls.find((c) => c[0] === 'shot')[1], { path: opts.out, fullPage: true });
  const cap = f.calls.find((c) => c[0] === 'caption')[1];
  assert.equal(cap[0], 'ETM-8692'); assert.equal(cap[1], 4); assert.equal(cap[2], opts.did); assert.equal(cap[3], opts.see);
  assert.deepEqual(r, { framed: 4, out: opts.out });
});

test('the overlay is removed even when the screenshot fails', async () => {
  const fn = eval(overlayCode(opts));
  const f = fakePage(1);
  f.page.screenshot = async () => { throw new Error('boom'); };
  await assert.rejects(fn(f.page), /boom/);
  assert.equal(f.calls.at(-1)[0], 'cleanup');
});

test('a selector that matches nothing is reported as framed 0, not hidden', async () => {
  const r = await eval(overlayCode({ ...opts, selectors: ['#none'] }))(fakePage(0).page);
  assert.equal(r.framed, 0);
});

test('CLI prints the code for the given step', () => {
  const x = spawnSync(process.execPath, [path.join(HERE, 'overlay.js'), '--test', 'ETM-1', '--n', '2', '--did', 'a', '--see', 'b', '--sel', '.x', '--out', 'o.png'], { encoding: 'utf8' });
  assert.equal(x.status, 0, x.stderr);
  assert.match(x.stdout, /^async \(page\) =>/);
  assert.match(x.stdout, /"o\.png"/);
});
