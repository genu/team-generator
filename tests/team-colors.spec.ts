import { test, expect } from "@playwright/test"
import { createFirstLeague, addPlayer, enableTeamColors, getTeamColors } from "./helpers/league.helper"

const setupLeagueWithPlayers = async (page: import("@playwright/test").Page) => {
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 })
  await createFirstLeague(page, "La Liga")
  await page.getByRole("button", { name: "Edit", exact: true }).click()

  await addPlayer(page, "Messi")
  await addPlayer(page, "Ronaldo")
  await addPlayer(page, "Neymar")
  await addPlayer(page, "Mbappe")
}

test.describe("Team Colors", () => {
  test("enables team colors and displays them on shuffled teams", async ({ page }) => {
    await setupLeagueWithPlayers(page)

    // Enable team colors with Black and White (2 teams by default)
    await enableTeamColors(page, ["Black", "White"])
    await page.getByRole("button", { name: "Close" }).click()

    // Shuffle teams
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Verify colors appear on team cards
    const colors = await getTeamColors(page)
    expect(colors).toHaveLength(2)
    expect(colors).toContain("Black")
    expect(colors).toContain("White")
  })

  test("no color badges when team colors is disabled", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await page.getByRole("button", { name: "Close" }).click()

    // Shuffle without enabling team colors
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Verify no color badges
    const colors = await getTeamColors(page)
    expect(colors.every((c) => c === null)).toBe(true)
  })

  test("change a team color via the picker", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await enableTeamColors(page, ["Black", "White"])
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Find the team with "Black" and click its color badge to open picker
    const blackBadge = page.locator('[data-testid="league-team"]').locator("button.cursor-pointer", { hasText: "Black" }).first()
    await blackBadge.click()

    // Select "White" from the picker popover
    const pickerGrid = page.locator(".grid.grid-cols-3")
    await pickerGrid.getByText("White", { exact: true }).click()

    // Verify the team now shows White
    const colors = await getTeamColors(page)
    expect(colors.filter((c) => c === "White")).toHaveLength(2)
    expect(colors.filter((c) => c === "Black")).toHaveLength(0)
  })

  test("color picker shows all available colors after reassignment", async ({ page }) => {
    await setupLeagueWithPlayers(page)

    // Enable 3 teams with 3 colors (enableTeamColors leaves League Options accordion open)
    await enableTeamColors(page, ["Black", "White", "Green"])
    await page.getByRole("region", { name: "League Options" }).getByLabel("Increment").click()
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Change Green team to White
    const greenBadge = page.locator('[data-testid="league-team"]').locator("button.cursor-pointer", { hasText: "Green" }).first()
    await greenBadge.click()
    const pickerGrid = page.locator(".grid.grid-cols-3")
    await pickerGrid.getByText("White", { exact: true }).click()

    // Now open the picker on a White team — all 3 original colors should still be available
    const whiteBadge = page.locator('[data-testid="league-team"]').locator("button.cursor-pointer", { hasText: "White" }).first()
    await whiteBadge.click()

    const pickerOptions = page.locator('[role="dialog"][data-state="open"] .grid.grid-cols-3')
    await expect(pickerOptions.getByText("Black", { exact: true })).toBeVisible()
    await expect(pickerOptions.getByText("White", { exact: true })).toBeVisible()
    await expect(pickerOptions.getByText("Green", { exact: true })).toBeVisible()

    // Close the popover
    await page.keyboard.press("Escape")
  })

  test("color assignments survive opening and closing the edit dialog", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await enableTeamColors(page, ["Black", "White"])
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Change Black team to White (both teams become White)
    const blackBadge = page.locator('[data-testid="league-team"]').locator("button.cursor-pointer", { hasText: "Black" }).first()
    await blackBadge.click()
    const pickerGrid = page.locator(".grid.grid-cols-3")
    await pickerGrid.getByText("White", { exact: true }).click()

    const colorsBefore = await getTeamColors(page)
    expect(colorsBefore.filter((c) => c === "White")).toHaveLength(2)

    // Open edit dialog and close without changes
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.getByRole("button", { name: "Close" }).click()

    // Colors should be preserved
    const colorsAfter = await getTeamColors(page)
    expect(colorsAfter).toEqual(colorsBefore)
  })

  test("color assignments persist after save and page reload", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await enableTeamColors(page, ["Black", "White"])
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Change Black team to White
    const blackBadge = page.locator('[data-testid="league-team"]').locator("button.cursor-pointer", { hasText: "Black" }).first()
    await blackBadge.click()
    const pickerGrid = page.locator(".grid.grid-cols-3")
    await pickerGrid.getByText("White", { exact: true }).click()

    const colorsBefore = await getTeamColors(page)

    // Save
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForLoadState("networkidle")
    await expect(page.getByText("Saved", { exact: true }).first()).toBeVisible()

    // Reload
    await page.reload({ waitUntil: "networkidle" })

    // Verify colors persisted
    const colorsAfter = await getTeamColors(page)
    expect(colorsAfter).toEqual(colorsBefore)
  })

  test("team colors update when league options colors change", async ({ page }) => {
    await setupLeagueWithPlayers(page)
    await enableTeamColors(page, ["Black", "White"])
    await page.getByRole("button", { name: "Close" }).click()

    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    // Verify initial colors
    const initialColors = await getTeamColors(page)
    expect(initialColors).toContain("Black")
    expect(initialColors).toContain("White")

    // Edit league and change available colors to Red and Blue
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.getByRole("button", { name: "League Options" }).click()

    // Open color select and deselect Black/White, select Red/Blue
    const colorSelect = page.getByRole("combobox").last()
    await colorSelect.click()

    await page.getByRole("option", { name: "Black", exact: true }).click()
    await page.getByRole("option", { name: "White", exact: true }).click()
    await page.getByRole("option", { name: "Red", exact: true }).click()
    await page.getByRole("option", { name: "Blue", exact: true }).click()

    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "Close" }).click()

    // Shuffle again with new colors
    await page.getByRole("button", { name: "Shuffle Teams" }).click()
    await expect(page.locator('[data-testid="league-team"]').first()).toBeVisible()

    const newColors = await getTeamColors(page)
    expect(newColors).toContain("Red")
    expect(newColors).toContain("Blue")
    expect(newColors).not.toContain("Black")
    expect(newColors).not.toContain("White")
  })
})
