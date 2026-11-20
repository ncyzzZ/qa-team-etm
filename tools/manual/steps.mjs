// steps.mjs - the manual steps file (work/<KEY>/manual-steps-*.md) the manual runner works from.
// Shape (spec docs/superpowers/specs/2026-11-20-manual-runner-design.md, section 2):
//   ## ETM-<n> - <title> (<N> steps)
//   role: jobOwner            (optional, default turnaroundManager)
//   writes data: yes          (optional)
//   needs: excel              (optional, the agent skips the Test)
//   start: <URL path or .env key> (optional)
//   | # | Do | Expected | Picture |    (first table under the heading, one row per Xray step)

export const ROLES = ['turnaroundManager', 'jobOwner'];
const HEAD = /^##\s+(ETM-\d+)\s+-\s+(.*?)\s*\((\d+)\s+steps?\)\s*$/i;
const TABLE_HEAD = /^\|\s*#\s*\|\s*Do\s*\|\s*Expected\s*\|\s*Picture\s*\|\s*$/i;

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

/**
 * @typedef {{ n: number, do: string, expected: string, picture: string }} ManualStep
 * @typedef {{ key: string, title: string, role: string, writesData: boolean, needs: string[], start: string|null, declared: number, hasTable: boolean, steps: ManualStep[] }} ManualTest
 * `role` is the raw value of the file (checkManual flags one that is not in ROLES).
 * @param {string} md
 * @returns {ManualTest[]}
 */
export function parseManualSteps(md) {
  const tests = [];
  let cur = null, state = 'none'; // none | options | table | done
  for (const line of md.replace(/\r\n/g, '\n').split('\n')) {
    const h = line.match(HEAD);
    if (h) {
      cur = { key: h[1].toUpperCase(), title: h[2], role: 'turnaroundManager', writesData: false, needs: [], start: null, declared: Number(h[3]), hasTable: false, steps: [] };
      tests.push(cur); state = 'options'; continue;
    }
    if (/^#{1,2}\s/.test(line)) { cur = null; state = 'none'; continue; }
    if (!cur || state === 'done') continue;
    if (state === 'options') {
      const o = line.match(/^\s*(role|writes data|needs|start)\s*:\s*(.*?)\s*$/i);
      if (o) {
        const k = o[1].toLowerCase(), v = o[2];
        if (k === 'role') cur.role = v;
        else if (k === 'writes data') cur.writesData = /^yes$/i.test(v);
        else if (k === 'needs') cur.needs = v.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
        else cur.start = v || null;
        continue;
      }
      if (TABLE_HEAD.test(line)) { cur.hasTable = true; state = 'table'; }
      continue;
    }
    // state === 'table'
    if (!line.trim().startsWith('|')) { if (cur.steps.length || line.trim()) state = 'done'; continue; }
    const c = cells(line);
    if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue; // separator
    const n = Number(c[0]);
    cur.steps.push({ n: Number.isFinite(n) && c[0] !== '' ? n : cur.steps.length + 1, do: c[1] ?? '', expected: c[2] ?? '', picture: c[3] ?? '' });
  }
  return tests;
}

/** Xray step count per Test from .claude/team/work/<KEY>/tests.md (`## ETM-<n> (TC-xxx)` then `1. Action -> Expected`). */
export function xrayStepCounts(md) {
  const out = {};
  let key = null;
  for (const line of md.replace(/\r\n/g, '\n').split('\n')) {
    const h = line.match(/^##\s+(ETM-\d+)\b/);
    if (h) { key = h[1]; out[key] = 0; continue; }
    if (/^#{1,2}\s/.test(line)) { key = null; continue; }
    if (key && /^\s*\d+\.\s+\S/.test(line)) out[key]++;
  }
  return out;
}

/**
 * Shape errors of the parsed steps files.
 * @param {ManualTest[]} tests
 * @param {Record<string, number>} xraySteps Xray step count per Test key (a Test that is not there is not compared)
 * @returns {string[]}
 */
export function checkManual(tests, xraySteps = {}) {
  const errors = [];
  for (const t of tests) {
    if (!ROLES.includes(t.role)) errors.push(`${t.key}: unknown role "${t.role}" (use ${ROLES.join(' or ')})`);
    if (!t.hasTable) { errors.push(`${t.key}: no step table with the header | # | Do | Expected | Picture |`); continue; }
    if (t.declared !== t.steps.length) errors.push(`${t.key}: heading says ${t.declared} vs ${t.steps.length} rows in the table`);
    const x = xraySteps[t.key];
    if (x != null && x !== t.steps.length) errors.push(`${t.key}: Xray has ${x} step(s), the table has ${t.steps.length}`);
    t.steps.forEach((s, i) => {
      if (s.n !== i + 1) errors.push(`${t.key}: row ${i + 1} is numbered ${s.n} (rows must be 1, 2, 3 ... in Xray order)`);
      if (!s.do) errors.push(`${t.key} step ${s.n}: empty Do`);
      if (!s.expected) errors.push(`${t.key} step ${s.n}: empty Expected`);
    });
  }
  return errors;
}
