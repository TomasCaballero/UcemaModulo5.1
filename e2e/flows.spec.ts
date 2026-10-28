import { expect, test, type Page } from '@playwright/test'
import { open, ROUTES } from './routes'

test.use({ serviceWorkers: 'block' })

test('flujo principal: inicio → módulo → sección → simulación → autoevaluación (AC-63)', async ({ page }) => {
  await open(page, '/#/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curso de Estadística')
  await expect(page.locator('.module-card')).toHaveCount(8)

  await page.getByRole('link', { name: /Módulo 2.*Estadística, Medición e Inferencia/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Módulo 2')
  await page.getByRole('link', { name: /^2\.5 / }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('2.5')

  const simulation = page.getByRole('group', { name: 'Simulador del Teorema del Límite Central' })
  await simulation.scrollIntoViewIfNeeded()
  await expect(simulation.locator('.clt__summary')).toContainText('Medias dibujadas: 400 de 400')
  await expect(page.locator('.math-display .katex').first()).toBeVisible()

  await page.getByRole('link', { name: 'Autoevaluación' }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Autoevaluación del Módulo 2')
})

test('toda pantalla carga sin errores de consola ni excepciones (AC-53)', async ({ page }) => {
  const problems: string[] = []
  page.on('console', (message) => {
    // El bloqueo del service worker lo pone esta misma suite (serviceWorkers: 'block'), no la app.
    if (message.text().includes('Service Worker registration blocked')) return
    if (message.type() === 'error' || message.type() === 'warning') problems.push(`${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => problems.push(`excepción: ${error.message}`))
  for (const route of ROUTES) await open(page, route)
  expect(problems).toEqual([])
})

test.describe('simulaciones en el navegador', () => {
  test('IN-03: pasar la prevalencia a 10 % da 66.7 % (AC-18)', async ({ page }) => {
    await open(page, '/#/simulacion/IN-03')
    await expect(page.locator('.bayes__posterior')).toHaveText('15.4 %')
    await page.getByLabel('Prevalencia (personas enfermas)').fill('10')
    await expect(page.locator('.bayes__posterior')).toHaveText('66.7 %')
  })

  test('IN-58: reproducir, pausar y reiniciar (AC-19)', async ({ page }) => {
    await open(page, '/#/simulacion/IN-58')
    await expect(page.locator('.player__step')).toHaveText(/Paso 0 de/)
    await page.getByRole('button', { name: 'Reproducir' }).click()
    await expect(page.locator('.player__step')).toHaveText(/Paso [1-9]/, { timeout: 5000 })
    await page.getByRole('button', { name: 'Pausar' }).click()
    const paused = await page.locator('.player__step').textContent()
    await page.waitForTimeout(1500)
    await expect(page.locator('.player__step')).toHaveText(paused ?? '')
    await page.getByRole('button', { name: 'Reiniciar' }).click()
    await expect(page.locator('.player__step')).toHaveText(/Paso 0 de/)
    await expect(page.locator('.kmeans__phase')).toContainText('Centroides iniciales')
  })

  test('IN-21 con "reducir movimiento" no se anima y muestra la versión estática (AC-21)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, '/#/simulacion/IN-21')
    await expect(page.locator('.player__static')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reproducir' })).toHaveCount(0)
    await expect(page.locator('.clt__summary')).toContainText('Medias dibujadas: 400 de 400')
  })
})

/** Avanza con Tab hasta que el foco esté en un elemento que cumpla `kind`. */
async function tabTo(page: Page, kind: 'radio' | 'next'): Promise<void> {
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab')
    const found = await page.evaluate((target) => {
      const el = document.activeElement
      if (target === 'radio') return el instanceof HTMLInputElement && el.type === 'radio'
      return el instanceof HTMLButtonElement && /Siguiente pregunta|Ver resultado/.test(el.textContent ?? '')
    }, kind)
    if (found) return
  }
  throw new Error(`No se llegó al control "${kind}" con Tab`)
}

test('la autoevaluación completa se recorre solo con teclado (AC-50)', async ({ page }) => {
  await open(page, '/#/modulo/2/evaluacion')
  await page.locator('#confidence-input').focus()
  await page.keyboard.type('80')
  await page.keyboard.press('Enter')

  for (let n = 1; n <= 12; n++) {
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(`Pregunta ${n} de 12`)
    await tabTo(page, 'radio')
    await page.keyboard.press('Space')
    await page.keyboard.press('Enter')
    await expect(page.locator('.question__verdict')).toBeVisible()
    await expect(page.locator('.question__feedback')).toBeFocused()
    await tabTo(page, 'next')
    await page.keyboard.press('Enter')
  }
  await expect(page.getByRole('heading', { level: 2, name: 'Resultado' })).toBeVisible()
  await expect(page.locator('.result__score')).toHaveText(/^\d+\/12$/)
  await expect(page.locator('.result__calibration')).toContainText('Estimaste 80 %')
})

// Se usa la 2.4: es larga, así que al abrirla el final no está a la vista.
test('llegar al final de la sección la marca como vista y el progreso persiste al recargar (RF-32, AC-34)', async ({ page }) => {
  await open(page, '/#/seccion/2.4')
  await expect(page.locator('.mark-seen__done')).toHaveCount(0)
  await page.locator('.mark-seen').scrollIntoViewIfNeeded()
  await expect(page.locator('.mark-seen__done')).toBeVisible()
  await page.reload()
  await page.locator('h1').waitFor()
  await expect(page.locator('.mark-seen__done')).toBeVisible()
  await open(page, '/#/')
  await expect(page.getByRole('link', { name: /Continuar: 2\.4/ })).toBeVisible()
})

test('al pasar a la sección siguiente desde el final de una larga, la nueva no se marca sola', async ({ page }) => {
  await open(page, '/#/seccion/2.4')
  await page.locator('.mark-seen').scrollIntoViewIfNeeded()
  await expect(page.locator('.mark-seen__done')).toBeVisible()
  await page.locator('a[rel="next"]').click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('2.5')
  await page.waitForTimeout(800) // tiempo de sobra para que el observador de intersección dispare
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page.locator('.mark-seen__done')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Marcar como vista' })).toBeVisible()
})

test('con el almacenamiento bloqueado muestra el contenido y avisa que no se guardará (AC-51)', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('bloqueado', 'SecurityError')
      },
    })
  })
  await open(page, '/#/seccion/2.1')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('2.1')
  await expect(page.locator('.storage-notice')).toContainText('el progreso no se guardará')
})

test('no sale ningún dato del usuario: solo pedidos GET al propio origen (AC-48)', async ({ page, baseURL }) => {
  const requests: { url: string; method: string; body: string | null }[] = []
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))

  await open(page, '/#/seccion/2.4')
  await page.locator('.mark-seen').scrollIntoViewIfNeeded()
  await expect(page.locator('.mark-seen__done')).toBeVisible()
  await open(page, '/#/modulo/2/evaluacion')
  await page.locator('#confidence-input').fill('70')
  await page.getByRole('button', { name: 'Empezar' }).click()
  await page.locator('input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Confirmar' }).click()
  await open(page, '/#/')

  expect(requests.length).toBeGreaterThan(0)
  for (const request of requests) {
    expect(request.url.startsWith(baseURL ?? ''), request.url).toBe(true)
    expect(request.method, request.url).toBe('GET')
    expect(request.body, request.url).toBeNull()
    expect(new URL(request.url).search, request.url).toBe('')
  }
})
