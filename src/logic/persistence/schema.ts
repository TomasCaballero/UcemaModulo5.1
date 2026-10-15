import type { AttemptRecord } from '../assessment/attempt'
import { emptyProgress, type ProgressData } from '../progress/progress'
import type { ReviewItem } from '../review/scheduler'

export const DATA_VERSION = 1

/** Documento completo que se guarda en el dispositivo y se exporta a archivo. */
export interface StoredData {
  version: typeof DATA_VERSION
  progress: ProgressData
  /** Historial de intentos de evaluación, en el orden en que se registraron. */
  attempts: AttemptRecord[]
  /** Calendario de repaso espaciado de las preguntas falladas. */
  reviews: ReviewItem[]
}

export class InvalidDataError extends Error {
  constructor(reason: string) {
    super(reason)
    this.name = 'InvalidDataError'
  }
}

const SECTION_ID = /^[0-7]\.\d+$/

export function emptyStoredData(): StoredData {
  return { version: DATA_VERSION, progress: emptyProgress(), attempts: [], reviews: [] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function parseProgress(value: unknown): ProgressData {
  if (!isRecord(value)) throw new InvalidDataError('Falta el progreso')
  const { completedSections, lastSectionId } = value
  if (!Array.isArray(completedSections)) throw new InvalidDataError('Las secciones vistas deben ser una lista')
  const ids = completedSections.map((id) => {
    if (typeof id !== 'string' || !SECTION_ID.test(id)) throw new InvalidDataError(`Id de sección inválido: ${String(id)}`)
    return id
  })
  if (lastSectionId !== null && (typeof lastSectionId !== 'string' || !SECTION_ID.test(lastSectionId))) {
    throw new InvalidDataError(`Última sección inválida: ${String(lastSectionId)}`)
  }
  return { completedSections: [...new Set(ids)], lastSectionId }
}

function parseAttempt(value: unknown): AttemptRecord {
  if (!isRecord(value)) throw new InvalidDataError('Un intento debe ser un objeto')
  const { moduleId, takenAt, correct, total, failedQuestionIds, confidence } = value
  if (!isCount(moduleId) || moduleId > 7) throw new InvalidDataError(`Módulo inválido en un intento: ${String(moduleId)}`)
  if (typeof takenAt !== 'string' || Number.isNaN(Date.parse(takenAt))) {
    throw new InvalidDataError(`Fecha inválida en un intento: ${String(takenAt)}`)
  }
  if (!isCount(total) || total === 0 || !isCount(correct) || correct > total) {
    throw new InvalidDataError('Puntaje inválido en un intento')
  }
  if (!Array.isArray(failedQuestionIds) || !failedQuestionIds.every((id) => typeof id === 'string')) {
    throw new InvalidDataError('Las preguntas falladas deben ser una lista de ids')
  }
  if (failedQuestionIds.length !== total - correct) {
    throw new InvalidDataError('Las preguntas falladas no coinciden con el puntaje')
  }
  if (confidence !== null && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) {
    throw new InvalidDataError(`Confianza inválida en un intento: ${String(confidence)}`)
  }
  return { moduleId, takenAt, correct, total, failedQuestionIds: [...failedQuestionIds], confidence }
}

function parseAttempts(value: unknown): AttemptRecord[] {
  // Los documentos guardados antes de existir las evaluaciones no traen el campo.
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new InvalidDataError('El historial debe ser una lista')
  return value.map(parseAttempt)
}

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function parseReviewItem(value: unknown): ReviewItem {
  if (!isRecord(value)) throw new InvalidDataError('Un repaso debe ser un objeto')
  const { questionId, box, dueAt, lastAnsweredAt } = value
  if (typeof questionId !== 'string' || questionId === '') throw new InvalidDataError('Repaso con pregunta inválida')
  if (!isCount(box)) throw new InvalidDataError(`Caja inválida en un repaso: ${String(box)}`)
  if (!isValidDate(dueAt) || !isValidDate(lastAnsweredAt)) throw new InvalidDataError('Fecha inválida en un repaso')
  return { questionId, box, dueAt, lastAnsweredAt }
}

function parseReviews(value: unknown): ReviewItem[] {
  // Los documentos guardados antes del repaso espaciado no traen el campo.
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new InvalidDataError('El calendario de repaso debe ser una lista')
  const items = value.map(parseReviewItem)
  if (new Set(items.map((item) => item.questionId)).size !== items.length) {
    throw new InvalidDataError('El calendario de repaso repite preguntas')
  }
  return items
}

/** Interpreta y valida un documento JSON; lanza `InvalidDataError` si no es válido. */
export function parseStoredData(text: string): StoredData {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new InvalidDataError('El archivo no es un JSON válido')
  }
  if (!isRecord(raw)) throw new InvalidDataError('El documento debe ser un objeto')
  if (raw.version !== DATA_VERSION) throw new InvalidDataError(`Versión no soportada: ${String(raw.version)}`)
  return {
    version: DATA_VERSION,
    progress: parseProgress(raw.progress),
    attempts: parseAttempts(raw.attempts),
    reviews: parseReviews(raw.reviews),
  }
}

export function serializeStoredData(data: StoredData): string {
  return JSON.stringify(data, null, 2)
}
