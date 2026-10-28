import { parseRichText, type Inline } from './richText'

function flatten(nodes: readonly Inline[], math: (latex: string) => string): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
          return node.value
        case 'bold':
        case 'italic':
          return flatten(node.children, math)
        case 'math':
          return math(node.latex)
        case 'ref':
          return node.label
      }
    })
    .join('')
}

// Del LaTeX queda lo legible: \chi^2 → chi2, \hat{y} → haty.
const searchableMath = (latex: string): string => latex.replace(/[\\{}^_]/g, '')

/** Texto sin formato (sin `**`, `*`, `$` ni LaTeX), para buscar y ordenar. */
export function richTextToPlain(src: string): string {
  return flatten(parseRichText(src), searchableMath)
}

const SYMBOLS: Record<string, string> = {
  approx: '≈',
  times: '×',
  cdot: '·',
  div: '÷',
  pm: '±',
  le: '≤',
  leq: '≤',
  ge: '≥',
  geq: '≥',
  neq: '≠',
  infty: '∞',
  to: '→',
  Rightarrow: '⇒',
  sum: 'Σ',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  theta: 'θ',
  lambda: 'λ',
  mu: 'μ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  chi: 'χ',
}

/** LaTeX → texto que un lector de pantalla puede leer: "1/36 \approx 0.028" → "1/36 ≈ 0.028". */
export function latexToReadable(latex: string): string {
  // Primero lo que va dentro de otras llaves (texto, barra, sombrero); después fracciones y raíces,
  // de adentro hacia afuera. Barra y sombrero quedan como diacríticos: \bar{x} → x̄, \hat{y} → ŷ.
  let text = latex
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\\bar\{([^{}]*)\}/g, '$1̄')
    .replace(/\\hat\{([^{}]*)\}/g, '$1̂')
  const frac = /\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/
  const sqrt = /\\sqrt\{([^{}]*)\}/
  for (let guard = 0; guard < 20 && (frac.test(text) || sqrt.test(text)); guard++) {
    text = text.replace(frac, '($1)/($2)').replace(sqrt, '√($1)')
  }
  return text
    .replace(/\\([%$&#_])/g, '$1')
    .replace(/\\([A-Za-z]+)/g, (_, name: string) => SYMBOLS[name] ?? name)
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Texto legible en voz alta (las fórmulas con símbolos en lugar de comandos LaTeX), para rótulos accesibles. */
export function richTextToReadable(src: string): string {
  return flatten(parseRichText(src), latexToReadable)
}
