#!/usr/bin/env node
// One table for all failures of a run, with the AI's suggestion per test; the user answers them together.
// (user, chat 2026-11-24: "อนุญาต 1-3", item 3). The suggestion is never the verdict: only the user's answer is.
//
//   node tools/verdicts.mjs table  <KEY> [<run folder>] [--no-build]   write work/<KEY>/verdict-table.md from the run's triage.json,
//                                                          with what stms-fe merged since each test last passed (tools/build-change.mjs)
//                                                          (default: newest output/runs/*_<KEY> in PW_REPO) and print it
//   node tools/verdicts.mjs record <KEY> ETM-1=script ETM-2=app[:ETM-9229] ... --source chat|board --evidence "<reply>"
//                                                          save the user's answers to work/<KEY>/verdicts.json
// Verdicts: script (script bug), tc (test wording wrong), app (real app bug; logging the defect still needs its own yes),
// env (environment / VPN / login), flaky (passes on a re-run).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRepos } from './heal/config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
export const VERDICTS = ['script', 'tc', 'app', 'env', 'flaky'];

const pwRepo = () => resolveRepos().pwRepo;
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

/** AI suggestion for one triage row: { suggest, why }. Findings/defects that name the test win over the cause. */
export function suggest(row, findings = []) {
  const hit = findings.find((f) => JSON.stringify(f).includes(row.key) && (f.later_defect || /bug|defect/i.test(f.note ?? '')));
  if (hit) return { suggest: 'app', why: `finding ${hit.id}${hit.later_defect ? ` / defect ${hit.later_defect}` : ''} names this test` };
  switch (row.cause) {
    case 'locator': return { suggest: 'script', why: `locator not found (${row.locator ?? '?'}): heal loop first` };
    case 'flaky': return { suggest: 'flaky', why: 'passed only on retry' };
    case 'env': return { suggest: 'env', why: 'environment / login / network error' };
    case 'data': return { suggest: 'script', why: 'test data missing or not as the test expects' };
    default: return { suggest: 'app?', why: 'an Expected Result was not met: look at the step picture; app bug or TC wording' };
  }
}

/**
 * @param annotate optional (key, runDir, rowsWithSuggestion) => rows: tools/build-change.mjs adds `since` (what stms-fe merged
 *   since the test last passed or failed differently) and may turn the suggestion into `app?` for a build change.
 */
export async function table(key, runDir, root = ROOT, annotate = null) {
  const triage = readJson(path.join(runDir, 'triage.json'), []);
  const fj = readJson(path.join(root, 'work', key, 'findings.json'), []);
  const findings = Array.isArray(fj) ? fj : fj.findings ?? [];
  let rows = triage.map((r, i) => ({ n: i + 1, ...r, ...suggest(r, findings) }));
  if (annotate) rows = await annotate(key, runDir, rows);
  const since = rows.some((r) => r.since);
  const { sinceCell } = since ? await import('./build-change.mjs') : {};
  const builds = rows.filter((r) => r.buildChange).map((r) => r.n);
  const md = [
    `# ${key} - failures to decide (run ${path.basename(runDir)})`, '',
    'AI suggestion only. Answer all rows in one reply, e.g. `1=script 2=app 3=tc` (script / tc / app / env / flaky).', '',
    ...(builds.length ? [`**Build change?** Rows ${builds.join(', ')} behaved differently in an earlier run and stms-fe changed since (Since last pass). Check the named merge on the live page before any script fix; if it is the cause, they are one defect.`, ''] : []),
    `| # | Test | Failed with | Cause | AI suggests | Why |${since ? ' Since last pass |' : ''}`, `|---|---|---|---|---|---|${since ? '---|' : ''}`,
    ...rows.map((r) => `| ${r.n} | ${r.key} | ${(r.firstLine ?? '').replace(/\|/g, '/').slice(0, 90)} | ${r.cause} | ${r.suggest} | ${r.why.replace(/\|/g, '/')} |${since ? ` ${sinceCell(r)} |` : ''}`),
  ].join('\n') + '\n';
  fs.mkdirSync(path.join(root, 'work', key), { recursive: true });
  fs.writeFileSync(path.join(root, 'work', key, 'verdict-table.md'), md);
  return { rows, md };
}

export function record(key, pairs, { source, evidence }, root = ROOT) {
  if (!['chat', 'board'].includes(source)) throw new Error('record needs --source chat|board');
  if (!evidence?.trim()) throw new Error('record needs --evidence (the user\'s reply or the ANSWER: line)');
  if (source === 'board' && !evidence.includes('ANSWER:')) throw new Error('a board answer needs the ANSWER: line of team.mjs wait as --evidence');
  const file = path.join(root, 'work', key, 'verdicts.json');
  const all = readJson(file, {});
  const at = new Date().toISOString();
  for (const p of pairs) {
    const m = p.match(/^(ETM-\d+)=(\w+)(?::(ETM-\d+))?$/);
    if (!m || !VERDICTS.includes(m[2])) throw new Error(`bad answer "${p}": use ETM-<n>=${VERDICTS.join('|')}[:<defect key>]`);
    all[m[1]] = { verdict: m[2], ...(m[3] ? { defect: m[3] } : {}), source, evidence: evidence.slice(0, 200), at };
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(all, null, 2) + '\n');
  return all;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, key, ...rest] = process.argv.slice(2);
  if (!['table', 'record'].includes(cmd) || !/^ETM-\d+$/.test(key ?? '')) {
    console.error('Usage: node tools/verdicts.mjs table <KEY> [<run folder>] | record <KEY> ETM-1=script ... --source chat|board --evidence "..."'); process.exit(2);
  }
  try {
    if (cmd === 'table') {
      let dir = rest.find((a) => !a.startsWith('--'));
      if (!dir) {
        const runs = path.join(pwRepo(), 'output', 'runs');
        const cands = fs.existsSync(runs) ? fs.readdirSync(runs).filter((d) => d.endsWith(`_${key}`) && fs.existsSync(path.join(runs, d, 'triage.json'))).sort() : [];
        if (!cands.length) { console.error(`no run of ${key} with triage.json under ${runs}`); process.exit(1); }
        dir = path.join(runs, cands.at(-1));
      }
      const noBuild = rest.includes('--no-build');
      const { withBuildInfo } = await import('./build-change.mjs');
      const { rows, md } = await table(key, dir, ROOT, noBuild ? null : (k, d, r) => withBuildInfo(k, d, r));
      console.log(rows.length ? md : `${key}: no failures in ${dir}`);
    } else {
      const flag = (n) => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : ''; };
      const pairs = rest.filter((a, i) => /^ETM-\d+=/.test(a) && !['--source', '--evidence'].includes(rest[i - 1]));
      const all = record(key, pairs, { source: flag('--source'), evidence: flag('--evidence') });
      console.log(`${key}: ${pairs.length} answers saved (${Object.keys(all).length} in verdicts.json)`);
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
