import { ConceptGraph } from '@/logic/concepts/graph'
import { dependencies, sectionCatalog } from './data/concepts'

/** Mapa de conceptos del curso completo: las 49 secciones de la guía y sus dependencias. */
export const conceptGraph = new ConceptGraph(
  sectionCatalog,
  dependencies.map(({ from, to }) => ({ from, to })),
)
