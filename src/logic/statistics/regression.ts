import { mean } from './descriptive'

export interface SimpleOlsFit {
  intercept: number
  slope: number
  residuals: number[]
  /** Suma de residuos al cuadrado (variación no explicada). */
  ssr: number
  /** Variación total de y respecto a su media. */
  sst: number
  /** Error estándar de la pendiente: σ̂ / √Σ(x − x̄)², con σ̂² = SSR / (n − 2). */
  slopeStandardError: number
}

/** Regresión lineal simple por mínimos cuadrados ordinarios (Módulo 3.3). */
export function simpleOls(x: readonly number[], y: readonly number[]): SimpleOlsFit {
  if (x.length !== y.length) throw new RangeError('x e y deben tener el mismo largo')
  if (x.length < 3) throw new RangeError('Se necesitan al menos 3 observaciones')
  const xBar = mean(x)
  const yBar = mean(y)
  const sxx = x.reduce((acc, xi) => acc + (xi - xBar) ** 2, 0)
  if (sxx === 0) throw new RangeError('x no varía: la pendiente no está definida')
  const sxy = x.reduce((acc, xi, i) => acc + (xi - xBar) * ((y[i] as number) - yBar), 0)
  const slope = sxy / sxx
  const intercept = yBar - slope * xBar
  const residuals = x.map((xi, i) => (y[i] as number) - (intercept + slope * xi))
  const ssr = residuals.reduce((acc, r) => acc + r ** 2, 0)
  const sst = y.reduce((acc, yi) => acc + (yi - yBar) ** 2, 0)
  const slopeStandardError = Math.sqrt(ssr / (x.length - 2)) / Math.sqrt(sxx)
  return { intercept, slope, residuals, ssr, sst, slopeStandardError }
}

/** Cociente t: cuántos errores estándar separan la estimación del valor de la hipótesis nula. */
export function tRatio(estimate: number, standardError: number, nullValue = 0): number {
  if (standardError <= 0) throw new RangeError(`El error estándar debe ser positivo: ${standardError}`)
  return (estimate - nullValue) / standardError
}

/**
 * Estadístico F de restricciones: cuánto empeora el ajuste (SSR) al quitar `q` variables, en
 * relación con el error que queda en el modelo completo. F = [(SSRr − SSRur)/q] / [SSRur/gl].
 */
export function fStatistic(ssrRestricted: number, ssrUnrestricted: number, q: number, residualDf: number): number {
  if (q <= 0 || residualDf <= 0) throw new RangeError('q y los grados de libertad deben ser positivos')
  if (ssrUnrestricted <= 0) throw new RangeError('La SSR del modelo completo debe ser positiva')
  return (ssrRestricted - ssrUnrestricted) / q / (ssrUnrestricted / residualDf)
}

/**
 * Factor de atenuación por error de medición clásico en x: la pendiente estimada tiende a
 * β · Var(x*) / (Var(x*) + Var(ruido)).
 */
export function attenuationFactor(trueVariance: number, noiseVariance: number): number {
  if (trueVariance <= 0 || noiseVariance < 0) throw new RangeError('Varianzas inválidas')
  return trueVariance / (trueVariance + noiseVariance)
}

/**
 * Estimador de Wald (IV con un instrumento binario): efecto del instrumento sobre y dividido por
 * su efecto sobre x.
 */
export function waldEstimate(effectOnY: number, effectOnX: number): number {
  if (effectOnX === 0) throw new RangeError('El instrumento no mueve a x: no es relevante')
  return effectOnY / effectOnX
}
