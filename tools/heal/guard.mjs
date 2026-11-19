#!/usr/bin/env node
// guard.mjs - a heal may only change HOW an element is found, never WHAT is checked.
//   node tools/heal/guard.mjs <diff-file>      prints "[heal-guard] N error(s)", exit 1 on errors
// Allow-list, not deny-list: every changed line must be paired with exactly one new line in a pages/*.ts file,
// the pair must be a locator line (locator(, getBy*(, hasText:, name:), and the two lines must be identical
// except for the text inside string literals. The new strings may not widen the match (nth=, :first-child, *).
// Anything else (new/removed lines, other code, expect lines, renames, binary, modes) is refused and left to a person.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRING = /(['"])((?:\\.|(?!\1)[^\\])*)\1|`((?:\\.|[^`\\$])*)`/g; // template literals with ${} are not strings here
const LOCATOR_CONTEXT = /\b(locator|frameLocator|getBy\w+)\s*\(|\bhasText\s*:|\bname\s*:/;
const CHECK_WORDS = /\bexpect\b|\bassert\b|\.toHave|\.toBe|\.toContain|\.toMatch/;
const WIDEN = /(^|\s|>>)\s*nth=|:first-child|:last-child|:nth-|:first\b|:last\b|^\s*\*\s*$|>>\s*\*\s*$/;
const BAD_HEADER = /^(rename (from|to)|copy (from|to)|old mode|new mode|deleted file mode|new file mode|similarity index|dissimilarity index|Binary files|GIT binary patch)/;

function validPath(p) {
  p = String(p).replace(/\t.*$/, '').trim().replace(/\\/g, '/');
  if (!p || p.startsWith('"') || p.startsWith('/') || /^[A-Za-z]:/.test(p)) return false;
  if (p.split('/').some((s) => s === '..' || s === '.')) return false;
  return path.posix.normalize(p) === p && /^pages\/[\w\-./]+\.ts$/.test(p);
}

const strings = (line) => [...line.matchAll(STRING)].map((m) => m[2] ?? m[3] ?? '');
const skeleton = (line) => line.replace(STRING, '§').replace(/\s+/g, ' ').trim();

function checkPair(file, m, p, errors) {
  const show = `${m.trim()}  ->  ${p.trim()}`;
  if (CHECK_WORDS.test(m) || CHECK_WORDS.test(p)) { errors.push(`${file}: changes an assertion line: ${show}`); return; }
  if (!LOCATOR_CONTEXT.test(m) || !LOCATOR_CONTEXT.test(p)) { errors.push(`${file}: not a locator line: ${show}`); return; }
  if (skeleton(m) !== skeleton(p)) { errors.push(`${file}: changes more than the locator text: ${show}`); return; }
  const before = strings(m), after = strings(p);
  after.forEach((s, i) => { if (s !== before[i] && WIDEN.test(s)) errors.push(`${file}: new selector widens the match ("${s}"): ${show}`); });
}

/** @returns {{ ok: boolean, errors: string[] }} */
export function checkHealDiff(unifiedDiff) {
  const errors = [];
  const lines = String(unifiedDiff).replace(/\r\n?/g, '\n').split('\n');
  let file = null, oldLeft = 0, newLeft = 0, minus = [], plus = [], pairs = 0;
  const flush = () => {
    if (!minus.length && !plus.length) return;
    if (minus.length !== plus.length) errors.push(`${file}: adds or removes lines (${minus.length} removed, ${plus.length} added); a heal only rewrites locator lines`);
    else minus.forEach((m, i) => { checkPair(file, m, plus[i], errors); pairs++; });
    minus = []; plus = [];
  };
  for (const l of lines) {
    if (oldLeft > 0 || newLeft > 0) { // inside a hunk: every line is content, even "-- x" or "++ y"
      if (l.startsWith('\\')) continue;
      if (l.startsWith('-')) { if (plus.length) flush(); minus.push(l.slice(1)); oldLeft--; }
      else if (l.startsWith('+')) { plus.push(l.slice(1)); newLeft--; }
      else { flush(); oldLeft--; newLeft--; }
      if (oldLeft <= 0 && newLeft <= 0) flush();
      continue;
    }
    flush();
    let m;
    if ((m = l.match(/^diff --git a\/(.+) b\/(.+)$/))) {
      file = m[2];
      if (m[1] !== m[2] || !validPath(m[1])) errors.push(`${m[1]} -> ${m[2]}: a heal may change only existing pages/*.ts files, in place`);
    } else if (BAD_HEADER.test(l)) {
      errors.push(`${file ?? '?'}: ${l.trim()}: renames, copies, mode or binary changes are not heals`);
    } else if ((m = l.match(/^(---|\+\+\+) (.+)$/))) {
      const p = m[2].replace(/^[ab]\//, '');
      if (m[1] === '+++') file = p.replace(/\t.*$/, '').trim();
      if (!validPath(p)) errors.push(`${p}: a heal may change only existing pages/*.ts files`);
    } else if ((m = l.match(/^@@ -\d+(?:,(\d+))? \+\d+(?:,(\d+))? @@/))) {
      oldLeft = m[1] === undefined ? 1 : Number(m[1]);
      newLeft = m[2] === undefined ? 1 : Number(m[2]);
    }
  }
  flush();
  if (!pairs && !errors.length) errors.push('empty diff: nothing to heal');
  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const f = process.argv[2];
  if (!f || !fs.existsSync(f)) { console.error('Usage: node tools/heal/guard.mjs <diff-file>'); process.exit(2); }
  const r = checkHealDiff(fs.readFileSync(f, 'utf8'));
  for (const e of r.errors) console.log(`  ERR  ${e}`);
  console.log(`[heal-guard] ${r.errors.length} error(s)`);
  process.exit(r.ok ? 0 : 1);
}
