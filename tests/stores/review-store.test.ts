import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DATA_KEY } from '@/logic/persistence/repository'
import { emptyStoredData } from '@/logic/persistence/schema'
import type { ReviewItem } from '@/logic/review/scheduler'
import { provideServices } from '@/services'
import { useReviewStore } from '@/stores/review'
import { useUserDataStore } from '@/stores/userData'
import { installTestServices, START_TIME, type TestServices } from '../helpers/services'

const DAY = 24 * 60 * 60 * 1000
let services: TestServices

/** Simula abrir la app de nuevo: pinia nueva sobre el mismo almacenamiento. */
function reopen() {
  setActivePinia(createPinia())
  return useReviewStore()
}

function seed(items: ReviewItem[]): void {
  services.storage.set(DATA_KEY, JSON.stringify({ ...emptyStoredData(), reviews: items }))
}

const item = (questionId: string, dueMs: number, box = 0): ReviewItem => ({
  questionId,
  box,
  dueAt: new Date(dueMs).toISOString(),
  lastAnsweredAt: new Date(START_TIME - 7 * DAY).toISOString(),
})

beforeEach(() => {
  services = installTestServices()
  setActivePinia(createPinia())
})

afterEach(() => provideServices(undefined))

describe('programar preguntas falladas', () => {
  it('queda con fecha de repaso futura y no aparece como vencida hoy (AC-38)', () => {
    const review = useReviewStore()
    review.scheduleFailed(['m2-q01', 'm2-q02'])
    expect(Date.parse(review.itemFor('m2-q01')?.dueAt ?? '')).toBeGreaterThan(START_TIME)
    expect(review.dueQuestions()).toEqual([])
    expect(review.nextReviewAt()).toBe(new Date(START_TIME + DAY).toISOString())
  })

  it('al día siguiente la pregunta ya está para repasar', () => {
    const review = useReviewStore()
    review.scheduleFailed(['m2-q01'])
    services.clock.advance(DAY)
    expect(review.dueQuestions().map((q) => q.id)).toEqual(['m2-q01'])
  })

  it('acertar en el repaso posterga la fecha: la siguiente es posterior a la anterior (AC-38)', () => {
    const review = useReviewStore()
    review.scheduleFailed(['m2-q01'])
    const firstDue = Date.parse(review.itemFor('m2-q01')?.dueAt ?? '')
    services.clock.set(firstDue)
    review.recordReview('m2-q01', true)
    const secondDue = Date.parse(review.itemFor('m2-q01')?.dueAt ?? '')
    expect(secondDue).toBeGreaterThan(firstDue)
    expect(review.dueQuestions()).toEqual([])
  })

  it('fallar en el repaso vuelve a la primera caja', () => {
    seed([item('m2-q01', START_TIME - DAY, 3)])
    const review = reopen()
    review.recordReview('m2-q01', false)
    expect(review.itemFor('m2-q01')?.box).toBe(0)
  })

  it('no guarda nada si no hubo preguntas falladas', () => {
    const review = useReviewStore()
    review.scheduleFailed([])
    expect(services.storage.get(DATA_KEY)).toBeNull()
  })

  it('el calendario persiste tras cerrar y reabrir', () => {
    useReviewStore().scheduleFailed(['m2-q03'])
    expect(reopen().itemFor('m2-q03')?.box).toBe(0)
  })

  it('el calendario viaja en la exportación y se restaura con la importación (AC-40)', () => {
    useReviewStore().scheduleFailed(['m2-q03', 'm2-q04'])
    const userData = useUserDataStore()
    const { text } = userData.exportData()
    userData.resetData()
    expect(useReviewStore().itemFor('m2-q03')).toBeUndefined()
    userData.replaceData(userData.parseImport(text))
    expect(useReviewStore().itemFor('m2-q04')).toBeDefined()
  })
})

describe('preguntas para repasar', () => {
  it('devuelve exactamente las vencidas, la más atrasada primero (AC-39)', () => {
    seed([
      item('m2-q05', START_TIME - DAY),
      item('m2-q01', START_TIME - 5 * DAY),
      item('m2-q09', START_TIME + 2 * DAY),
      item('m2-q03', START_TIME - 3 * DAY),
      item('m2-q02', START_TIME - 4 * DAY),
      item('m2-q04', START_TIME - 2 * DAY),
    ])
    expect(reopen().dueQuestions().map((q) => q.id)).toEqual(['m2-q01', 'm2-q02', 'm2-q03', 'm2-q04', 'm2-q05'])
  })

  it('ignora preguntas que ya no existen en el banco, pero las conserva', () => {
    seed([item('m2-q01', START_TIME - DAY), item('borrada', START_TIME - DAY)])
    const review = reopen()
    expect(review.dueQuestions().map((q) => q.id)).toEqual(['m2-q01'])
    expect(review.itemFor('borrada')).toBeDefined()
  })

  it('sin calendario no hay nada para repasar ni próxima fecha', () => {
    const review = useReviewStore()
    expect(review.dueQuestions()).toEqual([])
    expect(review.nextReviewAt()).toBeUndefined()
    expect(review.itemFor('m2-q01')).toBeUndefined()
  })
})
