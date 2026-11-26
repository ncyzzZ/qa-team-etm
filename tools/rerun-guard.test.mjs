import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { decide, selected, testsOf, testHashes, plan, history, inputsOf, FAILED_ROUNDS_LIMIT } from './rerun-guard.mjs';

const NOW = new Date('2026-11-26T05:00:00Z').getTime();
const H = (o) => ({ run: '2026-11-26_090000_ETM-1', start: NOW - 3600e3, end: NOW - 3500e3, status: 'failed', msg: 'Timeout menu', cause: 'locator', hash: null, ...o });

test('decide: never ran, changed, env/flaky keep; same result and too many rounds drop', () => {
  assert.equal(decide([], 0, NOW).keep, true);
  assert.equal(decide([H()], NOW, NOW).keep, true);                                   // a file changed after the run
  assert.match(decide([H()], 0, NOW).why, /same result expected: failed with "Timeout menu"/);
  assert.match(decide([H({ status: 'passed' })], 0, NOW).why, /passed in/);
  assert.equal(decide([H({ cause: 'env' })], 0, NOW).keep, true);
  assert.equal(decide([H({ status: 'flaky' })], 0, NOW).keep, true);
  const rounds = Array.from({ length: FAILED_ROUNDS_LIMIT }, (_, i) => H({ start: NOW - (i + 1) * 3600e3 }));
  const d = decide(rounds, NOW, NOW);                                                  // even with a change: stop
  assert.equal(d.keep, false); assert.match(d.why, /offer it as manual/);
  const yesterday = rounds.map((x) => ({ ...x, start: x.start - 86400e3 }));
  assert.equal(decide(yesterday, NOW, NOW).keep, true);                               // rounds count per day
});

test('decide with hashes: a spec edit counts only for the edited test', () => {
  const last = H({ hash: 'aaa' });
  assert.equal(decide([last], NOW, NOW, { hash: 'aaa', otherAt: 0 }).keep, false);   // spec newer, this test same
  assert.match(decide([last], NOW, NOW, { hash: 'bbb', otherAt: 0 }).why, /this test changed/);
  assert.match(decide([last], NOW, NOW, { hash: 'aaa', otherAt: NOW }).why, /import, the card data or stms-fe/);
});

const SPEC = `import { x } from './helper';
const shared = 1;
test('ETM-11 - one', async () => { await a(); });
test.fixme('ETM-12 - two', async () => { await b(); });
test('ETM-13 - three', async () => { await c(); });
`;

test('testHashes: editing one test changes only its hash; shared code changes all', () => {
  const a = testHashes(SPEC);
  const b = testHashes(SPEC.replace('await c()', 'await c2()'));
  assert.equal(a['ETM-11'], b['ETM-11']); assert.notEqual(a['ETM-13'], b['ETM-13']);
  const c = testHashes(SPEC.replace('shared = 1', 'shared = 2'));
  assert.notEqual(a['ETM-11'], c['ETM-11']);
});

test('selected: -g as regex over titles; null when it maps nothing', () => {
  const t = testsOf(SPEC);
  assert.deepEqual(selected(t, null), ['ETM-11', 'ETM-12', 'ETM-13']);
  assert.deepEqual(selected(t, 'ETM-11|ETM-13'), ['ETM-11', 'ETM-13']);
  assert.equal(selected(t, 'Some describe text'), null);
});

function repo() {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-'));
  const w = (p, t) => { fs.mkdirSync(path.dirname(path.join(pw, p)), { recursive: true }); fs.writeFileSync(path.join(pw, p), t); };
  w('tests/fe/a.spec.ts', SPEC); w('tests/fe/helper.ts', 'export const x = 1;\n');
  const res = (start, rows) => ({ stats: { startTime: new Date(start).toISOString(), duration: 60e3 }, suites: [{ specs: rows.map(([title, status, msg]) => ({ title, tests: [{ results: [{ status, ...(msg ? { error: { message: msg } } : {}) }] }] })) }] });
  const run = (name, start, rows, hashes) => { w(`output/runs/${name}/results.json`, JSON.stringify(res(start, rows))); if (hashes) w(`output/runs/${name}/test-hashes.json`, JSON.stringify(hashes)); };
  const old = new Date('2020-01-01'); // files older than every run
  for (const f of ['tests/fe/a.spec.ts', 'tests/fe/helper.ts']) fs.utimesSync(path.join(pw, f), old, old);
  return { pw, w, run };
}

test('plan: drops the passed and the same-failure tests, rewrites -g for the rest', () => {
  const { pw, run } = repo();
  const h = testHashes(SPEC);
  run('2026-11-26_080000_ETM-1', NOW - 7200e3, [['ETM-11 - one', 'passed'], ['ETM-12 - two', 'skipped'], ['ETM-13 - three', 'failed', 'Timeout menu']], h);
  const p = plan({ key: 'ETM-1', pwRepo: pw, specs: ['tests/fe/a.spec.ts'], grep: null, now: NOW });
  assert.deepEqual(p.keep, []);
  assert.equal(p.drop.length, 3);
  fs.writeFileSync(path.join(pw, 'tests/fe/a.spec.ts'), SPEC.replace('await c()', 'await c2()'));       // fix ETM-13 only
  const q = plan({ key: 'ETM-1', pwRepo: pw, specs: ['tests/fe/a.spec.ts'], grep: null, now: NOW });
  assert.deepEqual(q.keep, ['ETM-13']);
  assert.equal(q.grep, 'ETM-13\\b');
  const r = plan({ key: 'ETM-1', pwRepo: pw, specs: ['tests/fe/a.spec.ts'], grep: null, now: NOW, feChangedAt: NOW });   // new FE build
  assert.equal(r.keep.length, 3);
});

test('history reads newest first and ignores other cards; inputsOf follows relative imports', () => {
  const { pw, run } = repo();
  run('2026-11-25_080000_ETM-1', NOW - 86400e3, [['ETM-11 - one', 'failed', 'x']]);
  run('2026-11-26_080000_ETM-1', NOW - 7200e3, [['ETM-11 - one', 'passed']]);
  run('2026-11-26_090000_ETM-2', NOW - 3600e3, [['ETM-11 - one', 'failed', 'y']]);
  assert.deepEqual(history(path.join(pw, 'output/runs'), 'ETM-1', 'ETM-11').map((x) => x.status), ['passed', 'failed']);
  assert.ok(inputsOf(path.join(pw, 'tests/fe/a.spec.ts'), pw, 'ETM-1').some((f) => f.endsWith('helper.ts')));
});
