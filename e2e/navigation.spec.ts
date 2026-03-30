import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"How it Works" nav link points to correct section', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /how it works/i });
    await expect(link).toHaveAttribute('href', '#how-it-works');
  });

  test('"About" nav link points to correct section', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /about/i });
    await expect(link).toHaveAttribute('href', '#about');
  });

  test('"Benefits" nav link points to correct section', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /benefits/i });
    await expect(link).toHaveAttribute('href', '#benefits');
  });

  test('clicking "How it Works" scrolls to that section', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: /how it works/i }).click();
    await expect(page.locator('#how-it-works')).toBeInViewport({ ratio: 0.1 });
  });

  test('footer links point to correct sections', async ({ page }) => {
    await expect(page.locator('footer').getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '#how-it-works');
    await expect(page.locator('footer').getByRole('link', { name: /benefits/i })).toHaveAttribute('href', '#benefits');
    await expect(page.locator('footer').getByRole('link', { name: /about toyl/i })).toHaveAttribute('href', '#about');
    await expect(page.locator('footer').getByRole('link', { name: /faq/i })).toHaveAttribute('href', '#faq-section');
  });
});
