import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkText, quotesIn, expectedSections, sourceFiles, summaryFiles, checkManualFiles, norm } from './expected-source.mjs';

function repo() {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'exps-'));
  const w = (p, t) => { fs.mkdirSync(path.dirname(path.join(r, p)), { recursive: true }); fs.writeFileSync(path.join(r, p), t); };
  w('work/ETM-2615/source/jira-ETM-2615.md', 'AC 1.2 Multi-select: Shift+click, drag the corner, or Ctrl+click to select cells that are not next to each other.\n');
  w('work/ETM-1/source/rulings.md', '2026-11-26 QA lead (chat): "Skipped cells keep their old values."\n');
  w('work/SPRINT26/ba-answers-all-2026-11-24.md', 'R3-1 answer: a) The layout of the copied cells is kept.\n');
  w('.claude/team/work/ETM-1/story.md', '1.2 multi-select via Ctrl+click (non-contiguous skipped cells = blank)\n');
  w('work/ETM-1/questions-for-BA-round3.md', 'R3-1 a) keep the layout, skipped cells stay blank\n');
  w('.claude/team/work/ETM-1/tests.md', '## ETM-8738 (TC-002)\n1. Paste into child rows -> the pasted cells show the new values\n');
  w('work/ETM-1/manual-steps-8738.md', '## ETM-8738 - large paste (1 steps)\n\n| # | Do | Expected | Picture |\n|---|---|---|---|\n| 1 | Paste | Work Duration unchanged | p1 |\n');
  return r;
}
const ctx = (r) => ({ sources: sourceFiles(r), summaries: summaryFiles(r), root: r });
const draft = (expected) => `# Defect\n### Actual Result\nx\n### Expected Result\n${expected}\n`;

test('sources are verbatim folders and the BA full replies, never our summaries', () => {
  const r = repo();
  const s = sourceFiles(r).map((f) => path.relative(r, f)).sort();
  assert.deepEqual(s, ['work/ETM-1/source/rulings.md', 'work/ETM-2615/source/jira-ETM-2615.md', 'work/SPRINT26/ba-answers-all-2026-11-24.md']);
  assert.ok(summaryFiles(r).some((f) => f.endsWith('story.md')));
});

test('quotesIn and expectedSections', () => {
  assert.deepEqual(quotesIn('Source:\n> ETM-2615 AC 1.2: "Ctrl+click to select"\nplain'), [{ ref: 'ETM-2615 AC 1.2', text: 'Ctrl+click to select' }]);
  assert.equal(expectedSections(draft('a')).length, 1);
  assert.equal(norm('Ctrl+click, to *select*.'), 'ctrl+click to select');
});

test('M-16: "skipped cells = blank" quoted from story.md is refused, the claim word "blank" too', () => {
  const r = repo();
  const p = checkText(draft('Skipped cells stay blank.\nSource:\n> ETM-2615 AC 1.2: "non-contiguous skipped cells = blank"'), ctx(r));
  assert.ok(p.some((x) => x.lvl === 'ERR' && /only in .*story\.md/.test(x.msg)), JSON.stringify(p));
});

test('our own BA question wording is not a source', () => {
  const r = repo();
  const p = checkText(draft('Layout kept.\nSource:\n> BA R3-1: "keep the layout, skipped cells stay blank"'), ctx(r));
  assert.match(p[0].msg, /only in .*questions-for-BA-round3\.md/);
});

test('a correct draft passes: quotes found, strong words backed', () => {
  const r = repo();
  const md = draft('The layout is kept; the skipped cells keep their old values.\nSource:\n> BA 2026-11-24 R3-1: "The layout of the copied cells is kept"\n> QA lead 2026-11-26: "Skipped cells keep their old values"');
  assert.deepEqual(checkText(md, ctx(r)), []);
});

test('no quote, short quote, unbacked strong word', () => {
  const r = repo();
  assert.match(checkText(draft('Row 2 Duration = 12.00'), ctx(r))[0].msg, /no source quote/);
  assert.match(checkText(draft('x\n> QA lead: "keep it"'), ctx(r))[0].msg, /too short/);
  const p = checkText(draft('The other cells stay blank.\n> BA 2026-11-24 R3-1: "The layout of the copied cells is kept"'), ctx(r));
  assert.ok(p.some((x) => /says "blank"/.test(x.msg)), JSON.stringify(p));
  assert.match(checkText('# no expected here', ctx(r))[0].msg, /no "Expected Result" section/);
});

test('M-15: manual step "unchanged" not in the Xray step is a warning', async () => {
  const r = repo();
  const w = await checkManualFiles('ETM-1', r);
  assert.equal(w.length, 1);
  assert.match(w[0].msg, /ETM-8738 step 1: Expected says "unchanged"/);
});
