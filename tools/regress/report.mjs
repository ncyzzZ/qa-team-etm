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
  L.push(`- ${groups.length} merge group(s)${groups.some((g) => g.error) ? ` (${groups.filter((g) => g.error).length} NOT checked: diff failed)` : ''}; specs: Must ${rows.filter((r) => r.tier === 'Must').length}, Should ${rows.filter((r) => r.tier === 'Should').length}, Warn ${rows.filter((r) => r.tier === 'Warn').length}, @high base ${rows.filter((r) => r.tier === 'High').length}.`, '');
  for (const g of groups) {
    L.push(`## ${g.keys.length ? g.keys.join(', ') : 'no card'}: ${g.branch} (${g.commit.slice(0, 7)})`, '');
    if (g.error) { L.push(`**Not checked: ${g.error}.** Look at this merge by hand or run again.`, ''); continue; }
    L.push(`${g.files.length} changed app file(s): ${g.files.slice(0, 8).map((f) => `\`${f}\``).join(', ')}${g.files.length > 8 ? ' ...' : ''}`, '');
    const mine = rows.filter((r) => r.byGroup[g.commit]).sort((a, b) => ({ Must: 3, Should: 2, Warn: 1 }[b.byGroup[g.commit].tier] - { Must: 3, Should: 2, Warn: 1 }[a.byGroup[g.commit].tier]) || a.file.localeCompare(b.file));
    if (!mine.length) { L.push(g.keys.length ? 'No spec found for this group (the card has no scripts, and no page spec matched).' : 'No spec found for this group.', ''); continue; }
    L.push('| Tier | Spec | Reasons |', '|---|---|---|');
    for (const r of mine) {
      const own = r.byGroup[g.commit];
      L.push(`| ${own.tier} | ${r.file} | ${own.reasons.map((x) => x.replace(/^[^:]*\): /, '')).join('; ').replace(/\|/g, '\\|')} |`);
    }
    L.push('');
  }
  const base = rows.filter((r) => r.high?.length);
  L.push('## @high regression base (every run)', '');
  if (!base.length) L.push('No test has `@high` yet: tag the High AC tests of each card when it is next tested (TEAM.md "How much E2E").', '');
  else { L.push('| Spec | @high tests | Runs |', '|---|---|---|'); for (const r of base) L.push(`| ${r.file} | ${r.high.join(', ')} | ${r.tier === 'High' ? 'only @high' : `whole spec (${r.tier})`} |`); L.push(''); }
  if (notMapped.length) L.push('## Not mapped (add them to tools/regress-map.json)', '', ...notMapped.map((f) => `- \`${f}\``), '');
  if (wide.length) L.push('## Wide changes: consider the full regression', '', ...wide.map((w) => `- ${w.merge}: \`${w.file}\` is used by ${w.folders.length} pages`), '');
  L.push('## Run commands', '', 'Run under the standing run approval (check each with tools/run-policy.mjs; ask only when it says ask), from the qa-team-etm folder. One run-card per card (its data is reset once before it). A spec appears once, under the card that owns its tests.', '', '```', ...cmds, '```', '');
  return L.join('\n');
}

/**
 * node tools/regress.mjs [--since <commit> | --since-days <n>] [--to <ref>] [--card ETM-1234] [--no-update] [--no-high]
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
  const { rows, notMapped, wide } = tier({ specs: d.specIndex(d.pwRepo, d.teamRoot), merges: groups, map, importers: (p) => d.importers(d.feRepo, p, to), high: !card && !args.includes('--no-high') });
  const cmds = commands(rows, { pwRepo: d.pwRepo });
  const range = { since, to, toRef };
  const base = path.join(outDir(d.teamRoot), `${ymd(now())}_${since.slice(0, 7)}..${to.slice(0, 7)}`);
  fs.mkdirSync(outDir(d.teamRoot), { recursive: true });
  fs.writeFileSync(`${base}.md`, markdown({ range, how: start.how, groups: groups.map((g) => ({ ...g, files: g.files.map((f) => f.path) })), rows, notMapped, wide, cmds }));
  fs.writeFileSync(`${base}.json`, JSON.stringify({ range, how: start.how, groups: groups.map((g) => ({ commit: g.commit, branch: g.branch, keys: g.keys, files: g.files.map((f) => f.path), error: g.error })), rows, notMapped, wide, commands: cmds }, null, 1));
  d.log(`[regress] ${groups.length} merge group(s), Must ${rows.filter((r) => r.tier === 'Must').length}, Should ${rows.filter((r) => r.tier === 'Should').length}, Warn ${rows.filter((r) => r.tier === 'Warn').length}, @high base ${rows.filter((r) => r.tier === 'High').length}, not mapped ${notMapped.length}, wide ${wide.length}`);
  d.log(`[regress] report: ${base}.md`);
  return 0;
}
