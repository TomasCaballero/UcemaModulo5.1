import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import type { CourseContent, Question } from '@/content/types'
import { initialAssetPaths, INITIAL_BUDGET_BYTES, measureInitialBundle } from '../../tools/bundle'
import { autoevaluationCounts, countBullets, countNumberedItems, parseHeadings, sectionLines } from '../../tools/guide'
import { checkHeadings, summarize } from '../../tools/headings'
import { evaluateExamples, numericExamples, tolerance, type NumericExample } from '../../tools/numeric-examples'
import { checkTraceability, compareWithPrd, guideRef, PRD_QUESTION_COUNTS } from '../../tools/traceability'
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const guide = readFileSync(resolve(__dirname, '..', '..', 'recorrido-guias-de-aprendizaje-v3.md'), 'utf8')

const SAMPLE = [
  '# Título',
  '## Módulo 1: Uno',
  '### 1.1 Primera',
  '```',
  '### no es un encabezado',
  '```',
  '### Autoevaluación del Módulo 1',
  '',
  '1. Pregunta uno',
  '2. Pregunta dos',
  '* viñeta que no cuenta',
  '',
  '---',
  '1. fuera de la sección',
  '## Glosario',
  '* **A**: uno',
  '* **B**: dos',
].join('\n')

describe('lectura de la guía', () => {
  it('encuentra encabezados ## y ###, ignorando los bloques de código', () => {
    expect(parseHeadings(SAMPLE)).toEqual([
      { level: 2, text: 'Módulo 1: Uno', line: 2 },
      { level: 3, text: '1.1 Primera', line: 3 },
      { level: 3, text: 'Autoevaluación del Módulo 1', line: 7 },
      { level: 2, text: 'Glosario', line: 15 },
    ])
  })

  it('cuenta ítems numerados y viñetas bajo un encabezado, hasta la próxima sección', () => {
    expect(countNumberedItems(SAMPLE, 'Autoevaluación del Módulo 1')).toBe(2)
    expect(countBullets(SAMPLE, 'Glosario')).toBe(2)
    expect(sectionLines(SAMPLE, 'No existe')).toEqual([])
  })

  it('cuenta las preguntas de autoevaluación por módulo', () => {
    expect(autoevaluationCounts(SAMPLE)).toEqual({ 1: 2 })
  })

  it('la guía real tiene las 82 preguntas del PRD y 96 términos de glosario', () => {
    const counts = autoevaluationCounts(guide)
    expect(counts).toEqual(PRD_QUESTION_COUNTS)
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(82)
    expect(countBullets(guide, 'Glosario')).toBe(96)
    expect(countNumberedItems(guide, 'Los errores más comunes (y cómo evitarlos)')).toBe(11)
  })
})

