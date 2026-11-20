import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { specIndex } from './specs.mjs';

function repos() {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'regress-pw-'));
  const team = fs.mkdtempSync(path.join(os.tmpdir(), 'regress-team-'));
  const w = (root, p, t) => { fs.mkdirSync(path.join(root, path.dirname(p)), { recursive: true }); fs.writeFileSync(path.join(root, p), t); };
  w(pw, 'tests/fe/e2e/shutdownTimeline/grid.helpers.ts', "export const cell = (p) => p.locator('.timeline-grid__cell--activity');\nexport const btn = (p) => p.locator('.ant-btn');\n");
  w(pw, 'tests/fe/e2e/shutdownTimeline/verifyGrid.spec.ts', "import { cell } from './grid.helpers';\ntest('ETM-11 - grid', async () => {});\n");
  w(pw, 'tests/fe/e2e/shutdownTimeline/verifyOther.spec.ts', "test('ETM-99 - other', async ({ page }) => { page.getByText('Some Label Text'); });\n");
  w(pw, 'tests/fe/e2e/shutdownTimeline/probeGrid.spec.ts', "test('probe', async () => {});\n");
  w(pw, 'pages/pages.ts', '');
  w(team, 'work/ETM-9/run-results.json', JSON.stringify({ card: 'ETM-9', tests: { 'ETM-11': { status: 'passed' } } }));
  return { pw, team };
}

test('specIndex: listable specs only, with folder and test keys', () => {
  const { pw, team } = repos();
  const s = specIndex(pw, team);
  assert.deepEqual(s.map((x) => x.file).sort(), ['tests/fe/e2e/shutdownTimeline/verifyGrid.spec.ts', 'tests/fe/e2e/shutdownTimeline/verifyOther.spec.ts']);
  assert.equal(s[0].folder, 'shutdownTimeline');
  assert.deepEqual(s.find((x) => x.file.endsWith('verifyGrid.spec.ts')).keys, ['ETM-11']);
});

test('specIndex: tokens come from the spec and its local helpers, library classes left out', () => {
  const { pw, team } = repos();
  const g = specIndex(pw, team).find((x) => x.file.endsWith('verifyGrid.spec.ts'));
  assert.ok(g.tokens.has('timeline-grid__cell--activity'));
  assert.ok(!g.tokens.has('ant-btn'));
});

test('specIndex: owner is the Story whose run-results list a test key; unknown key -> null', () => {
  const { pw, team } = repos();
  const s = specIndex(pw, team);
  assert.equal(s.find((x) => x.file.endsWith('verifyGrid.spec.ts')).owner, 'ETM-9');
  assert.equal(s.find((x) => x.file.endsWith('verifyOther.spec.ts')).owner, null);
});

test('specIndex: plain common words are not tokens (true, empty, Date); distinctive ones stay', () => {
  const { pw, team } = repos();
  fs.writeFileSync(path.join(pw, 'tests/fe/e2e/shutdownTimeline/verifyWords.spec.ts'),
    "test('ETM-12 - w', async ({ page }) => { page.locator('[aria-checked=\"true\"]'); page.locator('.empty'); page.getByText('Date'); page.getByText('Ramp Down/Up Date'); page.locator('.weekly-cell'); page.getByText('Duration'); });\n");
  const t = specIndex(pw, team).find((x) => x.file.endsWith('verifyWords.spec.ts')).tokens;
  for (const w of ['true', 'empty', 'Date', 'Duration']) assert.ok(!t.has(w), `${w} should be dropped`);
  for (const w of ['Ramp Down/Up Date', 'weekly-cell']) assert.ok(t.has(w), `${w} should stay`);
});

test('specIndex: utility CSS classes (cursor-pointer, flex-1, text-sm) are not tokens', () => {
  const { pw, team } = repos();
  fs.writeFileSync(path.join(pw, 'tests/fe/e2e/shutdownTimeline/verifyUtil.spec.ts'),
    "test('ETM-13 - u', async ({ page }) => { page.locator('.cursor-pointer'); page.locator('.flex-row-reverse'); page.locator('.text-red-500'); page.locator('.note-modal__body'); });\n");
  const t = specIndex(pw, team).find((x) => x.file.endsWith('verifyUtil.spec.ts')).tokens;
  for (const w of ['cursor-pointer', 'flex-row-reverse', 'text-red-500']) assert.ok(!t.has(w), `${w} should be dropped`);
  assert.ok(t.has('note-modal__body'));
});
