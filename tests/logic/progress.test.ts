import { describe, expect, it } from 'vitest'
import { completion, emptyProgress, markCompleted, visitSection } from '@/logic/progress/progress'

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
