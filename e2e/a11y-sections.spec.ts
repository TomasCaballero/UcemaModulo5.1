import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { courseContent } from '../src/content'
import { open } from './routes'

test.use({ serviceWorkers: 'block', viewport: { width: 1280, height: 900 } })

// Barrido de todas las secciones (AC-49, AC-61), con los "¿Te acordás?" abiertos: axe no revisa el
// contenido de un <details> cerrado. Un solo navegador alcanza: el contenido es el mismo en ambos.
test('todas las secciones sin violaciones de axe, con los repasos abiertos', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chrome', 'El barrido completo corre en un solo navegador')
  test.setTimeout(10 * 60_000)
  const problems: string[] = []
  for (const section of courseContent.sections) {
    await open(page, `/#/seccion/${section.id}`)
    for (const details of await page.locator('.recall details').all()) {
      await details.evaluate((element) => ((element as HTMLDetailsElement).open = true))
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
    problems.push(...results.violations.map((v) => `${section.id} ${v.id}: ${v.nodes.length} (${v.nodes[0]?.target.join(' ')})`))
  }
  expect(problems).toEqual([])
})
