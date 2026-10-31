/** Proporción de la varianza total que explica cada componente: $\lambda_k / \sum_j \lambda_j$. */
export function explainedVariance(eigenvalues: readonly number[]): number[] {
  const total = eigenvalues.reduce((sum, value) => sum + value, 0)
  return eigenvalues.map((value) => value / total)
}

/** Varianza acumulada por los primeros 1, 2, ... componentes. */
export function cumulativeVariance(eigenvalues: readonly number[]): number[] {
  let acc = 0
  return explainedVariance(eigenvalues).map((share) => (acc += share))
}

/** Regla de Kaiser-Guttman (matriz de correlación): cantidad de componentes con autovalor mayor que 1. */
export function kaiserCount(eigenvalues: readonly number[]): number {
  return eigenvalues.filter((value) => value > 1).length
}

/** Cantidad mínima de componentes cuya varianza acumulada llega al umbral (por ejemplo, 0.8). */
export function componentsForVariance(eigenvalues: readonly number[], threshold: number): number {
  const cumulative = cumulativeVariance(eigenvalues)
  const index = cumulative.findIndex((share) => share >= threshold - 1e-9)
  return index === -1 ? eigenvalues.length : index + 1
}

/** Autovalores de la matriz simétrica $\begin{pmatrix} a & b \\ b & c \end{pmatrix}$, de mayor a menor. */
export function symmetric2x2Eigenvalues(a: number, b: number, c: number): [number, number] {
  const center = (a + c) / 2
  const radius = Math.sqrt(((a - c) / 2) ** 2 + b ** 2)
  return [center + radius, center - radius]
}

/** Autovalor de un componente que explica `share` de la varianza, con matriz de correlación de `p` variables (varianza total = p). */
export function eigenvalueFromShare(share: number, variables: number): number {
  return share * variables
}

/** Inercia total de la tabla indicadora del ACM con `categories` ($J$) categorías en total y `variables` ($Q$) variables: $J/Q - 1$. */
export function indicatorInertia(categories: number, variables: number): number {
  return categories / variables - 1
}

/** Autovalor medio de las $J - Q$ dimensiones no triviales del ACM: la inercia total repartida en partes iguales, $1/Q$. */
export function meanIndicatorEigenvalue(categories: number, variables: number): number {
  return indicatorInertia(categories, variables) / (categories - variables)
}

/**
 * Autovalores corregidos de Benzécri: $\left(\frac{Q}{Q-1}\right)^2 (\lambda_k - 1/Q)^2$ para los que superan
 * $1/Q$; los demás se descartan.
 */
export function benzecriCorrected(eigenvalues: readonly number[], variables: number): number[] {
  const factor = (variables / (variables - 1)) ** 2
  return eigenvalues.filter((value) => value > 1 / variables).map((value) => factor * (value - 1 / variables) ** 2)
}

/** Inercia total del FAMD con `numeric` variables continuas y `categories` categorías en `variables` variables categóricas: $p + J - Q$. */
export function famdInertia(numeric: number, categories: number, variables: number): number {
  return numeric + categories - variables
}
