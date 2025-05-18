import type { Page } from 'playwright'

export const createFirstLeague = async (page: Page, leagueName: string) => {
  await page.getByRole('button', { name: 'Setup a league' }).click()
  await page.getByRole('textbox', { name: 'League name' }).fill(leagueName)
  await page.getByRole('button', { name: 'Create' }).click()
}

export const createLeagueFromMenu = async (page: Page, leagueName: string) => {
  await page.getByTestId('league-dropdown-button').click()
  await page.getByRole('menuitem', { name: 'Create new League' }).click()
  await page.getByPlaceholder('League name').click()
  await page.getByPlaceholder('League name').fill(leagueName)
  await page.getByRole('button', { name: 'Create' }).click()
}

export const addPlayer = async (page: Page, playerName: string) => {
  await page.getByPlaceholder('Player Name').click()
  await page.getByPlaceholder('Player Name').fill(playerName)
  await page.getByRole('button', { name: 'Add Player' }).click()
}

export const getNumberOfLeagues = async (page: Page) => {
  await page.getByTestId('league-dropdown-button').click()
  const leagues = await page.$$('.data-testid-league-dropdown-item')

  return leagues.length
}

export const getNumberOfTeams = async (page: Page) => {
  const teams = await page.$$('[data-testid="league-team"]')

  return teams.length
}
