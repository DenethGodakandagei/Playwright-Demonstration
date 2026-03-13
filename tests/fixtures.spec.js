import { test, expect } from '@playwright/test';

// beforeEach runs BEFORE every single test automatically
test.beforeEach(async ({ page }) => {
    // Always start from the home page before each test
    await page.goto('http://localhost:3000');
    // Always wait for the app to be fully loaded
    await page.waitForLoadState('networkidle');
});

// afterEach runs AFTER every single test automatically
test.afterEach(async ({ page }, testInfo) => {
    // If a test fails, take a screenshot for debugging
    if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({ path: `failure-${testInfo.title}.png` });
    }
});

test('first test - page loads correctly', async ({ page }) => {
    // Web-First Assertion: checks the h1 heading text
    const heading = page.locator('h1');
    await expect(heading).toHaveText(/Task Manager/);
});

test('second test - task list is visible', async ({ page }) => {
    // The .task-list-container div is always rendered, even when empty
    const taskList = page.locator('.task-list-container');
    await expect(taskList).toBeVisible();
});
