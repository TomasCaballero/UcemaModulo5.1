import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { validateContent } from '@/content/validate'
import { autoevaluationCounts } from '../tools/guide'
import { checkTraceability, compareWithPrd } from '../tools/traceability'
import { readGuide, STRICT } from './support'

// RNF-19 / AC-23: cada pregunta de autoevaluación de la guía tiene al menos una pregunta equivalente
// en el banco. RNF-20 / AC-22: cada módulo tiene al menos 12. AC-24: 4 o 5 opciones, una correcta.
describe('RNF-19 y RNF-20: trazabilidad del banco de preguntas', () => {
  const counts = autoevaluationCounts(readGuide())
  const traces = checkTraceability(counts, courseContent)

  it('la guía tiene las 82 preguntas que declara el PRD', () => {
    expect(compareWithPrd(counts)).toEqual([])
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(82)
  })

  it('informa la trazabilidad por módulo', () => {
    console.table(traces.map(({ moduleId, guideCount, mapped, bankSize, status, detail }) => ({ moduleId, guideCount, mapped, bankSize, status, detail })))
    expect(traces).toHaveLength(8)
  })

  it('los módulos con banco cargado cubren todas sus preguntas y tienen al menos 12', () => {
    expect(traces.filter((t) => t.status === 'incomplete')).toEqual([])
  })

  it('todas las preguntas tienen 4 o 5 opciones y exactamente una correcta', () => {
    expect(validateContent(courseContent).filter((e) => e.startsWith('Pregunta'))).toEqual([])
  })

  it.skipIf(!STRICT)('los 8 módulos tienen su banco (curso completo)', () => {
    expect(traces.filter((t) => t.status === 'pending').map((t) => t.moduleId)).toEqual([])
  })
})
