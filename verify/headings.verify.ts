import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { parseHeadings } from '../tools/guide'
import { checkHeadings, summarize } from '../tools/headings'
import { readGuide, STRICT } from './support'

// RNF-17 / AC-46: todos los encabezados ## y ### de la guía tienen una sección equivalente en el curso.
describe('RNF-17: cobertura de encabezados de la guía', () => {
  const guide = readGuide()
  const headings = parseHeadings(guide)
  const checks = checkHeadings(guide, headings, courseContent)
  const totals = summarize(checks)

  it('informa la cobertura', () => {
    console.log(`\nEncabezados de la guía: ${headings.length} · cubiertos: ${totals.covered} · faltan: ${totals.missing} · pendientes de cargar: ${totals.pending}`)
    const notCovered = checks.filter((c) => c.status !== 'covered')
    if (notCovered.length > 0) console.table(notCovered)
    expect(headings.length).toBeGreaterThan(0)
  })

  it('no falta ningún encabezado de los módulos cargados', () => {
    expect(checks.filter((c) => c.status === 'missing')).toEqual([])
  })

  it.skipIf(!STRICT)('no queda ningún encabezado pendiente (curso completo)', () => {
    expect(checks.filter((c) => c.status === 'pending').map((c) => c.heading)).toEqual([])
  })
})
