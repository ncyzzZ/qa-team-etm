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
