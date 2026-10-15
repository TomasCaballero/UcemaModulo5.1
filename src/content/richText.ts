/**
 * Texto enriquecido de los datos de contenido: un subconjunto mínimo de Markdown
 * (`**negrita**`, `*cursiva*`), fórmulas inline `$...$` en LaTeX y referencias
 * cruzadas "Módulo N.M". Un `$` literal se escribe `\$`.
 */
export type Inline =
  | { type: 'text'; value: string }
  | { type: 'bold'; children: Inline[] }
  | { type: 'italic'; children: Inline[] }
  | { type: 'math'; latex: string }
  | { type: 'ref'; sectionId: string; label: string }

const REF_SOURCE = String.raw`Módulo\s+(\d\.\d+)`

/** Ids de sección citados como "Módulo N.M" dentro de un texto. */
export function extractSectionRefs(text: string): string[] {
  return [...text.matchAll(new RegExp(REF_SOURCE, 'g'))].map((match) => match[1] as string)
}

function splitRefs(value: string, isKnownSection: (id: string) => boolean): Inline[] {
  const nodes: Inline[] = []
  let last = 0
  for (const match of value.matchAll(new RegExp(REF_SOURCE, 'g'))) {
    const sectionId = match[1] as string
    if (!isKnownSection(sectionId)) continue
    if (match.index > last) nodes.push({ type: 'text', value: value.slice(last, match.index) })
    nodes.push({ type: 'ref', sectionId, label: match[0] })
    last = match.index + match[0].length
  }
  if (last < value.length) nodes.push({ type: 'text', value: value.slice(last) })
  return nodes
}

/** Índice del cierre sin escapar de `delimiter` a partir de `from`, o -1. */
function findClosing(src: string, delimiter: string, from: number): number {
  let index = src.indexOf(delimiter, from)
  while (index > 0 && src[index - 1] === '\\') index = src.indexOf(delimiter, index + 1)
  return index
}

export function parseRichText(src: string, isKnownSection: (id: string) => boolean = () => false): Inline[] {
  const nodes: Inline[] = []
  let buffer = ''

  const flush = (): void => {
    if (buffer !== '') nodes.push(...splitRefs(buffer, isKnownSection))
    buffer = ''
  }

  let i = 0
  while (i < src.length) {
    if (src.startsWith('\\$', i)) {
      buffer += '$'
      i += 2
    } else if (src.startsWith('**', i) && findClosing(src, '**', i + 2) > i + 2) {
      const close = findClosing(src, '**', i + 2)
      flush()
      nodes.push({ type: 'bold', children: parseRichText(src.slice(i + 2, close), isKnownSection) })
      i = close + 2
    } else if (src[i] === '*' && findClosing(src, '*', i + 1) > i + 1) {
      const close = findClosing(src, '*', i + 1)
      flush()
      nodes.push({ type: 'italic', children: parseRichText(src.slice(i + 1, close), isKnownSection) })
      i = close + 1
    } else if (src[i] === '$' && findClosing(src, '$', i + 1) > i + 1) {
      const close = findClosing(src, '$', i + 1)
      flush()
      nodes.push({ type: 'math', latex: src.slice(i + 1, close) })
      i = close + 1
    } else {
      buffer += src[i]
      i++
    }
  }
  flush()
  return nodes
}
