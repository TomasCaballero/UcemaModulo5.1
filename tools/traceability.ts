import type { CourseContent } from '@/content/types'

/** Preguntas de autoevaluación por módulo según el PRD (RNF-19): 86 en total. */
export const PRD_QUESTION_COUNTS: Readonly<Record<number, number>> = { 0: 7, 1: 6, 2: 10, 3: 11, 4: 10, 5: 11, 6: 19, 7: 12 }

export const MIN_BANK_SIZE = 12

export interface ModuleTrace {
  moduleId: number
  /** Preguntas de la guía (leídas del Markdown). */
  guideCount: number
  /** Preguntas de la guía que tienen al menos una pregunta de opción múltiple equivalente. */
  mapped: number
  unmapped: number[]
  bankSize: number
  status: 'ok' | 'incomplete' | 'pending'
  detail: string
}

/** Referencia que usa el banco para una pregunta de la guía: "M2-Q7". */
export const guideRef = (moduleId: number, number: number): string => `M${moduleId}-Q${number}`

/**
 * Trazabilidad de las preguntas de autoevaluación de la guía al banco (RNF-19, RNF-20).
 * Un módulo sin preguntas cargadas queda como `pending`.
 */
export function checkTraceability(guideCounts: Readonly<Record<number, number>>, content: CourseContent): ModuleTrace[] {
  return Object.keys(PRD_QUESTION_COUNTS).map(Number).map((moduleId): ModuleTrace => {
    const guideCount = guideCounts[moduleId] ?? 0
    const bank = content.questions.filter((q) => q.moduleId === moduleId)
    if (bank.length === 0) {
      return { moduleId, guideCount, mapped: 0, unmapped: [], bankSize: 0, status: 'pending', detail: 'sin banco cargado' }
    }
    const refs = new Set(bank.map((q) => q.guideQuestionRef))
    const unmapped = Array.from({ length: guideCount }, (_, i) => i + 1).filter((n) => !refs.has(guideRef(moduleId, n)))
    const problems: string[] = []
    if (unmapped.length > 0) problems.push(`sin pregunta equivalente: ${unmapped.join(', ')}`)
    if (bank.length < MIN_BANK_SIZE) problems.push(`banco de ${bank.length} (mínimo ${MIN_BANK_SIZE})`)
    return {
      moduleId,
      guideCount,
      mapped: guideCount - unmapped.length,
      unmapped,
      bankSize: bank.length,
      status: problems.length === 0 ? 'ok' : 'incomplete',
      detail: problems.length === 0 ? 'ok' : problems.join('; '),
    }
  })
}

/** Diferencias entre lo que dice la guía y lo que declara el PRD, para detectar una guía mal leída. */
export function compareWithPrd(guideCounts: Readonly<Record<number, number>>): string[] {
  const differences: string[] = []
  for (const [moduleId, expected] of Object.entries(PRD_QUESTION_COUNTS)) {
    const found = guideCounts[Number(moduleId)]
    if (found !== expected) differences.push(`Módulo ${moduleId}: la guía tiene ${found ?? 0} y el PRD declara ${expected}`)
  }
  return differences
}
