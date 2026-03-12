import { test, expect } from '@playwright/test';

test('check our app is working', async ({ page }) => {

    // 1. Go to our React website
    await page.goto('http://localhost:3001');

    // 2. Check if the page heading is correct
    const heading = page.locator('h1');
    await expect(heading).toHaveText(/Task Manager/);

    // 3. Playwright will wait automatically for the list container to appear
    //    This is AUTO-WAITING — Playwright retries this check for up to 5 seconds
    //    so our test does NOT become Flaky even if the page is slow to load.
    const taskList = page.locator('.task-list-container');
    await expect(taskList).toBeVisible();

    // 4. Check if the Add Task button is ready to click
    //    Web-First Assertion: Playwright waits for the button to be attached & enabled
    const addTaskBtn = page.getByRole('button', { name: 'Add Task' });
    await expect(addTaskBtn).toBeDisabled(); // disabled when input is empty — correct initial state
});
