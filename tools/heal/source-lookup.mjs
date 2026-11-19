#!/usr/bin/env node
// source-lookup.mjs - for one broken locator token, look in stms-fe (read only, through fe-git.mjs):
//   is it still in the code at <ref>? if not, which commit removed it, and what replaced it on the same line?
//   node tools/heal/source-lookup.mjs "<selector or text>" [--kind class|id|attr|text|role-name|placeholder|label|tag] [--ref origin/develop]
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { git as realGit } from './fe-git.mjs';
import { isLibraryToken, extractTokens } from './selectors.mjs';
import { resolveRepos } from './config.mjs';

const TEXTISH = new Set(['text', 'role-name', 'label']);

/** Tokens of one kind found in one line of stms-fe source (.html or .ts). */
export function feTokens(line, kind) {
  const out = new Set();
  const add = (v) => { v = (v || '').trim(); if (v) out.add(v); };
  const attrs = [...line.matchAll(/([\w.\-[\]()]+)\s*=\s*"([^"]*)"/g)];
  if (kind === 'class') {
    for (const [, name, val] of attrs) if (name === 'class') val.split(/\s+/).forEach(add);
    for (const m of line.matchAll(/\[class\.([\w-]+)\]/g)) add(m[1]);
  } else if (kind === 'id') {
    for (const [, name, val] of attrs) if (name === 'id') add(val);
  } else if (kind === 'attr') {
    for (const [, name, val] of attrs) if (!/^(class|style)$/.test(name) && !/[{}()]/.test(val)) add(val);
  } else if (kind === 'tag') {
    for (const m of line.matchAll(/<([a-z][a-z0-9]*-[a-z0-9-]+)/g)) add(m[1]);
  } else if (kind === 'placeholder') {
    for (const [, name, val] of attrs) if (/^(placeholder|nzPlaceHolder|\[?placeholder\]?)$/i.test(name)) add(val);
  } else if (TEXTISH.has(kind)) {
    for (const m of line.matchAll(/>([^<>{}]+)</g)) add(m[1]);
    for (const m of line.matchAll(/>([^<>{}]+)$/g)) add(m[1]);
    for (const m of line.matchAll(/^\s*([^<>{}=]+)</g)) add(m[1]);
    for (const [, name, val] of attrs) if (/^(aria-label|title|label|nzTitle|nzOkText|nzCancelText)$/i.test(name)) add(val);
    for (const m of line.matchAll(/(?<![\w$])(['])((?:\\.|[^'\\])+)\1/g)) if (/\s|^[A-Z]/.test(m[2])) add(m[2]); // TS labels
  }
  return out;
}

const NONE = (extra = {}) => ({ present: false, library: false, removedIn: null, candidates: [], ...extra });

/** Pair removed and added lines of each change block in a unified diff. */
function changeBlocks(diff) {
  const blocks = [];
  let file = '', minus = [], plus = [];
  const flush = () => { if (minus.length) blocks.push({ file, minus, plus }); minus = []; plus = []; };
  for (const l of diff.split('\n')) {
    if (l.startsWith('+++ ')) { flush(); file = l.replace(/^\+\+\+ b\//, ''); continue; }
    if (l.startsWith('--- ') || l.startsWith('diff ') || l.startsWith('@@')) { flush(); continue; }
    if (l.startsWith('-')) { if (plus.length) flush(); minus.push(l.slice(1)); } else if (l.startsWith('+')) plus.push(l.slice(1)); else flush();
  }
  flush();
  return blocks;
}

/**
 * @param {string} feRepo
 * @param {{ kind: string, value: string }} token
 * @returns {{ present: boolean, library: boolean, removedIn: { commit: string, author: string, date: string, file: string }|null, candidates: string[] }}
 */
export function lookup(feRepo, token, ref = 'origin/develop', { git = realGit } = {}) {
  const { kind, value } = token;
  if (kind === 'class' && isLibraryToken(value)) return NONE({ library: true });
  // 1) still present at ref?
  let files = [];
  try { files = git(feRepo, ['grep', '-F', '-l', '-e', value, ref, '--', 'src']).split('\n').filter(Boolean); } catch { files = []; } // grep exits 1 when nothing matches
  for (const f of files) {
    const pathAtRef = f.slice(ref.length + 1);
    const content = git(feRepo, ['show', `${ref}:${pathAtRef}`]);
    if (content.split('\n').some((l) => feTokens(l, kind).has(value))) return NONE({ present: true });
  }
  // 2) which commit removed it, and what replaced it?
  // -G (lines that mention it changed), not -S (count changed): "Save" -> "Save Plan" keeps the count the same
  const re = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const log = git(feRepo, ['log', '-G', re, '--format=%H%x09%an%x09%cI', ref, '--', 'src']).split('\n').filter(Boolean);
  for (const row of log) {
    const [commit, author, date] = row.split('\t');
    const diff = git(feRepo, ['show', '--format=', '--unified=0', '--no-color', commit, '--', 'src']);
    for (const b of changeBlocks(diff)) {
      const idx = b.minus.findIndex((l) => feTokens(l, kind).has(value));
      if (idx < 0) continue;
      const removed = new Set(b.minus.flatMap((l) => [...feTokens(l, kind)]));
      const partner = b.minus.length === b.plus.length ? [b.plus[idx]] : b.plus;
      const candidates = [...new Set(partner.flatMap((l) => [...feTokens(l, kind)]))].filter((c) => !removed.has(c));
      return { present: false, library: false, removedIn: { commit, author, date, file: b.file }, candidates };
    }
  }
  return NONE();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
  const sel = args[0];
  if (!sel) { console.error('Usage: node tools/heal/source-lookup.mjs "<selector or text>" [--kind class] [--ref origin/develop]'); process.exit(2); }
  const { feRepo } = resolveRepos();
  const kindArg = opt('--kind', null);
  // a full Playwright locator ("locator('.x')", "getByText('Save')") is parsed into tokens; a bare value needs --kind
  const toks = kindArg ? [{ kind: kindArg, value: sel }] : extractTokens(/locator\(|getBy/.test(sel) ? sel : `locator('${sel}')`, 'cli');
  const out = toks.map((t) => ({ token: `${t.kind}:${t.value}`, ...lookup(feRepo, t, opt('--ref', 'origin/develop')) }));
  console.log(JSON.stringify(out, null, 2));
}
