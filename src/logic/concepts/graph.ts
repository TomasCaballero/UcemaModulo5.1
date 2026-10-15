export interface ConceptEdge {
  from: string
  to: string
}

export interface ConceptNode {
  id: string
  title: string
}

/** Relaciones de un nodo: qué necesita y quién lo necesita. */
export interface ConceptLinks {
  /** Secciones de las que depende (directamente). */
  prerequisites: string[]
  /** Secciones que dependen de esta (directamente). */
  dependents: string[]
}

export class InvalidGraphError extends Error {
  constructor(reason: string) {
    super(reason)
    this.name = 'InvalidGraphError'
  }
}

/**
 * Grafo de dependencias entre secciones. Falla si una arista nombra un nodo inexistente,
 * si una sección depende de sí misma, si hay aristas repetidas o si hay un ciclo (una
 * sección no puede necesitar, directa o indirectamente, algo que la necesita).
 */
export class ConceptGraph {
  private readonly prerequisitesById = new Map<string, string[]>()
  private readonly dependentsById = new Map<string, string[]>()

  constructor(
    readonly nodes: readonly ConceptNode[],
    readonly edges: readonly ConceptEdge[],
  ) {
    for (const node of nodes) {
      if (this.prerequisitesById.has(node.id)) throw new InvalidGraphError(`Nodo repetido: ${node.id}`)
      this.prerequisitesById.set(node.id, [])
      this.dependentsById.set(node.id, [])
    }
    const seen = new Set<string>()
    for (const { from, to } of edges) {
      if (!this.prerequisitesById.has(from)) throw new InvalidGraphError(`Arista desde un nodo inexistente: ${from}`)
      if (!this.prerequisitesById.has(to)) throw new InvalidGraphError(`Arista hacia un nodo inexistente: ${to}`)
      if (from === to) throw new InvalidGraphError(`Una sección no puede depender de sí misma: ${from}`)
      const key = `${from}>${to}`
      if (seen.has(key)) throw new InvalidGraphError(`Arista repetida: ${from} → ${to}`)
      seen.add(key)
      this.prerequisitesById.get(from)?.push(to)
      this.dependentsById.get(to)?.push(from)
    }
    const cycle = this.findCycle()
    if (cycle) throw new InvalidGraphError(`Ciclo de dependencias: ${cycle.join(' → ')}`)
  }

  has(id: string): boolean {
    return this.prerequisitesById.has(id)
  }

  linksOf(id: string): ConceptLinks {
    return {
      prerequisites: [...(this.prerequisitesById.get(id) ?? [])],
      dependents: [...(this.dependentsById.get(id) ?? [])],
    }
  }

  /** Primer ciclo encontrado, como lista de ids que vuelve al inicio, o `undefined`. */
  private findCycle(): string[] | undefined {
    const state = new Map<string, 'visiting' | 'done'>()
    const path: string[] = []
    const visit = (id: string): string[] | undefined => {
      if (state.get(id) === 'done') return undefined
      if (state.get(id) === 'visiting') return [...path.slice(path.indexOf(id)), id]
      state.set(id, 'visiting')
      path.push(id)
      for (const next of this.prerequisitesById.get(id) ?? []) {
        const found = visit(next)
        if (found) return found
      }
      path.pop()
      state.set(id, 'done')
      return undefined
    }
    for (const node of this.nodes) {
      const found = visit(node.id)
      if (found) return found
    }
    return undefined
  }
}
