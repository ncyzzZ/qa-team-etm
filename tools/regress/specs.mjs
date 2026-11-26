// specs.mjs - index of the listable Playwright specs for regress.mjs: folder, Xray test keys, locator tokens, owner card.
import { isKey } from '../profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { extractTokens, GENERIC_TOKENS, isLibraryToken } from '../heal/selectors.mjs';
import { pagesUsedBy } from '../heal/baseline.mjs';
import { isListable } from './core.mjs';

const rel = (root, abs) => path.relative(root, abs).split(path.sep).join('/');

function walk(dir, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p, out); } else out.push(p);
  }
  return out;
}

/** The spec plus every local file it imports (recursive, relative imports only). */
function localFiles(abs, seen = new Set()) {
  if (seen.has(abs) || !fs.existsSync(abs)) return seen;
  seen.add(abs);
  const src = fs.readFileSync(abs, 'utf8');
  for (const m of src.matchAll(/from\s*['"](\.\.?\/[^'"]+)['"]/g)) {
    const base = path.resolve(path.dirname(abs), m[1]);
    localFiles(base.endsWith('.ts') ? base : `${base}.ts`, seen);
  }
  return seen;
}

function unitFiles(pwRepo, unit) {
  const single = path.join(pwRepo, 'pages', `${unit}.ts`);
  if (fs.existsSync(single)) return [single];
  return walk(path.join(pwRepo, 'pages', unit)).filter((f) => f.endsWith('.ts'));
}

const TEXTISH = new Set(['text', 'role-name', 'label', 'placeholder']);
const UTILITY = /^-?(cursor|flex|text|bg|font|border|rounded|shadow|opacity|overflow|whitespace|truncate|items|justify|content|self|place|gap|space|grid|col|row|order|w|h|min|max|p[trblxy]?|m[trblxy]?|top|left|right|bottom|inset|z|leading|tracking|align|select|pointer|transition|duration|ease|hidden|block|inline|visible|invisible|sr|outline|ring|divide|fill|stroke)-/;
/**
 * Only distinctive tokens point at a spec: a plain word (Date, true, empty, chip) appears all over stms-fe.
 * Text: several words or 12+ characters. Class / id / attribute: 6+ characters with a dash, underscore or inner capital.
 */
function keep(v, kind) {
  if (!v || v.length < 4 || GENERIC_TOKENS.has(v) || isLibraryToken(v)) return false;
  if (TEXTISH.has(kind)) return /[\s/]/.test(v.trim()) || v.length >= 12;
  if (UTILITY.test(v)) return false; // Tailwind-style utility class: used all over stms-fe
  return v.length >= 6 && /[-_]|[a-z][A-Z]/.test(v);
}

/** Story key -> its Xray Test keys, from work/<KEY>/run-results.json, else .claude/team/work/<KEY>/tests.md. */
function storyTests(teamRoot) {
  const out = new Map();
  for (const base of [path.join(teamRoot, 'work'), path.join(teamRoot, '.claude', 'team', 'work')]) {
    let dirs = [];
    try { dirs = fs.readdirSync(base).filter((d) => isKey(d)); } catch { continue; }
    for (const d of dirs) {
      if (out.has(d)) continue;
      let keys = [];
      try { keys = Object.keys(JSON.parse(fs.readFileSync(path.join(base, d, 'run-results.json'), 'utf8')).tests || {}); } catch { /* none */ }
      if (!keys.length) {
        try { keys = [...new Set(fs.readFileSync(path.join(base, d, 'tests.md'), 'utf8').match(/ETM-\d+/g) || [])].filter((k) => k !== d); } catch { /* none */ }
      }
      if (keys.length) out.set(d, new Set(keys));
    }
  }
  return out;
}

/** @returns {{ file, folder, keys: string[], tokens: Set<string>, owner: string|null }[]} */
export function specIndex(pwRepo, teamRoot) {
  const stories = storyTests(teamRoot);
  const e2e = path.join(pwRepo, 'tests', 'fe', 'e2e');
  const out = [];
  for (const abs of walk(e2e).filter((f) => f.endsWith('.spec.ts'))) {
    const file = rel(pwRepo, abs);
    if (!isListable(file)) continue;
    const src = fs.readFileSync(abs, 'utf8');
    const keys = [...new Set([...src.matchAll(/test(?:\.\w+)?\(\s*['"`][^'"`]*?(ETM-\d+)/g)].map((m) => m[1]))];
    const files = [...localFiles(abs)];
    for (const u of pagesUsedBy(pwRepo, [file])) files.push(...unitFiles(pwRepo, u));
    const tokens = new Set();
    for (const f of new Set(files)) {
      let s = '';
      try { s = fs.readFileSync(f, 'utf8'); } catch { continue; }
      for (const t of extractTokens(s, f)) if (keep(t.value, t.kind)) tokens.add(t.value);
    }
    let owner = null;
    for (const [story, tests] of stories) if (keys.some((k) => tests.has(k))) { owner = story; break; }
    out.push({ file, folder: file.split('/')[3], keys, tokens, owner });
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}
