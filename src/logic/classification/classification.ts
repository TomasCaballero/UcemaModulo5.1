/** Lógica numérica de clasificación: impureza, métricas por umbral, odds y VIF (4.3, 5.2, 6.5). */

/** Índice Gini de un nodo con `positives` y `negatives` registros: $1 - \sum p_c^2$. */
export function gini(positives: number, negatives: number): number {
  const total = positives + negatives
  if (total === 0) return 0
  const p = positives / total
  const q = negatives / total
  return 1 - p * p - q * q
}

export interface SplitSide {
  positives: number
  negatives: number
}

/** Gini ponderado de una división: promedio del Gini de cada hijo, ponderado por su tamaño. */
export function weightedGini(sides: readonly SplitSide[]): number {
  const total = sides.reduce((sum, side) => sum + side.positives + side.negatives, 0)
  if (total === 0) return 0
  return sides.reduce((sum, side) => sum + ((side.positives + side.negatives) / total) * gini(side.positives, side.negatives), 0)
}

export interface Confusion {
  tp: number
  fp: number
  fn: number
  tn: number
}

/** Matriz de confusión al clasificar como positivo todo caso con probabilidad mayor o igual al umbral. */
export function confusionAtThreshold(probabilities: readonly number[], labels: readonly (0 | 1)[], threshold: number): Confusion {
  if (probabilities.length !== labels.length) throw new RangeError('probabilities y labels deben tener la misma longitud')
  const matrix: Confusion = { tp: 0, fp: 0, fn: 0, tn: 0 }
  probabilities.forEach((p, i) => {
    const predicted = p >= threshold
    const actual = labels[i] === 1
    if (predicted && actual) matrix.tp += 1
    else if (predicted) matrix.fp += 1
    else if (actual) matrix.fn += 1
    else matrix.tn += 1
  })
  return matrix
}

const ratio = (numerator: number, denominator: number): number => (denominator === 0 ? 0 : numerator / denominator)

export const precision = (c: Confusion): number => ratio(c.tp, c.tp + c.fp)
/** Sensibilidad (recall, tasa de verdaderos positivos). */
export const recall = (c: Confusion): number => ratio(c.tp, c.tp + c.fn)
/** Especificidad: de los negativos reales, cuántos se identificaron como tales. */
export const specificity = (c: Confusion): number => ratio(c.tn, c.tn + c.fp)
export const accuracy = (c: Confusion): number => ratio(c.tp + c.tn, c.tp + c.fp + c.fn + c.tn)
/** F1: media armónica de precisión y recall. */
export const f1 = (precisionValue: number, recallValue: number): number =>
  ratio(2 * precisionValue * recallValue, precisionValue + recallValue)

/** Entropía en bits de una distribución de proporciones: $-\sum p \log_2 p$ (los ceros no aportan). */
export function entropy(proportions: readonly number[]): number {
  return proportions.reduce((sum, p) => (p > 0 ? sum - p * Math.log2(p) : sum), 0)
}

/** Función logística 1 / (1 + e^-z). */
export const logistic = (z: number): number => 1 / (1 + Math.exp(-z))

/** Odds ratio de un coeficiente de regresión logística: e^beta. */
export const oddsRatio = (beta: number): number => Math.exp(beta)

/** Nueva probabilidad si los odds iniciales se multiplican por `or`: p1 = OR*p0 / (1 - p0 + OR*p0). */
export function probabilityAfterOddsRatio(p0: number, or: number): number {
  if (!(p0 >= 0 && p0 <= 1)) throw new RangeError(`p0 debe estar entre 0 y 1: ${p0}`)
  return (or * p0) / (1 - p0 + or * p0)
}

/** Factor de inflación de la varianza: 1 / (1 - R²). */
export function vif(rSquared: number): number {
  if (!(rSquared >= 0 && rSquared < 1)) throw new RangeError(`R² debe estar en [0, 1): ${rSquared}`)
  return 1 / (1 - rSquared)
}

/** Log-verosimilitud de un modelo binario: suma de y*ln(p) + (1-y)*ln(1-p). */
export function logLikelihood(probabilities: readonly number[], labels: readonly (0 | 1)[]): number {
  if (probabilities.length !== labels.length) throw new RangeError('probabilities y labels deben tener la misma longitud')
  return probabilities.reduce((sum, p, i) => sum + (labels[i] === 1 ? Math.log(p) : Math.log(1 - p)), 0)
}

/**
 * AUC contado por pares: proporción de pares (positivo, negativo) en que el positivo tiene mayor
 * probabilidad (los empates cuentan medio). Es el área bajo la curva ROC.
 */
export function aucByPairs(probabilities: readonly number[], labels: readonly (0 | 1)[]): number {
  if (probabilities.length !== labels.length) throw new RangeError('probabilities y labels deben tener la misma longitud')
  const positives = probabilities.filter((_, i) => labels[i] === 1)
  const negatives = probabilities.filter((_, i) => labels[i] === 0)
  if (positives.length === 0 || negatives.length === 0) throw new RangeError('hacen falta positivos y negativos')
  const wins = positives.reduce(
    (sum, pos) => sum + negatives.reduce((acc, neg) => acc + (pos > neg ? 1 : pos === neg ? 0.5 : 0), 0),
    0,
  )
  return wins / (positives.length * negatives.length)
}

/** Odds de una probabilidad: p / (1 - p). */
export const odds = (p: number): number => p / (1 - p)

/** Predicción de un bosque: promedio de las probabilidades de cada árbol. */
export function forestProbability(treeProbabilities: readonly number[]): number {
  if (treeProbabilities.length === 0) throw new RangeError('hace falta al menos un árbol')
  return treeProbabilities.reduce((a, b) => a + b, 0) / treeProbabilities.length
}

/** Ejemplo ilustrativo de 8 pasajeros para ver cómo el umbral mueve las métricas (cifras inventadas). */
export const THRESHOLD_EXAMPLE = {
  probabilities: [0.95, 0.85, 0.6, 0.55, 0.45, 0.35, 0.2, 0.1],
  labels: [1, 1, 0, 1, 1, 0, 1, 0] as (0 | 1)[],
  thresholds: [0.3, 0.5, 0.7],
} as const
