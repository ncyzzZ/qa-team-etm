#!/usr/bin/env node
// Standing run approval (user, chat 2026-11-24: "อนุญาต 1-3"): may the lead run these tests without asking?
//
//   node tools/run-policy.mjs <KEY> <spec|folder>... [-g "<filter>"] [other run-card flags]
//   node tools/run-policy.mjs <KEY> --manual <TEST>...   (manual-runner: one line for the Tests of work/<KEY>/manual-steps-*.md)
//
// Prints one line `RUN-POLICY: auto|ask <KEY> ...` and exits 0 (auto: run, no question) or 3 (ask the user first).
// Auto when nothing in the run can touch data other testers use, i.e. ONE of:
//   A. the card owns its data: PW_REPO/scripts/seed/cards/<KEY>.data.cjs (made / reset by the run, plans "QA <KEY> ...")
//   B. every matched test is tagged @readonly (reads only, saves nothing)
//   C. every matched test already has a result in work/<KEY>/run-results.json (a re-run of tests that ran before,
//      e.g. after a script fix)
// Always ask when: a matched test (or its describe) is tagged @shared-data (writes data others use: another plan,
// Active switch, shared event) or @security (API probes), the flags have --no-data-check, or no test matches.
// The data file's own "NEEDS SETUP" / "NEEDS MANUAL" (card-data.cjs check) still asks: setup is not part of a run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function envFileValue(name) {
  try {
    const m = fs.readFileSync(path.join(ROOT, '.env'), 'utf8').match(new RegExp('^\\s*' + name + '\\s*=\\s*(.+?)\\s*$', 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}
const pwRepo = () => process.env.PW_REPO || envFileValue('PW_REPO') || path.resolve(ROOT, '..', 'ep-etm-fe-qa');

function specFiles(repo, p) {
  const abs = path.isAbsolute(p) ? p : path.join(repo, p);
  if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [abs];
  return fs.readdirSync(abs, { recursive: true }).map((f) => path.join(abs, String(f))).filter((f) => /\.spec\.ts$/.test(f));
}

/** Tests of one spec file: [{ title, tags:Set }] with the file's describe tags added to every test. */
export function testsOf(text) {
  const tagsIn = (s) => new Set(s.match(/@[a-z][\w-]*/gi)?.map((t) => t.toLowerCase()) ?? []);
  const describeTags = new Set();
  for (const m of text.matchAll(/test\.describe(?:\.\w+)?\(\s*(['"`])((?:(?!\1).)*)\1([^()\n]{0,200})/g)) for (const t of tagsIn(m[2] + m[3])) describeTags.add(t);
  const out = [];
  for (const m of text.matchAll(/\btest(?:\.(?:only|fixme|skip))?\(\s*(['"`])((?:(?!\1).)*)\1([^()\n]{0,200})/g)) {
    const tags = tagsIn(m[2] + m[3]);
    for (const t of describeTags) tags.add(t);
    out.push({ title: m[2], tags });
  }
  return out;
}

/** @returns {{auto:boolean, reasons:string[], tests:string[]}} */
export function classify({ key, specs, grep, flags = [], repo = pwRepo(), root = ROOT }) {
  const reasons = [];
  const re = grep ? new RegExp(grep) : null;
  const matched = [];
  for (const s of specs) for (const f of specFiles(repo, s)) {
    for (const t of testsOf(fs.readFileSync(f, 'utf8'))) if (!re || re.test(`${t.title} ${[...t.tags].join(' ')}`)) matched.push({ ...t, file: path.relative(repo, f) });
  }
  const keys = [...new Set(matched.map((t) => (t.title.match(/ETM-\d+/) ?? [t.title.slice(0, 30)])[0]))];
  const ask = (why) => ({ auto: false, reasons: [why, ...reasons], tests: keys });
  if (!matched.length) return ask('no test matches the spec and filter');
  if (flags.includes('--no-data-check')) return ask('--no-data-check runs on data that was not reset');
  const shared = matched.filter((t) => t.tags.has('@shared-data')).map((t) => t.title.slice(0, 40));
  if (shared.length) return ask(`@shared-data (writes data other testers use): ${shared.slice(0, 3).join('; ')}`);
  const sec = matched.filter((t) => t.tags.has('@security'));
  if (sec.length) return ask(`@security tests (API probes) in the run: ${sec.length}`);
  // every test must be safe on its own: card-owned data (its file belongs to this card), @readonly, or ran before
  const dataFile = path.join(repo, 'scripts', 'seed', 'cards', `${key}.data.cjs`);
  const hasData = fs.existsSync(dataFile);
  const create = hasData && /create\s*:\s*true/.test(fs.readFileSync(dataFile, 'utf8'));
  let ran = {};
  try { ran = JSON.parse(fs.readFileSync(path.join(root, 'work', key, 'run-results.json'), 'utf8')).tests ?? {}; } catch { /* none */ }
  const fileText = new Map();
  const ownFile = (f) => { if (!fileText.has(f)) fileText.set(f, fs.readFileSync(path.join(repo, f), 'utf8')); return fileText.get(f).includes(key); };
  const why = new Set();
  const unsafe = [];
  for (const t of matched) {
    const k = (t.title.match(/ETM-\d+/) ?? [''])[0];
    if (hasData && ownFile(t.file)) why.add(create ? 'A: the run makes and deletes its own card data' : 'A: card-owned data (QA <KEY> plans), reset before the run');
    else if (t.tags.has('@readonly')) why.add('B: @readonly');
    else if (k && ran[k]) why.add('C: re-run of tests that ran before');
    else unsafe.push(k || t.title.slice(0, 30));
  }
  if (unsafe.length) return ask(`not card data, not @readonly, never ran: ${unsafe.slice(0, 5).join(', ')}${unsafe.length > 5 ? ` ... (${unsafe.length})` : ''}`);
  return { auto: true, reasons: [...why], tests: keys };
}

/** Manual Tests (TEAM.md Phase 6b): auto when every Test has a section `## <TEST> ...` in work/<KEY>/manual-steps-*.md
 *  whose `writes data:` line is `no` (the browser only reads). Ask when a Test writes data, has no section (an ad-hoc check:
 *  write a steps section with `writes data: no` first, then it is auto), or needs Excel. */
export function classifyManual({ key, tests, root = ROOT }) {
  const dir = path.join(root, 'work', key);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^manual-steps.*\.md$/.test(f)) : [];
  const sections = new Map();
  for (const f of files) {
    const parts = fs.readFileSync(path.join(dir, f), 'utf8').split(/^## /m).slice(1);
    for (const p of parts) { const id = (p.match(/^(ETM-\d+)/) ?? [])[1]; if (id && !sections.has(id)) sections.set(id, { file: f, text: p }); }
  }
  const ask = (why) => ({ auto: false, reasons: [why], tests });
  if (!tests.length) return ask('no Test given');
  const writes = [], missing = [], excel = [];
  for (const t of tests) {
    const s = sections.get(t);
    if (!s) { missing.push(t); continue; }
    const w = (s.text.match(/^writes data:\s*(\S+)/im) ?? [])[1]?.toLowerCase();
    if (w !== 'no') writes.push(`${t} (writes data: ${w ?? 'not stated'})`);
    if (/^needs:\s*excel/im.test(s.text)) excel.push(t);
  }
  if (missing.length) return ask(`no manual-steps section in work/${key}/ for ${missing.join(', ')}: write one with "writes data: no" for a read-only check, then it is auto`);
  if (excel.length) return ask(`needs: excel (a person does it): ${excel.join(', ')}`);
  if (writes.length) return ask(`writes data: ${writes.join('; ')} - name the step that writes and what`);
  return { auto: true, reasons: ['manual, read only (writes data: no)'], tests };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const key = args.shift();
  if (!/^ETM-\d+$/.test(key ?? '')) { console.error('Usage: node tools/run-policy.mjs <KEY> <spec|folder>... [-g "<filter>"] [flags]'); process.exit(2); }
  if (args[0] === '--manual') {
    const r = classifyManual({ key, tests: args.slice(1).filter((a) => /^ETM-\d+$/.test(a)) });
    console.log(`RUN-POLICY: ${r.auto ? 'auto' : 'ask'} ${key} tests=${r.tests.join(',') || '-'} | ${r.reasons.join(' | ')}`);
    process.exit(r.auto ? 0 : 3);
  }
  const specs = [], flags = [];
  let grep = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-g' || args[i] === '--grep') grep = args[++i] ?? '';
    else if (args[i].startsWith('-')) flags.push(args[i]);
    else specs.push(args[i]);
  }
  const r = classify({ key, specs, grep, flags });
  console.log(`RUN-POLICY: ${r.auto ? 'auto' : 'ask'} ${key} tests=${r.tests.join(',') || '-'} | ${r.reasons.join(' | ')}`);
  process.exit(r.auto ? 0 : 3);
}
