import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// Force Node.js to load all environment variables into process.env globally
dotenv.config();

const apiBaseUrl = process.env.API_URL || "http://localhost:3000";
const uiBaseUrl = process.env.UI_URL || "http://localhost:3000";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Path template for snapshot files. Centralizes all visual baselines into a single directory. */
  snapshotPathTemplate: "{testDir}/snapshots/{arg}-{projectName}-{platform}{ext}",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: process.env.BASE_URL || "https://www.saucedemo.com",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  /* Configure projects for major browsers and API isolation */
  projects: [
    {
      name: "api-tests",
      testDir: "./tests/api",
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: apiBaseUrl,
        storageState: { cookies: [], origins: [] },
      },
    },

    {
      name: "ui-tests-chrome",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: uiBaseUrl,
        storageState: { cookies: [], origins: [] },
      },
    },

    {
      name: "ui-tests-firefox",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
        baseURL: uiBaseUrl,
        storageState: { cookies: [], origins: [] },
      },
    },

    {
      name: "ui-tests-webkit",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        baseURL: uiBaseUrl,
        storageState: { cookies: [], origins: [] },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
