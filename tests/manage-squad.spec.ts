import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import { createFirstLeague, addPlayer } from './helpers/league.helper'

test.describe('Managing Squad', () => {
  test.beforeAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))
  test.afterAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))

  test('Add a player', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    await page.getByTestId('squad-edit-button').click()
    await addPlayer(page, 'Lionel Messi')

    let players = await page.$$('table.table-player-list tbody tr')
    await expect(players).toHaveLength(1)

    await addPlayer(page, 'Cristiano Ronaldo')
    players = await page.$$('table.table-player-list tbody tr')
    await expect(players).toHaveLength(2)
  })

  test('Update league name', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')
    await page.getByTestId('squad-edit-button').click()

    await page.getByTestId('edit-team-name-input').click()
    await page.getByTestId('edit-team-name-input').fill('updated')

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

    await page.getByTestId('squad-edit-button').click()

    await page.getByTestId('league-shuffle').click()

    let teams = await page.$$('[data-testid="league-team"]')
    await expect(teams).toHaveLength(2)

    // Update team number to 3
    await page.getByTestId('squad-edit-button').click()
    await page.getByTestId('edit-team-count-input').fill('3')
    await page.getByTestId('squad-edit-button').click()
    await page.getByTestId('league-shuffle').click()

    teams = await page.$$('[data-testid="league-team"]')
    await expect(teams).toHaveLength(3)
  })
})
