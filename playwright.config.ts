
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['./reporters/CustomHtmlReporter.ts'],
  ],

  use: {
    baseURL:
      process.env.PARABANK_BASE_URL ??
      'https://parabank.parasoft.com/parabank',

    ...devices['Desktop Chrome'],

    headless: false, // Run browser in non-headless mode
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
