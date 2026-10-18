import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { baseUrl, storageStatePath } from './helpers/common/env';

// env.ts reads process.env lazily, so loading .env here is early enough.
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * FlowSky QA Automation - single Playwright configuration.
 * - Base URL: BASE_URL (legacy alias LOAN_PRODUCT_APP_URL), default AWS staging. See helpers/common/env.ts.
 * - Authentication: fixtures/global-setup.ts provides one session for every project (see README).
 * - workers: 1 because Edit specs mutate one controlled record (EDIT_PRODUCT_ID). Do not raise it for Edit runs.
 *
 * Projects:
 * - lpc-chromium: Add/Edit wizard suite (FLOW-LPC-*), Chromium at 1920x1080 as originally configured.
 * - chromium / firefox / webkit: step suites migrated from Flow (FS-TC-*, FR-NEW-*, FR-MC-*, LS-NEW-*). Their helpers
 *   check testInfo.project.name === 'chromium' for clipboard cases, so those names must not change.
 */
const LPC_DIR = './tests/ui/loan-product-configuration';
const stepSuites = {
  testDir: LPC_DIR,
  grep: /\b(?:FS-TC-\d+|FR-NEW-\d+|FR-MC-\d+|LS-NEW-\d+)\b/,
  // Original Flow settings: Playwright default test/expect timeouts, no action timeout.
  timeout: 30_000,
  expect: { timeout: 5_000 },
};

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  globalSetup: require.resolve('./fixtures/global-setup'),
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/loan-product-configuration/execution/html-report', open: 'never' }],
    ['json', { outputFile: './reports/loan-product-configuration/execution/results.json' }],
  ],
  use: {
    baseURL: baseUrl(),
    storageState: storageStatePath(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'lpc-chromium',
      testDir: LPC_DIR,
      testMatch: '**/*.spec.ts',
      grep: /\bFLOW-LPC-(?:ADD|EDIT)-(?:\d{3}|S\d{2}[A-Z]?-\d{3})\b/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
      },
    },
    { name: 'chromium', ...stepSuites, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', ...stepSuites, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', ...stepSuites, use: { ...devices['Desktop Safari'] } },
  ],
});
