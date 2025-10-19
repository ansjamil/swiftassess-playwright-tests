import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const stage = process.env.STAGE ?? 'prod';
const baseURL =
  stage === 'stg'
    ? (process.env.BASE_URL_STG ?? 'https://app-stg.swiftassess.com')
    : (process.env.BASE_URL_PROD ?? 'https://app.swiftassess.com');

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
  baseURL,
  headless: process.env.HEADLESS ? process.env.HEADLESS !== '0' : false, // 👈 headed by default
  launchOptions: {
    slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 200          // 👈 slight slowdown
  },
  trace: 'on-first-retry',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure'
},

  projects: [
    // ✅ Only desktop browser tests
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  workers: process.env.CI ? 4 : undefined
});
