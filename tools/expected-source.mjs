#!/usr/bin/env node
// expected-source.mjs - an Expected Result that decides a defect or a retest must quote its source word for word (gate G-exp).
// AI misses M-14 / M-16 (ETM-8521): "skipped cells = blank" came from our own summary in story.md and from the wording of
// OUR question to the BA, not from the AC or the BA's answer; ETM-10058 was reopened as Retest Failed on it. M-15: a manual
// step said "unchanged" for a value the AC says is recalculated.
//
// In a defect draft (or a retest note), under "### Expected Result":
//   Source:
//   > ETM-2615 AC 1.2: "Ctrl+click selects cells that are not next to each other"
//   > BA 2026-11-25 R3-1: "a"          (a quote must be at least 3 words, or name a BA option with its text in the source)
//   > QA lead 2026-11-26: "skipped cells keep their old values"
// Each quote must be found word for word (case, spaces, punctuation ignored) in a SOURCE file:
//   work/<any>/source/**  (Jira AC / description copied as is, the BA's reply as written, the user's ruling in chat)
//   work/SPRINT*/ba-answers-all-*.md  (the BA's full replies)
// Not sources (our own words): story.md, analyst.md, ba-answers.md, questions-for-BA*, draft-tc.md, tests.md, findings.json.
// Strong words in the Expected text (blank, unchanged, kept, cleared, rejected, disabled ...) must also be in a quote.
//
//   node tools/expected-source.mjs check <file.md ...> [--root <dir>]   ERR / WARN per file (exit 1 on ERR)
//   node tools/expected-source.mjs manual <KEY>                         WARN: strong words in manual-steps Expected not in the Xray step
//   node tools/expected-source.mjs sources                              list the source files
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT0 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => { try { return fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); } catch { return null; } };

/** Words that turn a vague expectation into a rule. Each must be backed by a quote. [label, regex] */
export const STRONG = [
  ['blank / empty', /\b(blank|empty)\b/i],
  ['unchanged / the same', /\b(unchanged|not changed|no change|stays? the same|same as before|remains?)\b/i],
  ['kept / keeps', /\b(kept|keeps?)\b/i],
  ['cleared', /\b(clear(ed|s)?)\b/i],
  ['rejected', /\b(reject(ed|s)?)\b/i],
  ['disabled / enabled', /\b(disabled|enabled)\b/i],
  ['red / error', /\b(red|error message|error)\b/i],
  ['not pasted / not saved', /\bnot (pasted|saved|copied|shown|allowed)\b/i],
];

