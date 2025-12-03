import { test, expect } from "@playwright/test"
import { createFirstLeague, createLeagueFromMenu, getNumberOfLeagues } from "./helpers/league.helper"

test.describe("Managing leagues", () => {
  test.beforeEach(async ({ page }) => {
    // Create a league
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
    await createFirstLeague(page, "La Liga")
  })

  test("creating first league", async ({ page }) => {
    // await expect
    await expect(await page.getByTestId("league-dropdown-button")).toContainText("La Liga")
  })

  test("duplicate a league", async ({ page }) => {
    // Duplicate the league
    await page.getByTestId("league-dropdown-button").click()
    await page.getByRole("menuitem", { name: "Duplicate League" }).click()

    // Verify the duplicated league is now selected
    await expect(await page.getByTestId("league-dropdown-button")).toContainText("La Liga (copy)")

    // Verify we now have 2 leagues in the dropdown
    await expect(await getNumberOfLeagues(page)).toBe(2)

    // Verify both leagues are present in the dropdown
    const originalLeague = page.locator(".data-testid-league-dropdown-item").filter({ hasText: "La Liga" }).first()
    const duplicatedLeague = page.locator(".data-testid-league-dropdown-item").filter({ hasText: "La Liga (copy)" })

    await expect(originalLeague).toBeVisible()
    await expect(duplicatedLeague).toBeVisible()
  })

  test("creating a new league from menu", async ({ page }) => {
    // Create league 2
    await createLeagueFromMenu(page, "Premier League")
    await expect(page.getByTestId("league-dropdown-button")).toContainText("Premier League")

    // Open the league menu
    await expect(await getNumberOfLeagues(page)).toBe(2)
  })

  test.describe("deleting leagues", () => {
    test("should auto select the next available league", async ({ page }) => {
      // Create a second league
      await createLeagueFromMenu(page, "Premier League")
      await expect(page.getByTestId("league-dropdown-button")).toContainText("Premier League")

      // Verify we have 2 leagues
      await expect(await getNumberOfLeagues(page)).toBe(2)

      // Delete the current league (Premier League)
      await page.getByRole("menuitem", { name: "Delete this league" }).click()
      await page.getByRole("button", { name: "Yes" }).click()

      // Should automatically select the remaining league (La Liga)
      await expect(page.getByTestId("league-dropdown-button")).toContainText("La Liga")
      await expect(await getNumberOfLeagues(page)).toBe(1)
    })

    test("should prevent deleting the last league", async ({ page }) => {
      // There's only one league (La Liga) from beforeEach
      await page.getByTestId("league-dropdown-button").click()

      // The delete option should be disabled or not available
      const deleteMenuItem = page.getByRole("menuitem", { name: "Delete this league" })
      await expect(deleteMenuItem).toBeDisabled()
    })
  })
})
