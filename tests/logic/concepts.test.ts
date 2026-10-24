import { describe, expect, it } from 'vitest'
import { conceptGraph } from '@/content/concepts'
import { dependencies, sectionCatalog } from '@/content/data/concepts'
import { ConceptGraph, InvalidGraphError } from '@/logic/concepts/graph'

const nodes = ['a', 'b', 'c', 'd'].map((id) => ({ id, title: id.toUpperCase() }))

describe('ConceptGraph', () => {
  const graph = new ConceptGraph(nodes, [
    { from: 'c', to: 'a' },
    { from: 'c', to: 'b' },
    { from: 'd', to: 'c' },
  ])

  it('da los prerrequisitos y quiénes usan cada nodo', () => {
    expect(graph.linksOf('c')).toEqual({ prerequisites: ['a', 'b'], dependents: ['d'] })
    expect(graph.linksOf('a')).toEqual({ prerequisites: [], dependents: ['c'] })
    expect(graph.linksOf('d')).toEqual({ prerequisites: ['c'], dependents: [] })
  })

  it('un nodo desconocido no tiene relaciones', () => {
    expect(graph.linksOf('zzz')).toEqual({ prerequisites: [], dependents: [] })
    expect(graph.has('a')).toBe(true)
    expect(graph.has('zzz')).toBe(false)
  })

  it('devuelve copias: modificar el resultado no altera el grafo', () => {
    graph.linksOf('c').prerequisites.push('x')
    expect(graph.linksOf('c').prerequisites).toEqual(['a', 'b'])
  })

  it.each([
    ['nodo repetido', [...nodes, { id: 'a', title: 'otra' }], [], /Nodo repetido: a/],
    ['arista desde un nodo inexistente', nodes, [{ from: 'x', to: 'a' }], /desde un nodo inexistente: x/],
    ['arista hacia un nodo inexistente', nodes, [{ from: 'a', to: 'x' }], /hacia un nodo inexistente: x/],
    ['dependencia de sí misma', nodes, [{ from: 'a', to: 'a' }], /de sí misma: a/],
    [
      'arista repetida',
      nodes,
      [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'b' },
      ],
      /Arista repetida: a → b/,
    ],
    [
      'ciclo',
      nodes,
      [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'a' },
      ],
      /Ciclo de dependencias: a → b → c → a/,
    ],
  ])('rechaza: %s', (_caso, graphNodes, edges, message) => {
    expect(() => new ConceptGraph(graphNodes, edges)).toThrow(InvalidGraphError)
    expect(() => new ConceptGraph(graphNodes, edges)).toThrow(message)
  })

  it('acepta diamantes (un nodo alcanzable por dos caminos no es un ciclo)', () => {
    expect(
      () =>
        new ConceptGraph(nodes, [
          { from: 'd', to: 'b' },
          { from: 'd', to: 'c' },
          { from: 'b', to: 'a' },
          { from: 'c', to: 'a' },
        ]),
    ).not.toThrow()
  })
})

describe('mapa de conceptos de la guía', () => {
  it('tiene las 50 secciones, sin repetir', () => {
    expect(sectionCatalog).toHaveLength(50)
    expect(new Set(sectionCatalog.map((s) => s.id)).size).toBe(50)
  })

  it('las dependencias son válidas y no forman ciclos (el grafo se construye)', () => {
    expect(conceptGraph.edges).toHaveLength(dependencies.length)
  })

  it('cada dependencia va de una sección a una anterior de la guía', () => {
    const order = new Map(sectionCatalog.map((s, i) => [s.id, i]))
    for (const { from, to } of dependencies) {
      expect(order.get(to) as number, `${from} → ${to}`).toBeLessThan(order.get(from) as number)
    }
  })

  it('OLS (3.3) depende de 0.4 (derivadas) y 2.2 (medidas) (AC-15)', () => {
    expect(conceptGraph.linksOf('3.3').prerequisites).toEqual(expect.arrayContaining(['0.4', '2.2']))
  })

  it('"2.6" es prerrequisito de la regresión logística (5.2), que lo usa', () => {
    expect(conceptGraph.linksOf('5.2').prerequisites).toContain('2.6')
    expect(conceptGraph.linksOf('2.6').dependents).toContain('5.2')
  })
})
