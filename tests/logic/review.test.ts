import { describe, expect, it } from 'vitest'
import { FixedClock } from '@/core/clock'
import {
  dueItems,
  LeitnerStrategy,
  nextDueAt,
  recordAnswer,
  scheduleFailures,
  type ReviewItem,
} from '@/logic/review/scheduler'

const DAY = 24 * 60 * 60 * 1000
const START = Date.UTC(2026, 9, 14, 12, 0, 0)
const iso = (ms: number): string => new Date(ms).toISOString()

describe('LeitnerStrategy', () => {
  const strategy = new LeitnerStrategy()

  it('una pregunta fallada por primera vez vuelve en 1 día', () => {
    const item = strategy.afterAnswer(undefined, 'q1', false, START)
    expect(item).toEqual({ questionId: 'q1', box: 0, dueAt: iso(START + DAY), lastAnsweredAt: iso(START) })
  })

  it('cada acierto sube de caja y espacia más el repaso: 1, 3, 7, 14 y 30 días', () => {
    let item = strategy.afterAnswer(undefined, 'q1', false, START)
    const waits: number[] = []
    let now = START
    for (let review = 0; review < 4; review++) {
      now = Date.parse(item.dueAt)
      item = strategy.afterAnswer(item, 'q1', true, now)
      waits.push((Date.parse(item.dueAt) - now) / DAY)
    }
    expect(waits).toEqual([3, 7, 14, 30])
  })

  it('en la última caja sigue repasando cada 30 días', () => {
    let item: ReviewItem | undefined = { questionId: 'q1', box: 4, dueAt: iso(START), lastAnsweredAt: iso(START) }
    item = strategy.afterAnswer(item, 'q1', true, START)
    expect(item.box).toBe(4)
    expect(Date.parse(item.dueAt) - START).toBe(30 * DAY)
  })

  it('un error vuelve a la primera caja, sin importar dónde estaba', () => {
    const item = strategy.afterAnswer({ questionId: 'q1', box: 3, dueAt: iso(START), lastAnsweredAt: iso(START) }, 'q1', false, START)
    expect(item.box).toBe(0)
    expect(Date.parse(item.dueAt) - START).toBe(DAY)
  })

  it('acepta intervalos propios', () => {
    const custom = new LeitnerStrategy([2, 5])
    expect(Date.parse(custom.afterAnswer(undefined, 'q', false, START).dueAt) - START).toBe(2 * DAY)
    expect(strategy.name).toBe('leitner')
  })

  it.each([[[]], [[0, 1]], [[3, 3]], [[5, 2]]])('rechaza intervalos inválidos %j', (intervals) => {
    expect(() => new LeitnerStrategy(intervals)).toThrow(RangeError)
  })
})

describe('calendario de repaso', () => {
  const strategy = new LeitnerStrategy()

  it('una pregunta fallada hoy tiene fecha de repaso futura; al acertarla en el repaso, la siguiente es posterior (AC-38)', () => {
    const clock = new FixedClock(START)
    let items = scheduleFailures([], ['q1'], strategy, clock.now())
    const firstDue = Date.parse(items[0]?.dueAt ?? '')
    expect(firstDue).toBeGreaterThan(clock.now())

    clock.set(firstDue) // llega el día del repaso
    items = recordAnswer(items, 'q1', true, strategy, clock.now())
    expect(Date.parse(items[0]?.dueAt ?? '')).toBeGreaterThan(firstDue)
  })

  it('volver a fallar una pregunta ya programada reinicia su caja y no la duplica', () => {
    const first = scheduleFailures([], ['q1', 'q2'], strategy, START)
    const advanced = recordAnswer(first, 'q1', true, strategy, START + DAY)
    expect(advanced[0]?.box).toBe(1)
    const again = scheduleFailures(advanced, ['q1'], strategy, START + 2 * DAY)
    expect(again).toHaveLength(2)
    expect(again.map((i) => i.questionId)).toEqual(['q1', 'q2'])
    expect(again[0]?.box).toBe(0)
    expect(again[1]).toEqual(first[1])
  })

  it('no modifica la lista original', () => {
    const items: ReviewItem[] = []
    scheduleFailures(items, ['q1'], strategy, START)
    recordAnswer(items, 'q1', false, strategy, START)
    expect(items).toEqual([])
  })

  it('sin preguntas falladas deja el calendario igual', () => {
    const items = scheduleFailures([], ['q1'], strategy, START)
    expect(scheduleFailures(items, [], strategy, START)).toEqual(items)
  })
})

describe('dueItems', () => {
  const make = (questionId: string, dueMs: number): ReviewItem => ({
    questionId,
    box: 0,
    dueAt: iso(dueMs),
    lastAnsweredAt: iso(START - DAY),
  })

  it('devuelve exactamente las preguntas cuya fecha llegó, la más atrasada primero (AC-39)', () => {
    const items = [
      make('vencida-2', START - 2 * DAY),
      make('futura-1', START + DAY),
      make('vencida-1', START - DAY),
      make('justo-ahora', START),
      make('futura-2', START + 5 * DAY),
      make('vencida-3', START - 3 * DAY),
      make('vencida-4', START - 4 * DAY),
    ]
    expect(dueItems(items, START).map((i) => i.questionId)).toEqual([
      'vencida-4',
      'vencida-3',
      'vencida-2',
      'vencida-1',
      'justo-ahora',
    ])
  })

  it('desempata por id cuando la fecha es la misma', () => {
    const items = [make('b', START - DAY), make('a', START - DAY)]
    expect(dueItems(items, START).map((i) => i.questionId)).toEqual(['a', 'b'])
  })

  it('sin nada vencido devuelve una lista vacía', () => {
    expect(dueItems([make('q', START + DAY)], START)).toEqual([])
  })
})

describe('nextDueAt', () => {
  it('es la fecha futura más cercana', () => {
    const items: ReviewItem[] = [
      { questionId: 'a', box: 1, dueAt: iso(START + 7 * DAY), lastAnsweredAt: iso(START) },
      { questionId: 'b', box: 0, dueAt: iso(START + DAY), lastAnsweredAt: iso(START) },
      { questionId: 'c', box: 0, dueAt: iso(START - DAY), lastAnsweredAt: iso(START) },
    ]
    expect(nextDueAt(items, START)).toBe(iso(START + DAY))
  })

  it('es undefined si no hay nada programado a futuro', () => {
    expect(nextDueAt([], START)).toBeUndefined()
  })
})
