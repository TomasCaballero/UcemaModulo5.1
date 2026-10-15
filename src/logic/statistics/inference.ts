export function standardError(s: number, n: number): number {
  if (s < 0) throw new RangeError(`s no puede ser negativa: ${s}`)
  if (n <= 0) throw new RangeError(`n debe ser positivo: ${n}`)
  return s / Math.sqrt(n)
}

/** Intervalo de confianza para la media: x̄ ± z*·s/√n (z* = 1.96 para 95 %). */
export function confidenceInterval(
  sampleMean: number,
  s: number,
  n: number,
  criticalValue = 1.96,
): [lower: number, upper: number] {
  const margin = criticalValue * standardError(s, n)
  return [sampleMean - margin, sampleMean + margin]
}

/** Estadístico t para una media: (x̄ - μ0) / (s/√n). */
export function tStatistic(sampleMean: number, mu0: number, s: number, n: number): number {
  return (sampleMean - mu0) / standardError(s, n)
}

/** d de Cohen: diferencia entre medias en unidades de desviación típica. */
export function cohensD(meanDifference: number, standardDeviation: number): number {
  if (standardDeviation <= 0) throw new RangeError(`La desviación típica debe ser positiva: ${standardDeviation}`)
  return meanDifference / standardDeviation
}

/** Verosimilitud de p dados `successes` éxitos en `trials` ensayos: p^k (1-p)^(n-k). */
export function bernoulliLikelihood(p: number, successes: number, trials: number): number {
  if (p < 0 || p > 1) throw new RangeError(`p fuera de [0, 1]: ${p}`)
  if (successes < 0 || successes > trials) throw new RangeError('successes debe estar entre 0 y trials')
  return p ** successes * (1 - p) ** (trials - successes)
}

/** Estimador de máxima verosimilitud de p: la proporción observada. */
export function mleProportion(successes: number, trials: number): number {
  if (trials <= 0) throw new RangeError(`trials debe ser positivo: ${trials}`)
  return successes / trials
}
