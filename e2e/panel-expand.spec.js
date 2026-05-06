import { test, expect } from '@playwright/test'

test('panel expands fully after being collapsed', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // Wait for React to mount and the toggle button to appear
  const collapseBtn = page.getByLabel('Collapse panel')
  await collapseBtn.waitFor({ state: 'visible', timeout: 15000 })

  // Collapse
  await collapseBtn.click()
  await page.waitForTimeout(400)

  // Re-expand
  await page.getByLabel('Expand panel').click()
  await page.waitForTimeout(400)

  // The sliding content div should be 272px wide
  const contentDiv = page.locator('.w-\\[272px\\]').first()
  const box = await contentDiv.boundingBox()
  expect(box).not.toBeNull()
  expect(box.width).toBeCloseTo(272, 0)

  // Content right edge must be within viewport
  const viewport = page.viewportSize()
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
})
