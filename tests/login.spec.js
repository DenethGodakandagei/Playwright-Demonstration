import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {

  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open login page
    await loginPage.goto();

    // Perform login
    await loginPage.login('admin', 'password123');

    // Verify dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('failed login shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open login page
    await loginPage.goto();

    // Login with wrong credentials
    await loginPage.login('wrong', 'wrong');

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
  });

});