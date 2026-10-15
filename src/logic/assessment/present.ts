import { shuffle, type Random } from '@/core/random'
import type { Question } from '@/content/types'

export interface PresentedOption {
  text: string
  /** Posición de la opción en el banco de preguntas (antes de mezclar). */
  originalIndex: number
}

/** Una pregunta con sus opciones en el orden en que se muestran en este intento. */
export interface PresentedQuestion {
  question: Question
  options: PresentedOption[]
}

/** Mezcla el orden de las opciones (RF-25); el banco original no se modifica. */
export function presentQuestion(question: Question, random: Random): PresentedQuestion {
  const options = question.options.map((text, originalIndex) => ({ text, originalIndex }))
  return { question, options: shuffle(random, options) }
}

export function correctPosition(presented: PresentedQuestion): number {
  return presented.options.findIndex((option) => option.originalIndex === presented.question.correctIndex)
}

export function isCorrectChoice(presented: PresentedQuestion, position: number): boolean {
  return position === correctPosition(presented)
}
