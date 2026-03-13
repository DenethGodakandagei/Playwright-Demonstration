import { test, expect } from '@playwright/test';

const API_URL = 'http://127.0.0.1:5000/api/tasks';
const APP_URL = 'http://127.0.0.1:3000';

//Test 1
test('API - get task list returns 200 status', async ({ request }) => {

// 1. Send an actual request to the backend
  const response = await request.get(API_URL);

  // 2. Validation (The "Test" part)
  expect(response.status()).toBe(200);

  const body = await response.json();

  // 3. Ensuring the database integration works
  expect(Array.isArray(body)).toBeTruthy();

  console.log(`API returned ${body.length} tasks`);

});


//Test 2
test('app shows tasks from Stubbed data API response', async ({ page }) => {

  // 1. THE STUB: Intercept the network call
  await page.route('**/api/tasks', async (route) => {
    // 2. THE FULFILL: Return fake (mocked) data instead of hitting the server
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: "1", text: 'Mocked Task A' },
        { _id: "2", text: 'Mocked Task B' }
      ])
    });
  });

  // 3. Trigger the UI to make the call
  await page.goto(APP_URL);

  // 4. Verify the UI displays the STUBBED data
  await expect(page.getByText('Mocked Task A')).toBeVisible({ timeout: 10000 });

});