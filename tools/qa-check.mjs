#!/usr/bin/env node
// qa-check.mjs - cheap, token-free checks of what the QA agents produce. Zero dependencies.
//
//   node tools/qa-check.mjs draft    <KEY | path/to/draft-tc.md> [--json]
//   node tools/qa-check.mjs spec     <spec.ts ...> [--tests <tests.md>] [--live]   (--live: G6-live also on committed specs)
//   node tools/qa-check.mjs work     <KEY> <analyst|inspector|designer|reviewer|automator>
//   node tools/qa-check.mjs manifest <tc-manifest.json>
//   node tools/qa-check.mjs diff     <KEY> <readback.json>     (Xray readback vs draft: [{key, summary, steps}])
//   node tools/qa-check.mjs findings <KEY | folder>            (work/<KEY>/findings.json vs questions-for-BA*.md)
//   node tools/qa-check.mjs strength <KEY>                     (work/<KEY>/ac-strength.json: AC -> script strength, Phase 5)
//   node tools/qa-check.mjs coverage <KEY>                     (AC -> cases table from analyst.md and the Trace: lines)
//   node tools/qa-check.mjs manual   <KEY> [--root <dir>]          (work/<KEY>/manual-steps-*.md: shape and step count vs Xray, manual runner)
//   node tools/qa-check.mjs selftest                             (run the checker against evals/ fixtures)
//   node tools/qa-check.mjs stats                                (how often each gate failed, from .claude/team/metrics.jsonl)
//
// Exit code 1 when there is at least one ERR. WARN lines are advice. Run it before handing anything to the user.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { load as loadState, resolveFile, SINGLE_KINDS, LIST_KINDS } from './state/core.mjs';
import { resolveRepos } from './heal/config.mjs';
import { parseManualSteps, checkManual, xrayStepCounts } from './manual/steps.mjs';
import { scanSpec, rowsFor, judge } from './live-check.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = (key) => path.join(ROOT, '.claude', 'team', 'work', key);
const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(n);
const arg = (n) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : '');
const pos = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--tests', '--analyst', '--root', '--runs'].includes(rest[i - 1])));