describe('RNF-17: equivalencia de encabezados', () => {
  const headings = parseHeadings(guide)
  const checks = checkHeadings(guide, headings, courseContent)
  const byHeading = (text: string) => checks.find((c) => c.heading === text)

  it('la guía real tiene 82 encabezados y ninguno falta entre los módulos cargados', () => {
    expect(headings).toHaveLength(82)
    expect(summarize(checks).missing).toBe(0)
    expect(summarize(checks)).toMatchObject({ covered: 82, pending: 0 }) // curso completo: los 8 módulos
  })

  it('reconoce cada tipo de encabezado cubierto', () => {
    expect(byHeading('Módulo 2: Estadística, Medición e Inferencia')?.status).toBe('covered')
    expect(byHeading('2.4 Distribuciones de probabilidad')?.status).toBe('covered')
    expect(byHeading('Autoevaluación del Módulo 2')).toMatchObject({ status: 'covered', detail: '12 preguntas' })
    expect(byHeading('Respuestas del Módulo 2')?.status).toBe('covered')
    expect(byHeading('Glosario')).toMatchObject({ status: 'covered', detail: '96 términos' })
    expect(byHeading('Cómo usar esta guía')).toMatchObject({ status: 'covered', detail: '3 reglas' })
    expect(byHeading('Cómo estudiar con esta guía')).toMatchObject({ status: 'covered', detail: '5 puntos' })
    expect(byHeading('La escalera del conocimiento')?.status).toBe('covered')
    expect(byHeading('¿Qué técnica uso para qué problema?')?.status).toBe('covered')
    expect(byHeading('Los errores más comunes (y cómo evitarlos)')).toMatchObject({ status: 'covered', detail: '11 errores' })
    expect(byHeading('Cuadro síntesis y guía de uso')?.status).toBe('covered')
  })

  it('lo de módulos sin cargar queda pendiente, no como faltante', () => {
    const soloModulo2: CourseContent = {
      ...courseContent,
      modules: courseContent.modules.filter((m) => m.id === 2),
      sections: courseContent.sections.filter((s) => s.moduleId === 2),
      questions: courseContent.questions.filter((q) => q.moduleId === 2),
    }
    const partial = checkHeadings(guide, headings, soloModulo2)
    const status = (text: string) => partial.find((c) => c.heading === text)?.status
    expect(status('3.3 Regresión lineal simple y mínimos cuadrados ordinarios (OLS)')).toBe('pending')
    expect(status('Anexo opcional: muestreo de Nyquist-Shannon y la red de Eddington')).toBe('pending')
    expect(status('Respuestas del Módulo 5')).toBe('pending')
    expect(status('2.4 Distribuciones de probabilidad')).toBe('covered')
  })

  const empty: CourseContent = { modules: [], sections: [], glossary: [], questions: [], simulations: [] }
  const check = (markdown: string, content: CourseContent) => checkHeadings(markdown, parseHeadings(markdown), content)

  it('detecta lo que falta en un módulo cargado', () => {
    const md = ['## Módulo 2: Dos', '### 2.1 Uno', '### 2.2 Dos', '### Autoevaluación del Módulo 2', '### Respuestas del Módulo 2'].join('\n')
    const content: CourseContent = {
      ...empty,
      modules: [{ id: 2, title: 'Otro título', summary: '' }],
      sections: [{ id: '2.1', moduleId: 2, title: 'Distinto', blocks: [] }],
    }
    const statuses = check(md, content).map((c) => [c.heading, c.status, c.detail])
    expect(statuses).toEqual([
      ['Módulo 2: Dos', 'missing', 'título distinto: "Otro título"'],
      ['2.1 Uno', 'missing', 'título distinto: "Distinto"'],
      ['2.2 Dos', 'missing', 'falta la sección'],
      ['Autoevaluación del Módulo 2', 'missing', 'sin preguntas'],
      ['Respuestas del Módulo 2', 'missing', 'sin preguntas'],
    ])
  })

  it('detecta módulos inexistentes, encabezados sin regla y respuestas sin explicación', () => {
    const question = { id: 'q', moduleId: 2, prompt: 'p', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: ' ', sectionId: '2.1' } satisfies Question
    const content: CourseContent = {
      ...empty,
      sections: [{ id: '2.1', moduleId: 2, title: 'Uno', blocks: [] }],
      questions: [question],
    }
    const md = ['## Módulo 9: Nueve', '### Respuestas del Módulo 2', '## Algo desconocido', '### Anexo opcional: x'].join('\n')
    expect(check(md, content).map((c) => [c.status, c.detail])).toEqual([
      ['missing', 'no hay módulo con ese número'],
      ['missing', 'hay preguntas sin explicación'],
      ['missing', 'sin regla de equivalencia'],
      ['pending', 'Módulo 1 sin cargar'],
    ])
  })

  it('compara las cantidades de reglas, puntos, términos y errores con las de la guía', () => {
    const md = ['## Cómo usar esta guía', '1. a', '2. b', '## Glosario', '* x', '### Cómo estudiar con esta guía', '1. a', '### Los errores más comunes (y cómo evitarlos)', '1. a']
    const results = check(md.join('\n'), empty)
    expect(results.map((c) => [c.heading, c.status])).toEqual([
      ['Cómo usar esta guía', 'missing'],
      ['Glosario', 'missing'],
      ['Cómo estudiar con esta guía', 'missing'],
      ['Los errores más comunes (y cómo evitarlos)', 'missing'],
    ])
  })

  it('un anexo opcional cargado en el Módulo 1 cuenta como cubierto', () => {
    const content: CourseContent = { ...empty, sections: [{ id: '1.7', moduleId: 1, title: 'Anexo', optional: true, blocks: [] }] }
    expect(check('### Anexo opcional: algo', content)[0]?.status).toBe('covered')
    const without: CourseContent = { ...empty, sections: [{ id: '1.1', moduleId: 1, title: 'Uno', blocks: [] }] }
    expect(check('### Anexo opcional: algo', without)[0]).toMatchObject({ status: 'missing', detail: 'falta el anexo' })
  })
})

