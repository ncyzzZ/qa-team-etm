import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { suggest, table, record } from './verdicts.mjs';
import { plan } from './push-plan.mjs';

const root = () => { const r = fs.mkdtempSync(path.join(os.tmpdir(), 'verd-')); fs.mkdirSync(path.join(r, 'work', 'ETM-1'), { recursive: true }); return r; };

test('suggest: finding with a defect wins; causes map to a suggestion', () => {
  assert.equal(suggest({ key: 'ETM-5', cause: 'assertion' }, [{ id: 'F-2', note: 'ETM-5 step 3', later_defect: 'ETM-9' }]).suggest, 'app');
  assert.equal(suggest({ key: 'ETM-5', cause: 'locator', locator: '.x' }).suggest, 'script');
  assert.equal(suggest({ key: 'ETM-5', cause: 'flaky' }).suggest, 'flaky');
  assert.equal(suggest({ key: 'ETM-5', cause: 'unknown' }).suggest, 'app?');
});

test('table writes one row per failure', () => {
  const r = root();
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'run-'));
  fs.writeFileSync(path.join(run, 'triage.json'), JSON.stringify([{ key: 'ETM-5', cause: 'env', firstLine: 'net::ERR' }, { key: 'ETM-6', cause: 'unknown', firstLine: 'Error: a | b' }]));
  const { rows, md } = table('ETM-1', run, r);
  assert.equal(rows.length, 2);
  assert.match(md, /\| 2 \| ETM-6 \| Error: a \/ b/);
  assert.ok(fs.existsSync(path.join(r, 'work', 'ETM-1', 'verdict-table.md')));
});

test('record needs evidence, a board ANSWER: line, valid verdicts', () => {
  const r = root();
  assert.throws(() => record('ETM-1', ['ETM-5=app'], { source: 'chat', evidence: '' }, r), /evidence/);
  assert.throws(() => record('ETM-1', ['ETM-5=app'], { source: 'board', evidence: 'yes' }, r), /ANSWER:/);
  assert.throws(() => record('ETM-1', ['ETM-5=maybe'], { source: 'chat', evidence: '1=maybe' }, r), /bad answer/);
  const all = record('ETM-1', ['ETM-5=app:ETM-9229', 'ETM-6=script'], { source: 'chat', evidence: '1=app 2=script' }, r);
  assert.equal(all['ETM-5'].defect, 'ETM-9229');
});

test('push plan: passed -> PASSED, failed app -> FAILED, the rest stay TO DO', () => {
  const r = root();
  fs.writeFileSync(path.join(r, 'work', 'ETM-1', 'run-results.json'), JSON.stringify({ tests: {
    'ETM-1': { status: 'passed' }, 'ETM-2': { status: 'failed' }, 'ETM-3': { status: 'failed' }, 'ETM-4': { status: 'skipped', why: 'not-proven' }, 'ETM-5': { status: 'failed' } } }));
  record('ETM-1', ['ETM-2=app:ETM-9', 'ETM-3=script'], { source: 'chat', evidence: 'x' }, r);
  const by = Object.fromEntries(plan('ETM-1', r).map((x) => [x.test, x]));
  assert.equal(by['ETM-1'].send, 'PASSED');
  assert.equal(by['ETM-2'].send, 'FAILED');
  assert.equal(by['ETM-3'].send, null);
  assert.equal(by['ETM-4'].send, null);
  assert.match(by['ETM-5'].why, /no verdict/);
});
