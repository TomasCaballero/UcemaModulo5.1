import type { Page } from '@playwright/test'

/** Pantallas representativas; las simulaciones y secciones con tablas o fórmulas largas incluidas. */
export const ROUTES = [
  '/#/',
  '/#/modulo/2',
  '/#/seccion/2.1',
  '/#/seccion/2.3',
  '/#/seccion/2.4',
  '/#/seccion/2.5',
  '/#/seccion/2.7',
  '/#/modulo/2/evaluacion',
  '/#/glosario',
  '/#/mapa',
  '/#/sintesis',
  '/#/buscar?q=varianza',
  '/#/repaso',
  '/#/simulacion/IN-03',
  '/#/simulacion/IN-21',
  '/#/simulacion/IN-58',
]

/** Abre una ruta y espera a que la vista (cargada bajo demanda) muestre su título. */
export async function open(page: Page, route: string): Promise<void> {
  await page.goto(route)
  await page.locator('h1').first().waitFor()
  await page.waitForLoadState('networkidle')
}
