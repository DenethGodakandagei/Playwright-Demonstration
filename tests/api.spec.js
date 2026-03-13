import { test, expect } from '@playwright/test';

const API_URL = 'http://127.0.0.1:5000/api/tasks';
const APP_URL = 'http://127.0.0.1:3000';

//Test 1
test('API - get task list returns 200 status', async ({ request }) => {

  const response = await request.get(API_URL);

  // verify status
  expect(response.status()).toBe(200);

  const body = await response.json();

  // body should be array from MongoDB
  expect(Array.isArray(body)).toBeTruthy();

  console.log(`API returned ${body.length} tasks`);

});


//Test 2
test('app shows tasks from mocked API response', async ({ page }) => {

  // intercept API request
  await page.route('**/api/tasks', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: "1", text: 'Mocked Task A' },
        { _id: "2", text: 'Mocked Task B' }
      ])
    });
  });

  await page.goto(APP_URL);

  // verify mocked data appears
  await expect(page.getByText('Mocked Task A')).toBeVisible({ timeout: 10000 });

});