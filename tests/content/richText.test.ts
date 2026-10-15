import { describe, expect, it } from 'vitest'
import { extractSectionRefs, parseRichText } from '@/content/richText'

describe('parseRichText', () => {
  it('devuelve texto plano', () => {
    expect(parseRichText('hola')).toEqual([{ type: 'text', value: 'hola' }])
  })

  it('reconoce negrita, cursiva y fórmulas inline', () => {
    expect(parseRichText('a **b** *c* $x^2$ d')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'bold', children: [{ type: 'text', value: 'b' }] },
      { type: 'text', value: ' ' },
      { type: 'italic', children: [{ type: 'text', value: 'c' }] },
      { type: 'text', value: ' ' },
      { type: 'math', latex: 'x^2' },
      { type: 'text', value: ' d' },
    ])
  })

  it('anida fórmulas dentro de negrita y cursiva', () => {
    expect(parseRichText('**con $\\mu$**')).toEqual([
      { type: 'bold', children: [{ type: 'text', value: 'con ' }, { type: 'math', latex: '\\mu' }] },
    ])
    expect(parseRichText('*Por qué $n-1$:*')).toEqual([
      { type: 'italic', children: [{ type: 'text', value: 'Por qué ' }, { type: 'math', latex: 'n-1' }, { type: 'text', value: ':' }] },
    ])
  })

  it('no confunde asteriscos dentro de una fórmula con cursiva', () => {
    expect(parseRichText('con $z^{*} = 1.96$ y $z^*$')).toEqual([
      { type: 'text', value: 'con ' },
      { type: 'math', latex: 'z^{*} = 1.96' },
      { type: 'text', value: ' y ' },
      { type: 'math', latex: 'z^*' },
    ])
  })

  it('trata \\$ como un signo pesos literal', () => {
    expect(parseRichText('salario de \\$2000 y \\$1000')).toEqual([
      { type: 'text', value: 'salario de $2000 y $1000' },
    ])
  })

  it('deja como texto los delimitadores sin cerrar', () => {
    expect(parseRichText('**abierta')).toEqual([{ type: 'text', value: '**abierta' }])
    expect(parseRichText('*abierta')).toEqual([{ type: 'text', value: '*abierta' }])
    expect(parseRichText('$abierta')).toEqual([{ type: 'text', value: '$abierta' }])
  })

  it('convierte "Módulo N.M" en referencia solo si la sección existe', () => {
    const known = (id: string): boolean => id === '0.5'
    expect(parseRichText('ver Módulo 0.5 y Módulo 9.9', known)).toEqual([
      { type: 'text', value: 'ver ' },
      { type: 'ref', sectionId: '0.5', label: 'Módulo 0.5' },
      { type: 'text', value: ' y Módulo 9.9' },
    ])
  })

  it('no toma "Módulo 5" (sin sección) como referencia', () => {
    expect(parseRichText('del Módulo 5', () => true)).toEqual([{ type: 'text', value: 'del Módulo 5' }])
  })
})

describe('extractSectionRefs', () => {
  it('lista los ids citados', () => {
    expect(extractSectionRefs('(Módulo 2.3) y (Módulo 0.4), no el Módulo 5')).toEqual(['2.3', '0.4'])
  })
})
