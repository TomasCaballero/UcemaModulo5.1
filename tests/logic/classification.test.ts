import { describe, expect, it } from 'vitest'
import {
  accuracy,
  aucByPairs,
  confusionAtThreshold,
  forestProbability,
  gini,
  logLikelihood,
  odds,
  logistic,
  oddsRatio,
  precision,
  probabilityAfterOddsRatio,
  recall,
  specificity,
  THRESHOLD_EXAMPLE,
  vif,
  weightedGini,
} from '@/logic/classification/classification'

describe('Gini', () => {
  it('vale 0 en un nodo puro y 0.5 con clases parejas', () => {
    expect(gini(10, 0)).toBe(0)
    expect(gini(5, 5)).toBe(0.5)
    expect(gini(0, 0)).toBe(0)
  })

  it('compara dos primeras preguntas con el Gini ponderado (Titanic, 623 pasajeros)', () => {
    const mujer = { positives: 163, negatives: 54 }
    const hombre = { positives: 76, negatives: 330 }
    const tercera = { positives: 86, negatives: 260 }
    const otras = { positives: 153, negatives: 124 }
    expect(gini(163, 54)).toBeCloseTo(0.374, 3)
    expect(gini(76, 330)).toBeCloseTo(0.304, 3)
    expect(gini(86, 260)).toBeCloseTo(0.374, 3)
    expect(gini(153, 124)).toBeCloseTo(0.495, 3)
    expect(weightedGini([mujer, hombre])).toBeCloseTo(0.329, 3)
    expect(weightedGini([tercera, otras])).toBeCloseTo(0.427, 3)
    expect(weightedGini([mujer, hombre])).toBeLessThan(weightedGini([tercera, otras]))
    expect(weightedGini([])).toBe(0)
  })
})

describe('métricas por umbral', () => {
  const { probabilities, labels } = THRESHOLD_EXAMPLE
  const at = (t: number) => confusionAtThreshold(probabilities, labels, t)

  it('cuenta la matriz de confusión', () => {
    expect(at(0.3)).toEqual({ tp: 4, fp: 2, fn: 1, tn: 1 })
    expect(at(0.5)).toEqual({ tp: 3, fp: 1, fn: 2, tn: 2 })
    expect(at(0.7)).toEqual({ tp: 2, fp: 0, fn: 3, tn: 3 })
  })

  it('subir el umbral baja el recall y sube la precisión y la especificidad', () => {
    expect(recall(at(0.3))).toBeCloseTo(0.8, 3)
    expect(recall(at(0.7))).toBeCloseTo(0.4, 3)
    expect(precision(at(0.3))).toBeCloseTo(0.667, 3)
    expect(precision(at(0.7))).toBe(1)
    expect(specificity(at(0.3))).toBeCloseTo(0.333, 3)
    expect(specificity(at(0.7))).toBe(1)
    expect(accuracy(at(0.5))).toBeCloseTo(0.625, 3)
  })

  it('rechaza entradas de distinta longitud', () => {
    expect(() => confusionAtThreshold([0.1], [1, 0], 0.5)).toThrow(RangeError)
  })

  it('cuenta el AUC por pares: 11 de 15, y no cambia si se conserva el orden', () => {
    expect(aucByPairs(probabilities, labels)).toBeCloseTo(11 / 15, 10)
    expect(aucByPairs(probabilities.map((p) => p / 2), labels)).toBeCloseTo(11 / 15, 10)
    expect(aucByPairs([0.9, 0.1], [1, 0])).toBe(1)
    expect(aucByPairs([0.5, 0.5], [1, 0])).toBe(0.5)
    expect(() => aucByPairs([0.5], [1, 0])).toThrow(RangeError)
    expect(() => aucByPairs([0.5, 0.6], [1, 1])).toThrow(RangeError)
  })

  it('la especificidad del ejemplo de los 100 pacientes es 0.80', () => {
    expect(specificity({ tp: 8, fn: 2, fp: 18, tn: 72 })).toBeCloseTo(0.8, 3)
    expect(specificity({ tp: 0, fn: 0, fp: 0, tn: 0 })).toBe(0)
  })
})

describe('regresión logística', () => {
  it('convierte el score en probabilidad (pasajera del Titanic)', () => {
    const z = -1.468 + 2.573 * 1
    expect(z).toBeCloseTo(1.105, 3)
    expect(logistic(z)).toBeCloseTo(0.751, 3)
  })

  it('calcula los odds ratio del modelo', () => {
    expect(oddsRatio(2.61)).toBeCloseTo(13.6, 1)
    expect(oddsRatio(-0.0439)).toBeCloseTo(0.96, 2)
    expect(oddsRatio(-1.3946)).toBeCloseTo(0.25, 2)
    expect(oddsRatio(-2.5846)).toBeCloseTo(0.08, 2)
  })

  it('el mismo odds ratio mueve distinto la probabilidad según el punto de partida', () => {
    expect(probabilityAfterOddsRatio(0.1, 13.6)).toBeCloseTo(0.6, 2)
    expect(probabilityAfterOddsRatio(0.5, 13.6)).toBeCloseTo(0.93, 2)
    expect(probabilityAfterOddsRatio(0.3, 1)).toBeCloseTo(0.3, 10)
    expect(() => probabilityAfterOddsRatio(1.2, 2)).toThrow(RangeError)
  })
})

describe('VIF', () => {
  it('crece con la redundancia', () => {
    expect(vif(0)).toBe(1)
    expect(vif(0.5)).toBe(2)
    expect(vif(0.8)).toBeCloseTo(5, 10)
    expect(vif(0.9)).toBeCloseTo(10, 10)
    expect(() => vif(1)).toThrow(RangeError)
  })
})

describe('bosque aleatorio', () => {
  it('promedia las probabilidades de los árboles', () => {
    expect(forestProbability([0.125, 0.5, 0.333, 0.143, 0])).toBeCloseTo(0.22, 3)
    expect(() => forestProbability([])).toThrow(RangeError)
  })
})

describe('verosimilitud y odds (Titanic de la clase)', () => {
  const y: (0 | 1)[] = [1, 0, 1, 0]

  it('el modelo que explica mejor lo observado tiene mayor log-verosimilitud', () => {
    const a = logLikelihood([0.9, 0.15, 0.8, 0.1], y)
    const b = logLikelihood([0.6, 0.55, 0.55, 0.4], y)
    expect(a).toBeCloseTo(-0.6, 2)
    expect(b).toBeCloseTo(-2.42, 2)
    expect(a).toBeGreaterThan(b)
    expect(() => logLikelihood([0.5], y)).toThrow(RangeError)
  })

  it('calcula los odds de tres pasajeros', () => {
    expect(odds(0.8)).toBeCloseTo(4, 10)
    expect(odds(0.5)).toBe(1)
    expect(odds(0.2)).toBeCloseTo(0.25, 10)
  })
})
