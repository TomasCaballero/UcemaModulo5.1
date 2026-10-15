import type { GlossaryReference, ModuleId, RichText } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, "Cuadro síntesis y guía de uso" (RF-13).
const t = String.raw

export interface LadderLevel {
  moduleId: ModuleId
  name: string
  summary: string
}

export interface TechniqueRow {
  goal: RichText
  techniques: string
  modules: ModuleId[]
}

export interface CommonError {
  text: RichText
  /** Secciones donde se trata, tal como las cita la guía. */
  references: GlossaryReference[]
}

/** "La escalera del conocimiento", del nivel más alto (7) al más básico (0), como en la guía. */
export const ladder: LadderLevel[] = [
  { moduleId: 7, name: 'Teoría PAC / Dimensión VC', summary: 'Garantías formales de generalización' },
  { moduleId: 6, name: 'Aprendizaje Estadístico', summary: 'Sesgo-varianza, ensambles, SVM, K-Means' },
  { moduleId: 5, name: 'Elección Binaria / Logit', summary: 'Odds ratios, Probit, LDA, Naive Bayes' },
  { moduleId: 4, name: 'Minería de Datos / KDD', summary: 'Árboles, Apriori, DBSCAN' },
  { moduleId: 3, name: 'Econometría / Panel', summary: 'Causalidad, Gauss-Markov, FE/RE/DID, IV' },
  { moduleId: 2, name: 'Inferencia Estadística', summary: 'Distribuciones, TLC, intervalos, p-valor' },
  { moduleId: 1, name: 'Mente del Aprendiz', summary: 'Recalibración metacognitiva' },
  { moduleId: 0, name: 'Matemática Mínima', summary: 'Probabilidad, álgebra, cálculo, logs' },
]

/** "¿Qué técnica uso para qué problema?" */
export const techniques: TechniqueRow[] = [
  {
    goal: 'Estimar un efecto **causal**',
    techniques: 'Regresión múltiple con controles, IV, panel (FE), DID',
    modules: [3],
  },
  { goal: 'Predecir un **número**', techniques: 'Regresión, Ridge/Lasso, bosques, boosting', modules: [3, 6] },
  {
    goal: 'Predecir una **categoría**',
    techniques: 'Logit, LDA/QDA, Naive Bayes, árboles, SVM, ensambles',
    modules: [4, 5, 6],
  },
  { goal: 'Interpretar con **odds ratios**', techniques: 'Regresión logística', modules: [5] },
  {
    goal: 'Encontrar **qué se compra junto**',
    techniques: 'Apriori (soporte, confianza, lift)',
    modules: [4],
  },
  { goal: '**Agrupar** sin etiquetas', techniques: 'K-Means, jerárquico, DBSCAN', modules: [4, 6] },
  { goal: '**Reducir dimensión**', techniques: 'PCA, Lasso', modules: [6] },
  {
    goal: 'Elegir hiperparámetros / estimar error',
    techniques: 'Validación cruzada, OOB',
    modules: [6],
  },
]

/** "Los errores más comunes (y cómo evitarlos)". */
export const commonErrors: CommonError[] = [
  { text: 'Confundir **correlación con causalidad**', references: ['3.2'] },
  {
    text: t`Interpretar el **intervalo de confianza** como "probabilidad de que $\mu$ esté adentro"`,
    references: ['2.6'],
  },
  {
    text: t`Interpretar el **p-valor** como la probabilidad de que $H_0$ sea cierta, o "aceptar" $H_0$`,
    references: ['2.7'],
  },
  { text: 'Olvidar el **tamaño del efecto**: significativo no es relevante', references: ['2.7'] },
  { text: t`Creer que un **$R^2$ alto** implica causalidad`, references: ['3.3'] },
  {
    text: 'Ignorar el **sesgo por variable omitida** y la **endogeneidad**',
    references: ['3.4', '3.7'],
  },
  { text: 'Evaluar un modelo **con los mismos datos con que se entrenó**', references: ['4.3', '6.1'] },
  { text: 'Usar la **exactitud** con clases desbalanceadas', references: ['4.3'] },
  { text: 'Interpretar un **odds ratio como riesgo relativo**', references: ['5.2'] },
  {
    text: 'No **estandarizar** antes de Ridge, Lasso, PCA, K-Means o SVM',
    references: ['4.2', '6.4'],
  },
  { text: 'Creer que hay un **"mejor algoritmo"** universal', references: ['7.5'] },
]
