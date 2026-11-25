// defect-exam.mjs - exams built from real defects: would the test designer, given only what was known BEFORE the defect,
// write a test case that catches it? No AI judge, no Jira, no Xray, no app run.
//   node tools/defect-exam.mjs list                     exams in evals/exams/<DEFECT>/exam.json
//   node tools/defect-exam.mjs prepare <DEFECT>         copy the frozen inputs to .claude/team/work/EXAM-<DEFECT>/, print the brief
//   node tools/defect-exam.mjs score <DEFECT> [--draft <file>] [--baseline]
//                                                       score a draft (default: the EXAM work dir; --baseline: the team's original draft)
//   node tools/defect-exam.mjs all [--baseline]         score every exam, one line each
// Exit code: 0 when every scored draft catches its defect, 1 otherwise, 2 on usage errors.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXAMS = path.join(ROOT, 'evals', 'exams');

export const tcBlocks = txt => {
  const out = []; let cur = null;
  for (const line of txt.split('\n')) {
    const m = line.match(/^###\s+(TC-[\w-]+)/);
    if (m) { cur = { id: m[1], lines: [line] }; out.push(cur); } else if (/^##\s/.test(line)) cur = null; else if (cur) cur.lines.push(line);
  }
  return out;
};
// a group ['!', ...words] matches when NONE of the words is there; a word is a case-insensitive substring; 're:<regex>' is a case-insensitive regex (for short tokens such as \bEP\b)
const hit = (txt, group) => group[0] === '!' ? !hit(txt, group.slice(1)) : group.some(w => w.startsWith('re:') ? new RegExp(w.slice(3), 'i').test(txt) : txt.toLowerCase().includes(w.toLowerCase()));
export function catches(block, sig) {
  if (sig.any) { for (const alt of sig.any) { const l = catches(block, alt); if (l) return l; } return null; }
  const all = block.lines.join('\n');
  if (!(sig.block || []).every(g => hit(all, g))) return null;
  const lines = [];
  for (const step of sig.steps || []) { const l = block.lines.slice(1).find(x => step.every(g => hit(x, g))); if (!l) return null; lines.push(l.trim()); }
  return lines;
}
export function score(txt, sig) {
  const found = [];
  for (const b of tcBlocks(txt)) { const l = catches(b, sig); if (l) found.push({ tc: b.id, lines: l }); }
  return { cases: tcBlocks(txt).length, caught_by: found };
}

const load = d => { const f = path.join(EXAMS, d, 'exam.json'); if (!fs.existsSync(f)) { console.error(`No exam: ${f}`); process.exit(2); } return JSON.parse(fs.readFileSync(f, 'utf8')); };
const list = () => fs.existsSync(EXAMS) ? fs.readdirSync(EXAMS).filter(d => fs.existsSync(path.join(EXAMS, d, 'exam.json'))) : [];
const workDir = (d, ex = load(d)) => path.join(ROOT, '.claude', 'team', 'work', `EXAM-${ex.run || d}`);
const inDir = (d, ex) => path.join(EXAMS, ex.inputs_dir || d);
const group = (d, ex) => ex.run ? list().filter(e => load(e).run === ex.run) : [d];

function leaks(d, ex) {
  const where = [];
  const keys = group(d, ex).map(e => load(e).defect);
  for (const i of ex.inputs) { const t = fs.readFileSync(path.join(inDir(d, ex), i), 'utf8'); for (const k of keys) if (t.includes(k)) where.push(`input ${i} names ${k}`); }
  const kdir = path.join(ROOT, '.claude', 'team', 'knowledge');
  const scan = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.(md|jsonl)$/.test(f)).filter(f => { const t = fs.readFileSync(path.join(dir, f), 'utf8'); return keys.some(k => t.includes(k)); }).map(f => path.relative(ROOT, path.join(dir, f))) : [];
  return { inputs: where, knowledge: [...scan(kdir), ...scan(path.join(ROOT, 'docs', 'modules'))] };
}

function runScore(d, { draft, baseline } = {}) {
  const ex = load(d);
  if (baseline && !draft && !ex.baseline) return { exam: d, story: ex.story, file: '(no team draft: the team never designed this Story)', missing: true, pass: false, no_baseline: true };
  const file = draft ? path.resolve(draft) : baseline ? path.join(EXAMS, d, ex.baseline) : path.join(workDir(d, ex), 'draft-tc.md');
  if (!fs.existsSync(file)) return { exam: d, file: path.relative(ROOT, file), missing: true, pass: false };
  const r = score(fs.readFileSync(file, 'utf8'), ex.catch);
  return { exam: d, story: ex.story, file: path.relative(ROOT, file), ...r, pass: r.caught_by.length > 0 };
}
const show = r => r.no_baseline ? `  ${r.exam.padEnd(9)} -          ${r.file}` : r.missing ? `  ${r.exam.padEnd(9)} NO DRAFT   ${r.file}` :
  `  ${r.exam.padEnd(9)} ${(r.pass ? 'CAUGHT' : 'MISSED').padEnd(10)} ${r.cases} TCs, caught by: ${r.caught_by.map(c => c.tc).join(', ') || '-'}   (${r.file})`;
function save(results, tag) {
  const dir = path.join(EXAMS, 'results'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${tag}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')}.json`), JSON.stringify(results, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, d, ...rest] = process.argv.slice(2);
  const baseline = process.argv.includes('--baseline'); const draft = rest.includes('--draft') ? rest[rest.indexOf('--draft') + 1] : null;
  if (cmd === 'list') { for (const e of list()) { const x = load(e); console.log(`${e.padEnd(9)} story ${x.story}: ${x.bug}`); } process.exit(0); }
  if (cmd === 'prepare' && d) {
    const ex = load(d); const lk = leaks(d, ex);
    if (lk.inputs.length) { console.error(`[exam] inputs name the defect (${lk.inputs.join(', ')}): fix the frozen inputs first.`); process.exit(1); }
    const w = workDir(d, ex); fs.rmSync(w, { recursive: true, force: true }); fs.mkdirSync(w, { recursive: true });
    for (const i of ex.inputs) fs.copyFileSync(path.join(inDir(d, ex), i), path.join(w, i));
    if (ex.run) console.log(`[exam] one draft serves ${group(d, ex).join(', ')}`);
    const rel = path.relative(ROOT, w);
    console.log(`[exam] ${d}: inputs copied to ${rel}/ (${ex.inputs.join(', ')})`);
    if (lk.knowledge.length) console.log(`[exam] note: ${lk.knowledge.join(', ')} name ${ex.defect}. The designer reads them, so this run measures "with lessons". Say so in the result.`);
    console.log(`\nBrief for the test-designer agent (copy as is):\n---\nExam run, not card work. Write ${rel}/draft-tc.md for Story ${ex.story} from ${ex.inputs.map(i => `${rel}/${i}`).join(' and ')}, the module docs and .claude/team/knowledge/, as your agent file says.\nDo NOT read anything under work/${ex.story}/, .claude/team/work/${ex.story}/, evals/exams/, Jira or Xray. Do not run team.mjs, tests, Jira or Xray. Do not ask questions; list them under Open questions.\n---\nThen: ${group(d, ex).map(e => `node tools/defect-exam.mjs score ${e}`).join('; ')}`);
    process.exit(0);
  }
  if (cmd === 'score' && d) { const r = runScore(d, { draft, baseline }); console.log(show(r)); if (r.caught_by?.length) for (const c of r.caught_by) for (const l of c.lines) console.log(`      ${c.tc}: ${l.slice(0, 160)}`); save([r], `${d}${baseline ? '-baseline' : ''}`); process.exit(r.pass ? 0 : 1); }
  if (cmd === 'all') { const all = list().map(e => runScore(e, { baseline })); all.forEach(r => console.log(show(r))); const rs = all.filter(r => !r.no_baseline); console.log(`  ${rs.filter(r => r.pass).length}/${rs.length} caught${all.length > rs.length ? ` (${all.length - rs.length} with no team draft)` : ''}`); save(all, `all${baseline ? '-baseline' : ''}`); process.exit(rs.every(r => r.pass) ? 0 : 1); }
  console.error('Usage: node tools/defect-exam.mjs list | prepare <DEFECT> | score <DEFECT> [--draft f] [--baseline] | all [--baseline]'); process.exit(2);
}
