import { defineConfig, devices } from "@playwright/test"

const devicesToTest = ["Desktop Chrome", "Desktop Safari"] as const

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tests/results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["html", { open: "never", outputFolder: "./tests/report" }], ["github"], ["list"]]
    : [["html", { open: "never", outputFolder: "./tests/report" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 10_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: devicesToTest.map((name) => ({
    name,
    use: devices[name],
  })),
  webServer: {
    command: process.env.CI
      ? "pnpm test:db:reset && pnpm test:preview"
      : "pnpm test:db:reset && pnpm test:build && pnpm test:preview",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // 5 minutes
    stdout: process.env.CI ? "pipe" : "ignore",
    stderr: process.env.CI ? "ignore" : "pipe",
  },
})
