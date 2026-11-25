import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { classify, testsOf } from './run-policy.mjs';

function setup({ spec, dataFile, ran } = {}) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-repo-'));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-root-'));
  fs.mkdirSync(path.join(repo, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'tests', 'a.spec.ts'), spec);
  if (dataFile !== undefined) {
    fs.mkdirSync(path.join(repo, 'scripts', 'seed', 'cards'), { recursive: true });
    fs.writeFileSync(path.join(repo, 'scripts', 'seed', 'cards', 'ETM-1.data.cjs'), dataFile);
  }
  if (ran) {
    fs.mkdirSync(path.join(root, 'work', 'ETM-1'), { recursive: true });
    fs.writeFileSync(path.join(root, 'work', 'ETM-1', 'run-results.json'), JSON.stringify({ tests: Object.fromEntries(ran.map((k) => [k, { status: 'failed' }])) }));
  }
  return { repo, root };
}
const SPEC = `test.describe('Card (ETM-1)', () => {
  test('ETM-11 - reads @readonly', async () => {});
  test('ETM-12 - saves', async () => {});
});`;
const run = (o, grep, flags) => classify({ key: 'ETM-1', specs: ['tests'], grep, flags, ...o });

test('testsOf reads titles and describe tags', () => {
  const t = testsOf(`test.describe('X @dailyreport', () => { test('ETM-5 - a @readonly', () => {}); test("ETM-6 - b", () => {}); });`);
  assert.deepEqual(t.map((x) => x.title), ['ETM-5 - a @readonly', 'ETM-6 - b']);
  assert.ok(t[1].tags.has('@dailyreport'));
  assert.ok(t[0].tags.has('@readonly'));
});

test('B: only @readonly tests -> auto; a new saving test -> ask', () => {
  const o = setup({ spec: SPEC });
  assert.equal(run(o, 'ETM-11').auto, true);
  const r = run(o, 'ETM-11|ETM-12');
  assert.equal(r.auto, false);
  assert.match(r.reasons[0], /ETM-12/);
});

test('C: re-run of tests that ran before -> auto', () => {
  const o = setup({ spec: SPEC, ran: ['ETM-12'] });
  assert.equal(run(o, 'ETM-12').auto, true);
});

test('A: card data file -> auto, create:true says so', () => {
  const o = setup({ spec: SPEC, dataFile: 'module.exports = { create: true }' });
  const r = run(o);
  assert.equal(r.auto, true);
  assert.match(r.reasons[0], /makes and deletes/);
});

test('@shared-data, @security, --no-data-check and no match always ask', () => {
  const o = setup({ spec: `test.describe('(ETM-1)', () => {\n test('ETM-13 - activate plan @shared-data', () => {});\n test('ETM-14 - api @security', () => {});\n});`, dataFile: '' });
  assert.match(run(o, 'ETM-13').reasons[0], /shared-data/);
  assert.match(run(o, 'ETM-14').reasons[0], /security/);
  assert.equal(run(setup({ spec: SPEC, dataFile: '' }), '', ['--no-data-check']).auto, false);
  assert.match(run(o, 'ETM-99').reasons[0], /no test matches/);
});

test('A covers only tests of this card; another card\'s new test asks', () => {
  const o = setup({ spec: SPEC, dataFile: '' });
  fs.writeFileSync(path.join(o.repo, 'tests', 'b.spec.ts'), `test.describe('Other (ETM-2)', () => {\n test('ETM-21 - x', async () => {});\n});`);
  const r = run(o);
  assert.equal(r.auto, false);
  assert.match(r.reasons[0], /ETM-21/);
});

import { classifyManual } from './run-policy.mjs';
function manualRoot(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-man-'));
  fs.mkdirSync(path.join(root, 'work', 'ETM-1'), { recursive: true });
  for (const [n, t] of Object.entries(files)) fs.writeFileSync(path.join(root, 'work', 'ETM-1', n), t);
  return root;
}
const STEPS = `# steps\n\n## ETM-11 - reads only (3 steps)\nwrites data: no\nrole: turnaroundManager\n| # | Do |\n\n## ETM-12 - saves (2 steps)\nwrites data: yes\n\n## ETM-13 - excel\nwrites data: no\nneeds: excel\n\n## ETM-14 - no line\nrole: x\n`;
test('manual: read-only Tests are auto', () => {
  const r = classifyManual({ key: 'ETM-1', tests: ['ETM-11'], root: manualRoot({ 'manual-steps-a.md': STEPS }) });
  assert.equal(r.auto, true);
});
test('manual: a Test that writes, needs Excel, has no writes line or no section asks', () => {
  const root = manualRoot({ 'manual-steps-a.md': STEPS });
  for (const t of ['ETM-12', 'ETM-13', 'ETM-14', 'ETM-99']) assert.equal(classifyManual({ key: 'ETM-1', tests: ['ETM-11', t], root }).auto, false, t);
  assert.match(classifyManual({ key: 'ETM-1', tests: ['ETM-99'], root }).reasons[0], /write one with "writes data: no"/);
});
