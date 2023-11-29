import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

test.describe('Managing leagues', () => {
  test.beforeAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))
  test.afterAll(async () => execSync('pnpm dotenv -e .env.test -- pnpm prisma migrate reset --force'))

  test('creating first league', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await page.getByTestId('btn-setup-league').click()
    await page.getByPlaceholder('League name').click()
    await page.getByPlaceholder('League name').fill('La Liga')
    await page.getByRole('button', { name: 'Add League' }).click()

    // await expect
    await expect(page.getByTestId('league-dropdown-button')).toContainText('La Liga')
  })

  test('deleting a league', async ({ page }) => {
    // Create a league
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await page.getByTestId('btn-setup-league').click()
    await page.getByPlaceholder('League name').click()
    await page.getByPlaceholder('League name').fill('La Liga')
    await page.getByRole('button', { name: 'Add League' }).click()

    // Delete the league
    await page.getByTestId('league-dropdown-button').click()
    await page.getByRole('menuitem', { name: 'Delete this league' }).click()
    await page.getByRole('button', { name: 'Yes' }).click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('Select League')
  })

  test('duplicate a league', async ({ page }) => {
    // Create a league
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 })
    await page.getByRole('button', { name: 'Setup a league' }).click()
    await page.getByPlaceholder('League name').click()
    await page.getByPlaceholder('League name').fill('La Liga')
    await page.getByRole('button', { name: 'Add League' }).click()

    // Duplicate the league
    await page.getByTestId('league-dropdown-button').click()
    await page.getByRole('menuitem', { name: 'Duplicate League' }).click()

    await expect(page.getByTestId('league-dropdown-button')).toContainText('La Liga (copy)')
  })

  test('creating a new league from menu', async ({ page }) => {})
})