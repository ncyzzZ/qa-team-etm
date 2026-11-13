import { test, expect } from '@playwright/test';

const password = 'Sup3rSecret!';

test.only('Verify something', async ({ page }) => {
  await page.waitForTimeout(3000);
  await expect(page.locator('[data-testid="x"]')).toBeVisible();
});

test('ETM-5002 - no steps here', async ({ page }) => {
  await page.pause();
});
