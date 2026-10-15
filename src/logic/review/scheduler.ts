const DAY_MS = 24 * 60 * 60 * 1000

/** Estado de repaso de una pregunta fallada. */
export interface ReviewItem {
  questionId: string
  /** Caja actual: cuanto más alta, más espaciado el próximo repaso. */
  box: number
  /** Cuándo vuelve a tocar repasarla (ISO 8601). */
  dueAt: string
  /** Última vez que se respondió, en una evaluación o en un repaso (ISO 8601). */
  lastAnsweredAt: string
}

/** Algoritmo de espaciado intercambiable (patrón Strategy). */
export interface SchedulingStrategy {
  readonly name: string
  /** Estado de la pregunta tras responderla en el instante `now` (ms desde epoch). */
  afterAnswer(previous: ReviewItem | undefined, questionId: string, correct: boolean, now: number): ReviewItem
}

/**
 * Cajas de Leitner: un acierto sube de caja y espacia más el repaso; un error
 * vuelve a la primera. Por defecto: 1, 3, 7, 14 y 30 días.
 */
export class LeitnerStrategy implements SchedulingStrategy {
  readonly name = 'leitner'

  constructor(private readonly intervalsInDays: readonly number[] = [1, 3, 7, 14, 30]) {
    if (intervalsInDays.length === 0 || intervalsInDays.some((days, i) => days <= 0 || (i > 0 && days <= (intervalsInDays[i - 1] as number)))) {
      throw new RangeError('Los intervalos deben ser positivos y estrictamente crecientes')
    }
  }

  afterAnswer(previous: ReviewItem | undefined, questionId: string, correct: boolean, now: number): ReviewItem {
    const lastBox = this.intervalsInDays.length - 1
    const box = correct ? Math.min((previous?.box ?? -1) + 1, lastBox) : 0
    return {
      questionId,
      box,
      dueAt: new Date(now + (this.intervalsInDays[box] as number) * DAY_MS).toISOString(),
      lastAnsweredAt: new Date(now).toISOString(),
    }
  }
}

/** Registra una respuesta: reemplaza el estado de esa pregunta o lo agrega si es nueva. */
export function recordAnswer(
  items: readonly ReviewItem[],
  questionId: string,
  correct: boolean,
  strategy: SchedulingStrategy,
  now: number,
): ReviewItem[] {
  const position = items.findIndex((item) => item.questionId === questionId)
  const updated = strategy.afterAnswer(items[position], questionId, correct, now)
  if (position === -1) return [...items, updated]
  return items.map((item, index) => (index === position ? updated : item))
}

/** Programa el repaso de preguntas falladas en una evaluación (RF-38). */
export function scheduleFailures(
  items: readonly ReviewItem[],
  failedQuestionIds: readonly string[],
  strategy: SchedulingStrategy,
  now: number,
): ReviewItem[] {
  return failedQuestionIds.reduce<ReviewItem[]>((current, id) => recordAnswer(current, id, false, strategy, now), [...items])
}

/** Preguntas cuya fecha de repaso llegó (RF-39), la más atrasada primero. */
export function dueItems(items: readonly ReviewItem[], now: number): ReviewItem[] {
  return items
    .filter((item) => Date.parse(item.dueAt) <= now)
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt) || a.questionId.localeCompare(b.questionId))
}

/** Fecha del próximo repaso pendiente en el futuro, si hay alguno. */
export function nextDueAt(items: readonly ReviewItem[], now: number): string | undefined {
  return items
    .map((item) => item.dueAt)
    .filter((dueAt) => Date.parse(dueAt) > now)
    .sort((a, b) => Date.parse(a) - Date.parse(b))[0]
}
