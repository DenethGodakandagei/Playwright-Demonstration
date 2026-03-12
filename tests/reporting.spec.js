const { test, expect } = require('@playwright/test');

/**
 * TEST SUITE: HTML REPORTING CAPABILITIES
 * Demonstrates Passed, Failed, and Skipped test states in the interactive report.
 */

test.describe('Reporting Demonstration', () => {

  // TEST 1: This test is designed to PASS.
  // In the HTML report, this will show up with a green checkmark.
  test('Verify home page title (Passes)', async ({ page }) => {
    // Step: Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Step: Assert that the title matches "Task Manager"
    // Web-First Assertion: Playwright will wait for the page to load before checking this.
    await expect(page).toHaveTitle(/Task Manager/);
  });

  // TEST 2: Updated to PASS.
  // We search for the "Add Task" button which we know exists.
  test('Search for real element (Passes)', async ({ page }) => {
    // Step: Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Step: Look for the Add Task button.
    const addButton = page.getByRole('button', { name: 'Add Task' });
    await expect(addButton).toBeVisible();
  });

  // TEST 3: Updated to PASS.
  // We check that the task list container is visible.
  test('Verify task list container (Passes)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const container = page.locator('.task-list-container');
    await expect(container).toBeVisible();
  });

});
