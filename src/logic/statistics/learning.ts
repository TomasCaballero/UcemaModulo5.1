import { mean } from './descriptive'
import { binomialPmf } from './distributions'

export interface ErrorDecomposition {
  bias2: number
  variance: number
  /** Error cuadrático medio: sesgo² + varianza. */
  mse: number
}

/**
 * Error del estimador "encogido" $c\,\bar{x}$ de $\mu$, cuando $\text{Var}(\bar{x})$ es `meanVariance`:
 * su sesgo es $(c - 1)\mu$ y su varianza, $c^2\,\text{Var}(\bar{x})$.
 */
export function shrunkMeanError(factor: number, mu: number, meanVariance: number): ErrorDecomposition {
  const bias2 = ((factor - 1) * mu) ** 2
  const variance = factor ** 2 * meanVariance
  return { bias2, variance, mse: bias2 + variance }
}

/**
 * Error cuadrático esperado de predecir con el promedio de `n` datos de varianza `sigma2`:
 * sobre los mismos datos (entrenamiento) y sobre un dato nuevo (prueba).
 */
export function meanPredictionError(sigma2: number, n: number): { training: number; test: number } {
  return { training: ((n - 1) / n) * sigma2, test: (1 + 1 / n) * sigma2 }
}

/** Todas las muestras bootstrap posibles (con orden y con reemplazo): $n^n$ listas de `n` datos. */
export function allBootstrapSamples(data: readonly number[]): number[][] {
  let samples: number[][] = [[]]
  for (let draw = 0; draw < data.length; draw++) {
    samples = samples.flatMap((sample) => data.map((value) => [...sample, value]))
  }
  return samples
}

/** Error estándar bootstrap exacto de la media: la desviación típica de las medias de todas las muestras. */
export function exactBootstrapStandardError(data: readonly number[]): number {
  const means = allBootstrapSamples(data).map(mean)
  const center = mean(means)
  return Math.sqrt(means.reduce((acc, m) => acc + (m - center) ** 2, 0) / means.length)
}

/**
 * Ridge con una sola variable estandarizada ($\sum x^2 = 1$), minimizando $\text{RSS} + \lambda\beta^2$:
 * divide la estimación de mínimos cuadrados por $1 + \lambda$.
 */
export function ridgeOneVariable(leastSquares: number, lambda: number): number {
  return leastSquares / (1 + lambda)
}

/**
 * Lasso con una sola variable estandarizada ($\sum x^2 = 1$), minimizando $\text{RSS} + \lambda|\beta|$:
 * le resta $\lambda/2$ al valor absoluto y, si no alcanza, lo deja en cero.
 */
export function lassoOneVariable(leastSquares: number, lambda: number): number {
  return Math.sign(leastSquares) * Math.max(Math.abs(leastSquares) - lambda / 2, 0)
}

/** Varianza del promedio de `models` modelos con varianza `sigma2` y correlación `rho` entre sí. */
export function averagedVariance(sigma2: number, rho: number, models: number): number {
  return rho * sigma2 + ((1 - rho) / models) * sigma2
}

/** Probabilidad de que acierte el voto de mayoría de `voters` clasificadores independientes (cantidad impar) con acierto `p`. */
export function majorityVoteAccuracy(voters: number, p: number): number {
  let total = 0
  for (let k = Math.floor(voters / 2) + 1; k <= voters; k++) total += binomialPmf(voters, k, p)
  return total
}
