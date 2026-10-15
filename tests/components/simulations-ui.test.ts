import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import SimulationHost from '@/components/simulations/SimulationHost.vue'
import { registeredSimulationIds, simulationComponent } from '@/components/simulations/registry'
import { courseContent, courseIndex } from '@/content'
import { createAppRouter } from '@/router'
import { provideServices } from '@/services'
import { button } from '../helpers/assessment'
import { installTestServices } from '../helpers/services'

let router: ReturnType<typeof createAppRouter>

beforeAll(async () => {
  window.scrollTo = () => {}
  await Promise.all([
    import('@/components/simulations/BayesPopulation.vue'),
    import('@/components/simulations/CltSimulator.vue'),
    import('@/components/simulations/KMeansStepper.vue'),
    import('@/views/SectionView.vue'),
    import('@/views/ModuleView.vue'),
    import('@/views/SimulationView.vue'),
  ])
})

beforeEach(() => {
  installTestServices()
  router = createAppRouter(createMemoryHistory())
})

afterEach(() => {
  provideServices(undefined)
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function mountSimulation(id: string): Promise<VueWrapper> {
  const wrapper = mount(SimulationHost, { props: { simulationId: id }, global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

async function openApp(path: string): Promise<VueWrapper> {
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router, createPinia()] } })
  await router.isReady()
  await flushPromises()
  return wrapper
}

function stubReducedMotion(reduce: boolean): ReturnType<typeof vi.fn> {
  const addEventListener = vi.fn()
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: reduce,
    media,
    addEventListener,
    removeEventListener: vi.fn(),
  }))
  return addEventListener
}

describe('catálogo y registro', () => {
  it('cada interactivo del catálogo tiene su componente, y viceversa', () => {
    const catalog = courseContent.simulations.map((s) => s.id).sort()
    expect(registeredSimulationIds().sort()).toEqual(catalog)
    for (const id of catalog) expect(simulationComponent(id), id).toBeDefined()
    expect(simulationComponent('IN-99')).toBeUndefined()
  })

  it('devuelve siempre el mismo componente para un id', () => {
    expect(simulationComponent('IN-03')).toBe(simulationComponent('IN-03'))
  })

  it('cada interactivo tiene descripción textual no vacía (RNF-11)', () => {
    for (const simulation of courseContent.simulations) {
      expect(simulation.description.trim().length, simulation.id).toBeGreaterThan(40)
    }
  })

  it('un id sin componente avisa en vez de romper', async () => {
    const wrapper = await mountSimulation('IN-99')
    expect(wrapper.find('[role="alert"]').text()).toContain('IN-99')
  })
})

