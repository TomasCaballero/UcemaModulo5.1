import { describe, expect, it } from 'vitest'
import { SeededRandom } from '@/core/random'
import { createPlayer, finish, pause, play, reset, resize, tick } from '@/logic/animation/player'
import { bayes, populationCells, roundToTotal } from '@/logic/simulations/bayes'
import {
  displayRange,
  expectedNormalCounts,
  histogram,
  POPULATIONS,
  sampleMeans,
  summarize,
  theoreticalStandardError,
} from '@/logic/simulations/clt'
import {
  assignLabels,
  bestSse,
  chooseInitialCentroids,
  elbowCurve,
  kmeansFrames,
  makeBlobs,
  nearestCentroid,
  sse,
  squaredDistance,
  updateCentroids,
  type Point,
} from '@/logic/simulations/kmeans'

describe('reproductor (máquina de estados)', () => {
  it('empieza detenido en el paso 0', () => {
    expect(createPlayer(3)).toEqual({ status: 'idle', step: 0, lastStep: 3 })
    expect(() => createPlayer(-1)).toThrow(RangeError)
    expect(() => createPlayer(1.5)).toThrow(RangeError)
  })

  it('en pausa, reproducir avanza paso a paso hasta terminar (AC-19)', () => {
    let state = pause(play(createPlayer(3)))
    expect(state.status).toBe('paused')
    state = tick(state) // en pausa no avanza
    expect(state.step).toBe(0)
    state = play(state)
    const steps: number[] = []
    while (state.status === 'playing') {
      state = tick(state)
      steps.push(state.step)
    }
    expect(steps).toEqual([1, 2, 3])
    expect(state.status).toBe('finished')
  })

  it('reiniciar vuelve al primer paso, detenido (AC-19)', () => {
    const state = reset(tick(tick(play(createPlayer(5)))))
    expect(state).toEqual({ status: 'idle', step: 0, lastStep: 5 })
  })

  it('reproducir tras terminar empieza de nuevo', () => {
    const done = finish(createPlayer(4))
    expect(done).toMatchObject({ status: 'finished', step: 4 })
    expect(play(done)).toMatchObject({ status: 'playing', step: 0 })
  })

  it('pausar solo afecta a una reproducción en curso; reproducir dos veces no cambia nada', () => {
    const idle = createPlayer(3)
    expect(pause(idle)).toBe(idle)
    const playing = play(idle)
    expect(play(playing)).toBe(playing)
  })

  it('una animación sin pasos no se puede reproducir', () => {
    const empty = createPlayer(0)
    expect(play(empty)).toBe(empty)
  })

  it('cambiar la cantidad de pasos reinicia', () => {
    expect(resize(7)).toEqual({ status: 'idle', step: 0, lastStep: 7 })
  })
})

describe('IN-03 Bayes', () => {
  const guide = { prevalence: 0.01, sensitivity: 0.9, falsePositiveRate: 0.05 }

  it('ejemplo de la guía: 15.4 % de estar enfermo con test positivo', () => {
    const result = bayes(guide)
    expect(result.posterior).toBeCloseTo(0.154, 3)
    expect(result.truePositives).toBeCloseTo(9, 9)
    expect(result.falsePositives).toBeCloseTo(49.5, 9)
    expect(result.positives).toBeCloseTo(58.5, 9)
  })

  it('con prevalencia de 10 % el resultado pasa a 66.7 % (AC-18)', () => {
    const posterior = bayes({ ...guide, prevalence: 0.1 }).posterior ?? 0
    expect(posterior * 100).toBeCloseTo(66.7, 1)
  })

  it('los cuatro grupos suman la población', () => {
    const r = bayes(guide)
    expect(r.truePositives + r.falseNegatives + r.falsePositives + r.trueNegatives).toBeCloseTo(1000, 9)
    expect(r.sick + r.healthy).toBe(1000)
  })

  it('sin positivos posibles no hay probabilidad posterior', () => {
    expect(bayes({ prevalence: 0.5, sensitivity: 0, falsePositiveRate: 0 }).posterior).toBeNull()
  })

  it('rechaza porcentajes fuera de 0 a 1', () => {
    expect(() => bayes({ ...guide, prevalence: 1.2 })).toThrow(RangeError)
    expect(() => bayes({ ...guide, sensitivity: -0.1 })).toThrow(RangeError)
    expect(() => bayes({ ...guide, falsePositiveRate: Number.NaN })).toThrow(RangeError)
  })

  it('roundToTotal da enteros que suman el total', () => {
    expect(roundToTotal([9, 1, 49.5, 940.5], 1000)).toEqual([9, 1, 50, 940])
    expect(roundToTotal([1 / 3, 1 / 3, 1 / 3], 1)).toEqual([1, 0, 0])
  })

  it('dibuja una celda por persona, enfermos primero', () => {
    const cells = populationCells(bayes(guide))
    expect(cells).toHaveLength(1000)
    expect(cells.filter((c) => c === 'truePositive')).toHaveLength(9)
    expect(cells.filter((c) => c === 'falseNegative')).toHaveLength(1)
    expect(cells.filter((c) => c === 'falsePositive')).toHaveLength(50)
    expect(cells.slice(0, 10).every((c) => c === 'truePositive' || c === 'falseNegative')).toBe(true)
  })
})

