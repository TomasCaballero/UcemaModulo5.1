import { richTextToPlain } from '@/content/plainText'
import type { ContentBlock, CourseContent, ModuleId } from '@/content/types'

/**
 * Referencias hacia adelante: un módulo que habla de algo que se enseña en uno posterior. Confunde,
 * porque el texto remite a conceptos que quien lee todavía no vio. Dos formas:
 * - `module`: nombra explícitamente un módulo o sección posterior ("Módulo 3", "Módulos 4 y 5", "(6.3)").
 * - `term`: usa un término propio de un módulo posterior (OLS, SVM, PCA...) sin que ese módulo lo haya introducido.
 */
export interface ForwardReference {
  kind: 'module' | 'term'
  /** Dónde está: "Módulo 0 · 0.4 Cálculo mínimo", "pregunta m3-q02", etc. */
  where: string
  moduleId: ModuleId
  /** Módulo al que se adelanta. */
  targetModule: number
  match: string
  excerpt: string
}

/** Término que se enseña en `introducedIn`; mencionarlo antes es una referencia hacia adelante. */
export interface LaterTerm {
  introducedIn: ModuleId
  label: string
  pattern: RegExp
}

/** Excepción acordada: el módulo puede usar el término porque lo define en el mismo lugar. */
export interface Allowance {
  moduleId: ModuleId
  term: string
  reason: string
}

const word = (source: string): RegExp => new RegExp(`(?<![\\p{L}\\d])(?:${source})(?![\\p{L}\\d])`, 'iu')
const acronym = (source: string): RegExp => new RegExp(`(?<![\\p{L}\\d])(?:${source})(?![\\p{L}\\d])`, 'u')

export const LATER_TERMS: readonly LaterTerm[] = [
  { introducedIn: 3, label: 'OLS', pattern: acronym('OLS|MCO') },
  { introducedIn: 3, label: 'Gauss-Markov', pattern: word('Gauss-Markov') },
  { introducedIn: 3, label: 'BLUE', pattern: acronym('BLUE') },
  { introducedIn: 3, label: 'heterocedasticidad', pattern: word('heterocedasticidad') },
  { introducedIn: 3, label: 'multicolinealidad', pattern: word('multicolinealidad') },
  { introducedIn: 3, label: 'VIF', pattern: acronym('VIF') },
  { introducedIn: 4, label: 'matriz de confusión', pattern: word('matriz de confusión') },
  { introducedIn: 4, label: 'Apriori', pattern: word('Apriori') },
  { introducedIn: 4, label: 'DBSCAN', pattern: acronym('DBSCAN') },
  { introducedIn: 4, label: 'KDD', pattern: acronym('KDD') },
  { introducedIn: 4, label: 'árbol de decisión', pattern: word('árboles? de decisión') },
  { introducedIn: 5, label: 'logit', pattern: word('logit') },
  { introducedIn: 5, label: 'probit', pattern: word('probit') },
  { introducedIn: 5, label: 'regresión logística', pattern: word('regresión logística') },
  { introducedIn: 5, label: 'LDA/QDA', pattern: acronym('LDA|QDA') },
  { introducedIn: 5, label: 'Naive Bayes', pattern: word('Naive Bayes') },
  { introducedIn: 5, label: 'odds', pattern: word('odds') },
  { introducedIn: 6, label: 'bootstrap', pattern: word('bootstrap') },
  { introducedIn: 6, label: 'validación cruzada', pattern: word('validación cruzada') },
  { introducedIn: 6, label: 'Ridge/Lasso', pattern: word('Ridge|Lasso') },
  { introducedIn: 6, label: 'PCA', pattern: acronym('PCA') },
  { introducedIn: 6, label: 'bagging/boosting', pattern: word('bagging|boosting') },
  { introducedIn: 6, label: 'Random Forest', pattern: word('Random Forest|bosque aleatorio') },
  { introducedIn: 6, label: 'SVM', pattern: acronym('SVM') },
  { introducedIn: 6, label: 'K-Means', pattern: word('K-Means') },
  { introducedIn: 6, label: 'sesgo-varianza', pattern: word('sesgo[- ]varianza|trade-off sesgo') },
  { introducedIn: 7, label: 'PAC', pattern: acronym('PAC') },
  { introducedIn: 7, label: 'dimensión VC', pattern: word('dimensión VC|No-Free-Lunch') },
]

/**
 * Usos de un término posterior que son legítimos porque el propio módulo lo explica en el lugar
 * (no se lo da por sabido). Cada excepción lleva su motivo para que la lista no crezca sin revisión.
 */
