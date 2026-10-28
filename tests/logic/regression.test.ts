import { describe, expect, it } from 'vitest'
import { attenuationFactor, fStatistic, simpleOls, tRatio, waldEstimate } from '@/logic/statistics/regression'

// Ejemplo de la guía (Módulo 3.3): años de estudio y salario de 5 personas.
const years = [8, 10, 12, 14, 16]
const salaries = [22, 26, 28, 36, 38]

describe('Módulo 3.3: regresión lineal simple', () => {
  const fit = simpleOls(years, salaries)

  it('recta de la guía: ŷ = 4.8 + 2.1x', () => {
    expect(fit.slope).toBeCloseTo(2.1, 10)
    expect(fit.intercept).toBeCloseTo(4.8, 10)
  })

  it('residuos 0.4, 0.2, -2, 1.8, -0.4 que suman 0', () => {
    expect(fit.residuals.map((r) => Number(r.toFixed(3)))).toEqual([0.4, 0.2, -2, 1.8, -0.4])
    expect(fit.residuals.reduce((a, b) => a + b, 0)).toBeCloseTo(0, 10)
  })

  it('SSR = 7.6, SST = 184 y ee(β̂₁) ≈ 0.25', () => {
    expect(fit.ssr).toBeCloseTo(7.6, 10)
    expect(fit.sst).toBeCloseTo(184, 10)
    expect(fit.slopeStandardError).toBeCloseTo(0.2517, 4)
  })

  it('con una sola variable, F = t²', () => {
    const t = tRatio(fit.slope, fit.slopeStandardError)
    expect(fStatistic(fit.sst, fit.ssr, 1, 3)).toBeCloseTo(t ** 2, 8)
  })

  it('rechaza datos inválidos', () => {
    expect(() => simpleOls([1, 2], [1, 2])).toThrow(RangeError)
    expect(() => simpleOls([1, 2, 3], [1, 2])).toThrow(RangeError)
    expect(() => simpleOls([2, 2, 2], [1, 2, 3])).toThrow(RangeError)
  })
})

describe('contrastes', () => {
  it('t respecto de un valor nulo distinto de cero', () => {
    expect(tRatio(2.5, 0.25, 2)).toBeCloseTo(2, 10)
  })

  it('rechaza errores estándar y grados de libertad no positivos', () => {
    expect(() => tRatio(1, 0)).toThrow(RangeError)
    expect(() => fStatistic(10, 5, 0, 3)).toThrow(RangeError)
    expect(() => fStatistic(10, 0, 1, 3)).toThrow(RangeError)
  })
})

describe('sesgo de variable omitida (ampliación de 3.4)', () => {
  const study = [10, 12, 14, 16, 18]
  const ability = [1, 1, 2, 3, 3]
  const wage = study.map((s, i) => 2 * s + 3 * (ability[i] as number))

  it('la pendiente simple es el efecto verdadero más efecto de la omitida × su pendiente sobre x', () => {
    const short = simpleOls(study, wage).slope
    const delta = simpleOls(study, ability).slope
    expect(short).toBeCloseTo(2.9, 10)
    expect(short).toBeCloseTo(2 + 3 * delta, 10)
  })
})

describe('error de medición e instrumentos (ampliación de 3.7)', () => {
  it('factor de atenuación: mitad de ruido achica el efecto a la mitad', () => {
    expect(attenuationFactor(4, 4)).toBe(0.5)
    expect(attenuationFactor(4, 0)).toBe(1)
    expect(() => attenuationFactor(0, 1)).toThrow(RangeError)
  })

  it('estimador de Wald: 0.4 / 0.5 = 0.8 y no acepta instrumentos irrelevantes', () => {
    expect(waldEstimate(0.4, 0.5)).toBeCloseTo(0.8, 10)
    expect(() => waldEstimate(0.4, 0)).toThrow(RangeError)
  })
})
