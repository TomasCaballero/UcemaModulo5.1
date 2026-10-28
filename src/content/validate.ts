import type { CourseContent } from './types'

const SECTION_ID = /^[0-7]\.\d+$/
const GLOSSARY_REFERENCE = /^[0-7](\.\d+)?$/
const SIMULATION_ID = /^IN-\d{2}$/

function findDuplicates(ids: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }
  return [...duplicates]
}

/** Devuelve la lista de problemas del contenido; vacía si es válido. */
export function validateContent(content: CourseContent): string[] {
  const errors: string[] = []
  const moduleIds = new Set<number>(content.modules.map((m) => m.id))
  const sectionIds = new Set<string>(content.sections.map((s) => s.id))
  const questionIds = new Set<string>(content.questions.map((q) => q.id))
  const simulationIds = new Set<string>(content.simulations.map((s) => s.id))

  for (const id of findDuplicates(content.modules.map((m) => String(m.id)))) {
    errors.push(`Módulo duplicado: ${id}`)
  }
  for (const id of findDuplicates(content.sections.map((s) => s.id))) {
    errors.push(`Sección duplicada: ${id}`)
  }
  for (const id of findDuplicates(content.questions.map((q) => q.id))) {
    errors.push(`Pregunta duplicada: ${id}`)
  }
  for (const id of findDuplicates(content.simulations.map((s) => s.id))) {
    errors.push(`Simulación duplicada: ${id}`)
  }

  const owners = [
    ...content.sections.map((s) => ({ label: `Sección ${s.id}`, moduleId: s.moduleId })),
    ...content.questions.map((q) => ({ label: `Pregunta ${q.id}`, moduleId: q.moduleId })),
    ...content.simulations.map((s) => ({ label: `Simulación ${s.id}`, moduleId: s.moduleId })),
  ]
  for (const { label, moduleId } of owners) {
    if (!moduleIds.has(moduleId)) errors.push(`${label}: módulo inexistente ${moduleId}`)
  }

  for (const section of content.sections) {
    if (!SECTION_ID.test(section.id) || !section.id.startsWith(`${section.moduleId}.`)) {
      errors.push(`Sección ${section.id}: id inconsistente con el módulo ${section.moduleId}`)
    }
    for (const block of section.blocks) {
      if (block.type === 'miniCheck') {
        for (const id of block.questionIds) {
          if (!questionIds.has(id)) errors.push(`Sección ${section.id}: mini-chequeo con pregunta inexistente ${id}`)
        }
        if (block.questionIds.length < 1 || block.questionIds.length > 3) {
          errors.push(`Sección ${section.id}: el mini-chequeo debe tener de 1 a 3 preguntas`)
        }
      }
      if (block.type === 'deepDive' && block.sources.length === 0) {
        errors.push(`Sección ${section.id}: la ampliación "${block.title}" no cita fuentes`)
      }
      if (block.type === 'recall' && block.items.length === 0) {
        errors.push(`Sección ${section.id}: el bloque "¿Te acordás?" está vacío`)
      }
      if (block.type === 'simulation' && !simulationIds.has(block.simulationId)) {
        errors.push(`Sección ${section.id}: simulación inexistente ${block.simulationId}`)
      }
    }
  }

  // Que las referencias apunten a secciones cargadas se verifica con findUnresolvedReferences:
  // el glosario cita módulos completos aunque todavía no estén todos en el curso.
  for (const entry of content.glossary) {
    if (entry.references.length === 0) errors.push(`Glosario "${entry.term}": sin referencias`)
    for (const ref of entry.references) {
      if (!GLOSSARY_REFERENCE.test(ref)) errors.push(`Glosario "${entry.term}": referencia inválida ${ref}`)
    }
  }

  for (const q of content.questions) {
    if (q.options.length < 4 || q.options.length > 5) {
      errors.push(`Pregunta ${q.id}: debe tener 4 o 5 opciones (tiene ${q.options.length})`)
    }
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      errors.push(`Pregunta ${q.id}: correctIndex fuera de rango`)
    }
    if (new Set(q.options).size !== q.options.length) {
      errors.push(`Pregunta ${q.id}: opciones repetidas`)
    }
    if (!sectionIds.has(q.sectionId)) {
      errors.push(`Pregunta ${q.id}: sección inexistente ${q.sectionId}`)
    }
  }

  for (const sim of content.simulations) {
    if (!SIMULATION_ID.test(sim.id)) errors.push(`Simulación ${sim.id}: id con formato inválido`)
    if (sim.description.trim() === '') errors.push(`Simulación ${sim.id}: descripción vacía`)
    // Las secciones aún no cargadas se verifican con findUnresolvedReferences.
    if (sim.sectionIds.length === 0 || !sim.sectionIds.every((id) => SECTION_ID.test(id))) {
      errors.push(`Simulación ${sim.id}: secciones inválidas`)
    }
  }

  return errors
}
