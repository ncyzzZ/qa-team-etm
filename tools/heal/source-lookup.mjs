#!/usr/bin/env node
// source-lookup.mjs - for one broken locator token, look in stms-fe (read only, through fe-git.mjs):
//   is it still in the code at <ref>? if not, which commit removed it, and what replaced it on the same line?
//   node tools/heal/source-lookup.mjs "<selector or text>" [--kind class|id|attr|text|role-name|placeholder|label|tag] [--ref origin/develop]
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { git as realGit } from './fe-git.mjs';
import { isLibraryToken, extractTokens } from './selectors.mjs';
import { resolveRepos } from './config.mjs';
import { profile } from '../profile.mjs';

const TEXTISH = new Set(['text', 'role-name', 'label']);
/** stms-fe files that make up the running app (pathspecs). .spec.ts files are dropped after the grep. */
export const APP_FILES = [':(glob)src/**/*.html', ':(glob)src/**/*.ts', ':(glob)src/**/*.scss'];

/** Tokens of one kind found in one line of stms-fe source (.html or .ts). */
export function feTokens(line, kind) {
  const out = new Set();
  const add = (v) => { v = (v || '').trim(); if (v) out.add(v); };
  const attrs = [...line.matchAll(/([\w.\-[\]()]+)\s*=\s*"([^"]*)"/g)];
  if (kind === 'class') {
    for (const [, name, val] of attrs) if (/^(class|\w*ClassName|panelClass|nzWrapClassName)$/i.test(name) && !/[{}()]/.test(val)) val.split(/\s+/).forEach(add);
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
    for (const [, name, val] of attrs) if (/^(aria-label|\w*title|\w*label|nzOkText|nzCancelText|\w*header|placeholder)$/i.test(name) && !/[{}()]/.test(val)) add(val);
    for (const m of line.matchAll(/(?<![\w$])(['])((?:\\.|[^'\\])+)\1/g)) if (/\s|^[A-Z]/.test(m[2])) add(m[2]); // TS labels
  }
  return out;
}

const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Does this stms-fe line (html, ts or scss) use the token? Wider than feTokens: a class or tag anywhere as a whole
 * word (scss rules, ...ClassName attributes, selector: in a decorator), a text alone on its line.
 */
export function mentionsToken(line, kind, value) {
  if (/^\s*(\*|\/\/|\/\*|<!--)/.test(line) || /^\s*(import|export)\s.*from\s/.test(line)) return false; // comments, imports
  line = line.replace(/\/\/.*$|\/\*.*?\*\/|<!--.*?-->/g, ''); // trailing comments
  if (feTokens(line, kind).has(value)) return true;
  if (['class', 'id', 'tag', 'attr'].includes(kind)) return new RegExp(`(^|[^\\w\\-/])${esc(value)}($|(?![\\w-]|\\.(component|service|module|model|util|spec|routes)\\b))`).test(line);
  return line.trim() === value;
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
export function lookup(feRepo, token, ref = `origin/${profile().repos.feBranch}`, { git = realGit } = {}) {
  const { kind, value } = token;
  if ((kind === 'class' || kind === 'tag') && isLibraryToken(value)) return NONE({ library: true });
  // 1) still present at ref?
  let files = [];
  try { files = git(feRepo, ['grep', '-F', '-l', '-e', value, ref, '--', ...APP_FILES]).split('\n').filter(Boolean).filter((f) => !/\.spec\.ts$/.test(f)); } catch { files = []; } // grep exits 1 when nothing matches
  for (const f of files) {
    const pathAtRef = f.slice(ref.length + 1);
    const content = git(feRepo, ['show', `${ref}:${pathAtRef}`]);
    if (content.split('\n').some((l) => mentionsToken(l, kind, value))) return NONE({ present: true });
  }
  // 2) which commit removed it, and what replaced it?
  // -G (lines that mention it changed), not -S (count changed): "Save" -> "Save Plan" keeps the count the same
  const re = esc(value);
  const log = git(feRepo, ['log', '-G', re, '--format=%H%x09%an%x09%cI', ref, '--', ...APP_FILES]).split('\n').filter(Boolean);
  for (const row of log) {
    const [commit, author, date] = row.split('\t');
    const diff = git(feRepo, ['show', '--format=', '--unified=0', '--no-color', commit, '--', ...APP_FILES]);
    for (const b of changeBlocks(diff)) {
      if (/\.spec\.ts$/.test(b.file)) continue;
      const idx = b.minus.findIndex((l) => mentionsToken(l, kind, value));
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
  if (!sel) { console.error('Usage: node tools/heal/source-lookup.mjs "<selector or text>" [--kind class] [--ref origin/<branch>]'); process.exit(2); }
  const { feRepo } = resolveRepos();
  const kindArg = opt('--kind', null);
  // a full Playwright locator ("locator('.x')", "getByText('Save')") is parsed into tokens; a bare value needs --kind
  const toks = kindArg ? [{ kind: kindArg, value: sel }] : extractTokens(/locator\(|getBy/.test(sel) ? sel : `locator('${sel}')`, 'cli');
  const out = toks.map((t) => ({ token: `${t.kind}:${t.value}`, ...lookup(feRepo, t, opt('--ref', `origin/${profile().repos.feBranch}`)) }));
  console.log(JSON.stringify(out, null, 2));
}
