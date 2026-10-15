import { richTextToPlain } from '@/content/plainText'
import type { GlossaryEntry } from '@/content/types'
import { normalize, tokenize } from './normalize'

const haystacks = new WeakMap<GlossaryEntry, string>()

function haystackOf(entry: GlossaryEntry): string {
  let haystack = haystacks.get(entry)
  if (haystack === undefined) {
    haystack = normalize(`${richTextToPlain(entry.term)} ${richTextToPlain(entry.definition)}`)
    haystacks.set(entry, haystack)
  }
  return haystack
}

/** Entradas cuyo término o definición contienen todas las palabras de `query` (RF-11). */
export function filterGlossary(entries: readonly GlossaryEntry[], query: string): GlossaryEntry[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return [...entries]
  return entries.filter((entry) => tokens.every((token) => haystackOf(entry).includes(token)))
}
