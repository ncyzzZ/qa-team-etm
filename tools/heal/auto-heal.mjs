#!/usr/bin/env node
// auto-heal.mjs - runs by itself after every run-card run (and the hook reminds the lead): for each `locator`
// failure in triage.json, look the locator up in the FE repo, write a ready diff when the source answers, check it
// with the heal guard, and list what still needs the live healer or a person. Nothing is applied here without
// the user's Apply.
//   node tools/heal/auto-heal.mjs propose <run folder>            writes heal-proposals.json / .md (+ heal-<n>.diff)
//   node tools/heal/auto-heal.mjs apply <run folder> <ids|all>    applies ready proposals (only after the user's Apply)
//   node tools/heal/auto-heal.mjs revert <run folder> <ids|all>   puts the old line back for applied heals
//   node tools/heal/auto-heal.mjs skip <run folder> <ids|all>     marks them skipped
// Status per proposal: ready (diff passed the guard) | needs-live (call playwright-healer) | manual (a person fixes it)
// | applied | skipped.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractTokens, isLibraryToken, GENERIC_TOKENS } from './selectors.mjs';
import { lookup as realLookup } from './source-lookup.mjs';
import { checkHealDiff } from './guard.mjs';
import { resolveRepos } from './config.mjs';
import { profile } from '../profile.mjs';

const FILE = 'heal-proposals.json';
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function walkTs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walkTs(p, out); } else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

/** Where is the broken locator written? pageRef from triage first, else the one pages/ line that holds it. */
export function findLine(pwRepo, row) {
  if (row.pageRef) {
    const [rel, n] = [row.pageRef.replace(/:\d+$/, ''), Number(row.pageRef.match(/:(\d+)$/)[1])];
    const lines = fs.readFileSync(path.join(pwRepo, rel), 'utf8').split(/\r?\n/);
    return { file: rel, line: n, text: lines[n - 1] ?? '' };
  }
  if (!row.locator) return { reason: 'no locator text in the error' };
  const hits = (dir) => walkTs(path.join(pwRepo, dir)).flatMap((f) => fs.readFileSync(f, 'utf8').split(/\r?\n/)
    .map((text, i) => ({ file: path.relative(pwRepo, f).replace(/\\/g, '/'), line: i + 1, text }))
    .filter((x) => x.text.includes(row.locator)));
  for (const dir of ['pages', 'tests']) {
    let found = hits(dir);
    // several lines: keep the ones in the failing spec file (triage `file` is relative to the test folder)
    if (found.length > 1 && row.file) { const own = found.filter((x) => x.file.endsWith(row.file)); if (own.length) found = own; }
    if (found.length === 1) return found[0];
    if (found.length > 1) return { reason: `locator is on ${found.length} lines in ${dir}/ (${found.slice(0, 3).map((x) => `${x.file}:${x.line}`).join(', ')}), not sure which one` };
  }
  return { reason: 'locator line not found in pages/ or tests/' };
}

/** One proposal for one triage row. */
export function proposeOne(pwRepo, feRepo, row, { lookup = realLookup } = {}) {
  const base = { test: row.key, title: row.title, locator: row.locator };
  const where = findLine(pwRepo, row);
  if (where.reason) return { ...base, status: 'manual', reason: where.reason };
  const at = `${where.file}:${where.line}`;
  const tokens = extractTokens(where.text, where.file).filter((t) => !GENERIC_TOKENS.has(t.value));
  if (!tokens.length) return { ...base, page: at, status: 'needs-live', reason: `no plain token to look up in ${profile().repos.feRepoDir} (regex, template or generic)` };
  if (tokens.some((t) => isLibraryToken(t.value))) return { ...base, page: at, status: 'needs-live', reason: `library class (Bryntum / AG Grid / ng-zorro), not in ${profile().repos.feRepoDir} templates` };
  const looked = tokens.map((t) => ({ t, r: lookup(feRepo, t) }));
  const gone = looked.filter((x) => !x.r.present);
  if (!gone.length) return { ...base, page: at, status: 'needs-live', reason: `every token is still in ${profile().repos.feRepoDir} (maybe timing, state or QA runs an older build)` };
  const answer = gone.filter((x) => x.r.candidates.length === 1);
  if (answer.length !== gone.length) return { ...base, page: at, status: 'needs-live', reason: `${profile().repos.feRepoDir} removed ${gone.map((x) => x.t.value).join(', ')} with no single replacement` };
  let next = where.text;
  for (const { t, r } of answer) next = next.replace(new RegExp(`(?<![\\w-])${esc(t.value)}(?![\\w-])`), r.candidates[0]);
  const diff = [`diff --git a/${where.file} b/${where.file}`, `--- a/${where.file}`, `+++ b/${where.file}`,
    `@@ -${where.line},1 +${where.line},1 @@`, `-${where.text}`, `+${next}`, ''].join('\n');
  const guard = checkHealDiff(diff);
  const from = answer.map(({ t, r }) => `${t.value} -> ${r.candidates[0]} (${profile().repos.feRepoDir} ${r.removedIn?.commit?.slice(0, 8) ?? '?'})`).join('; ');
  if (!guard.ok) return { ...base, page: at, status: 'manual', reason: `heal guard refused: ${guard.errors[0]}`, from };
  return { ...base, page: at, status: 'ready', old: where.text.trim(), new: next.trim(), oldLine: where.text, newLine: next, from, source: 'fe', diff };
}

