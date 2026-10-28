import type { CourseContent } from '@/content/types'
import { aucByPairs, entropy, f1, logistic, logLikelihood, THRESHOLD_EXAMPLE } from '@/logic/classification/classification'
import { euclidean, kDistances, neighborhoodSide } from '@/logic/clustering/distance'
import { bayes } from '@/logic/simulations/bayes'
import { mean, sampleVariance } from '@/logic/statistics/descriptive'
import { binomialPmf, normalCdf, poissonPmf, tCritical, tTwoTailedPValue } from '@/logic/statistics/distributions'
import { bernoulliLikelihood, cohensD, confidenceInterval, standardError } from '@/logic/statistics/inference'
import { attenuationFactor, fStatistic, simpleOls, tRatio, waldEstimate } from '@/logic/statistics/regression'
import { GUIDE_POINTS, kmeansFrames, type Point } from '@/logic/simulations/kmeans'
import {
  allBootstrapSamples,
  exactBootstrapStandardError,
  lassoOneVariable,
  majorityVoteAccuracy,
  meanPredictionError,
  ridgeOneVariable,
  shrunkMeanError,
} from '@/logic/statistics/learning'
import { explainedVariance, symmetric2x2Eigenvalues } from '@/logic/statistics/pca'
import type { NumericExample } from './numeric-examples'

/**
 * Cifras de las ampliaciones (bloques `deepDive`), que van más allá de la guía. Igual que en
 * RNF-18, `snippet` es el texto literal que contiene la cifra, pero se busca en las ampliaciones
 * del curso y no en la guía; `actual` la recalcula con la lógica del curso.
 */
const r = String.raw

const guideYears = [8, 10, 12, 14, 16]
const guideSalaries = [22, 26, 28, 36, 38]
const guideFit = () => simpleOls(guideYears, guideSalaries)

// Mundo inventado de 3.4: salario = 2 × estudio + 3 × habilidad, sin error.
const ovbYears = [10, 12, 14, 16, 18]
const ovbAbility = [1, 1, 2, 3, 3]
const ovbSalaries = ovbYears.map((years, i) => 2 * years + 3 * (ovbAbility[i] as number))

const guideData = [2, 4, 4, 6, 9]
const sumOfSquaresAround = (data: number[], center: number) => data.reduce((acc, x) => acc + (x - center) ** 2, 0)
// Ampliación de 2.7: 1000 hipótesis, 100 reales, α = 0.05 y potencia 0.8.
const truePositives = 100 * 0.8
const falsePositives = 900 * 0.05

const example = (
  id: string,
  snippet: string,
  expected: number,
  precision: number,
  actual: () => number,
): NumericExample => ({ id, section: id.split('-')[0] as string, snippet, expected, precision, actual })

const deviationProducts = (x: number[], y: number[]) =>
  x.reduce((acc, xi, i) => acc + (xi - mean(x)) * ((y[i] as number) - mean(y)), 0)

// Ampliación de 0.2: un segundo test positivo parte de la a posteriori del primero.
const firstPositive = () => bayes({ prevalence: 0.01, sensitivity: 0.9, falsePositiveRate: 0.05 }).posterior as number
const secondPositive = () =>
  bayes({ prevalence: firstPositive(), sensitivity: 0.9, falsePositiveRate: 0.05 }).posterior as number
const gradientStep = (b: number, rate: number) => b - rate * 2 * (b - 3)
const quadratic = (b: number) => (b - 3) ** 2 + 1

