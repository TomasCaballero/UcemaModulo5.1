import { describe, expect, it } from 'vitest'
import { courseContent, courseIndex } from '@/content'
import { sectionCatalog } from '@/content/data/concepts'
import { findUnresolvedReferences } from '@/content/references'
import type { CourseContent } from '@/content/types'
import { validateContent } from '@/content/validate'
import { blockComponents } from '@/components/content/blockRegistry'

describe('contenido cargado', () => {
  it('es válido', () => {
    expect(validateContent(courseContent)).toEqual([])
  })

  it('tiene las 49 secciones del catálogo más el anexo opcional 1.7, en orden', () => {
    const ids = courseContent.sections.map((s) => s.id)
    expect(ids).toHaveLength(50)
    expect(ids.filter((id) => id.startsWith('2.'))).toEqual(['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7'])
    expect(courseContent.sections.filter((s) => s.optional).map((s) => s.id)).toEqual(['1.7'])
    expect(ids.filter((id) => id !== '1.7')).toEqual(sectionCatalog.map((entry) => entry.id))
  })

  it('consulta secciones por id', () => {
    expect(courseIndex.getSection('2.4')?.title).toBe('Distribuciones de probabilidad')
    expect(courseIndex.getSection('9.9')).toBeUndefined()
    expect(courseIndex.hasSection('2.4')).toBe(true)
    expect(courseIndex.hasSection('9.9')).toBe(false)
  })

  it('cada tipo de bloque usado tiene componente registrado', () => {
    const used = new Set(courseContent.sections.flatMap((s) => s.blocks.map((b) => b.type)))
    for (const type of used) expect(blockComponents[type], `bloque "${type}"`).toBeDefined()
  })

  it('con los 8 módulos cargados no queda ninguna referencia sin resolver', () => {
    expect(findUnresolvedReferences(courseContent)).toEqual([])
  })

  it('las referencias a módulos no cargados quedan pendientes', () => {
    const upToModule2 = { ...courseContent, sections: courseContent.sections.filter((s) => s.moduleId >= 2) }
    const pending = findUnresolvedReferences(upToModule2)
    expect(pending).toContain('2.6 → 0.5')
    for (const reference of pending) expect(reference.split('→')[1]?.trim().startsWith('2.'), reference).toBe(false)
  })
})

describe('findUnresolvedReferences', () => {
  const content = (text: string, withTarget: boolean): CourseContent => ({
    modules: [],
    sections: [
      { id: '2.1', moduleId: 2, title: 'A', blocks: [{ type: 'paragraph', text }] },
      ...(withTarget ? [{ id: '0.4' as const, moduleId: 0 as const, title: 'B', blocks: [] }] : []),
    ],
    glossary: [],
    questions: [],
    simulations: [],
  })

  it('no reporta referencias que existen', () => {
    expect(findUnresolvedReferences(content('ver Módulo 0.4', true))).toEqual([])
  })

  it('reporta las que no existen', () => {
    expect(findUnresolvedReferences(content('ver Módulo 0.4', false))).toEqual(['2.1 → 0.4'])
  })

  it('revisa todos los tipos de bloque con texto', () => {
    const ref = 'Módulo 7.7'
    const all: CourseContent = {
      modules: [],
      sections: [
        {
          id: '2.1',
          moduleId: 2,
          title: 'A',
          blocks: [
            { type: 'subheading', text: ref },
            { type: 'list', items: [ref] },
            { type: 'callout', kind: 'ojo', text: ref },
            { type: 'analogy', text: ref },
            { type: 'table', headers: [ref], rows: [[ref]] },
            { type: 'workedExample', title: ref, steps: [ref], result: ref },
            { type: 'formula', latex: 'x' },
            { type: 'miniCheck', questionIds: [] },
            { type: 'simulation', simulationId: 'IN-01' },
          ],
        },
      ],
      glossary: [],
      questions: [],
      simulations: [],
    }
    expect(findUnresolvedReferences(all)).toHaveLength(9)
  })
})
