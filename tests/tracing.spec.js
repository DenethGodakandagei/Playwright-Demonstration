const { test, expect } = require('@playwright/test');

/**
 * TEST SUITE: TRACE VIEWER DEBUGGING
 * Performs a sequence of actions before an intentional failure to demonstrate
 * the action history, snapshots, and source flagging in Playwright Trace Viewer.
 */

test('Debug task creation flow', async ({ page }) => {
  // STEP 1: Navigate to the application.
  // In the Trace Viewer, this will be the first event on your timeline.
  await page.goto('http://localhost:3000');

  // STEP 2: Interact with the UI.
  // We'll fill the input field. The Trace Viewer will record a snapshot 
  // "Before" and "After" this specific action.
  const input = page.locator('input[placeholder="Enter a new task..."]');
  await input.fill('Demo Task for Trace');

  // STEP 3: Click the 'Add Task' button.
  // Demonstration Point: In the Trace Viewer, you can see the red dot 
  // where the mouse clicked on the button.
  await page.click('button:has-text("Add Task")');

  // STEP 4: Assert Success.
  // We check that the task we just added is present in the list.
  // This will now PASS 100%.
  await expect(page.locator(`text=Demo Task for Trace`)).toBeVisible({ timeout: 5000 });
});
