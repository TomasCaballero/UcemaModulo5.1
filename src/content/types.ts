/** Módulos 0 a 7 de la guía. */
export type ModuleId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Id de sección con la numeración de la guía, p. ej. "2.4". */
export type SectionId = `${ModuleId}.${number}`

export type CalloutKind = 'cuidado' | 'ojo' | 'advertencia' | 'salvedad'

/** Texto con fórmulas inline entre `$...$` (LaTeX para KaTeX). */
export type RichText = string

export type ContentBlock =
  | { type: 'paragraph'; text: RichText }
  /** Encabezado `####` de la guía; se muestra como h2: el título de la sección es el h1 de la página. */
  | { type: 'subheading'; text: RichText }
  | { type: 'list'; items: RichText[]; ordered?: boolean }
  | { type: 'formula'; latex: string }
  | { type: 'callout'; kind: CalloutKind; text: RichText }
  /** Analogías que la guía destaca como cita (p. ej. "el aro y la estaca"). */
  | { type: 'analogy'; text: RichText }
  /** `illustrative`: la guía marca la tabla como "ilustrativa (cifras inventadas)". */
  | { type: 'table'; headers: RichText[]; rows: RichText[][]; illustrative?: boolean }
  /**
   * Ejemplo cotidiano o clásico agregado a la guía para practicar la idea. No es contenido de la
   * guía: se muestra rotulado y no entra en las verificaciones de fidelidad (RNF-17/18).
   */
  | { type: 'extra'; text: RichText }
  | { type: 'workedExample'; title: RichText; steps: RichText[]; result: RichText }
  | { type: 'miniCheck'; questionIds: string[] }
  | { type: 'simulation'; simulationId: string }

export type BlockType = ContentBlock['type']

export type BlockOf<T extends BlockType> = Extract<ContentBlock, { type: T }>

export interface ModuleInfo {
  id: ModuleId
  title: string
  /** Una línea para la tarjeta del inicio (tabla "Orden de los módulos" de la guía). */
  summary: string
  /** Texto de apertura del módulo, previo a su primera sección. */
  intro?: ContentBlock[]
}

export interface Section {
  id: SectionId
  moduleId: ModuleId
  title: string
  /** Anexo opcional (RF-10). */
  optional?: boolean
  blocks: ContentBlock[]
}

/** Dónde se explica un término: una sección ("6.4") o, a veces, solo un módulo ("4"). */
export type GlossaryReference = SectionId | `${ModuleId}`

export interface GlossaryEntry {
  term: string
  definition: RichText
  /** Dónde se explica el término, en el orden de la guía (RF-12). */
  references: GlossaryReference[]
}

export interface Question {
  id: string
  moduleId: ModuleId
  prompt: RichText
  /** 4 o 5 opciones (RF-24). */
  options: RichText[]
  correctIndex: number
  explanation: RichText
  /** Sección de la guía donde se trata el concepto (RF-27). */
  sectionId: SectionId
  /** Pregunta de "Autoevaluación" de la guía que cubre, para la trazabilidad (RNF-19). */
  guideQuestionRef?: string
}

export interface SimulationMeta {
  /** "IN-01" a "IN-67". */
  id: string
  moduleId: ModuleId
  title: string
  /** Descripción textual accesible (RNF-11). */
  description: string
  sectionIds: SectionId[]
}

export interface CourseContent {
  modules: ModuleInfo[]
  sections: Section[]
  glossary: GlossaryEntry[]
  questions: Question[]
  simulations: SimulationMeta[]
}
