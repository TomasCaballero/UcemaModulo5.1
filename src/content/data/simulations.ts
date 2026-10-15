import type { SimulationMeta } from '../types'

// Catálogo de interactivos (PRD, "Catálogo de interactivos"). Cada uno necesita una
// descripción textual accesible (RNF-11) y se registra aparte en
// components/simulations/registry.ts con su componente. Se suman junto con sus módulos.
export const simulations: SimulationMeta[] = [
  {
    id: 'IN-03',
    moduleId: 0,
    title: 'Diagrama de población para Bayes (test médico)',
    description:
      'Muestra 1000 personas como cuadritos de colores según tengan o no la enfermedad y den positivo o negativo en el test. Al mover la prevalencia, la sensibilidad y la tasa de falsos positivos cambian los grupos y la probabilidad de estar enfermo dado un test positivo.',
    sectionIds: ['0.2'],
  },
  {
    id: 'IN-21',
    moduleId: 2,
    title: 'Simulador del Teorema del Límite Central',
    description:
      'Toma muestras de una población sesgada, uniforme o con dos picos y dibuja un histograma de las medias muestrales que crece muestra a muestra. Al aumentar el tamaño de muestra el histograma se acerca a una curva Normal centrada en la media poblacional, con error estándar σ/√n.',
    sectionIds: ['2.5'],
  },
  {
    id: 'IN-58',
    moduleId: 6,
    title: 'K-Means paso a paso',
    description:
      'Muestra los puntos de un conjunto de datos y los centroides de K-Means. Cada paso asigna los puntos al centroide más cercano o recalcula los centroides como promedios, y se ve cómo baja la suma de errores al cuadrado hasta que las asignaciones dejan de cambiar. Un gráfico del codo muestra el error para distintos valores de K.',
    sectionIds: ['6.7'],
  },
]
