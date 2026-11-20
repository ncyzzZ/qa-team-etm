// report.mjs - main() of regress.mjs: range, merges, spec ranking, report files, and `mark`.
// Design: docs/superpowers/specs/2026-11-20-fe-diff-regression-design.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tier, commands } from './core.mjs';

const MAP_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'regress-map.json');
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const lastFile = (pwRepo) => path.join(pwRepo, 'output', 'regression', 'last.json');
const outDir = (teamRoot) => path.join(teamRoot, 'work', 'REGRESSION');
const ymd = (d) => d.toISOString().slice(0, 10);

/** Start of the range and how it was chosen. */
export function startOf({ pwRepo, feRepo, since, sinceDays, to, now, commitBefore, gitDate }) {
  if (since) return { ref: since, how: 'given' };
  const back = (days) => commitBefore(feRepo, to, new Date(now().getTime() - days * 86_400_000).toISOString());
  if (sinceDays) return { ref: back(Number(sinceDays)), how: `${sinceDays} days` };
  const last = readJson(lastFile(pwRepo));
  if (last?.commit) return { ref: last.commit, how: 'last regression' };
  const units = Object.values(readJson(path.join(pwRepo, 'output', 'heal', 'fe-baseline.json'))?.units || {});
  if (units.length) {
    const oldest = units.map((c) => ({ c, d: gitDate(feRepo, c) || '9999' })).sort((a, b) => a.d.localeCompare(b.d))[0].c;
    return { ref: oldest, how: 'heal baseline' };
  }
  return { ref: back(14), how: '14 days' };
}

function markdown({ range, how, groups, rows, notMapped, wide, cmds }) {
  const L = [];
  L.push(`# Regression from stms-fe changes ${range.since.slice(0, 7)}..${range.to.slice(0, 7)}`, '');
  L.push(`- Range: ${range.since} .. ${range.to} (${range.toRef}); start chosen by: ${how}.`);
  L.push("- QA's deployed commit is unknown: this compares develop, so a change may not be on QA yet.");
  L.push(`- ${groups.length} merge group(s); specs: Must ${rows.filter((r) => r.tier === 'Must').length}, Should ${rows.filter((r) => r.tier === 'Should').length}, Warn ${rows.filter((r) => r.tier === 'Warn').length}.`, '');
  for (const g of groups) {
    L.push(`## ${g.keys.length ? g.keys.join(', ') : 'no card'}: ${g.branch}`, '', `${g.files.length} changed app file(s): ${g.files.slice(0, 8).map((f) => `\`${f}\``).join(', ')}${g.files.length > 8 ? ' ...' : ''}`, '');
    const mine = rows.filter((r) => r.reasons.some((x) => x.startsWith(g.branch)));
    if (!mine.length) { L.push('No spec found for this group.', ''); continue; }
    L.push('| Tier | Spec | Reasons |', '|---|---|---|');
    for (const r of mine) L.push(`| ${r.tier} | ${r.file} | ${r.reasons.filter((x) => x.startsWith(g.branch)).map((x) => x.slice(g.branch.length).replace(/^ \([^)]*\): /, '')).join('; ').replace(/\|/g, '\\|')} |`);
    L.push('');
  }
  if (notMapped.length) L.push('## Not mapped (add them to tools/regress-map.json)', '', ...notMapped.map((f) => `- \`${f}\``), '');
  if (wide.length) L.push('## Wide changes: consider the full regression', '', ...wide.map((w) => `- ${w.merge}: \`${w.file}\` is used by ${w.folders.length} pages`), '');
  L.push('## Run commands', '', 'Run only after "พร้อมรันไหม". A spec appears once, under the card that owns its tests.', '', '```', ...cmds, '```', '');
  return L.join('\n');
}

/**
 * node tools/regress.mjs [--since <commit> | --since-days <n>] [--to <ref>] [--card ETM-1234] [--no-update]
 * node tools/regress.mjs mark [<commit>]
 */
export async function main(args, d) {
  const opt = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
  const now = d.now || (() => new Date());
  if (args[0] === 'mark') {
    let commit = args[1];
    if (!commit) {
      const saved = (() => { try { return fs.readdirSync(outDir(d.teamRoot)).filter((f) => f.endsWith('.json')).sort(); } catch { return []; } })();
      if (!saved.length) { d.log('No saved regression report: run node tools/regress.mjs first, or give the commit: mark <commit>'); return 2; }
      const newest = saved.map((f) => ({ f, t: fs.statSync(path.join(outDir(d.teamRoot), f)).mtimeMs })).sort((a, b) => b.t - a.t)[0].f;
      commit = readJson(path.join(outDir(d.teamRoot), newest))?.range?.to;
      if (!commit) { d.log(`Report ${newest} has no range.to`); return 2; }
    }
    fs.mkdirSync(path.dirname(lastFile(d.pwRepo)), { recursive: true });
    fs.writeFileSync(lastFile(d.pwRepo), JSON.stringify({ commit, date: now().toISOString(), by: 'regress.mjs mark' }, null, 1));
    d.log(`[regress] last regression = ${commit.slice(0, 8)} (${lastFile(d.pwRepo)})`);
    return 0;
  }
  if (!d.feRepo || !fs.existsSync(d.pwRepo || '')) { d.log('FE_REPO / PW_REPO not found: run node tools/setup.mjs'); return 2; }
  if (!args.includes('--no-update')) { const u = d.update(d.feRepo); d.log(`[regress] stms-fe: ${u.mode}${u.reason ? ` (${u.reason})` : ''}`); }
  const toRef = opt('--to') || 'origin/develop';
  const to = d.resolve(d.feRepo, toRef);
  const start = startOf({ pwRepo: d.pwRepo, feRepo: d.feRepo, since: opt('--since'), sinceDays: opt('--since-days'), to, now, commitBefore: d.commitBefore, gitDate: d.gitDate });
  if (!start.ref) { d.log(`[regress] no commit of ${toRef} before the start (${start.how})`); return 2; }
  const since = d.resolve(d.feRepo, start.ref);
  let groups = d.merges(d.feRepo, since, to);
  const card = opt('--card');
  if (card) groups = groups.filter((g) => g.keys.includes(card));
  const map = readJson(MAP_FILE) || [];
  const { rows, notMapped, wide } = tier({ specs: d.specIndex(d.pwRepo, d.teamRoot), merges: groups, map, importers: (p) => d.importers(d.feRepo, p, to) });
  const cmds = commands(rows);
  const range = { since, to, toRef };
  const base = path.join(outDir(d.teamRoot), `${ymd(now())}_${since.slice(0, 7)}..${to.slice(0, 7)}`);
  fs.mkdirSync(outDir(d.teamRoot), { recursive: true });
  fs.writeFileSync(`${base}.md`, markdown({ range, how: start.how, groups: groups.map((g) => ({ ...g, files: g.files.map((f) => f.path) })), rows, notMapped, wide, cmds }));
  fs.writeFileSync(`${base}.json`, JSON.stringify({ range, how: start.how, groups: groups.map((g) => ({ commit: g.commit, branch: g.branch, keys: g.keys, files: g.files.map((f) => f.path) })), rows, notMapped, wide, commands: cmds }, null, 1));
  d.log(`[regress] ${groups.length} merge group(s), Must ${rows.filter((r) => r.tier === 'Must').length}, Should ${rows.filter((r) => r.tier === 'Should').length}, Warn ${rows.filter((r) => r.tier === 'Warn').length}, not mapped ${notMapped.length}, wide ${wide.length}`);
  d.log(`[regress] report: ${base}.md`);
  return 0;
}
