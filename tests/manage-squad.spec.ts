import { test, expect } from "@playwright/test"
import { createFirstLeague, addPlayer, getNumberOfLeagues, getNumberOfTeams } from "./helpers/league.helper"

test.describe("Managing Squad", () => {
  test.beforeEach(async ({ page }) => {
    // Create a league
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
    await createFirstLeague(page, "La Liga")
  })

  test("Add a player", async ({ page }) => {
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await addPlayer(page, "Lionel Messi")

    const players = await page.getByTestId("table-player-list").locator("tbody tr")
    expect(players).toHaveCount(1)

    await addPlayer(page, "Cristiano Ronaldo")

    // Wait for the table to have exactly 2 rows - more reliable across browsers
    await expect(page.getByTestId("table-player-list").locator("tbody tr")).toHaveCount(2, { timeout: 10000 })
  })

  test("Update league name", async ({ page }) => {
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.getByRole("button", { name: "League Options" }).click()
    await page.getByRole("textbox", { name: "League Name" }).fill("updated")
    await page.getByRole("button", { name: "Close" }).click()

    await expect(page.getByTestId("league-dropdown-button")).toContainText("updated")
    await expect(await getNumberOfLeagues(page)).toBe(1)
  })

  test("Update number of teams", async ({ page }) => {
    await page.getByRole("button", { name: "Edit", exact: true }).click()

    // Add 4 players
    await addPlayer(page, "Lionel Messi")
    await addPlayer(page, "Cristiano Ronaldo")
    await addPlayer(page, "Neymar")
    await addPlayer(page, "Kylian Mbappe")

    await page.getByRole("button", { name: "Close" }).click()
    await page.getByRole("button", { name: "Shuffle Teams" }).click()

    await expect(await getNumberOfTeams(page)).toBe(2)

    // Update team number to 3
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.getByRole("button", { name: "League Options" }).click()
    await page.getByRole("region", { name: "League Options" }).getByLabel("Increment").click()
    await page.getByRole("button", { name: "Close" }).click()
    await page.getByRole("button", { name: "Shuffle Teams" }).click()

    await expect(await getNumberOfTeams(page)).toBe(3)
  })

  test("shows latest snapshot after shuffle, save, and refresh", async ({ page }) => {
    // Add players
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await addPlayer(page, "Player 1")
    await addPlayer(page, "Player 2")
    await addPlayer(page, "Player 3")
    await addPlayer(page, "Player 4")
    await page.getByRole("button", { name: "Close" }).click()

    // Shuffle and save
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    // Capture the team arrangement after shuffle
    const teamsBefore = await page.$$eval('[data-testid="league-team"]', (teams) => teams.map((team) => team.textContent))
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForLoadState("networkidle")

    // Wait for save to complete (toast notification appears)
    await expect(page.getByText("Saved", { exact: true })).toBeVisible()

    // Refresh
    await page.reload({ waitUntil: "networkidle" })

    // Assert the team arrangement matches what was saved
    const teamsAfter = await page.$$eval('[data-testid="league-team"]', (teams) => teams.map((team) => team.textContent))
    expect(teamsAfter).toEqual(teamsBefore)
  })

  test("shows latest snapshot after multiple shuffles and saves", async ({ page }) => {
    // Add players
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await addPlayer(page, "Player 1")
    await addPlayer(page, "Player 2")
    await addPlayer(page, "Player 3")
    await addPlayer(page, "Player 4")
    await page.getByRole("button", { name: "Close" }).click()

    // Shuffle and save (first)
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    const teamsFirst = await page.$$eval('[data-testid="league-team"]', (teams) => teams.map((team) => team.textContent))
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForLoadState("networkidle")

    // Wait for first save to complete
    await expect(page.getByText("Saved", { exact: true })).toBeVisible()

    // Shuffle and save (second)
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    const teamsSecond = await page.$$eval('[data-testid="league-team"]', (teams) => teams.map((team) => team.textContent))
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForLoadState("networkidle")

    // Wait for second save to complete
    await expect(page.getByText("Saved", { exact: true })).toBeVisible()

    // Refresh
    await page.reload({ waitUntil: "networkidle" })

    // Assert the team arrangement matches the second shuffle (latest)
    const teamsAfter = await page.$$eval('[data-testid="league-team"]', (teams) => teams.map((team) => team.textContent))
    expect(teamsAfter).toEqual(teamsSecond)
    expect(teamsAfter).not.toEqual(teamsFirst)
  })
})
