import type { Random } from '@/core/random'
import { normalCdf } from '../statistics/distributions'

export type PopulationKind = 'skewed' | 'uniform' | 'bimodal'

export interface Population {
  kind: PopulationKind
  label: string
  mean: number
  /** Desviación típica poblacional σ. */
  sd: number
  sample(random: Random): number
}

/** Poblaciones de ejemplo, todas con media y desviación típica conocidas. */
export const POPULATIONS: Record<PopulationKind, Population> = {
  skewed: {
    kind: 'skewed',
    label: 'Sesgada (exponencial)',
    mean: 1,
    sd: 1,
    sample: (random) => -Math.log(1 - random.next()),
  },
  uniform: {
    kind: 'uniform',
    label: 'Uniforme',
    mean: 0.5,
    sd: Math.sqrt(1 / 12),
    sample: (random) => random.next(),
  },
  bimodal: {
    kind: 'bimodal',
    label: 'Con dos picos',
    mean: 0.5,
    // Mitad U(0, 0.2) y mitad U(0.8, 1): varianza interna 0.2²/12 más la distancia 0.4 de cada pico a la media.
    sd: Math.sqrt(0.2 ** 2 / 12 + 0.4 ** 2),
    sample: (random) => (random.next() < 0.5 ? 0.2 * random.next() : 0.8 + 0.2 * random.next()),
  },
}

/** Error estándar teórico σ/√n. */
export function theoreticalStandardError(population: Population, n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`n debe ser un entero positivo: ${n}`)
  return population.sd / Math.sqrt(n)
}

/** `count` medias de muestras de tamaño `n`. */
export function sampleMeans(population: Population, n: number, count: number, random: Random): number[] {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`n debe ser un entero positivo: ${n}`)
  const means: number[] = []
  for (let i = 0; i < count; i++) {
    let total = 0
    for (let j = 0; j < n; j++) total += population.sample(random)
    means.push(total / n)
  }
  return means
}

/** Rango del eje: μ ± 4 errores estándar. */
export function displayRange(population: Population, n: number): [low: number, high: number] {
  const margin = 4 * theoreticalStandardError(population, n)
  return [population.mean - margin, population.mean + margin]
}

/** Cuenta por intervalo; lo que cae fuera del rango se suma al primer o último intervalo. */
export function histogram(values: readonly number[], bins: number, low: number, high: number): number[] {
  if (bins < 1 || high <= low) throw new RangeError('Histograma inválido')
  const counts = new Array<number>(bins).fill(0)
  const width = (high - low) / bins
  for (const value of values) {
    const bin = Math.min(bins - 1, Math.max(0, Math.floor((value - low) / width)))
    counts[bin] = (counts[bin] as number) + 1
  }
  return counts
}

/** Cantidad esperada por intervalo si las medias fueran Normal(mean, se); con las mismas colas absorbidas. */
export function expectedNormalCounts(
  mean: number,
  se: number,
  bins: number,
  low: number,
  high: number,
  total: number,
): number[] {
  const width = (high - low) / bins
  const cdf = (x: number) => normalCdf((x - mean) / se)
  return Array.from({ length: bins }, (_, i) => {
    const from = i === 0 ? 0 : cdf(low + i * width)
    const to = i === bins - 1 ? 1 : cdf(low + (i + 1) * width)
    return total * (to - from)
  })
}

export interface MeansSummary {
  count: number
  mean: number
  /** Desviación típica muestral de las medias; `null` con menos de 2. */
  sd: number | null
}

export function summarize(values: readonly number[]): MeansSummary {
  const count = values.length
  if (count === 0) return { count: 0, mean: Number.NaN, sd: null }
  const mean = values.reduce((sum, value) => sum + value, 0) / count
  if (count < 2) return { count, mean, sd: null }
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (count - 1)
  return { count, mean, sd: Math.sqrt(variance) }
}
