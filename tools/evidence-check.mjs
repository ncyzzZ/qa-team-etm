#!/usr/bin/env node
// evidence-check.mjs - a second, independent reading of the evidence before the user decides (user, chat 2026-11-25:
// "ทำ agentic แต่ให้คนจริงตัดสินใจ เพื่อกันพลาด", item 1). Before a defect is logged or a manual Test is confirmed as proposed,
// the evidence-checker agent reads the pictures BLIND: it gets the steps, the expected results and the pictures, never the
// first agent's Actual Result, verdict or reason. Then `compare` puts both readings side by side for the decision card.
//
//   node tools/evidence-check.mjs brief   <KEY> --defect <draft.md>            blind brief of a defect draft
//   node tools/evidence-check.mjs brief   <KEY> --manual <runDir> <TEST>       blind brief of a manual-runner verdict file
//   node tools/evidence-check.mjs compare <KEY> <ID>                            first reading vs the checker's -> <ID>.compare.json
//   node tools/evidence-check.mjs gate    <KEY> <ID>                            exit 0 only when a fresh check and compare exist
//   node tools/evidence-check.mjs card    <KEY> <ID>                            print the team.mjs ask flags for the decision card
//
// Files in work/<KEY>/evidence-check/: <ID>.brief.md (for the checker), <ID>.check.json (written by the checker),
// <ID>.compare.json. <ID> is the draft's file name without .md, or the Test key. A check is stale when the draft, the
// verdict file or a picture changed after the brief (sourceHash).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checkText, sourceFiles, summaryFiles } from './expected-source.mjs';

const ROOT = process.env.EVIDENCE_CHECK_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // env: tests
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
export const CHECK_DIR = (key, root = ROOT) => path.join(root, 'work', key, 'evidence-check');

/** Section text of a markdown draft by heading word (### Step to Reproduce, ### Expected Result, **Environment:** ...). */
export function section(md, name) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => new RegExp(`^(#{2,4}\\s*|\\*\\*)${name}`, 'i').test(l.trim()));
  if (start < 0) return '';
  const first = lines[start].replace(new RegExp(`^.*?${name}\\W*\\**:?\\**`, 'i'), '').trim();
  const out = first ? [first] : [];
  for (const l of lines.slice(start + 1)) {
    if (/^#{1,4}\s/.test(l) || /^\*\*[A-Z][^*]{0,40}:\*\*/.test(l.trim())) break;
    out.push(l);
  }
  return out.join('\n').trim();
}

