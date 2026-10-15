import { describe, expect, it } from 'vitest'
import { MathRandom, SeededRandom, randomInt, shuffle } from '@/core/random'

describe('SeededRandom', () => {
  it('es determinista para la misma semilla', () => {
    const a = new SeededRandom(7)
    const b = new SeededRandom(7)
    expect([a.next(), a.next(), a.next()]).toEqual([b.next(), b.next(), b.next()])
  })

  it('produce valores en [0, 1)', () => {
    const random = new SeededRandom(1)
    for (let i = 0; i < 1000; i++) {
      const value = random.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('MathRandom', () => {
  it('produce valores en [0, 1)', () => {
    const value = new MathRandom().next()
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(1)
  })
})

describe('randomInt', () => {
  it('devuelve enteros en [0, max)', () => {
    const random = new SeededRandom(3)
    for (let i = 0; i < 200; i++) {
      const value = randomInt(random, 5)
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(5)
    }
  })

  it.each([0, -1, 1.5])('rechaza max inválido %s', (max) => {
    expect(() => randomInt(new SeededRandom(1), max)).toThrow(RangeError)
  })
})

describe('shuffle', () => {
  it('conserva los elementos y no muta la entrada', () => {
    const input = [1, 2, 3, 4, 5]
    const output = shuffle(new SeededRandom(9), input)
    expect(input).toEqual([1, 2, 3, 4, 5])
    expect([...output].sort()).toEqual(input)
  })

  it('varía la posición de un elemento en 20 intentos (AC-25)', () => {
    const random = new SeededRandom(2026)
    const positions = new Set<number>()
    for (let i = 0; i < 20; i++) {
      positions.add(shuffle(random, ['a', 'b', 'c', 'd']).indexOf('a'))
    }
    expect(positions.size).toBeGreaterThan(1)
  })
})
