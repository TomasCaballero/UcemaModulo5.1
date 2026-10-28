import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { evaluateExamples } from '../tools/numeric-examples'
import { expansionExamples, expansionText } from '../tools/expansion-numbers'

// RNF-24: las cifras de las ampliaciones (contenido que va más allá de la guía) figuran en la
// ampliación de su sección y coinciden con lo que calcula la lógica del curso.
describe('RNF-24: cifras de las ampliaciones', () => {
  const results = expansionExamples.flatMap((example) =>
    evaluateExamples([example], expansionText(courseContent, example.section)),
  )

  it('informa los resultados', () => {
    console.log(`\nCifras de ampliaciones verificadas: ${results.length} · coinciden: ${results.filter((r) => r.matches).length}`)
    const failing = results.filter((r) => !r.matches || !r.snippetInGuide)
    if (failing.length > 0) console.table(failing)
    expect(results.length).toBeGreaterThan(0)
  })

  it('cada cifra figura en una ampliación de su sección', () => {
    expect(results.filter((r) => !r.snippetInGuide).map((r) => r.id)).toEqual([])
  })

  it('el curso calcula exactamente lo que dice la ampliación', () => {
    expect(results.filter((r) => !r.matches).map((r) => `${r.id}: esperado ${r.expected}, calculado ${r.actual}`)).toEqual([])
  })
})
