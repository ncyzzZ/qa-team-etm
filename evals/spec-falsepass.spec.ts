import { test, expect, notChecked } from '@fixtures/pageFixtures';
import { evidence } from '@utils/xrayEvidence';

// Fixture for the "No false pass" checks of `qa-check spec`: 3 errors expected (lines marked ERR).
test('ETM-5002 - Verify the Status dropdown has no options for a Ready Work', async ({ page }) => {
  let row: string | undefined;
  await test.step('1. Open the dropdown', async () => {
    await page.getByRole('combobox', { name: 'Status' }).click().catch(() => undefined); // ERR: swallowed action, absence check next
    await expect(page.getByRole('option'), 'No options').toHaveCount(0);
    await evidence(page, 'ETM-5002', 1, 'open', null, 'Step 1');
  });
  await test.step('2. Read the value', async () => {
    const v = await page.getByRole('textbox').inputValue();
    if (v) expect(v, 'Value is a date').toMatch(/\d{4}/); // ERR: conditional expect without else
    await evidence(page, 'ETM-5002', 2, 'value', null, 'Step 2');
  });
  await test.step('3. Check a row', async () => {
    if (!row) return; // ERR: early return without notChecked
    await evidence(page, 'ETM-5002', 3, 'row', null, 'Step 3');
  });
  await test.step('4. Check another row (allowed shapes)', async () => {
    if (!row) { notChecked('no row in this plan'); return; }
    const v = await page.getByRole('textbox').inputValue();
    if (v) expect(v, 'Value is a date').toMatch(/\d{4}/);
    else notChecked('the value is empty');
    await expect(page.getByRole('combobox'), 'The dropdown is on the page').toBeVisible();
    await page.getByRole('combobox').click().catch(() => undefined);
    await expect(page.getByRole('option'), 'No options').toHaveCount(0);
    await evidence(page, 'ETM-5002', 4, 'row2', null, 'Step 4');
  });
});
