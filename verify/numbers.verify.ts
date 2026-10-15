import { describe, expect, it } from 'vitest'
import { evaluateExamples, numericExamples } from '../tools/numeric-examples'
import { readGuide } from './support'

// RNF-18 / AC-47: los resultados numéricos de los ejemplos de la guía coinciden con los que calcula el curso.
describe('RNF-18: ejemplos numéricos de la guía', () => {
  const results = evaluateExamples(numericExamples, readGuide())

  it('informa los resultados', () => {
    console.log(`\nEjemplos verificados: ${results.length} · coinciden: ${results.filter((r) => r.matches).length}`)
    const failing = results.filter((r) => !r.matches || !r.snippetInGuide)
    if (failing.length > 0) console.table(failing)
    expect(results.length).toBeGreaterThan(0)
  })

  it('cada cifra esperada figura en el texto de la guía', () => {
    expect(results.filter((r) => !r.snippetInGuide).map((r) => r.id)).toEqual([])
  })

  it('el curso calcula exactamente lo que dice la guía', () => {
    expect(results.filter((r) => !r.matches).map((r) => `${r.id}: esperado ${r.expected}, calculado ${r.actual}`)).toEqual([])
  })
})
