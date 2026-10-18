import type { ContentBlock } from './types'

/** Textos enriquecidos de un bloque, en el orden en que se leen. */
export function blockTexts(block: ContentBlock): string[] {
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
