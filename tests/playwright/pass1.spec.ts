import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pass 1 narrow path', () => {
  test('task → focus survives reload → wrap → TIL → history', async ({ page }) => {
    await expect(page.getByText('ELBI STUDY').first()).toBeVisible();
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: /start focus/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /quiet 5/i }).click();
    await page.getByRole('button', { name: /begin session/i }).click();
    await expect(page.getByText(/stay with one thing/i)).toBeVisible();
    const before = await page.locator('.timer-digits').textContent();
    await page.waitForTimeout(1100);
    await page.reload();
    await expect(page.locator('.timer-digits')).toBeVisible();
    const after = await page.locator('.timer-digits').textContent();
    expect(after).not.toBe(before);

    // End early for a fast E2E; natural expiration is unit-tested separately.
    await page.getByRole('button', { name: /end session/i }).click();
    await expect(page.getByText(/session complete/i)).toBeVisible();
    await page.getByRole('button', { name: /done/i }).click();
    await page.getByPlaceholder('I learned that…').fill('Specific tasks lower the friction to start.');
    await page.getByRole('button', { name: /save & return/i }).click();
    await expect(page.getByText(/1 session/i)).toBeVisible();
  });

  test('local task creation continues while offline after app shell is cached', async ({ page, context }) => {
    // First online load allows the PWA worker to populate its precache.
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByLabel('Quick task title').fill('Offline reading');
    await page.getByLabel('Quick task title').press('Enter');
    await expect(page.getByText('Offline reading')).toBeVisible();
    await context.setOffline(false);
  });

  test('core screen has no serious automated accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''));
    expect(serious).toEqual([]);
  });

  test('desktop visual checkpoint', async ({ page }, testInfo) => {
    await page.goto('/?motion=freeze');
    await page.screenshot({ path: testInfo.outputPath('campus-home-current.png'), animations: 'disabled', fullPage: true });
  });

  test('desktop visual regression baseline', async ({ page }) => {
    test.skip(!process.env.ELBI_VISUAL_REGRESSION, 'Enable after approving a served-app baseline with npm run test:e2e:update.');
    await page.goto('/?motion=freeze');
    await expect(page).toHaveScreenshot('campus-home.png', { animations: 'disabled', fullPage: true });
  });
});