const module0Examples: NumericExample[] = [
  example('0.1-suma-por-dos', r`$8 + 14 + 18 = 2 \times 20 = 40$`, 40, 6, () => [4, 7, 9].reduce((acc, x) => acc + 2 * x, 0)),
  example('0.1-desvios-suman-cero', r`$\sum (x_i - \bar{x}) = \sum x_i - n\bar{x} = 20 - 3 \times \tfrac{20}{3} = 0$`, 0, 6, () =>
    [4, 7, 9].reduce((acc, x) => acc + (x - mean([4, 7, 9])), 0),
  ),
  example('0.2-racha-seis-caras', r`$0.5^6 \approx 0.016$`, 0.016, 3, () => 0.5 ** 6),
  example('0.2-bayes-positivo-enfermo', r`$0.154 \times 0.90 \approx 0.138$`, 0.138, 3, () => firstPositive() * 0.9),
  example('0.2-bayes-positivo-sano', r`$0.846 \times 0.05 \approx 0.042$`, 0.042, 3, () => (1 - firstPositive()) * 0.05),
  example('0.2-bayes-dos-positivos', r`$P(\text{enfermo} \mid \text{dos positivos}) \approx 0.138 / (0.138 + 0.042) \approx 0.766$`, 0.766, 3, secondPositive),
  example('0.2-esperanza-apuesta', r`$E(B) = 0.5 \times 100 + 0.5 \times 0 = 50$`, 50, 6, () => 0.5 * 100 + 0.5 * 0),
  example('0.2-varianza-apuesta', r`$0.5 \times (100-50)^2 + 0.5 \times (0-50)^2 = 2500$`, 2500, 6, () => 0.5 * (100 - 50) ** 2 + 0.5 * (0 - 50) ** 2),
  example('0.2-esperanza-total', r`$0.6 \times 30 + 0.4 \times 40 = 34$`, 34, 6, () => 0.6 * 30 + 0.4 * 40),
  ...([
    [25, 12, 4650],
    [40, 16, 6200],
    [31, 14, 5350],
  ] as const).map(([age, study, total]) =>
    example(`0.3-prediccion-${age}`, r`$1000 + 50 \cdot ${age} + 200 \cdot ${study} = ${total}$`, total, 6, () => 1000 + 50 * age + 200 * study),
  ),
  ...([
    ['a', r`$50 \cdot 30 + 0 \cdot 360 = 1500$`, 50, 0],
    ['b', r`$0 \cdot 30 + \tfrac{50}{12} \cdot 360 = 1500$`, 0, 50 / 12],
    ['c', r`$25 \cdot 30 + \tfrac{25}{12} \cdot 360 = 1500$`, 25, 25 / 12],
  ] as const).map(([key, snippet, perYear, perMonth]) =>
    example(`0.3-colinealidad-${key}`, snippet, 1500, 6, () => perYear * 30 + perMonth * 360),
  ),
  example('0.3-suma-productos', r`$32, 8, 0, 12, 32$, que suman $84$`, 84, 6, () => deviationProducts(guideYears, guideSalaries)),
  example('0.3-covarianza', r`la covarianza es $21$`, 21, 6, () => deviationProducts(guideYears, guideSalaries) / (guideYears.length - 1)),
  example('0.3-correlacion', r`$84 / \sqrt{40 \times 184} \approx 0.98$`, 0.98, 2, () =>
    deviationProducts(guideYears, guideSalaries) /
    Math.sqrt(deviationProducts(guideYears, guideYears) * deviationProducts(guideSalaries, guideSalaries)),
  ),
  example('0.4-f-de-5.001', r`$f(5.001) = 5.004001$`, 5.004001, 6, () => quadratic(5.001)),
  example('0.4-pendiente-secante', r`$0.004001 / 0.001 = 4.001$`, 4.001, 3, () => (quadratic(5.001) - quadratic(5)) / 0.001),
  example('0.4-absoluto-mediana', r`En $22$ (el valor del medio): $2 + 0 + 5 = 7$`, 7, 6, () =>
    [20, 22, 27].reduce((acc, x) => acc + Math.abs(x - 22), 0),
  ),
  example('0.4-absoluto-promedio', r`En $23$ (el promedio): $3 + 1 + 4 = 8$`, 8, 6, () =>
    [20, 22, 27].reduce((acc, x) => acc + Math.abs(x - mean([20, 22, 27])), 0),
  ),
  example('0.4-paso-grande-ida', r`$b = 0 - 1 \cdot (-6) = 6$`, 6, 6, () => gradientStep(0, 1)),
  example('0.4-paso-grande-vuelta', r`$b = 6 - 1 \cdot 6 = 0$`, 0, 6, () => gradientStep(gradientStep(0, 1), 1)),
  example('0.5-ln-1.10', r`$\ln(110) - \ln(100) = \ln(110/100) = \ln(1.10) \approx 0.0953$`, 0.0953, 4, () => Math.log(110) - Math.log(100)),
  example('0.5-bajada-asimetrica', r`$10/110 \approx 9.09$ %`, 9.09, 2, () => (100 * 10) / 110),
  example('0.5-interes-mensual', r`$(1 + 1/12)^{12} \approx 2.613$`, 2.613, 3, () => (1 + 1 / 12) ** 12),
  example('0.5-interes-diario', r`$(1 + 1/365)^{365} \approx 2.715$`, 2.715, 3, () => (1 + 1 / 365) ** 365),
]

// Ampliaciones de 4.4: lift = P(A y B) / (P(A)·P(B)) sobre 5 tickets.
const lift = (both: number, a: number, b: number) => both / 5 / ((a / 5) * (b / 5))
const dbscanPoints = [1, 1.5, 2, 2.5, 3.4, 8, 8.4, 9, 20]
// Ejemplo de 4.3: 10 enfermos de 100, recall 0.8 y especificidad 0.8.
const precisionAt = (prevalence: number) =>
  bayes({ prevalence, sensitivity: 0.8, falsePositiveRate: 0.2 }).posterior as number