function write(runDir, data) {
  fs.writeFileSync(path.join(runDir, FILE), JSON.stringify(data, null, 2));
  const rows = data.proposals.map((p) => `| ${p.id} | ${p.test} | ${p.status} | ${p.page ?? ''} | ${(p.status === 'ready' || p.status === 'applied') ? `\`${p.old}\` → \`${p.new}\`` : (p.reason ?? '')} |`.replace(/\n/g, ' '));
  fs.writeFileSync(path.join(runDir, 'heal-proposals.md'), `# Heal proposals\n\n| # | Test | Status | Page | Change / reason |\n|---|---|---|---|---|\n${rows.join('\n')}\n`);
}

export function propose(runDir, { pwRepo, feRepo, lookup } = {}) {
  if (!pwRepo || !feRepo) { const r = resolveRepos(); pwRepo ??= r.pwRepo; feRepo ??= r.feRepo; }
  const triage = JSON.parse(fs.readFileSync(path.join(runDir, 'triage.json'), 'utf8'));
  const seen = new Set();
  const rows = triage.filter((r) => r.cause === 'locator' && !seen.has(`${r.key}|${r.locator}`) && seen.add(`${r.key}|${r.locator}`));
  const feOk = fs.existsSync(path.join(feRepo, '.git'));
  const proposals = rows.map((r, i) => ({ id: i + 1, ...(feOk ? proposeOne(pwRepo, feRepo, r, { lookup }) : { test: r.key, title: r.title, locator: r.locator, status: 'needs-live', reason: `FE_REPO (${profile().repos.feRepoDir}) not found` }) }));
  proposals.filter((p) => p.diff).forEach((p) => fs.writeFileSync(path.join(runDir, `heal-${p.id}.diff`), p.diff));
  const data = { run: path.basename(runDir), created: new Date().toISOString(), notified: false, proposals };
  if (proposals.length) write(runDir, data);
  return data;
}

const pick = (data, ids) => data.proposals.filter((p) => ids === 'all' || String(ids).split(',').map(Number).includes(p.id));

export function apply(runDir, ids, { pwRepo = resolveRepos().pwRepo } = {}) {
  const data = JSON.parse(fs.readFileSync(path.join(runDir, FILE), 'utf8'));
  const done = [];
  for (const p of pick(data, ids).filter((x) => x.status === 'ready')) {
    const [rel, n] = [p.page.replace(/:\d+$/, ''), Number(p.page.match(/:(\d+)$/)[1])];
    const abs = path.join(pwRepo, rel);
    const src = fs.readFileSync(abs, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const lines = src.split(/\r?\n/);
    if (lines[n - 1] !== p.oldLine) { p.status = 'manual'; p.reason = 'the line changed since the proposal'; continue; }
    lines[n - 1] = p.newLine;
    fs.writeFileSync(abs, lines.join(eol));
    p.status = 'applied'; p.appliedAt = new Date().toISOString(); done.push(p);
  }
  write(runDir, data);
  return done;
}

/** Undo applied heals whose re-run did not pass (or the user said revert): put the old line back. */
export function revert(runDir, ids, { pwRepo = resolveRepos().pwRepo } = {}) {
  const data = JSON.parse(fs.readFileSync(path.join(runDir, FILE), 'utf8'));
  const done = [];
  for (const p of pick(data, ids).filter((x) => x.status === 'applied')) {
    const [rel, n] = [p.page.replace(/:\d+$/, ''), Number(p.page.match(/:(\d+)$/)[1])];
    const abs = path.join(pwRepo, rel);
    const src = fs.readFileSync(abs, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const lines = src.split(/\r?\n/);
    if (lines[n - 1] !== p.newLine) { p.reason = 'revert: the line changed after the heal, fix by hand'; continue; }
    lines[n - 1] = p.oldLine;
    fs.writeFileSync(abs, lines.join(eol));
    p.status = 'reverted'; p.revertedAt = new Date().toISOString(); done.push(p);
  }
  write(runDir, data);
  return done;
}

export function skip(runDir, ids) {
  const data = JSON.parse(fs.readFileSync(path.join(runDir, FILE), 'utf8'));
  for (const p of pick(data, ids)) if (['ready', 'needs-live'].includes(p.status)) p.status = 'skipped';
  write(runDir, data);
}

export function summaryLine(data) {
  const c = data.proposals.reduce((o, p) => ((o[p.status] = (o[p.status] || 0) + 1), o), {});
  return Object.entries(c).map(([k, v]) => `${k} ${v}`).join(', ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, dir, ids] = process.argv.slice(2);
  if (!cmd || !dir || !fs.existsSync(dir)) { console.error('Usage: node tools/heal/auto-heal.mjs propose|apply|revert|skip <run folder> [ids|all]'); process.exit(2); }
  if (cmd === 'propose') { const d = propose(dir); console.log(d.proposals.length ? `[auto-heal] ${summaryLine(d)}  (${path.join(dir, 'heal-proposals.md')})` : '[auto-heal] no locator failures'); }
  else if (cmd === 'apply') { if (!ids) { console.error('apply needs ids or all'); process.exit(2); } const d = apply(dir, ids); console.log(`[auto-heal] applied ${d.length}: ${d.map((p) => `#${p.id} ${p.test} ${p.page}`).join(', ') || 'none'}`); }
  else if (cmd === 'revert') { const d = revert(dir, ids || 'all'); console.log(`[auto-heal] reverted ${d.length}: ${d.map((p) => `#${p.id} ${p.test}`).join(', ') || 'none'}`); }
  else if (cmd === 'skip') { skip(dir, ids || 'all'); console.log('[auto-heal] skipped'); }
  else { console.error(`unknown command ${cmd}`); process.exit(2); }
}
