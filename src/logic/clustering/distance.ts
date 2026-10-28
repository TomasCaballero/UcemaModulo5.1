/** Distancias para agrupamiento (4.5): euclídea y distancia al k-ésimo vecino. */

/** Distancia euclídea entre dos puntos de la misma dimensión. */
export function euclidean(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) throw new RangeError('Los puntos deben tener la misma dimensión')
  return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - (b[i] as number)) ** 2, 0))
}

/**
 * Para cada punto (en una dimensión), la distancia a su k-ésimo vecino más cercano sin contarse a sí
 * mismo. Con MinPts = k + 1, un punto es núcleo de DBSCAN si esa distancia es ≤ Eps.
 */
export function kDistances(points: readonly number[], k: number): number[] {
  if (!Number.isInteger(k) || k < 1 || k >= points.length) throw new RangeError(`k debe estar entre 1 y ${points.length - 1}`)
  return points.map((p, i) => {
    const others = points.filter((_, j) => j !== i).map((q) => Math.abs(q - p))
    return others.sort((x, y) => x - y)[k - 1] as number
  })
}

/** Lado del hipercubo que contiene una fracción `share` del volumen de un cubo unitario de `dimensions` dimensiones. */
export function neighborhoodSide(share: number, dimensions: number): number {
  if (!(share > 0 && share <= 1) || dimensions < 1) throw new RangeError('Fracción o dimensión inválidas')
  return share ** (1 / dimensions)
}
