import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout : 30 *1000, 
  expect : {
    timeout : 5000
  }, 
  /* Run tests in files in parallel */
  fullyParallel: true,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://uat.carecoordinations.com/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot : 'only-on-failure',
    video : 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [

    // 1. THE CORE SETUP STEP (Strategy 3 Blueprint)
    {
      name : 'setup', 
      testMatch : /auth\.setup\.ts/,
    }, 

    // CROSS BROWSER EXECUTION 

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],        // ◄── WAIT for setup to finish before starting!
      testIgnore: /auth\.setup\.ts/,  // ◄── IGNORE the setup script so it doesn't run as a normal test
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies : ['setup'],     // ◄── WAIT for setup to finish before starting!
      testIgnore : /auth\.setup\.ts/,  // ◄── IGNORE the setup script so it doesn't run as a normal test
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies : ['setup'],  // ◄── WAIT for setup to finish before starting!
      testIgnore : /auth\.setup\.ts/,  // ◄── IGNORE the setup script so it doesn't run as a normal test
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
