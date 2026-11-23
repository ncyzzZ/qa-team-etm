import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkHealDiff } from './guard.mjs';

const P = 'pages/timelinePage/editPlanPage.ts';
const diff = (minus, plus, { file = P, header } = {}) => [
  header ?? `diff --git a/${file} b/${file}`, `--- a/${file}`, `+++ b/${file}`,
  `@@ -10,${minus.length} +10,${plus.length} @@`,
  ...minus.map((l) => `-${l}`), ...plus.map((l) => `+${l}`), '',
].join('\n');
const refused = (d, re) => { const r = checkHealDiff(d); assert.equal(r.ok, false, `should be refused:\n${d}`); if (re) assert.match(r.errors.join('\n'), re); };
const loc = (s) => `    return this.page.locator('${s}');`;

test('a pure locator string change in pages/ passes', () => {
  assert.deepEqual(checkHealDiff(diff([loc('.save-btn')], [loc('.plan-save-button')])), { ok: true, errors: [] });
});
test('getByText / getByRole name / hasText string changes pass', () => {
  assert.equal(checkHealDiff(diff(["this.page.getByText('Save')"], ["this.page.getByText('Save Plan')"])).ok, true);
  assert.equal(checkHealDiff(diff(["getByRole('button', { name: 'Save' })"], ["getByRole('button', { name: 'Save Plan' })"])).ok, true);
  assert.equal(checkHealDiff(diff([".filter({ hasText: 'Draft' })"], [".filter({ hasText: 'Draft plan' })"])).ok, true);
});
test('CRLF line endings are fine', () => {
  assert.equal(checkHealDiff(diff([loc('.a')], [loc('.b')]).replace(/\n/g, '\r\n')).ok, true);
});

test('a locator change in tests/ (spec or helper) passes', () => {
  assert.equal(checkHealDiff(diff([loc('.a')], [loc('.b')], { file: 'tests/fe/e2e/x.spec.ts' })).ok, true);
  assert.equal(checkHealDiff(diff(["  await page.getByText('Save').click();"], ["  await page.getByText('Save Plan').click();"], { file: 'tests/fe/e2e/a.helpers.ts' })).ok, true);
});
test('a file outside pages/ and tests/ is refused', () => {
  refused(diff([loc('.a')], [loc('.b')], { file: 'utils/x.ts' }), /pages\//);
  refused(diff([loc('.a')], [loc('.b')], { file: 'playwright.config.ts' }), /pages\//);
});
test('an expect line in tests/ is still refused', () => refused(diff(["  await expect(page.locator('.a')).toBeVisible();"], ["  await expect(page.locator('.b')).toBeVisible();"], { file: 'tests/fe/x.spec.ts' }), /assertion/));
test('path traversal out of pages/ is refused', () => refused(diff([loc('.a')], [loc('.b')], { file: 'pages/../tests/fe/x.spec.ts' }), /pages\//));
test('a rename to another file is refused', () => {
  const d = diff([loc('.a')], [loc('.b')]).replace(`diff --git a/${P} b/${P}`, `diff --git a/${P} b/tests/x.spec.ts\nrename from ${P}\nrename to tests/x.spec.ts`);
  refused(d);
});
test('binary or mode changes are refused', () => {
  refused(`diff --git a/${P} b/${P}\nold mode 100644\nnew mode 100755\n`);
  refused(`diff --git a/pages/a.png b/pages/a.png\nBinary files a/pages/a.png and b/pages/a.png differ\n`);
});

for (const [name, from, to] of [
  ['.first()', loc('.a'), "    return this.page.locator('.b').first();"],
  ['.nth()', loc('.a'), "    return this.page.locator('.b').nth(0);"],
  ['.last()', loc('.a'), "    return this.page.locator('.b').last();"],
  ['.or()', loc('.a'), "    return this.page.locator('.b').or(this.page.locator('.c'));"],
  ['a regex instead of a string', "this.page.getByText('Save')", 'this.page.getByText(/./)'],
  ['exact: false', "getByText('Save', { exact: true })", "getByText('Save', { exact: false })"],
  ['force: true', 'await this.save.click();', 'await this.save.click({ force: true });'],
  ['a timeout', 'await this.save.waitFor();', 'await this.save.waitFor({ timeout: 60000 });'],
  ['a waitFor state', "await x.waitFor({ state: 'visible' });", "await x.waitFor({ state: 'attached' });"],
  ['a swallowed error', 'await this.save.click();', 'await this.save.click().catch(() => {});'],
]) test(`adding ${name} is refused`, () => refused(diff([from], [to])));

test('nth=, :first-child, :nth- and a bare * inside the new selector string are refused', () => {
  refused(diff([loc('tr.a')], [loc('tr >> nth=0')]));
  refused(diff([loc('li.a')], [loc('li:first-child')]));
  refused(diff([loc('li.a')], [loc('li:nth-child(2)')]));
  refused(diff([loc('.a')], [loc('*')]));
});
test('a changed expected text on an assertion continuation line is refused', () => refused(diff(["      'Draft',"], ["      'Submitted',"])));
test('removing an expect is refused', () => refused(diff(['    await expect(this.title).toBeVisible();'], [])));
test('changing an expect line is refused', () => refused(diff(["await expect(x).toHaveText('Draft');"], ["await expect(x).toHaveText('Submitted');"])));
test('removing a .filter line is refused', () => refused(diff([".filter({ hasText: 'Draft' })"], [])));
test('a removed line that starts with "-- " is content, not a header', () => {
  refused(diff(['- expect(a).toBe(1);'], []).replace('-- expect', '-- expect'));
  const d = [`diff --git a/${P} b/${P}`, `--- a/${P}`, `+++ b/${P}`, '@@ -1,1 +1,0 @@', '-- await expect(x).toBeVisible();', ''].join('\n');
  refused(d);
});
test('an empty diff is refused', () => refused(''));
