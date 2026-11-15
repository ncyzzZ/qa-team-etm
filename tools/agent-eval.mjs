// agent-eval.mjs - score what the agents WROTE against a known answer key. No AI judge, no Jira, no Xray, no app run.
//   node tools/agent-eval.mjs <KEY>              score .claude/team/work/<KEY>/ against evals/agents/<KEY>.key.json
//   node tools/agent-eval.mjs <KEY> --role analyst,designer
//   node tools/agent-eval.mjs selftest           check the scorer itself on evals/agents/ETM-0000.key.json (fixtures)
// Roles scored: analyst (recall of must_find, invented facts), designer (must_cover, min_cases, qa-check draft errors),
//               reviewer (verdict + planted defects caught), automator (qa-check spec errors, TC ids mapped).
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [arg0, ...rest] = process.argv.slice(2);
if (!arg0) { console.error('Usage: node tools/agent-eval.mjs <KEY|selftest> [--role a,b]'); process.exit(2); }
const key = arg0 === 'selftest' ? 'ETM-0000' : arg0;
const roleArg = rest.includes('--role') ? rest[rest.indexOf('--role') + 1].split(',') : null;
const keyFile = path.join(ROOT, 'evals', 'agents', `${key}.key.json`);
if (!fs.existsSync(keyFile)) { console.error(`No answer key: ${keyFile}\nCopy evals/agents/ETM-0000.key.json and fill in what you know is true for the card.`); process.exit(2); }
const K = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
const dir = path.join(ROOT, K.dir || `.claude/team/work/${key}`);
const read = f => { const p = path.join(dir, f); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const has = (txt, any) => any.some(a => txt.toLowerCase().includes(a.toLowerCase()));
const qa = (...a) => { const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'qa-check.mjs'), ...a], { cwd: ROOT, encoding: 'utf8' }); return r.status === 0 ? 0 : (parseInt((r.stdout.match(/(\d+) error/) || [])[1]) || 1); };
const out = {};
const want = r => K[r] && (!roleArg || roleArg.includes(r));

if (want('analyst')) {
  const t = read(K.analyst.file || 'analyst.md');
  if (t == null) out.analyst = { missing: true };
  else { const miss = K.analyst.must_find.filter(m => !has(t, m.any)).map(m => m.id); const bad = (K.analyst.forbidden || []).filter(f => t.toLowerCase().includes(f.toLowerCase()));
    out.analyst = { recall: `${K.analyst.must_find.length - miss.length}/${K.analyst.must_find.length}`, missed: miss, invented: bad, pass: !miss.length && !bad.length }; }
}
if (want('designer')) {
  const f = K.designer.file || 'draft-tc.md'; const t = read(f);
  if (t == null) out.designer = { missing: true };
  else { const miss = K.designer.must_cover.filter(m => !has(t, m.any)).map(m => m.id); const n = (t.match(/^### TC-/gm) || []).length;
    const errs = K.designer.skip_gate ? 0 : qa('draft', path.join(dir, f), ...(K.designer.analyst ? ['--analyst', path.join(dir, K.designer.analyst)] : []));
    out.designer = { covered: `${K.designer.must_cover.length - miss.length}/${K.designer.must_cover.length}`, missed: miss, cases: n, gate_errors: errs, pass: !miss.length && n >= (K.designer.min_cases || 1) && !errs }; }
}
if (want('reviewer')) {
  const t = read(K.reviewer.file || 'review.md');
  if (t == null) out.reviewer = { missing: true };
  else { const verdict = (t.match(/^Verdict:\s*(.+)$/m) || [])[1]; const miss = K.reviewer.planted.filter(m => !has(t, m.any)).map(m => m.id);
    const vOk = !K.reviewer.expect_verdict || (verdict || '').toLowerCase().startsWith(K.reviewer.expect_verdict.toLowerCase());
    out.reviewer = { verdict: verdict || '(none)', verdict_ok: vOk, caught: `${K.reviewer.planted.length - miss.length}/${K.reviewer.planted.length}`, missed: miss, pass: vOk && !miss.length }; }
}
if (want('automator')) {
  const specs = K.automator.specs.map(s => path.join(dir, s)).filter(p => fs.existsSync(p));
  if (!specs.length) out.automator = { missing: true };
  else { const txt = specs.map(p => fs.readFileSync(p, 'utf8')).join('\n'); const miss = (K.automator.must_map || []).filter(id => !txt.includes(id));
    const errs = qa('spec', ...specs); out.automator = { gate_errors: errs, unmapped: miss, pass: !errs && !miss.length }; }
}
console.log(`Agent eval ${key}`); let fails = 0;
for (const [r, v] of Object.entries(out)) { const s = v.missing ? 'NO OUTPUT' : v.pass ? 'PASS' : 'FAIL'; if (s !== 'PASS') fails++; console.log(`  ${r.padEnd(10)} ${s.padEnd(10)} ${v.missing ? '' : JSON.stringify(Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'pass')))}`); }
if (arg0 === 'selftest') { const exp = K.selftest_expect || {}; const bad = Object.entries(exp).filter(([r, p]) => !!out[r]?.pass !== p); console.log(bad.length ? `[selftest] scorer changed behaviour: ${bad.map(b => b[0]).join(', ')}` : '[selftest] scorer behaves as expected'); process.exit(bad.length ? 1 : 0); }
const resDir = path.join(ROOT, 'evals', 'agents', 'results'); fs.mkdirSync(resDir, { recursive: true });
fs.writeFileSync(path.join(resDir, `${key}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')}.json`), JSON.stringify(out, null, 2));
process.exit(fails ? 1 : 0);
