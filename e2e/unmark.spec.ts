import { expect, test } from '@playwright/test'
import { open } from './routes'

test.use({ serviceWorkers: 'block', viewport: { width: 360, height: 800 } })

/** Alto y ancho mínimos de un control táctil (AC-60). */
const MIN = 44

test('con una sección vista, los botones de desmarcar son táctiles y no desbordan a 360 px', async ({ page }) => {
  await open(page, '/#/seccion/2.1')
  // Al llegar al final de la página la sección se marca sola (RF-32).
  await page.locator('.mark-seen').scrollIntoViewIfNeeded()

  const unmark = page.getByRole('button', { name: 'Marcar como no vista' })
  await expect(unmark).toBeVisible()
  const box = await unmark.boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(MIN - 0.5)

  // Menú de secciones (celular): el botón "Desmarcar" del índice también debe ser táctil.
  await page.locator('.layout__menu summary').click()
  const inIndex = page.locator('.layout__menu .section-index__unmark').first()
  await expect(inIndex).toBeVisible()
  const indexBox = await inIndex.boundingBox()
  expect(indexBox?.height).toBeGreaterThanOrEqual(MIN - 0.5)
  expect(indexBox?.width).toBeGreaterThanOrEqual(MIN - 0.5)

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)

  // Y funciona: queda sin ver y, aunque el final siga a la vista, no se marca de nuevo sola.
  await unmark.click()
  const mark = page.getByRole('button', { name: 'Marcar como vista' })
  await expect(mark).toBeVisible()
  await page.waitForTimeout(500)
  await expect(mark).toBeVisible()
})
