import type { ModuleInfo, RichText } from '../types'
import { module4Intro } from './module4'
import { module5Intro } from './module5'
import { module6Intro } from './module6'
import { module7Intro } from './module7'

// Fuente: recorrido-guias-de-aprendizaje-v3.md. Títulos de "## Módulo N" y tabla
// "Orden de los módulos" de "Cómo usar esta guía".
// Las aperturas (`intro`) de los módulos largos viven junto a sus secciones (module4.ts a module7.ts).
export const modules: ModuleInfo[] = [
  {
    id: 0,
    title: 'La Matemática Mínima que Necesitas',
    summary: 'Matemática mínima necesaria: sumatorias, probabilidad, álgebra lineal, cálculo, logaritmos',
    intro: [
      {
        type: 'paragraph',
        text: 'No necesitas ser matemático. Necesitas entender **cinco herramientas**, que son las que el resto de la guía usa una y otra vez. Cada una se explica con lo justo.',
      },
    ],
  },
  {
    id: 1,
    title: 'La Mente del Aprendiz y el Arte de Pensar Científicamente',
    summary: 'Cómo aprender: metacognición y pensamiento científico',
    intro: [
      {
        type: 'paragraph',
        text: 'Antes de aprender estadística o programación hay que preparar el instrumento con el que aprendemos: la propia mente. Este módulo no tiene fórmulas, pero es el que más te sirve si estudias con poco tiempo, porque te ayuda a **decidir qué estudiar y a detectar cuándo crees saber algo que no sabes**.',
      },
    ],
  },
  {
    id: 2,
    title: 'Estadística, Medición e Inferencia',
    summary: 'Estadística: medición, inferencia, contraste de hipótesis',
    intro: [
      {
        type: 'paragraph',
        text: 'La estadística es el conjunto de herramientas para **tomar decisiones razonables cuando hay incertidumbre y variabilidad**. Casi todo lo que sigue en la guía (regresión, clasificación, aprendizaje automático) se apoya en las ideas de este módulo.',
      },
    ],
  },
  {
    id: 3,
    title: 'Econometría, Regresión y Causalidad',
    summary: 'Econometría: regresión, causalidad, datos de panel',
    intro: [
      {
        type: 'paragraph',
        text: String.raw`La **econometría** usa herramientas estadísticas para responder preguntas del tipo "¿cuánto cambia $Y$ cuando cambia $X$?", y sobre todo "¿**es causal** esa relación?", a partir de datos que casi nunca provienen de experimentos controlados. Es la base del análisis de impacto y de buena parte de la modelización estadística en ciencia de datos.`,
      },
    ],
  },
  {
    id: 4,
    title: 'Minería de Datos, Preprocesamiento y Descubrimiento de Patrones',
    summary: 'Minería de datos: preprocesamiento, árboles, asociación, clustering',
    intro: module4Intro,
  },
  {
    id: 5,
    title: 'Elección Binaria, Regresión Logística y Modelos Generativos',
    summary: 'Clasificación: regresión logística y modelos generativos',
    intro: module5Intro,
  },
  {
    id: 6,
    title: 'Aprendizaje Estadístico, Ensambles, SVM y Agrupamiento',
    summary: 'Aprendizaje estadístico: sesgo-varianza, regularización, ensambles, SVM',
    intro: module6Intro,
  },
  {
    id: 7,
    title: 'Teoría Formal del Aprendizaje Automático',
    summary: 'Teoría del aprendizaje: PAC, dimensión VC',
    intro: module7Intro,
  },
]

/** "Cómo estudiar con esta guía" (RF-06), en el orden de la guía. */
export const studyAdvice: RichText[] = [
  '**Primero el Módulo 0 y el 2.** Si no dominas probabilidad, medias y p-valores, todo lo demás se tambalea.',
  'En cada módulo, **intenta las autoevaluaciones sin mirar** las respuestas. Lo que falles, relee. Es la aplicación directa del Módulo 1 (pasar de 2OI a 1OI).',
  '**Rehaz a mano** al menos un ejemplo numérico por módulo.',
  'Si estudias con poco tiempo, prioriza según tu posgrado: para ciencia de datos aplicada, **2, 5 y 6** son el núcleo; **3** si trabajas con causalidad o evaluación de políticas; **7** como marco conceptual (basta con entender sesgo-varianza, ERM, VC y No-Free-Lunch a nivel intuitivo).',
  'Esta guía **resume**: para profundizar, usa los libros como referencia y para consultar demostraciones.',
]

/** "Cómo usar esta guía": cómo está pensada y sus tres reglas de diseño. */
export const usageGuide = {
  intro:
    'Esta guía está pensada para alguien que parte de **conocimientos previos mínimos** (aritmética y álgebra de secundaria). Tiene tres reglas de diseño:',
  rules: [
    '**Cada término se explica antes de usarse.** Cuando por necesidad aparece antes de su explicación (por ejemplo, un anticipo en el Módulo 0), se indica el módulo donde se desarrolla.',
    '**Cada idea tiene un ejemplo con números**, para que puedas rehacer la cuenta a mano.',
    '**Cada módulo termina con preguntas de autoevaluación** y sus respuestas. Intenta responder *antes* de mirar las respuestas: eso es lo que te protege de creer que sabes algo que no sabes (ver Módulo 1).',
  ] satisfies RichText[],
  note: 'Los ejemplos numéricos fueron verificados con un script de Python; las tablas marcadas como "ilustrativas" y el ejemplo de DID usan cifras inventadas.',
}
