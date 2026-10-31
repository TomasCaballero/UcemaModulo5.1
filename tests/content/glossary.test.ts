import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { glossary } from '@/content/data/glossary'
import { richTextToPlain } from '@/content/plainText'

describe('glosario de la guía', () => {
  it('tiene los 100 términos de la guía', () => {
    expect(glossary).toHaveLength(100)
  })

  it('no repite términos y todos tienen definición y referencias', () => {
    const terms = glossary.map((e) => richTextToPlain(e.term))
    expect(new Set(terms).size).toBe(terms.length)
    for (const entry of glossary) {
      expect(entry.definition.trim(), entry.term).not.toBe('')
      expect(entry.references.length, entry.term).toBeGreaterThan(0)
    }
  })

  it('conserva las referencias de la guía', () => {
    const refs = (term: string) => glossary.find((e) => e.term === term)?.references
    expect(refs('Lasso')).toEqual(['6.4'])
    expect(refs('Varianza')).toEqual(['2.2', '6.2'])
    expect(refs('Hiperplano')).toEqual(['0.3', '6.6'])
    expect(refs('Atributo')).toEqual(['4']) // la guía cita solo el módulo
  })

  it('cada referencia a una sección del Módulo 2 existe', () => {
    for (const entry of glossary) {
      for (const ref of entry.references.filter((r) => r.startsWith('2.'))) {
        expect(courseContent.sections.some((s) => s.id === ref), `${entry.term} → ${ref}`).toBe(true)
      }
    }
  })
})

describe('richTextToPlain', () => {
  it('quita el formato y deja el LaTeX legible', () => {
    expect(richTextToPlain('***Ceteris** paribus*')).toBeTypeOf('string')
    expect(richTextToPlain('**Negrita** y *cursiva*')).toBe('Negrita y cursiva')
    expect(richTextToPlain('Chi-cuadrado ($\\chi^2$)')).toBe('Chi-cuadrado (chi2)')
    expect(richTextToPlain('$y-\\hat{y}$')).toBe('y-haty')
    expect(richTextToPlain('un salario de \\$2000')).toBe('un salario de $2000')
  })

  it('conserva el texto de las referencias cruzadas', () => {
    expect(richTextToPlain('ver Módulo 0.5')).toBe('ver Módulo 0.5')
  })
})
