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

  // 1. THE STRATEGY 3 GLOBAL SETUP ENGINE (Runs strictly for Strategy 3) 
   {
      name : 'setup', 
      testMatch : /auth\.setup\.ts/,
      testIgnore: /.*\.spec\.ts/, // Ignore all feature specs
    }, 

    // ENVIRONMENT A: PURE FIXTURE RUNS (Strategy 2)
    // These run immediately without triggering the global setup script!
    {
      name: 'strategy2-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /strategy-2-fixtures\.spec\.ts/, // Only look inside Strategy 2 folder
      // Notice: NO dependencies array here! It bypasses the setup phase entirely.
    },

    //  ENVIRONMENT B: GLOBAL PIPELINE RUNS (Strategy 3)
    // These are tightly bound to wait for the setup project to run first! 
    {
      name: 'strategy3-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch : /strategy-3-fixglobal\.spec\.ts/, 
      dependencies: ['setup'],        // ◄── WAIT for setup to finish before starting!
      testIgnore: /auth\.setup\.ts/,  // ◄── IGNORE the setup script so it doesn't run as a normal test
    },

    // ENVIRONMENT C: LUDICROUS SPEED API SUITES (Strategy 4)
    {
      name: 'strategy4-api',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /strategy-4-api\.spec\.ts/, 
      testIgnore: /auth\.setup\.ts/,
    }
  ]
    
});
