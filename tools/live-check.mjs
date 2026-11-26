#!/usr/bin/env node
// live-check.mjs - "check the page before you write the step" made checkable (automator step 1b, gate G6-live).
// 10 of the first 12 AI misses were script steps written from a guess about how a filter, search, delete or paste behaves.
// Every spec step of a risky kind needs a row in work/<KEY>/live-check.md that says where the page fact came from:
//
//   | Test | Action | Fact | Source | Module |
//   |---|---|---|---|---|
//   | ETM-8653 | filter | Unticking the last option empties the table | docs/modules/shutdown-logic.md | |
//   | ETM-8654 | search | Table search runs only on Enter | live 2026-11-25 | shutdown-logic.md |
//   | ETM-8655 | paste | (not checked: VPN off) | Assumption - not checked live | |
//
// Source: a docs/modules/<file>.md that exists, `live <YYYY-MM-DD>` (checked on QA, read only), or `Assumption ...` (a warning,
// and the first suspect when that test fails). Action holds one of the kinds below.
//
//   node tools/live-check.mjs scan <spec.ts ...>        risky kinds per test (what live-check.md must cover)
//   node tools/live-check.mjs check <KEY> <spec.ts ...> rows missing / weak (the same check qa-check spec runs)
//   node tools/live-check.mjs promote <KEY> [--apply]   copy `live` facts into their docs/modules file (section "## Live checks")
//   node tools/live-check.mjs stats                     doc / live / assumption counts over every card
import fs from 'node:fs';
import path from 'node:path';
import { profile, escapeKey } from './profile.mjs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = path.join(ROOT, 'docs', 'modules');
const read = (p) => { try { return fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); } catch { return null; } };

