/** Un intento de evaluación de módulo, tal como se guarda en el historial (RF-36). */
export interface AttemptRecord {
  moduleId: number
  /** Fecha y hora en formato ISO 8601. */
  takenAt: string
  correct: number
  total: number
  failedQuestionIds: string[]
  /** Estimación previa de dominio (0 a 100), o `null` si no se pidió. */
  confidence: number | null
}

export interface QuestionResult {
  questionId: string
  correct: boolean
}

export function buildAttempt(input: {
  moduleId: number
  takenAt: string
  results: readonly QuestionResult[]
  confidence: number | null
}): AttemptRecord {
  if (input.results.length === 0) throw new RangeError('Un intento necesita al menos una respuesta')
  const failed = input.results.filter((result) => !result.correct)
  return {
    moduleId: input.moduleId,
    takenAt: input.takenAt,
    correct: input.results.length - failed.length,
    total: input.results.length,
    failedQuestionIds: failed.map((result) => result.questionId),
    confidence: input.confidence,
  }
}

/** Intentos de un módulo en orden cronológico (RF-37). */
export function attemptsOfModule(attempts: readonly AttemptRecord[], moduleId: number): AttemptRecord[] {
  return attempts
    .filter((attempt) => attempt.moduleId === moduleId)
    .sort((a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt))
}
