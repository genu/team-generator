import { defineConfig, devices } from "@playwright/test"
import type { ConfigOptions } from "@nuxt/test-utils/playwright"
import { isCI } from "std-env"

const devicesToTest = ["Desktop Chrome", "Desktop Safari"] satisfies Array<string | (typeof devices)[string]>

export default defineConfig<ConfigOptions>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: 4,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: devicesToTest.map((p) => (typeof p === "string" ? { name: p, use: devices[p] } : p)),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm test:ci",
    url: "http://localhost:3001",
    reuseExistingServer: !isCI,
    timeout: 300000, // 5 minutes
  },
})
