// core.mjs - the card state object (.claude/team/work/<KEY>/state.json): schema, validation, checksum, atomic save.
// Only tools/state.mjs (the lead) writes through save(). A record here is never an approval: approvals are a chat
// reply or the ANSWER: line of team.mjs wait (CLAUDE.md rule 3); this file only remembers them with their evidence.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PHASES = ['start', 'read', 'quick-scan', 'design', 'review', 'tc-review', 'xray-approval', 'push', 'scripts', 'run', 'failures', 'heal', 'closeout', 'done'];
export const APPROVAL_KINDS = ['run-tests', 'xray-push', 'defect', 'jira-write', 'delete', 'heal-apply'];
export const SINGLE_KINDS = ['story', 'analyst', 'inspector', 'draft', 'review', 'tests', 'findings', 'lastRun'];
export const LIST_KINDS = ['questions', 'answers', 'specs'];
export const AC_ID = /^AC-\d+(?:\.\d+)*$/;
const HISTORY_MAX = 50;

export const statePath = (key, root = ROOT) => path.join(root, '.claude', 'team', 'work', key, 'state.json');

/** @returns {object} a complete, valid, empty state */
export function emptyState(key) {
  return {
    schemaVersion: 1, card: key, phase: 'start', next: '', updated: new Date().toISOString(),
    ac: [], files: { questions: [], answers: [], specs: [], extra: {} }, decisions: [], open: [], approvals: [], gates: {}, history: [],
  };
}

const isStr = (v) => typeof v === 'string';
const isArr = Array.isArray;
const isObj = (v) => v && typeof v === 'object' && !isArr(v);

/** @returns {string[]} error messages, [] when valid */
export function validate(s, key) {
  const e = [];
  if (!isObj(s)) return ['state is not an object'];
  if (s.schemaVersion !== 1) e.push(`schemaVersion must be 1, got ${s.schemaVersion}`);
  if (!/^ETM-\d+$/.test(s.card || '')) e.push(`card must be ETM-<n>, got ${s.card}`);
  if (key && s.card !== key) e.push(`card ${s.card} does not match folder ${key}`);
  if (!PHASES.includes(s.phase)) e.push(`unknown phase "${s.phase}" (one of: ${PHASES.join(', ')})`);
  if (!isStr(s.next)) e.push('next must be text');
  if (!isStr(s.updated)) e.push('updated must be an ISO date');
  if (!isArr(s.ac)) e.push('ac must be a list');
  else s.ac.forEach((a, i) => {
    if (!AC_ID.test(a?.id || '')) e.push(`ac[${i}].id "${a?.id}" is not AC-n`);
    if (!['active', 'changed', 'dropped'].includes(a?.status)) e.push(`ac[${i}].status must be active|changed|dropped`);
  });
  if (!isObj(s.files)) e.push('files must be an object');
  else {
    for (const k of SINGLE_KINDS) if (s.files[k] !== undefined && !isStr(s.files[k])) e.push(`files.${k} must be one path`);
    for (const k of LIST_KINDS) if (!isArr(s.files[k]) || !s.files[k].every(isStr)) e.push(`files.${k} must be a list of paths`);
    if (!isObj(s.files.extra)) e.push('files.extra must be an object');
    for (const k of Object.keys(s.files)) if (![...SINGLE_KINDS, ...LIST_KINDS, 'extra'].includes(k)) e.push(`files.${k} is not a known kind (use files.extra)`);
  }
  for (const k of ['decisions', 'open', 'approvals', 'history']) if (!isArr(s[k])) e.push(`${k} must be a list`);
  if (isArr(s.decisions)) s.decisions.forEach((d, i) => { if (!isStr(d?.text) || !d.text || !isStr(d?.source) || !d.source) e.push(`decisions[${i}] needs text and source`); });
  if (isArr(s.approvals)) s.approvals.forEach((a, i) => {
    if (!APPROVAL_KINDS.includes(a?.kind)) e.push(`approvals[${i}].kind "${a?.kind}" not one of ${APPROVAL_KINDS.join(', ')}`);
    if (!['chat', 'board'].includes(a?.source)) e.push(`approvals[${i}].source must be chat or board`);
    if (!isStr(a?.evidence) || !a.evidence.trim()) e.push(`approvals[${i}] has no evidence`);
    else if (a.source === 'board' && !a.evidence.includes('ANSWER:')) e.push(`approvals[${i}]: a board approval needs the ANSWER: line from team.mjs wait as evidence`);
  });
  if (!isObj(s.gates)) e.push('gates must be an object');
  return e;
}

