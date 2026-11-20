import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { testStatus, toResults, applyDecisions } from './results.mjs';
import { recordRunResults, sourceOf } from '../run-results.mjs';
import { scriptQuality } from '../sprint-metrics.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const step = (n, verdict, why = 'ok') => ({ n, do: `do ${n}`, expected: `see ${n}`, verdict, why, picture: `evidence/ETM-2/step-${n}.png` });
const verdict = (verdicts, extra = {}) => ({ key: 'ETM-1', test: 'ETM-2', title: 'PDF lines', role: 'turnaroundManager', steps: verdicts.map((v, i) => step(i + 1, v, v === 'pass' ? 'seen' : `reason ${i + 1}`)), actions: [], ...extra });
const specOf = (r) => r.suites[0].specs[0];

test('all pass -> passed', () => assert.equal(testStatus(verdict(['pass', 'pass', 'pass'])), 'passed'));

test('one fail -> failed, and the failed step carries why as error.message', () => {
  const v = verdict(['pass', 'fail', 'pass']);
  assert.equal(testStatus(v), 'failed');
  const t = specOf(toResults([v], '/run')).tests[0];
  assert.equal(t.results[0].status, 'failed');
  assert.equal(t.results[0].steps[1].error.message, 'reason 2');
  assert.equal(t.results[0].steps[0].error, undefined);
});

test('fail wins over an undecided needs-human', () => assert.equal(testStatus(verdict(['needs-human', 'fail'])), 'failed'));

test('one needs-human -> skipped with annotation needs-manual', () => {
  const v = verdict(['pass', 'pass', 'pass', 'needs-human']);
  assert.equal(testStatus(v), 'skipped');
  const t = specOf(toResults([v], '/run')).tests[0];
  assert.equal(t.status, 'skipped');
  assert.equal(t.results[0].status, 'skipped');
  const a = t.annotations.find((x) => x.type === 'needs-manual');
  assert.ok(a);
  assert.match(a.description, /step 4/);
});

test('skipped: needs Excel -> skipped with that description', () => {
  const v = { key: 'ETM-1', test: 'ETM-3', title: 'Excel paste', role: 'turnaroundManager', skipped: 'needs Excel (desktop), stays manual', steps: [], actions: [] };
  assert.equal(testStatus(v), 'skipped');
  const t = specOf(toResults([v], '/run')).tests[0];
  assert.deepEqual(t.annotations, [{ type: 'needs-manual', description: 'needs Excel (desktop), stays manual' }]);
});

test('spec titled "<TEST> - <title>", steps "<n>. <do>", attachments "Step <n>: ..." with a path inside the run folder', () => {
  const r = toResults([verdict(['pass', 'pass'])], '/run');
  const sp = specOf(r);
  assert.equal(sp.title, 'ETM-2 - PDF lines');
  assert.match(r.suites[0].title, /\(ETM-1\)/);
  const res = sp.tests[0].results[0];
  assert.deepEqual(res.steps.map((s) => s.title), ['1. do 1', '2. do 2']);
  assert.equal(res.attachments.length, 2);
  for (const a of res.attachments) { assert.match(a.name, /^Step \d+:/); assert.equal(a.contentType, 'image/png'); }
  assert.equal(res.attachments[0].path, path.join('/run', 'evidence', 'ETM-2', 'step-1.png'));
});

test('applyDecisions: the person answers step 4 pass -> passed, decidedBy user', () => {
  const v = verdict(['pass', 'pass', 'pass', 'needs-human', 'pass', 'pass']);
  const d = applyDecisions(v, [{ n: 4, verdict: 'pass', answer: '8693 step 4 pass' }]);
  assert.equal(testStatus(d), 'passed');
  assert.equal(d.steps[3].decidedBy, 'user');
  assert.equal(d.steps[3].answer, '8693 step 4 pass');
  assert.equal(v.steps[3].verdict, 'needs-human', 'the input is not changed');
});

test('applyDecisions: step 9 of a 6-step Test throws; a verdict other than pass/fail throws', () => {
  const v = verdict(['pass', 'pass', 'pass', 'needs-human', 'pass', 'pass']);
  assert.throws(() => applyDecisions(v, [{ n: 9, verdict: 'pass' }]), /step 9/);
  assert.throws(() => applyDecisions(v, [{ n: 4, verdict: 'needs-human' }]), /pass or fail/);
});

test('an unknown step verdict is refused', () => assert.throws(() => testStatus(verdict(['ok'])), /verdict/));