const module4Examples: NumericExample[] = [
  example('4.2-lado-2d', r`$\sqrt{0.1} \approx 0.316$`, 0.316, 3, () => neighborhoodSide(0.1, 2)),
  example('4.2-lado-10d', r`$0.1^{1/10} \approx 0.794$`, 0.794, 3, () => neighborhoodSide(0.1, 10)),
  example('4.2-min-max-con-extremo', r`$(20 - 10)/(1000 - 10) \approx 0.0101$`, 0.0101, 4, () => (20 - 10) / (1000 - 10)),
  example('4.3-sorpresa-0.6', r`$-\log_2 0.6 \approx 0.737$`, 0.737, 3, () => -Math.log2(0.6)),
  example('4.3-sorpresa-0.4', r`$-\log_2 0.4 \approx 1.322$`, 1.322, 3, () => -Math.log2(0.4)),
  example('4.3-entropia-promedio', r`$0.6 \times 0.737 + 0.4 \times 1.322 \approx 0.971$`, 0.971, 3, () => entropy([0.6, 0.4])),
  example('4.3-precision-10', r`$0.08/(0.08 + 0.18) \approx 0.31$`, 0.31, 2, () => precisionAt(0.1)),
  example('4.3-precision-50', r`$0.40/(0.40 + 0.10) = 0.80$`, 0.8, 6, () => precisionAt(0.5)),
  example('4.3-promedio-comun', r`alrededor de $0.55$, pero la $F_1$ da $0.44$`, 0.55, 2, () => (8 / 26 + 0.8) / 2),
  example('4.3-f1', r`alrededor de $0.55$, pero la $F_1$ da $0.44$`, 0.44, 2, () => f1(8 / 26, 0.8)),
  example('4.3-f1-todos-positivos', r`La $F_1$ le da $\approx 0.18$`, 0.18, 2, () => f1(0.1, 1)),
  example('4.4-lift-original', r`$0.6/(0.8 \times 0.6) = 1.25$`, 1.25, 6, () => lift(3, 4, 3)),
  example('4.4-lift-con-cerveza-extra', r`$0.6/(0.8 \times 0.8) \approx 0.94$`, 0.94, 2, () => lift(3, 4, 4)),
  example('4.4-lift-sin-panales', r`$0.6/(0.6 \times 0.6) \approx 1.67$`, 1.67, 2, () => lift(3, 3, 3)),
  example('4.4-combinaciones-20', r`ya son $1\,048\,575$`, 1048575, 6, () => 2 ** 20 - 1),
  example('4.5-distancia-ab', r`$\sqrt{30^2 + 1000^2} \approx 1000.45$`, 1000.45, 2, () => euclidean([30, 50000], [60, 51000])),
  example('4.5-distancia-ac', r`$\sqrt{1^2 + 10\,000^2} \approx 10\,000$`, 10000, 3, () => euclidean([30, 50000], [31, 60000])),
  ...dbscanPoints.map((point, i) =>
    example(`4.5-k-distancia-${point}`, String.raw`$1 \to 1$, $\ 1.5 \to 0.5$, $\ 2 \to 0.5$, $\ 2.5 \to 0.9$, $\ 3.4 \to 1.4$, $\ 8 \to 1$, $\ 8.4 \to 0.6$, $\ 9 \to 1$, $\ 20 \to 11.6$`,
      [1, 0.5, 0.5, 0.9, 1.4, 1, 0.6, 1, 11.6][i] as number, 6, () => kDistances(dbscanPoints, 2)[i] as number),
  ),
]

// Ampliaciones de 5.2: los 8 pasajeros de 4.3 y un segundo modelo con la mitad de cada probabilidad.
const passengers = THRESHOLD_EXAMPLE.probabilities as readonly number[]
const survived = THRESHOLD_EXAMPLE.labels
const halved = passengers.map((p) => p / 2)
// Separación perfecta: x = 0 no sobrevive, x = 1 sobrevive, z = β (x - 0.5).
const separatedLogLikelihood = (beta: number) => logLikelihood([logistic(-beta / 2), logistic(beta / 2)], [0, 1])
// Ejemplo LDA de 5.4: A ~ N(2, 2²), B ~ N(6, 2²); verosimilitudes relativas como en la guía.
const ldaPosteriorB = (x: number) => {
  const a = Math.exp(-((x - 2) ** 2) / 8)
  const b = Math.exp(-((x - 6) ** 2) / 8)
  return b / (a + b)
}

