import { describe, expect, it } from 'vitest'
import { mean, median, modes, sampleStdDev, sampleVariance, sum } from '@/logic/statistics/descriptive'
import {
  binomialPmf,
  choose,
  normalCdf,
  poissonPmf,
  tCdf,
  tCritical,
  tTwoTailedPValue,
  zScore,
} from '@/logic/statistics/distributions'
import {
  bernoulliLikelihood,
  cohensD,
  confidenceInterval,
  mleProportion,
  standardError,
  tStatistic,
} from '@/logic/statistics/inference'

// Los números esperados salen de la guía (Módulo 2); tolerancia de 3 decimales (RNF-18).

describe('Módulo 2.2: medidas descriptivas', () => {
  const data = [2, 4, 4, 6, 9]

  it('ejemplo con números: media 5, mediana 4, moda 4, s² = 7, s ≈ 2.65', () => {
    expect(sum(data)).toBe(25)
    expect(mean(data)).toBe(5)
    expect(median(data)).toBe(4)
    expect(modes(data)).toEqual([4])
    expect(sampleVariance(data)).toBe(7)
    expect(sampleStdDev(data)).toBeCloseTo(2.646, 3)
  })

  it('valores atípicos: la media salta a 21.2 y la mediana sigue en 4', () => {
    const withOutlier = [2, 4, 4, 6, 90]
    expect(mean(withOutlier)).toBeCloseTo(21.2, 3)
    expect(median(withOutlier)).toBe(4)
  })

  it('autoevaluación 1: media 7, s² = 10, s ≈ 3.16', () => {
    const values = [3, 5, 7, 9, 11]
    expect(mean(values)).toBe(7)
    expect(sampleVariance(values)).toBe(10)
    expect(sampleStdDev(values)).toBeCloseTo(3.162, 3)
  })

  it('mediana con cantidad par promedia los dos centrales', () => {
    expect(median([1, 2, 3, 10])).toBe(2.5)
  })

  it('devuelve todas las modas cuando hay empate', () => {
    expect(modes([3, 1, 1, 3, 5])).toEqual([1, 3])
  })

  it('rechaza listas vacías o demasiado cortas', () => {
    expect(() => mean([])).toThrow(RangeError)
    expect(() => median([])).toThrow(RangeError)
    expect(() => modes([])).toThrow(RangeError)
    expect(() => sampleVariance([5])).toThrow(RangeError)
  })
})

describe('Módulo 2.4: distribuciones', () => {
  it('binomial: 3 caras en 10 tiradas ≈ 0.117 (120/1024)', () => {
    expect(choose(10, 3)).toBe(120)
    expect(binomialPmf(10, 3, 0.5)).toBeCloseTo(0.117, 3)
  })

  it('autoevaluación 2: 2 caras en 4 tiradas = 0.375', () => {
    expect(binomialPmf(4, 2, 0.5)).toBeCloseTo(0.375, 3)
  })

  it('Poisson con λ = 3: P(0) ≈ 0.050 y P(2) ≈ 0.224', () => {
    expect(poissonPmf(3, 0)).toBeCloseTo(0.05, 3)
    expect(poissonPmf(3, 2)).toBeCloseTo(0.224, 3)
  })

  it('puntaje z: 130 con μ = 100 y σ = 15 da z = 2; con 85 da z = -1', () => {
    expect(zScore(130, 100, 15)).toBe(2)
    expect(zScore(85, 100, 15)).toBe(-1)
  })

  it('Normal: ~2.3 % supera z = 2 y ~16 % queda bajo z = -1', () => {
    expect(1 - normalCdf(2)).toBeCloseTo(0.023, 3)
    expect(normalCdf(-1)).toBeCloseTo(0.159, 3)
    expect(normalCdf(0)).toBeCloseTo(0.5, 6)
  })

  it('regla 68-95-99.7', () => {
    expect(normalCdf(1) - normalCdf(-1)).toBeCloseTo(0.683, 3)
    expect(normalCdf(2) - normalCdf(-2)).toBeCloseTo(0.954, 3)
    expect(normalCdf(3) - normalCdf(-3)).toBeCloseTo(0.997, 3)
  })

  it('rechaza parámetros inválidos', () => {
    expect(() => choose(3, 5)).toThrow(RangeError)
    expect(() => choose(2.5, 1)).toThrow(RangeError)
    expect(() => binomialPmf(10, 3, 1.5)).toThrow(RangeError)
    expect(() => poissonPmf(0, 1)).toThrow(RangeError)
    expect(() => poissonPmf(3, -1)).toThrow(RangeError)
    expect(() => zScore(1, 0, 0)).toThrow(RangeError)
  })
})

