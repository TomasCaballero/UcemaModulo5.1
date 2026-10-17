import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { ALLOWED, findForwardReferences } from '../tools/forward-references'

// Regla editorial: un módulo solo se apoya en los anteriores. Ni nombra módulos posteriores ni usa
// su vocabulario sin definirlo (ver "Cómo usar esta guía"). Las excepciones viven en ALLOWED, con motivo.
describe('Sin referencias hacia adelante', () => {
  const found = findForwardReferences(courseContent)

  it('informa el resultado', () => {
    console.log(`\nReferencias hacia adelante: ${found.length} · excepciones justificadas: ${ALLOWED.length}`)
    if (found.length > 0) console.table(found.map(({ where, match, targetModule, excerpt }) => ({ where, match, targetModule, excerpt })))
    expect(courseContent.sections.length).toBeGreaterThan(0)
  })

  it('ningún módulo remite a uno posterior', () => {
    expect(found.filter((ref) => ref.kind === 'module').map((ref) => `${ref.where}: «${ref.match}»`)).toEqual([])
  })

  it('ningún módulo usa vocabulario de uno posterior sin definirlo', () => {
    expect(found.filter((ref) => ref.kind === 'term').map((ref) => `${ref.where}: «${ref.match}» (Módulo ${ref.targetModule})`)).toEqual([])
  })
})
