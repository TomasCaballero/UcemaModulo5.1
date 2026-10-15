import { blockTexts } from '@/content/blocks'
import { richTextToPlain } from '@/content/plainText'
import type { CourseContent, GlossaryReference, SectionId } from '@/content/types'
import { highlight, normalize, tokenize, type Segment } from './normalize'

export type SearchResult = SectionResult | GlossaryResult

interface BaseResult {
  score: number
  /** Título de la sección o término del glosario, con las coincidencias marcadas. */
  heading: Segment[]
  /** Fragmento del texto donde aparece la búsqueda, con las coincidencias marcadas. */
  snippet: Segment[]
}

export interface SectionResult extends BaseResult {
  kind: 'section'
  sectionId: SectionId
  title: string
}

export interface GlossaryResult extends BaseResult {
  kind: 'glossary'
  /** Término sin formato. */
  term: string
  references: GlossaryReference[]
}

export interface SearchIndex {
  search(query: string): SearchResult[]
}

interface Entry {
  kind: 'section' | 'glossary'
  title: string
  titleNormalized: string
  body: string
  bodyNormalized: string
  build(score: number, snippet: Segment[], heading: Segment[]): SearchResult
}

const MIN_QUERY_LENGTH = 2
const SNIPPET_RADIUS = 70
const SNIPPET_START_LENGTH = 140
const TITLE_HIT = 10
const MAX_BODY_HITS = 5
const GLOSSARY_BONUS = 5

function countOccurrences(text: string, token: string): number {
  let count = 0
  for (let at = text.indexOf(token); at !== -1; at = text.indexOf(token, at + token.length)) count++
  return count
}

/** Recorta el texto alrededor de la primera coincidencia, sin cortar palabras a la mitad. */
function excerpt(body: string, bodyNormalized: string, tokens: readonly string[]): string {
  const positions = tokens.map((token) => bodyNormalized.indexOf(token)).filter((at) => at !== -1)
  if (positions.length === 0 || bodyNormalized.length !== body.length) {
    return body.length > SNIPPET_START_LENGTH ? `${body.slice(0, SNIPPET_START_LENGTH).trimEnd()}…` : body
  }
  const hit = Math.min(...positions)
  let start = Math.max(0, hit - SNIPPET_RADIUS)
  let end = Math.min(body.length, hit + SNIPPET_RADIUS)
  if (start > 0) start = body.indexOf(' ', start) === -1 ? start : body.indexOf(' ', start) + 1
  if (end < body.length) end = body.lastIndexOf(' ', end) <= start ? end : body.lastIndexOf(' ', end)
  return `${start > 0 ? '…' : ''}${body.slice(start, end).trim()}${end < body.length ? '…' : ''}`
}

function buildEntries(content: CourseContent): Entry[] {
  const sections: Entry[] = content.sections.map((section) => {
    const body = section.blocks.flatMap(blockTexts).map(richTextToPlain).join(' ')
    const title = `${section.id} ${section.title}`
    return {
      kind: 'section',
      title,
      titleNormalized: normalize(title),
      body,
      bodyNormalized: normalize(body),
      build: (score, snippet, heading) => ({ kind: 'section', sectionId: section.id, title, score, snippet, heading }),
    }
  })
  const glossary: Entry[] = content.glossary.map((entry) => {
    const term = richTextToPlain(entry.term)
    const body = richTextToPlain(entry.definition)
    return {
      kind: 'glossary',
      title: term,
      titleNormalized: normalize(term),
      body,
      bodyNormalized: normalize(body),
      build: (score, snippet, heading) => ({
        kind: 'glossary',
        term,
        references: entry.references,
        score,
        snippet,
        heading,
      }),
    }
  })
  return [...glossary, ...sections]
}

/**
 * Búsqueda de texto sobre secciones y glosario (RF-42): sin tildes ni mayúsculas, y una
 * entrada coincide si contiene todas las palabras de la consulta. Se ordena por relevancia
 * (título o término pesan más que el cuerpo) y, a igual relevancia, el glosario va primero.
 */
export function buildSearchIndex(content: CourseContent): SearchIndex {
  const entries = buildEntries(content)

  return {
    search(query) {
      const tokens = tokenize(query)
      if (tokens.join('').length < MIN_QUERY_LENGTH) return []

      const results: { result: SearchResult; order: number }[] = []
      entries.forEach((entry, order) => {
        const everyTokenFound = tokens.every(
          (token) => entry.titleNormalized.includes(token) || entry.bodyNormalized.includes(token),
        )
        if (!everyTokenFound) return

        let score = 0
        for (const token of tokens) {
          if (entry.titleNormalized.includes(token)) score += TITLE_HIT
          score += Math.min(countOccurrences(entry.bodyNormalized, token), MAX_BODY_HITS)
        }
        if (entry.kind === 'glossary' && tokens.some((token) => entry.titleNormalized.includes(token))) {
          score += GLOSSARY_BONUS
        }
        const text = excerpt(entry.body, entry.bodyNormalized, tokens)
        results.push({ result: entry.build(score, highlight(text, tokens), highlight(entry.title, tokens)), order })
      })

      return results.sort((a, b) => b.result.score - a.result.score || a.order - b.order).map(({ result }) => result)
    },
  }
}