describe('humo: cada interactivo se monta sin errores (RF-45)', () => {
  it.each(registeredSimulationIds())('%s', async (id) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = await mountSimulation(id)

    const figure = wrapper.find('div.simulation[role="group"]')
    expect(figure.exists()).toBe(true)
    const describedBy = figure.attributes('aria-describedby') ?? ''
    expect(wrapper.find(`[id="${describedBy}"]`).text()).toBe(courseIndex.getSimulation(id)?.description)
    expect(figure.attributes('aria-label')).toBe(courseIndex.getSimulation(id)?.title)

    const charts = wrapper.findAll('svg[role="img"]')
    expect(charts.length).toBeGreaterThan(0)
    for (const chart of charts) expect(chart.attributes('aria-label')?.length ?? 0).toBeGreaterThan(20)

    expect(error).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('IN-03 Bayes', () => {
  it('con los datos de la guía da 15.4 % y los cuadritos suman 1000', async () => {
    const wrapper = await mountSimulation('IN-03')
    expect(wrapper.find('.bayes__posterior').text()).toBe('15.4 %')
    expect(wrapper.findAll('rect.bayes__cell')).toHaveLength(1000 + 4) // 1000 personas + 4 muestras de la leyenda
  })

  it('al subir la prevalencia a 10 % el resultado pasa a 66.7 % (AC-18)', async () => {
    const wrapper = await mountSimulation('IN-03')
    await wrapper.findAll('input[type="range"]')[0]?.setValue(10)
    expect(wrapper.find('.bayes__posterior').text()).toBe('66.7 %')
    expect(wrapper.find('.bayes__summary').text()).toContain('66.7 %')
  })

  it('la leyenda muestra los cuatro grupos con sus cantidades', async () => {
    const wrapper = await mountSimulation('IN-03')
    const legend = wrapper.find('.bayes__legend').text()
    expect(legend).toContain('Enfermos con test positivo: 9')
    expect(legend).toContain('Sanos con test positivo: 49.5')
    expect(legend).toContain('Enfermos con test negativo: 1')
    expect(legend).toContain('Sanos con test negativo: 940.5')
  })

  it('si nadie puede dar positivo lo explica en lugar de mostrar NaN', async () => {
    const wrapper = await mountSimulation('IN-03')
    await wrapper.findAll('input[type="range"]')[1]?.setValue(0)
    await wrapper.findAll('input[type="range"]')[2]?.setValue(0)
    expect(wrapper.find('.bayes__posterior').text()).toContain('nadie da positivo')
    expect(wrapper.text()).not.toContain('NaN')
  })

  it('usa controles nativos con etiqueta (teclado y lectores de pantalla, RNF-10)', async () => {
    const wrapper = await mountSimulation('IN-03')
    const sliders = wrapper.findAll('input[type="range"]')
    expect(sliders).toHaveLength(3)
    for (const slider of sliders) {
      expect(wrapper.find(`label[for="${slider.attributes('id')}"]`).exists()).toBe(true)
    }
  })
})

describe('IN-21 Teorema del Límite Central', () => {
  it('muestra las 400 medias y la curva Normal teórica al abrir', async () => {
    const wrapper = await mountSimulation('IN-21')
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
    expect(wrapper.findAll('rect.clt__bar')).toHaveLength(24)
    expect(wrapper.find('path.clt__curve').exists()).toBe(true)
    expect(wrapper.find('.clt__summary').text()).toContain('Error estándar teórico σ/√n')
  })

  it('con "reducir movimiento" no hay animación: queda la versión estática (AC-21)', async () => {
    stubReducedMotion(true)
    const wrapper = await mountSimulation('IN-21')
    expect(wrapper.find('.player__static').text()).toContain('reducir movimiento')
    expect(button(wrapper, 'Nuevas muestras').exists()).toBe(true)
    expect(wrapper.findAll('button').map((b) => b.text())).not.toContain('Reproducir')
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
  })

  it('con "reducir movimiento" tampoco anima al cambiar un parámetro', async () => {
    stubReducedMotion(true)
    const wrapper = await mountSimulation('IN-21')
    await wrapper.findAll('select')[1]?.setValue('30')
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
  })

  it('reiniciar vacía el gráfico; reproducir lo va llenando de a 10 medias', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const wrapper = await mountSimulation('IN-21')
    await button(wrapper, 'Reiniciar').trigger('click')
    expect(wrapper.find('.clt__summary').text()).toContain('Todavía no se dibujó ninguna media')
    expect(wrapper.find('path.clt__curve').exists()).toBe(false)

    await button(wrapper, 'Reproducir').trigger('click')
    await vi.advanceTimersByTimeAsync(450)
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 30 de 400')
    await button(wrapper, 'Pausar').trigger('click')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 30 de 400')

    await button(wrapper, 'Reproducir').trigger('click')
    await vi.advanceTimersByTimeAsync(150 * 50)
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
  })

  it('cambiar la población, n o pedir nuevas muestras vuelve a mostrar el resultado completo', async () => {
    const wrapper = await mountSimulation('IN-21')
    await button(wrapper, 'Reiniciar').trigger('click')
    await wrapper.findAll('select')[0]?.setValue('uniform')
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
    expect(wrapper.find('.clt__summary').text()).toContain('μ = 0.500')

    await button(wrapper, 'Reiniciar').trigger('click')
    await button(wrapper, 'Nuevas muestras').trigger('click')
    expect(wrapper.find('.clt__summary').text()).toContain('Medias dibujadas: 400 de 400')
  })

  it('el error estándar teórico que muestra es σ/√n: con σ = 1 vale 1 para n = 1 y 0.1 para n = 100', async () => {
    const wrapper = await mountSimulation('IN-21')
    const standardError = async (n: string): Promise<number> => {
      await wrapper.findAll('select')[1]?.setValue(n)
      return Number(/σ\/√n = (\d+\.\d+)/.exec(wrapper.find('.clt__summary').text())?.[1])
    }
    const se1 = await standardError('1')
    const se100 = await standardError('100')
    expect(se1).toBeCloseTo(1, 3)
    expect(se100).toBeCloseTo(0.1, 3)
  })

  it('reacciona a un cambio de la preferencia del sistema', async () => {
    const addEventListener = stubReducedMotion(false)
    const wrapper = await mountSimulation('IN-21')
    expect(wrapper.find('.player__static').exists()).toBe(false)
    const onChange = addEventListener.mock.calls.find(([event]) => event === 'change')?.[1] as (e: { matches: boolean }) => void
    onChange({ matches: true })
    await flushPromises()
    expect(wrapper.find('.player__static').exists()).toBe(true)
  })

  it('está incrustado en la sección 2.5', async () => {
    const wrapper = await openApp('/seccion/2.5')
    expect(wrapper.find('[role="group"][aria-label="Simulador del Teorema del Límite Central"]').exists()).toBe(true)
  })
})

describe('IN-58 K-Means', () => {
  it('empieza en los centroides iniciales, sin asignar (AC-19)', async () => {
    const wrapper = await mountSimulation('IN-58')
    expect(wrapper.find('.kmeans__phase').text()).toContain('Centroides iniciales')
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 0 de \d+$/)
    expect(wrapper.findAll('.kmeans__table tbody tr')).toHaveLength(3)
    expect(wrapper.find('.kmeans__table tbody td').text()).toBe('—')
  })

  it('en pausa, reproducir avanza paso a paso y reiniciar vuelve a los centroides iniciales (AC-19)', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const wrapper = await mountSimulation('IN-58')
    const initialCentroids = wrapper.find('.kmeans__table tbody').text()

    await button(wrapper, 'Reproducir').trigger('click')
    await button(wrapper, 'Pausar').trigger('click')
    await vi.advanceTimersByTimeAsync(5000)
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 0 de/) // en pausa no avanza

    await button(wrapper, 'Reproducir').trigger('click')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 1 de/)
    expect(wrapper.find('.kmeans__phase').text()).toContain('Asignar')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.find('.kmeans__phase').text()).toContain('Recalcular')
    expect(wrapper.find('.kmeans__table tbody').text()).not.toBe(initialCentroids)

    await button(wrapper, 'Reiniciar').trigger('click')
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 0 de/)
    expect(wrapper.find('.kmeans__phase').text()).toContain('Centroides iniciales')
    expect(wrapper.find('.kmeans__table tbody').text()).toBe(initialCentroids)
  })

  it('el ejemplo de la guía termina con centroides 2.33 y 11.33 y SSE 9.33', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const wrapper = await mountSimulation('IN-58')
    await wrapper.findAll('select')[0]?.setValue('guide')
    expect(wrapper.find('.kmeans__phase').text()).toContain('1 y 10')
    await button(wrapper, 'Reproducir').trigger('click')
    await vi.advanceTimersByTimeAsync(1000 * 6)
    expect(wrapper.find('.kmeans__phase').text()).toBe('Las asignaciones ya no cambian: el algoritmo terminó. SSE = 9.33.')
    const rows = wrapper.findAll('.kmeans__table tbody tr').map((r) => r.text())
    expect(rows[0]).toContain('3')
    expect(rows[0]).toContain('2.33')
    expect(rows[1]).toContain('11.33')
    expect(wrapper.find('button.button + button.button + button.button').exists()).toBe(false) // sin "Nuevos centroides" en 1D
  })

  it('con "reducir movimiento" muestra directo el resultado final, sin controles de reproducción', async () => {
    stubReducedMotion(true)
    const wrapper = await mountSimulation('IN-58')
    expect(wrapper.find('.player__static').exists()).toBe(true)
    expect(wrapper.findAll('button').map((b) => b.text())).not.toContain('Reproducir')
    expect(wrapper.find('.kmeans__phase').text()).toContain('el algoritmo terminó')
  })

  it('cambiar K reinicia y ajusta la cantidad de grupos; el codo marca el K elegido', async () => {
    const wrapper = await mountSimulation('IN-58')
    await wrapper.findAll('select')[1]?.setValue('2')
    expect(wrapper.findAll('.kmeans__table tbody tr')).toHaveLength(2)
    expect(wrapper.findAll('circle.kmeans__elbow-dot')).toHaveLength(6)
    expect(wrapper.findAll('circle.kmeans__elbow-dot.is-current')).toHaveLength(1)
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 0 de/)
  })

  it('"Nuevos centroides iniciales" cambia el arranque y reinicia', async () => {
    const wrapper = await mountSimulation('IN-58')
    const before = wrapper.find('.kmeans__table tbody').text()
    for (let attempt = 0; attempt < 5 && wrapper.find('.kmeans__table tbody').text() === before; attempt++) {
      await button(wrapper, 'Nuevos centroides iniciales').trigger('click')
    }
    expect(wrapper.find('.kmeans__table tbody').text()).not.toBe(before)
    expect(wrapper.find('.player__step').text()).toMatch(/^Paso 0 de/)
  })

  it('los grupos se distinguen por forma además de por color', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const wrapper = await mountSimulation('IN-58')
    await button(wrapper, 'Reproducir').trigger('click')
    await vi.advanceTimersByTimeAsync(1000)
    const shapes = new Set(wrapper.findAll('svg.kmeans__chart g.point').map((g) => g.element.firstElementChild?.tagName))
    expect(shapes).toEqual(new Set(['circle', 'rect', 'polygon']))
  })
})

