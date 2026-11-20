import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { triageRun } from './triage.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-'));
fs.copyFileSync(path.join(ROOT, 'evals', 'heal', 'results-mixed.json'), path.join(runDir, 'results.json'));
const rows = triageRun(runDir);
const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));

test('timeout waiting for a locator is a locator failure with locator and page ref', () => {
  assert.equal(byKey['ETM-1'].cause, 'locator');
  assert.equal(byKey['ETM-1'].locator, "locator('.save-btn')");
  assert.equal(byKey['ETM-1'].pageRef, 'pages/timelinePage/editPlanPage.ts:42');
});
test('strict mode violation is a locator failure', () => assert.equal(byKey['ETM-2'].cause, 'locator'));
test('expect on an element that is not found is a locator failure', () => {
  assert.equal(byKey['ETM-3'].cause, 'locator');
  assert.equal(byKey['ETM-3'].locator, "locator('#plan-title')");
});
test('element found but value differs is an assertion, never a locator', () => assert.equal(byKey['ETM-4'].cause, 'assertion'));
test('failed then passed on retry is flaky', () => assert.equal(byKey['ETM-5'].cause, 'flaky'));
test('connection refused, SSO timeout and HTTP 500 are env', () => {
  for (const k of ['ETM-6', 'ETM-7', 'ETM-8']) assert.equal(byKey[k].cause, 'env', k);
});
test('missing test data is data', () => assert.equal(byKey['ETM-9'].cause, 'data'));
test('anything else is unknown', () => assert.equal(byKey['ETM-10'].cause, 'unknown'));
test('skipped tests are left out', () => assert.equal(byKey['ETM-11'], undefined));
test('firstLine has no ANSI codes', () => assert.ok(!/\x1b/.test(byKey['ETM-1'].firstLine)));
test('the CLI files are written', () => {
  assert.ok(fs.existsSync(path.join(runDir, 'triage.json')));
  assert.match(fs.readFileSync(path.join(runDir, 'triage.md'), 'utf8'), /locator/);
});

test('the key is the first ETM-n in the title, with or without brackets', async () => {
  const { triageRun } = await import('./triage.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-key-'));
  const fail = { status: 'failed', retry: 0, error: { message: 'Error: x' } };
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ suites: [{ specs: [{ title: 'ETM-8639 - Verify the weekly cell', file: 'a', tests: [{ results: [fail] }] }] }] }));
  assert.equal(triageRun(dir, { write: false })[0].key, 'ETM-8639');
});

test('an element that was found but blocked (disabled, covered) is not a locator failure', async () => {
  const { classify } = await import('./triage.mjs');
  const f = (message) => classify({ results: [{ status: 'failed', error: { message } }] }).cause;
  assert.notEqual(f("TimeoutError: locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('.save')\n  - locator resolved to <button disabled class=\"save\">\n  - element is not enabled"), 'locator');
  assert.notEqual(f("TimeoutError: locator.click: Timeout 30000ms exceeded.\nCall log:\n  - waiting for locator('.save')\n  - <div class=\"overlay\"></div> intercepts pointer events"), 'locator');
});

test('a data failure in a run whose data was reset and READY says so in its reason', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-ready-'));
  fs.copyFileSync(path.join(ROOT, 'evals', 'heal', 'results-mixed.json'), path.join(dir, 'results.json'));
  fs.writeFileSync(path.join(dir, 'data-check.json'), JSON.stringify({ status: 'READY' }));
  const r = Object.fromEntries(triageRun(dir, { write: false }).map((x) => [x.key, x]));
  assert.equal(r['ETM-9'].cause, 'data');
  assert.match(r['ETM-9'].firstLine, /data was reset and READY before the run: check the test, not the setup/);
  assert.doesNotMatch(r['ETM-4'].firstLine, /READY before the run/);
});
