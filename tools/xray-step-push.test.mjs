import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planPush, pushOne, main } from './xray-step-push.mjs';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
function runDir(test = 'ETM-2', n = 6) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xsp-'));
  fs.mkdirSync(path.join(dir, 'evidence', test), { recursive: true });
  for (let i = 1; i <= n; i++) fs.writeFileSync(path.join(dir, 'evidence', test, `step-${i}.png`), PNG);
  return dir;
}
const verdict = (verdicts, test = 'ETM-2') => ({ key: 'ETM-1', test, title: 't', role: 'turnaroundManager', actions: [], confirmedBy: 'user',
  steps: verdicts.map((v, i) => ({ n: i + 1, do: 'd', expected: 'e', verdict: v, why: 'w', picture: `evidence/${test}/step-${i + 1}.png` })) });

// fake Xray GraphQL: records every call, answers lookups, keeps step statuses for the read back
function fakeGql(stepCount = 6) {
  const calls = [];
  const run = { id: 'run-1', status: 'TODO', steps: Array.from({ length: stepCount }, (_, i) => ({ id: `s${i + 1}`, status: 'TODO', evidence: [] })) };
  const gql = async (query, vars) => {
    calls.push({ query, vars });
    if (/getTestExecutions/.test(query)) return { getTestExecutions: { results: [{ issueId: '900' }] } };
    if (/getTests\(/.test(query)) return { getTests: { results: [{ issueId: '200' }] } };
    if (/getTestRuns\(/.test(query)) return { getTestRuns: { results: [{ id: run.id, steps: run.steps.map((s) => ({ id: s.id })) }] } };
    if (/updateTestRunStepStatus/.test(query)) { run.steps.find((s) => s.id === vars.stepId).status = vars.status; return { updateTestRunStepStatus: { warnings: [] } }; }
    if (/addEvidenceToTestRunStep/.test(query)) { run.steps.find((s) => s.id === vars.stepId).evidence.push({ id: 'e' }); return { addEvidenceToTestRunStep: { addedEvidence: ['e'], warnings: [] } }; }
    if (/updateTestRunStatus/.test(query)) { run.status = vars.status; return { updateTestRunStatus: null }; }
    if (/getTestRunById/.test(query)) return { getTestRunById: { status: { name: run.status }, steps: run.steps.map((s) => ({ id: s.id, status: { name: s.status }, evidence: s.evidence })) } };
    throw new Error(`unexpected query ${query}`);
  };
  return { gql, calls, run };
}
const count = (calls, re) => calls.filter((c) => re.test(c.query)).length;

test('a Test with an undecided needs-human step is skipped: undecided step 4', () => {
  const dir = runDir();
  const p = planPush([verdict(['pass', 'pass', 'pass', 'needs-human', 'pass', 'pass'])], dir);
  assert.equal(p.push.length, 0);
  assert.deepEqual(p.skip, [{ test: 'ETM-2', why: 'undecided step 4' }]);
});

test('a picture path outside the run folder is skipped, nothing pushed', () => {
  const dir = runDir();
  const outside = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'other-')), 'step-1.png');
  fs.writeFileSync(outside, PNG);
  for (const pic of [outside, '../elsewhere/step-1.png']) {
    const v = verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass']);
    v.steps[0].picture = pic;
    const p = planPush([v], dir);
    assert.equal(p.push.length, 0);
    assert.match(p.skip[0].why, /picture outside the run folder/);
  }
});

