// results.mjs - the manual runner's verdict files -> a Playwright-JSON results.json the existing tools read
// (run-card --build-only, evidence-report-v4.mjs). Spec: docs/superpowers/specs/2026-11-20-manual-runner-design.md (5, 6).
//
//   node tools/manual/results.mjs <runDir> [--decide <TEST> <n>=pass|fail[:answer text] ...] [--confirm <TEST> ...]
//
// <runDir>/verdict-<TEST>.json (written by the agent):
//   { key, test, title, role, skipped?, steps: [{ n, do, expected, verdict: pass|fail|needs-human, why, picture, decidedBy?, answer? }], actions: [] }
// `picture` is a path relative to the run folder (evidence/<TEST>/step-<n>.png).
// --decide writes the person's answers into the verdict file (decidedBy: "user", and the Test confirmedBy: "user"); --confirm marks a Test
// confirmed as proposed ("ยืนยันผลทั้งหมด", refused while a step is needs-human). Then results.json is rebuilt from all verdict files.
// Only a confirmed Test counts as a result (run-results.json) and can be pushed (xray-step-push.mjs).
import { isKey } from '../profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const VERDICTS = ['pass', 'fail', 'needs-human'];

function checkSteps(v) {
  for (const s of v.steps || []) if (!VERDICTS.includes(s.verdict)) throw new Error(`${v.test} step ${s.n}: verdict "${s.verdict}" is not ${VERDICTS.join(' | ')}`);
}

/** passed only when every step is pass; any fail -> failed; else (an undecided needs-human, a skip, no steps) skipped. */
export function testStatus(v) {
  checkSteps(v);
  if (v.skipped) return 'skipped';
  const steps = v.steps || [];
  if (steps.some((s) => s.verdict === 'fail')) return 'failed';
  if (!steps.length || steps.some((s) => s.verdict !== 'pass')) return 'skipped';
  return 'passed';
}

const undecided = (v) => (v.steps || []).filter((s) => s.verdict === 'needs-human');

function specFor(v, runDir) {
  const status = testStatus(v);
  const annotations = v.skipped ? [{ type: 'needs-manual', description: v.skipped }]
    : status === 'skipped' ? [{ type: 'needs-manual', description: undecided(v).length
      ? undecided(v).map((s) => `step ${s.n} needs a person: ${s.why || ''}`.trim()).join(' | ')
      : 'no steps were done' }]
      : [];
  // proposed by the agent, not yet confirmed by a person: run-results.json records it as skipped, the push leaves it out
  if (status !== 'skipped' && v.confirmedBy !== 'user') annotations.push({ type: 'awaiting-confirmation', description: 'proposed by the browser agent, not yet confirmed by a person' });
  const steps = (v.steps || []).map((s) => ({
    title: `${s.n}. ${s.do || ''}`.trim(), duration: 0, manualVerdict: s.verdict, ...(s.verdict === 'needs-human' ? { why: s.why || '' } : {}),
    ...(s.verdict === 'fail' ? { error: { message: s.why || 'failed' } } : {}),
  }));
  const attachments = (v.steps || []).filter((s) => s.picture).map((s) => ({
    name: `Step ${s.n}: ${s.picture}`, contentType: 'image/png', path: path.isAbsolute(s.picture) ? s.picture : path.join(runDir, s.picture),
  }));
  const failed = (v.steps || []).find((s) => s.verdict === 'fail');
  const result = {
    workerIndex: 0, status, duration: 0, retry: 0, startTime: new Date(0).toISOString(), steps, attachments, annotations,
    errors: failed ? [{ message: `${failed.n}. ${failed.why || 'failed'}` }] : [],
    ...(failed ? { error: { message: `${failed.n}. ${failed.why || 'failed'}` } } : {}),
  };
  return {
    title: `${v.test} - ${v.title || ''}`.trim(), ok: status !== 'failed', tags: [], file: 'manual-runner', line: 0, column: 0,
    tests: [{ projectName: 'manual-runner', expectedStatus: status === 'skipped' ? 'skipped' : 'passed', annotations,
      status: status === 'passed' ? 'expected' : status === 'failed' ? 'unexpected' : 'skipped', results: [result] }],
  };
}

/** Playwright JSON reporter shape: one suite for the card, one spec per Test. */
export function toResults(verdicts, runDir) {
  const key = verdicts[0]?.key || '';
  return {
    config: { source: 'manual-agent' },
    suites: [{ title: `Manual run (${key})`, file: 'manual-runner', line: 0, column: 0, specs: verdicts.map((v) => specFor(v, runDir)), suites: [] }],
    errors: [],
    stats: { expected: verdicts.filter((v) => testStatus(v) === 'passed').length, unexpected: verdicts.filter((v) => testStatus(v) === 'failed').length,
      skipped: verdicts.filter((v) => testStatus(v) === 'skipped').length, flaky: 0, duration: 0, startTime: new Date(0).toISOString() },
  };
}

