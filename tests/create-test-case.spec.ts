import { test, expect } from '@playwright/test';

// Adjust selectors and field names as needed for your UI

test('create a new test case and verify it in the list', async ({ page }) => {
  const uniqueTitle = `E2E Test Case ${Date.now()}`;
  const description = 'Created by Playwright E2E test.';
  const stepInstruction = `Step 1 instruction ${Date.now()}`;
  const stepExpected = `Step 1 expected result ${Date.now()}`;

  // Go to the test case list page
  await page.goto('/test-cases');

  // Click the "Create Test Case" button (adjust selector if needed)
  await page.getByRole('button', { name: /create test case/i }).click();

  // Fill out the form
  await page.getByLabel(/title/i).fill(uniqueTitle);
  await page.getByLabel(/description/i).fill(description);

  // Priority (custom select)
  await page.getByLabel(/priority/i).click();
  await page.getByRole('option', { name: 'High' }).click().catch(async () => {
    // fallback: try button or text
    await page.getByText('High', { exact: true }).click();
  });

  // Status (custom select)
  await page.getByLabel(/status/i).click();
  await page.getByRole('option', { name: 'Ready' }).click().catch(async () => {
    await page.getByText('Ready', { exact: true }).click();
  });

  // Fill in the first test step
  await page.getByLabel(/instruction/i).first().fill(stepInstruction);
  await page.getByLabel(/expected result/i).first().fill(stepExpected);

  // Add more fields if required by your form

  // Submit the form (adjust selector if needed)
  await page.getByRole('button', { name: /create/i }).click();

  // Should be redirected back to the test case list
  await expect(page).toHaveURL(/\/test-cases/);

  // Verify the new test case appears in the list
  await expect(page.getByText(uniqueTitle)).toBeVisible();
}); 