test('CLI: --decide writes the verdict file and results.json', () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  fs.writeFileSync(path.join(run, 'verdict-ETM-2.json'), JSON.stringify(verdict(['pass', 'needs-human'])));
  const r = spawnSync(process.execPath, [path.join(HERE, 'results.mjs'), run, '--decide', 'ETM-2', '2=fail:line 12 px left'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const v = JSON.parse(fs.readFileSync(path.join(run, 'verdict-ETM-2.json'), 'utf8'));
  assert.equal(v.steps[1].verdict, 'fail');
  assert.equal(v.steps[1].decidedBy, 'user');
  assert.equal(v.steps[1].answer, 'line 12 px left');
  const res = JSON.parse(fs.readFileSync(path.join(run, 'results.json'), 'utf8'));
  assert.equal(specOf(res).tests[0].results[0].status, 'failed');
});

test('recordRunResults writes source manual-agent for a _manual run folder, none for a script run', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rr-'));
  const rows = [{ title: 'ETM-2 - PDF lines', status: 'passed' }];
  assert.equal(sourceOf('/x/2026-11-20_101500_ETM-1_manual'), 'manual-agent');
  assert.equal(sourceOf('/x/2026-11-20_101500_ETM-1'), undefined);
  recordRunResults({ root, key: 'ETM-1', rows, resultsDir: '/x/2026-11-20_101500_ETM-1_manual' });
  let j = JSON.parse(fs.readFileSync(path.join(root, 'work', 'ETM-1', 'run-results.json'), 'utf8'));
  assert.equal(j.tests['ETM-2'].source, 'manual-agent');
  assert.equal(j.tests['ETM-2'].status, 'passed');
  recordRunResults({ root, key: 'ETM-1', rows, resultsDir: '/x/2026-11-20_111500_ETM-1' });
  j = JSON.parse(fs.readFileSync(path.join(root, 'work', 'ETM-1', 'run-results.json'), 'utf8'));
  assert.equal(j.tests['ETM-2'].source, undefined);
});

test('scriptQuality counts proven ACs whose latest result came from the browser agent', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sq-'));
  fs.mkdirSync(path.join(work, 'ETM-1'));
  fs.writeFileSync(path.join(work, 'ETM-1', 'ac-strength.json'), JSON.stringify({ ac: [
    { id: 'AC-1', rating: 'strong', tests: ['ETM-2'] }, { id: 'AC-2', rating: 'strong', tests: ['ETM-3'] }, { id: 'AC-3', rating: 'strong', tests: ['ETM-4'] }] }));
  fs.writeFileSync(path.join(work, 'ETM-1', 'run-results.json'), JSON.stringify({ tests: {
    'ETM-2': { status: 'passed', source: 'manual-agent' }, 'ETM-3': { status: 'passed' }, 'ETM-4': { status: 'skipped', source: 'manual-agent' } } }));
  const [q] = scriptQuality([{ sprint: 26, active: true, stories: ['ETM-1'] }], work, path.join(work, 'none.jsonl'));
  assert.equal(q.ac.proven, 2);
  assert.equal(q.ac.provenManual, 1);
});

test('the evidence report built from a manual run folder shows the step pictures and the needs-manual Test as skipped', () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-rep-'));
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
  fs.mkdirSync(path.join(run, 'evidence', 'ETM-2'), { recursive: true });
  for (const n of [1, 2]) fs.writeFileSync(path.join(run, 'evidence', 'ETM-2', `step-${n}.png`), png);
  const a = verdict(['pass', 'pass']);
  const b = { ...verdict(['pass', 'needs-human']), test: 'ETM-3', title: 'Ramp line' };
  fs.writeFileSync(path.join(run, 'results.json'), JSON.stringify(toResults([a, b], run)));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  const r = spawnSync(process.execPath, [path.join(HERE, '..', 'evidence-report-v4.mjs'), '--input', path.join(run, 'results.json'), '--out', out, '--title', 't'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /2 tests: 1 pass, 0 fail, 1 skip/);
  const html = fs.readFileSync(path.join(out, fs.readdirSync(out).find((f) => f.endsWith('.html'))), 'utf8');
  const t2 = html.slice(html.indexOf('id="t-ETM-2"'));
  assert.equal((t2.slice(0, t2.indexOf('</details>')).match(/data:image\/png;base64/g) || []).length, 2, 'two step pictures of ETM-2');
  assert.match(html, /id="t-ETM-3"[^]*?badge skipped/);
});

