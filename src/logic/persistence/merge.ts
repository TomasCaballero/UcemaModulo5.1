import type { AttemptRecord } from '../assessment/attempt'
import type { ProgressData } from '../progress/progress'
import type { ReviewItem } from '../review/scheduler'
import { DATA_VERSION, type StoredData } from './schema'

/** Clave única de un intento para deduplicación. */
function attemptKey(attempt: AttemptRecord): string {
  return `${attempt.moduleId}|${attempt.takenAt}|${attempt.correct}|${attempt.total}`
}

/**
 * Une las secciones vistas. Cada sección con fecha de cambio manual se decide por el lado
 * que la cambió más tarde (marcada o no); un lado sin fecha cuenta como más viejo, y si
 * ninguno tiene fecha vale la unión de siempre.
 */
function mergeSections(
  local: ProgressData,
  remote: ProgressData,
): { completedSections: string[]; sectionMarks: Record<string, string> | undefined } {
  const ids = new Set([
    ...local.completedSections,
    ...remote.completedSections,
    ...Object.keys(local.sectionMarks ?? {}),
    ...Object.keys(remote.sectionMarks ?? {}),
  ])
  const completedSections: string[] = []
  const sectionMarks: Record<string, string> = {}

  for (const id of ids) {
    const sides = [local, remote].map((side) => ({
      present: side.completedSections.includes(id),
      at: side.sectionMarks?.[id],
      time: side.sectionMarks?.[id] === undefined ? -Infinity : Date.parse(side.sectionMarks[id]),
    }))
    const newest = Math.max(...sides.map((side) => side.time))
    const winners = sides.filter((side) => side.time === newest)
    if (winners.some((side) => side.present)) completedSections.push(id)

    const stamped = sides.find((side) => side.time === newest && side.at !== undefined)
    if (stamped?.at !== undefined) sectionMarks[id] = stamped.at
  }

  return {
    completedSections,
    sectionMarks: Object.keys(sectionMarks).length > 0 ? sectionMarks : undefined,
  }
}

/**
 * Fusiona de forma determinística dos conjuntos de datos (`local` y `remote`).
 * Aplica unión de secciones completadas, mezcla y deduplicación de intentos de
 * evaluación cronológicos, y preservación del estado de repaso espaciado más reciente
 * para cada pregunta.
 */
export function mergeStoredData(local: StoredData, remote: StoredData): StoredData {
  // 1. Secciones completadas: unión, salvo que un cambio manual más reciente las haya desmarcado
  const { completedSections, sectionMarks } = mergeSections(local.progress, remote.progress)

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
      ...(sectionMarks && { sectionMarks }),
    },
    attempts: mergedAttempts,
    reviews: mergedReviews,
  }
}
