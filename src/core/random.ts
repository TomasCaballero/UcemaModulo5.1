/** Fuente de aleatoriedad inyectable. */
export interface Random {
  /** Número en [0, 1). */
  next(): number
}

/** Único lugar donde se usa `Math.random`. */
export class MathRandom implements Random {
  next(): number {
    return Math.random()
  }
}

/** Generador determinista (mulberry32) para tests y simulaciones reproducibles. */
export class SeededRandom implements Random {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0
    let t = this.state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Entero en [0, maxExclusive). */
export function randomInt(random: Random, maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError(`maxExclusive debe ser un entero positivo: ${maxExclusive}`)
  }
  return Math.floor(random.next() * maxExclusive)
}

/** Fisher-Yates sin mutar la entrada. */
export function shuffle<T>(random: Random, items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(random, i + 1)
    ;[result[i], result[j]] = [result[j] as T, result[i] as T]
  }
  return result
}
