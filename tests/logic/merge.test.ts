import { describe, expect, it } from 'vitest'
import { mergeStoredData } from '@/logic/persistence/merge'
import { emptyStoredData, parseStoredData, serializeStoredData, type StoredData } from '@/logic/persistence/schema'

describe('mergeStoredData', () => {
  it('fusiona dos documentos vacíos sin error', () => {
    const a = emptyStoredData()
    const b = emptyStoredData()
    const merged = mergeStoredData(a, b)
    expect(merged.progress.completedSections).toEqual([])
    expect(merged.progress.lastSectionId).toBeNull()
    expect(merged.attempts).toEqual([])
    expect(merged.reviews).toEqual([])
  })

  it('une las secciones completadas de ambos sin duplicar', () => {
    const local: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1', '1.2'], lastSectionId: '1.2' },
    }
    const remote: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.2', '1.3', '2.1'], lastSectionId: '2.1' },
    }

    const merged = mergeStoredData(local, remote)
    expect(merged.progress.completedSections.sort()).toEqual(['1.1', '1.2', '1.3', '2.1'].sort())
    expect(merged.progress.lastSectionId).toBe('1.2') // Prioriza local si existe
  })

  it('usa lastSectionId remoto si local es null', () => {
    const local = emptyStoredData()
    const remote: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['2.1'], lastSectionId: '2.1' },
    }
    const merged = mergeStoredData(local, remote)
    expect(merged.progress.lastSectionId).toBe('2.1')
  })

  it('combina intentos, deduplica idénticos y ordena cronológicamente', () => {
    const attempt1 = {
      moduleId: 1,
      takenAt: '2026-10-01T10:00:00.000Z',
      correct: 10,
      total: 12,
      failedQuestionIds: ['m1-q01', 'm1-q02'],
      confidence: 80,
    }
    const attempt2 = {
      moduleId: 2,
      takenAt: '2026-10-02T10:00:00.000Z',
      correct: 11,
      total: 12,
      failedQuestionIds: ['m2-q01'],
      confidence: 90,
    }
    const attempt3 = {
      moduleId: 3,
      takenAt: '2026-10-03T10:00:00.000Z',
      correct: 12,
      total: 12,
      failedQuestionIds: [],
      confidence: 95,
    }

    const local: StoredData = {
      ...emptyStoredData(),
      attempts: [attempt2, attempt1], // Desordenado en local
    }
    const remote: StoredData = {
      ...emptyStoredData(),
      attempts: [attempt1, attempt3], // Duplicado attempt1, nuevo attempt3
    }

    const merged = mergeStoredData(local, remote)
    expect(merged.attempts).toHaveLength(3)
    expect(merged.attempts[0]?.takenAt).toBe('2026-10-01T10:00:00.000Z')
    expect(merged.attempts[1]?.takenAt).toBe('2026-10-02T10:00:00.000Z')
    expect(merged.attempts[2]?.takenAt).toBe('2026-10-03T10:00:00.000Z')
  })

  it('en repasos espaciados, conserva el estado más reciente de cada pregunta', () => {
    const reviewLocal = {
      questionId: 'm1-q01',
      box: 2,
      dueAt: '2026-10-10T12:00:00.000Z',
      lastAnsweredAt: '2026-10-05T12:00:00.000Z', // Más reciente
    }
    const reviewRemoteOld = {
      questionId: 'm1-q01',
      box: 1,
      dueAt: '2026-10-02T12:00:00.000Z',
      lastAnsweredAt: '2026-10-01T12:00:00.000Z', // Más viejo
    }
    const reviewRemoteOnly = {
      questionId: 'm2-q05',
      box: 1,
      dueAt: '2026-10-08T12:00:00.000Z',
      lastAnsweredAt: '2026-10-04T12:00:00.000Z',
    }

    const local: StoredData = { ...emptyStoredData(), reviews: [reviewLocal] }
    const remote: StoredData = { ...emptyStoredData(), reviews: [reviewRemoteOld, reviewRemoteOnly] }

    const merged = mergeStoredData(local, remote)
    expect(merged.reviews).toHaveLength(2)
    const m1Review = merged.reviews.find((r) => r.questionId === 'm1-q01')
    expect(m1Review?.box).toBe(2)
    expect(m1Review?.lastAnsweredAt).toBe('2026-10-05T12:00:00.000Z')

    const m2Review = merged.reviews.find((r) => r.questionId === 'm2-q05')
    expect(m2Review?.questionId).toBe('m2-q05')
  })

  it('el resultado fusionado pasa la validación estricta de parseStoredData', () => {
    const local: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1'], lastSectionId: '1.1' },
      attempts: [{
        moduleId: 1,
        takenAt: '2026-10-01T10:00:00.000Z',
        correct: 12,
        total: 12,
        failedQuestionIds: [],
        confidence: null,
      }],
      reviews: [{
        questionId: 'm1-q01',
        box: 1,
        dueAt: '2026-10-02T12:00:00.000Z',
        lastAnsweredAt: '2026-10-01T12:00:00.000Z',
      }],
    }
    const remote: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['2.1'], lastSectionId: '2.1' },
    }

    const merged = mergeStoredData(local, remote)
    const serialized = serializeStoredData(merged)
    expect(() => parseStoredData(serialized)).not.toThrow()
  })
})
