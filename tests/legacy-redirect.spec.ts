import { test, expect } from "@playwright/test"
import { createFirstLeague } from "./helpers/league.helper"

test.describe("Legacy redirect", () => {
  test("redirects legacy account URL to /account/:id", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
    await createFirstLeague(page, "La Liga")
    await page.waitForURL(/\/account\//)

    // Extract account ID from current URL (e.g., /account/{accountId}?league=1)
    const url = new URL(page.url())
    const accountId = url.pathname.split("/account/")[1]

    // Navigate to legacy URL format (just /{accountId} at root)
    await page.goto(`/${accountId}`, { waitUntil: "networkidle" })

    // Should redirect to /account/{accountId}
    expect(page.url()).toContain(`/account/${accountId}`)
  })

  test("preserves query parameters during redirect", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
    await createFirstLeague(page, "La Liga")
    await page.waitForURL(/\/account\//)

    const url = new URL(page.url())
    const accountId = url.pathname.split("/account/")[1]
    const leagueParam = url.searchParams.get("league")

    // Navigate to legacy URL with query params
    await page.goto(`/${accountId}?league=${leagueParam}`, { waitUntil: "networkidle" })

    // Should redirect and preserve query params
    const redirectedUrl = new URL(page.url())
    expect(redirectedUrl.pathname).toBe(`/account/${accountId}`)
    expect(redirectedUrl.searchParams.get("league")).toBe(leagueParam)
  })

  test("does not redirect /account/ URLs", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
    await createFirstLeague(page, "La Liga")
    await page.waitForURL(/\/account\//)

    const url = new URL(page.url())
    const fullPath = url.pathname + url.search

    // Navigate to the proper /account/ URL directly
    await page.goto(fullPath, { waitUntil: "networkidle" })

    // Should stay on the same URL (no double redirect)
    expect(page.url()).toContain(fullPath)
  })
})
