import { describe, expect, it } from 'vitest'
import { compareSectionIds, createCourseIndex } from '@/content/navigation'
import type { CourseContent, ModuleId, Section } from '@/content/types'

const section = (id: Section['id'], moduleId: ModuleId): Section => ({ id, moduleId, title: `T${id}`, blocks: [] })

const content: CourseContent = {
  modules: [
    { id: 3, title: 'Tres', summary: 's3' },
    { id: 2, title: 'Dos', summary: 's2' },
  ],
  // Desordenadas a propósito: el índice debe ordenarlas numéricamente.
  sections: [section('3.1', 3), section('2.10', 2), section('2.2', 2), section('2.1', 2)],
  glossary: [],
  questions: [],
  simulations: [],
}

describe('compareSectionIds', () => {
  it('ordena por módulo y luego por número, no alfabéticamente', () => {
    expect(['3.1', '2.10', '2.2', '2.1'].sort(compareSectionIds)).toEqual(['2.1', '2.2', '2.10', '3.1'])
  })
})

describe('createCourseIndex', () => {
  const index = createCourseIndex(content)

  it('ordena los módulos por id', () => {
    expect(index.modules.map((m) => m.id)).toEqual([2, 3])
    expect(index.getModule(3)?.title).toBe('Tres')
    expect(index.getModule(9)).toBeUndefined()
  })

  it('lista las secciones de un módulo en orden', () => {
    expect(index.sectionsOf(2).map((s) => s.id)).toEqual(['2.1', '2.2', '2.10'])
    expect(index.sectionsOf(5)).toEqual([])
  })

  it('lista todos los ids en el orden de la guía', () => {
    expect(index.sectionIds()).toEqual(['2.1', '2.2', '2.10', '3.1'])
  })

  it('consulta secciones por id', () => {
    expect(index.getSection('2.2')?.title).toBe('T2.2')
    expect(index.getSection('9.9')).toBeUndefined()
    expect(index.hasSection('3.1')).toBe(true)
    expect(index.hasSection('9.9')).toBe(false)
  })

  it('da anterior y siguiente (AC-03): 2.2 → anterior 2.1, siguiente 2.10', () => {
    const { previous, next } = index.neighbors('2.2')
    expect(previous?.id).toBe('2.1')
    expect(next?.id).toBe('2.10')
  })

  it('en los extremos falta un vecino; entre módulos continúa al siguiente', () => {
    expect(index.neighbors('2.1')).toEqual({ next: expect.objectContaining({ id: '2.2' }) })
    expect(index.neighbors('2.10').next?.id).toBe('3.1')
    expect(index.neighbors('3.1').next).toBeUndefined()
  })

  it('una sección inexistente no tiene vecinos', () => {
    expect(index.neighbors('9.9')).toEqual({})
  })
})
