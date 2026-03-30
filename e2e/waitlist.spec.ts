import { test, expect } from '@playwright/test';

test.describe('Waitlist form', () => {
  test('submits the form and shows success message (API mocked)', async ({ page }) => {
    // Intercept the serverless function BEFORE navigating so no real network call is made.
    await page.route('**/.netlify/functions/submit-lead', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/#waitlist');

    // Fill in the form fields (ids match WaitlistForm.tsx)
    await page.fill('[id=firstName]', 'Jane');
    await page.fill('[id=lastName]', 'Doe');
    await page.fill('[id=email]', 'jane@example.com');

    // Submit
    await page.getByRole('button', { name: /join the waitlist/i }).click();

    // Assert success state is visible
    await expect(page.getByText(/you're on the list/i)).toBeVisible();
  });
});