// ---- final review fixes: nothing counts before a person confirmed it; the report shows each step's own verdict
import { rowsFromResults } from '../run-results.mjs';
import { confirm } from './results.mjs';

test('an unconfirmed Test carries the awaiting-confirmation annotation; confirm() and applyDecisions() mark it confirmed', () => {
  const v = verdict(['pass', 'pass']);
  assert.ok(specOf(toResults([v], '/run')).tests[0].annotations.some((a) => a.type === 'awaiting-confirmation'));
  const c = confirm(v);
  assert.equal(c.confirmedBy, 'user');
  assert.ok(!specOf(toResults([c], '/run')).tests[0].annotations.some((a) => a.type === 'awaiting-confirmation'));
  assert.equal(applyDecisions(verdict(['pass', 'needs-human']), [{ n: 2, verdict: 'pass' }]).confirmedBy, 'user');
  assert.equal(v.confirmedBy, undefined, 'the input is not changed');
});

test('confirm() refuses a Test with a needs-human step still open', () => {
  assert.throws(() => confirm(verdict(['pass', 'needs-human'])), /step 2/);
});

test('rowsFromResults + recordRunResults: an unconfirmed manual pass is recorded skipped awaiting-confirmation, a confirmed one passed', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rr2-'));
  const a = verdict(['pass', 'pass']);
  const b = confirm({ ...verdict(['pass', 'pass']), test: 'ETM-3' });
  const rows = rowsFromResults(toResults([a, b], '/run'), () => 'precondition');
  recordRunResults({ root, key: 'ETM-1', rows, resultsDir: '/x/2026-11-20_101500_ETM-1_manual', log: () => {} });
  const j = JSON.parse(fs.readFileSync(path.join(root, 'work', 'ETM-1', 'run-results.json'), 'utf8'));
  assert.equal(j.tests['ETM-2'].status, 'skipped');
  assert.equal(j.tests['ETM-2'].why, 'awaiting-confirmation');
  assert.equal(j.tests['ETM-3'].status, 'passed');
});

test('CLI --confirm writes confirmedBy into the verdict file', () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-c-'));
  fs.writeFileSync(path.join(run, 'verdict-ETM-2.json'), JSON.stringify(verdict(['pass', 'pass'])));
  const r = spawnSync(process.execPath, [path.join(HERE, 'results.mjs'), run, '--confirm', 'ETM-2'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(fs.readFileSync(path.join(run, 'verdict-ETM-2.json'), 'utf8')).confirmedBy, 'user');
});

test('the report shows each manual step by its own verdict: needs-human is not "ผ่าน", a step after a fail is not "ไม่ได้รัน"', () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-rep2-'));
  const v = verdict(['pass', 'fail', 'pass', 'needs-human']);
  fs.writeFileSync(path.join(run, 'results.json'), JSON.stringify(toResults([v], run)));
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out2-'));
  const r = spawnSync(process.execPath, [path.join(HERE, '..', 'evidence-report-v4.mjs'), '--input', path.join(run, 'results.json'), '--out', out, '--title', 't'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const html = fs.readFileSync(path.join(out, fs.readdirSync(out).find((f) => f.endsWith('.html'))), 'utf8');
  const badges = [...html.matchAll(/<span class="badge (\w+)">([^<]*)<\/span><\/td>|<td><span class="badge (\w+)">/g)].map((m) => m[1] || m[3]);
  const rowBadges = [...html.matchAll(/<td><span class="badge (\w+)">/g)].map((m) => m[1]);
  assert.deepEqual(rowBadges, ['passed', 'failed', 'passed', 'needshuman'], badges.join(','));
  assert.match(html, /รอคนตัดสิน/);
});

test('scriptQuality: a manual-agent line in quality.jsonl does not replace the card\'s latest script run', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sq2-'));
  const q = path.join(work, 'quality.jsonl');
  fs.writeFileSync(q, [
    JSON.stringify({ t: '2026-11-20T08:00:00Z', card: 'ETM-1', ran: 20, passed: 18 }),
    JSON.stringify({ t: '2026-11-20T09:00:00Z', card: 'ETM-1', ran: 2, passed: 2, source: 'manual-agent' }),
  ].join('\n') + '\n');
  const [r] = scriptQuality([{ sprint: 26, active: true, stories: ['ETM-1'] }], work, q);
  assert.equal(r.ran, 20);
  assert.equal(r.passed, 18);
});
