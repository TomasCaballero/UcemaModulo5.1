import { parseRichText, type Inline } from './richText'

function flatten(nodes: readonly Inline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
          return node.value
        case 'bold':
        case 'italic':
          return flatten(node.children)
        case 'math':
          // Del LaTeX queda lo legible: \chi^2 → chi2, \hat{y} → haty.
          return node.latex.replace(/[\\{}^_]/g, '')
        case 'ref':
          return node.label
      }
    })
    .join('')
}

/** Texto sin formato (sin `**`, `*`, `$` ni LaTeX), para buscar y ordenar. */
export function richTextToPlain(src: string): string {
  return flatten(parseRichText(src))
}
