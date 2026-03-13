import { test, expect } from '@playwright/test';

test.describe('Mocking and Stubbing Tests - Task Manager App', () => {

  test('mocks GET /api/tasks to return fake initial tasks', async ({ page }) => {
    // 1. Setup the Mock (Stub)
    // Intercept GET requests to the backend tasks API
    await page.route('**/api/tasks', async route => {
      if (route.request().method() === 'GET') {
        // Provide a custom JSON response with fake database items
        const mockedResponse = [
          { _id: '1', text: 'Mocked Task 1 - Learn Playwright' },
          { _id: '2', text: 'Mocked Task 2 - Implement Mocking' }
        ];
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockedResponse)
        });
      } else {
        await route.continue();
      }
    });

    // 2. Trigger the Request
    // Go to the main page (the app fetches /api/tasks on load)
    await page.goto('/');

    // 3. Assert on the Mocked Data
    // Verify that our mocked data successfully appears on the page
    await expect(page.locator('.task-item').nth(0)).toContainText('Mocked Task 1 - Learn Playwright');
    await expect(page.locator('.task-item').nth(1)).toContainText('Mocked Task 2 - Implement Mocking');
    
    // Check that the task count says "2 tasks total"
    await expect(page.getByText('2 tasks total')).toBeVisible();
  });

  test('mocks POST /api/tasks to test task addition without touching the real DB', async ({ page }) => {
    // First, mock the initial GET request to return an empty generic list
    await page.route('**/api/tasks', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } 
      else if (route.request().method() === 'POST') {
        // Extract the task text sent by the frontend
        const postData = JSON.parse(route.request().postData() || '{}');
        
        // Mock a successful 201 Created response
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ _id: '999', text: postData.text })
        });
      } else {
        await route.continue(); // Let other requests pass through
      }
    });

    await page.goto('/');

    // We should see no tasks initially
    await expect(page.getByText('No tasks yet')).toBeVisible();

    // Type and submit a new task
    await page.getByPlaceholder('Enter a new task...').fill('Fake Task via Mocked POST');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the UI updates correctly with the mocked POST data without actually hitting the database
    await expect(page.locator('.task-item').first()).toContainText('Fake Task via Mocked POST');
  });

  test('mocks an API error to safely test the frontend error banner UI', async ({ page }) => {
    // Force the API to fail immediately with a 500 status code
    await page.route('**/api/tasks', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Simulated Internal Server Error" }) // Though App.js might ignore the message body and throw "Server Error!"
      });
    });

    await page.goto('/');

    // Verify that the error banner appears appropriately
    const errorBanner = page.locator('.error-banner');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText('Server Error!');
  });
});
