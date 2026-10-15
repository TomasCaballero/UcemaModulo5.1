function assertNonEmpty(values: readonly number[]): void {
  if (values.length === 0) throw new RangeError('Se necesita al menos un dato')
}

export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

export function mean(values: readonly number[]): number {
  assertNonEmpty(values)
  return sum(values) / values.length
}

/** Valor central; con cantidad par, el promedio de los dos centrales. */
export function median(values: readonly number[]): number {
  assertNonEmpty(values)
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? (sorted[middle] as number)
    : ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2
}

/** Valores más frecuentes (puede haber más de una moda), en orden ascendente. */
export function modes(values: readonly number[]): number[] {
  assertNonEmpty(values)
  const counts = new Map<number, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  const highest = Math.max(...counts.values())
  return [...counts.entries()]
    .filter(([, count]) => count === highest)
    .map(([value]) => value)
    .sort((a, b) => a - b)
}

/** Varianza muestral: suma de desviaciones al cuadrado dividida por n - 1. */
export function sampleVariance(values: readonly number[]): number {
  if (values.length < 2) throw new RangeError('La varianza muestral requiere al menos 2 datos')
  const center = mean(values)
  return sum(values.map((value) => (value - center) ** 2)) / (values.length - 1)
}

export function sampleStdDev(values: readonly number[]): number {
  return Math.sqrt(sampleVariance(values))
}
