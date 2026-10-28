import { describe, expect, it } from 'vitest'
import type { CourseContent, Question } from '@/content/types'
import { validateContent } from '@/content/validate'

const question = (overrides: Partial<Question> = {}): Question => ({
  id: 'q1',
  moduleId: 2,
  prompt: '¿Cuál es la varianza?',
  options: ['5', '6', '7', '8'],
  correctIndex: 2,
  explanation: 's² = 7',
  sectionId: '2.2',
  ...overrides,
})

const validContent = (): CourseContent => ({
  modules: [{ id: 2, title: 'Estadística', summary: 'Resumen' }],
  sections: [
    {
      id: '2.2',
      moduleId: 2,
      title: 'Medidas',
      blocks: [
        { type: 'miniCheck', questionIds: ['q1'] },
        { type: 'simulation', simulationId: 'IN-17' },
      ],
    },
  ],
  glossary: [{ term: 'Varianza', definition: 'Dispersión', references: ['2.2', '6'] }],
  questions: [question()],
  simulations: [
    { id: 'IN-17', moduleId: 2, title: 'Explorador', description: 'Muestra media y mediana', sectionIds: ['2.2'] },
  ],
})

describe('validateContent', () => {
  it('acepta contenido válido', () => {
    expect(validateContent(validContent())).toEqual([])
  })

  it('detecta ids duplicados', () => {
    const content = validContent()
    content.sections.push({ ...content.sections[0]! })
    content.questions.push(question())
    content.simulations.push({ ...content.simulations[0]! })
    const errors = validateContent(content)
    expect(errors).toContain('Sección duplicada: 2.2')
    expect(errors).toContain('Pregunta duplicada: q1')
    expect(errors).toContain('Simulación duplicada: IN-17')
  })

  it('detecta sección con id inconsistente con su módulo', () => {
    const content = validContent()
    content.sections[0]!.moduleId = 3
    expect(validateContent(content)).toContain('Sección 2.2: id inconsistente con el módulo 3')
  })

  it('detecta referencias rotas en mini-chequeos y simulaciones', () => {
    const content = validContent()
    content.sections[0]!.blocks = [
      { type: 'miniCheck', questionIds: ['nope'] },
      { type: 'simulation', simulationId: 'IN-99' },
    ]
    const errors = validateContent(content)
    expect(errors).toContain('Sección 2.2: mini-chequeo con pregunta inexistente nope')
    expect(errors).toContain('Sección 2.2: simulación inexistente IN-99')
  })

  it('exige fuentes en las ampliaciones y contenido en los repasos (RNF-24)', () => {
    const content = validContent()
    content.sections[0]!.blocks = [
      { type: 'deepDive', title: 'Por qué', text: 'Porque sí', sources: [] },
      { type: 'recall', items: [] },
    ]
    const errors = validateContent(content)
    expect(errors).toContain('Sección 2.2: la ampliación "Por qué" no cita fuentes')
    expect(errors).toContain('Sección 2.2: el bloque "¿Te acordás?" está vacío')
  })

  it('exige de 1 a 3 preguntas por mini-chequeo', () => {
    const content = validContent()
    content.sections[0]!.blocks = [{ type: 'miniCheck', questionIds: [] }]
    expect(validateContent(content)).toContain('Sección 2.2: el mini-chequeo debe tener de 1 a 3 preguntas')
  })

  it('detecta glosario sin referencias o con referencias mal formadas', () => {
    const content = validContent()
    content.glossary = [
      { term: 'Vacío', definition: 'd', references: [] },
      { term: 'Roto', definition: 'd', references: ['8.1' as '2.2', 'abc' as '2.2'] },
    ]
    const errors = validateContent(content)
    expect(errors).toContain('Glosario "Vacío": sin referencias')
    expect(errors).toContain('Glosario "Roto": referencia inválida 8.1')
    expect(errors).toContain('Glosario "Roto": referencia inválida abc')
  })

  it('acepta referencias del glosario a secciones aún no cargadas (se resuelven aparte)', () => {
    const content = validContent()
    content.glossary[0]!.references = ['6.4']
    expect(validateContent(content)).toEqual([])
  })

  it('detecta preguntas con cantidad de opciones inválida', () => {
    const content = validContent()
    content.questions = [question({ options: ['a', 'b', 'c'], correctIndex: 0 })]
    expect(validateContent(content)).toContain('Pregunta q1: debe tener 4 o 5 opciones (tiene 3)')
  })

  it.each([-1, 4, 1.5])('detecta correctIndex fuera de rango (%s)', (correctIndex) => {
    const content = validContent()
    content.questions = [question({ correctIndex })]
    expect(validateContent(content)).toContain('Pregunta q1: correctIndex fuera de rango')
  })

  it('detecta opciones repetidas y sección inexistente en preguntas', () => {
    const content = validContent()
    content.questions = [question({ options: ['a', 'a', 'b', 'c'], sectionId: '5.1' })]
    const errors = validateContent(content)
    expect(errors).toContain('Pregunta q1: opciones repetidas')
    expect(errors).toContain('Pregunta q1: sección inexistente 5.1')
  })

  it('detecta simulaciones con id inválido, descripción vacía o sección inexistente', () => {
    const content = validContent()
    content.simulations = [{ id: 'X-1', moduleId: 2, title: 't', description: '  ', sectionIds: ['9.9' as '2.2'] }]
    content.sections[0]!.blocks = []
    const errors = validateContent(content)
    expect(errors).toContain('Simulación X-1: id con formato inválido')
    expect(errors).toContain('Simulación X-1: descripción vacía')
    expect(errors).toContain('Simulación X-1: secciones inválidas')
  })
})
