const { test, expect } = require('@playwright/test');

/**
 * TEST SUITE: TRACE VIEWER DEBUGGING
 * Performs a sequence of actions before an intentional failure to demonstrate
 * the action history, snapshots, and source flagging in Playwright Trace Viewer.
 */

test('Debug task creation flow', async ({ page }) => {
  // STEP 1: Navigate to the application.
  await page.goto('http://localhost:3000');

  // STEP 2: Interact with the UI.
  const input = page.locator('input[placeholder="Enter a new task..."]');
  await input.fill('Demo Task for Trace');

  // STEP 3: Click the 'Add Task' button.
  await page.click('button:has-text("Add Task")');

  // STEP 4: Assert Success.
  // FIX: Added .last() to handle cases where multiple tasks with the same name exist.
  // This ensures we point to a single, specific element to satisfy strict mode.
  const newTask = page.locator('text=Demo Task for Trace').last();
  
  await expect(newTask).toBeVisible({ timeout: 5000 });
});