import { test, expect } from '@playwright/test';

test('take a screenshot of home page', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for everything to load
  await page.waitForLoadState('networkidle');

  // Take a full-page screenshot and save it
  await page.screenshot({
    path: 'screenshots/homepage.png',
    fullPage: true
  });

  console.log('Screenshot saved to screenshots/homepage.png');
});

test('visual regression - check homepage looks correct', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // toHaveScreenshot() compares with the saved 'golden' screenshot
  // If anything on the page changed visually, this test will FAIL
  await expect(page).toHaveScreenshot('homepage-snapshot.png', {
    maxDiffPixels: 100  // Allow tiny differences (e.g. from font rendering)
  });
});

test('screenshot of a specific element only', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const taskList = page.locator('.task-list-container');
  // Screenshot just one component — not the whole page
  await taskList.screenshot({ path: 'screenshots/task-list.png' });
});
