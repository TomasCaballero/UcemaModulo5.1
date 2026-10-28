import { describe, expect, it } from 'vitest'
import {
  allBootstrapSamples,
  averagedVariance,
  exactBootstrapStandardError,
  lassoOneVariable,
  majorityVoteAccuracy,
  meanPredictionError,
  ridgeOneVariable,
  shrunkMeanError,
} from '@/logic/statistics/learning'

describe('aprendizaje estadístico: sesgo, varianza y remuestreo', () => {
  it('encoger la media: sesgo² + varianza', () => {
    expect(shrunkMeanError(1, 2, 4)).toEqual({ bias2: 0, variance: 4, mse: 4 })
    const small = shrunkMeanError(0.8, 2, 4)
    expect(small.variance).toBeCloseTo(2.56, 10)
    expect(small.bias2).toBeCloseTo(0.16, 10)
    expect(small.mse).toBeCloseTo(2.72, 10)
    expect(shrunkMeanError(0.8, 10, 4).mse).toBeCloseTo(6.56, 10)
  })

  it('el error de entrenamiento del promedio es optimista', () => {
    const { training, test } = meanPredictionError(4, 5)
    expect(training).toBeCloseTo(3.2, 10)
    expect(test).toBeCloseTo(4.8, 10)
  })

  it('enumera las n^n muestras bootstrap', () => {
    const samples = allBootstrapSamples([2, 4, 9])
    expect(samples).toHaveLength(27)
    expect(samples[0]).toEqual([2, 2, 2])
    expect(samples.filter((s) => !s.includes(2))).toHaveLength(8)
  })

  it('error estándar bootstrap exacto de la media: sqrt((26/3)/3)', () => {
    expect(exactBootstrapStandardError([2, 4, 9])).toBeCloseTo(Math.sqrt(26 / 9), 10)
    expect(exactBootstrapStandardError([5, 5])).toBe(0)
  })

  it('Ridge divide y Lasso resta (y deja en cero)', () => {
    expect(ridgeOneVariable(3, 2)).toBeCloseTo(1, 10)
    expect(ridgeOneVariable(0.5, 2)).toBeCloseTo(1 / 6, 10)
    expect(lassoOneVariable(3, 2)).toBeCloseTo(2, 10)
    expect(lassoOneVariable(0.5, 2)).toBe(0)
    expect(lassoOneVariable(-3, 2)).toBeCloseTo(-2, 10)
    expect(lassoOneVariable(3, 0)).toBe(3)
  })

  it('varianza del promedio de modelos correlacionados', () => {
    expect(averagedVariance(4, 0, 100)).toBeCloseTo(0.04, 10)
    expect(averagedVariance(4, 0.5, 100)).toBeCloseTo(2.02, 10)
    expect(averagedVariance(4, 1, 100)).toBeCloseTo(4, 10)
  })

  it('voto de mayoría de clasificadores independientes', () => {
    expect(majorityVoteAccuracy(5, 0.7)).toBeCloseTo(0.83692, 5)
    expect(majorityVoteAccuracy(5, 0.45)).toBeCloseTo(0.40687, 5)
    expect(majorityVoteAccuracy(1, 0.7)).toBeCloseTo(0.7, 10)
  })
})
