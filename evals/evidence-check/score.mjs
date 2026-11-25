#!/usr/bin/env node
// Score the evidence-checker against past defects whose outcome is known (truth.json).
// A case is caught when the checker would have stopped a wrong yes or backed a right one:
//   truth defect-proven   -> checker says defect-proven
//   truth not-a-defect / not-proven -> checker does NOT say defect-proven (or warns about the Expected Result's source)
//   truth ui-not-reachable -> checker says uiReachable "no" (or does not say defect-proven)
//   node evals/evidence-check/score.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
process.env.EVIDENCE_CHECK_ROOT = path.join(HERE, 'root');
const { runCompare } = await import('../../tools/evidence-check.mjs');
const truth = JSON.parse(fs.readFileSync(path.join(HERE, 'truth.json'), 'utf8'));

let ok = 0, n = 0;
const rows = [];
for (const [id, t] of Object.entries(truth)) {
  n++;
  const f = path.join(HERE, 'root', 'work', t.key, 'evidence-check', `${id}.check.json`);
  if (!fs.existsSync(f)) { rows.push(`| ${id} | ${t.truth} | (no check) | - | MISSING |`); continue; }
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  let cmp; try { cmp = runCompare(t.key, id, path.join(HERE, 'root')); } catch (e) { rows.push(`| ${id} | ${t.truth} | invalid: ${e.message.slice(0, 60)} | - | INVALID |`); continue; }
  const hit = t.truth === 'defect-proven' ? c.overall === 'defect-proven'
    : t.truth === 'ui-not-reachable' ? (c.uiReachable === 'no' || c.overall !== 'defect-proven')
      : c.overall !== 'defect-proven';
  if (hit) ok++;
  rows.push(`| ${id} | ${t.truth} | ${c.overall}, uiReachable ${c.uiReachable} | ${cmp.result}${cmp.warnings.length ? ` (${cmp.warnings.length} warnings)` : ''} | ${hit ? 'CAUGHT' : 'MISSED'} |`);
}
console.log(['| Case | Truth | Checker | Card colour | Result |', '|---|---|---|---|---|', ...rows].join('\n'));
console.log(`\nScore: ${ok}/${n}`);