const module5Examples: NumericExample[] = [
  example('5.1-varianza-bernoulli', r`$0.9 \times 0.1^2 + 0.1 \times 0.9^2 = 0.009 + 0.081 = 0.09$`, 0.09, 6, () => 0.9 * 0.1 ** 2 + 0.1 * 0.9 ** 2),
  example('5.1-logistica-en-1', r`en $z = 1$ la curva da $0.731$`, 0.731, 3, () => logistic(1)),
  example('5.1-tangente-en-1', r`$0.5 + 1/4 = 0.75$`, 0.75, 6, () => logistic(0) + 1 / 4),
  example('5.2-log-odds-0.8', r`$\ln 4 \approx 1.386$`, 1.386, 3, () => Math.log(0.8 / 0.2)),
  example('5.2-log-odds-0.2', r`$\ln 0.25 \approx -1.386$`, -1.386, 3, () => Math.log(0.2 / 0.8)),
  example('5.2-log-odds-0.99', r`$\ln 99 \approx 4.595$`, 4.595, 3, () => Math.log(0.99 / 0.01)),
  ...([
    [0.9, r`$-\ln 0.9 \approx 0.105$`, 0.105],
    [0.1, r`$-\ln 0.1 \approx 2.303$`, 2.303],
    [0.01, r`$-\ln 0.01 \approx 4.605$`, 4.605],
  ] as const).map(([p, snippet, loss]) => example(`5.2-log-loss-${p}`, snippet, loss, 3, () => -logLikelihood([p], [1]))),
  example('5.2-cuadrado-0.1', r`$(1 - 0.1)^2 = 0.81$`, 0.81, 6, () => (1 - 0.1) ** 2),
  example('5.2-cuadrado-0.01', r`$(1 - 0.01)^2 \approx 0.98$`, 0.98, 2, () => (1 - 0.01) ** 2),
  example('5.2-separacion-2', r`**$\beta = 2$:** $\ell \approx -0.627$`, -0.627, 3, () => separatedLogLikelihood(2)),
  example('5.2-separacion-10', r`**$\beta = 10$:** $\ell \approx -0.0134$`, -0.0134, 4, () => separatedLogLikelihood(10)),
  example('5.2-separacion-20', r`**$\beta = 20$:** $\ell \approx -0.0001$`, -0.0001, 4, () => separatedLogLikelihood(20)),
  example('5.2-auc-pares', r`$2 + 4 + 5 = 11$ pares de 15`, 11, 6, () => 15 * aucByPairs(passengers, survived)),
  example('5.2-auc', r`$11/15 \approx 0.733$`, 0.733, 3, () => aucByPairs(passengers, survived)),
  example('5.2-auc-mitad', r`su AUC sigue siendo $0.733$`, 0.733, 3, () => aucByPairs(halved, survived)),
  example('5.2-promedio-original', r`en promedio $0.506$`, 0.506, 3, () => mean([...passengers])),
  example('5.2-promedio-mitad', r`y este, $0.253$`, 0.253, 3, () => mean(halved)),
  example('5.2-sobrevivientes', r`5 de 8 ($0.625$)`, 0.625, 3, () => mean(survived.map(Number))),
  example('5.2-loglik-original', r`pasa de $-4.67$ a $-7.29$`, -4.67, 2, () => logLikelihood(passengers, survived)),
  example('5.2-loglik-mitad', r`pasa de $-4.67$ a $-7.29$`, -7.29, 2, () => logLikelihood(halved, survived)),
  example('5.3-desvio-logistica', r`$\pi/\sqrt{3} \approx 1.81$`, 1.81, 2, () => Math.PI / Math.sqrt(3)),
  example('5.3-densidad-normal-0', r`$1/\sqrt{2\pi} \approx 0.399$`, 0.399, 3, () => 1 / Math.sqrt(2 * Math.PI)),
  example('5.3-pendiente-logistica-0', r`la logística sube a razón de $1/4$`, 0.25, 6, () => (logistic(1e-6) - logistic(-1e-6)) / 2e-6),
  example('5.3-factor-1.6', r`$0.399/0.25 \approx 1.6$`, 1.6, 1, () => 1 / Math.sqrt(2 * Math.PI) / 0.25),
  example('5.3-phi-1', r`$\Phi(1) \approx 0.841$`, 0.841, 3, () => normalCdf(1)),
  example('5.3-logistica-1.6', r`la logística evaluada en $1.6 \times 1$ da $0.832$`, 0.832, 3, () => logistic(1.6)),
  example('5.4-lda-posterior', r`$1/(1+e^{-1}) \approx 0.731$`, 0.731, 3, () => ldaPosteriorB(5)),
  example('5.4-lda-es-logistica', r`la función logística de la sección 5.2 aplicada a $x - 4$`, 0, 6, () =>
    [0, 3, 5, 7.5].reduce((acc, x) => acc + Math.abs(ldaPosteriorB(x) - logistic(x - 4)), 0),
  ),
  example('5.4-ln-priors', r`$\ln(0.2/0.8) \approx -1.386$`, -1.386, 3, () => Math.log(0.2 / 0.8)),
  example('5.4-frontera-priors', r`$x = 4 + 1.386 \approx 5.39$`, 5.39, 2, () => (2 + 6) / 2 - (4 * Math.log(0.8 / 0.2)) / (2 - 6)),
  example('5.4-correcta-spam', r`$0.4 \times 0.5 = 0.20$`, 0.2, 6, () => 0.4 * 0.5),
  example('5.4-correcta-legitimo', r`$0.6 \times 0.05 = 0.03$`, 0.03, 6, () => 0.6 * 0.05),
  example('5.4-correcta', r`$0.20/0.23 \approx 0.87$`, 0.87, 2, () => bayes({ prevalence: 0.4, sensitivity: 0.5, falsePositiveRate: 0.05 }).posterior as number),
  example('5.4-naive-spam', r`$0.4 \times 0.5 \times 0.5 = 0.1$`, 0.1, 6, () => 0.4 * 0.5 * 0.5),
  example('5.4-naive-legitimo', r`$0.6 \times 0.05 \times 0.05 = 0.0015$`, 0.0015, 6, () => 0.6 * 0.05 * 0.05),
  example('5.4-naive', r`$0.1/0.1015 \approx 0.985$`, 0.985, 3, () => (0.4 * 0.25) / (0.4 * 0.25 + 0.6 * 0.0025)),
]

