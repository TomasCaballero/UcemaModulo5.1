import { defineStore } from 'pinia'
import { courseIndex } from '@/content'
import type { Question } from '@/content/types'
import { dueItems, nextDueAt, recordAnswer, scheduleFailures, type ReviewItem } from '@/logic/review/scheduler'
import { useServices } from '@/services'
import { useUserDataStore } from './userData'

/** Calendario de repaso espaciado de las preguntas falladas (RF-38, RF-39). */
export const useReviewStore = defineStore('review', () => {
  const userData = useUserDataStore()
  const { clock, scheduler } = useServices()

  /** Estado de repaso de una pregunta, si está programada. */
  function itemFor(questionId: string): ReviewItem | undefined {
    return userData.data.reviews.find((item) => item.questionId === questionId)
  }

  /**
   * Preguntas cuya fecha llegó, la más atrasada primero. Depende del reloj, que no es
   * reactivo: se consulta al abrir la pantalla, no se observa.
   */
  function dueQuestions(): Question[] {
    return dueItems(userData.data.reviews, clock.now()).flatMap((item) => {
      const question = courseIndex.getQuestion(item.questionId)
      return question ? [question] : []
    })
  }

  /** Fecha del próximo repaso futuro, o `undefined` si no hay ninguno programado. */
  function nextReviewAt(): string | undefined {
    return nextDueAt(userData.data.reviews, clock.now())
  }

  /** Programa las preguntas falladas en una evaluación para volver a verlas. */
  function scheduleFailed(questionIds: readonly string[]): void {
    if (questionIds.length === 0) return
    userData.update((data) => ({
      ...data,
      reviews: scheduleFailures(data.reviews, questionIds, scheduler, clock.now()),
    }))
  }

  /** Registra la respuesta a una pregunta en una sesión de repaso. */
  function recordReview(questionId: string, correct: boolean): void {
    userData.update((data) => ({
      ...data,
      reviews: recordAnswer(data.reviews, questionId, correct, scheduler, clock.now()),
    }))
  }

  return { itemFor, dueQuestions, nextReviewAt, scheduleFailed, recordReview }
})
