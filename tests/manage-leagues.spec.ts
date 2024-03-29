import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import { createFirstLeague, createLeagueFromMenu } from './helpers/league.helper'

test.describe('Managing leagues', () => {
  test.beforeAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))
  test.afterAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))

  test('creating first league', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    // await expect
    await expect(page.getByTestId('league-dropdown-button')).toContainText('La Liga')
  })

  test('deleting a league', async ({ page }) => {
    // Create a league
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    // Delete the league
    await page.getByTestId('league-dropdown-button').click()
    await page.getByRole('menuitem', { name: 'Delete this league' }).click()
    await page.getByRole('button', { name: 'Yes' }).click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('Select League')
  })

  test('duplicate a league', async ({ page }) => {
    // Create a league
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    // Duplicate the league
    await page.getByTestId('league-dropdown-button').click()
    await page.getByRole('menuitem', { name: 'Duplicate League' }).click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('La Liga (copy)')
  })

  test('creating a new league from menu', async ({ page }) => {
    // Create league 1
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await createFirstLeague(page, 'La Liga')

    // Create league 2
    await createLeagueFromMenu(page, 'Premier League')
    await expect(page.getByTestId('league-dropdown-button')).toContainText('Premier League')

    // Open the league menu
    await page.getByTestId('league-dropdown-button').click()
    const leagues = await page.$$('[data-testid="league-dropdown"] a')
    await expect(leagues).toHaveLength(2)
  })
})
