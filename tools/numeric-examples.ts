import {
  confusionAtThreshold,
  forestProbability,
  gini,
  logLikelihood,
  logistic,
  odds,
  oddsRatio,
  precision,
  probabilityAfterOddsRatio,
  recall,
  specificity,
  THRESHOLD_EXAMPLE,
  vif,
  weightedGini,
} from '@/logic/classification/classification'
import { bayes } from '@/logic/simulations/bayes'
import { assignLabels, sse, updateCentroids, GUIDE_POINTS, GUIDE_START_INDEXES, type Point } from '@/logic/simulations/kmeans'
import { cumulativeVariance, eigenvalueFromShare, kaiserCount } from '@/logic/statistics/pca'
import { mean, sampleStdDev, sampleVariance } from '@/logic/statistics/descriptive'
import { binomialPmf, normalCdf, poissonPmf, tCritical, tTwoTailedPValue, zScore } from '@/logic/statistics/distributions'
import {
  bernoulliLikelihood,
  cohensD,
  confidenceInterval,
  mleProportion,
  standardError,
  tStatistic,
} from '@/logic/statistics/inference'

/**
 * Un resultado numérico de un ejemplo de la guía y cómo lo calcula el curso (RNF-18).
 * `snippet` es el texto literal de la guía que contiene el resultado: si no está, la verificación
 * falla (así no se pueden "esperar" cifras que la guía no dice). `precision` es la cantidad de
 * decimales que imprime la guía; se compara con tolerancia de medio decimal de esa cifra.
 */
export interface NumericExample {
  id: string
  section: string
  snippet: string
  expected: number
  precision: number
  actual: () => number
}

const r = String.raw
const bayesGuide = () => bayes({ prevalence: 0.01, sensitivity: 0.9, falsePositiveRate: 0.05 })
const guideStart = (): Point[] => GUIDE_START_INDEXES.map((index) => GUIDE_POINTS[index] as Point)
const guideLabels = () => assignLabels(GUIDE_POINTS, guideStart())
const guideCentroids = () => updateCentroids(GUIDE_POINTS, guideLabels(), guideStart())

/** Filas de la tabla de umbrales del ejemplo ilustrativo de 4.3 (recall, precisión y especificidad). */
function umbralExamples(): NumericExample[] {
  const rows: [number, string, [number, number, number]][] = [
    [0.3, r`| $0.30$ | 4 | 2 | 1 | 1 | $0.80$ | $0.67$ | $0.33$ |`, [0.8, 0.67, 0.33]],
    [0.5, r`| $0.50$ | 3 | 1 | 2 | 2 | $0.60$ | $0.75$ | $0.67$ |`, [0.6, 0.75, 0.67]],
    [0.7, r`| $0.70$ | 2 | 0 | 3 | 3 | $0.40$ | $1.00$ | $1.00$ |`, [0.4, 1, 1]],
  ]
  return rows.flatMap(([threshold, snippet, [r, p, e]]) => {
    const matrix = () => confusionAtThreshold(THRESHOLD_EXAMPLE.probabilities, THRESHOLD_EXAMPLE.labels, threshold)
    const tag = String(threshold).replace('.', '')
    return [
      { id: `umbral-${tag}-recall`, section: '4.3', snippet, expected: r, precision: 2, actual: () => recall(matrix()) },
      { id: `umbral-${tag}-precision`, section: '4.3', snippet, expected: p, precision: 2, actual: () => precision(matrix()) },
      { id: `umbral-${tag}-especificidad`, section: '4.3', snippet, expected: e, precision: 2, actual: () => specificity(matrix()) },
    ]
  })
}

