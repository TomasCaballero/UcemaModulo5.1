/** Coeficiente binomial C(n, k) calculado de forma multiplicativa (sin desbordar). */
export function choose(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    throw new RangeError(`Coeficiente binomial inválido: C(${n}, ${k})`)
  }
  const terms = Math.min(k, n - k)
  let result = 1
  for (let i = 1; i <= terms; i++) result = (result * (n - terms + i)) / i
  return Math.round(result)
}

export function binomialPmf(n: number, k: number, p: number): number {
  if (p < 0 || p > 1) throw new RangeError(`p fuera de [0, 1]: ${p}`)
  return choose(n, k) * p ** k * (1 - p) ** (n - k)
}

export function poissonPmf(lambda: number, k: number): number {
  if (lambda <= 0) throw new RangeError(`lambda debe ser positivo: ${lambda}`)
  if (!Number.isInteger(k) || k < 0) throw new RangeError(`k inválido: ${k}`)
  let factorial = 1
  for (let i = 2; i <= k; i++) factorial *= i
  return (Math.exp(-lambda) * lambda ** k) / factorial
}

/** Puntaje z: a cuántas desviaciones típicas de la media está x. */
export function zScore(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) throw new RangeError(`sigma debe ser positivo: ${sigma}`)
  return (x - mu) / sigma
}

/** Función de error (Abramowitz-Stegun 7.1.26, error máximo ≈ 1.5e-7). */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1
  const abs = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * abs)
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
  return sign * (1 - poly * Math.exp(-abs * abs))
}

/** Probabilidad acumulada de la Normal estándar. */
export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function logGamma(x: number): number {
  const coefficients = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
    -0.5395239384953e-5,
  ]
  let y = x
  const tmp = x + 5.5 - (x + 0.5) * Math.log(x + 5.5)
  let series = 1.000000000190015
  for (const c of coefficients) series += c / ++y
  return -tmp + Math.log((2.5066282746310005 * series) / x)
}

/** Fracción continua de la beta incompleta (Lentz). */
function betaContinuedFraction(a: number, b: number, x: number): number {
  const tiny = 1e-30
  let c = 1
  let d = 1 - ((a + b) * x) / (a + 1)
  if (Math.abs(d) < tiny) d = tiny
  d = 1 / d
  let h = d
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m
    let term = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2))
    d = 1 + term * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + term / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    h *= d * c
    term = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1))
    d = 1 + term * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + term / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const delta = d * c
    h *= delta
    if (Math.abs(delta - 1) < 1e-12) break
  }
  return h
}

/** Beta incompleta regularizada I_x(a, b). */
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  return x < (a + 1) / (a + b + 2)
    ? (front * betaContinuedFraction(a, b, x)) / a
    : 1 - (front * betaContinuedFraction(b, a, 1 - x)) / b
}

/** Probabilidad acumulada de la t de Student con `df` grados de libertad. */
export function tCdf(t: number, df: number): number {
  if (df <= 0) throw new RangeError(`Los grados de libertad deben ser positivos: ${df}`)
  const tail = 0.5 * regularizedIncompleteBeta(df / (df + t * t), df / 2, 0.5)
  return t > 0 ? 1 - tail : tail
}

/** p-valor de dos colas para un estadístico t. */
export function tTwoTailedPValue(t: number, df: number): number {
  return 2 * tCdf(-Math.abs(t), df)
}

/** Valor crítico t* tal que P(|T| > t*) = alpha, por bisección. */
export function tCritical(alpha: number, df: number): number {
  if (alpha <= 0 || alpha >= 1) throw new RangeError(`alpha fuera de (0, 1): ${alpha}`)
  let low = 0
  let high = 1000
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2
    if (tTwoTailedPValue(mid, df) > alpha) low = mid
    else high = mid
  }
  return (low + high) / 2
}
