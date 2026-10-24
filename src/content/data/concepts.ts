import type { SectionId } from '../types'

// Mapa de conceptos (RF-15). Fuente: recorrido-guias-de-aprendizaje-v3.md.

export interface CatalogEntry {
  id: SectionId
  /** Título sin formato, tal como figura en el encabezado `###` de la guía. */
  title: string
}

/** Las 50 secciones numeradas de la guía, también las de módulos que aún no se cargaron. */
export const sectionCatalog: CatalogEntry[] = [
  { id: '0.1', title: 'Notación básica' },
  { id: '0.2', title: 'Probabilidad' },
  { id: '0.3', title: 'Álgebra lineal mínima' },
  { id: '0.4', title: 'Cálculo mínimo: derivada y optimización' },
  { id: '0.5', title: 'Logaritmos y exponenciales' },
  { id: '1.1', title: 'Metacognición y descalibración metacognitiva' },
  { id: '1.2', title: 'Los órdenes de ignorancia (modelo de Phillip Armour)' },
  { id: '1.3', title: 'Los perfiles de aprendizaje de George Leonard' },
  { id: '1.4', title: 'Estrategias de recalibración' },
  { id: '1.5', title: 'La filosofía de Richard Hamming: aprender a aprender' },
  { id: '1.6', title: 'Distancia de Hamming y códigos de corrección de errores' },
  { id: '2.1', title: 'Vocabulario base: población, muestra, parámetro, estadístico' },
  { id: '2.2', title: 'Medidas de tendencia central y de dispersión' },
  { id: '2.3', title: 'Escalas de medición (Stevens) y calidad de datos' },
  { id: '2.4', title: 'Distribuciones de probabilidad' },
  { id: '2.5', title: 'Distribución muestral y Teorema del Límite Central (TLC)' },
  { id: '2.6', title: 'Estimación: intervalos de confianza y máxima verosimilitud' },
  { id: '2.7', title: 'Contraste de hipótesis y tamaño del efecto' },
  { id: '3.1', title: 'Estructuras de datos' },
  { id: '3.2', title: 'Correlación, causalidad y ceteris paribus' },
  { id: '3.3', title: 'Regresión lineal simple y mínimos cuadrados ordinarios (OLS)' },
  { id: '3.4', title: 'Regresión lineal múltiple' },
  { id: '3.5', title: 'Variables ficticias y logaritmos' },
  { id: '3.6', title: 'Supuestos de Gauss-Markov y propiedad BLUE' },
  { id: '3.7', title: 'Cuando fallan los supuestos' },
  { id: '3.8', title: 'Datos de panel y diferencias en diferencias' },
  { id: '4.1', title: 'El proceso KDD (Knowledge Discovery in Databases)' },
  { id: '4.2', title: 'Preprocesamiento' },
  { id: '4.3', title: 'Clasificación predictiva' },
  { id: '4.4', title: 'Análisis de asociación y algoritmo Apriori' },
  { id: '4.5', title: 'Agrupamiento (clustering) y DBSCAN' },
  { id: '5.1', title: 'El modelo lineal de probabilidad (LPM) y sus límites' },
  { id: '5.2', title: 'Regresión logística' },
  { id: '5.3', title: 'Probit y el modelo de variable latente' },
  { id: '5.4', title: 'Clasificadores generativos: LDA, QDA y Naive Bayes' },
  { id: '6.1', title: 'Aprendizaje supervisado y no supervisado' },
  { id: '6.2', title: 'El equilibrio sesgo-varianza' },
  { id: '6.3', title: 'Remuestreo: validación cruzada y bootstrap' },
  { id: '6.4', title: 'Regularización y reducción de dimensión' },
  { id: '6.5', title: 'Métodos de ensamble' },
  { id: '6.6', title: 'Máquinas de Vectores de Soporte (SVM)' },
  { id: '6.7', title: 'Agrupamiento no supervisado: K-Means y clustering jerárquico' },
  { id: '6.8', title: 'PCA en profundidad y análisis de correspondencias' },
  { id: '7.1', title: 'Aprender es inducir, no memorizar' },
  { id: '7.2', title: 'Riesgo real, riesgo empírico y minimización del riesgo empírico (ERM)' },
  { id: '7.3', title: 'Aprendizaje PAC (Probably Approximately Correct)' },
  { id: '7.4', title: 'Dimensión VC y el Teorema Fundamental' },
  { id: '7.5', title: 'Teorema No-Free-Lunch (sin almuerzo gratis)' },
  { id: '7.6', title: 'Regularización, estabilidad y la navaja de Ockham' },
  { id: '7.7', title: 'Cómo se conecta todo' },
]

/** `from` usa conceptos que se explican en `to`. */
export interface Dependency {
  from: SectionId
  to: SectionId
}

/**
 * Dependencias entre secciones. Criterio: una sección depende de otra cuando la guía la remite
 * ("ver Módulo 0.4", "(3.6)"), o cuando una sección usa una herramienta que otra enseña (el 5.2
 * trabaja con logaritmos, así que depende del 0.5). Siempre apuntan de lo nuevo a lo previo: el
 * texto del curso no remite hacia adelante (lo vigila verify/forward-references.verify.ts). La
 * única dependencia que no sale de una remisión de la guía es 3.3 → 2.2, que pide el PRD
 * (AC-15): OLS usa las medidas descriptivas.
 */
export const dependencies: Dependency[] = [
  { from: '2.6', to: '0.5' },
  { from: '3.3', to: '0.4' },
  { from: '3.3', to: '2.2' },
  { from: '3.4', to: '0.3' },
  { from: '3.5', to: '0.5' },
  { from: '3.6', to: '0.3' },
  { from: '4.2', to: '2.3' },
  { from: '4.2', to: '2.4' },
  { from: '4.3', to: '0.2' },
  { from: '5.1', to: '3.3' },
  { from: '5.1', to: '3.6' },
  { from: '5.2', to: '0.5' },
  { from: '5.2', to: '2.4' },
  { from: '5.2', to: '2.6' },
  { from: '5.2', to: '4.3' },
  { from: '5.4', to: '0.2' },
  { from: '5.4', to: '0.3' },
  { from: '6.4', to: '0.3' },
  { from: '6.4', to: '4.2' },
  { from: '6.5', to: '0.4' },
  { from: '6.5', to: '4.3' },
  { from: '6.5', to: '6.3' },
  { from: '6.6', to: '0.3' },
  { from: '6.7', to: '0.4' },
  { from: '6.7', to: '4.5' },
  { from: '6.8', to: '2.4' },
  { from: '6.8', to: '5.2' },
  { from: '6.8', to: '6.4' },
  { from: '7.2', to: '0.4' },
  { from: '7.2', to: '6.1' },
  { from: '7.2', to: '6.6' },
  { from: '7.3', to: '6.2' },
  { from: '7.6', to: '6.4' },
  { from: '7.7', to: '4.3' },
  { from: '7.7', to: '6.2' },
  { from: '7.7', to: '6.3' },
  { from: '7.7', to: '6.4' },
  { from: '7.7', to: '6.5' },
  { from: '7.7', to: '6.6' },
]
