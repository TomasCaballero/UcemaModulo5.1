/**
 * Minúsculas y sin tildes, carácter por carácter: el resultado tiene la misma longitud
 * que el original (salvo casos raros), así las posiciones sirven para resaltar.
 */
export function normalize(text: string): string {
  return [...text].map((char) => char.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()).join('')
}

/** Palabras de la consulta, normalizadas y sin repetir. */
export function tokenize(query: string): string[] {
  return [...new Set(normalize(query).split(/\s+/).filter((token) => token !== ''))]
}

export interface Segment {
  text: string
  match: boolean
}

/** Parte `text` en tramos, marcando los que coinciden con alguna palabra de la consulta. */
export function highlight(text: string, tokens: readonly string[]): Segment[] {
  const normalized = normalize(text)
  if (normalized.length !== text.length || tokens.length === 0) return [{ text, match: false }]

  const covered = new Array<boolean>(text.length).fill(false)
  for (const token of tokens) {
    for (let at = normalized.indexOf(token); at !== -1; at = normalized.indexOf(token, at + 1)) {
      covered.fill(true, at, at + token.length)
    }
  }

  const segments: Segment[] = []
  for (let i = 0; i < text.length; i++) {
    const match = covered[i] as boolean
    const last = segments[segments.length - 1]
    if (last && last.match === match) last.text += text[i]
    else segments.push({ text: text[i] as string, match })
  }
  return segments
}
