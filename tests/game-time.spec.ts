import { test, expect } from "@playwright/test"
import { createFirstLeague, addPlayer, setGameTime } from "./helpers/league.helper"

const setupLeagueWithPlayers = async (page: import("@playwright/test").Page) => {
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
  await createFirstLeague(page, "Sunday League")
  await page.getByRole("button", { name: "Edit", exact: true }).click()

  await addPlayer(page, "Messi")
  await addPlayer(page, "Ronaldo")
  await addPlayer(page, "Neymar")
  await addPlayer(page, "Mbappe")
}

test.describe("Game Time", () => {
  test("no game time is displayed when none is set", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await page.getByRole("button", { name: "Close" }).click()

    await expect(page.getByTestId("league-game-time")).toBeHidden()
  })

  test("a league without a game time saves and reloads without one", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Saved", { exact: true }).first()).toBeVisible()

    await page.reload({ waitUntil: "networkidle" })

    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()
    await expect(page.getByTestId("league-game-time")).toBeHidden()
  })

  test("displays the game time above the teams", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await setGameTime(page, "18:30")
    await page.getByRole("button", { name: "Close" }).click()

    await expect(page.getByTestId("league-game-time")).toHaveText(/6:30 PM/)

    // Still visible once the teams are generated, so it is captured in a screenshot
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()
    await expect(page.getByTestId("league-game-time")).toHaveText(/6:30 PM/)
  })

  test("game time persists after save and page reload", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await setGameTime(page, "09:15")
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForLoadState("networkidle")
    await expect(page.getByText("Saved", { exact: true }).first()).toBeVisible()

    await page.reload({ waitUntil: "networkidle" })

    await expect(page.getByTestId("league-game-time")).toHaveText(/9:15 AM/)

    // The saved time is loaded back into the edit form
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.getByRole("button", { name: "League Options" }).click()
    await expect(page.getByTestId("league-game-time-input")).toHaveValue("09:15")
  })

  test("game time can be cleared", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await setGameTime(page, "20:00")
    await page.getByRole("button", { name: "Close" }).click()
    await expect(page.getByTestId("league-game-time")).toHaveText(/8:00 PM/)

    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await setGameTime(page, "")
    await page.getByRole("button", { name: "Close" }).click()

    await expect(page.getByTestId("league-game-time")).toBeHidden()

    // ...and stays cleared once saved
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Saved", { exact: true }).first()).toBeVisible()

    await page.reload({ waitUntil: "networkidle" })

    await expect(page.getByTestId("league-game-time")).toBeHidden()
  })
})
