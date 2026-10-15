export interface BayesInput {
  /** Fracción de la población que tiene la enfermedad (0 a 1). */
  prevalence: number
  /** Probabilidad de dar positivo estando enfermo (0 a 1). */
  sensitivity: number
  /** Probabilidad de dar positivo estando sano (0 a 1). */
  falsePositiveRate: number
}

export interface BayesResult {
  population: number
  sick: number
  healthy: number
  truePositives: number
  falseNegatives: number
  falsePositives: number
  trueNegatives: number
  positives: number
  /** P(enfermo | positivo), o `null` si nadie da positivo. */
  posterior: number | null
}

function assertFraction(name: string, value: number): void {
  if (!(value >= 0 && value <= 1)) throw new RangeError(`${name} debe estar entre 0 y 1: ${value}`)
}

/** Teorema de Bayes sobre una población de `population` personas (por defecto 1000). */
export function bayes(input: BayesInput, population = 1000): BayesResult {
  assertFraction('prevalence', input.prevalence)
  assertFraction('sensitivity', input.sensitivity)
  assertFraction('falsePositiveRate', input.falsePositiveRate)

  const sick = population * input.prevalence
  const healthy = population - sick
  const truePositives = sick * input.sensitivity
  const falsePositives = healthy * input.falsePositiveRate
  const positives = truePositives + falsePositives
  return {
    population,
    sick,
    healthy,
    truePositives,
    falseNegatives: sick - truePositives,
    falsePositives,
    trueNegatives: healthy - falsePositives,
    positives,
    posterior: positives === 0 ? null : truePositives / positives,
  }
}

/** Redondea a enteros que suman exactamente `total` (método del mayor resto). */
export function roundToTotal(values: readonly number[], total: number): number[] {
  const floors = values.map(Math.floor)
  let missing = total - floors.reduce((sum, value) => sum + value, 0)
  const byRemainder = values
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  for (const { index } of byRemainder) {
    if (missing <= 0) break
    floors[index] = (floors[index] as number) + 1
    missing--
  }
  return floors
}

export type BayesCell = 'truePositive' | 'falseNegative' | 'falsePositive' | 'trueNegative'

/**
 * Una celda por persona, en el orden en que se dibujan: primero los enfermos
 * (positivos y negativos) y después los sanos (falsos positivos y negativos).
 */
export function populationCells(result: BayesResult): BayesCell[] {
  const [tp = 0, fn = 0, fp = 0, tn = 0] = roundToTotal(
    [result.truePositives, result.falseNegatives, result.falsePositives, result.trueNegatives],
    result.population,
  )
  const cells: BayesCell[] = []
  const add = (cell: BayesCell, count: number) => cells.push(...new Array<BayesCell>(count).fill(cell))
  add('truePositive', tp)
  add('falseNegative', fn)
  add('falsePositive', fp)
  add('trueNegative', tn)
  return cells
}