export const norm = (s) => String(s).toLowerCase().replace(/[`*_"'“”‘’()[\]{}<>|]/g, ' ').replace(/[.,;:!?]/g, ' ').replace(/\s+/g, ' ').trim();

/** Quote lines `> <ref>: "<text>"` of a block. */
export function quotesIn(text) {
  const out = [];
  for (const l of text.split('\n')) {
    const m = l.match(/^\s*>\s*([^:"“]{2,80}):\s*["“](.+)["”]\s*$/);
    if (m) out.push({ ref: m[1].trim(), text: m[2].trim() });
  }
  return out;
}

/** Expected sections of a markdown file: text under headings that contain "Expected". */
export function expectedSections(md) {
  const lines = md.split('\n'); const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^(#{2,4}\s.*Expected|\*\*Expected[^*]*\*\*)/i.test(lines[i].trim())) continue;
    const body = [];
    for (const l of lines.slice(i + 1)) { if (/^#{1,4}\s/.test(l) || /^---\s*$/.test(l)) break; body.push(l); }
    out.push({ line: i + 1, text: body.join('\n') });
  }
  return out;
}

const NOT_SOURCE = /(^|\/)(story\.md|analyst\.md|ba-answers\.md|draft-tc\.md|tests\.md|findings\.json|questions-for-BA[^/]*|ba-self-answers[^/]*)$/i;
/** Source files (verbatim text only). */
export function sourceFiles(root = ROOT0) {
  const out = [];
  const walk = (d) => { for (const e of fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }) : []) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(md|txt)$/i.test(e.name)) out.push(p); } };
  for (const base of [path.join(root, 'work'), path.join(root, '.claude', 'team', 'work')]) {
    for (const k of fs.existsSync(base) ? fs.readdirSync(base) : []) {
      walk(path.join(base, k, 'source'));
      if (/^SPRINT/i.test(k)) for (const f of fs.readdirSync(path.join(base, k))) if (/^ba-answers-all.*\.md$/i.test(f)) out.push(path.join(base, k, f));
    }
  }
  return out.filter((f) => !NOT_SOURCE.test(f));
}
/** Our own summaries and questions: a quote found only there is a classic miss. */
export function summaryFiles(root = ROOT0) {
  const out = [];
  for (const base of [path.join(root, 'work'), path.join(root, '.claude', 'team', 'work')]) {
    for (const k of fs.existsSync(base) ? fs.readdirSync(base) : []) {
      const d = path.join(base, k); if (!fs.statSync(d).isDirectory()) continue;
      for (const f of fs.readdirSync(d)) if (NOT_SOURCE.test(f)) out.push(path.join(d, f));
    }
  }
  return out;
}

/** Problems of one file: [{lvl, msg}] */
export function checkText(md, { sources, summaries = [], root = ROOT0 }) {
  const out = [];
  const secs = expectedSections(md);
  if (!secs.length) return [{ lvl: 'ERR', msg: 'no "Expected Result" section' }];
  const srcText = sources.map((f) => ({ f, t: norm(read(f) || '') }));
  const sumText = summaries.map((f) => ({ f, t: norm(read(f) || '') }));
  for (const s of secs) {
    const qs = quotesIn(s.text);
    const claim = s.text.split('\n').filter((l) => !/^\s*>/.test(l) && !/^\s*source:\s*$/i.test(l)).join(' ');
    if (!qs.length) { out.push({ lvl: 'ERR', msg: `line ${s.line}: Expected Result has no source quote (> <AC / BA / QA lead ref>: "<words as written>")` }); continue; }
    for (const q of qs) {
      const n = norm(q.text);
      if (n.split(' ').length < 3 && !/\bBA\b/i.test(q.ref)) { out.push({ lvl: 'ERR', msg: `line ${s.line}: quote "${q.text}" is too short to check (at least 3 words)` }); continue; }
      const hit = srcText.find((x) => x.t.includes(n));
      if (hit) { q.file = path.relative(root, hit.f); continue; }
      const sum = sumText.find((x) => x.t.includes(n));
      out.push({ lvl: 'ERR', msg: sum
        ? `line ${s.line}: "${q.text.slice(0, 60)}" is only in ${path.relative(root, sum.f)} (our own summary or question, not the AC / BA answer): quote the original text and save it under work/<KEY>/source/`
        : `line ${s.line}: "${q.text.slice(0, 60)}" (${q.ref}) is not word for word in any source file (work/*/source/, work/SPRINT*/ba-answers-all-*.md)` });
    }
    const quoted = qs.map((q) => q.text).join(' ');
    for (const [label, re] of STRONG) if (re.test(claim) && !re.test(quoted)) out.push({ lvl: 'ERR', msg: `line ${s.line}: Expected says "${claim.match(re)[0]}" (${label}) but no quoted source says it: quote the rule that says it, or remove it` });
  }
  return out;
}

/** WARN rows for manual-steps files: strong words in Expected that the Xray step of that Test does not have. */
export async function checkManualFiles(key, root = ROOT0) {
  const { parseManualSteps } = await import('./manual/steps.mjs');
  const tests = read(path.join(root, '.claude', 'team', 'work', key, 'tests.md')) || '';
  const section = (k) => { const i = tests.search(new RegExp(`^##\\s+${k}\\b`, 'm')); if (i < 0) return ''; const rest = tests.slice(i + 1); const j = rest.search(/^##\s/m); return j < 0 ? rest : rest.slice(0, j); };
  const out = [];
  const dir = path.join(root, 'work', key);
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => /^manual-steps-.*\.md$/.test(x)) : []) {
    for (const t of parseManualSteps(read(path.join(dir, f)))) {
      const xr = section(t.key);
      for (const st of t.steps) for (const [label, re] of STRONG) {
        if (re.test(st.expected) && !re.test(xr)) out.push({ lvl: 'WARN', msg: `${f} ${t.key} step ${st.n}: Expected says "${st.expected.match(re)[0]}" (${label}) but the Xray steps of ${t.key} do not: is it in the AC? (AI miss M-15)` });
      }
    }
  }
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  const ri = rest.indexOf('--root'); const root = ri >= 0 ? path.resolve(rest[ri + 1]) : ROOT0;
  const args = rest.filter((a, i) => a !== '--root' && rest[i - 1] !== '--root');
  if (cmd === 'check' && args.length) {
    const ctx = { sources: sourceFiles(root), summaries: summaryFiles(root), root };
    let e = 0;
    for (const f of args) {
      const md = read(path.resolve(f)); const ps = md == null ? [{ lvl: 'ERR', msg: 'file not found' }] : checkText(md, ctx);
      e += ps.filter((p) => p.lvl === 'ERR').length;
      console.log(`[expected-source] ${f}: ${ps.filter((p) => p.lvl === 'ERR').length} error(s)`);
      for (const p of ps) console.log(`  ${p.lvl === 'ERR' ? 'ERR ' : 'WARN'} ${p.msg}`);
    }
    process.exit(e ? 1 : 0);
  } else if (cmd === 'manual' && /^ETM-\d+$/.test(args[0] || '')) {
    const ps = await checkManualFiles(args[0], root);
    for (const p of ps) console.log(`  WARN ${p.msg}`);
    console.log(`[expected-source manual ${args[0]}] ${ps.length} warning(s)`);
  } else if (cmd === 'sources') {
    for (const f of sourceFiles(root)) console.log(path.relative(root, f));
  } else {
    console.error('Usage: expected-source.mjs check <file.md ...> | manual <KEY> | sources   [--root <dir>]'); process.exit(2);
  }
}
