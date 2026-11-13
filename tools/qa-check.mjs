#!/usr/bin/env node
// qa-check.mjs - cheap, token-free checks of what the QA agents produce. Zero dependencies.
//
//   node tools/qa-check.mjs draft    <KEY | path/to/draft-tc.md> [--json]
//   node tools/qa-check.mjs spec     <spec.ts ...> [--tests <tests.md>]
//   node tools/qa-check.mjs work     <KEY> <analyst|inspector|designer|reviewer|automator>
//   node tools/qa-check.mjs manifest <tc-manifest.json>
//   node tools/qa-check.mjs diff     <KEY> <readback.json>     (Xray readback vs draft: [{key, summary, steps}])
//   node tools/qa-check.mjs selftest                             (run the checker against evals/ fixtures)
//   node tools/qa-check.mjs stats                                (how often each gate failed, from .claude/team/metrics.jsonl)
//
// Exit code 1 when there is at least one ERR. WARN lines are advice. Run it before handing anything to the user.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = (key) => path.join(ROOT, '.claude', 'team', 'work', key);
const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(n);
const arg = (n) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : '');
const pos = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--tests', '--analyst'].includes(rest[i - 1])));

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
    if (line.trim()) { cur.other.push(line.trim()); if (/^precondition/i.test(line.trim())) cur.pre.push(line.trim()); step = null; }
  });
  return cases;
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
  // traceability: every AC-n listed in analyst.md must appear in the draft (coverage map or a case)
  const keyOf = (/^ETM-\d+$/.test(arg0) ? arg0 : (file.match(/ETM-\d+/) || [])[0]) || '';
  const anFile = arg('--analyst') || (keyOf ? path.join(WORK(keyOf), 'analyst.md') : '');
  const an = anFile ? read(path.resolve(anFile)) : null;
  if (an) {
    const sec = (an.match(/^##\s+AC items[^\n]*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/im) || [])[1] || '';
    const acIds = [...new Set([...sec.matchAll(/^\s*(?:[-*]\s*)?\**(AC-\d+)\b/gim)].map((m) => m[1].toUpperCase()))];
    for (const id of acIds) if (!new RegExp(`\\b${id}\\b`, 'i').test(text)) err(`${id} is listed in analyst.md but no case or coverage-map line mentions it`);
    if (!acIds.length) warn('analyst.md lists no AC-1, AC-2 ... ids, so AC coverage could not be checked');
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
    if (!marks.length) warn(`${name}: no test() found`);
    marks.forEach((t, i) => {
      nTests++;
      const body = text.slice(t.at, i + 1 < marks.length ? marks[i + 1].at : text.length);
      const key = (t.title.match(/^(ETM-\d+)\b/) || [])[1];
      if (!key) err(`${name}: test "${t.title.slice(0, 50)}" - title must start with the Xray key (ETM-1234 - ...)`);
      else if (testsMd && !testsMd.includes(key)) warn(`${name}: ${key} is not in the card's tests file`);
      const steps = (body.match(/\btest\.step\(/g) || []).length;
      const ev = (body.match(/\bevidence\(/g) || []).length;
      if (!steps) err(`${name}: ${key || t.title.slice(0, 30)} has no test.step (one test.step per Xray step)`);
      else if (ev < steps) warn(`${name}: ${key || t.title.slice(0, 30)} has ${steps} steps but ${ev} evidence() calls (a picture per step)`);
      if (/\.only\(/.test(t.whole)) err(`${name}: ${key || ''} test.only left in`);
    });
    const hits = (re2, m, lvl = err) => { const n = (text.match(re2) || []).length; if (n) lvl(`${name}: ${m} (${n}x)`); };
    hits(/\bwaitForTimeout\(/g, 'waitForTimeout is not allowed, wait for a condition instead');
    hits(/\bpage\.pause\(/g, 'page.pause() left in');
    hits(/\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*(['"`])(?!\$\{)[^'"`\s]{4,}\2/gi, 'looks like a hard-coded credential (use .env)');
    hits(/data-testid/g, 'the ETM app has no data-testid: use data-id, data-column, roles, text', warn);
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

// ---------------------------------------------------------------- selftest (evals/)
function selftest() {
  const dir = path.join(ROOT, 'evals'), cfg = read(path.join(dir, 'expected.json'));
  if (cfg == null) { console.error('evals/expected.json not found'); process.exit(2); }
  let bad = 0;
  for (const t of JSON.parse(cfg)) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...t.args.map((a) => (a.startsWith('evals/') ? path.join(ROOT, a) : a))], { encoding: 'utf8', env: { ...process.env, QA_CHECK_NO_METRICS: '1' } });
    const m = (r.stdout || '').match(/\] (\d+) error\(s\)/), got = m ? Number(m[1]) : -1;
    const ok = got === t.errors && (!t.contains || (r.stdout || '').includes(t.contains));
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${t.name}  (expected ${t.errors} error(s), got ${got}${t.contains && !(r.stdout || '').includes(t.contains) ? `, missing text "${t.contains}"` : ''})`);
  }
  console.log(bad ? `[selftest] ${bad} fixture(s) failed: the checker changed behaviour` : '[selftest] all fixtures behave as expected');
  process.exit(bad ? 1 : 0);
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

const run = { draft: checkDraft, spec: checkSpec, work: checkWork, manifest: checkManifest, diff: checkDiff, selftest, stats }[cmd];
if (!run) { console.error('Usage: node tools/qa-check.mjs <draft|spec|work|manifest|diff|selftest|stats> ...'); process.exit(2); }
run();
