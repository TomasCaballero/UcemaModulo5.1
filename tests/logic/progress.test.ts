import { describe, expect, it } from 'vitest'
import {
  completion,
  emptyProgress,
  isExplicitlyUnmarked,
  markCompleted,
  unmarkCompleted,
  visitSection,
} from '@/logic/progress/progress'

describe('markCompleted', () => {
  it('agrega la sección y no muta el original', () => {
    const before = emptyProgress()
    const after = markCompleted(before, '2.1')
    expect(after.completedSections).toEqual(['2.1'])
    expect(before.completedSections).toEqual([])
  })

  it('es idempotente: marcar dos veces no repite ni cambia el objeto', () => {
    const once = markCompleted(emptyProgress(), '2.1')
    expect(markCompleted(once, '2.1')).toBe(once)
  })

  it('conserva el orden en que se marcaron', () => {
    const progress = markCompleted(markCompleted(emptyProgress(), '2.3'), '2.1')
    expect(progress.completedSections).toEqual(['2.3', '2.1'])
  })
})

describe('visitSection', () => {
  it('registra la última sección visitada', () => {
    expect(visitSection(emptyProgress(), '4.4').lastSectionId).toBe('4.4')
  })

  it('no cambia nada si es la misma sección', () => {
    const progress = visitSection(emptyProgress(), '4.4')
    expect(visitSection(progress, '4.4')).toBe(progress)
  })
})

describe('completion', () => {
  const module0 = ['0.1', '0.2', '0.3', '0.4', '0.5']

  it('4 de 5 secciones es 80 % (AC-33)', () => {
    let progress = emptyProgress()
    for (const id of ['0.1', '0.2', '0.3', '0.4']) progress = markCompleted(progress, id)
    expect(completion(progress, module0)).toEqual({ completed: 4, total: 5, percent: 80 })
  })

  it('redondea al entero más cercano', () => {
    const progress = markCompleted(emptyProgress(), '0.1')
    expect(completion(progress, ['0.1', '0.2', '0.3']).percent).toBe(33)
  })

  it('ignora secciones guardadas que no están en el conjunto medido', () => {
    const progress = markCompleted(markCompleted(emptyProgress(), '0.1'), '3.1')
    expect(completion(progress, module0)).toEqual({ completed: 1, total: 5, percent: 20 })
  })

  it('sin secciones el porcentaje es 0, no NaN', () => {
    expect(completion(emptyProgress(), [])).toEqual({ completed: 0, total: 0, percent: 0 })
  })
})

describe('unmarkCompleted', () => {
  const AT = '2026-10-24T12:00:00.000Z'

  it('quita la sección, registra la fecha y no muta el original', () => {
    const before = markCompleted(markCompleted(emptyProgress(), '2.1'), '2.2')
    const after = unmarkCompleted(before, '2.1', AT)
    expect(after.completedSections).toEqual(['2.2'])
    expect(after.sectionMarks).toEqual({ '2.1': AT })
    expect(before.completedSections).toEqual(['2.1', '2.2'])
  })

  it('si la sección no estaba vista no cambia nada', () => {
    const progress = emptyProgress()
    expect(unmarkCompleted(progress, '2.1', AT)).toBe(progress)
  })

  it('distingue una sección desmarcada a propósito de una nunca vista', () => {
    const unmarked = unmarkCompleted(markCompleted(emptyProgress(), '2.1'), '2.1', AT)
    expect(isExplicitlyUnmarked(unmarked, '2.1')).toBe(true)
    expect(isExplicitlyUnmarked(unmarked, '2.2')).toBe(false)
    expect(isExplicitlyUnmarked(markCompleted(unmarked, '2.1', AT), '2.1')).toBe(false)
  })

  it('marcar con fecha la registra', () => {
    expect(markCompleted(emptyProgress(), '2.1', AT).sectionMarks).toEqual({ '2.1': AT })
  })
})
