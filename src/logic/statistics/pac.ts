/**
 * Cuentas de la teoría del aprendizaje (Módulo 7): tamaños de muestra para clases finitas,
 * la desigualdad de Hoeffding, cuántos etiquetados logra una clase y el promedio de No-Free-Lunch.
 * Los tamaños de muestra se redondean hacia arriba: hacen falta al menos esos datos.
 */

/** Caso realizable con clase finita: $m \ge \ln(|\mathcal{H}|/\delta)/\epsilon$. */
export function realizableSampleSize(hypotheses: number, epsilon: number, delta: number): number {
  return Math.ceil(Math.log(hypotheses / delta) / epsilon)
}

/** Caso agnóstico con clase finita: $m \ge 2\ln(2|\mathcal{H}|/\delta)/\epsilon^2$. */
export function agnosticSampleSize(hypotheses: number, epsilon: number, delta: number): number {
  return Math.ceil((2 * Math.log((2 * hypotheses) / delta)) / epsilon ** 2)
}

/** Hoeffding para un solo modelo: casos para estimar su error con margen `epsilon` y confianza $1-\delta$. */
export function hoeffdingSampleSize(epsilon: number, delta: number): number {
  return Math.ceil(Math.log(2 / delta) / (2 * epsilon ** 2))
}

/** Lo mismo con la aproximación Normal del intervalo de confianza, en el peor caso $p(1-p) = 0.25$. */
export function normalSampleSize(margin: number, z: number): number {
  return Math.ceil(((z * 0.5) / margin) ** 2)
}

/** Probabilidad de que una hipótesis con ese error real acierte `m` datos independientes. */
export function consistentProbability(error: number, m: number): number {
  return (1 - error) ** m
}

/** Etiquetados de `m` puntos ordenados que cumplen `achievable` (cada etiquetado es un string de 0 y 1). */
function countLabelings(m: number, achievable: (labels: string) => boolean): number {
  let count = 0
  for (let mask = 0; mask < 2 ** m; mask++) {
    if (achievable(mask.toString(2).padStart(m, '0'))) count++
  }
  return count
}

/** Etiquetados que logran los intervalos sobre `m` puntos de la recta: los positivos, todos seguidos. */
export function intervalLabelings(m: number): number {
  return countLabelings(m, (labels) => /^0*1*0*$/.test(labels))
}

/** Etiquetados que logran los umbrales sobre `m` puntos: negativos a la izquierda, positivos a la derecha. */
export function thresholdLabelings(m: number): number {
  return countLabelings(m, (labels) => /^0*1*$/.test(labels))
}

/** Cota de Sauer: una clase con dimensión VC `d` logra como mucho $\sum_{i \le d} \binom{m}{i}$ etiquetados. */
export function sauerBound(m: number, d: number): number {
  let total = 0
  let binomial = 1
  for (let i = 0; i <= Math.min(d, m); i++) {
    total += binomial
    binomial = (binomial * (m - i)) / (i + 1)
  }
  return total
}

/**
 * Error promedio de unas predicciones fijas sobre los casos no vistos, promediado sobre todas las
 * reglas verdaderas posibles (todos los etiquetados de esos casos): No-Free-Lunch.
 */
export function offTrainingError(predictions: readonly (0 | 1)[]): number {
  const unseen = predictions.length
  let errors = 0
  for (let mask = 0; mask < 2 ** unseen; mask++) {
    predictions.forEach((prediction, i) => {
      if (((mask >> i) & 1) !== prediction) errors++
    })
  }
  return errors / (2 ** unseen * unseen)
}
