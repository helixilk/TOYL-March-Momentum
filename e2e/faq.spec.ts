import { test, expect } from '@playwright/test';

test.describe('FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq-section').scrollIntoViewIfNeeded();
  });

  test('all 6 FAQ questions are visible', async ({ page }) => {
    const questions = [
      'What are the times for the livestream classes?',
      'How do I reach out if I have any questions?',
      "I'm not flexible at all—can I actually do this?",
      'Do I need any special equipment or a lot of space?',
      'If I find myself falling behind, how can I catch up?',
      'How do I keep myself motivated?',
    ];
    for (const q of questions) {
      await expect(page.getByText(q)).toBeVisible();
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
