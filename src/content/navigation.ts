import type { CourseContent, ModuleId, ModuleInfo, Question, Section, SimulationMeta } from './types'

export interface SectionNeighbors {
  previous?: Section
  next?: Section
}

/** Consultas de solo lectura sobre el contenido, en el orden de la guía. */
export interface CourseIndex {
  readonly modules: readonly ModuleInfo[]
  getModule(id: number): ModuleInfo | undefined
  getSection(id: string): Section | undefined
  hasSection(id: string): boolean
  sectionsOf(moduleId: ModuleId): Section[]
  getQuestion(id: string): Question | undefined
  /** Banco de preguntas de un módulo, en el orden de los datos. */
  questionsOf(moduleId: ModuleId): Question[]
  getSimulation(id: string): SimulationMeta | undefined
  /** Interactivos de un módulo, en el orden del catálogo. */
  simulationsOf(moduleId: ModuleId): SimulationMeta[]
  /** Ids de todas las secciones, en el orden de la guía. */
  sectionIds(): string[]
  neighbors(sectionId: string): SectionNeighbors
}

/** Orden numérico: "2.4" < "2.10" < "3.1". */
export function compareSectionIds(a: string, b: string): number {
  const [moduleA = 0, numberA = 0] = a.split('.').map(Number)
  const [moduleB = 0, numberB = 0] = b.split('.').map(Number)
  return moduleA - moduleB || numberA - numberB
}

export function createCourseIndex(content: CourseContent): CourseIndex {
  const modules = [...content.modules].sort((a, b) => a.id - b.id)
  const sections = [...content.sections].sort((a, b) => compareSectionIds(a.id, b.id))
  const sectionsById = new Map<string, Section>(sections.map((section) => [section.id, section]))
  const questionsById = new Map<string, Question>(content.questions.map((question) => [question.id, question]))
  const simulationsById = new Map<string, SimulationMeta>(content.simulations.map((simulation) => [simulation.id, simulation]))
  const positions = new Map<string, number>(sections.map((section, position) => [section.id, position]))

  return {
    modules,
    getModule: (id) => modules.find((module) => module.id === id),
    getSection: (id) => sectionsById.get(id),
    hasSection: (id) => sectionsById.has(id),
    sectionsOf: (moduleId) => sections.filter((section) => section.moduleId === moduleId),
    getQuestion: (id) => questionsById.get(id),
    questionsOf: (moduleId) => content.questions.filter((question) => question.moduleId === moduleId),
    getSimulation: (id) => simulationsById.get(id),
    simulationsOf: (moduleId) => content.simulations.filter((simulation) => simulation.moduleId === moduleId),
    sectionIds: () => sections.map((section) => section.id),
    neighbors(sectionId) {
      const position = positions.get(sectionId)
      if (position === undefined) return {}
      const previous = sections[position - 1]
      const next = sections[position + 1]
      return { ...(previous && { previous }), ...(next && { next }) }
    },
  }
}
