import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { open, ROUTES } from './routes'

test.use({ serviceWorkers: 'block' })

for (const width of [360, 1280]) {
  test.describe(`accesibilidad a ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } })

    for (const route of ROUTES) {
      test(`${route} sin violaciones de axe, contraste incluido (AC-49, AC-61)`, async ({ page }) => {
        await open(page, route)
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} (${v.nodes[0]?.target.join(' ')})`)
        expect(summary).toEqual([])
      })
    }
  })
}
