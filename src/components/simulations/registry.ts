import { defineAsyncComponent, defineComponent, h, type Component } from 'vue'

type Loader = () => Promise<{ default: Component }>

/**
 * Componente de cada interactivo, cargado bajo demanda (RNF-05). Para sumar uno:
 * crear su componente, su lógica en `logic/simulations/` y su ficha en
 * `content/data/simulations.ts`; después registrarlo acá.
 */
const loaders: Record<string, Loader> = {
  'IN-03': () => import('./BayesPopulation.vue'),
  'IN-21': () => import('./CltSimulator.vue'),
  'IN-58': () => import('./KMeansStepper.vue'),
}

const Loading = defineComponent({ render: () => h('p', { class: 'simulation-note', role: 'status' }, 'Cargando simulación…') })
const Failed = defineComponent({
  render: () => h('p', { class: 'simulation-note', role: 'alert' }, 'No se pudo cargar la simulación. Revisá tu conexión y recargá la página.'),
})

const cache = new Map<string, Component>()

export function registeredSimulationIds(): string[] {
  return Object.keys(loaders)
}

/** Componente asíncrono del interactivo, o `undefined` si no está registrado. */
export function simulationComponent(id: string): Component | undefined {
  const loader = loaders[id]
  if (!loader) return undefined
  let component = cache.get(id)
  if (!component) {
    component = defineAsyncComponent({ loader, loadingComponent: Loading, errorComponent: Failed, delay: 150 })
    cache.set(id, component)
  }
  return component
}
