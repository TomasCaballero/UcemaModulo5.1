export interface GuideHeading {
  level: 2 | 3
  text: string
  line: number
}

/** Encabezados `##` y `###` de la guía, sin contar lo que haya dentro de bloques de código. */
export function parseHeadings(markdown: string): GuideHeading[] {
  const headings: GuideHeading[] = []
  let inFence = false
  markdown.split(/\r?\n/).forEach((line, index) => {
    if (line.startsWith('```')) inFence = !inFence
    if (inFence) return
    const match = /^(##|###) (.+)$/.exec(line)
    if (match) headings.push({ level: match[1] === '##' ? 2 : 3, text: (match[2] as string).trim(), line: index + 1 })
  })
  return headings
}

/** Líneas que hay bajo un encabezado, hasta el siguiente `##` o `###` (o una línea `---`). */
export function sectionLines(markdown: string, headingText: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const start = lines.findIndex((line) => /^#{2,3} /.test(line) && line.replace(/^#{2,3} /, '').trim() === headingText)
  if (start === -1) return []
  const body: string[] = []
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,3} /.test(line) || line.trim() === '---') break
    body.push(line)
  }
  return body
}

/** Cantidad de ítems numerados ("1. …") bajo un encabezado. */
export function countNumberedItems(markdown: string, headingText: string): number {
  return sectionLines(markdown, headingText).filter((line) => /^\d+\. /.test(line)).length
}

/** Cantidad de viñetas de primer nivel ("* …") bajo un encabezado. */
export function countBullets(markdown: string, headingText: string): number {
  return sectionLines(markdown, headingText).filter((line) => line.startsWith('* ')).length
}

/** Preguntas de "Autoevaluación del Módulo N" de la guía, por módulo. */
export function autoevaluationCounts(markdown: string): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const heading of parseHeadings(markdown)) {
    const match = /^Autoevaluación del Módulo (\d)$/.exec(heading.text)
    if (match) counts[Number(match[1])] = countNumberedItems(markdown, heading.text)
  }
  return counts
}