// Ampliaciones del Módulo 6.
const meanError = meanPredictionError(4, 5)
const bootstrapData = [2, 4, 9]
const finalSse = (points: readonly Point[], initial: readonly Point[]) => {
  const frames = kmeansFrames(points, initial)
  return frames[frames.length - 1]?.sse as number
}
const guideStart = [GUIDE_POINTS[0], GUIDE_POINTS[3]] as Point[]
const rectangle: Point[] = [[0, 0], [10, 0], [0, 1], [10, 1]]
const phi = ([a, b]: readonly [number, number]) => [a ** 2, Math.SQRT2 * a * b, b ** 2]
const dot = (u: readonly number[], v: readonly number[]) => u.reduce((acc, ui, i) => acc + ui * (v[i] as number), 0)
const correlated = symmetric2x2Eigenvalues(1, 0.9, 1)

const module6Examples: NumericExample[] = [
  example('6.1-entrenamiento', r`$\tfrac{4}{5} \times 4 = 3.2$`, 3.2, 1, () => meanError.training),
  example('6.1-prueba', r`$\tfrac{6}{5} \times 4 = 4.8$`, 4.8, 1, () => meanError.test),
  example('6.1-optimismo', r`un 50 % más de error`, 50, 0, () => (meanError.test / meanError.training - 1) * 100),
  example('6.2-varianza-encogida', r`$0.8^2 \times 4 = 2.56$`, 2.56, 2, () => shrunkMeanError(0.8, 2, 4).variance),
  example('6.2-sesgo-mu-2', r`el sesgo es $0.4$ y su cuadrado, $0.16$`, 0.16, 2, () => shrunkMeanError(0.8, 2, 4).bias2),
  example('6.2-total-mu-2', r`$0.16 + 2.56 = 2.72$`, 2.72, 2, () => shrunkMeanError(0.8, 2, 4).mse),
  example('6.2-sesgo-mu-10', r`el sesgo es $2$ y su cuadrado, $4$`, 4, 6, () => shrunkMeanError(0.8, 10, 4).bias2),
  example('6.2-total-mu-10', r`$4 + 2.56 = 6.56$`, 6.56, 2, () => shrunkMeanError(0.8, 10, 4).mse),
  example('6.3-muestras', r`$3^3 = 27$`, 27, 6, () => allBootstrapSamples(bootstrapData).length),
  example('6.3-media-alta', r`$(9, 9, 4)$ con media $7.33$`, 7.33, 2, () => mean([9, 9, 4])),
  example('6.3-error-estandar', r`Su desviación típica es $\approx 1.70$`, 1.7, 2, () => exactBootstrapStandardError(bootstrapData)),
  example('6.3-formula', r`$\sqrt{(26/3)/3}$`, 1.7, 2, () => Math.sqrt(26 / 3 / 3)),
  example('6.3-cifras', r`un número de 27 cifras`, 27, 6, () => Math.floor(20 * Math.log10(20)) + 1),
  example('6.3-sin-el-2', r`son $2^3 = 8$ de las 27`, 8, 6, () => allBootstrapSamples(bootstrapData).filter((x) => !x.includes(2)).length),
  example('6.3-fuera', r`$(2/3)^3 \approx 0.296$`, 0.296, 3, () => (1 - 1 / 3) ** 3),
  example('6.4-ridge-3', r`Ridge da $3/3 = 1$`, 1, 6, () => ridgeOneVariable(3, 2)),
  example('6.4-lasso-3', r`Lasso $3 - 1 = 2$`, 2, 6, () => lassoOneVariable(3, 2)),
  example('6.4-ridge-0.5', r`$0.5/3 \approx 0.167$`, 0.167, 3, () => ridgeOneVariable(0.5, 2)),
  example('6.4-lasso-0.5', r`Lasso da **exactamente 0**`, 0, 6, () => lassoOneVariable(0.5, 2)),
  example('6.5-tres', r`$P(3) = 10 \times 0.7^3 \times 0.3^2 \approx 0.309$`, 0.309, 3, () => binomialPmf(5, 3, 0.7)),
  example('6.5-cuatro', r`$P(4) = 5 \times 0.7^4 \times 0.3 \approx 0.360$`, 0.36, 3, () => binomialPmf(5, 4, 0.7)),
  example('6.5-cinco', r`$P(5) = 0.7^5 \approx 0.168$`, 0.168, 3, () => binomialPmf(5, 5, 0.7)),
  example('6.5-voto', r`el comité acierta el **83.7 %**`, 83.7, 1, () => majorityVoteAccuracy(5, 0.7) * 100),
  example('6.5-voto-malo', r`el comité acierta el 40.7 %`, 40.7, 1, () => majorityVoteAccuracy(5, 0.45) * 100),
  example('6.6-camino-largo', r`$9 + 12 + 4 = 25$`, 25, 6, () => dot(phi([1, 2]), phi([3, 1]))),
  example('6.6-atajo', r`$5^2 = 25$`, 25, 6, () => dot([1, 2], [3, 1]) ** 2),
  example('6.6-coordenadas', r`tendría 5050 coordenadas`, 5050, 6, () => 100 + (100 * 99) / 2),
  example('6.6-rbf-1', r`$K = e^{-1} \approx 0.368$`, 0.368, 3, () => Math.exp(-1)),
  example('6.6-rbf-10', r`$K = e^{-10} \approx 0.00005$`, 0.00005, 5, () => Math.exp(-10)),
  example('6.7-primera-asignacion', r`$(0 + 1 + 9) + (0 + 1 + 9) = 20$`, 20, 6, () => kmeansFrames(GUIDE_POINTS, guideStart)[1]?.sse as number),
  example('6.7-final', r`baja a $9.33$`, 9.33, 2, () => finalSse(GUIDE_POINTS, guideStart)),
  example('6.7-natural', r`SSE $= 4 \times 0.5^2 = 1$`, 1, 6, () => finalSse(rectangle, [[0, 0.5], [10, 0.5]])),
  example('6.7-trampa', r`SSE $= 4 \times 25 = 100$`, 100, 6, () => finalSse(rectangle, [[0, 0], [0, 1]])),
  example('6.8-autovalores', r`los autovalores son $1.9$ y $0.1$`, 1.9, 1, () => correlated[0]),
  example('6.8-segundo', r`los autovalores son $1.9$ y $0.1$`, 0.1, 1, () => correlated[1]),
  example('6.8-primero', r`$1.9/2 = 95$ %`, 95, 0, () => (explainedVariance(correlated)[0] as number) * 100),
  example('6.8-resto', r`apenas el 5 %`, 5, 0, () => (explainedVariance(correlated)[1] as number) * 100),
  example('6.8-sin-correlacion', r`cada componente explica el 50 %`, 50, 0, () => (explainedVariance(symmetric2x2Eigenvalues(1, 0, 1))[0] as number) * 100),
]

