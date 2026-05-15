import { test, expect } from '@playwright/test'

test('rain weather option renders without error', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const collapseBtn = page.getByLabel('Collapse panel')
  await collapseBtn.waitFor({ state: 'visible', timeout: 15000 })

  // WEATHER order: clear(0) → golden(1) → overcast(2) → rain(3)
  const weatherNext = page.getByLabel('Next WEATHER')
  await weatherNext.click() // → golden
  await page.waitForTimeout(150)
  await weatherNext.click() // → overcast
  await page.waitForTimeout(150)
  await weatherNext.click() // → rain
  await page.waitForTimeout(500)

  // Canvas should still be visible and not crash
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // The Rain label should be active
  await expect(page.getByText('Rain')).toBeVisible()
})
