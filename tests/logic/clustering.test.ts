import { describe, expect, it } from 'vitest'
import { entropy, f1 } from '@/logic/classification/classification'
import { euclidean, kDistances, neighborhoodSide } from '@/logic/clustering/distance'

describe('Módulo 4.3: entropía y F1', () => {
  it('entropía de la guía: 6 pagan y 4 no ≈ 0.971 bits; nodo puro 0; moneda justa 1', () => {
    expect(entropy([0.6, 0.4])).toBeCloseTo(0.971, 3)
    expect(entropy([1, 0])).toBe(0)
    expect(entropy([0.5, 0.5])).toBe(1)
  })

  it('F1 del ejemplo de la guía ≈ 0.44 y 0 si precisión y recall son 0', () => {
    expect(f1(8 / 26, 0.8)).toBeCloseTo(0.444, 3)
    expect(f1(0, 0)).toBe(0)
  })
})

describe('Módulo 4.5: distancias', () => {
  it('distancia euclídea de la guía: (1,2) a (4,6) = 5', () => {
    expect(euclidean([1, 2], [4, 6])).toBe(5)
    expect(() => euclidean([1], [1, 2])).toThrow(RangeError)
  })

  it('distancia al 2.º vecino de los puntos de la guía: núcleo si ≤ Eps = 1', () => {
    const points = [1, 1.5, 2, 2.5, 3.4, 8, 8.4, 9, 20]
    const distances = kDistances(points, 2).map((d) => Number(d.toFixed(2)))
    expect(distances).toEqual([1, 0.5, 0.5, 0.9, 1.4, 1, 0.6, 1, 11.6])
    expect(points.filter((_, i) => (distances[i] as number) <= 1)).toEqual([1, 1.5, 2, 2.5, 8, 8.4, 9])
    expect(() => kDistances(points, 0)).toThrow(RangeError)
  })

  it('para abarcar el 10 % del volumen el vecindario crece con la dimensión', () => {
    expect(neighborhoodSide(0.1, 1)).toBeCloseTo(0.1, 10)
    expect(neighborhoodSide(0.1, 10)).toBeCloseTo(0.794, 3)
    expect(() => neighborhoodSide(0, 2)).toThrow(RangeError)
  })
})
