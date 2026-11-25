import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defectSource, manualSource, brief, runCompare, gate, compare, validateCheck, CHECK_DIR, checkLine } from './evidence-check.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PNG = Buffer.from('89504e470d0a1a0a0000000d4948445200000001000000010806000000', 'hex');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-'));
  const w = path.join(root, 'work', 'ETM-1');
  fs.mkdirSync(w, { recursive: true });
  fs.writeFileSync(path.join(w, 'search-lowercase-no-match.png'), PNG);
  const draft = path.join(w, 'defect-draft-x.md');
  fs.writeFileSync(draft, [
    '# Defect draft', '**Summary:** search is case sensitive', '**Environment:** QA, TM',
    '### Step to Reproduce', '1. Open the filter', '2. Type `wk-2`',
    '### Actual Result', '- "No matches."', 'Pictures:', '- work/ETM-1/search-lowercase-no-match.png',
    '### Expected Result', '- `wk-2` finds WK-2-A (Xray ETM-9 step 3)', '**Fields:**', '- Labels: FE'].join('\n'));
  const run = path.join(root, 'run'); fs.mkdirSync(path.join(run, 'evidence', 'ETM-5'), { recursive: true });
  fs.writeFileSync(path.join(run, 'evidence', 'ETM-5', 'step-1.png'), PNG);
  fs.writeFileSync(path.join(run, 'verdict-ETM-5.json'), JSON.stringify({ key: 'ETM-1', test: 'ETM-5', title: 'T', role: 'turnaroundManager',
    steps: [{ n: 1, do: 'open', expected: 'list shows 3 rows', verdict: 'pass', why: 'saw 3 rows', picture: 'evidence/ETM-5/step-1.png' }] }));
  return { root, draft, run };
}
const okCheck = (hash, over = {}) => ({ sourceHash: hash, overall: 'defect-proven', steps: [{ n: 1, sees: 'popup shows No matches', verdict: 'fail', pictureOk: true }], expectedSources: ['Xray ETM-9 step 3'], uiReachable: 'yes', problems: [], summary: 'ok', ...over });

test('defect brief is blind: no Actual Result, no Summary, pictures renamed', () => {
  const { root, draft } = fixture();
  const src = defectSource(draft, root);
  assert.equal(src.pictures.length, 1);
  const f = brief('ETM-1', src, root);
  const b = fs.readFileSync(f, 'utf8');
  assert.match(b, /Type `wk-2`/);
  assert.match(b, /finds WK-2-A/);
  assert.doesNotMatch(b, /No matches/);
  assert.doesNotMatch(b, /case sensitive/);
  assert.doesNotMatch(b, /no-match/);
  assert.match(b, /pic-1\.png/);
  assert.match(b, new RegExp(`sourceHash: ${src.hash}`));
});

test('manual brief hides verdict and why', () => {
  const { root, run } = fixture();
  const src = manualSource(run, 'ETM-5');
  const b = fs.readFileSync(brief('ETM-1', src, root), 'utf8');
  assert.match(b, /list shows 3 rows/);
  assert.doesNotMatch(b, /saw 3 rows/);
  assert.doesNotMatch(b, /\bpass\b/);
});

test('compare: agree, disagree, unsure, warnings', () => {
  const { root, draft } = fixture();
  const src = defectSource(draft, root);
  assert.equal(compare(src, okCheck(src.hash)).result, 'agree');
  assert.equal(compare(src, okCheck(src.hash, { overall: 'not-a-defect' })).result, 'disagree');
  assert.equal(compare(src, okCheck(src.hash, { overall: 'not-proven' })).result, 'unsure');
  const w = compare(src, okCheck(src.hash, { uiReachable: 'no', expectedSources: [] }));
  assert.equal(w.result, 'agree-with-warnings');
  assert.match(checkLine(w), /not reachable from the UI/);
  assert.match(checkLine(w), /no source/);
});

test('manual compare lists the steps that differ', () => {
  const { root, run } = fixture();
  const src = manualSource(run, 'ETM-5');
  const c = compare(src, okCheck(src.hash, { overall: 'fail' }));
  assert.equal(c.result, 'disagree');
  assert.deepEqual(c.steps, [{ n: 1, first: 'pass', checker: 'fail', match: false }]);
});

test('validateCheck refuses empty readings and wrong values', () => {
  const { root, draft } = fixture();
  const src = defectSource(draft, root);
  assert.deepEqual(validateCheck(okCheck(src.hash), src), []);
  const p = validateCheck(okCheck('other', { overall: 'pass', steps: [{ n: 1, sees: '', verdict: 'x' }], uiReachable: 'maybe' }), src);
  assert.equal(p.length, 5);
});

test('gate: blocked without check, ok after compare, blocked again when a picture changes', () => {
  const { root, draft } = fixture();
  const src = defectSource(draft, root);
  brief('ETM-1', src, root);
  assert.equal(gate('ETM-1', src.id, root).ok, false);
  fs.writeFileSync(path.join(CHECK_DIR('ETM-1', root), `${src.id}.check.json`), JSON.stringify(okCheck(src.hash)));
  runCompare('ETM-1', src.id, root);
  assert.equal(gate('ETM-1', src.id, root).ok, true);
  const pic = path.join(root, 'work', 'ETM-1', 'search-lowercase-no-match.png');
  fs.appendFileSync(pic, Buffer.from('00', 'hex'));
  const g = gate('ETM-1', src.id, root);
  assert.equal(g.ok, false);
  assert.match(g.why, /changed after the check/);
});

test('team.mjs ask --gate defect refuses a question without the card and the check', () => {
  const r = spawnSync(process.execPath, [path.join(HERE, '..', '.claude', 'team', 'team.mjs'), 'ask', '--approve', '--gate', 'defect', '--job', 'ETM-0', 'log it?'],
    { encoding: 'utf8', env: { ...process.env, TEAM_NOTIFY: '0' } });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /needs: --propose, --why, --undo, --if-wrong, --check .*--evidence/);
});
