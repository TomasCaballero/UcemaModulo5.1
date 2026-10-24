import type { AttemptRecord } from '../assessment/attempt'
import type { ReviewItem } from '../review/scheduler'
import { DATA_VERSION, type StoredData } from './schema'

/** Clave única de un intento para deduplicación. */
function attemptKey(attempt: AttemptRecord): string {
  return `${attempt.moduleId}|${attempt.takenAt}|${attempt.correct}|${attempt.total}`
}

/**
 * Fusiona de forma determinística dos conjuntos de datos (`local` y `remote`).
 * Aplica unión de secciones completadas, mezcla y deduplicación de intentos de
 * evaluación cronológicos, y preservación del estado de repaso espaciado más reciente
 * para cada pregunta.
 */
export function mergeStoredData(local: StoredData, remote: StoredData): StoredData {
  // 1. Secciones completadas: unión sin repetidos
  const completedSectionsSet = new Set([
    ...local.progress.completedSections,
    ...remote.progress.completedSections,
  ])
  const completedSections = Array.from(completedSectionsSet)

  // Última sección: si el usuario está en el dispositivo local y tiene una, se prioriza local;
  // de lo contrario, se usa la remota.
  const lastSectionId = local.progress.lastSectionId ?? remote.progress.lastSectionId

  // 2. Intentos: unión deduplicada y orden ascendente por takenAt
  const seenAttempts = new Set<string>()
  const mergedAttempts: AttemptRecord[] = []

  const allAttempts = [...local.attempts, ...remote.attempts]
  for (const attempt of allAttempts) {
    const key = attemptKey(attempt)
    if (!seenAttempts.has(key)) {
      seenAttempts.add(key)
      mergedAttempts.push({
        ...attempt,
        failedQuestionIds: [...attempt.failedQuestionIds],
      })
    }
  }

  mergedAttempts.sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))

  // 3. Repasos espaciados: para cada pregunta, conservar el registro con lastAnsweredAt más reciente
  const reviewByQuestion = new Map<string, ReviewItem>()

  for (const item of [...local.reviews, ...remote.reviews]) {
    const existing = reviewByQuestion.get(item.questionId)
    if (!existing) {
      reviewByQuestion.set(item.questionId, { ...item })
    } else {
      const existingTime = Date.parse(existing.lastAnsweredAt)
      const itemTime = Date.parse(item.lastAnsweredAt)
      if (itemTime > existingTime) {
        reviewByQuestion.set(item.questionId, { ...item })
      }
    }
  }

  const mergedReviews = Array.from(reviewByQuestion.values())

  return {
    version: DATA_VERSION,
    progress: {
      completedSections,
      lastSectionId,
    },
    attempts: mergedAttempts,
    reviews: mergedReviews,
  }
}
