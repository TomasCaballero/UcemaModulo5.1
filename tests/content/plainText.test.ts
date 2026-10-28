import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { latexToReadable, richTextToPlain, richTextToReadable } from '@/content/plainText'

describe('richTextToPlain', () => {
  it('quita formato y comandos LaTeX para buscar', () => {
    expect(richTextToPlain(String.raw`**La** $\chi^2$ y $\hat{y}$`)).toBe('La chi2 y haty')
  })
})

describe('latexToReadable', () => {
  it.each([
    [String.raw`1/36 \approx 0.028`, '1/36 ≈ 0.028'],
    [String.raw`\tfrac{1}{6} \times \tfrac{1}{6}`, '(1)/(6) × (1)/(6)'],
    [String.raw`\dfrac{\bar{x} - \mu_0}{s/\sqrt{n}}`, '(x̄ - μ_0)/(s/√(n))'],
    [String.raw`\hat{\beta}_1 \neq 0`, 'β̂_1 ≠ 0'],
    [String.raw`P(\text{par}) = 0.5`, 'P(par) = 0.5'],
    [String.raw`100\,000`, '100 000'],
  ])('%s → %s', (latex, readable) => {
    expect(latexToReadable(latex)).toBe(readable)
  })
})

describe('richTextToReadable', () => {
  it('combina texto y fórmulas legibles', () => {
    expect(richTextToReadable(String.raw`Aprox. $e^{-3} \approx 0.050$`)).toBe('Aprox. e^-3 ≈ 0.050')
  })

  it('ninguna opción del banco con fórmulas deja comandos LaTeX en su rótulo accesible', () => {
    const leftovers = courseContent.questions
      .flatMap((q) => q.options.map((option) => ({ id: q.id, option })))
      .filter(({ option }) => option.includes('$'))
      .map(({ id, option }) => ({ id, readable: richTextToReadable(option) }))
      .filter(({ readable }) => /[\\{}$]/.test(readable) || readable.trim() === '')
    expect(leftovers).toEqual([])
  })
})
