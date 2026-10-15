export interface ProgressData {
  /** Ids de secciones vistas, en el orden en que se marcaron, sin repetir. */
  completedSections: string[]
  /** Última sección visitada, para "Continuar". */
  lastSectionId: string | null
}

export interface Completion {
  completed: number
  total: number
  /** Entero de 0 a 100. */
  percent: number
}

export function emptyProgress(): ProgressData {
  return { completedSections: [], lastSectionId: null }
}

export function markCompleted(progress: ProgressData, sectionId: string): ProgressData {
  if (progress.completedSections.includes(sectionId)) return progress
  return { ...progress, completedSections: [...progress.completedSections, sectionId] }
}

export function visitSection(progress: ProgressData, sectionId: string): ProgressData {
  if (progress.lastSectionId === sectionId) return progress
  return { ...progress, lastSectionId: sectionId }
}

/** Avance sobre `sectionIds`: ignora ids guardados que ya no existen en el curso. */
export function completion(progress: ProgressData, sectionIds: readonly string[]): Completion {
  const done = new Set(progress.completedSections)
  const completed = sectionIds.filter((id) => done.has(id)).length
  const total = sectionIds.length
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
}
