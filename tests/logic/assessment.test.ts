import { describe, expect, it } from 'vitest'
import { SeededRandom } from '@/core/random'
import type { Question } from '@/content/types'
import { attemptsOfModule, buildAttempt, type AttemptRecord } from '@/logic/assessment/attempt'
import { correctPosition, isCorrectChoice, presentQuestion } from '@/logic/assessment/present'
import { calibration, calibrationMessage, percentOf } from '@/logic/assessment/scoring'

const question: Question = {
  id: 'q',
  moduleId: 2,
  prompt: 'p',
  options: ['correcta', 'b', 'c', 'd'],
  correctIndex: 0,
  explanation: 'e',
  sectionId: '2.1',
}

describe('presentQuestion', () => {
  it('conserva las opciones y no modifica la pregunta original', () => {
    const presented = presentQuestion(question, new SeededRandom(1))
    expect(presented.options.map((o) => o.text).sort()).toEqual(['b', 'c', 'correcta', 'd'])
    expect(question.options).toEqual(['correcta', 'b', 'c', 'd'])
    for (const option of presented.options) expect(question.options[option.originalIndex]).toBe(option.text)
  })

  it('la posición correcta varía en 20 intentos simulados (AC-25)', () => {
    const random = new SeededRandom(7)
    const positions = new Set<number>()
    for (let attempt = 0; attempt < 20; attempt++) positions.add(correctPosition(presentQuestion(question, random)))
    expect(positions.size).toBeGreaterThan(1)
  })

  it('correctPosition apunta a la opción correcta aunque se mezcle', () => {
    for (let seed = 0; seed < 25; seed++) {
      const presented = presentQuestion(question, new SeededRandom(seed))
      expect(presented.options[correctPosition(presented)]?.text).toBe('correcta')
    }
  })

  it('isCorrectChoice distingue la opción correcta de las demás', () => {
    const presented = presentQuestion(question, new SeededRandom(3))
    const right = correctPosition(presented)
    expect(isCorrectChoice(presented, right)).toBe(true)
    expect(isCorrectChoice(presented, (right + 1) % 4)).toBe(false)
  })
})

describe('scoring', () => {
  it('percentOf redondea al entero más cercano', () => {
    expect(percentOf(9, 12)).toBe(75)
    expect(percentOf(1, 3)).toBe(33)
    expect(() => percentOf(1, 0)).toThrow(RangeError)
  })

  it('estimó 90 % y obtuvo 60 %: diferencia de 30 puntos (AC-31)', () => {
    const result = calibration(90, 6, 10)
    expect(result).toEqual({ estimate: 90, obtained: 60, difference: 30, verdict: 'overestimated' })
    expect(calibrationMessage(result)).toBe('Estimaste 90 %, obtuviste 60 % (diferencia: 30 puntos)')
  })

  it('distingue subestimar y estimar bien', () => {
    expect(calibration(50, 9, 12).verdict).toBe('underestimated')
    expect(calibration(75, 9, 12)).toMatchObject({ verdict: 'calibrated', difference: 0 })
  })

  it('usa singular cuando la diferencia es de un punto', () => {
    expect(calibrationMessage(calibration(76, 9, 12))).toContain('diferencia: 1 punto)')
  })
})

describe('attempts', () => {
  it('9 aciertos de 12 da 9/12 y lista las 3 falladas (AC-28)', () => {
    const results = Array.from({ length: 12 }, (_, i) => ({ questionId: `q${i}`, correct: i >= 3 }))
    const attempt = buildAttempt({ moduleId: 2, takenAt: '2026-10-14T12:00:00.000Z', results, confidence: 80 })
    expect(attempt).toMatchObject({ correct: 9, total: 12, confidence: 80 })
    expect(attempt.failedQuestionIds).toEqual(['q0', 'q1', 'q2'])
  })

  it('rechaza un intento sin respuestas', () => {
    expect(() => buildAttempt({ moduleId: 2, takenAt: 'x', results: [], confidence: null })).toThrow(RangeError)
  })

  it('ordena cronológicamente los intentos de un módulo (AC-37)', () => {
    const make = (moduleId: number, takenAt: string, correct: number): AttemptRecord => ({
      moduleId,
      takenAt,
      correct,
      total: 12,
      failedQuestionIds: Array.from({ length: 12 - correct }, (_, i) => `q${i}`),
      confidence: null,
    })
    const attempts = [
      make(2, '2026-10-16T10:00:00.000Z', 11),
      make(3, '2026-10-15T10:00:00.000Z', 5),
      make(2, '2026-10-14T10:00:00.000Z', 7),
      make(2, '2026-10-15T10:00:00.000Z', 9),
    ]
    expect(attemptsOfModule(attempts, 2).map((a) => a.correct)).toEqual([7, 9, 11])
    expect(attemptsOfModule(attempts, 5)).toEqual([])
  })
})
