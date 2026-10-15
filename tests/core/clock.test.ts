import { describe, expect, it } from 'vitest'
import { FixedClock, SystemClock } from '@/core/clock'

describe('FixedClock', () => {
  it('permite fijar y avanzar el tiempo', () => {
    const clock = new FixedClock(1000)
    expect(clock.now()).toBe(1000)
    clock.advance(500)
    expect(clock.now()).toBe(1500)
    clock.set(42)
    expect(clock.now()).toBe(42)
  })
})

describe('SystemClock', () => {
  it('devuelve la hora actual', () => {
    const before = Date.now()
    const value = new SystemClock().now()
    expect(value).toBeGreaterThanOrEqual(before)
    expect(value).toBeLessThanOrEqual(Date.now())
  })
})
