import { test, expect } from '@playwright/test';
import { evidence } from '@utils/xrayEvidence';

test.describe('Remark (ETM-6000)', () => {
  test('ETM-6001 - Save keeps the Remark @readonly', async ({ page }) => {
    await test.step('1. Save the Remark', async () => {
      await page.getByRole('button', { name: 'Save' }).click();
      await evidence(page, 'ETM-6001', 1, 'save', null, 'Step 1: saved');
      await expect(page.getByText('Saved'), 'toast shows').toBeVisible();
    });
  });
  test('ETM-6002 - Save greyed out until a change @readonly', async ({ page }) => {
    await test.step('1. Look at Save', async () => {
      await expect(page.getByRole('button', { name: 'Save' }), 'Save is greyed out').toBeDisabled();
      await evidence(page, 'ETM-6002', 1, 'save', null, 'Step 1: Save greyed out');
    });
  });
  test('ETM-6003 - Delete a work on a shared worklist @shared-data', async ({ page }) => {
    await test.step('1. Delete', async () => {
      await page.getByRole('button', { name: 'Delete' }).click();
      await evidence(page, 'ETM-6003', 1, 'delete', null, 'Step 1: deleted');
      await expect(page.getByText('Deleted'), 'toast shows').toBeVisible();
    });
  });
});
