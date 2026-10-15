import { describe, expect, it } from 'vitest'
import { MemoryStorage, type KeyValueStorage } from '@/core/storage'
import type { AttemptRecord } from '@/logic/assessment/attempt'
import type { ReviewItem } from '@/logic/review/scheduler'
import { markCompleted, visitSection } from '@/logic/progress/progress'
import { CORRUPT_BACKUP_KEY, DATA_KEY, DataRepository } from '@/logic/persistence/repository'
import {
  emptyStoredData,
  InvalidDataError,
  parseStoredData,
  serializeStoredData,
  type StoredData,
} from '@/logic/persistence/schema'

const sampleAttempt: AttemptRecord = {
  moduleId: 2,
  takenAt: '2026-10-14T12:00:00.000Z',
  correct: 9,
  total: 12,
  failedQuestionIds: ['m2-q01', 'm2-q02', 'm2-q03'],
  confidence: 90,
}

const sampleReview: ReviewItem = {
  questionId: 'm2-q01',
  box: 1,
  dueAt: '2026-10-17T12:00:00.000Z',
  lastAnsweredAt: '2026-10-14T12:00:00.000Z',
}

const sampleData = (): StoredData => ({
  version: 1,
  progress: visitSection(markCompleted(markCompleted(emptyStoredData().progress, '2.1'), '2.4'), '2.4'),
  attempts: [sampleAttempt, { ...sampleAttempt, takenAt: '2026-10-15T09:30:00.000Z', correct: 12, failedQuestionIds: [], confidence: null }],
  reviews: [sampleReview, { ...sampleReview, questionId: 'm2-q02', box: 0 }],
})

/** Almacenamiento que lanza al escribir, como uno bloqueado o lleno. */
class FailingStorage implements KeyValueStorage {
  readonly persistent = true
  get(): string | null {
    return null
  }
  set(): void {
    throw new DOMException('lleno', 'QuotaExceededError')
  }
  remove(): void {
    throw new DOMException('bloqueado', 'SecurityError')
  }
}

describe('schema', () => {
  it('serializa y vuelve a leer idéntico (RNF-16)', () => {
    const data = sampleData()
    expect(parseStoredData(serializeStoredData(data))).toEqual(data)
  })

  it('un documento anterior a las evaluaciones (sin historial) se lee con historial vacío', () => {
    const text = JSON.stringify({ version: 1, progress: { completedSections: ['2.1'], lastSectionId: null } })
    expect(parseStoredData(text).attempts).toEqual([])
  })

  it('un documento anterior al repaso espaciado (sin calendario) se lee con calendario vacío', () => {
    const text = JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: null }, attempts: [] })
    expect(parseStoredData(text).reviews).toEqual([])
  })

  it('elimina ids repetidos al leer', () => {
    const text = JSON.stringify({ version: 1, progress: { completedSections: ['2.1', '2.1'], lastSectionId: null } })
    expect(parseStoredData(text).progress.completedSections).toEqual(['2.1'])
  })

  const withAttempt = (change: object): string =>
    JSON.stringify({
      version: 1,
      progress: { completedSections: [], lastSectionId: null },
      attempts: [{ ...sampleAttempt, ...change }],
    })

  it.each([
    ['historial que no es lista', JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: null }, attempts: {} })],
    ['intento que no es objeto', JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: null }, attempts: [3] })],
    ['módulo fuera de rango', withAttempt({ moduleId: 8 })],
    ['fecha inválida', withAttempt({ takenAt: 'ayer' })],
    ['fecha que no es texto', withAttempt({ takenAt: 5 })],
    ['total en cero', withAttempt({ total: 0, correct: 0, failedQuestionIds: [] })],
    ['aciertos mayores al total', withAttempt({ correct: 13 })],
    ['falladas que no son lista de ids', withAttempt({ failedQuestionIds: [1, 2, 3] })],
    ['falladas que no coinciden con el puntaje', withAttempt({ failedQuestionIds: ['m2-q01'] })],
    ['confianza fuera de 0-100', withAttempt({ confidence: 120 })],
    ['confianza que no es número', withAttempt({ confidence: 'alta' })],
  ])('rechaza un historial inválido: %s', (_caso, text) => {
    expect(() => parseStoredData(text)).toThrow(InvalidDataError)
  })

  const withReviews = (reviews: unknown): string =>
    JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: null }, attempts: [], reviews })

  it.each([
    ['calendario que no es lista', withReviews({})],
    ['repaso que no es objeto', withReviews([5])],
    ['repaso sin id de pregunta', withReviews([{ ...sampleReview, questionId: '' }])],
    ['caja inválida', withReviews([{ ...sampleReview, box: -1 }])],
    ['fecha de repaso inválida', withReviews([{ ...sampleReview, dueAt: 'pronto' }])],
    ['última respuesta inválida', withReviews([{ ...sampleReview, lastAnsweredAt: 3 }])],
    ['pregunta repetida', withReviews([sampleReview, sampleReview])],
  ])('rechaza un calendario de repaso inválido: %s', (_caso, text) => {
    expect(() => parseStoredData(text)).toThrow(InvalidDataError)
  })

  it.each([
    ['no es JSON', '{no'],
    ['no es un objeto', '[]'],
    ['versión desconocida', JSON.stringify({ version: 2, progress: { completedSections: [], lastSectionId: null } })],
    ['sin progreso', JSON.stringify({ version: 1 })],
    ['secciones no es lista', JSON.stringify({ version: 1, progress: { completedSections: 'x', lastSectionId: null } })],
    ['id de sección inválido', JSON.stringify({ version: 1, progress: { completedSections: ['9.9'], lastSectionId: null } })],
    ['id que no es texto', JSON.stringify({ version: 1, progress: { completedSections: [3], lastSectionId: null } })],
    ['última sección inválida', JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: 'abc' } })],
  ])('rechaza datos inválidos: %s', (_caso, text) => {
    expect(() => parseStoredData(text)).toThrow(InvalidDataError)
  })
})

