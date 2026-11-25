import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scanSpec, parseLiveCheck, judge, toPromote, promote, stripComments } from './live-check.mjs';

const SPEC = `
import { test } from '@fixtures/pageFixtures';
test('ETM-1 - Delete a work and search it', async ({ page }) => {
  const ids = rows.filter((r) => r.ok);          // Array.filter is not a UI step
  cache.delete('x');                             // Map.delete is not a UI step
  await test.step('1', async () => { await wl.openColumnFilter('Remark'); await page.getByText('Select All').click(); });
});
test('ETM-2 - only a paste', async ({ page }) => {
  // await wl.deleteWork(); (comment, not code)
  await page.keyboard.press('ControlOrMeta+V');
});
test('ETM-3 - reads only', async ({ page }) => { await expect(page.getByRole('heading')).toBeVisible(); });
test.fixme('ETM-4 - later', async ({ page }) => { await wl.searchTable('A'); });
test('ETM-5 - drag', async ({ page }) => { await bar.dragTo(target); await wl.searchTable('W06'); await page.getByRole('button', { name: 'Delete' }).click(); });
`;

test('scanSpec finds UI kinds, ignores JS methods, comments and the title', () => {
  const t = Object.fromEntries(scanSpec(SPEC).map((x) => [x.key, x]));
  assert.deepEqual(t['ETM-1'].kinds, ['filter']);
  assert.deepEqual(t['ETM-2'].kinds, ['paste']);
  assert.deepEqual(t['ETM-3'].kinds, []);
  assert.equal(t['ETM-4'].skipped, true);
  assert.deepEqual(t['ETM-5'].kinds, ['search', 'delete', 'drag']);
});

test('stripComments keeps URLs in strings', () => {
  assert.match(stripComments("const u = 'https://qa.example/x'; // note"), /https:\/\/qa\.example\/x/);
  assert.doesNotMatch(stripComments('a(); // deleteWork()'), /deleteWork/);
});

const TABLE = `# live check
| Test | Action | Fact | Source | Module |
|---|---|---|---|---|
| ETM-1 | filter | Unticking the last option empties the table | docs/modules/m.md | |
| ETM-5 | search | Table search runs only on Enter | live 2026-11-25 | m.md |
| ETM-5 | drag, delete | Not checked, VPN off | Assumption - not checked live | |
| ETM-2 | paste | x | my memory | |
`;

test('parseLiveCheck types the source', () => {
  const r = parseLiveCheck(TABLE);
  assert.deepEqual(r.map((x) => x.type), ['doc', 'live', 'assumption', 'bad']);
  assert.equal(r[1].date, '2026-11-25');
  assert.equal(r[1].module, 'm.md');
});

test('judge: missing row and bad source are errors, assumption is a warning', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lc-'));
  fs.writeFileSync(path.join(dir, 'm.md'), '# M\n');
  const rows = parseLiveCheck(TABLE);
  const t = Object.fromEntries(scanSpec(SPEC).map((x) => [x.key, x]));
  assert.deepEqual(judge(t['ETM-1'], rows, dir), []);
  const p2 = judge(t['ETM-2'], rows, dir);
  assert.equal(p2[0].lvl, 'ERR'); assert.match(p2[0].msg, /my memory/);
  const p5 = judge(t['ETM-5'], rows, dir);
  assert.deepEqual(p5.map((p) => p.lvl), ['WARN', 'WARN']); // delete + drag from the assumption row, search is live
  assert.deepEqual(judge(t['ETM-4'], [], dir), []); // skipped test is not checked
  assert.match(judge(t['ETM-1'], [], dir)[0].msg, /no "ETM-1 \| filter" row/);
  const gone = parseLiveCheck('| ETM-1 | filter | f | docs/modules/nope.md | |');
  assert.match(judge(t['ETM-1'], gone, dir)[0].msg, /nope\.md is not in docs\/modules/);
});

test('promote adds live facts once, under "## Live checks"', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lc-'));
  fs.writeFileSync(path.join(dir, 'm.md'), '# M\n- old fact (ETM-9, 2026-11-01)\n');
  const rows = parseLiveCheck(TABLE);
  assert.equal(toPromote('ETM-5', rows, dir).length, 1);
  promote('ETM-5', rows, dir);
  const doc = fs.readFileSync(path.join(dir, 'm.md'), 'utf8');
  assert.match(doc, /## Live checks\n/);
  assert.match(doc, /- Table search runs only on Enter \(ETM-5, 2026-11-25, live check by automator\)/);
  assert.equal(toPromote('ETM-5', rows, dir).length, 0);
});
