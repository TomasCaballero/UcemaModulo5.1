import { blockTexts } from './blocks'
import { richTextToPlain } from './plainText'
import { extractSectionRefs } from './richText'
import type { CourseContent } from './types'

/**
 * Referencias que no apuntan a ninguna sección cargada: las "Módulo N.M" de los textos
 * ("2.6 → 0.5") y las del glosario ("glosario: Lasso → 6.4"; las que citan un módulo
 * entero no cuentan) y las de los interactivos ("IN-58 → 6.7"). Queda vacía cuando el curso está completo.
 */
export function findUnresolvedReferences(content: CourseContent): string[] {
  const known = new Set<string>(content.sections.map((section) => section.id))
  const unresolved: string[] = []
  for (const section of content.sections) {
    for (const text of section.blocks.flatMap(blockTexts)) {
      for (const ref of extractSectionRefs(text)) {
        if (!known.has(ref)) unresolved.push(`${section.id} → ${ref}`)
      }
    }
  }
  for (const entry of content.glossary) {
    for (const ref of entry.references) {
      if (ref.includes('.') && !known.has(ref)) unresolved.push(`glosario: ${richTextToPlain(entry.term)} → ${ref}`)
    }
  }
  for (const simulation of content.simulations) {
    for (const id of simulation.sectionIds) {
      if (!known.has(id)) unresolved.push(`${simulation.id} → ${id}`)
    }
  }
  return unresolved
}