export const expansionExamples: NumericExample[] = [
  ...module0Examples,
  ...module4Examples,
  ...module5Examples,
  ...module6Examples,
  {
    id: '2.2-desvios-suman-cero',
    section: '2.2',
    snippet: r`$-3 - 1 - 1 + 1 + 4 = 0$`,
    expected: 0,
    precision: 6,
    actual: () => guideData.reduce((acc, x) => acc + (x - mean(guideData)), 0),
  },
  {
    id: '2.2-cuadrados-alrededor-de-6',
    section: '2.2',
    snippet: r`$16 + 4 + 4 + 0 + 9 = 33$`,
    expected: 33,
    precision: 6,
    actual: () => sumOfSquaresAround(guideData, 6),
  },
  {
    id: '2.3-media-imputada',
    section: '2.3',
    snippet: r`la media baja de $5$ a $4$`,
    expected: 4,
    precision: 6,
    actual: () => mean([2, 4, 4, 6, mean([2, 4, 4, 6])]),
  },
  {
    id: '2.3-varianza-imputada',
    section: '2.3',
    snippet: r`se desploma de $7$ a $s^2 = 8/4 = 2$`,
    expected: 2,
    precision: 6,
    actual: () => sampleVariance([2, 4, 4, 6, mean([2, 4, 4, 6])]),
  },
  {
    id: '2.4-binomial-ninguna-llamada',
    section: '2.4',
    snippet: r`$0.995^{600} \approx 0.0494$`,
    expected: 0.0494,
    precision: 4,
    actual: () => binomialPmf(600, 0, 0.005),
  },
  {
    id: '2.4-poisson-ninguna-llamada',
    section: '2.4',
    snippet: r`$e^{-3} \approx 0.0498$`,
    expected: 0.0498,
    precision: 4,
    actual: () => poissonPmf(3, 0),
  },
  {
    id: '2.4-normal-1.96',
    section: '2.4',
    snippet: r`el 95 % del área queda entre $-1.96$ y $+1.96$`,
    expected: 0.95,
    precision: 3,
    actual: () => normalCdf(1.96) - normalCdf(-1.96),
  },
  {
    id: '2.4-cola-z2',
    section: '2.4',
    snippet: r`$1 - 0.977 \approx 0.023$`,
    expected: 0.023,
    precision: 3,
    actual: () => 1 - normalCdf(2),
  },
  ...([
    [3, 3.18],
    [35, 2.03],
  ] as const).map(([df, value]): NumericExample => ({
    id: `2.4-t-critico-gl-${df}`,
    section: '2.4',
    snippet: r`$${value}$`,
    expected: value,
    precision: 2,
    actual: () => tCritical(0.05, df),
  })),
  ...([
    [25, 5, 120],
    [100, 10, 60],
    [400, 20, 30],
  ] as const).map(([n, root, se]): NumericExample => ({
    id: `2.5-error-estandar-n-${n}`,
    section: '2.5',
    snippet: r`$n = ${n}$: error estándar $= 600/${root} = ${se}$`,
    expected: se,
    precision: 6,
    actual: () => standardError(600, n),
  })),
  {
    id: '2.6-ic99-margen',
    section: '2.6',
    snippet: r`$1050 \pm 2.576\times60 \approx 1050 \pm 154.6$`,
    expected: 154.6,
    precision: 1,
    actual: () => 2.576 * standardError(600, 100),
  },
  {
    id: '2.6-ic99-inferior',
    section: '2.6',
    snippet: r`$[895.4 ;\ 1204.6]$`,
    expected: 895.4,
    precision: 1,
    actual: () => confidenceInterval(1050, 600, 100, 2.576)[0],
  },
  {
    id: '2.6-ic99-superior',
    section: '2.6',
    snippet: r`$[895.4 ;\ 1204.6]$`,
    expected: 1204.6,
    precision: 1,
    actual: () => confidenceInterval(1050, 600, 100, 2.576)[1],
  },
  {
    id: '2.6-verosimilitud-0.6',
    section: '2.6',
    snippet: r`$L(0.6) = 0.6^7 \cdot 0.4^3 \approx 0.00179$`,
    expected: 0.00179,
    precision: 5,
    actual: () => bernoulliLikelihood(0.6, 7, 10),
  },
  {
    id: '2.6-verosimilitud-0.8',
    section: '2.6',
    snippet: r`$L(0.8) = 0.8^7 \cdot 0.2^3 \approx 0.00168$`,
    expected: 0.00168,
    precision: 5,
    actual: () => bernoulliLikelihood(0.8, 7, 10),
  },
  {
    id: '2.7-verdaderos-positivos',
    section: '2.7',
    snippet: r`$100 \times 0.8 = 80$`,
    expected: 80,
    precision: 6,
    actual: () => truePositives,
  },
  {
    id: '2.7-falsos-positivos',
    section: '2.7',
    snippet: r`$900 \times 0.05 = 45$`,
    expected: 45,
    precision: 6,
    actual: () => falsePositives,
  },
  {
    id: '2.7-falsas-alarmas',
    section: '2.7',
    snippet: r`$45/125 = 36$ %`,
    expected: 36,
    precision: 6,
    actual: () => (100 * falsePositives) / (truePositives + falsePositives),
  },
  {
    id: '2.7-p-valor-baterias',
    section: '2.7',
    snippet: r`en total $\approx 0.053$`,
    expected: 0.053,
    precision: 3,
    actual: () => tTwoTailedPValue(-2, 35),
  },
  {
    id: '2.7-cola-baterias',
    section: '2.7',
    snippet: r`alrededor de $2.7$ % de cada lado`,
    expected: 2.7,
    precision: 1,
    actual: () => (100 * tTwoTailedPValue(-2, 35)) / 2,
  },
  {
    id: '2.7-ic-baterias-inferior',
    section: '2.7',
    snippet: r`$[91.94 ;\ 100.06]$`,
    expected: 91.94,
    precision: 2,
    actual: () => confidenceInterval(96, 12, 36, tCritical(0.05, 35))[0],
  },
  {
    id: '2.7-ic-baterias-superior',
    section: '2.7',
    snippet: r`$[91.94 ;\ 100.06]$`,
    expected: 100.06,
    precision: 2,
    actual: () => confidenceInterval(96, 12, 36, tCritical(0.05, 35))[1],
  },
  {
    id: '2.7-t-desde-d-baterias',
    section: '2.7',
    snippet: r`$t = -0.33 \times 6 \approx -2$`,
    expected: -2,
    precision: 6,
    actual: () => cohensD(96 - 100, 12) * Math.sqrt(36),
  },
  {
    id: '2.7-t-desde-d-muestra-gigante',
    section: '2.7',
    snippet: r`$t \approx 0.0417 \times 316 \approx 13.2$`,
    expected: 13.2,
    precision: 1,
    actual: () => cohensD(0.5, 12) * Math.sqrt(100_000),
  },
  {
    id: '3.3-t-sin-redondear',
    section: '3.3',
    snippet: r`Sin redondear, $t \approx 8.34$`,
    expected: 8.34,
    precision: 2,
    actual: () => tRatio(guideFit().slope, guideFit().slopeStandardError),
  },
  {
    id: '3.3-F',
    section: '3.3',
    snippet: r`$F = \dfrac{(184 - 7.6)/1}{7.6/3} \approx 69.6$`,
    expected: 69.6,
    precision: 1,
    actual: () => fStatistic(guideFit().sst, guideFit().ssr, 1, 3),
  },
  {
    id: '3.3-F-igual-t2',
    section: '3.3',
    snippet: r`que es exactamente $t^2$`,
    expected: 0,
    precision: 6,
    actual: () => fStatistic(guideFit().sst, guideFit().ssr, 1, 3) - tRatio(guideFit().slope, guideFit().slopeStandardError) ** 2,
  },
  {
    id: '3.4-salarios',
    section: '3.4',
    snippet: r`sus salarios $23, 27, 34, 41, 45$`,
    expected: 0,
    precision: 6,
    actual: () => [23, 27, 34, 41, 45].reduce((acc, value, i) => acc + Math.abs(value - (ovbSalaries[i] as number)), 0),
  },
  {
    id: '3.4-pendiente-simple',
    section: '3.4',
    snippet: r`$\tilde\beta_1 = 116/40 = 2.9$`,
    expected: 2.9,
    precision: 1,
    actual: () => simpleOls(ovbYears, ovbSalaries).slope,
  },
  {
    id: '3.4-habilidad-sobre-estudio',
    section: '3.4',
    snippet: r`$\tilde\delta_1 = 12/40 = 0.3$`,
    expected: 0.3,
    precision: 1,
    actual: () => simpleOls(ovbYears, ovbAbility).slope,
  },
  {
    id: '3.4-descomposicion',
    section: '3.4',
    snippet: r`$2.9 = 2 + 3 \times 0.3$`,
    expected: 2.9,
    precision: 6,
    actual: () => 2 + 3 * simpleOls(ovbYears, ovbAbility).slope,
  },
  {
    id: '3.5-exp-0.08',
    section: '3.5',
    snippet: r`$e^{0.08} \approx 1.083$`,
    expected: 1.083,
    precision: 3,
    actual: () => Math.exp(0.08),
  },
  {
    id: '3.5-exp-0.5',
    section: '3.5',
    snippet: r`$e^{0.5} - 1 \approx 64.9$ %`,
    expected: 64.9,
    precision: 1,
    actual: () => 100 * (Math.exp(0.5) - 1),
  },
  {
    id: '3.7-t-usual',
    section: '3.7',
    snippet: r`$t = 0.6/0.25 = 2.4$`,
    expected: 2.4,
    precision: 1,
    actual: () => tRatio(0.6, 0.25),
  },
  {
    id: '3.7-t-correcto',
    section: '3.7',
    snippet: r`$0.6/0.4 = 1.5$`,
    expected: 1.5,
    precision: 1,
    actual: () => tRatio(0.6, 0.4),
  },
  {
    id: '3.7-atenuacion',
    section: '3.7',
    snippet: r`el factor es $0.5$ y un efecto verdadero de $2$ aparece como $1$`,
    expected: 1,
    precision: 6,
    actual: () => 2 * attenuationFactor(4, 4),
  },
  {
    id: '3.7-wald',
    section: '3.7',
    snippet: r`$0.4 / 0.5 = 0.8$ mil`,
    expected: 0.8,
    precision: 1,
    actual: () => waldEstimate(0.4, 0.5),
  },
  {
    id: '3.8-did-regresion',
    section: '3.8',
    snippet: r`$21 = 25 - 5 - 2 + \delta$, así que $\delta = 3$`,
    expected: 3,
    precision: 6,
    actual: () => 21 - (25 + (20 - 25) + (23 - 25)),
  },
]

/** Texto de las ampliaciones de una sección, donde debe figurar el `snippet` de sus ejemplos. */
export function expansionText(content: CourseContent, sectionId: string): string {
  return content.sections
    .filter((section) => section.id === sectionId)
    .flatMap((section) => section.blocks)
    .flatMap((block) => (block.type === 'deepDive' ? [block.title, block.text] : []))
    .join('\n')
}