/** The person's answers for needs-human (or any) steps. Returns a new Verdict; refuses a step that does not exist. */
export function applyDecisions(v, answers) {
  const out = structuredClone(v);
  for (const a of answers) {
    if (a.verdict !== 'pass' && a.verdict !== 'fail') throw new Error(`${v.test} step ${a.n}: a decision is pass or fail, not "${a.verdict}"`);
    const s = out.steps.find((x) => x.n === Number(a.n));
    if (!s) throw new Error(`${v.test} has no step ${a.n} (it has ${out.steps.length})`);
    s.verdict = a.verdict; s.decidedBy = 'user'; s.answer = a.answer ?? a.verdict;
  }
  out.confirmedBy = 'user'; // the person looked at this Test and answered
  return out;
}

/** The person confirmed the Test as proposed ("ยืนยันผลทั้งหมด"). Refused while a step is still needs-human. */
export function confirm(v) {
  const open = undecided(v).map((s) => s.n);
  if (open.length) throw new Error(`${v.test}: step ${open.join(', ')} still needs-human: answer it with --decide first`);
  return { ...structuredClone(v), confirmedBy: 'user' };
}

export function readVerdicts(runDir) {
  return fs.readdirSync(runDir).filter((f) => /^verdict-ETM-\d+\.json$/.test(f)).sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(runDir, f), 'utf8')));
}

function parseDecide(argv) {
  const by = new Map();
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] !== '--decide') continue;
    const test = argv[++i];
    if (!isKey(test || '')) throw new Error('--decide <TEST> <n>=pass|fail[:answer] ...');
    const list = by.get(test) || [];
    while (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      const m = argv[++i].match(/^(\d+)=(pass|fail)(?::(.*))?$/);
      if (!m) throw new Error(`bad decision "${argv[i]}" (use 4=pass or 4=fail:reason)`);
      list.push({ n: Number(m[1]), verdict: m[2], answer: m[3] ?? m[2] });
    }
    if (!list.length) throw new Error(`--decide ${test}: no <n>=pass|fail given`);
    by.set(test, list);
  }
  return by;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [runDir, ...rest] = process.argv.slice(2);
    if (!runDir || !fs.existsSync(runDir)) throw new Error('usage: node tools/manual/results.mjs <runDir> [--decide <TEST> <n>=pass|fail ...]');
    for (const test of rest.flatMap((a, i) => (a === '--confirm' ? [rest[i + 1]] : []))) {
      const f = path.join(runDir, `verdict-${test}.json`);
      if (!isKey(test || '') || !fs.existsSync(f)) throw new Error(`--confirm ${test}: no ${f}`);
      // confirmed as proposed = the person accepts the agent's reading: only after a fresh blind evidence check (TEAM.md "Decision cards")
      const card = JSON.parse(fs.readFileSync(f, 'utf8')).key;
      const { gate } = await import('../evidence-check.mjs');
      const g = isKey(card || '') ? gate(card, test) : { ok: false, why: 'the verdict file has no Story key' };
      if (!g.ok) throw new Error(`--confirm ${test}: no fresh evidence check (${g.why}). Run evidence-check brief --manual, the evidence-checker, compare; or answer the steps with --decide`);
      fs.writeFileSync(f, JSON.stringify(confirm(JSON.parse(fs.readFileSync(f, 'utf8'))), null, 1) + '\n');
    }
    for (const [test, answers] of parseDecide(rest)) {
      const f = path.join(runDir, `verdict-${test}.json`);
      if (!fs.existsSync(f)) throw new Error(`no ${f}`);
      fs.writeFileSync(f, JSON.stringify(applyDecisions(JSON.parse(fs.readFileSync(f, 'utf8')), answers), null, 1) + '\n');
    }
    const verdicts = readVerdicts(runDir);
    if (!verdicts.length) throw new Error(`no verdict-ETM-*.json in ${runDir}`);
    fs.writeFileSync(path.join(runDir, 'results.json'), JSON.stringify(toResults(verdicts, path.resolve(runDir)), null, 1) + '\n');
    for (const v of verdicts) {
      const st = testStatus(v), p = (v.steps || []).filter((s) => s.verdict === 'pass').length;
      const nh = undecided(v).map((s) => `step ${s.n} needs-human: ${s.why || ''}`);
      console.log(`${v.test}: ${st}${v.skipped ? ` (${v.skipped})` : ` (${p}/${(v.steps || []).length} pass${nh.length ? `; ${nh.join('; ')}` : ''})`}`);
    }
    console.log(`results.json -> ${path.join(runDir, 'results.json')}`);
  } catch (e) {
    console.error(`[manual results] ${e.message}`);
    process.exit(2);
  }
}
