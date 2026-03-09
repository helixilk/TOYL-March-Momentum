import { test, expect } from '@playwright/test';

test.describe('FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq-section').scrollIntoViewIfNeeded();
  });

  test('all 6 FAQ questions are visible', async ({ page }) => {
    // Use regex to avoid special-character encoding issues (smart quotes, em dash)
    const patterns = [
      /times for the livestream classes/i,
      /reach out if.*questions/i,
      /not flexible at all/i,
      /special equipment/i,
      /falling behind/i,
      /keep myself motivated/i,
    ];
    for (const p of patterns) {
      await expect(page.getByText(p)).toBeVisible();
    }
  });

  test('clicking a question reveals the answer', async ({ page }) => {
    await page.getByText('What are the times for the livestream classes?').click();
    await expect(page.getByText(/7:00am EST/)).toBeVisible();
  });

  test('clicking an open question hides the answer', async ({ page }) => {
    const question = page.getByText('What are the times for the livestream classes?');
    await question.click();
    await expect(page.getByText(/7:00am EST/)).toBeVisible();
    await question.click();
    await expect(page.getByText(/7:00am EST/)).not.toBeVisible();
  });
});