const out = [];
const err = (m) => out.push(['ERR ', m]);
const warn = (m) => out.push(['WARN', m]);
const read = (p) => { try { return fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'); } catch { return null; } };
function finish(title, extra = '') {
  const e = out.filter((x) => x[0] === 'ERR ').length, w = out.length - e;
  console.log(`[qa-check ${title}] ${e} error(s), ${w} warning(s)${extra}`);
  const seen = new Map();
  for (const [lvl, m] of out) { const k = lvl + m; seen.set(k, { lvl, m, n: (seen.get(k)?.n || 0) + 1 }); }
  for (const { lvl, m, n } of seen.values()) console.log(`  ${lvl} ${m}${n > 1 ? `  (x${n})` : ''}`);
  if (!process.env.QA_CHECK_NO_METRICS) {
    try {
      const first = out.find((x) => x[0] === 'ERR ');
      fs.appendFileSync(path.join(ROOT, '.claude', 'team', 'metrics.jsonl'), JSON.stringify({ t: new Date().toISOString(), cmd: title, arg: pos[0] || '', errors: e, warnings: w, first: first ? first[1].slice(0, 120) : '' }) + '\n');
    } catch { /* metrics are optional */ }
  }
  process.exit(e ? 1 : 0);
}

// ---------------------------------------------------------------- draft
const BAD_REF = /(refer to figma|same as (the )?design|see (the )?(ui|figma)|same as tc-\d+|as above|see tc-\d+)/i;
const JARGON = [[/\bis rendered\b/i, 'shows / appears'], [/\bis (invoked|triggered)\b/i, 'happens / starts'], [/\bis (persisted|retained|propagated)\b/i, 'stays the same'], [/\bnavigate to\b/i, 'open'], [/\bvalidate\b/i, 'check']];
const EMPTY_EXP = /^(-|--|n\/a|na|tbd|todo|\.\.\.|…|none)\.?$/i;

export function parseDraft(text) {
  const lines = text.split('\n');
  const cases = [];
  let cur = null, step = null;
  lines.forEach((line, i) => {
    const h = line.match(/^###\s+(TC-\d+)\s+(.*)$/);
    if (h) {
      cur = { id: h[1], heading: h[2], line: i + 1, pre: [], steps: [], other: [] };
      cases.push(cur); step = null; return;
    }
    if (/^#{1,2}\s/.test(line)) { cur = null; step = null; return; }
    if (!cur) return;
    const s = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (s) { step = { n: Number(s[1]), text: s[2], line: i + 1 }; cur.steps.push(step); return; }
    if (/^\s+\S/.test(line) && step) { step.text += ' ' + line.trim(); return; }
    if (line.trim()) {
      cur.other.push(line.trim());
      if (/^precondition/i.test(line.trim())) cur.pre.push(line.trim());
      const tr = line.trim().match(/^\**trace\**:\s*(.*)$/i);
      if (tr) cur.trace = [...tr[1].matchAll(/\bAC-\d+(?:\.\d+)*\b/gi)].map((m) => m[0].toUpperCase());
      step = null;
    }
  });
  return cases;
}

// AC items of analyst.md: [{id, neg, text}] (only the "## AC items" section)
export function parseAc(an) {
  const sec = (an.match(/^##\s+AC items[^\n]*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/im) || [])[1] || '';
  const seen = new Map();
  for (const m of sec.matchAll(/^\s*(?:[-*]\s*)?\**(AC-\d+(?:\.\d+)*)\b\**[:.)]?\s*(.*)$/gim)) {
    const id = m[1].toUpperCase();
    if (!seen.has(id)) seen.set(id, { id, neg: /\[NEG\]/i.test(m[2]), text: m[2].replace(/\[NEG\]/gi, '').trim() });
  }
  // a parent listed together with its own sub-items is not a rule of its own
  return [...seen.values()].filter((a) => ![...seen.keys()].some((k) => k.startsWith(a.id + '.')));
}

const isNegCase = (c) => /\((?:[^)]*[/\s])?(NEG|BND)\b/i.test(c.heading);
function acCoverage(ac, cases) {
  return ac.map((a) => {
    const hit = cases.filter((c) => (c.trace || []).some((t) => t === a.id || t.startsWith(a.id + '.')));
    return { ...a, cases: hit.map((c) => c.id), negCases: hit.filter(isNegCase).map((c) => c.id) };
  });
}

// leaf items of the "Acceptance Criteria" section of story.md (1., 1.1, 2. ...), to spot AC the analyst missed
function storyLeafCount(story) {
  const sec = (story.match(/^#{1,3}\s*Acceptance Criteria[^\n]*\n([\s\S]*?)(?=^#{1,3}\s|$(?![\s\S]))/im) || [])[1];
  if (!sec) return 0;
  const nums = [...sec.matchAll(/^\s*(\d+(?:\.\d+)*)[.)]?\s+\S/gm)].map((m) => m[1]);
  return nums.filter((n) => !nums.some((o) => o.startsWith(n + '.'))).length;
}

function checkDraft() {
  const arg0 = pos[0];
  if (!arg0) { console.error('Usage: qa-check draft <KEY | path>'); process.exit(2); }
  const file = /^ETM-\d+$/.test(arg0) ? path.join(WORK(arg0), 'draft-tc.md') : path.resolve(arg0);
  const text = read(file);
  if (text == null) { err(`file not found: ${file}`); return finish('draft'); }
  const cases = parseDraft(text);
  if (!/^##\s+Test cases/im.test(text)) err('missing the "## Test cases" heading');
  if (!cases.length) { err('no "### TC-001 ..." case headings found'); return finish('draft'); }
  const declared = (text.match(/^##\s+Test cases[^\n]*?\((\d+)\s/im) || [])[1];
  if (declared && Number(declared) !== cases.length) warn(`heading says ${declared} cases but ${cases.length} were found`);
  if (!/coverage/i.test(text)) warn('no coverage map found (the designer must list every AC item and screen state)');
  if (!/\b(high|medium|low)\b/i.test(text)) warn('no High / Medium / Low priority counts found');
  // traceability: every AC-n of analyst.md must be in the Trace: line of a case (the coverage map alone does not count)
  const keyOf = (/^ETM-\d+$/.test(arg0) ? arg0 : (file.match(/ETM-\d+/) || [])[0]) || '';
  const anFile = arg('--analyst') || (keyOf ? path.join(WORK(keyOf), 'analyst.md') : '');
  const an = anFile ? read(path.resolve(anFile)) : null;
  for (const c of cases) if (!c.trace) err(`${c.id} (line ${c.line}): no "Trace: AC-1, AC-2" line (or "Trace: none (<what it covers>)")`);
  if (an) {
    const ac = parseAc(an);
    if (!ac.length) warn('analyst.md lists no AC-1, AC-2 ... ids, so AC coverage could not be checked');
    const known = new Set(ac.map((a) => a.id));
    for (const r of acCoverage(ac, cases)) {
      if (!r.cases.length) err(`${r.id} is listed in analyst.md but no case has it in its Trace: line`);
      else if (r.neg && !r.negCases.length) err(`${r.id} is marked [NEG] but no (NEG) or (BND) case traces to it (cases: ${r.cases.join(', ')})`);
    }
    for (const c of cases) for (const t of c.trace || []) if (ac.length && !known.has(t) && ![...known].some((k) => k.startsWith(t + '.') || t.startsWith(k + '.'))) warn(`${c.id}: Trace ${t} is not an AC id in analyst.md`);
  }
  const ids = new Set();
  cases.forEach((c, idx) => {
    const at = `${c.id} (line ${c.line})`;
    if (ids.has(c.id)) err(`${at}: duplicate case id`); ids.add(c.id);
    if (Number(c.id.slice(3)) !== idx + 1) warn(`${at}: case numbering is not 001, 002, ... in order`);
    if (!/\((?:[^)]*[/\s])?(POS|NEG|BND|Exotic|Technical|Security)/i.test(c.heading)) err(`${at}: heading has no type label: (POS) (NEG) (BND) (Exotic: <kind>) (Technical + Security)`);
    if (!c.other.some((l) => /^priority:/i.test(l)) && !c.pre.some((l) => /priority:/i.test(l))) warn(`${at}: no "Priority: High|Medium|Low" line`);
    if (!/\[(Auto(mate)?|Partial|Manual)/i.test(c.heading)) err(`${at}: heading has no automation tag [Auto] / [Partial: why] / [Manual: why]`);
    if (/\[(Partial|Manual)\s*\]/i.test(c.heading)) warn(`${at}: [Partial] / [Manual] needs a reason, e.g. [Manual: needs a person to judge]`);
    if (!c.pre.length) warn(`${at}: no "Precondition:" line`);
    if (!c.steps.length) err(`${at}: no numbered steps`);
    c.steps.forEach((s, i) => {
      const where = `${c.id} step ${s.n} (line ${s.line})`;
      if (s.n !== i + 1) warn(`${where}: step numbers are not 1, 2, 3 ... in order`);
      const k = s.text.indexOf('->');
      if (k < 0) { err(`${where}: no "->" Expected Result`); return; }
      const action = s.text.slice(0, k).trim(), exp = s.text.slice(k + 2).trim();
      if (!action) err(`${where}: empty action`);
      if (!exp || EMPTY_EXP.test(exp)) err(`${where}: Expected Result is empty or "${exp || '-'}" (write the real outcome)`);
      if (/(,|;| and)\s+then\b|;\s|\bthen\b.*\bthen\b/i.test(action)) warn(`${where}: looks like more than one action in one step`);
    });
    const body = [c.heading, ...c.other, ...c.steps.map((s) => s.text)].join('\n');
    const bad = body.match(BAD_REF);
    if (bad) err(`${at}: "${bad[0]}" - write the real text or outcome, and every case must stand alone`);
    for (const [re, use] of JARGON) { const m = body.match(re); if (m) warn(`${at}: "${m[0]}" - use plain words: ${use}`); }
    if (/\bAC\s*\d+(\.\d+)+/.test([c.heading, ...c.pre].join('\n'))) warn(`${at}: Jira AC number in heading/precondition (not allowed in Description)`);
  });
  const nAuto = cases.filter((c) => /\[Auto/i.test(c.heading)).length;
  const extra = ` | ${cases.length} cases, ${nAuto} Auto, ${cases.length - nAuto} Partial/Manual`;
  if (flag('--json')) console.log(JSON.stringify(cases.map((c) => ({ id: c.id, heading: c.heading, steps: c.steps.length })), null, 1));
  finish('draft', extra);
}

// ---------------------------------------------------------------- spec
// No false pass (rules file, "No false pass"): code shapes that let a test turn green without checking.
// A line can opt out with a trailing `// qa-check: ok <why>` when a person has looked at it.
const MARKS_UNCHECKED = /notChecked|annotations\.push|\bnote\(|\.skip\(|\.fixme\(|NOT_CHECKED|manual\(|skipNoSeed|notScripted|tooltipPending/;
function falsePass(name, text) {
  const lines = text.split('\n');
  const ok = (l) => /\/\/\s*qa-check:\s*ok\b/.test(l);
  const at = (i) => `${name}:${i + 1}`;
  lines.forEach((raw, i) => {
    if (ok(raw) || /^\s*(\/\/|\*)/.test(raw)) return;
    const l = raw.replace(/\s\/\/\s.*$/, ''); // ignore a trailing comment
    // 1. an action whose failure is swallowed, then an expect relies on it (visible check first is fine)
    if (/\.(click|fill|press|check|selectOption|hover|dblclick|type)\([^;]*\)\s*\.catch\(\s*\(\)\s*=>/.test(l)) {
      const next = lines.slice(i + 1, i + 3).join('\n'), prev = lines.slice(Math.max(0, i - 2), i).join('\n');
      // only a false pass when the expect checks an absence (a failed action also gives "nothing there")
      if (/\bexpect\([^;]*(toHaveCount\(0\)|toBeHidden|\.not\.|toBeFalsy|toBe\(false\)|toEqual\(\[\]\))/.test(next) && !/toBeVisible|toBeAttached|toHaveCount\(1\)/.test(prev)) err(`${at(i)}: action failure is swallowed by .catch() and the next expect checks an absence, so a wrong locator passes (assert the element is visible first, or remove .catch)`);
    }
    // 2. every() inside an expect: an empty list passes (advice only, an empty list can be the right answer)
    if (/\bexpect\([^;]*\.every\(/.test(l) && !/toBeGreaterThan\(0\)|toHaveLength|toEqual\(/.test(lines.slice(Math.max(0, i - 3), i).join('\n'))) warn(`${at(i)}: .every() inside expect passes on an empty list: assert the length first, or use everyOf() from @fixtures/pageFixtures (fine when an empty list is a correct answer)`);
    // 3. a conditional expect with no else branch
    if (/^\s*if\s*\(.*\)\s*(await\s+)?expect(\.soft)?\(/.test(l) && !/\bfor\s*\(/.test(l) && !/^\s*else\b/.test(lines[i + 1] || '') && !MARKS_UNCHECKED.test(l)) {
      err(`${at(i)}: "if (...) expect" with no else: when the condition is false nothing is checked (add "else notChecked('<why>')")`);
    }
    // 4. early return out of a step without marking it unchecked
    if (/\bif\s*\(\s*!.*\)\s*\{?\s*return\b/.test(l) && !MARKS_UNCHECKED.test(l)) {
      const before = lines.slice(Math.max(0, i - 12), i).join('\n');
      if (!MARKS_UNCHECKED.test(before)) err(`${at(i)}: early return without notChecked(): the step ends green without checking (call notChecked('<why>') first)`);
    }
  });
}

// A test body that saves, deletes, imports or changes state on QA (UI button names or DB writes). A heuristic: helpers can hide
// a write, so the automator still tags by what the test does (agents/automation-engineer.md step 4c).
const WRITE_RE = /(?:name:\s*(?:['"`]|\/\^?)|getByText\(\s*['"`])(?:[Ss]ave|[Dd]elete|[Rr]emove|[Ii]mport|[Ss]ubmit|[Uu]pdate [Pp]rogress|[Cc]onfirm|[Ff]reeze|[Uu]nfreeze|[Aa]ctivate|[Ss]et [Aa]ctive|[Ee]xtension)\b[^;\n]{0,40}?\)\s*\.(?:first\(\)\.|last\(\)\.)?(?:click|dblclick)\(|\bqueryDb\([^)]*\b(?:INSERT|UPDATE|DELETE)\b|\bawait\s+(?:\w+\.)?(?:save|delete|remove|create|import|activate|freeze|unfreeze|submit)(?!\w*(?:Screenshot|Picture|Evidence|Shot))[A-Z]\w*\(/;
/** Card keys a spec belongs to: every ETM key named in the spec or in the local files it imports (helpers call cardId('ETM-n')). */
function cardsOf(specFile, text) {
  const keys = new Set(text.match(/ETM-\d+/g) || []);
  for (const m of text.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const base = path.resolve(path.dirname(path.resolve(specFile)), m[1]);
    for (const f of [base, base + '.ts']) { const t = read(f); if (t != null) { (t.match(/ETM-\d+/g) || []).forEach((k) => keys.add(k)); break; } }
  }
  return [...keys];
}
/** True when one of the cards has <repo>/scripts/seed/cards/<card>.data.cjs, the repo found by walking up from the spec file. */
function cardDataFor(specFile, cards) {
  let d = path.dirname(path.resolve(specFile));
  for (let i = 0; i < 8; i++) {
    const dir = path.join(d, 'scripts', 'seed', 'cards');
    if (fs.existsSync(dir)) return cards.some((c) => fs.existsSync(path.join(dir, `${c}.data.cjs`)));
    const up = path.dirname(d); if (up === d) break; d = up;
  }
  return true; // repo not found (fixture outside PW_REPO): do not block
}

/** True when the spec is new or changed in its git repo (being written or fixed now). Not a repo / git missing: true. */
function specInProgress(f) {
  const r = spawnSync('git', ['status', '--porcelain', '--', path.basename(f)], { cwd: path.dirname(path.resolve(f)), encoding: 'utf8' });
  if (r.status !== 0) return true;
  return r.stdout.trim().length > 0;
}
// Gate G6-live (automator step 1b, tools/live-check.mjs): a filter / search / delete / paste / drag step needs a row in
// work/<KEY>/live-check.md saying where the page fact came from. Enforced on specs being written or fixed (git: new or changed);
// committed, untouched specs only get one summary warning, so old cards are not blocked.
function liveCheck(f, name, text) {
  const tests = scanSpec(text).filter((t) => t.kinds.length && !t.skipped && t.key);
  if (!tests.length) return;
  const rows = rowsFor(cardsOf(f, text));
  const force = flag('--live') || process.env.QA_CHECK_LIVE === '1';
  if (!force && !specInProgress(f)) {
    const open = tests.filter((t) => judge(t, rows).some((p) => p.lvl === 'ERR')).length;
    if (open) warn(`${name}: ${open} test(s) with filter/search/delete/paste/drag steps have no live-check.md rows (enforced once the spec is changed; --live to check now)`);
    return;
  }
  for (const t of tests) for (const p of judge(t, rows)) (p.lvl === 'ERR' ? err : warn)(`${name}: ${p.msg}`);
}

function checkSpec() {
  const files = pos;
  if (!files.length) { console.error('Usage: qa-check spec <spec.ts ...> [--tests tests.md]'); process.exit(2); }
  const testsMd = arg('--tests') ? read(path.resolve(arg('--tests'))) : null;
  let nTests = 0;
  for (const f of files) {
    const text = read(path.resolve(f));
    if (text == null) { err(`file not found: ${f}`); continue; }
    const name = path.basename(f);
    const re = /\btest(?:\.(?:only|skip|fixme))?\(\s*(['"`])([^'"`]+)\1/g;
    const marks = [...text.matchAll(re)].map((m) => ({ title: m[2], at: m.index, whole: m[0] }));
    let ownedCache;
    const describeTags = [...text.matchAll(/test\.describe(?:\.\w+)?\(\s*(['"`])((?:(?!\1).)*)\1/g)].map((m) => m[2]).join(' ').match(/@[\w-]+/g)?.join(' ') ?? '';
    if (!marks.length) warn(`${name}: no test() found`);
    marks.forEach((t, i) => {
      nTests++;
      const body = text.slice(t.at, i + 1 < marks.length ? marks[i + 1].at : text.length);
      // Security tests (rules file): title `[ETM-1234][Security] ...`, no Xray Test, so the key comes from the bracket
      const secKey = (t.title.match(/^\[(ETM-\d+)\]\[Security\]/) || [])[1];
      const skipped = /^test\.(skip|fixme)\(/.test(t.whole);
      const key = (t.title.match(/^(ETM-\d+)\b/) || [])[1] || secKey;
      if (!key) err(`${name}: test "${t.title.slice(0, 50)}" - title must start with the Xray key (ETM-1234 - ...)`);
      else if (testsMd && !secKey && !testsMd.includes(key)) warn(`${name}: ${key} is not in the card's tests file`);
      // A step is a direct test.step(...) or a call of the shared steps() helper (`const S = steps(page, KEY)`, then `await S('...', ...)`):
      // the helper runs one test.step and takes one evidence picture per call, so each call counts as a step and a picture.
      const helperNames = [...body.matchAll(/\b(?:const|let)\s+(\w+)\s*=\s*steps\(/g)].map((m) => m[1]);
      const helperCalls = helperNames.reduce((n, h) => n + (body.match(new RegExp('\\bawait\\s+' + h + '\\(', 'g')) || []).length, 0);
      const steps = (body.match(/\btest\.step\(/g) || []).length + helperCalls;
      const ev = (body.match(/\bevidence\(/g) || []).length + helperCalls;
      if (!steps && skipped) warn(`${name}: ${key || t.title.slice(0, 30)} is skipped (no test.step needed until it is enabled)`);
      else if (!steps) err(`${name}: ${key || t.title.slice(0, 30)} has no test.step (one test.step per Xray step)`);
      else if (ev < steps) warn(`${name}: ${key || t.title.slice(0, 30)} has ${steps} steps but ${ev} evidence() calls (a picture per step)`);
      if (/\.only\(/.test(t.whole)) err(`${name}: ${key || ''} test.only left in`);
      // Run tags (standing run approval, tools/run-policy.mjs) and card-owned data (TEAM.md "Card data made by script")
      const tags = `${t.title} ${describeTags}`;
      const writes = body.match(WRITE_RE);
      if (/@readonly/i.test(tags) && writes) err(`${name}: ${key || ''} is tagged @readonly but looks like it writes data ("${writes[0].slice(0, 40)}"): remove the tag`);
      if (writes && !/@shared-data/i.test(tags) && key && !(ownedCache ??= cardDataFor(f, cardsOf(f, text)))) err(`${name}: ${key} writes data ("${writes[0].slice(0, 40)}") but the card has no scripts/seed/cards/<KEY>.data.cjs and the test is not tagged @shared-data: give the card its own data (create: true), or tag @shared-data with the reason`);
    });
    const hits = (re2, m, lvl = err) => { const n = (text.match(re2) || []).length; if (n) lvl(`${name}: ${m} (${n}x)`); };
    hits(/\bwaitForTimeout\(/g, 'waitForTimeout is not allowed, wait for a condition instead');
    hits(/\bpage\.pause\(/g, 'page.pause() left in');
    hits(/\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*(['"`])(?!\$\{)[^'"`\s]{4,}\2/gi, 'looks like a hard-coded credential (use .env)');
    hits(/data-testid/g, 'the ETM app has no data-testid: use data-id, data-column, roles, text', warn);
    falsePass(name, text);
    liveCheck(f, name, text);
    const nExpect = (text.match(/\bexpect(?:\.soft)?\(/g) || []).length;
    const nMsg = (text.match(/\bexpect(?:\.soft)?\([^()]*(?:\([^()]*\)[^()]*)*,\s*(['"`])/g) || []).length;
    if (nExpect && nMsg < nExpect / 2) warn(`${name}: only ${nMsg} of ${nExpect} expect() have a plain-language message (the report shows it to non-testers)`);
  }
  finish('spec', ` | ${nTests} test(s) in ${files.length} file(s)`);
}

// ---------------------------------------------------------------- work files
const CONTRACT = {
  analyst: { file: 'analyst.md', heads: [/^##\s+AC items/im, /^##\s+Could still break/im, /^##\s+Open questions/im, /^##\s+\[QA\] subtasks/im] },
  inspector: { file: 'inspector.md', heads: [/^##\s+Screens and states/im, /^##\s+Design vs AC/im, /^##\s+Open questions/im] },
  reviewer: { file: 'review.md', first: /^Verdict:\s*(Approve|Conditional Approve|Reject)\b/i, heads: [/^##\s+Findings/im] },
  automator: { file: 'automation-table.md', heads: [/\|\s*Test\b[^|]*\|[^|]*Playwright/i, /^##\s+Security/im] },
};
function checkWork() {
  const [key, role] = pos;
  if (!/^ETM-\d+$/.test(key || '') || !role) { console.error('Usage: qa-check work <KEY> <analyst|inspector|designer|reviewer|automator>'); process.exit(2); }
  if (role === 'designer') return checkDraft();
  const c = CONTRACT[role];
  if (!c) { console.error(`unknown role ${role}`); process.exit(2); }
  const f = path.join(WORK(key), c.file), text = read(f);
  if (text == null) { err(`missing ${path.relative(ROOT, f)}`); return finish(`work ${role}`); }
  if (text.trim().length < 80) err(`${c.file} is almost empty`);
  if (c.first && !c.first.test(text.split('\n').find((l) => l.trim()) || '')) err(`${c.file}: first line must be "Verdict: Approve | Conditional Approve | Reject"`);
  for (const h of c.heads) if (!h.test(text)) err(`${c.file}: missing required section ${String(h).replace(/^\/\^?|\/[a-z]*$/g, '').replace(/\\s\+/g, ' ')}`);
  if (role === 'analyst' && !/\bAC-\d+\b/.test(text)) err(`${c.file}: number the AC items AC-1, AC-2 ... so the draft can be checked against them`);
  if (role === 'analyst') {
    const ac = parseAc(text), story = read(path.join(WORK(key), 'story.md'));
    const leaves = story ? storyLeafCount(story) : 0;
    if (leaves && ac.length < leaves) warn(`${c.file}: the Story's Acceptance Criteria has ${leaves} numbered items but only ${ac.length} AC ids are listed: check none was missed or merged`);
    const long = ac.filter((a) => (a.text.match(/\b(and|also|then)\b|;/gi) || []).length >= 2);
    if (long.length) warn(`${c.file}: ${long.map((a) => a.id).join(', ')} may hold more than one rule: split into AC-n.1, AC-n.2`);
  }
  if (/(refer to figma|same as design)/i.test(text)) warn(`${c.file}: "refer to Figma" style text, write the real value`);
  finish(`work ${role}`);
}

// ---------------------------------------------------------------- manifest
function checkManifest() {
  const f = pos[0], raw = f && read(path.resolve(f));
  if (raw == null) { err(`file not found: ${f}`); return finish('manifest'); }
  let j; try { j = JSON.parse(raw); } catch (e) { err(`not valid JSON: ${e.message}`); return finish('manifest'); }
  if (!j.stories || typeof j.stories !== 'object') { err('missing "stories" object'); return finish('manifest'); }
  let n = 0, noSteps = 0;
  for (const [story, list] of Object.entries(j.stories)) {
    if (!/^ETM-\d+$/.test(story)) warn(`story key "${story}" is not ETM-nnnn`);
    if (!Array.isArray(list)) { err(`${story}: must be an array of Tests`); continue; }
    for (const t of list) {
      n++;
      if (!/^ETM-\d+$/.test(t.key || '')) err(`${story}: a Test has no valid key`);
      if (!t.summary) warn(`${t.key}: no summary`);
      if (typeof t.automated !== 'boolean') err(`${t.key}: "automated" must be true or false`);
      if (t.automated === false && !t.reason) warn(`${t.key}: manual Test without "reason"`);
      if (!Array.isArray(t.steps) || !t.steps.length) noSteps++;
      else t.steps.forEach((s, i) => { if (!s.action) err(`${t.key} step ${i + 1}: no action`); if (!s.result) warn(`${t.key} step ${i + 1}: no result`); });
    }
  }
  if (noSteps) warn(`${noSteps} Test(s) without steps: the report will show no Action / Expected Result for them`);
  finish('manifest', ` | ${n} Test(s)`);
}

// ---------------------------------------------------------------- Xray readback vs draft
function checkDiff() {
  const [key, rb] = pos;
  const draft = read(path.join(WORK(key || ''), 'draft-tc.md')), back = rb && read(path.resolve(rb));
  if (draft == null) { err(`no draft-tc.md for ${key}`); return finish('diff'); }
  if (back == null) { err(`file not found: ${rb}`); return finish('diff'); }
  let items; try { items = JSON.parse(back); } catch (e) { err(`readback is not JSON: ${e.message}`); return finish('diff'); }
  const cases = parseDraft(draft);
  const norm = (s) => String(s).toLowerCase().replace(/\[[^\]]*\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  if (items.length !== cases.length) err(`Xray has ${items.length} Test(s) but the draft has ${cases.length} cases`);
  for (const c of cases) {
    const title = norm(c.heading.replace(/\((POS|NEG)[^)]*\)|\[(Auto|Partial|Manual)[^\]]*\]/gi, ''));
    const it = items.find((x) => norm(x.summary).includes(title) || title.includes(norm(x.summary)));
    if (!it) { err(`${c.id}: no Xray Test with this summary ("${c.heading.slice(0, 60)}")`); continue; }
    if (Number(it.steps) !== c.steps.length) err(`${c.id} = ${it.key}: Xray has ${it.steps} step(s), draft has ${c.steps.length}`);
  }
  finish('diff', ` | ${items.length} Test(s) compared`);
}

// ---------------------------------------------------------------- findings.json (early findings raised while reading a card)
export const FINDING = {
  kind: ['gap', 'conflict', 'risk', 'question'],
  impact: ['high', 'medium', 'low'],
  outcome: ['open', 'ac-changed', 'dev-fixed', 'confirmed', 'no-issue', 'ignored'],
};
// question ids of every questions-for-BA*.md in a card folder:
// questions-for-BA.md -> "1", "2" ...; -round2.md -> "R2-1" ...; any other suffix (e.g. -remaining) -> "remaining-1" ...
// x.en.md is a translation of x.md and is skipped only when x.md exists.
// A question line starts at column 0: "1." "1)" "1:" "Q1" "**Q1**" "**1.**" "## Q1 ..." "## 1 ..." "Q1 - ..."; indented lines and "1.1" are sub-items.
const Q_LINE = /^(?:#{1,4}\s+)?(?:\*\*)?(?:Q(\d+)\b|(\d+)(?:\*\*)?(?:\.(?!\d)|\)|:|\s+[-–]\s))|^#{1,4}\s+(\d+)\s/gim;
export function questionIds(dir) {
  const names = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const ids = [];
  for (const name of names) {
    if (!/^questions-for-BA.*\.md$/i.test(name)) continue;
    if (/\.en\.md$/i.test(name) && names.includes(name.replace(/\.en\.md$/i, '.md'))) continue;
    const suffix = name.replace(/^questions-for-BA-?/i, '').replace(/(\.en)?\.md$/i, '');
    const round = (suffix.match(/^round(\d+)$/i) || [])[1];
    const prefix = round ? `R${round}-` : suffix ? `${suffix}-` : '';
    for (const m of (read(path.join(dir, name)) || '').matchAll(Q_LINE)) ids.push(prefix + (m[1] || m[2] || m[3]));
  }
  return [...new Set(ids)];
}

function checkFindings() {
  const a = pos[0];
  if (!a) { console.error('Usage: qa-check findings <KEY | folder>'); process.exit(2); }
  const dir = /^ETM-\d+$/.test(a) ? path.join(ROOT, 'work', a) : path.resolve(a);
  const raw = read(path.join(dir, 'findings.json'));
  if (raw == null) { err(`missing ${path.join(dir, 'findings.json')}`); return finish('findings'); }
  let list; try { list = JSON.parse(raw); } catch (e) { err(`findings.json is not valid JSON: ${e.message}`); return finish('findings'); }
  if (!Array.isArray(list)) { err('findings.json must be an array'); return finish('findings'); }
  const ids = new Set();
  for (const f of list) {
    const at = f.id || `entry for question ${f.q}`;
    if (!/^F-\d+$/.test(f.id || '')) err(`${at}: id must be F-1, F-2 ...`);
    else if (ids.has(f.id)) err(`${at}: duplicate id`);
    ids.add(f.id);
    for (const k of Object.keys(FINDING)) if (!FINDING[k].includes(f[k])) err(`${at}: ${k} "${f[k]}" is not one of ${FINDING[k].join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}/.test(f.raised || '')) err(`${at}: raised must be a date YYYY-MM-DD`);
    if (f.outcome && f.outcome !== 'open' && !f.outcome_date) err(`${at}: outcome "${f.outcome}" needs an outcome_date`);
    if (f.later_defect && !/^ETM-\d+$/.test(f.later_defect)) warn(`${at}: later_defect "${f.later_defect}" is not an ETM key`);
    if (!f.story_status) warn(`${at}: no story_status (needed to split "before dev" and "after dev started")`);
  }
  const qs = new Set();
  for (const q of questionIds(dir)) qs.add(q);
  const have = new Set(list.map((f) => String(f.q)));
  for (const q of qs) if (!have.has(q)) err(`question ${q} of questions-for-BA has no entry in findings.json`);
  finish('findings', ` | ${list.length} finding(s), ${qs.size} question(s)`);
}

// ---------------------------------------------------------------- coverage table (AC -> cases), for the lead and checkpoint 2
function coverage() {
  const key = pos[0];
  if (!key) { console.error('Usage: qa-check coverage <KEY | draft.md> [--analyst analyst.md]'); process.exit(2); }
  const dFile = /^ETM-\d+$/.test(key) ? path.join(WORK(key), 'draft-tc.md') : path.resolve(key);
  const aFile = arg('--analyst') || path.join(path.dirname(dFile), 'analyst.md');
  const d = read(dFile), a = read(path.resolve(aFile));
  if (d == null || a == null) { console.error(`missing ${d == null ? dFile : aFile}`); process.exit(2); }
  const cases = parseDraft(d), rows = acCoverage(parseAc(a), cases);
  console.log('| AC | Rule | Cases | NEG/BND |\n|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.id}${r.neg ? ' [NEG]' : ''} | ${r.text.slice(0, 70)} | ${r.cases.join(', ') || '**none**'} | ${r.neg ? (r.negCases.join(', ') || '**none**') : '-'} |`);
  const none = cases.filter((c) => c.trace && !c.trace.length).map((c) => c.id);
  const gaps = rows.filter((r) => !r.cases.length || (r.neg && !r.negCases.length)).length;
  console.log(`\n${rows.length} AC, ${rows.length - gaps} covered, ${gaps} gap(s). Cases with no AC (screen state / lesson): ${none.join(', ') || 'none'}`);
  process.exit(gaps ? 1 : 0);
}

// ---------------------------------------------------------------- selftest (evals/)
function selftest() {
  const dir = path.join(ROOT, 'evals'), cfg = read(path.join(dir, 'expected.json'));
  if (cfg == null) { console.error('evals/expected.json not found'); process.exit(2); }
  let bad = 0;
  for (const t of JSON.parse(cfg)) {
    const script = t.cmd === 'metrics' ? path.join(ROOT, 'tools', 'sprint-metrics.mjs')
      : t.cmd === 'heal-guard' ? path.join(ROOT, 'tools', 'heal', 'guard.mjs') : fileURLToPath(import.meta.url);
    const r = spawnSync(process.execPath, [script, ...t.args.map((a) => (a.startsWith('evals/') ? path.join(ROOT, a) : a))], { encoding: 'utf8', env: { ...process.env, QA_CHECK_NO_METRICS: '1' } });
    const m = (r.stdout || '').match(/\] (\d+) error\(s\)/), got = m ? Number(m[1]) : -1;
    const ok = got === t.errors && (!t.contains || (r.stdout || '').includes(t.contains));
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${t.name}  (expected ${t.errors} error(s), got ${got}${t.contains && !(r.stdout || '').includes(t.contains) ? `, missing text "${t.contains}"` : ''})`);
  }
  console.log(bad ? `[selftest] ${bad} fixture(s) failed: the checker changed behaviour` : '[selftest] all fixtures behave as expected');
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------- strength (work/<KEY>/ac-strength.json)
// Written by the test-reviewer in script-review mode (Phase 5, after G6): does each AC have a running test that asserts it?
// Shape: {"card":"ETM-1","date":"YYYY-MM-DD","verdict":"ready|partly|not-ready","ac":[{"id":"AC-1","rule":"...","tests":["ETM-2"],"rating":"strong|weak|blocked|none","why":"...",
//   "tier":"regression|card|manual" (optional, default card), "manualWhy":"..." (tier manual only)}]}
const RATINGS = ['strong', 'weak', 'blocked', 'none'];
const TIERS = ['regression', 'card', 'manual'];   // regression: core flow, every stms-fe build; card: this Story; manual: not E2E (manualWhy)
export const STRONG_TARGET = 100;   // team standard 2026-11-26: every non-manual AC strong
const MANUAL_WHY = /^(ui|job|email|user):\s*\S/;   // eye judgement, job run, email, the user's ruling
/** Spec titles that carry @high, per Xray key (PW_REPO tests/). */
function highTagged(pwRepo) {
  const out = new Map();
  const walk = (d) => { for (const e of fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }) : []) { const f = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(f); } else if (/\.spec\.ts$/.test(e.name)) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\btest(?:\.\w+)?\(\s*(['"`])((?:ETM-\d+)[^'"`]*)\1/g)) { const k = m[2].match(/^ETM-\d+/)[0]; out.set(k, (out.get(k) || false) || /@high\b/.test(m[2])); } } };
  walk(path.join(pwRepo, 'tests'));
  return out;
}
function checkStrength() {
  const key = pos[0];
  if (!key) { console.error('Usage: qa-check strength <KEY | path/to/ac-strength.json>'); process.exit(2); }
  const file = key.endsWith('.json') ? path.resolve(key) : path.join(ROOT, 'work', key, 'ac-strength.json');
  const raw = read(file);
  if (raw == null) { err(`not found: ${path.relative(ROOT, file)}`); return finish('strength'); }
  let j; try { j = JSON.parse(raw); } catch (e) { err(`not valid JSON: ${e.message}`); return finish('strength'); }
  if (!/^ETM-\d+$/.test(j.card || '')) err('card must be the Story key (ETM-1234)');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(j.date || '')) err('date must be YYYY-MM-DD');
  if (!['ready', 'partly', 'not-ready'].includes(j.verdict)) err('verdict must be ready, partly or not-ready');
  if (!Array.isArray(j.ac) || !j.ac.length) err('ac must list every AC item');
  const seen = new Set(), n = Object.fromEntries(RATINGS.map((r) => [r, 0]));
  for (const a of j.ac || []) {
    const id = a.id || '?';
    if (seen.has(id)) err(`${id}: listed twice`); seen.add(id);
    if (!RATINGS.includes(a.rating)) err(`${id}: rating must be one of ${RATINGS.join(', ')}`); else n[a.rating]++;
    if (!a.why || String(a.why).length < 5) err(`${id}: why is missing`);
    if (a.rating !== 'none' && !(a.tests || []).length) err(`${id}: a ${a.rating} rating needs the Xray test keys`);
    if (a.tier != null && !TIERS.includes(a.tier)) err(`${id}: tier must be one of ${TIERS.join(', ')}`);
    if (a.tier === 'manual' && !MANUAL_WHY.test(a.manualWhy || '')) err(`${id}: tier manual needs "manualWhy" starting ui: / job: / email: / user: (TEAM.md "How much E2E")`);
  }
  // every AC of analyst.md must be rated (when the analyst file lists AC-n ids)
  const analyst = read(path.join(WORK(j.card || key), 'analyst.md')) || '';
  for (const id of new Set(analyst.match(/\bAC-\d+(?:\.\d+)?\b/g) || [])) if (!seen.has(id)) warn(`${id} of analyst.md is not rated`);
  if (j.verdict === 'ready' && (n.blocked || n.none)) err('verdict "ready" but some AC are blocked or have no test');
  const total = (j.ac || []).length;
  // AC proven = rated strong AND every one of its tests passed in the latest run (work/<KEY>/run-results.json, by run-card).
  // Coverage is reported as AC proven, never as "TC with a key in a script": a strong rating read from code is only a claim.
  const rf = arg('--runs') || path.join(path.dirname(file), 'run-results.json');
  let runs = null; try { runs = JSON.parse(read(path.resolve(rf)) ?? 'null'); } catch { warn(`run results not valid JSON: ${rf}`); }
  const res = (k) => runs?.tests?.[k];
  let proven = 0;
  for (const a of j.ac || []) {
    const ts = a.tests || [], id = a.id || '?';
    const bad = ts.filter((k) => res(k)?.status !== 'passed').map((k) => `${k}: ${res(k) ? res(k).status + (res(k).why ? ` (${res(k).why})` : '') : 'not run'}`);
    if (a.rating === 'strong') { if (runs && ts.length && !bad.length) proven++; else if (runs) warn(`${id}: strong on paper, not proven by a run (${bad.join(', ')})`); }
    else if (runs && ts.length && !bad.length && a.rating !== 'none') warn(`${id}: rated ${a.rating} but all its tests passed in the last run: re-rate it`);
  }
  if (!runs) warn('no run yet (run-results.json missing): 0 AC proven; strong is only a reading of the code');
  // Coverage target (user, chat 2026-11-26: "ทำเลย", TEAM.md "How much E2E"): of the AC that can be automated
  // (tier is not manual), at least STRONG_TARGET % strong. Below it: warn with the AC to fix (weak first: they can pass unchecked).
  const auto = (j.ac || []).filter((a) => a.tier !== 'manual');
  const target = Number(arg('--target') || STRONG_TARGET);
  const strongAuto = auto.filter((a) => a.rating === 'strong').length;
  const pct = auto.length ? Math.round((100 * strongAuto) / auto.length) : 100;
  if (auto.length && pct < target) {
    const list = (r) => auto.filter((a) => a.rating === r).map((a) => a.id).join(', ');
    warn(`coverage ${pct}% strong of ${auto.length} automatable AC (target ${target}%): ${['weak', 'blocked', 'none'].filter((r) => list(r)).map((r) => `${r} ${list(r)}`).join('; ')}. Fix weak first (can pass without checking); manual only for ui: / job: / email: / user:`);
  }
  const reg = (j.ac || []).filter((a) => a.tier === 'regression');
  if (reg.length) {
    let tags = null; try { const pw = arg('--pw') || resolveRepos().pwRepo; if (fs.existsSync(path.join(pw, 'tests'))) tags = highTagged(pw); } catch { /* no PW_REPO */ }
    if (tags) for (const a of reg) for (const k of a.tests || []) if (tags.has(k) && !tags.get(k)) warn(`${a.id} is High (tier regression) but ${k} has no @high in its title: add " @high" at the end of the test title`);
  }
  if (reg.some((a) => a.rating !== 'strong')) warn(`tier regression AC not strong: ${reg.filter((a) => a.rating !== 'strong').map((a) => a.id).join(', ')}: a regression test must assert the rule`);
  finish('strength', ` | AC proven ${proven}/${total} | strong ${pct}% of ${auto.length} automatable (target ${target}%) | strong on paper ${n.strong}, weak ${n.weak}, blocked ${n.blocked}, none ${n.none}${reg.length ? ` | regression ${reg.length}` : ''}`);
}

// ---------------------------------------------------------------- stats (metrics.jsonl)
function stats() {
  const raw = read(path.join(ROOT, '.claude', 'team', 'metrics.jsonl'));
  if (!raw) { console.log('no metrics yet (they are written every time a check runs)'); process.exit(0); }
  const by = new Map();
  for (const line of raw.split('\n').filter(Boolean)) {
    let j; try { j = JSON.parse(line); } catch { continue; }
    const o = by.get(j.cmd) || { runs: 0, failed: 0, firsts: new Map() };
    o.runs++; if (j.errors) { o.failed++; o.firsts.set(j.first, (o.firsts.get(j.first) || 0) + 1); }
    by.set(j.cmd, o);
  }
  console.log('check                 runs  with errors  fail rate');
  for (const [k, o] of by) console.log(`${k.padEnd(20)} ${String(o.runs).padStart(5)}  ${String(o.failed).padStart(11)}  ${Math.round((100 * o.failed) / o.runs)}%`);
  for (const [k, o] of by) { const top = [...o.firsts.entries()].sort((a, b) => b[1] - a[1])[0]; if (top) console.log(`most common first error in ${k}: ${top[0]} (x${top[1]})`); }
  process.exit(0);
}

// ---------------------------------------------------------------- state (G0): the card's state.json against its files
function checkState() {
  const key = pos[0];
  if (!/^ETM-\d+$/.test(key || '')) { console.error('Usage: qa-check state <KEY> [--root <dir>]'); process.exit(2); }
  const root = arg('--root') || ROOT;
  const { pwRepo } = resolveRepos();
  const { state: s, errors } = loadState(key, root);
  for (const e of errors) err(e);
  if (!s || errors.some((e) => e.startsWith('checksum mismatch'))) return finish(`state ${key}`); // content cannot be trusted
  const paths = [...SINGLE_KINDS.filter((k) => s.files[k]).map((k) => [k, s.files[k]]), ...LIST_KINDS.flatMap((k) => (s.files[k] || []).map((p) => [k, p])), ...Object.entries(s.files.extra || {}).map(([k, p]) => [`extra.${k}`, p])];
  for (const [kind, p] of paths) {
    const r = resolveFile(key, p, { root, pwRepo });
    if (!r.allowed) { err(`files.${kind}: ${p}: ${r.why}`); continue; }
    const ok = kind === 'lastRun' ? fs.existsSync(path.join(r.abs, 'results.json')) : fs.existsSync(r.abs);
    if (!ok) err(`files.${kind}: ${p} does not exist (looked at ${r.abs})`);
  }
  const an = s.files.analyst ? read(path.join(root, s.files.analyst)) : null;
  const acs = an ? parseAc(an) : [];
  if (!acs.length) warn('no numbered AC in analyst.md (older card?): AC checks skipped');
  else {
    const inState = new Map(s.ac.map((a) => [a.id, a.status]));
    for (const a of acs) if (!inState.has(a.id) || inState.get(a.id) === 'dropped') err(`${a.id} is in analyst.md but not active in state.json (run: node tools/state.mjs ac ${key} sync)`);
    const ids = new Set(acs.map((a) => a.id));
    for (const a of s.ac) if (a.status !== 'dropped' && !ids.has(a.id)) err(`${a.id} is active in state.json but no longer in analyst.md (run: node tools/state.mjs ac ${key} sync)`);
  }
  const has = (kind) => s.approvals.some((a) => a.kind === kind);
  if (s.phase === 'push' && !has('xray-push')) err('phase is push but there is no xray-push approval');
  if ((s.phase === 'closeout' || s.phase === 'done') && !has('jira-write')) err(`phase is ${s.phase} but there is no jira-write approval`);
  const team = path.join(root, '.claude', 'team', 'work', key);
  const baks = fs.existsSync(team) ? fs.readdirSync(team).filter((f) => /^draft-tc.*\.bak\.md$/.test(f)) : [];
  if (baks.length) warn(`${baks.length} old draft(s) (*.bak.md) in the card folder; the current one is ${s.files.draft || 'not recorded'}`);
  if (s.history.some((h) => /^REBUILD/.test(h.change))) warn('state.json was rebuilt after a broken file: check its approvals and phase by hand');
  for (const a of s.approvals.filter((x) => x.source === 'chat')) warn(`approval ${a.kind} "${a.what}" comes from chat and is not verified by a tool: "${String(a.evidence).slice(0, 60)}"`);
  for (const q of s.open) if (Date.now() - Date.parse(q.since) > 7 * 864e5) warn(`${q.id} has been open more than 7 days: ${q.text.slice(0, 60)}`);
  return finish(`state ${key}`);
}

// ---------------------------------------------------------------- manual (work/<KEY>/manual-steps-*.md, the manual runner's input)
function checkManualSteps() {
  const key = pos[0];
  if (!/^ETM-\d+$/.test(key || '')) { console.error('Usage: qa-check manual <KEY> [--root <dir>]'); process.exit(2); }
  const root = arg('--root') || ROOT, dir = path.join(root, 'work', key);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^manual-steps-.*\.md$/.test(f)).sort() : [];
  if (!files.length) { err(`no work/${key}/manual-steps-*.md`); return finish(`manual ${key}`); }
  const testsMd = read(path.join(root, '.claude', 'team', 'work', key, 'tests.md'));
  if (testsMd == null) warn(`no .claude/team/work/${key}/tests.md: step counts not compared with Xray`);
  const xray = testsMd ? xrayStepCounts(testsMd) : {};
  let n = 0;
  const seen = new Map();
  for (const f of files) {
    const tests = parseManualSteps(read(path.join(dir, f)));
    if (!tests.length) err(`${f}: no "## ETM-<n> - <title> (<N> steps)" section`);
    for (const t of tests) { if (seen.has(t.key)) err(`${t.key} is in ${seen.get(t.key)} and in ${f}`); seen.set(t.key, f); }
    for (const e of checkManual(tests, xray)) err(`${f}: ${e}`);
    for (const t of tests) if (testsMd && xray[t.key] == null) warn(`${f}: ${t.key} is not in tests.md`);
    n += tests.length;
  }
  return finish(`manual ${key}`, ` | ${n} Test(s) in ${files.length} file(s)`);
}

const run = { manual: checkManualSteps, state: checkState, draft: checkDraft, spec: checkSpec, work: checkWork, manifest: checkManifest, diff: checkDiff, coverage, findings: checkFindings, strength: checkStrength, selftest, stats }[cmd];
if (!run) { console.error('Usage: node tools/qa-check.mjs <state|draft|spec|work|manifest|diff|coverage|findings|strength|selftest|stats> ...'); process.exit(2); }
run();
