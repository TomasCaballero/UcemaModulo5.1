import { expect, test } from '@playwright/test'

// Aquí el service worker está activo: es justamente lo que se prueba.
test('tras la primera visita todo funciona sin conexión (AC-45)', async ({ page, context }) => {
  await page.goto('/#/')
  await page.locator('h1').waitFor()
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload() // desde acá el service worker controla la página
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await page.waitForLoadState('networkidle')

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curso de Estadística')

  // Una sección con fórmulas (KaTeX y sus fuentes se cargan bajo demanda) y una simulación incrustada.
  await page.goto('/#/seccion/2.5')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('2.5')
  await expect(page.locator('.katex').first()).toBeVisible()
  await expect(page.locator('.clt__summary')).toContainText('Medias dibujadas')

  // Otra simulación, una evaluación y el glosario.
  await page.goto('/#/simulacion/IN-58')
  await expect(page.locator('.kmeans__phase')).toBeVisible()
  await page.goto('/#/modulo/2/evaluacion')
  await page.locator('#confidence-input').fill('50')
  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Pregunta 1 de 12')
  await page.goto('/#/glosario')
  await expect(page.locator('.glossary__entry')).toHaveCount(80)
})
