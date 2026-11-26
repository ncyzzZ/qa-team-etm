import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sort, act, checkHeals } from './auto-next.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'an-root-'));
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'an-pw-'));
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'an-run-'));
  fs.mkdirSync(path.join(pw, 'pages'), { recursive: true });
  fs.writeFileSync(path.join(pw, 'pages', 'p.ts'), "a\nconst x = page.locator('.old');\nb");
  fs.writeFileSync(path.join(run, 'triage.json'), JSON.stringify([
    { key: 'ETM-1', cause: 'env', file: 'fe/a.spec.ts' },
    { key: 'ETM-2', cause: 'flaky', file: 'fe/a.spec.ts' },
    { key: 'ETM-3', cause: 'locator', file: 'fe/b.spec.ts' },
    { key: 'ETM-4', cause: 'locator', file: 'fe/b.spec.ts' },
    { key: 'ETM-5', cause: 'assertion', file: 'fe/c.spec.ts' },
  ]));
  fs.writeFileSync(path.join(run, 'heal-proposals.json'), JSON.stringify({ proposals: [
    { id: 1, test: 'ETM-3', status: 'ready', page: 'pages/p.ts:2', oldLine: "const x = page.locator('.old');", newLine: "const x = page.locator('.new');", old: '.old', new: '.new' },
    { id: 2, test: 'ETM-4', status: 'needs-live', reason: 'library class' },
  ] }));
  return { root, pw, run };
}

test('sort: env/flaky re-run, ready heal, live heal, assertion asks', () => {
  const { root, run } = fixture();
  const p = sort('ETM-9', run, { root });
  assert.deepEqual(p.rerun, ['ETM-1', 'ETM-2']);
  assert.equal(p.heal[0].test, 'ETM-3');
  assert.equal(p.live[0].test, 'ETM-4');
  assert.deepEqual(p.ask.map((a) => a.key), ['ETM-5']);
  assert.deepEqual(p.specs.sort(), ['tests/fe/a.spec.ts', 'tests/fe/b.spec.ts']);
});

test('only one automatic re-run per test per day', () => {
  const { root, run } = fixture();
  act('ETM-9', run, sort('ETM-9', run, { root }), { root });
  const p2 = sort('ETM-9', run, { root });
  assert.deepEqual(p2.rerun, []);
  assert.deepEqual(p2.ask.map((a) => a.key).sort(), ['ETM-1', 'ETM-2', 'ETM-5']);
});

test('heal applied, then reverted when the re-run fails, kept when it passes', () => {
  for (const [status, expectLine, kept] of [['failed', ".old'", 0], ['passed', ".new'", 1]]) {
    const { root, pw, run } = fixture();
    const applied = act('ETM-9', run, sort('ETM-9', run, { root }), { root, applyNow: true, pwRepo: pw });
    assert.equal(applied.length, 1);
    assert.match(fs.readFileSync(path.join(pw, 'pages', 'p.ts'), 'utf8'), /\.new'/);
    const newRun = fs.mkdtempSync(path.join(os.tmpdir(), 'an-new-'));
    fs.writeFileSync(path.join(newRun, 'results.json'), JSON.stringify({ suites: [{ specs: [{ title: 'ETM-3 - heal me', tests: [{ results: [{ status }] }] }] }] }));
    const r = checkHeals('ETM-9', newRun, run, { root, pwRepo: pw });
    assert.equal(r.kept.length, kept);
    assert.ok(fs.readFileSync(path.join(pw, 'pages', 'p.ts'), 'utf8').includes(expectLine));
  }
});

test('a live heal without the user\'s Apply is never applied by auto-next; after live-ok it is', () => {
  const { root, pw, run } = fixture();
  const f = path.join(run, 'heal-proposals.json');
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  Object.assign(d.proposals[1], { status: 'ready', source: 'live', approved: false, page: 'pages/p.ts:2', oldLine: "const x = page.locator('.old');", newLine: "const x = page.locator('.live');", old: '.old', new: '.live' });
  d.proposals[0].status = 'skipped';
  fs.writeFileSync(f, JSON.stringify(d));
  const p = sort('ETM-9', run, { root });
  assert.equal(p.heal.length, 0);
  assert.ok(p.ask.some((a) => a.key === 'ETM-4' && /needs the user's Apply/.test(a.why)));
  assert.equal(act('ETM-9', run, p, { applyNow: true, root, pwRepo: pw }).length, 0);
  d.proposals[1].approved = true; fs.writeFileSync(f, JSON.stringify(d));
  assert.equal(act('ETM-9', run, sort('ETM-9', run, { root }), { applyNow: true, root, pwRepo: pw }).length, 1);
  assert.match(fs.readFileSync(path.join(pw, 'pages', 'p.ts'), 'utf8'), /'\.live'/);
});
