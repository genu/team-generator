import type { Page } from "playwright"

export const createFirstLeague = async (page: Page, leagueName: string) => {
  await page.getByRole("button", { name: "Setup a league" }).click()
  await page.getByRole("textbox", { name: "League name" }).fill(leagueName)
  await page.getByRole("button", { name: "Create" }).click()
}

export const createLeagueFromMenu = async (page: Page, leagueName: string) => {
  await page.getByTestId("league-dropdown-button").click()
  await page.getByRole("menuitem", { name: "Create new League" }).click()
  await page.getByPlaceholder("League name").click()
  await page.getByPlaceholder("League name").fill(leagueName)
  await page.getByRole("button", { name: "Create" }).click()
}

export const addPlayer = async (page: Page, playerName: string) => {
  await page.getByPlaceholder("Player Name").click()
  await page.getByPlaceholder("Player Name").fill(playerName)
  await page.getByRole("button", { name: "Add Player" }).click()
}

export const getNumberOfLeagues = async (page: Page) => {
  await page.getByTestId("league-dropdown-button").click()
  const leagues = await page.$$(".data-testid-league-dropdown-item")

  return leagues.length
}

export const getNumberOfTeams = async (page: Page) => {
  const teams = await page.$$('[data-testid="league-team"]')

  return teams.length
}

export const enableTeamColors = async (page: Page, colors: string[]) => {
  await page.getByRole("button", { name: "League Options" }).click()
  await page.getByText("Use Team Colors").click()

  // Open the color select dropdown
  const colorSelect = page.getByRole("combobox").last()
  await colorSelect.click()

  // Select each color
  for (const color of colors) {
    await page.getByRole("option", { name: color, exact: true }).click()
  }

  // Close the dropdown
  await page.keyboard.press("Escape")
}

export const getTeamColors = async (page: Page): Promise<(string | null)[]> => {
  const teams = page.locator('[data-testid="league-team"]')
  const count = await teams.count()
  const colors: (string | null)[] = []

  for (let i = 0; i < count; i++) {
    const colorButton = teams.nth(i).locator(".absolute.right-1.top-1 button.cursor-pointer")
    if (await colorButton.isVisible().catch(() => false)) {
      colors.push((await colorButton.textContent())?.trim() ?? null)
    } else {
      colors.push(null)
    }
  }

  return colors
}
