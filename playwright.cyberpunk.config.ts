import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "cyberpunk.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:8124",
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build:cyberpunk && npm run dev:cyberpunk",
    url: "http://127.0.0.1:8124/cyberpunk/",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