export const numericExamples: NumericExample[] = [
  // 0.2 Probabilidad: test médico (Bayes)
  { id: 'bayes-positivo-enfermo', section: '0.2', snippet: r`$0.01 \times 0.90 = 0.009$`, expected: 0.009, precision: 3, actual: () => bayesGuide().truePositives / 1000 },
  { id: 'bayes-positivo-sano', section: '0.2', snippet: r`$0.99 \times 0.05 = 0.0495$`, expected: 0.0495, precision: 4, actual: () => bayesGuide().falsePositives / 1000 },
  { id: 'bayes-total-positivos', section: '0.2', snippet: r`$0.009 + 0.0495 = 0.0585$`, expected: 0.0585, precision: 4, actual: () => bayesGuide().positives / 1000 },
  { id: 'bayes-posterior', section: '0.2', snippet: r`0.009 / 0.0585 \approx 0.154$`, expected: 0.154, precision: 3, actual: () => bayesGuide().posterior ?? Number.NaN },
  { id: 'bayes-porcentaje', section: '0.2', snippet: '**Solo 15.4 %**', expected: 15.4, precision: 1, actual: () => (bayesGuide().posterior ?? 0) * 100 },

  // 2.2 Medidas descriptivas
  { id: 'media-ejemplo', section: '2.2', snippet: 'Media: $25/5 = 5$', expected: 5, precision: 0, actual: () => mean([2, 4, 4, 6, 9]) },
  { id: 'varianza-ejemplo', section: '2.2', snippet: '$s^2 = 28/4 = 7$', expected: 7, precision: 0, actual: () => sampleVariance([2, 4, 4, 6, 9]) },
  { id: 'desvio-ejemplo', section: '2.2', snippet: r`\sqrt{7} \approx 2.65`, expected: 2.65, precision: 2, actual: () => sampleStdDev([2, 4, 4, 6, 9]) },
  { id: 'media-con-atipico', section: '2.2', snippet: 'La media salta a $21.2$', expected: 21.2, precision: 1, actual: () => mean([2, 4, 4, 6, 90]) },

  // 2.4 Distribuciones
  { id: 'binomial-3-caras', section: '2.4', snippet: r`= 120/1024 \approx 0.117`, expected: 0.117, precision: 3, actual: () => binomialPmf(10, 3, 0.5) },
  { id: 'poisson-ninguna', section: '2.4', snippet: r`e^{-3} \approx 0.050`, expected: 0.05, precision: 3, actual: () => poissonPmf(3, 0) },
  { id: 'poisson-dos', section: '2.4', snippet: r`e^{-3}\cdot 9/2 \approx 0.224`, expected: 0.224, precision: 3, actual: () => poissonPmf(3, 2) },
  { id: 'z-cociente', section: '2.4', snippet: 'un valor de 130 tiene $z=2$', expected: 2, precision: 0, actual: () => zScore(130, 100, 15) },
  { id: 'z-cola', section: '2.4', snippet: 'solo ~2.3 % de la gente lo supera', expected: 2.3, precision: 1, actual: () => (1 - normalCdf(2)) * 100 },

  // 2.5 TLC
  { id: 'tlc-error-estandar', section: '2.5', snippet: '$600/10 = 60$', expected: 60, precision: 0, actual: () => standardError(600, 100) },
  { id: 'tlc-limite-inferior', section: '2.5', snippet: 'entre 880 y 1120', expected: 880, precision: 0, actual: () => confidenceInterval(1000, 600, 100, 2)[0] },
  { id: 'tlc-limite-superior', section: '2.5', snippet: 'entre 880 y 1120', expected: 1120, precision: 0, actual: () => confidenceInterval(1000, 600, 100, 2)[1] },

  // 2.6 Estimación
  { id: 'ic-margen', section: '2.6', snippet: r`1050 \pm 117.6`, expected: 117.6, precision: 1, actual: () => 1.96 * standardError(600, 100) },
  { id: 'ic-inferior', section: '2.6', snippet: '[932.4 ; 1167.6]', expected: 932.4, precision: 1, actual: () => confidenceInterval(1050, 600, 100)[0] },
  { id: 'ic-superior', section: '2.6', snippet: '[932.4 ; 1167.6]', expected: 1167.6, precision: 1, actual: () => confidenceInterval(1050, 600, 100)[1] },
  { id: 'verosimilitud-05', section: '2.6', snippet: r`\approx 0.00098`, expected: 0.00098, precision: 5, actual: () => bernoulliLikelihood(0.5, 7, 10) },
  { id: 'verosimilitud-07', section: '2.6', snippet: r`\approx 0.00222`, expected: 0.00222, precision: 5, actual: () => bernoulliLikelihood(0.7, 7, 10) },
  { id: 'mle-moneda', section: '2.6', snippet: r`\hat{p} = 7/10 = 0.7$`, expected: 0.7, precision: 1, actual: () => mleProportion(7, 10) },

  // 2.7 Contraste de hipótesis
  { id: 'baterias-error-estandar', section: '2.7', snippet: r`12/\sqrt{36} = 2$`, expected: 2, precision: 0, actual: () => standardError(12, 36) },
  { id: 'baterias-t', section: '2.7', snippet: '$t = (96-100)/2 = -2$', expected: -2, precision: 0, actual: () => tStatistic(96, 100, 12, 36) },
  { id: 'baterias-valor-critico', section: '2.7', snippet: 'es aprox. $2.03$', expected: 2.03, precision: 2, actual: () => tCritical(0.05, 35) },
  { id: 'baterias-p-valor', section: '2.7', snippet: 'aproximadamente $0.053$', expected: 0.053, precision: 3, actual: () => tTwoTailedPValue(-2, 35) },
  { id: 'baterias-t-95', section: '2.7', snippet: '$t=-2.5$ y $p \\approx 0.017$', expected: -2.5, precision: 1, actual: () => tStatistic(95, 100, 12, 36) },
  { id: 'baterias-p-valor-95', section: '2.7', snippet: '$t=-2.5$ y $p \\approx 0.017$', expected: 0.017, precision: 3, actual: () => tTwoTailedPValue(-2.5, 35) },
  { id: 'baterias-d-cohen', section: '2.7', snippet: r`\approx -0.33$`, expected: -0.33, precision: 2, actual: () => cohensD(96 - 100, 12) },
  { id: 'muestra-enorme-t', section: '2.7', snippet: r`daría $t \approx 13$`, expected: 13, precision: 0, actual: () => tStatistic(100.5, 100, 12, 100_000) },
  { id: 'muestra-enorme-d', section: '2.7', snippet: r`$d \approx 0.04$`, expected: 0.04, precision: 2, actual: () => cohensD(0.5, 12) },

  // Respuestas del Módulo 2
  { id: 'resp2-media', section: 'Respuestas M2', snippet: 'Media $= 7$.', expected: 7, precision: 0, actual: () => mean([3, 5, 7, 9, 11]) },
  { id: 'resp2-varianza', section: 'Respuestas M2', snippet: r`$s^2 = 40/4 = 10$; $s \approx 3.16$`, expected: 10, precision: 0, actual: () => sampleVariance([3, 5, 7, 9, 11]) },
  { id: 'resp2-desvio', section: 'Respuestas M2', snippet: r`$s^2 = 40/4 = 10$; $s \approx 3.16$`, expected: 3.16, precision: 2, actual: () => sampleStdDev([3, 5, 7, 9, 11]) },
  { id: 'resp2-binomial', section: 'Respuestas M2', snippet: r`= 6/16 = 0.375$`, expected: 0.375, precision: 3, actual: () => binomialPmf(4, 2, 0.5) },
  { id: 'resp2-z', section: 'Respuestas M2', snippet: '$z = (85-100)/15 = -1$', expected: -1, precision: 0, actual: () => zScore(85, 100, 15) },
  { id: 'resp2-ee-100', section: 'Respuestas M2', snippet: r`$20/\sqrt{100} = 2$ y $20/\sqrt{400} = 1$`, expected: 2, precision: 0, actual: () => standardError(20, 100) },
  { id: 'resp2-ee-400', section: 'Respuestas M2', snippet: r`$20/\sqrt{100} = 2$ y $20/\sqrt{400} = 1$`, expected: 1, precision: 0, actual: () => standardError(20, 400) },

  // 6.7 K-Means
  { id: 'kmeans-centroide-1', section: '6.7', snippet: r`$7/3 \approx 2.33$ y $34/3 \approx 11.33$`, expected: 2.33, precision: 2, actual: () => (guideCentroids()[0] as Point)[0] as number },
  { id: 'kmeans-centroide-2', section: '6.7', snippet: r`$7/3 \approx 2.33$ y $34/3 \approx 11.33$`, expected: 11.33, precision: 2, actual: () => (guideCentroids()[1] as Point)[0] as number },
  { id: 'kmeans-sse', section: '6.7', snippet: r`\approx 4.67 + 4.67 = 9.33$`, expected: 9.33, precision: 2, actual: () => sse(GUIDE_POINTS, guideLabels(), guideCentroids()) },

  // 4.3 Gini ponderado, especificidad y umbral (material de clase)
  { id: 'gini-mujeres', section: '4.3', snippet: r`Gini $\approx 0.374$; 406 hombres`, expected: 0.374, precision: 3, actual: () => gini(163, 54) },
  { id: 'gini-hombres', section: '4.3', snippet: r`Gini $\approx 0.304$. Gini ponderado`, expected: 0.304, precision: 3, actual: () => gini(76, 330) },
  { id: 'gini-ponderado-sexo', section: '4.3', snippet: r`\cdot 0.304 \approx 0.329$`, expected: 0.329, precision: 3, actual: () => weightedGini([{ positives: 163, negatives: 54 }, { positives: 76, negatives: 330 }]) },
  { id: 'gini-tercera-clase', section: '4.3', snippet: r`Gini $\approx 0.374$; 277 pasajeros`, expected: 0.374, precision: 3, actual: () => gini(86, 260) },
  { id: 'gini-otras-clases', section: '4.3', snippet: r`Gini $\approx 0.495$.`, expected: 0.495, precision: 3, actual: () => gini(153, 124) },
  { id: 'gini-ponderado-clase', section: '4.3', snippet: r`Gini ponderado $\approx 0.427$`, expected: 0.427, precision: 3, actual: () => weightedGini([{ positives: 86, negatives: 260 }, { positives: 153, negatives: 124 }]) },
  { id: 'especificidad-pacientes', section: '4.3', snippet: 'Especificidad: $72/(72+18) = 0.80$', expected: 0.8, precision: 2, actual: () => specificity({ tp: 8, fn: 2, fp: 18, tn: 72 }) },
  ...umbralExamples(),

  // 5.2 Regresión logística: caso del Titanic de la clase
  { id: 'titanic-z-mujer', section: '5.2', snippet: '$z = -1.468 + 2.573 = 1.105$', expected: 1.105, precision: 3, actual: () => -1.468 + 2.573 },
  { id: 'titanic-p-mujer', section: '5.2', snippet: r`1/(1+e^{-1.105}) \approx 0.751$`, expected: 0.751, precision: 3, actual: () => logistic(1.105) },
  { id: 'titanic-or-female', section: '5.2', snippet: r`$\text{OR} = e^{2.61} \approx 13.6$`, expected: 13.6, precision: 1, actual: () => oddsRatio(2.61) },
  { id: 'titanic-or-age', section: '5.2', snippet: '$-0.0439$ | $0.96$', expected: 0.96, precision: 2, actual: () => oddsRatio(-0.0439) },
  { id: 'titanic-or-pclass2', section: '5.2', snippet: '$-1.3946$ | $0.25$', expected: 0.25, precision: 2, actual: () => oddsRatio(-1.3946) },
  { id: 'titanic-or-pclass3', section: '5.2', snippet: '$-2.5846$ | $0.08$', expected: 0.08, precision: 2, actual: () => oddsRatio(-2.5846) },
  { id: 'titanic-p-mujer-23', section: '5.2', snippet: r`$\hat{p} \approx 0.956$`, expected: 0.956, precision: 3, actual: () => logistic(1.4666 + 2.61 - 0.0439 * 23) },
  { id: 'titanic-p-hombre-1a', section: '5.2', snippet: r`$\hat{p} \approx 0.537$`, expected: 0.537, precision: 3, actual: () => logistic(1.4666 - 0.0439 * 30) },
  { id: 'titanic-p-hombre-3a', section: '5.2', snippet: r`$\hat{p} \approx 0.081$`, expected: 0.081, precision: 3, actual: () => logistic(1.4666 - 0.0439 * 30 - 2.5846) },
  { id: 'or-probabilidad-baja', section: '5.2', snippet: r`$p_1 = 0.60$`, expected: 0.6, precision: 2, actual: () => probabilityAfterOddsRatio(0.1, 13.6) },
  { id: 'or-probabilidad-alta', section: '5.2', snippet: r`$p_1 \approx 0.93$`, expected: 0.93, precision: 2, actual: () => probabilityAfterOddsRatio(0.5, 13.6) },
  { id: 'vif-r2-05', section: '5.2', snippet: r`$R_j^2 = 0.5$, $\text{VIF} = 2$`, expected: 2, precision: 0, actual: () => vif(0.5) },
  { id: 'vif-r2-08', section: '5.2', snippet: r`$R_j^2 = 0.8$, $\text{VIF} = 5$`, expected: 5, precision: 0, actual: () => vif(0.8) },
  { id: 'titanic-hombres-sobreviven', section: '5.2', snippet: r`solo el $18.7\,\%$ de los hombres`, expected: 18.7, precision: 1, actual: () => (76 / 406) * 100 },
  { id: 'titanic-odds-080', section: '5.2', snippet: r`\text{odds} = 0.80/0.20 = 4.0$`, expected: 4, precision: 1, actual: () => odds(0.8) },
  { id: 'titanic-odds-020', section: '5.2', snippet: r`$\text{odds} = 0.25$`, expected: 0.25, precision: 2, actual: () => odds(0.2) },
  { id: 'titanic-loglik-a', section: '5.2', snippet: r`$\ell \approx -0.60$`, expected: -0.6, precision: 2, actual: () => logLikelihood([0.9, 0.15, 0.8, 0.1], [1, 0, 1, 0]) },
  { id: 'titanic-loglik-b', section: '5.2', snippet: r`$\ell \approx -2.42$`, expected: -2.42, precision: 2, actual: () => logLikelihood([0.6, 0.55, 0.55, 0.4], [1, 0, 1, 0]) },
  { id: 'titanic-raiz-sobreviven', section: '4.3', snippet: r`(239 sobrevivieron, $38.4\,\%$)`, expected: 38.4, precision: 1, actual: () => (239 / 623) * 100 },

  // 6.5 Bosque aleatorio: promedio de probabilidades
  { id: 'pca-pizzas-l1', section: '6.8', snippet: r`\lambda_1 \approx 0.65 \times 8 = 5.2`, expected: 5.2, precision: 1, actual: () => eigenvalueFromShare(0.65, 8) },
  { id: 'pca-pizzas-l2', section: '6.8', snippet: r`\lambda_2 \approx 0.29 \times 8 = 2.32`, expected: 2.32, precision: 2, actual: () => eigenvalueFromShare(0.29, 8) },
  { id: 'pca-pizzas-resto', section: '6.8', snippet: r`restante ($0.48$)`, expected: 0.48, precision: 2, actual: () => eigenvalueFromShare(1 - 0.94, 8) },
  { id: 'pca-gorriones-l1', section: '6.8', snippet: r`\lambda_1 \approx 0.72 \times 5 = 3.6`, expected: 3.6, precision: 1, actual: () => eigenvalueFromShare(0.72, 5) },
  { id: 'pca-gorriones-l2', section: '6.8', snippet: r`\lambda_2 \approx (0.83 - 0.72) \times 5 = 0.55`, expected: 0.55, precision: 2, actual: () => eigenvalueFromShare(0.83 - 0.72, 5) },
  { id: 'pca-kaiser-6-4', section: '6.8', snippet: r`Kaiser retiene solo el primero ($2.8>1$)`, expected: 1, precision: 0, actual: () => kaiserCount([2.8, 0.9, 0.2, 0.1]) },
  { id: 'pca-acumulada-2', section: '6.8', snippet: r`$92.5\,\%$ con dos`, expected: 0.925, precision: 3, actual: () => cumulativeVariance([2.8, 0.9, 0.2, 0.1])[1] as number },
  { id: 'bosque-promedio', section: '6.5', snippet: r`promedio $= 1.101/5 \approx 0.220$`, expected: 0.22, precision: 3, actual: () => forestProbability([0.125, 0.5, 0.333, 0.143, 0]) },
]

export interface ExampleResult {
  id: string
  section: string
  expected: number
  actual: number
  snippetInGuide: boolean
  matches: boolean
}

/** Tolerancia: medio decimal de la última cifra que imprime la guía. */
export function tolerance(precision: number): number {
  return 0.5 * 10 ** -precision + 1e-9
}

export function evaluateExamples(examples: readonly NumericExample[], guideText: string): ExampleResult[] {
  return examples.map((example) => {
    const actual = example.actual()
    return {
      id: example.id,
      section: example.section,
      expected: example.expected,
      actual,
      snippetInGuide: guideText.includes(example.snippet),
      matches: Math.abs(actual - example.expected) <= tolerance(example.precision),
    }
  })
}