describe('páginas de interactivos', () => {
  it('el módulo 0 y el 6 listan sus interactivos con enlace a la página propia', async () => {
    const module0 = await openApp('/modulo/0')
    expect(module0.find('#simulaciones + ul a').attributes('href')).toBe('/simulacion/IN-03')
    const module6 = await openApp('/modulo/6')
    expect(module6.find('#simulaciones + ul a').text()).toContain('IN-58')
  })

  it('un módulo sin interactivos no muestra la lista', async () => {
    const module7 = await openApp('/modulo/7')
    expect(module7.find('#simulaciones').exists()).toBe(false)
  })

  it('la página del interactivo lo muestra y cita las secciones donde se explica', async () => {
    const page = await openApp('/simulacion/IN-21')
    expect(page.find('h1').text()).toContain('IN-21')
    expect(page.find('[role="group"].simulation').exists()).toBe(true)
    expect(page.find('main > p a').attributes('href')).toBe('/seccion/2.5')
    expect(document.title).toContain('IN-21')

    const kmeans = await openApp('/simulacion/IN-58')
    expect(kmeans.find('main > p').text()).toContain('sección 6.7')
    expect(kmeans.find('main > p a').attributes('href')).toBe('/seccion/6.7')
  })

  it('un interactivo inexistente muestra "no encontrado"', async () => {
    expect((await openApp('/simulacion/IN-99')).find('h1').text()).toBe('No encontrado')
  })
})
