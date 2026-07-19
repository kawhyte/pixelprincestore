import { defineConfig, devices } from "@playwright/test";

const VIEWPORT_MATRIX = /viewport-matrix\.spec\.ts/;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // Existing functional specs — default desktop viewport.
    {
      name: "e2e",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: VIEWPORT_MATRIX,
    },
    // Permanent mobile regression guard — one suite, three viewports.
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
      testMatch: VIEWPORT_MATRIX,
    },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
      testMatch: VIEWPORT_MATRIX,
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testMatch: VIEWPORT_MATRIX,
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
