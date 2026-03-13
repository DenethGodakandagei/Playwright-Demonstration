import { test, expect } from '@playwright/test';

test.describe('Mocking and Stubbing Tests', () => {

  test('mocks an API response (Network Interception)', async ({ page }) => {
    // 1. Setup the Mock (Stub)
    // Intercept any GET request matching the URL pattern '**/api/v1/fruits'
    await page.route('**/api/v1/fruits', async route => {
      // Provide a custom JSON response instead of letting the request go to the real server
      const mockedResponse = [
        { name: 'Mocked Strawberry', id: 21 },
        { name: 'Mocked Apple', id: 22 }
      ];
      
      // Fulfill the route with our fake data
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedResponse)
      });
    });

    // 2. Trigger the Request
    // Go to a page that fetches and displays the fruits.
    // The page will receive our mocked data instead of real data.
    await page.goto('https://demo.playwright.dev/api-mocking');

    // 3. Assert on the Mocked Data
    // Verify that the UI correctly displays the fake data we provided
    await expect(page.getByText('Mocked Strawberry')).toBeVisible();
    await expect(page.getByText('Mocked Apple')).toBeVisible();
  });

  test('stubs (aborts) image requests to speed up testing', async ({ page }) => {
    // Intercept all image requests using a regex pattern
    await page.route('**/*.{png,jpg,jpeg,svg}', async route => {
      // Abort the request, meaning the images will never load
      await route.abort();
    });

    // Go to any website with images
    await page.goto('https://demo.playwright.dev');

    // The page loads faster because no images were downloaded!
  });

});