test('a missing picture file is skipped', () => {
  const dir = runDir('ETM-2', 5);
  const p = planPush([verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass'])], dir);
  assert.equal(p.push.length, 0);
  assert.match(p.skip[0].why, /picture missing: step 6/);
});

test('a skipped Test (needs Excel) is not pushed', () => {
  const p = planPush([{ ...verdict([]), skipped: 'needs Excel (desktop), stays manual' }], runDir());
  assert.deepEqual(p.skip, [{ test: 'ETM-2', why: 'needs Excel (desktop), stays manual' }]);
});

test('passed and failed Tests are planned with per-step statuses and pictures inside the run folder', () => {
  const dir = runDir();
  const p = planPush([verdict(['pass', 'fail', 'pass', 'pass', 'pass', 'pass'])], dir);
  assert.equal(p.push[0].status, 'FAILED');
  assert.deepEqual(p.push[0].steps.map((s) => s.status), ['PASSED', 'FAILED', 'PASSED', 'PASSED', 'PASSED', 'PASSED']);
  assert.equal(p.push[0].steps[0].picture, path.join(fs.realpathSync(dir), 'evidence', 'ETM-2', 'step-1.png'));
});

test('pushOne on a passed 6-step Test: 6 step statuses, 6 pictures, then run status PASSED; read back', async () => {
  const dir = runDir();
  const item = planPush([verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass'])], dir).push[0];
  const f = fakeGql(6);
  const r = await pushOne(f.gql, 'ETM-9', item);
  assert.equal(count(f.calls, /updateTestRunStepStatus/), 6);
  assert.equal(count(f.calls, /addEvidenceToTestRunStep/), 6);
  const runStatus = f.calls.filter((c) => /updateTestRunStatus/.test(c.query));
  assert.equal(runStatus.length, 1);
  assert.equal(runStatus[0].vars.status, 'PASSED');
  const lastWrite = f.calls.map((c) => c.query).findLastIndex((q) => /mutation/.test(q));
  assert.ok(/updateTestRunStatus/.test(f.calls[lastWrite].query), 'the run status is the last write');
  const ev = f.calls.find((c) => /addEvidenceToTestRunStep/.test(c.query)).vars.evidence[0];
  assert.equal(ev.mimeType, 'image/png');
  assert.equal(ev.data, PNG.toString('base64'));
  assert.equal(r.test, 'ETM-2');
  assert.equal(r.readback.status, 'PASSED');
  assert.deepEqual(r.readback.steps.map((s) => s.evidence), [1, 1, 1, 1, 1, 1]);
});

test('pushOne: Xray step count different from the verdict -> skipped, no write', async () => {
  const item = planPush([verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass'])], runDir()).push[0];
  const f = fakeGql(5);
  const r = await pushOne(f.gql, 'ETM-9', item);
  assert.equal(r.skipped, 'Xray has 5 steps, verdict has 6');
  assert.equal(count(f.calls, /mutation/), 0);
});

test('CLI without --apply prints the plan and makes no gql call', async () => {
  const dir = runDir();
  fs.writeFileSync(path.join(dir, 'verdict-ETM-2.json'), JSON.stringify(verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass'])));
  const f = fakeGql(6), lines = [];
  const code = await main([dir, '--exec', 'ETM-9'], { gql: f.gql, log: (m) => lines.push(m) });
  assert.equal(code, 0);
  assert.equal(f.calls.length, 0);
  assert.match(lines.join('\n'), /DRY RUN/);
  assert.match(lines.join('\n'), /ETM-2 -> PASSED/);
});

test('CLI with --apply and --only pushes only the named Test and prints why the others were left out', async () => {
  const dir = runDir();
  fs.mkdirSync(path.join(dir, 'evidence', 'ETM-3'));
  for (let i = 1; i <= 6; i++) fs.writeFileSync(path.join(dir, 'evidence', 'ETM-3', `step-${i}.png`), PNG);
  fs.writeFileSync(path.join(dir, 'verdict-ETM-2.json'), JSON.stringify(verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass'])));
  fs.writeFileSync(path.join(dir, 'verdict-ETM-3.json'), JSON.stringify(verdict(['pass', 'pass', 'pass', 'needs-human', 'pass', 'pass'], 'ETM-3')));
  const f = fakeGql(6), lines = [];
  const code = await main([dir, '--exec', 'ETM-9', '--apply'], { gql: f.gql, log: (m) => lines.push(m) });
  assert.equal(code, 0);
  assert.equal(count(f.calls, /updateTestRunStatus/), 1);
  assert.match(lines.join('\n'), /ETM-3 not pushed: undecided step 4/);
  const g = fakeGql(6);
  await main([dir, '--exec', 'ETM-9', '--apply', '--only', 'ETM-3'], { gql: g.gql, log: () => {} });
  assert.equal(count(g.calls, /mutation/), 0);
});

test('a Test the person has not confirmed is not pushed', () => {
  const dir = runDir();
  const v = verdict(['pass', 'pass', 'pass', 'pass', 'pass', 'pass']);
  delete v.confirmedBy;
  const p = planPush([v], dir);
  assert.equal(p.push.length, 0);
  assert.deepEqual(p.skip, [{ test: 'ETM-2', why: 'not confirmed by a person (results.mjs --confirm / --decide)' }]);
});
