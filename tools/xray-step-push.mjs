#!/usr/bin/env node
// xray-step-push.mjs - put a manual runner run into Xray STEP BY STEP: per step a status and its picture, then the Test status,
// then read back what Xray shows. Spec: docs/superpowers/specs/2026-11-20-manual-runner-design.md (section 6).
//
//   node tools/xray-step-push.mjs <runDir> --exec ETM-<n> [--only ETM-a,ETM-b] [--apply]
//
// DRY RUN by default (prints the plan, no Xray call). --apply only after the person's yes (state.mjs approve --kind xray-push).
// Reads <runDir>/verdict-<TEST>.json. A Test is left out (and the reason printed) when: it is skipped (e.g. needs Excel),
// a step is still needs-human, a picture is missing or outside the run folder, or Xray's step count differs from the verdict.
// Env: XRAY_CLIENT_ID, XRAY_CLIENT_SECRET (same auth as xray-toolkit/index.mjs), optional XRAY_BASE.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { testStatus, readVerdicts } from './manual/results.mjs';

const XS = { pass: 'PASSED', fail: 'FAILED' };

function inside(root, p) {
  const rel = path.relative(root, p);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * @returns {{ push: { test: string, status: 'PASSED'|'FAILED', steps: { n: number, status: string, picture: string }[] }[], skip: { test: string, why: string }[] }}
 */
export function planPush(verdicts, runDir) {
  const root = fs.realpathSync(runDir);
  const push = [], skip = [];
  for (const v of verdicts) {
    let st;
    try { st = testStatus(v); } catch (e) { skip.push({ test: v.test, why: e.message }); continue; }
    if (v.skipped) { skip.push({ test: v.test, why: v.skipped }); continue; }
    const open = (v.steps || []).filter((s) => s.verdict === 'needs-human').map((s) => s.n);
    if (open.length) { skip.push({ test: v.test, why: `undecided step ${open.join(', ')}` }); continue; }
    if (st !== 'passed' && st !== 'failed') { skip.push({ test: v.test, why: `status ${st}` }); continue; }
    if (v.confirmedBy !== 'user') { skip.push({ test: v.test, why: 'not confirmed by a person (results.mjs --confirm / --decide)' }); continue; }
    const steps = [];
    let why = null;
    for (const s of v.steps) {
      if (!s.picture) { why = `no picture: step ${s.n}`; break; }
      const abs = path.resolve(root, s.picture);
      if (!inside(root, abs)) { why = `picture outside the run folder: step ${s.n} (${s.picture})`; break; }
      if (!fs.existsSync(abs)) { why = `picture missing: step ${s.n} (${s.picture})`; break; }
      const real = fs.realpathSync(abs); // a link that points out of the run folder is outside too
      if (!inside(root, real)) { why = `picture outside the run folder: step ${s.n} (${s.picture})`; break; }
      steps.push({ n: s.n, status: XS[s.verdict], picture: real });
    }
    if (why) { skip.push({ test: v.test, why }); continue; }
    push.push({ test: v.test, status: XS[st === 'passed' ? 'pass' : 'fail'], steps });
  }
  return { push, skip };
}

const jql = (k) => `key = "${String(k).replace(/"/g, '')}"`;

/** One Test into its Test Run of the Test Execution. gql(query, variables) -> data. */
export async function pushOne(gql, execKey, item) {
  const ex = (await gql('query($jql:String!){ getTestExecutions(jql:$jql, limit:1){ results { issueId } } }', { jql: jql(execKey) }))?.getTestExecutions?.results?.[0];
  if (!ex) throw new Error(`Test Execution ${execKey} not found`);
  const t = (await gql('query($jql:String!){ getTests(jql:$jql, limit:1){ results { issueId } } }', { jql: jql(item.test) }))?.getTests?.results?.[0];
  if (!t) throw new Error(`Test ${item.test} not found`);
  const run = (await gql('query($t:[String],$e:[String]){ getTestRuns(testIssueIds:$t, testExecIssueIds:$e, limit:1){ results { id steps { id } } } }',
    { t: [t.issueId], e: [ex.issueId] }))?.getTestRuns?.results?.[0];
  if (!run) throw new Error(`${item.test} is not in ${execKey}`);
  const ids = (run.steps || []).map((s) => s.id);
  if (ids.length !== item.steps.length) return { test: item.test, skipped: `Xray has ${ids.length} steps, verdict has ${item.steps.length}` };
  for (const [i, s] of item.steps.entries()) {
    await gql('mutation($testRunId:String!,$stepId:String!,$status:String!){ updateTestRunStepStatus(testRunId:$testRunId, stepId:$stepId, status:$status){ warnings } }',
      { testRunId: run.id, stepId: ids[i], status: s.status });
    await gql('mutation($testRunId:String!,$stepId:String!,$evidence:[AttachmentDataInput]!){ addEvidenceToTestRunStep(testRunId:$testRunId, stepId:$stepId, evidence:$evidence){ addedEvidence warnings } }',
      { testRunId: run.id, stepId: ids[i], evidence: [{ filename: `${item.test}-step-${s.n}.png`, mimeType: 'image/png', data: fs.readFileSync(s.picture).toString('base64') }] });
  }
  await gql('mutation($id:String!,$status:String!){ updateTestRunStatus(id:$id, status:$status) }', { id: run.id, status: item.status });
  const back = (await gql('query($id:String!){ getTestRunById(id:$id){ status { name } steps { id status { name } evidence { id } } } }', { id: run.id }))?.getTestRunById;
  return { test: item.test, readback: { status: back?.status?.name, steps: (back?.steps || []).map((s) => ({ status: s.status?.name, evidence: (s.evidence || []).length })) } };
}

/** Real Xray Cloud GraphQL (same auth as xray-toolkit/index.mjs). */
export function xrayGql(env = process.env) {
  const base = env.XRAY_BASE || 'https://xray.cloud.getxray.app/api/v2';
  let tok = null;
  return async (query, variables = {}) => {
    if (!tok) {
      if (!env.XRAY_CLIENT_ID || !env.XRAY_CLIENT_SECRET) throw new Error('XRAY_CLIENT_ID / XRAY_CLIENT_SECRET not set');
      const r = await fetch(`${base}/authenticate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: env.XRAY_CLIENT_ID, client_secret: env.XRAY_CLIENT_SECRET }) });
      if (!r.ok) throw new Error(`authenticate ${r.status}: ${await r.text()}`);
      tok = (await r.text()).replace(/^"|"$/g, '');
    }
    const r = await fetch(`${base}/graphql`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ query, variables }) });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`graphql ${r.status}: ${JSON.stringify(body).slice(0, 800)}`);
    if (body.errors) throw new Error(`graphql: ${JSON.stringify(body.errors).slice(0, 800)}`);
    return body.data;
  };
}

export async function main(argv, { gql = null, log = console.log } = {}) {
  const opt = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : '');
  const runDir = argv[0], exec = opt('--exec'), apply = argv.includes('--apply');
  const only = opt('--only') ? new Set(opt('--only').split(',').map((s) => s.trim())) : null;
  if (!runDir || !fs.existsSync(runDir) || !/^ETM-\d+$/.test(exec)) {
    log('usage: node tools/xray-step-push.mjs <runDir> --exec ETM-<n> [--only ETM-a,ETM-b] [--apply]');
    return 2;
  }
  const verdicts = readVerdicts(runDir).filter((v) => !only || only.has(v.test));
  const { push, skip } = planPush(verdicts, runDir);
  log(`${apply ? 'APPLY' : 'DRY RUN (no Xray call; add --apply after the yes)'}: ${push.length} Test(s) to ${exec}, ${skip.length} left out`);
  for (const p of push) log(`  ${p.test} -> ${p.status}  steps ${p.steps.map((s) => `${s.n}:${s.status}`).join(' ')}  (${p.steps.length} picture(s))`);
  for (const s of skip) log(`  ${s.test} not pushed: ${s.why}`);
  if (!apply) return 0;
  const call = gql || xrayGql();
  let bad = 0;
  for (const p of push) {
    try {
      const r = await pushOne(call, exec, p);
      if (r.skipped) { log(`  ${p.test} not pushed: ${r.skipped}`); continue; }
      const b = r.readback;
      const ok = b.status === p.status && b.steps.length === p.steps.length && b.steps.every((s, i) => s.status === p.steps[i].status && s.evidence > 0);
      if (!ok) bad++;
      log(`  ${p.test}: Xray shows ${b.status}, steps ${b.steps.map((s, i) => `${i + 1}:${s.status}/${s.evidence} pic`).join(' ')}${ok ? '' : '  <- DIFFERENT from what was sent'}`);
    } catch (e) { bad++; log(`  ${p.test}: ERROR ${e.message}`); }
  }
  return bad ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(await main(process.argv.slice(2)));
}
