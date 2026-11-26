#!/usr/bin/env node
// push-guard.mjs - AI-miss M-1 in code: a Test whose latest recorded run result is not passed (skipped, fixme, Not proven,
// failed, timed out, awaiting confirmation) is never sent to Xray as PASSED, whatever the reason or comment.
// Reads every work/*/run-results.json (written by run-card.mjs) and keeps the newest result per Test key.
// Used by the Xray MCP server (xray_import_results) and xray-toolkit/xray-import.mjs before any status push.
//
//   node tools/push-guard.mjs <KEY>-8679=PASSED <KEY>-8680=FAILED     check a planned push; exit 1 when one is blocked
import { isKey, profile } from './profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OK_FOR_PASS = new Set(['passed', 'flaky']);

/** Newest run result per Test key over all cards: { '<KEY>-1': { status, why, run, t, card } }. */
export function latestResults(root = process.env.PUSH_GUARD_ROOT || ROOT) {
  const work = path.join(root, 'work');
  const best = {};
  let dirs = [];
  try { dirs = fs.readdirSync(work); } catch { return best; }
  for (const d of dirs) {
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(work, d, 'run-results.json'), 'utf8')); } catch { continue; }
    for (const [key, r] of Object.entries(j.tests || {})) {
      if (!best[key] || String(r.t || '') > String(best[key].t || '')) best[key] = { ...r, card: j.card || d };
    }
  }
  return best;
}

/**
 * @param {{ testKey: string, status: string }[]} tests planned push
 * @returns {{ blocked: { testKey: string, result: string, run?: string, card?: string }[], noResult: string[] }}
 *   blocked: PASSED asked but the latest run result is not passed. noResult: PASSED asked and no run result at all
 *   (a manual Test a person did by hand): allowed, but the caller says so.
 */
export function checkPush(tests, results = latestResults()) {
  const blocked = [], noResult = [];
  for (const t of tests) {
    if (String(t.status || '').toUpperCase() !== 'PASSED') continue;
    const r = results[t.testKey];
    if (!r) { noResult.push(t.testKey); continue; }
    if (!OK_FOR_PASS.has(r.status)) blocked.push({ testKey: t.testKey, result: r.why ? `${r.status} (${r.why})` : r.status, run: r.run, card: r.card });
  }
  return { blocked, noResult };
}

export function blockMessage(blocked) {
  return [`push-guard (AI-miss M-1): ${blocked.length} Test(s) cannot be PASSED, their latest run result is not passed:`,
    ...blocked.map((b) => `  ${b.testKey}: ${b.result}${b.run ? ` in run ${b.run}` : ''}${b.card ? ` [${b.card}]` : ''}`),
    'Leave them TO DO or FAILED, or re-run them; a person can do a manual Test through the manual runner. Nothing was sent.'].join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const tests = process.argv.slice(2).map((a) => { const [testKey, status] = a.split('='); return { testKey, status }; });
  if (!tests.length || tests.some((t) => !isKey(t.testKey || '') || !t.status)) {
    console.error(`Usage: node tools/push-guard.mjs ${profile().jira.projectKey}-1234=PASSED [${profile().jira.projectKey}-1235=FAILED ...]`);
    process.exit(2);
  }
  const { blocked, noResult } = checkPush(tests);
  if (noResult.length) console.log(`No run result (allowed, say it is a manual check): ${noResult.join(', ')}`);
  if (blocked.length) { console.log(blockMessage(blocked)); process.exit(1); }
  console.log(`push-guard: ${tests.length} Test(s) OK to push.`);
}
