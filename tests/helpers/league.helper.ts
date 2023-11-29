import type { Page } from 'playwright'

export const createFirstLeague = async (page: Page, leagueName: string) => {
  await page.getByTestId('btn-setup-league').click()
  await page.getByPlaceholder('League name').click()
  await page.getByPlaceholder('League name').fill(leagueName)
  await page.getByRole('button', { name: 'Add League' }).click()
}

export const createLeagueFromMenu = async (page: Page, leagueName: string) => {
  await page.getByTestId('league-dropdown-button').click()
  await page.getByRole('menuitem', { name: 'Create new League' }).click()
  await page.getByPlaceholder('League name').click()
  await page.getByPlaceholder('League name').fill(leagueName)
  await page.getByRole('button', { name: 'Add League' }).click()
}