describe('IN-21 Teorema del Límite Central', () => {
  it('cada población tiene la media y la desviación típica declaradas', () => {
    for (const population of Object.values(POPULATIONS)) {
      const random = new SeededRandom(11)
      const values = Array.from({ length: 40_000 }, () => population.sample(random))
      const { mean, sd } = summarize(values)
      expect(mean, population.kind).toBeCloseTo(population.mean, 1)
      expect(sd ?? 0, population.kind).toBeCloseTo(population.sd, 1)
    }
  })

  it('el error estándar es σ/√n: cuadruplicar n lo reduce a la mitad', () => {
    const skewed = POPULATIONS.skewed
    expect(theoreticalStandardError(skewed, 100)).toBeCloseTo(0.1, 12)
    expect(theoreticalStandardError(skewed, 400)).toBeCloseTo(theoreticalStandardError(skewed, 100) / 2, 12)
    expect(() => theoreticalStandardError(skewed, 0)).toThrow(RangeError)
  })

  it('las medias muestrales se concentran alrededor de μ con desviación ≈ σ/√n', () => {
    const population = POPULATIONS.skewed
    const means = sampleMeans(population, 30, 2000, new SeededRandom(5))
    const { mean, sd } = summarize(means)
    expect(mean).toBeCloseTo(population.mean, 1)
    expect(sd ?? 0).toBeCloseTo(theoreticalStandardError(population, 30), 1)
  })

  it('con la misma semilla genera las mismas medias', () => {
    const a = sampleMeans(POPULATIONS.uniform, 5, 20, new SeededRandom(3))
    const b = sampleMeans(POPULATIONS.uniform, 5, 20, new SeededRandom(3))
    expect(a).toEqual(b)
    expect(() => sampleMeans(POPULATIONS.uniform, 0, 5, new SeededRandom(1))).toThrow(RangeError)
  })

  it('el rango del eje es μ ± 4 errores estándar', () => {
    const [low, high] = displayRange(POPULATIONS.uniform, 4)
    const se = POPULATIONS.uniform.sd / 2
    expect(low).toBeCloseTo(0.5 - 4 * se, 12)
    expect(high).toBeCloseTo(0.5 + 4 * se, 12)
  })

  it('el histograma cuenta por intervalo y absorbe los valores fuera de rango en los extremos', () => {
    expect(histogram([0.1, 0.2, 0.6, 0.9, -5, 99], 2, 0, 1)).toEqual([3, 3])
    expect(() => histogram([], 0, 0, 1)).toThrow(RangeError)
    expect(() => histogram([], 2, 1, 1)).toThrow(RangeError)
  })

  it('la Normal esperada reparte todo el total y es simétrica alrededor de la media', () => {
    const counts = expectedNormalCounts(0, 1, 8, -4, 4, 400)
    expect(counts.reduce((a, b) => a + b, 0)).toBeCloseTo(400, 9)
    expect(counts[0]).toBeCloseTo(counts[7] as number, 6)
    expect(counts[3]).toBeGreaterThan(counts[0] as number)
  })

  it('summarize maneja pocos datos', () => {
    expect(summarize([]).count).toBe(0)
    expect(summarize([])).toMatchObject({ sd: null })
    expect(summarize([4])).toEqual({ count: 1, mean: 4, sd: null })
    expect(summarize([2, 4, 4, 6, 9]).sd).toBeCloseTo(2.6458, 4)
  })
})

