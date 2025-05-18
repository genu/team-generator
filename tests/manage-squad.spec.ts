import { execSync } from 'child_process'
import { test, expect } from '@playwright/test'
import { createFirstLeague, addPlayer } from './helpers/league.helper'

test.describe('Managing Squad', () => {
  test.beforeAll(async () => execSync('bun dotenv -e .env.test -- bun prisma migrate reset --force'))
  test.afterAll(async () => execSync('bun dotenv -e .env.test -- bun prisma migrate reset --force'))

  test('Add a player', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    await page.getByTestId('squad-edit-button').click()
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
    await page.getByTestId('squad-edit-button').click()

    await page.getByTestId('edit-team-name-input').click()
    await page.getByTestId('edit-team-name-input').fill('updated')
    await page.locator('.data-testid-edit-close-button').click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('updated')
  })

  test('Update number of teams', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')
    await page.getByTestId('squad-edit-button').click()

    // Add 4 players
    await addPlayer(page, 'Lionel Messi')
    await addPlayer(page, 'Cristiano Ronaldo')
    await addPlayer(page, 'Neymar')
    await addPlayer(page, 'Kylian Mbappe')

    await page.locator('.data-testid-edit-close-button').click()

    await page.getByTestId('league-shuffle').click()

    let teams = await page.$$('[data-testid="league-team"]')
    await expect(teams).toHaveLength(2)

    // Update team number to 3
    await page.getByTestId('squad-edit-button').click()
    await page.getByRole('spinbutton', { name: '# of Teams:' }).fill('3')
    await page.getByRole('button', { name: 'Close' }).click()
    await page.getByTestId('league-shuffle').click()

    teams = await page.$$('[data-testid="league-team"]')
    await expect(teams).toHaveLength(3)
  })
})