/** Picture paths named anywhere in the draft (relative to the repo root or absolute). */
export function picturesIn(md, root = ROOT) {
  const set = new Set();
  for (const m of md.matchAll(/[\w./~ -]*?[\w-]+\.(?:png|jpe?g|webp)/gi)) {
    const p = m[0].trim().replace(/^[-*`(\s]+/, '');
    const abs = path.isAbsolute(p) ? p : path.join(root, p);
    if (fs.existsSync(abs)) set.add(abs);
  }
  return [...set];
}

function hashOf(texts, files) {
  const h = crypto.createHash('sha1');
  for (const t of texts) h.update(t);
  for (const f of files) { try { const s = fs.statSync(f); h.update(`${f}:${s.size}:${s.mtimeMs}`); } catch { h.update(`${f}:missing`); } }
  return h.digest('hex').slice(0, 12);
}

/** Source of a check: what the first agent claimed (never put in the brief) and the blind brief. */
export function defectSource(draftFile, root = ROOT) {
  const md = fs.readFileSync(draftFile, 'utf8');
  const pics = picturesIn(md, root);
  return {
    kind: 'defect', id: path.basename(draftFile, '.md'), file: draftFile, pictures: pics, hash: hashOf([md], pics),
    claim: { overall: 'defect', actual: section(md, 'Actual Result') },
    blind: { steps: section(md, 'Step to Reproduce') || section(md, 'Steps to Reproduce'), expected: section(md, 'Expected Result'), environment: section(md, 'Environment') },
  };
}

export function manualSource(runDir, test) {
  const f = path.join(runDir, `verdict-${test}.json`);
  const v = JSON.parse(fs.readFileSync(f, 'utf8'));
  const pics = (v.steps || []).map((s) => s.picture && path.join(runDir, s.picture)).filter((p) => p && fs.existsSync(p));
  const steps = (v.steps || []).map((s) => ({ n: s.n, do: s.do, expected: s.expected, picture: s.picture ? path.join(runDir, s.picture) : null }));
  const verdicts = (v.steps || []).map((s) => s.verdict);
  const overall = verdicts.includes('fail') ? 'fail' : verdicts.every((x) => x === 'pass') && verdicts.length ? 'pass' : 'cannot-tell';
  return {
    kind: 'manual', id: test, file: f, pictures: pics, hash: hashOf([JSON.stringify(steps)], pics),
    claim: { overall, steps: (v.steps || []).map((s) => ({ n: s.n, verdict: s.verdict, why: s.why })) },
    blind: { title: v.title, role: v.role, steps },
  };
}

export function briefText(key, src) {
  const head = [`# Evidence check ${src.id} (${key}, ${src.kind})`, '', `sourceHash: ${src.hash}`, '',
    'You read this BLIND: the first agent\'s result is not here on purpose. Do not open the source file, the run log,',
    'findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.', ''];
  if (src.kind === 'defect') {
    return [...head, '## Environment', src.blind.environment || '(not given)', '', '## Steps', src.blind.steps || '(not given)', '',
      '## Expected Result (as the draft states it: check it has a source)', src.blind.expected || '(not given)', '',
      '## Pictures', ...src.pictures.map((p) => `- ${p}`), ''].join('\n');
  }
  return [...head, `Test: ${src.blind.title || src.id}, role ${src.blind.role || '?'}`, '', '## Steps',
    ...src.blind.steps.map((s) => `${s.n}. DO: ${s.do}\n   EXPECTED: ${s.expected}\n   PICTURE: ${s.picture || '(none)'}`), ''].join('\n');
}

/** Copy the pictures under neutral names (pic-1.jpg ...): a file name such as "lowercase-no-match.jpg" tells the result. */
export function blindPictures(key, src, root = ROOT) {
  const dir = path.join(CHECK_DIR(key, root), `${src.id}.pics`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const map = new Map();
  src.pictures.forEach((p, i) => { const to = path.join(dir, `pic-${i + 1}${path.extname(p).toLowerCase()}`); fs.copyFileSync(p, to); map.set(p, to); });
  const swap = (p) => (p && map.get(p)) || p;
  return { ...src, pictures: src.pictures.map(swap), blind: src.kind === 'manual' ? { ...src.blind, steps: src.blind.steps.map((s) => ({ ...s, picture: swap(s.picture) })) } : src.blind };
}

export function brief(key, src0, root = ROOT) {
  const dir = CHECK_DIR(key, root);
  fs.mkdirSync(dir, { recursive: true });
  const src = blindPictures(key, src0, root);
  const file = path.join(dir, `${src.id}.brief.md`);
  fs.writeFileSync(file, briefText(key, src));
  fs.writeFileSync(path.join(dir, `${src.id}.source.json`), JSON.stringify({ kind: src0.kind, file: src0.file, test: src0.kind === 'manual' ? src0.id : undefined }, null, 1) + '\n');
  return file;
}

function sourceFromRecord(key, id, root = ROOT) {
  const rec = readJson(path.join(CHECK_DIR(key, root), `${id}.source.json`), null);
  if (!rec) throw new Error(`no brief for ${id}: run brief first`);
  return rec.kind === 'defect' ? defectSource(rec.file, root) : manualSource(path.dirname(rec.file), rec.test);
}

const OVERALL = { defect: ['defect-proven', 'not-proven', 'not-a-defect'], manual: ['pass', 'fail', 'cannot-tell'] };

/** Validate the checker's file. Returns a list of problems (empty = fine). */
export function validateCheck(c, src) {
  const p = [];
  if (!c) return ['no check file'];
  if (c.sourceHash !== src.hash) p.push(`stale: check made for ${c.sourceHash}, source is now ${src.hash} (brief again)`);
  if (!OVERALL[src.kind].includes(c.overall)) p.push(`overall "${c.overall}" is not ${OVERALL[src.kind].join(' | ')}`);
  if (!Array.isArray(c.steps) || !c.steps.length) p.push('steps missing: one entry per step with what the picture shows');
  for (const s of c.steps || []) {
    if (!String(s.sees || '').trim()) p.push(`step ${s.n}: "sees" is empty (write what the picture shows, in your own words)`);
    if (!['pass', 'fail', 'cannot-tell'].includes(s.verdict)) p.push(`step ${s.n}: verdict "${s.verdict}"`);
  }
  if (!['yes', 'no', 'unknown'].includes(c.uiReachable)) p.push('uiReachable must be yes | no | unknown');
  if (!Array.isArray(c.expectedSources)) p.push('expectedSources missing (AC / BA answer / Xray step that backs each Expected Result, or [])');
  return p;
}

/** First reading vs the checker. agree: both say the same overall result; disagree: opposite results; unsure: one cannot tell. */
export function compare(src, c) {
  const same = src.kind === 'defect'
    ? (c.overall === 'defect-proven' ? 'agree' : c.overall === 'not-a-defect' ? 'disagree' : 'unsure')
    : (c.overall === src.claim.overall ? 'agree' : [c.overall, src.claim.overall].includes('cannot-tell') ? 'unsure' : 'disagree');
  const steps = src.kind === 'manual' ? src.claim.steps.map((a) => {
    const b = (c.steps || []).find((x) => String(x.n) === String(a.n));
    return { n: a.n, first: a.verdict, checker: b?.verdict ?? 'missing', match: b?.verdict === a.verdict };
  }) : [];
  const warn = [];
  if (c.uiReachable === 'no') warn.push('data not reachable from the UI (team rule: goes to the BA, not a defect)');
  if (c.uiReachable === 'unknown') warn.push('UI reachability of the data not shown');
  if (src.kind === 'defect' && !(c.expectedSources || []).length) warn.push('Expected Result has no source (AC, BA answer or Xray step)');
  for (const s of c.steps || []) if (s.pictureOk === false) warn.push(`step ${s.n}: picture blank, cut or not full screen`);
  for (const x of c.problems || []) warn.push(String(x));
  const result = warn.length && same === 'agree' ? 'agree-with-warnings' : same;
  return { id: src.id, kind: src.kind, result, firstOverall: src.claim.overall, checkerOverall: c.overall, steps, warnings: warn, summary: String(c.summary || '').slice(0, 300), sourceHash: src.hash };
}

export function runCompare(key, id, root = ROOT) {
  const src = sourceFromRecord(key, id, root);
  const dir = CHECK_DIR(key, root);
  const c = readJson(path.join(dir, `${id}.check.json`), null);
  const problems = validateCheck(c, src);
  if (problems.length) throw new Error(`${id}.check.json: ${problems.join('; ')}`);
  const out = compare(src, c);
  fs.writeFileSync(path.join(dir, `${id}.compare.json`), JSON.stringify(out, null, 1) + '\n');
  return out;
}

/** Fresh check + compare for the current source. */
export function gate(key, id, root = ROOT) {
  let src;
  try { src = sourceFromRecord(key, id, root); } catch (e) { return { ok: false, why: e.message }; }
  const cmp = readJson(path.join(CHECK_DIR(key, root), `${id}.compare.json`), null);
  if (!cmp) return { ok: false, why: `no compare for ${id}: the evidence-checker has not read it (brief, agent, compare)` };
  if (cmp.sourceHash !== src.hash) return { ok: false, why: `${id}: the draft or a picture changed after the check; brief and check again` };
  if (src.kind === 'defect') { // gate G-exp: the Expected Result quotes the AC / BA answer / QA lead ruling word for word
    const errs = checkText(fs.readFileSync(src.file, 'utf8'), { sources: sourceFiles(root), summaries: summaryFiles(root), root }).filter((p) => p.lvl === 'ERR');
    if (errs.length) return { ok: false, why: `${id}: Expected Result source (tools/expected-source.mjs): ${errs.map((e) => e.msg).join(' | ').slice(0, 400)}` };
  }
  return { ok: true, cmp };
}

const LABEL = { agree: 'เห็นตรงกัน', 'agree-with-warnings': 'เห็นตรงกัน แต่มีข้อสังเกต', disagree: 'เห็นไม่ตรงกัน', unsure: 'ตัวตรวจบอกไม่ได้จากหลักฐาน' };
/** The decision-card line for team.mjs ask --check. */
export function checkLine(cmp) {
  return `${LABEL[cmp.result] || cmp.result}: ตัวแรก ${cmp.firstOverall}, ตัวตรวจ ${cmp.checkerOverall}` +
    (cmp.steps?.some((s) => !s.match) ? ` (step ต่างกัน: ${cmp.steps.filter((s) => !s.match).map((s) => `${s.n} ${s.first}/${s.checker}`).join(', ')})` : '') +
    (cmp.warnings?.length ? `. ข้อสังเกต: ${cmp.warnings.slice(0, 3).join('; ')}${cmp.warnings.length > 3 ? ` (+${cmp.warnings.length - 3} ใน compare.json)` : ''}` : '');   // the card shows 3, the file keeps all
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, key, ...rest] = process.argv.slice(2);
  const usage = () => { console.error('Usage: evidence-check.mjs brief <KEY> --defect <draft.md> | brief <KEY> --manual <runDir> <TEST> | compare|gate|card <KEY> <ID>'); process.exit(2); };
  if (!/^ETM-\d+$/.test(key || '')) usage();
  try {
    if (cmd === 'brief') {
      const src = rest[0] === '--defect' ? defectSource(path.resolve(rest[1]))
        : rest[0] === '--manual' ? manualSource(path.resolve(rest[1]), rest[2]) : usage();
      if (!src.pictures.length) console.log('WARNING: no picture found: the checker can only say not-proven / cannot-tell');
      console.log(`BRIEF: ${path.relative(ROOT, brief(key, src))} (id ${src.id}, ${src.pictures.length} pictures, sourceHash ${src.hash})`);
      console.log(`Next: evidence-checker agent with this brief, then: node tools/evidence-check.mjs compare ${key} ${src.id}`);
    } else if (cmd === 'compare') {
      const out = runCompare(key, rest[0]);
      console.log(`CHECK ${out.result.toUpperCase()}: ${checkLine(out)}`);
    } else if (cmd === 'gate') {
      const g = gate(key, rest[0]);
      if (!g.ok) { console.log(`EVIDENCE-CHECK: BLOCKED - ${g.why}`); process.exit(1); }
      console.log(`EVIDENCE-CHECK: OK (${g.cmp.result})`);
    } else if (cmd === 'card') {
      const g = gate(key, rest[0]);
      if (!g.ok) { console.log(`EVIDENCE-CHECK: BLOCKED - ${g.why}`); process.exit(1); }
      console.log(`--check ${path.relative(ROOT, path.join(CHECK_DIR(key), rest[0] + '.compare.json'))}`);
    } else usage();
  } catch (e) { console.error(e.message); process.exit(1); }
}
