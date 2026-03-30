import { test, expect } from '@playwright/test';

test.describe('Legal Modals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to footer so modal trigger buttons are accessible
    await page.locator('footer').scrollIntoViewIfNeeded();
  });

  test('Terms modal opens and displays correct title', async ({ page }) => {
    await page.getByRole('button', { name: /^terms$/i }).click();
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('Terms modal closes via X button', async ({ page }) => {
    await page.getByRole('button', { name: /^terms$/i }).click();
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
    // X button is the first close button in the modal header
    await page.locator('.fixed button').first().click();
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).not.toBeVisible();
  });

  test('Terms modal closes via footer Close button', async ({ page }) => {
    await page.getByRole('button', { name: /^terms$/i }).click();
    await page.getByRole('button', { name: /^close$/i }).click();
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).not.toBeVisible();
  });

  test('Privacy modal opens and displays correct title', async ({ page }) => {
    await page.getByRole('button', { name: /^privacy$/i }).click();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('Privacy modal closes via footer Close button', async ({ page }) => {
    await page.getByRole('button', { name: /^privacy$/i }).click();
    await page.getByRole('button', { name: /^close$/i }).click();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).not.toBeVisible();
  });
});
