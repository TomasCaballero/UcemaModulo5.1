import { courseContent } from '@/content'
import { buildSearchIndex } from '@/logic/search/engine'

/** Índice de búsqueda del curso, armado una sola vez. */
export const courseSearch = buildSearchIndex(courseContent)
