import { shuffle, type Random } from '@/core/random'

export type Point = readonly number[]

export type Phase = 'init' | 'assign' | 'update'

/** Un cuadro de la animación: lo que se ve después de cada paso del algoritmo. */
export interface Frame {
  phase: Phase
  centroids: Point[]
  /** Grupo de cada punto, o `null` antes de la primera asignación. */
  labels: number[] | null
  /** Suma de errores al cuadrado, o `null` antes de la primera asignación. */
  sse: number | null
  /** Vuelta del algoritmo (0 = inicio). */
  iteration: number
}

export function squaredDistance(a: Point, b: Point): number {
  return a.reduce((sum, value, dimension) => sum + (value - (b[dimension] as number)) ** 2, 0)
}

/** Índice del centroide más cercano (el primero si hay empate). */
export function nearestCentroid(point: Point, centroids: readonly Point[]): number {
  let best = 0
  let bestDistance = Number.POSITIVE_INFINITY
  centroids.forEach((centroid, index) => {
    const distance = squaredDistance(point, centroid)
    if (distance < bestDistance) {
      best = index
      bestDistance = distance
    }
  })
  return best
}

export function assignLabels(points: readonly Point[], centroids: readonly Point[]): number[] {
  return points.map((point) => nearestCentroid(point, centroids))
}

/** Cada centroide pasa a ser el promedio de sus puntos; uno sin puntos se queda donde estaba. */
export function updateCentroids(points: readonly Point[], labels: readonly number[], previous: readonly Point[]): Point[] {
  return previous.map((old, cluster) => {
    const members = points.filter((_, index) => labels[index] === cluster)
    if (members.length === 0) return old
    return old.map((_, dimension) => members.reduce((sum, point) => sum + (point[dimension] as number), 0) / members.length)
  })
}

/** Suma de los cuadrados de las distancias de cada punto a su centroide. */
export function sse(points: readonly Point[], labels: readonly number[], centroids: readonly Point[]): number {
  return points.reduce((total, point, index) => total + squaredDistance(point, centroids[labels[index] as number] as Point), 0)
}

/** `k` puntos distintos del conjunto como centroides iniciales. */
export function chooseInitialCentroids(points: readonly Point[], k: number, random: Random): Point[] {
  if (!Number.isInteger(k) || k < 1 || k > points.length) throw new RangeError(`k inválido: ${k}`)
  return shuffle(random, points).slice(0, k)
}

const sameLabels = (a: readonly number[], b: readonly number[]): boolean => a.every((label, index) => label === b[index])

/**
 * Todos los cuadros de K-Means desde `initial` hasta que las asignaciones dejan de cambiar
 * (o se alcanzan `maxIterations` vueltas): asignar, recalcular, repetir.
 */
export function kmeansFrames(points: readonly Point[], initial: readonly Point[], maxIterations = 50): Frame[] {
  let centroids = [...initial]
  const frames: Frame[] = [{ phase: 'init', centroids, labels: null, sse: null, iteration: 0 }]
  let previousLabels: number[] | null = null

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const labels = assignLabels(points, centroids)
    frames.push({ phase: 'assign', centroids, labels, sse: sse(points, labels, centroids), iteration })
    if (previousLabels && sameLabels(labels, previousLabels)) break
    centroids = updateCentroids(points, labels, centroids)
    frames.push({ phase: 'update', centroids, labels, sse: sse(points, labels, centroids), iteration })
    previousLabels = labels
  }
  return frames
}

/** SSE final del mejor de varios arranques al azar (la guía recomienda probar varios). */
export function bestSse(points: readonly Point[], k: number, random: Random, restarts = 5): number {
  let best = Number.POSITIVE_INFINITY
  for (let attempt = 0; attempt < restarts; attempt++) {
    const frames = kmeansFrames(points, chooseInitialCentroids(points, k, random))
    best = Math.min(best, (frames[frames.length - 1] as Frame).sse as number)
  }
  return best
}

export interface ElbowPoint {
  k: number
  sse: number
}

/** SSE contra K, para el método del codo. */
export function elbowCurve(points: readonly Point[], maxK: number, random: Random): ElbowPoint[] {
  return Array.from({ length: Math.min(maxK, points.length) }, (_, index) => ({
    k: index + 1,
    sse: bestSse(points, index + 1, random),
  }))
}

function gaussian(random: Random): number {
  // Box-Muller; 1 - u evita log(0).
  return Math.sqrt(-2 * Math.log(1 - random.next())) * Math.cos(2 * Math.PI * random.next())
}

/** Grupos de puntos 2D alrededor de cada centro. */
export function makeBlobs(random: Random, centers: readonly Point[], perCluster: number, spread: number): Point[] {
  return centers.flatMap((center) =>
    Array.from({ length: perCluster }, (): Point => center.map((coordinate) => coordinate + spread * gaussian(random))),
  )
}

/** Ejemplo en 1D de la guía (6.7): puntos 1, 2, 4, 10, 11, 13 con centroides iniciales 1 y 10. */
export const GUIDE_POINTS: readonly Point[] = [[1], [2], [4], [10], [11], [13]]
export const GUIDE_START_INDEXES: readonly number[] = [0, 3]

/** Conjunto 2D de demostración: tres grupos de 20 puntos, siempre los mismos. */
export function demoBlobs(random: Random): Point[] {
  return makeBlobs(random, [[20, 25], [70, 30], [45, 75]], 20, 6)
}
