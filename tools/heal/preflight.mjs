#!/usr/bin/env node
// preflight.mjs - before a run: which locators in pages/ did the latest stms-fe changes probably break?
//   node tools/heal/preflight.mjs                       all page units
//   node tools/heal/preflight.mjs --card ETM-1234 <spec>...   only the pages those specs use
// Brings stms-fe up to date the safe way (fe-git.mjs: pull --ff-only on clean develop, else fetch), diffs each
// page unit's baseline commit against origin/develop, and lists tokens our pages use that the diff removed.
// The QA environment may run an older commit, so every row is "probably broken", never "broken".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { git, updateFe } from './fe-git.mjs';
import { extractTokens, GENERIC_TOKENS, isLibraryToken } from './selectors.mjs';
import { lookup, feTokens } from './source-lookup.mjs';
import { readBaseline, advanceBaseline, pagesUsedBy, allUnits, pageUnit } from './baseline.mjs';
import { resolveRepos } from './config.mjs';

function filesOfUnit(pwRepo, unit) {
  const root = path.join(pwRepo, 'pages');
  const single = path.join(root, `${unit}.ts`);
  if (fs.existsSync(single)) return [single];
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.ts')) out.push(p); } };
  if (fs.existsSync(path.join(root, unit))) walk(path.join(root, unit));
  return out;
}

const removedLines = (diff) => diff.split('\n').filter((l) => l.startsWith('-') && !l.startsWith('---')).map((l) => l.slice(1));

/**
 * @returns {{ fe: object, target: string|null, atRisk: { page: string, line: number, token: object, candidates: string[], commit: string|null, author: string|null }[], noBaseline: string[], reportFile: string }}
 */
export function preflight(pwRepo, feRepo, { specs, card } = {}) {
  const fe = updateFe(feRepo);
  const target = fe.newest?.commit || null;
  const units = specs?.length ? pagesUsedBy(pwRepo, specs) : allUnits(pwRepo);
  const base = readBaseline(pwRepo);
  const noBaseline = units.filter((u) => !base[u]);
  if (target) advanceBaseline(pwRepo, noBaseline, target); // first time: record, nothing to compare yet
  const atRisk = [];
  const diffCache = {};
  for (const unit of units) {
    const from = base[unit];
    if (!from || !target || from === target) continue;
    diffCache[from] ??= removedLines(git(feRepo, ['diff', '--unified=0', '--no-color', from, target, '--', 'src']));
    const minus = diffCache[from];
    if (!minus.length) continue;
    for (const f of filesOfUnit(pwRepo, unit)) {
      const rel = path.relative(pwRepo, f).replace(/\\/g, '/');
      for (const t of extractTokens(fs.readFileSync(f, 'utf8'), rel)) {
        if (GENERIC_TOKENS.has(t.value.toLowerCase()) || isLibraryToken(t.value)) continue;
        if (!minus.some((l) => l.includes(t.value) && feTokens(l, t.kind).has(t.value))) continue;
        const r = lookup(feRepo, t, 'origin/develop');
        if (r.present || r.library) continue;
        atRisk.push({ page: rel, line: t.line, token: t, candidates: r.candidates, commit: r.removedIn?.commit || null, author: r.removedIn?.author || null });
      }
    }
  }
  const day = new Date().toISOString().slice(0, 10);
  const reportFile = path.join(pwRepo, 'output', 'heal', `preflight-${day}.md`);
  const lines = [
    `# Pre-flight ${day}${card ? ` (${card})` : ''}`, '',
    `stms-fe: ${fe.mode} (${fe.reason}); newest origin/develop ${fe.newest ? `${fe.newest.commit.slice(0, 8)} ${fe.newest.date}` : 'unknown'}`,
    `Checked page units: ${units.join(', ') || 'none'}`,
    noBaseline.length ? `No baseline yet (recorded now, checked from the next pre-flight): ${noBaseline.join(', ')}` : '',
    '', atRisk.length ? '| Page | Old token | Proposed | FE commit | Author | Status |' : 'No locator looks broken by the stms-fe changes.',
    ...(atRisk.length ? ['|---|---|---|---|---|---|'] : []),
    ...atRisk.map((x) => `| ${x.page}:${x.line} | ${x.token.kind}:${x.token.value} | ${x.candidates.join(', ') || 'needs live check'} | ${x.commit?.slice(0, 8) ?? '-'} | ${x.author ?? '-'} | probably broken |`),
  ].filter((l) => l !== null);
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, lines.join('\n') + '\n');
  return { fe, target, atRisk, noBaseline, reportFile };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const card = args.includes('--card') ? args[args.indexOf('--card') + 1] : undefined;
  const specs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--card').map((s) => (s.startsWith('tests/') ? s : path.join('tests', 'fe', s.endsWith('.ts') ? s : `${s}.ts`)));
  const { pwRepo, feRepo } = resolveRepos();
  if (!fs.existsSync(path.join(feRepo, '.git'))) { console.log(`[preflight] stms-fe not found at ${feRepo}: skipped (set FE_REPO in .env)`); process.exit(0); }
  const r = preflight(pwRepo, feRepo, { specs, card });
  console.log(`[preflight] stms-fe ${r.fe.mode}: ${r.fe.reason}`);
  if (r.fe.newest) console.log(`[preflight] newest origin/develop ${r.fe.newest.commit.slice(0, 8)} ${r.fe.newest.date}`);
  if (r.noBaseline.length) console.log(`[preflight] no baseline yet (recorded now): ${r.noBaseline.join(', ')}`);
  for (const x of r.atRisk) console.log(`  probably broken  ${x.page}:${x.line}  ${x.token.kind}:${x.token.value}  ->  ${x.candidates.join(', ') || 'needs live check'}  (${x.commit?.slice(0, 8)} ${x.author})`);
  console.log(`[preflight] ${r.atRisk.length} locator(s) probably broken. Report: ${r.reportFile}`);
}
