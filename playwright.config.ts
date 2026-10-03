import { defineConfig } from "@playwright/test";

// End-to-end tests drive a real browser against the whole stack (web, API, worker, Postgres, Redis) with a fake AI service,
// so they cost nothing and need no keys. `npm run e2e` starts the stack itself (e2e/stack.mjs).
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    // Locally the Chrome you already have is used; CI installs Playwright's own Chromium.
    channel: process.env.CI ? undefined : "chrome",
  },
  webServer: {
    command: "node e2e/stack.mjs",
    url: "http://localhost:3100/login",
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