describe('IN-58 K-Means', () => {
  const guidePoints: Point[] = [[1], [2], [4], [10], [11], [13]]
  const guideStart: Point[] = [[1], [10]]

  it('funciones básicas: distancia, centroide más cercano, asignación', () => {
    expect(squaredDistance([0, 0], [3, 4])).toBe(25)
    expect(nearestCentroid([2], guideStart)).toBe(0)
    expect(nearestCentroid([9], guideStart)).toBe(1)
    expect(assignLabels(guidePoints, guideStart)).toEqual([0, 0, 0, 1, 1, 1])
  })

  it('ejemplo 1D de la guía (K=2, centroides 1 y 10): centroides 7/3 y 34/3, SSE ≈ 9.33', () => {
    const labels = assignLabels(guidePoints, guideStart)
    const [first, second] = updateCentroids(guidePoints, labels, guideStart)
    expect(first?.[0]).toBeCloseTo(7 / 3, 9)
    expect(second?.[0]).toBeCloseTo(34 / 3, 9)
    expect(sse(guidePoints, labels, [first as Point, second as Point])).toBeCloseTo(9.333, 3)
  })

  it('los cuadros siguen el algoritmo: inicio, asignar, recalcular, reasignar sin cambios', () => {
    const frames = kmeansFrames(guidePoints, guideStart)
    expect(frames.map((f) => f.phase)).toEqual(['init', 'assign', 'update', 'assign'])
    expect(frames[0]).toMatchObject({ labels: null, sse: null, iteration: 0 })
    expect(frames[1]?.sse).toBeCloseTo(20, 9) // con los centroides iniciales 1 y 10
    expect(frames[2]?.sse).toBeCloseTo(9.333, 3)
    expect(frames[3]?.sse).toBeCloseTo(9.333, 3) // "nada cambia, el algoritmo termina"
    expect(frames[3]?.labels).toEqual(frames[2]?.labels)
  })

  it('el SSE nunca sube de un cuadro al siguiente', () => {
    const points = makeBlobs(new SeededRandom(7), [[20, 25], [70, 30], [45, 75]], 20, 6)
    const frames = kmeansFrames(points, chooseInitialCentroids(points, 3, new SeededRandom(1)))
    const values = frames.flatMap((f) => (f.sse === null ? [] : [f.sse]))
    for (let i = 1; i < values.length; i++) expect(values[i] as number).toBeLessThanOrEqual((values[i - 1] as number) + 1e-9)
  })

  it('corta en el máximo de vueltas aunque no converja', () => {
    const frames = kmeansFrames(guidePoints, guideStart, 1)
    expect(frames.map((f) => f.phase)).toEqual(['init', 'assign', 'update'])
  })

  it('un centroide sin puntos se queda donde estaba', () => {
    const [moved, stayed] = updateCentroids([[1], [2]], [0, 0], [[0], [100]])
    expect(moved).toEqual([1.5])
    expect(stayed).toEqual([100])
  })

  it('elige centroides iniciales distintos del conjunto y valida k', () => {
    const picked = chooseInitialCentroids(guidePoints, 3, new SeededRandom(2))
    expect(new Set(picked.map((p) => p[0])).size).toBe(3)
    expect(() => chooseInitialCentroids(guidePoints, 0, new SeededRandom(2))).toThrow(RangeError)
    expect(() => chooseInitialCentroids(guidePoints, 7, new SeededRandom(2))).toThrow(RangeError)
  })

  it('método del codo: el SSE baja con K y se aplana después de K=3 en tres grupos', () => {
    const points = makeBlobs(new SeededRandom(7), [[20, 25], [70, 30], [45, 75]], 20, 6)
    const curve = elbowCurve(points, 6, new SeededRandom(9))
    expect(curve.map((c) => c.k)).toEqual([1, 2, 3, 4, 5, 6])
    for (let i = 1; i < curve.length; i++) expect(curve[i]?.sse as number).toBeLessThanOrEqual((curve[i - 1]?.sse as number) + 1e-9)
    const sse2 = curve[1]?.sse as number
    const sse3 = curve[2]?.sse as number
    const sse4 = curve[3]?.sse as number
    expect(sse3).toBeLessThan(sse2 * 0.5) // gran mejora hasta K=3
    expect(sse4).toBeGreaterThan(sse3 * 0.6) // y poca después
  })

  it('el codo no pide más grupos que puntos', () => {
    expect(elbowCurve(guidePoints, 20, new SeededRandom(1))).toHaveLength(6)
    expect(bestSse(guidePoints, 6, new SeededRandom(1))).toBeCloseTo(0, 9)
  })

  it('genera la cantidad de puntos pedida y es reproducible', () => {
    const a = makeBlobs(new SeededRandom(7), [[0, 0], [10, 10]], 5, 1)
    expect(a).toHaveLength(10)
    expect(a).toEqual(makeBlobs(new SeededRandom(7), [[0, 0], [10, 10]], 5, 1))
  })
})
