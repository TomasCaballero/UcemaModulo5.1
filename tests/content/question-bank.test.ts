import { describe, expect, it } from 'vitest'
import { courseContent, courseIndex } from '@/content'
import { module2Questions } from '@/content/data/module2-questions'

describe('banco de preguntas del Módulo 2', () => {
  it('tiene al menos 12 preguntas (RNF-20, AC-22)', () => {
    expect(courseIndex.questionsOf(2).length).toBeGreaterThanOrEqual(12)
  })

  it('todas tienen 4 o 5 opciones y exactamente una correcta (AC-24)', () => {
    for (const q of module2Questions) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(4)
      expect(q.options.length, q.id).toBeLessThanOrEqual(5)
      expect(Number.isInteger(q.correctIndex) && q.correctIndex < q.options.length, q.id).toBe(true)
      expect(new Set(q.options).size, `${q.id}: opciones repetidas`).toBe(q.options.length)
    }
  })

  it('cubre las 10 preguntas de autoevaluación de la guía (RNF-19)', () => {
    const refs = new Set(module2Questions.map((q) => q.guideQuestionRef))
    for (let n = 1; n <= 10; n++) expect(refs.has(`M2-Q${n}`), `M2-Q${n}`).toBe(true)
  })

  it('cada pregunta tiene explicación y apunta a una sección del mismo módulo', () => {
    for (const q of module2Questions) {
      expect(q.explanation.trim(), q.id).not.toBe('')
      expect(courseIndex.getSection(q.sectionId)?.moduleId, q.id).toBe(2)
    }
  })

  it('los mini-chequeos de las secciones usan preguntas del banco', () => {
    const ids = courseContent.sections.flatMap((s) =>
      s.blocks.flatMap((b) => (b.type === 'miniCheck' ? b.questionIds : [])),
    )
    expect(ids.length).toBeGreaterThanOrEqual(4)
    for (const id of ids) expect(courseIndex.getQuestion(id), id).toBeDefined()
  })

  it('el mini-chequeo de la 2.7 va antes de los errores Tipo I/II (AC-30)', () => {
    const blocks = courseIndex.getSection('2.7')?.blocks ?? []
    const mini = blocks.findIndex((b) => b.type === 'miniCheck')
    const errors = blocks.findIndex((b) => b.type === 'subheading' && b.text === 'Errores posibles')
    expect(mini).toBeGreaterThanOrEqual(0)
    expect(mini).toBeLessThan(errors)
  })
})

describe('índice de preguntas', () => {
  it('consulta por id y por módulo', () => {
    expect(courseIndex.getQuestion('m2-q01')?.moduleId).toBe(2)
    expect(courseIndex.getQuestion('no-existe')).toBeUndefined()
    expect(courseIndex.questionsOf(5).length).toBeGreaterThanOrEqual(12)
    expect(courseIndex.questionsOf(5).every((q) => q.moduleId === 5)).toBe(true)
  })
})
