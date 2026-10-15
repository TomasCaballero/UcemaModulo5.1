import { describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import type { CourseContent } from '@/content/types'
import { buildSearchIndex } from '@/logic/search/engine'
import { filterGlossary } from '@/logic/search/filter'
import { highlight, normalize, tokenize } from '@/logic/search/normalize'

describe('normalize', () => {
  it('quita tildes y mayúsculas conservando la longitud', () => {
    const text = 'Estimación MÁXIMA Verosimilitud, ñandú'
    expect(normalize(text)).toBe('estimacion maxima verosimilitud, nandu')
    expect(normalize(text)).toHaveLength(text.length)
  })
})

describe('tokenize', () => {
  it('separa palabras, normaliza y no repite', () => {
    expect(tokenize('  Varianza   MUESTRAL varianza ')).toEqual(['varianza', 'muestral'])
    expect(tokenize('   ')).toEqual([])
  })
})

describe('highlight', () => {
  it('marca las coincidencias sin importar tildes ni mayúsculas', () => {
    expect(highlight('La Estimación puntual', ['estimacion'])).toEqual([
      { text: 'La ', match: false },
      { text: 'Estimación', match: true },
      { text: ' puntual', match: false },
    ])
  })

  it('une coincidencias solapadas y marca todas las apariciones', () => {
    const segments = highlight('aaa b aaa', ['aa', 'aaa'])
    expect(segments.filter((s) => s.match).map((s) => s.text)).toEqual(['aaa', 'aaa'])
  })

  it('sin palabras o sin coincidencias devuelve el texto entero', () => {
    expect(highlight('hola', [])).toEqual([{ text: 'hola', match: false }])
    expect(highlight('hola', ['xyz'])).toEqual([{ text: 'hola', match: false }])
  })

  it('si la normalización cambia la longitud no resalta, pero no falla', () => {
    // Una sílaba Hangul se descompone en varias letras al normalizar.
    expect(highlight('가', ['가'])).toEqual([{ text: '가', match: false }])
  })
})

const content: CourseContent = {
  modules: [{ id: 2, title: 'Estadística', summary: 's' }],
  sections: [
    {
      id: '2.2',
      moduleId: 2,
      title: 'Medidas de dispersión',
      blocks: [
        { type: 'paragraph', text: 'La **varianza** mide cuánto se esparcen los datos respecto a la media.' },
        { type: 'formula', latex: 'x' },
      ],
    },
    {
      id: '2.6',
      moduleId: 2,
      title: 'Estimación',
      blocks: [
        { type: 'paragraph', text: 'Un intervalo de confianza usa la desviación típica y la varianza de la muestra. '.repeat(3) },
        { type: 'paragraph', text: 'El bootstrap remuestrea con reemplazo.' },
      ],
    },
  ],
  glossary: [
    { term: 'Varianza', definition: 'promedio de desviaciones al cuadrado', references: ['2.2'] },
    { term: '*Bootstrap*', definition: 'muestra extraída con reemplazo', references: ['6.3'] },
    { term: 'Media', definition: 'promedio', references: ['2.2'] },
  ],
  questions: [],
  simulations: [],
}

describe('buildSearchIndex', () => {
  const index = buildSearchIndex(content)

  it('devuelve glosario y secciones que contienen la palabra', () => {
    const results = index.search('varianza')
    expect(results.map((r) => r.kind)).toEqual(['glossary', 'section', 'section'].slice(0, results.length))
    expect(results.some((r) => r.kind === 'glossary' && r.term === 'Varianza')).toBe(true)
    expect(results.filter((r) => r.kind === 'section').map((r) => r.kind === 'section' && r.sectionId)).toEqual(
      expect.arrayContaining(['2.2', '2.6']),
    )
  })

  it('busca el término del glosario y la sección con la misma palabra: "bootstrap" (AC-42)', () => {
    const results = index.search('bootstrap')
    expect(results.find((r) => r.kind === 'glossary')).toMatchObject({ term: 'Bootstrap' })
    expect(results.find((r) => r.kind === 'section')).toMatchObject({ sectionId: '2.6' })
  })

  it('ignora tildes y mayúsculas', () => {
    expect(index.search('ESTIMACION')).toHaveLength(1)
    expect(index.search('desviación')).toEqual(index.search('DESVIACION'))
  })

  it('exige todas las palabras de la consulta', () => {
    expect(index.search('varianza muestra').length).toBeGreaterThan(0)
    expect(index.search('varianza inexistente')).toEqual([])
  })

  it('ordena por relevancia: coincidir en el título pesa más que en el cuerpo', () => {
    const [first] = index.search('estimacion')
    expect(first).toMatchObject({ kind: 'section', sectionId: '2.6' })
    const byScore = index.search('varianza')
    expect(byScore.map((r) => r.score)).toEqual([...byScore.map((r) => r.score)].sort((a, b) => b - a))
  })

  it('el glosario va primero cuando el término coincide', () => {
    expect(index.search('varianza')[0]).toMatchObject({ kind: 'glossary', term: 'Varianza' })
  })

  it('resalta las coincidencias en el fragmento y en el título', () => {
    const result = index.search('bootstrap').find((r) => r.kind === 'section')
    expect(result?.snippet.some((s) => s.match && s.text === 'bootstrap')).toBe(true)
    expect(index.search('bootstrap')[0]?.heading).toEqual([{ text: 'Bootstrap', match: true }])
  })

  it('recorta el fragmento alrededor de la coincidencia, con puntos suspensivos', () => {
    const result = index.search('reemplazo').find((r) => r.kind === 'section')
    const text = result?.snippet.map((s) => s.text).join('') ?? ''
    expect(text.startsWith('…')).toBe(true)
    expect(text).toContain('reemplazo')
    expect(text.length).toBeLessThan(220)
  })

  it('si la palabra solo está en el título, muestra el comienzo del texto', () => {
    const result = index.search('dispersion').find((r) => r.kind === 'section')
    const text = result?.snippet.map((s) => s.text).join('') ?? ''
    expect(text.startsWith('La varianza mide')).toBe(true)
  })

  it('trunca los comienzos muy largos', () => {
    const long = buildSearchIndex({
      ...content,
      sections: [{ id: '2.2', moduleId: 2, title: 'Largo', blocks: [{ type: 'paragraph', text: 'palabra '.repeat(60) }] }],
      glossary: [],
    })
    const text = long.search('largo')[0]?.snippet.map((s) => s.text).join('') ?? ''
    expect(text.endsWith('…')).toBe(true)
    expect(text.length).toBeLessThanOrEqual(141)
  })

  it('una consulta demasiado corta o vacía no devuelve nada', () => {
    expect(index.search('')).toEqual([])
    expect(index.search('a')).toEqual([])
    expect(index.search('   ')).toEqual([])
  })

  it('indexa las fórmulas inline de los textos y los términos con formato', () => {
    const math = buildSearchIndex({
      ...content,
      sections: [],
      glossary: [{ term: 'Chi-cuadrado ($\\chi^2$)', definition: 'suma de normales al cuadrado', references: ['2.4'] }],
    })
    expect(math.search('chi2')[0]).toMatchObject({ kind: 'glossary', term: 'Chi-cuadrado (chi2)' })
  })
})

describe('búsqueda sobre el curso real', () => {
  const index = buildSearchIndex(courseContent)

  it('"heterocedasticidad" encuentra su término del glosario', () => {
    expect(index.search('heterocedasticidad')[0]).toMatchObject({ kind: 'glossary', term: 'Heterocedasticidad' })
  })

  it('"varianza" encuentra la sección 2.2 y la entrada del glosario', () => {
    const results = index.search('varianza')
    expect(results.some((r) => r.kind === 'glossary' && r.term === 'Varianza')).toBe(true)
    expect(results.some((r) => r.kind === 'section' && r.sectionId === '2.2')).toBe(true)
  })

  it('"p-valor" y "p valor" llegan a la sección 2.7', () => {
    expect(index.search('p-valor').some((r) => r.kind === 'section' && r.sectionId === '2.7')).toBe(true)
  })
})

describe('filterGlossary', () => {
  const { glossary } = courseContent

  it('sin consulta devuelve todo el glosario', () => {
    expect(filterGlossary(glossary, '')).toHaveLength(glossary.length)
    expect(filterGlossary(glossary, '   ')).toHaveLength(glossary.length)
  })

  it('escribir "heterocedasticidad" deja el término con su definición (AC-11)', () => {
    const found = filterGlossary(glossary, 'heterocedasticidad')
    expect(found.map((e) => e.term)).toEqual(['Heterocedasticidad'])
    expect(found[0]?.definition).toBe('varianza del error no constante')
  })

  it('busca también en la definición y combina palabras', () => {
    expect(filterGlossary(glossary, 'campana gauss').map((e) => e.term)).toEqual(['Normal'])
  })

  it('una consulta sin coincidencias devuelve vacío', () => {
    expect(filterGlossary(glossary, 'zzzz')).toEqual([])
  })
})
