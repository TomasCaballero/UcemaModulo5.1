export interface ProgressData {
  /** Ids de secciones vistas, en el orden en que se marcaron, sin repetir. */
  completedSections: string[]
  /** Última sección visitada, para "Continuar". */
  lastSectionId: string | null
  /**
   * Fecha (ISO) del último cambio manual de cada sección: marcarla o desmarcarla.
   * Permite que un desmarcado gane al sincronizar con otro dispositivo. Se omite si no hay.
   */
  sectionMarks?: Record<string, string>
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

/** Marca la sección como vista; con `at` deja registrada la fecha del cambio. */
export function markCompleted(progress: ProgressData, sectionId: string, at?: string): ProgressData {
  if (progress.completedSections.includes(sectionId)) return progress
  const next = { ...progress, completedSections: [...progress.completedSections, sectionId] }
  return at === undefined ? next : withMark(next, sectionId, at)
}

/** Marca la sección como no vista y registra cuándo, para que el cambio se imponga al sincronizar. */
export function unmarkCompleted(progress: ProgressData, sectionId: string, at: string): ProgressData {
  if (!progress.completedSections.includes(sectionId)) return progress
  const completedSections = progress.completedSections.filter((id) => id !== sectionId)
  return withMark({ ...progress, completedSections }, sectionId, at)
}

/** El usuario la desmarcó a propósito: el marcado automático no debe volver a marcarla. */
export function isExplicitlyUnmarked(progress: ProgressData, sectionId: string): boolean {
  return progress.sectionMarks?.[sectionId] !== undefined && !progress.completedSections.includes(sectionId)
}

function withMark(progress: ProgressData, sectionId: string, at: string): ProgressData {
  return { ...progress, sectionMarks: { ...progress.sectionMarks, [sectionId]: at } }
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