describe('DataRepository', () => {
  it('sin datos guardados devuelve el documento vacío', () => {
    const repo = new DataRepository(new MemoryStorage(true))
    expect(repo.load()).toEqual({ data: emptyStoredData(), status: 'empty' })
  })

  it('guarda y recupera', () => {
    const repo = new DataRepository(new MemoryStorage(true))
    expect(repo.save(sampleData())).toBe(true)
    expect(repo.load()).toEqual({ data: sampleData(), status: 'ok' })
  })

  it('clear borra lo guardado', () => {
    const repo = new DataRepository(new MemoryStorage(true))
    repo.save(sampleData())
    repo.clear()
    expect(repo.load().status).toBe('empty')
  })

  it('datos ilegibles: empieza de cero y conserva una copia del original', () => {
    const storage = new MemoryStorage(true)
    storage.set(DATA_KEY, '{roto')
    const result = new DataRepository(storage).load()
    expect(result.status).toBe('corrupt')
    expect(result.data).toEqual(emptyStoredData())
    expect(storage.get(CORRUPT_BACKUP_KEY)).toBe('{roto')
  })

  it('save devuelve false si el almacenamiento rechaza la escritura', () => {
    expect(new DataRepository(new FailingStorage()).save(sampleData())).toBe(false)
  })

  it('clear no lanza si el almacenamiento falla', () => {
    expect(() => new DataRepository(new FailingStorage()).clear()).not.toThrow()
  })

  it('load no lanza si leer falla: lo trata como ilegible', () => {
    const storage: KeyValueStorage = {
      persistent: true,
      get() {
        throw new Error('SecurityError')
      },
      set() {},
      remove() {},
    }
    expect(new DataRepository(storage).load().status).toBe('corrupt')
  })

  it('informa si el almacenamiento es persistente (RNF-15)', () => {
    expect(new DataRepository(new MemoryStorage(true)).persistent).toBe(true)
    expect(new DataRepository(new MemoryStorage(false)).persistent).toBe(false)
  })

  it('no pierde nada en 100 ciclos de cerrar y reabrir (RNF-14)', () => {
    const storage = new MemoryStorage(true)
    let expected = emptyStoredData()
    for (let cycle = 0; cycle < 100; cycle++) {
      const repo = new DataRepository(storage) // "reabrir": repositorio nuevo sobre el mismo almacenamiento
      const loaded = repo.load().data
      expect(loaded).toEqual(expected)
      const id = `${cycle % 8}.${Math.floor(cycle / 8) + 1}`
      expected = {
        ...expected,
        progress: visitSection(markCompleted(expected.progress, id), id),
      }
      expect(repo.save(expected)).toBe(true)
    }
    expect(new DataRepository(storage).load().data.progress.completedSections).toHaveLength(100)
  })

  it('exportar a archivo e importar en un dispositivo sin datos deja todo idéntico (AC-40, RNF-16)', () => {
    const origin = new DataRepository(new MemoryStorage(true))
    origin.save(sampleData())
    const file = serializeStoredData(origin.load().data)

    const other = new DataRepository(new MemoryStorage(true))
    other.save(parseStoredData(file))
    expect(other.load().data).toEqual(origin.load().data)
  })
})
