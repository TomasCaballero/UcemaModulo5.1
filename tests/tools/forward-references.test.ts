import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import type { ContentBlock, CourseContent, ModuleId, Question } from '@/content/types'
import { ALLOWED, findForwardReferences, LATER_TERMS } from '../../tools/forward-references'

const paragraph = (text: string): ContentBlock => ({ type: 'paragraph', text })

function contentWith(moduleId: ModuleId, blocks: ContentBlock[], extra: Partial<CourseContent> = {}): CourseContent {
  return {
    modules: [],
    sections: [
      { id: `${moduleId}.1`, moduleId, title: 'Sección de prueba', blocks },
      { id: '6.3', moduleId: 6, title: 'Remuestreo', blocks: [] },
    ],
    glossary: [],
    questions: [],
    simulations: [],
    ...extra,
  }
}

describe('referencias hacia adelante', () => {
  it('detecta un módulo posterior nombrado y lo ubica', () => {
    const found = findForwardReferences(contentWith(0, [paragraph('La regresión OLS del Módulo 3 es la misma idea.')]))
    expect(found.map((f) => [f.kind, f.targetModule, f.match])).toContainEqual(['module', 3, 'Módulo 3'])
    expect(found[0]?.where).toBe('Módulo 0 · 0.1 Sección de prueba')
  })

  it('detecta listas de módulos ("Módulos 4 y 5") y módulos con sección ("Módulo 6.7")', () => {
    const found = findForwardReferences(contentWith(0, [paragraph('Reaparece en los Módulos 4 y 5.'), paragraph('Como K-Means, Módulo 6.7.')]))
    expect(found.filter((f) => f.kind === 'module').map((f) => f.targetModule)).toEqual([4, 6])
  })

  it('no marca remisiones hacia atrás ni al mismo módulo', () => {
    const found = findForwardReferences(contentWith(4, [paragraph('Como en el Módulo 2.3 y el Módulo 4.'), paragraph('Ver Módulos 1, 2 y 3.')]))
    expect(found).toEqual([])
  })

  it('detecta una remisión a sección entre paréntesis solo si la sección existe', () => {
    const found = findForwardReferences(contentWith(2, [paragraph('Se arma con remuestreo (6.3).'), paragraph('El soporte mínimo es (3.5) transacciones.')]))
    expect(found.filter((f) => f.kind === 'module').map((f) => f.match)).toEqual(['(6.3)'])
  })

  it('detecta vocabulario posterior sin módulo explícito', () => {
    const found = findForwardReferences(contentWith(0, [paragraph('Es la herramienta de las SVM y de la regresión logística.')]))
    expect(found.filter((f) => f.kind === 'term').map((f) => f.match)).toEqual(['regresión logística', 'SVM'])
  })

  it('respeta las excepciones justificadas y no confunde palabras parecidas', () => {
    expect(findForwardReferences(contentWith(4, [paragraph('Agrupar, como **K-Means**: cada punto va al centro más cercano.')]))).toEqual([])
    expect(findForwardReferences(contentWith(3, [paragraph('La numeración es la del libro de Wooldridge.')]))).toEqual([])
    expect(findForwardReferences(contentWith(0, [paragraph('Un cálculo de odds, pero sin etiqueta.')])).map((f) => f.match)).toEqual(['odds'])
    expect(findForwardReferences(contentWith(0, [paragraph('Las SVM sirven.')]), { allowed: [{ moduleId: 0, term: 'SVM', reason: 'prueba' }] })).toEqual([])
  })

  it('revisa también preguntas, simulaciones, tablas, ejemplos resueltos y la introducción del módulo', () => {
    const question: Question = {
      id: 'm1-q01',
      moduleId: 1,
      prompt: 'Pregunta sobre PCA',
      options: ['a', 'b'],
      correctIndex: 0,
      explanation: 'Ver Módulo 6.',
      sectionId: '1.1',
    }
    const blocks: ContentBlock[] = [
      { type: 'table', headers: ['h'], rows: [['Naive Bayes']] },
      { type: 'workedExample', title: 'DBSCAN', steps: ['paso'], result: 'ok' },
    ]
    const content = contentWith(1, blocks, {
      questions: [question],
      simulations: [{ id: 'IN-99', moduleId: 1, title: 'x', description: 'usa bootstrap', sectionIds: ['1.1'] }],
      modules: [{ id: 1, title: 'Uno', summary: 's', intro: [paragraph('Antes del Módulo 7.')] }],
    })
    expect(findForwardReferences(content).map((f) => f.where.split(' ')[0])).toEqual(['Módulo', 'Módulo', 'Módulo', 'pregunta', 'pregunta', 'simulación'])
  })

  it('cada excepción tiene motivo y apunta a un término conocido', () => {
    const labels = new Set(LATER_TERMS.map((term) => term.label))
    for (const allowance of ALLOWED) {
      expect(allowance.reason.length).toBeGreaterThan(10)
      expect(labels.has(allowance.term)).toBe(true)
    }
  })

  it('el curso no tiene referencias hacia adelante', () => {
    expect(findForwardReferences(courseContent).map((f) => `${f.where}: ${f.match}`)).toEqual([])
  })
})
