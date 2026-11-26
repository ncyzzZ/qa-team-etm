// core.mjs - the card state object (.claude/team/work/<KEY>/state.json): schema, validation, checksum, atomic save.
// Only tools/state.mjs (the lead) writes through save(). A record here is never an approval: approvals are a chat
// reply or the ANSWER: line of team.mjs wait (CLAUDE.md rule 3); this file only remembers them with their evidence.
import { isKey, profile } from '../profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PHASES = ['start', 'read', 'quick-scan', 'design', 'review', 'tc-review', 'xray-approval', 'push', 'scripts', 'run', 'failures', 'heal', 'closeout', 'done'];
export const APPROVAL_KINDS = ['run-tests', 'xray-push', 'defect', 'jira-write', 'delete', 'heal-apply', 'data-reset'];
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
  if (!isKey(s.card || '')) e.push(`card must be ${profile().jira.projectKey}-<n>, got ${s.card}`);
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
    else for (const [k, v] of Object.entries(s.files.extra)) if (!isStr(v)) e.push(`files.extra.${k} must be a path`);
    for (const k of Object.keys(s.files)) if (![...SINGLE_KINDS, ...LIST_KINDS, 'extra'].includes(k)) e.push(`files.${k} is not a known kind (use files.extra)`);
  }
  for (const k of ['decisions', 'open', 'approvals', 'history']) if (!isArr(s[k])) e.push(`${k} must be a list`);
  if (isArr(s.decisions)) s.decisions.forEach((d, i) => { if (!isStr(d?.text) || !d.text || !isStr(d?.source) || !d.source) e.push(`decisions[${i}] needs text and source`); });
  if (isArr(s.approvals)) s.approvals.forEach((a, i) => {
    if (!APPROVAL_KINDS.includes(a?.kind)) e.push(`approvals[${i}].kind "${a?.kind}" not one of ${APPROVAL_KINDS.join(', ')}`);
    if (!['chat', 'board', 'policy'].includes(a?.source)) e.push(`approvals[${i}].source must be chat, board or policy`);
    if (a?.source === 'policy' && (a.kind !== 'run-tests' || !String(a.evidence).startsWith('RUN-POLICY: auto'))) e.push(`approvals[${i}]: a policy approval is only for run-tests, with the RUN-POLICY: auto line as evidence`);
    if (!isStr(a?.evidence) || !a.evidence.trim()) e.push(`approvals[${i}] has no evidence`);
    else if (a.source === 'board' && !a.evidence.includes('ANSWER:')) e.push(`approvals[${i}]: a board approval needs the ANSWER: line from team.mjs wait as evidence`);
  });
  if (!isObj(s.gates)) e.push('gates must be an object');
  else for (const [k, g] of Object.entries(s.gates)) if (!isObj(g) || !['pass', 'fail'].includes(g.result)) e.push(`gates.${k} must be { result: pass|fail }`);
  if (isArr(s.open)) s.open.forEach((q, i) => { if (!isStr(q?.text) || !isStr(q?.since) || !isStr(q?.id)) e.push(`open[${i}] needs id, text and since`); });
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
  const h = [...(s.history || []), { at: s.updated, by: 'lead', change }];
  s.history = h.length > HISTORY_MAX ? [h[0], ...h.slice(-(HISTORY_MAX - 1))] : h; // the first entry (init) is kept
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
/** realpath that also works for a path that does not exist yet: resolve the nearest existing parent */
function real(p) {
  let cur = path.resolve(p), rest = [];
  while (true) {
    try { return path.join(fs.realpathSync(cur), ...rest); } catch { /* not there yet */ }
    const up = path.dirname(cur);
    if (up === cur) return path.resolve(p);
    rest.unshift(path.basename(cur)); cur = up;
  }
}
/** p inside dir, after following symlinks of both (a link out of the folder does not count as inside) */
function within(dir, p) {
  const r = path.relative(real(dir), real(p));
  return !!r && r !== '..' && !r.startsWith('..' + path.sep) && !path.isAbsolute(r);
}
export function resolveFile(key, p, { root = ROOT, pwRepo } = {}) {
  const stored = String(p).trim().replace(/\\/g, '/');
  if (stored.startsWith('pw:')) {
    const rel = stored.slice(3);
    if (!pwRepo || !fs.existsSync(pwRepo) && !path.isAbsolute(pwRepo)) return { abs: '', allowed: false, stored, why: `PW_REPO not found (node tools/setup.mjs <folder of ${profile().repos.pwRepoDir}>)` };
    const abs = path.resolve(pwRepo, rel);
    const ok = !path.isAbsolute(rel) && within(pwRepo, abs);
    return { abs, allowed: ok, stored, why: ok ? '' : 'outside the Playwright repo' };
  }
  const abs = path.resolve(root, stored);
  const ok = !path.isAbsolute(stored) && (within(path.join(root, '.claude', 'team', 'work', key), abs) || within(path.join(root, 'work', key), abs));
  return { abs, allowed: ok, stored, why: ok ? '' : "outside this card's folders" };
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
