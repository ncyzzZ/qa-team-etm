// run-results.mjs - result per Xray test key, merged over runs: work/<KEY>/run-results.json (read by `qa-check strength`
// for "AC proven" and by sprint-metrics). Used by run-card.mjs after every run and every --build-only.
// A key keeps its newest result; a run with -g only updates the keys it ran. Worst result wins inside one run.
// A run folder whose name ends with `_manual` (the manual runner, a person confirmed the steps) is marked source "manual-agent".
import fs from 'node:fs';
import path from 'node:path';

const RANK = { failed: 0, timedOut: 0, interrupted: 0, flaky: 1, skipped: 2, passed: 3 };

/** "manual-agent" for a manual runner run folder (<date_time>_<KEY>_manual), else undefined (a script run). */
export const sourceOf = (resultsDir) => (/_manual$/.test(path.basename(path.resolve(resultsDir))) ? 'manual-agent' : undefined);

/**
 * One row per test of a Playwright JSON results file (newest attempt; flaky = passed after a failed attempt).
 * `awaiting`: a manual runner Test the person has not confirmed yet (annotation awaiting-confirmation).
 */
export function rowsFromResults(r, skipKind) {
  const rows = [];
  (function walk(s) {
    (s.specs || []).forEach((sp) => sp.tests.forEach((t) => {
      const x = t.results[t.results.length - 1];
      const flaky = x.status === 'passed' && t.results.some((y) => y.status === 'failed' || y.status === 'timedOut');
      const ann = t.annotations || x.annotations || [];
      rows.push({ title: sp.title, status: flaky ? 'flaky' : x.status, why: skipKind(ann), awaiting: ann.some((a) => a.type === 'awaiting-confirmation'),
        msg: ((x.error && x.error.message) || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 160) });
    }));
    (s.suites || []).forEach(walk);
  })(r);
  return rows;
}

/**
 * @param {{ root: string, key: string, rows: { title: string, status: string, why?: string }[], resultsDir: string, now?: Date, log?: (m: string) => void }} o
 */
export function recordRunResults({ root, key, rows, resultsDir, now = new Date(), log = console.log }) {
  const file = path.join(root, 'work', key, 'run-results.json');
  let j = { card: key, tests: {} };
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); j.tests = j.tests || {}; } catch { /* first run */ }
  const t = now.toISOString(), run = path.basename(path.resolve(resultsDir)), source = sourceOf(resultsDir), got = {};
  for (const x of rows) {
    for (const k of new Set(x.title.match(/\bETM-\d+\b/g) || [])) {
      if (k === key) continue;
      // a manual Test not yet confirmed by a person is not a result: recorded as skipped, never as passed or failed
      const r = x.awaiting && source ? { status: 'skipped', why: 'awaiting-confirmation', t, run, source }
        : { status: x.status, why: x.status === 'skipped' ? x.why : undefined, t, run, source };
      if (!got[k] || (RANK[r.status] ?? 0) < (RANK[got[k].status] ?? 0)) got[k] = r;
    }
  }
  Object.assign(j.tests, got);
  j.card = key; j.updated = t;
  try { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(j, null, 1) + '\n'); log(`  run results: ${Object.keys(got).length} test key(s) -> ${path.relative(root, file)}`); }
  catch (e) { log(`  run results not saved: ${e.message}`); }
}