export const ALLOWED: readonly Allowance[] = [
  { moduleId: 4, term: 'K-Means', reason: 'Se nombra como ejemplo y se describe en la misma frase ("cada punto va al centro más cercano").' },
  { moduleId: 5, term: 'Ridge/Lasso', reason: 'L1 (Lasso) y L2 (Ridge) se definen en la sección "Regularización en la regresión logística".' },
  { moduleId: 5, term: 'validación cruzada', reason: 'Se la define con una glosa breve en el primer uso de la sección de selección de variables.' },
]

/** Módulos citados en un texto: "Módulo 3", "Módulos 4 y 5", "Módulo 6.7". */
const MODULE_MENTION = /M[óo]dulos?\s+(\d(?:\.\d)?(?:\s*(?:,|y|e|o|a|–|-)\s*\d(?:\.\d)?)*)/gu
/** Remisión a una sección entre paréntesis o con "ver": "(6.3)", "ver 7.3". */
const SECTION_MENTION = /(?:\((\d)\.(\d)\)|\bver\s+(\d)\.(\d)(?!\d))/gu

const excerptAround = (text: string, index: number, length: number): string => {
  const start = Math.max(0, index - 50)
  const end = Math.min(text.length, index + length + 50)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

function blockTexts(block: ContentBlock): string[] {
  switch (block.type) {
    case 'paragraph':
    case 'subheading':
    case 'callout':
    case 'analogy':
    case 'extra':
    case 'intuition':
      return [block.text]
    case 'list':
      return block.items
    case 'table':
      return [...block.headers, ...block.rows.flat()]
    case 'workedExample':
      return [block.title, ...block.steps, block.result]
    case 'formula':
    case 'miniCheck':
    case 'simulation':
      return []
  }
}

interface Source {
  where: string
  moduleId: ModuleId
  texts: string[]
}

function collectSources(content: CourseContent): Source[] {
  const sources: Source[] = []
  for (const info of content.modules) {
    if (info.intro) {
      sources.push({ where: `Módulo ${info.id} · introducción`, moduleId: info.id, texts: info.intro.flatMap(blockTexts) })
    }
  }
  for (const section of content.sections) {
    sources.push({
      where: `Módulo ${section.moduleId} · ${section.id} ${section.title}`,
      moduleId: section.moduleId,
      texts: [section.title, ...section.blocks.flatMap(blockTexts)],
    })
  }
  for (const question of content.questions) {
    sources.push({
      where: `pregunta ${question.id}`,
      moduleId: question.moduleId,
      texts: [question.prompt, ...question.options, question.explanation],
    })
  }
  for (const simulation of content.simulations) {
    sources.push({ where: `simulación ${simulation.id}`, moduleId: simulation.moduleId, texts: [simulation.title, simulation.description] })
  }
  return sources
}

/** Recorre el curso y devuelve toda referencia de un módulo a contenido de un módulo posterior. */
export function findForwardReferences(
  content: CourseContent,
  options: { terms?: readonly LaterTerm[]; allowed?: readonly Allowance[] } = {},
): ForwardReference[] {
  const terms = options.terms ?? LATER_TERMS
  const allowed = options.allowed ?? ALLOWED
  const sectionIds = new Set<string>(content.sections.map((section) => section.id))
  const found: ForwardReference[] = []

  for (const source of collectSources(content)) {
    for (const raw of source.texts) {
      const text = richTextToPlain(raw)

      for (const mention of text.matchAll(MODULE_MENTION)) {
        // De "4 y 5" o "6.7" interesa el número de módulo, no el de sección ("0.5" es el módulo 0).
        const targets = [...(mention[1] ?? '').matchAll(/(\d)(?:\.\d)?/g)].map((item) => Number(item[1]))
        const ahead = targets.find((target) => target > source.moduleId)
        if (ahead !== undefined) {
          found.push({ kind: 'module', where: source.where, moduleId: source.moduleId, targetModule: ahead, match: mention[0], excerpt: excerptAround(text, mention.index ?? 0, mention[0].length) })
        }
      }

      for (const mention of text.matchAll(SECTION_MENTION)) {
        const major = mention[1] ?? mention[3] ?? ''
        const minor = mention[2] ?? mention[4] ?? ''
        const target = Number(major)
        if (target > source.moduleId && sectionIds.has(`${major}.${minor}`)) {
          found.push({ kind: 'module', where: source.where, moduleId: source.moduleId, targetModule: target, match: mention[0], excerpt: excerptAround(text, mention.index ?? 0, mention[0].length) })
        }
      }

      for (const term of terms) {
        if (term.introducedIn <= source.moduleId) continue
        if (allowed.some((allowance) => allowance.moduleId === source.moduleId && allowance.term === term.label)) continue
        const hit = term.pattern.exec(text)
        if (hit) {
          found.push({ kind: 'term', where: source.where, moduleId: source.moduleId, targetModule: term.introducedIn, match: hit[0], excerpt: excerptAround(text, hit.index, hit[0].length) })
        }
      }
    }
  }
  return found
}