describe('Módulo 2.7: distribución t y contraste de las baterías', () => {
  it('t = -2 con 35 gl: valor crítico ≈ 2.03 y p ≈ 0.053', () => {
    expect(tCritical(0.05, 35)).toBeCloseTo(2.03, 2)
    expect(tTwoTailedPValue(-2, 35)).toBeCloseTo(0.053, 3)
  })

  it('con x̄ = 95: t = -2.5 y p ≈ 0.017', () => {
    expect(tStatistic(95, 100, 12, 36)).toBe(-2.5)
    expect(tTwoTailedPValue(-2.5, 35)).toBeCloseTo(0.017, 3)
  })

  it('tCdf es simétrica y vale 0.5 en el origen', () => {
    expect(tCdf(0, 10)).toBeCloseTo(0.5, 6)
    expect(tCdf(1.5, 10) + tCdf(-1.5, 10)).toBeCloseTo(1, 6)
  })

  it('rechaza parámetros inválidos', () => {
    expect(() => tCdf(1, 0)).toThrow(RangeError)
    expect(() => tCritical(0, 10)).toThrow(RangeError)
  })
})

describe('Módulos 2.5 a 2.7: inferencia', () => {
  it('error estándar: 600/√100 = 60 y autoevaluación 5 (2 y 1)', () => {
    expect(standardError(600, 100)).toBe(60)
    expect(standardError(20, 100)).toBe(2)
    expect(standardError(20, 400)).toBe(1)
  })

  it('TLC: 1000 ± 2×60 va de 880 a 1120', () => {
    const [lower, upper] = confidenceInterval(1000, 600, 100, 2)
    expect(lower).toBeCloseTo(880, 3)
    expect(upper).toBeCloseTo(1120, 3)
  })

  it('intervalo de confianza al 95 %: [932.4 ; 1167.6]', () => {
    const [lower, upper] = confidenceInterval(1050, 600, 100)
    expect(lower).toBeCloseTo(932.4, 3)
    expect(upper).toBeCloseTo(1167.6, 3)
  })

  it('verosimilitud de la moneda: L(0.5) ≈ 0.00098, L(0.7) ≈ 0.00222 y MLE = 0.7', () => {
    expect(bernoulliLikelihood(0.5, 7, 10)).toBeCloseTo(0.00098, 5)
    expect(bernoulliLikelihood(0.7, 7, 10)).toBeCloseTo(0.00222, 5)
    expect(mleProportion(7, 10)).toBe(0.7)
    expect(bernoulliLikelihood(0.7, 7, 10)).toBeGreaterThan(bernoulliLikelihood(0.6, 7, 10))
    expect(bernoulliLikelihood(0.7, 7, 10)).toBeGreaterThan(bernoulliLikelihood(0.8, 7, 10))
  })

  it('d de Cohen: baterías ≈ -0.33 y contraste con n = 100 000 (t ≈ 13, d ≈ 0.04)', () => {
    expect(cohensD(96 - 100, 12)).toBeCloseTo(-0.333, 3)
    expect(cohensD(0.5, 12)).toBeCloseTo(0.042, 3)
    expect(tStatistic(100.5, 100, 12, 100_000)).toBeCloseTo(13.18, 2)
  })

  it('rechaza parámetros inválidos', () => {
    expect(() => standardError(-1, 10)).toThrow(RangeError)
    expect(() => standardError(1, 0)).toThrow(RangeError)
    expect(() => cohensD(1, 0)).toThrow(RangeError)
    expect(() => bernoulliLikelihood(2, 1, 2)).toThrow(RangeError)
    expect(() => bernoulliLikelihood(0.5, 3, 2)).toThrow(RangeError)
    expect(() => mleProportion(1, 0)).toThrow(RangeError)
  })
})