describe('RNF-19 y RNF-20: trazabilidad', () => {
  it('la guía real coincide con el PRD', () => {
    expect(compareWithPrd(autoevaluationCounts(guide))).toEqual([])
  })

  it('detecta diferencias con el PRD', () => {
    expect(compareWithPrd({ ...PRD_QUESTION_COUNTS, 2: 9, 3: undefined as unknown as number })).toEqual([
      'Módulo 2: la guía tiene 9 y el PRD declara 10',
      'Módulo 3: la guía tiene 0 y el PRD declara 11',
    ])
  })

  it('con el curso completo, los 8 módulos cubren las 82 preguntas de la guía', () => {
    const traces = checkTraceability(PRD_QUESTION_COUNTS, courseContent)
    expect(traces.find((t) => t.moduleId === 2)).toMatchObject({ status: 'ok', guideCount: 10, mapped: 10, bankSize: 12 })
    expect(traces.filter((t) => t.status !== 'ok').map((t) => `${t.moduleId}: ${t.detail}`)).toEqual([])
    expect(traces.reduce((sum, t) => sum + t.mapped, 0)).toBe(82)
  })

  it('un módulo sin banco cargado queda pendiente', () => {
    const soloModulo2: CourseContent = { ...courseContent, questions: courseContent.questions.filter((q) => q.moduleId === 2) }
    const traces = checkTraceability(PRD_QUESTION_COUNTS, soloModulo2)
    expect(traces.filter((t) => t.status === 'pending').map((t) => t.moduleId)).toEqual([0, 1, 3, 4, 5, 6, 7])
  })

  it('marca como incompleto un banco con preguntas de la guía sin cubrir o con menos de 12', () => {
    const make = (n: number): Question => ({
      id: `q${n}`, moduleId: 2, prompt: 'p', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'e', sectionId: '2.1',
      ...(n <= 3 ? { guideQuestionRef: guideRef(2, n) } : {}),
    })
    const content: CourseContent = { modules: [], sections: [], glossary: [], simulations: [], questions: [1, 2, 3, 4].map(make) }
    const trace = checkTraceability({ ...PRD_QUESTION_COUNTS, 2: 5 }, content).find((t) => t.moduleId === 2)
    expect(trace).toMatchObject({ status: 'incomplete', mapped: 3, unmapped: [4, 5], bankSize: 4 })
    expect(trace?.detail).toBe('sin pregunta equivalente: 4, 5; banco de 4 (mínimo 12)')
  })
})

describe('RNF-18: ejemplos numéricos', () => {
  const results = evaluateExamples(numericExamples, guide)

  it('cada cifra esperada está en la guía y el curso la calcula igual', () => {
    expect(results.filter((r) => !r.snippetInGuide).map((r) => r.id)).toEqual([])
    expect(results.filter((r) => !r.matches).map((r) => r.id)).toEqual([])
    expect(results.length).toBeGreaterThanOrEqual(40)
  })

  it('los ids son únicos', () => {
    expect(new Set(numericExamples.map((e) => e.id)).size).toBe(numericExamples.length)
  })

  it('la tolerancia es medio decimal de la cifra impresa', () => {
    expect(tolerance(0)).toBeCloseTo(0.5, 6)
    expect(tolerance(3)).toBeCloseTo(0.0005, 6)
  })

  it('detecta un resultado distinto o una cifra que la guía no dice', () => {
    const wrong: NumericExample = { id: 'x', section: '2.2', snippet: 'texto inventado', expected: 5, precision: 1, actual: () => 5.2 }
    const [result] = evaluateExamples([wrong], 'otro texto')
    expect(result).toMatchObject({ snippetInGuide: false, matches: false })
    const [ok] = evaluateExamples([{ ...wrong, actual: () => 5.04 }], 'texto inventado')
    expect(ok).toMatchObject({ snippetInGuide: true, matches: true })
  })
})

describe('RNF-05: presupuesto de descarga inicial', () => {
  const html = [
    '<html><head>',
    '<script type="module" crossorigin src="/assets/index-abc.js"></script>',
    '<link rel="modulepreload" crossorigin href="/assets/vendor-xyz.js">',
    '<link rel="stylesheet" crossorigin href="/assets/index-abc.css">',
    '<link href="/assets/extra.css" rel="stylesheet">',
    '<link rel="icon" href="/icon.svg">',
    '<script src="https://cdn.example.com/x.js"></script>',
    '</head></html>',
  ].join('\n')

  it('toma solo los scripts, estilos y precargas propios', () => {
    expect(initialAssetPaths(html)).toEqual(['assets/index-abc.js', 'assets/vendor-xyz.js', 'assets/index-abc.css', 'assets/extra.css'])
  })

  it('suma el peso comprimido y lo compara con 300 KB', () => {
    const small = measureInitialBundle(html, () => Buffer.from('a'.repeat(1000)))
    expect(small.files).toHaveLength(5)
    expect(small.withinBudget).toBe(true)
    // Datos poco comprimibles: 4 archivos de 100 KB aleatorios superan el presupuesto.
    const noisy = randomBytes(100_000)
    const big = measureInitialBundle(html, () => noisy)
    expect(big.totalBytes).toBeGreaterThan(INITIAL_BUDGET_BYTES)
    expect(big.withinBudget).toBe(false)
  })
})
