// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    // Directory where your test files are located
    testDir: './tests',

    // Run tests in parallel
    fullyParallel: true,

    // Retry failed tests once on CI
    retries: 0,

    // Reporter to use
    reporter: 'list',

    use: {
        // Base URL for all page.goto() calls
        baseURL: 'http://localhost:3001',

        // Collect traces when a test fails (great for debugging)
        trace: 'on-first-retry',

        // Take screenshot automatically on failure
        screenshot: 'only-on-failure',
    },

    // Run tests only in Chromium for the demo
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