const withoutChecksum = (s) => { const { checksum, ...rest } = s; return rest; };
export const computeChecksum = (s) => crypto.createHash('sha256').update(JSON.stringify(withoutChecksum(s), null, 2)).digest('hex');

/** @returns {{ state: object|null, errors: string[] }} */
export function load(key, root = ROOT) {
  const f = statePath(key, root);
  if (!fs.existsSync(f)) return { state: null, errors: [`no state.json for ${key} (run: node tools/state.mjs init ${key})`] };
  let s;
  try { s = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (err) { return { state: null, errors: [`state.json is not valid JSON: ${err.message}`] }; }
  const errors = validate(s, key);
  if (s && s.checksum !== computeChecksum(s)) errors.unshift('checksum mismatch: state.json was edited outside tools/state.mjs');
  return { state: s, errors };
}

/** Validate, add a history line, write atomically with a fresh checksum. Throws (and keeps the old file) when invalid. */
export function save(key, state, change, root = ROOT) {
  const s = structuredClone(withoutChecksum(state));
  s.updated = new Date().toISOString();
  s.history = [...(s.history || []), { at: s.updated, by: 'lead', change }].slice(-HISTORY_MAX);
  const errors = validate(s, key);
  if (errors.length) throw new Error(`state not saved: ${errors.join('; ')}`);
  s.checksum = computeChecksum(s);
  const f = statePath(key, root);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  const tmp = `${f}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2) + '\n');
  fs.renameSync(tmp, f);
  return s;
}

/**
 * Where a card file path points, and whether it is allowed: inside .claude/team/work/<KEY>/ or work/<KEY>/,
 * or "pw:<path>" inside the Playwright repo. Backslashes are stored as "/".
 * @returns {{ abs: string, allowed: boolean, stored: string }}
 */
export function resolveFile(key, p, { root = ROOT, pwRepo } = {}) {
  const stored = String(p).trim().replace(/\\/g, '/');
  if (stored.startsWith('pw:')) {
    const rel = stored.slice(3);
    const abs = pwRepo ? path.resolve(pwRepo, rel) : '';
    const allowed = !!pwRepo && !path.isAbsolute(rel) && !path.relative(pwRepo, abs).startsWith('..');
    return { abs, allowed, stored };
  }
  const abs = path.resolve(root, stored);
  const inside = (dir) => { const r = path.relative(path.join(root, dir), abs); return r && !r.startsWith('..') && !path.isAbsolute(r); };
  return { abs, allowed: !path.isAbsolute(stored) && (inside(path.join('.claude', 'team', 'work', key)) || inside(path.join('work', key))), stored };
}

/** AC items of analyst.md, same rules as qa-check.mjs parseAc (section "## AC items"; a parent listed with its sub-items is dropped). */
export function parseAc(text) {
  const sec = (String(text).match(/^##\s+AC items[^\n]*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/im) || [])[1] || '';
  const seen = new Map();
  for (const m of sec.matchAll(/^\s*(?:[-*]\s*)?\**(AC-\d+(?:\.\d+)*)\b\**[:.)]?\s*(.*)$/gim)) {
    const id = m[1].toUpperCase();
    if (!seen.has(id)) seen.set(id, { id, text: m[2].replace(/\[NEG\]/gi, '').trim() });
  }
  return [...seen.values()].filter((a) => ![...seen.keys()].some((k) => k.startsWith(a.id + '.')));
}

/** Phase and next step of a card for the board. Read-only, never throws (missing or broken file -> nulls). */
export function phaseOf(key, root = ROOT) {
  try {
    const s = JSON.parse(fs.readFileSync(statePath(key, root), 'utf8'));
    return { phase: PHASES.includes(s.phase) ? s.phase : null, next: typeof s.next === 'string' && s.next ? s.next : null };
  } catch { return { phase: null, next: null }; }
}
