import { test, expect } from '@playwright/test';
import { STRIPE_PLACEHOLDER_URL } from '../src/constants';

test.describe('Smoke', () => {
  test('page loads without JS console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('hero CTA "RESERVE MY SPOT" is visible and links to Stripe', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('header').getByRole('link', { name: /reserve my spot/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', STRIPE_PLACEHOLDER_URL);
  });

  test('nav "RESERVE — $27" is visible and links to Stripe', async ({ page }) => {
    await page.goto('/');
    const navCta = page.locator('nav').getByRole('link', { name: /reserve — \$27/i });
    await expect(navCta).toBeVisible();
    await expect(navCta).toHaveAttribute('href', STRIPE_PLACEHOLDER_URL);
  });

  test('nav "RESERVE — $27" is visible on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const navCta = page.locator('nav').getByRole('link', { name: /reserve — \$27/i });
    await expect(navCta).toBeVisible();
    await expect(navCta).toHaveAttribute('href', STRIPE_PLACEHOLDER_URL);
  });

  test('YouTube iframe is present in hero', async ({ page }) => {
    await page.goto('/');
    const iframe = page.locator('iframe[title="TOYL Yoga Hero Video"]');
    await expect(iframe).toBeAttached();
  });

  test('page renders without horizontal overflow on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });
});
