import { richTextToPlain } from '@/content/plainText'
import type { CourseContent } from '@/content/types'
import { commonErrors, ladder, techniques } from '@/content/data/synthesis'
import { studyAdvice, usageGuide } from '@/content/data/guide'
import { countBullets, countNumberedItems, type GuideHeading } from './guide'

export type Status = 'covered' | 'missing' | 'pending'

export interface HeadingCheck {
  heading: string
  status: Status
  detail: string
}

const covered = (heading: GuideHeading, detail: string): HeadingCheck => ({ heading: heading.text, status: 'covered', detail })
const missing = (heading: GuideHeading, detail: string): HeadingCheck => ({ heading: heading.text, status: 'missing', detail })
const pending = (heading: GuideHeading, detail: string): HeadingCheck => ({ heading: heading.text, status: 'pending', detail })

/**
 * Para cada encabezado `##` y `###` de la guía, comprueba que el curso tiene su equivalente (RNF-17).
 * Lo que pertenece a un módulo sin secciones cargadas queda como `pending`, no como `missing`.
 */
export function checkHeadings(markdown: string, headings: readonly GuideHeading[], content: CourseContent): HeadingCheck[] {
  const loadedModules = new Set(content.sections.map((section) => section.moduleId))

  return headings.map((heading): HeadingCheck => {
    const { text } = heading

    const moduleMatch = /^Módulo (\d): (.+)$/.exec(text)
    if (heading.level === 2 && moduleMatch) {
      const info = content.modules.find((module) => module.id === Number(moduleMatch[1]))
      if (!info) return missing(heading, 'no hay módulo con ese número')
      return richTextToPlain(info.title) === moduleMatch[2] ? covered(heading, 'título del módulo') : missing(heading, `título distinto: "${info.title}"`)
    }

    const sectionMatch = /^(\d\.\d+) (.+)$/.exec(text)
    if (heading.level === 3 && sectionMatch) {
      const moduleId = Number((sectionMatch[1] as string).split('.')[0])
      const section = content.sections.find((s) => s.id === sectionMatch[1])
      if (section) {
        const plain = richTextToPlain(section.title)
        return plain === richTextToPlain(sectionMatch[2] as string) ? covered(heading, 'sección') : missing(heading, `título distinto: "${section.title}"`)
      }
      return loadedModules.has(moduleId as 0) ? missing(heading, 'falta la sección') : pending(heading, `Módulo ${moduleId} sin cargar`)
    }

    const assessment = /^(Autoevaluación|Respuestas) del Módulo (\d)$/.exec(text)
    if (heading.level === 3 && assessment) {
      const moduleId = Number(assessment[2])
      if (!loadedModules.has(moduleId as 0)) return pending(heading, `Módulo ${moduleId} sin cargar`)
      const questions = content.questions.filter((q) => q.moduleId === moduleId)
      if (questions.length === 0) return missing(heading, 'sin preguntas')
      if (assessment[1] === 'Autoevaluación') return covered(heading, `${questions.length} preguntas`)
      return questions.every((q) => q.explanation.trim() !== '') ? covered(heading, 'explicaciones') : missing(heading, 'hay preguntas sin explicación')
    }

    if (heading.level === 3 && text.startsWith('Anexo opcional')) {
      return content.sections.some((s) => s.moduleId === 1 && s.optional)
        ? covered(heading, 'sección opcional')
        : loadedModules.has(1) ? missing(heading, 'falta el anexo') : pending(heading, 'Módulo 1 sin cargar')
    }

    switch (text) {
      case 'Cómo usar esta guía': {
        const expected = countNumberedItems(markdown, text)
        return usageGuide.rules.length === expected ? covered(heading, `${expected} reglas`) : missing(heading, `${usageGuide.rules.length} de ${expected} reglas`)
      }
      case 'Cómo estudiar con esta guía': {
        const expected = countNumberedItems(markdown, text)
        return studyAdvice.length === expected ? covered(heading, `${expected} puntos`) : missing(heading, `${studyAdvice.length} de ${expected} puntos`)
      }
      case 'Glosario': {
        const expected = countBullets(markdown, text)
        return content.glossary.length === expected ? covered(heading, `${expected} términos`) : missing(heading, `${content.glossary.length} de ${expected} términos`)
      }
      case 'Cuadro síntesis y guía de uso':
        return ladder.length > 0 ? covered(heading, 'vista de síntesis') : missing(heading, 'sin vista')
      case 'La escalera del conocimiento':
        return ladder.length === 8 ? covered(heading, '8 niveles') : missing(heading, `${ladder.length} de 8 niveles`)
      case '¿Qué técnica uso para qué problema?':
        return techniques.length === 8 ? covered(heading, '8 filas') : missing(heading, `${techniques.length} de 8 filas`)
      case 'Los errores más comunes (y cómo evitarlos)': {
        const expected = countNumberedItems(markdown, text)
        return commonErrors.length === expected ? covered(heading, `${expected} errores`) : missing(heading, `${commonErrors.length} de ${expected} errores`)
      }
      default:
        return missing(heading, 'sin regla de equivalencia')
    }
  })
}

export function summarize(checks: readonly HeadingCheck[]): Record<Status, number> {
  return {
    covered: checks.filter((c) => c.status === 'covered').length,
    missing: checks.filter((c) => c.status === 'missing').length,
    pending: checks.filter((c) => c.status === 'pending').length,
  }
}
