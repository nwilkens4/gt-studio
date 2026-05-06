import { test, expect } from '@playwright/test'

test('paint swatches have adequate margin from panel edges', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.getByLabel('PAINT').waitFor({ state: 'visible', timeout: 15000 })

  // Open the PAINT accordion
  await page.getByLabel('PAINT').click()
  await page.waitForTimeout(400)

  // Get panel content bounding box
  const panelContent = page.locator('.w-\\[272px\\]').first()
  const panelBox = await panelContent.boundingBox()

  // Get first swatch (Pure White)
  const firstSwatch = page.locator('[aria-label="Pure White"]')
  const swatchBox = await firstSwatch.boundingBox()

  expect(swatchBox).not.toBeNull()
  expect(panelBox).not.toBeNull()

  // Left edge of swatch must be at least 20px from panel left edge
  // (accounts for 4.5px selection ring + comfortable visual margin)
  const leftMargin = swatchBox.x - panelBox.x
  expect(leftMargin).toBeGreaterThanOrEqual(20)
})

test('carousel sections have adequate vertical spacing', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.waitForTimeout(1000)

  const finishLabel = page.getByText('FINISH', { exact: true })
  const rimFinishLabel = page.getByText('RIM FINISH')

  const finishBox = await finishLabel.boundingBox()
  const rimBox = await rimFinishLabel.boundingBox()

  expect(finishBox).not.toBeNull()
  expect(rimBox).not.toBeNull()

  // At least 50px between section label tops (adequate breathing room)
  const gap = rimBox.y - finishBox.y
  expect(gap).toBeGreaterThan(50)
})
