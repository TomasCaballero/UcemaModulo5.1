import { expect, test } from '@playwright/test'
import { open, ROUTES } from './routes'

test.use({ serviceWorkers: 'block' })

const WIDTHS = [360, 768, 1920]

for (const width of WIDTHS) {
  test.describe(`ancho ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const route of ROUTES) {
      test(`${route} no tiene scroll horizontal (AC-44)`, async ({ page }) => {
        await open(page, route)
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        expect(scrollWidth, `contenido de ${scrollWidth}px en un ancho de ${clientWidth}px`).toBeLessThanOrEqual(clientWidth)
      })
    }
  })
}

test.describe('áreas táctiles a 360 px (AC-60)', () => {
  test.use({ viewport: { width: 360, height: 800 } })

  for (const route of ROUTES) {
    test(`${route}`, async ({ page }) => {
      await open(page, route)
      const small = await page.evaluate(() => {
        const MIN = 44
        const selector = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"]'
        const found: string[] = []
        for (const element of document.querySelectorAll<HTMLElement>(selector)) {
          const style = getComputedStyle(element)
          // Un radio o casilla dentro de una etiqueta se toca por la etiqueta entera.
          const isChoice = element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')
          const box = (isChoice ? (element.closest('label') ?? element) : element).getBoundingClientRect()
          const hidden = style.visibility === 'hidden' || style.display === 'none' || box.width === 0 || box.height === 0
          const clipped = element.classList.contains('visually-hidden') || element.closest('.visually-hidden') !== null
          // Los enlaces dentro de un texto corrido quedan exceptuados (WCAG 2.5.8, enlaces en línea).
          const inlineLink = element.tagName === 'A' && style.display === 'inline'
          if (hidden || clipped || inlineLink) continue
          if (box.width < MIN - 0.5 || box.height < MIN - 0.5) {
            const label = (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 30)
            found.push(`${element.tagName.toLowerCase()}.${element.className} "${label}" ${Math.round(box.width)}x${Math.round(box.height)}`)
          }
        }
        return found
      })
      expect(small, 'controles menores a 44x44 px').toEqual([])
    })
  }
})