// Kinds of step whose page behaviour was guessed wrong before (ai-misses M-2..M-11). Matched on code with comments removed.
// Array.filter / Map.delete / String.search are not UI steps, so a bare `.filter(` / `.delete(` does not count.
export const KINDS = {
  filter: /\bfilter[A-Z]\w*\(|\b\w+Filter\w*\(|['"`/]\^?(?:Select All|Filter|Reset)\b/,
  search: /\bsearch[A-Z]\w*\(|\b\w+Search\w*\(|['"`/]\^?Search\b|placeholder[^)]{0,20}[Ss]earch/,
  delete: /\b(?:delete|remove)[A-Z]\w*\(|\b\w+(?:Delete|Remove)\w*\(|['"`/]\^?(?:Delete|Remove)\b/,
  paste: /\bpaste\w*\(|\b\w+Paste\w*\(|(?:Control|Meta|ControlOrMeta)\+[Vv]\b|clipboard/,
  drag: /\.dragTo\(|\bmouse\.down\(|\bdrag[A-Z]\w*\(|\b\w+Drag\w*\(/,
};

export function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\w])\/\/.*$/gm, '$1');
}

/** [{key, title, skipped, kinds:[...]}] for each test() in a spec text. */
export function scanSpec(text) {
  const code = stripComments(text);
  const re = /\btest(?:\.(?:only|skip|fixme))?\(\s*(['"`])([^'"`]+)\1/g;
  const marks = [...code.matchAll(re)].map((m) => ({ title: m[2], at: m.index, whole: m[0] }));
  return marks.map((t, i) => {
    const body = code.slice(t.at + t.whole.length, i + 1 < marks.length ? marks[i + 1].at : code.length);
    const key = (t.title.match(new RegExp(String.raw`^\[?(${escapeKey(profile().jira.projectKey)}-\d+)\b`)) || [])[1] || '';
    return { key, title: t.title, skipped: /^test\.(skip|fixme)\(/.test(t.whole), kinds: Object.keys(KINDS).filter((k) => KINDS[k].test(body)) };
  });
}

/** Rows of a live-check.md table: [{test, action, fact, source, module, type: doc|live|assumption|bad, date}] */
export function parseLiveCheck(text) {
  const rows = [];
  for (const line of (text || '').split('\n')) {
    if (!/^\s*\|/.test(line) || /^\s*\|\s*-/.test(line)) continue;
    const c = line.split('|').slice(1, -1).map((s) => s.trim());
    if (c.length < 4 || /^test$/i.test(c[0])) continue;
    const [test, action, fact, source, module = ''] = c;
    let type = 'bad', date = '';
    if (/^assumption\b/i.test(source)) type = 'assumption';
    else if (/^live\b/i.test(source)) { date = (source.match(/\d{4}-\d{2}-\d{2}/) || [''])[0]; type = date ? 'live' : 'bad'; }
    else if (/docs\/modules\/[\w.-]+\.md/.test(source)) type = 'doc';
    rows.push({ test, action: action.toLowerCase(), fact, source, module: module.replace(/^docs\/modules\//, ''), type, date });
  }
  return rows;
}

/** live-check.md files for a card (team work folder and repo work folder). */
export function liveCheckFiles(key, root = ROOT) {
  return [path.join(root, '.claude', 'team', 'work', key, 'live-check.md'), path.join(root, 'work', key, 'live-check.md')].filter((f) => fs.existsSync(f));
}
export function rowsFor(cards, root = ROOT) {
  return cards.flatMap((c) => liveCheckFiles(c, root).flatMap((f) => parseLiveCheck(read(f)).map((r) => ({ ...r, file: path.relative(root, f) }))));
}

/** Problems for one scanned test against the rows: [{lvl:'ERR'|'WARN', msg}] */
export function judge(t, rows, modulesDir = MODULES) {
  const out = [];
  if (t.skipped || !t.key || !t.kinds.length) return out;
  const mine = rows.filter((r) => r.test.includes(t.key));
  for (const kind of t.kinds) {
    const r = mine.filter((x) => x.action.includes(kind));
    if (!r.length) { out.push({ lvl: 'ERR', msg: `${t.key} has a ${kind} step but live-check.md has no "${t.key} | ${kind}" row: read docs/modules/ or check it live on QA before writing (automator step 1b)` }); continue; }
    for (const x of r) {
      if (x.type === 'bad') out.push({ lvl: 'ERR', msg: `${t.key} ${kind}: Source "${x.source}" is not docs/modules/<file>.md, "live YYYY-MM-DD" or "Assumption"` });
      else if (x.type === 'doc') { const f = x.source.match(/docs\/modules\/([\w.-]+\.md)/)[1]; if (!fs.existsSync(path.join(modulesDir, f))) out.push({ lvl: 'ERR', msg: `${t.key} ${kind}: ${f} is not in docs/modules/` }); }
      else if (x.type === 'assumption') out.push({ lvl: 'WARN', msg: `${t.key} ${kind}: written from an assumption, not checked live (first suspect if it fails)` });
      if (!x.fact || /^-+$/.test(x.fact)) out.push({ lvl: 'ERR', msg: `${t.key} ${kind}: empty Fact` });
    }
  }
  return out;
}

/** Live facts not yet in their module file. [{module, line}] */
export function toPromote(key, rows, modulesDir = MODULES) {
  const res = [];
  for (const r of rows.filter((x) => x.type === 'live' && x.fact)) {
    if (!r.module) continue;
    const doc = read(path.join(modulesDir, r.module));
    if (doc == null) continue;
    if (doc.includes(r.fact)) continue;
    res.push({ module: r.module, line: `- ${r.fact} (${key}, ${r.date}, live check by automator)` });
  }
  return res;
}
export function promote(key, rows, modulesDir = MODULES) {
  const items = toPromote(key, rows, modulesDir);
  const byFile = Object.groupBy ? Object.groupBy(items, (i) => i.module) : items.reduce((a, i) => ((a[i.module] ??= []).push(i), a), {});
  for (const [mod, list] of Object.entries(byFile)) {
    const f = path.join(modulesDir, mod);
    let doc = read(f).replace(/\n*$/, '\n');
    if (!/^## Live checks\b/m.test(doc)) doc += '\n## Live checks\nFacts checked on QA (read only) before a script step was written. Same rule: newest date wins.\n';
    fs.writeFileSync(f, doc + list.map((i) => i.line).join('\n') + '\n');
  }
  return items;
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'scan') {
    for (const f of rest) for (const t of scanSpec(read(path.resolve(f)) || '')) if (t.kinds.length) console.log(`${path.basename(f)}  ${t.key || '?'}${t.skipped ? ' (skipped)' : ''}  ${t.kinds.join(', ')}`);
  } else if (cmd === 'check') {
    const [key, ...specs] = rest; const rows = rowsFor([key]); let e = 0;
    for (const f of specs) for (const t of scanSpec(read(path.resolve(f)) || '')) for (const p of judge(t, rows)) { if (p.lvl === 'ERR') e++; console.log(`${p.lvl === 'ERR' ? 'ERR ' : 'WARN'} ${path.basename(f)}: ${p.msg}`); }
    console.log(`[live-check ${key}] ${e} error(s), ${rows.length} row(s)`); process.exit(e ? 1 : 0);
  } else if (cmd === 'promote') {
    const [key] = rest; const rows = rowsFor([key]);
    const items = rest.includes('--apply') ? promote(key, rows) : toPromote(key, rows);
    for (const i of items) console.log(`${i.module}: ${i.line}`);
    console.log(rest.includes('--apply') ? `added ${items.length} fact(s)` : `${items.length} fact(s) to add (run with --apply)`);
    const noMod = rows.filter((r) => r.type === 'live' && !r.module).length;
    if (noMod) console.log(`WARN ${noMod} live row(s) have no Module column, so they stay only in live-check.md`);
  } else if (cmd === 'stats') {
    const c = { doc: 0, live: 0, assumption: 0, bad: 0 }; const cards = new Set();
    for (const base of [path.join(ROOT, '.claude', 'team', 'work'), path.join(ROOT, 'work')]) for (const k of (fs.existsSync(base) ? fs.readdirSync(base) : [])) {
      const rows = parseLiveCheck(read(path.join(base, k, 'live-check.md')) || ''); if (rows.length) cards.add(k); rows.forEach((r) => c[r.type]++);
    }
    console.log(`cards ${cards.size} | from docs ${c.doc} | checked live ${c.live} | assumption ${c.assumption} | bad source ${c.bad}`);
  } else {
    console.error('Usage: live-check.mjs scan <spec...> | check <KEY> <spec...> | promote <KEY> [--apply] | stats'); process.exit(2);
  }
}
