import { test, expect } from '@playwright/test';
import { evidence } from '@utils/xrayEvidence';

test('ETM-5001 - Verify Save is greyed out until a field changes', async ({ page }) => {
  await test.step('1. Open the Edit window', async () => {
    await page.goto('/edit', { waitUntil: 'domcontentloaded' });
    await evidence(page, 'ETM-5001', 1, 'open', null, 'Step 1: Edit window is open');
  });
  await test.step('2. Look at the Save button', async () => {
    await expect(page.getByRole('button', { name: 'Save' }), 'Save is greyed out').toBeDisabled();
    await evidence(page, 'ETM-5001', 2, 'save', null, 'Step 2: Save is greyed out');
  });
});
