#!/usr/bin/env node
// One Xray push per card (user, chat 2026-11-24: "อนุญาต 1-3", item 2): build the whole plan from the latest results
// and the user's verdicts, show it in ONE question at the end of the card, then push it with xray_import_results.
//
//   node tools/push-plan.mjs <KEY>     write work/<KEY>/push-plan.md, print it and the push-guard check line
//
// Rules: passed -> PASSED. failed + verdict app -> FAILED (with the defect key when known).
// failed with another verdict or none, and every skipped / Not proven / awaiting test -> stays TO DO (not sent).
// A plan never sends PASSED for a test whose latest result is not passed (AI miss M-1; push-guard checks it again).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

export function plan(key, root = ROOT) {
  const results = readJson(path.join(root, 'work', key, 'run-results.json'), {}).tests ?? {};
  const verdicts = readJson(path.join(root, 'work', key, 'verdicts.json'), {});
  const rows = Object.entries(results).sort(([a], [b]) => a.localeCompare(b)).map(([test, r]) => {
    const v = verdicts[test];
    if (r.status === 'passed') return { test, result: r.status, send: 'PASSED', why: `passed in ${r.run ?? 'last run'}` };
    if (r.status === 'failed' && v?.verdict === 'app') return { test, result: r.status, send: 'FAILED', why: `app bug (user)${v.defect ? `, defect ${v.defect}` : ', defect not logged yet'}` };
    if (r.status === 'failed') return { test, result: r.status, send: null, why: v ? `user: ${v.verdict} - fix and re-run first` : 'no verdict yet (verdicts.mjs table)' };
    return { test, result: r.status + (r.why ? `:${r.why}` : ''), send: null, why: 'skipped / not proven: never PASSED' };
  });
  return rows;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const key = process.argv[2];
  if (!/^ETM-\d+$/.test(key ?? '')) { console.error('Usage: node tools/push-plan.mjs <KEY>'); process.exit(2); }
  const rows = plan(key);
  if (!rows.length) { console.error(`${key}: no work/${key}/run-results.json results`); process.exit(1); }
  const sent = rows.filter((r) => r.send);
  const count = (s) => sent.filter((r) => r.send === s).length;
  const md = [
    `# ${key} - Xray push plan (${new Date().toISOString().slice(0, 10)})`, '',
    `Send ${sent.length}: ${count('PASSED')} PASSED, ${count('FAILED')} FAILED. Stay TO DO: ${rows.length - sent.length}.`, '',
    '| Test | Latest result | Send to Xray | Why |', '|---|---|---|---|',
    ...rows.map((r) => `| ${r.test} | ${r.result} | ${r.send ?? 'stays TO DO'} | ${r.why} |`),
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'work', key, 'push-plan.md'), md);
  console.log(md);
  console.log(sent.length ? `check: node tools/push-guard.mjs ${sent.map((r) => `${r.test}=${r.send}`).join(' ')}` : 'nothing to send');
}
