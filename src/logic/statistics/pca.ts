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
