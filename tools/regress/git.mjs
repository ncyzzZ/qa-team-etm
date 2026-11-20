// git.mjs - read-only stms-fe history for regress.mjs, through tools/heal/fe-git.mjs (allow-listed, no writes).
import path from 'node:path';
import { git as feGit } from '../heal/fe-git.mjs';
import { APP_FILES } from '../heal/source-lookup.mjs';
import { cardKeys } from './core.mjs';

const ONLY_VERSION = /^(package\.json|package-lock\.json)$/;

function changedFiles(feRepo, from, to, git) {
  let out = '';
  try { out = git(feRepo, ['diff', '--find-renames', '--unified=0', '--no-color', from, to, '--', ...APP_FILES], { timeout: 60_000 }); } catch { return []; }
  const files = [];
  let cur = null;
  for (const l of out.split('\n')) {
    const m = l.match(/^\+\+\+ b\/(.+)$/);
    if (m) { cur = { path: m[1], lines: [] }; files.push(cur); continue; }
    if (/^--- /.test(l) || /^\+\+\+ \/dev\/null/.test(l)) continue;
    if (/^diff --git a\/(\S+) b\/(\S+)/.test(l)) { // a deleted file has no "+++ b/" line: name it from the header
      const d = l.match(/ b\/(\S+)$/);
      cur = { path: d[1], lines: [] };
      files.push(cur);
      continue;
    }
    if (cur && /^[+-]/.test(l)) cur.lines.push(l.slice(1));
  }
  // the header and the +++ line both add an entry for the same file: keep one, merge lines
  const by = new Map();
  for (const f of files) { const e = by.get(f.path) || { path: f.path, lines: [] }; e.lines.push(...f.lines); by.set(f.path, e); }
  return [...by.values()].filter((f) => !f.path.endsWith('.spec.ts'));
}

/**
 * Merges (and other direct commits) on the first-parent line of <to> after <since>, oldest first.
 * @returns {{ commit, branch, keys: string[], files: { path, lines: string[] }[] }[]}
 */
export function merges(feRepo, since, to, { git = feGit } = {}) {
  const log = git(feRepo, ['log', '--first-parent', '--reverse', '--format=%H%x09%P%x09%s', `${since}..${to}`], { timeout: 60_000 });
  const out = [];
  for (const line of log.split('\n').filter(Boolean)) {
    const [commit, parents, subject] = line.split('\t');
    const first = parents.split(' ')[0];
    const isMerge = parents.split(' ').length > 1;
    if (!isMerge) {
      const names = git(feRepo, ['diff', '--name-only', first, commit]).split('\n').filter(Boolean);
      if (names.length && names.every((n) => ONLY_VERSION.test(n))) continue; // version bump
    }
    const branch = isMerge ? ((subject.match(/^Merge branch '([^']+)'/) || [])[1] || subject) : `${subject} (direct commit ${commit.slice(0, 7)})`;
    const files = changedFiles(feRepo, first, commit, git);
    if (!files.length) continue;
    out.push({ commit, branch, keys: cardKeys(branch), files });
  }
  return out;
}

/** tsconfig "paths" of stms-fe at <to> (e.g. @shared/* -> src/app/shared/*). */
function aliases(feRepo, to, git) {
  try {
    const raw = git(feRepo, ['show', `${to}:tsconfig.json`]).replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
    const paths = JSON.parse(raw).compilerOptions?.paths || {};
    return Object.entries(paths).map(([k, v]) => [k.replace(/\*$/, ''), String(v[0]).replace(/\*$/, '')]);
  } catch { return []; }
}

const noExt = (p) => p.replace(/\.(ts|html|scss)$/, '').replace(/\/index$/, '');

/** App files at <to> that import <fePath> (relative or tsconfig-alias imports). */
export function importers(feRepo, fePath, to, { git = feGit } = {}) {
  const target = noExt(fePath);
  const base = path.posix.basename(target);
  let hits = '';
  try { hits = git(feRepo, ['grep', '-l', '-F', '-e', base, to, '--', 'src/app']); } catch { return []; }
  const al = aliases(feRepo, to, git);
  const out = [];
  for (const h of hits.split('\n').filter(Boolean)) {
    const file = h.slice(h.indexOf(':') + 1);
    if (file === fePath || file.endsWith('.spec.ts')) continue;
    let src = '';
    try { src = git(feRepo, ['show', `${to}:${file}`]); } catch { continue; }
    for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      const spec = m[1] || m[2];
      let resolved = null;
      if (spec.startsWith('.')) resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
      else { const a = al.find(([k]) => spec.startsWith(k)); if (a) resolved = a[1] + spec.slice(a[0].length); }
      if (resolved && noExt(resolved) === target) { out.push(file); break; }
    }
  }
  return out.sort();
}

/** Last commit of <ref> before <isoDate>, or null. */
export function commitBefore(feRepo, ref, isoDate, { git = feGit } = {}) {
  const c = git(feRepo, ['log', '-1', '--format=%H', `--before=${isoDate}`, ref]);
  return c || null;
}
