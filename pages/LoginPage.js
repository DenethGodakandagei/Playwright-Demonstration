// FILE: pages/LoginPage.js
// Page Object for Login Page
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.locator('input[placeholder="Username"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorMessage  = page.locator('.error-message');
  }

  // Navigate to the login page
  async goto() {
    // Go to the login URL
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Wait for inputs to appear (with longer timeout for slow loading)
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
  }

  // Perform login action
  async login(username, password) {
    // Make sure inputs are visible before filling
    await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 5000 });

    // Fill inputs
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // Click login button
    await this.loginButton.click();
  }

  // Check if error message is visible
  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }
}