import type { ModuleInfo, RichText } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md. Títulos de "## Módulo N" y tabla
// "Orden de los módulos" de "Cómo usar esta guía".
// Las aperturas (`intro`) de cada módulo se cargan junto con su contenido.
export const modules: ModuleInfo[] = [
  {
    id: 0,
    title: 'La Matemática Mínima que Necesitas',
    summary: 'Matemática mínima necesaria: sumatorias, probabilidad, álgebra lineal, cálculo, logaritmos',
  },
  {
    id: 1,
    title: 'La Mente del Aprendiz y el Arte de Pensar Científicamente',
    summary: 'Cómo aprender: metacognición y pensamiento científico',
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
  },
  {
    id: 4,
    title: 'Minería de Datos, Preprocesamiento y Descubrimiento de Patrones',
    summary: 'Minería de datos: preprocesamiento, árboles, asociación, clustering',
  },
  {
    id: 5,
    title: 'Elección Binaria, Regresión Logística y Modelos Generativos',
    summary: 'Clasificación: regresión logística y modelos generativos',
  },
  {
    id: 6,
    title: 'Aprendizaje Estadístico, Ensambles, SVM y Agrupamiento',
    summary: 'Aprendizaje estadístico: sesgo-varianza, regularización, ensambles, SVM',
  },
  {
    id: 7,
    title: 'Teoría Formal del Aprendizaje Automático',
    summary: 'Teoría del aprendizaje: PAC, dimensión VC',
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
