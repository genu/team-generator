import { execSync } from 'child_process'
import { test, expect } from '@playwright/test'
import { createFirstLeague, addPlayer, getNumberOfLeagues, getNumberOfTeams } from './helpers/league.helper'

test.describe('Managing Squad', () => {
  test.beforeAll(async () => execSync('bun dotenv -e .env.test -- bun prisma migrate reset --force'))
  test.afterAll(async () => execSync('bun dotenv -e .env.test -- bun prisma migrate reset --force'))

  test('Add a player', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    await page.getByRole('button', { name: 'Edit' }).click()
    await addPlayer(page, 'Lionel Messi')

    const players = await page.getByTestId('table-player-list').locator('tbody tr')
    expect(players).toHaveCount(1)

    await addPlayer(page, 'Cristiano Ronaldo')
    const updatedPlayers = await page.getByTestId('table-player-list').locator('tbody tr')
    expect(updatedPlayers).toHaveCount(2)
  })

  test('Update league name', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByRole('button', { name: 'League Options' }).click()
    await page.getByRole('textbox', { name: 'League Name' }).fill('updated')
    await page.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('updated')
    await expect(await getNumberOfLeagues(page)).toBe(1)
  })

  test('Update number of teams', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')
    await page.getByRole('button', { name: 'Edit' }).click()

    // Add 4 players
    await addPlayer(page, 'Lionel Messi')
    await addPlayer(page, 'Cristiano Ronaldo')
    await addPlayer(page, 'Neymar')
    await addPlayer(page, 'Kylian Mbappe')

    await page.getByRole('button', { name: 'Close' }).click()
    await page.getByRole('button', { name: 'Shuffle Teams' }).click()

    await expect(await getNumberOfTeams(page)).toBe(2)

    // Update team number to 3
    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByRole('button', { name: 'League Options' }).click()
    await page.getByRole('spinbutton', { name: '# of Teams:' }).fill('3')
    await page.getByRole('button', { name: 'Close' }).click()
    await page.getByRole('button', { name: 'Shuffle Teams' }).click()

    await expect(await getNumberOfTeams(page)).toBe(3)
  })
})
