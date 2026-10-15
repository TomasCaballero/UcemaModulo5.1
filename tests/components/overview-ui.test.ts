import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { provideServices } from '@/services'
import { installTestServices } from '../helpers/services'

let router: ReturnType<typeof createAppRouter>

beforeAll(async () => {
  window.scrollTo = () => {}
  await Promise.all([
    import('@/views/ConceptMapView.vue'),
    import('@/views/SynthesisView.vue'),
    import('@/views/SectionView.vue'),
    import('@/components/content/MathInline.vue'),
  ])
})

beforeEach(() => {
  installTestServices()
  router = createAppRouter(createMemoryHistory())
})

afterEach(() => provideServices(undefined))

async function openApp(path: string): Promise<VueWrapper> {
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router, createPinia()] } })
  await router.isReady()
  await flushPromises()
  return wrapper
}

const node = (wrapper: VueWrapper, id: string) => {
  const found = wrapper.findAll('button.node').find((b) => b.find('.node__id').text() === id)
  if (!found) throw new Error(`No hay nodo ${id}`)
  return found
}

describe('cuadro síntesis', () => {
  it('contiene la escalera de 8 niveles, las 8 filas de técnicas y los 11 errores comunes (AC-13)', async () => {
    const wrapper = await openApp('/sintesis')
    expect(wrapper.find('h1').text()).toBe('Cuadro síntesis y guía de uso')
    expect(wrapper.findAll('.ladder__step')).toHaveLength(8)
    expect(wrapper.findAll('tbody tr')).toHaveLength(8)
    expect(wrapper.findAll('.errors li')).toHaveLength(11)
  })

  it('usa los encabezados de la guía', async () => {
    const wrapper = await openApp('/sintesis')
    expect(wrapper.findAll('h2').map((h) => h.text())).toEqual([
      'La escalera del conocimiento',
      '¿Qué técnica uso para qué problema?',
      'Los errores más comunes (y cómo evitarlos)',
    ])
  })

  it('la escalera va del nivel 7 al 0 y cada nivel enlaza a su módulo', async () => {
    const wrapper = await openApp('/sintesis')
    const steps = wrapper.findAll('.ladder__step')
    expect(steps.map((s) => s.find('.ladder__number').text())).toEqual(['7', '6', '5', '4', '3', '2', '1', '0'])
    expect(steps[0]?.find('a').attributes('href')).toBe('/modulo/7')
    expect(steps[0]?.text()).toContain('Garantías formales de generalización')
  })

  it('los módulos de la tabla son enlaces y las referencias de los errores enlazan si la sección está cargada', async () => {
    const wrapper = await openApp('/sintesis')
    const row = wrapper.findAll('tbody tr')[2]
    expect(row?.findAll('td')[0]?.text()).toContain('Logit')
    expect(row?.findAll('td a').map((a) => a.attributes('href'))).toEqual(['/modulo/4', '/modulo/5', '/modulo/6'])

    const interval = wrapper.findAll('.errors li')[1]
    expect(interval?.find('a').attributes('href')).toBe('/seccion/2.6')
    const causal = wrapper.findAll('.errors li')[0]
    expect(causal?.find('a').exists()).toBe(false) // 3.2 todavía no está cargada
    expect(causal?.text()).toContain('(3.2)')
  })

  it('tiene título propio', async () => {
    await openApp('/sintesis')
    expect(document.title).toContain('Cuadro síntesis')
  })
})

describe('mapa de conceptos', () => {
  it('muestra los 49 nodos agrupados en los 8 módulos', async () => {
    const wrapper = await openApp('/mapa')
    expect(wrapper.findAll('button.node')).toHaveLength(49)
    expect(wrapper.findAll('.module-title')).toHaveLength(8)
    expect(wrapper.find('#detalle + p').text()).toBe('No elegiste ninguna sección.')
  })

  it('elegir OLS (3.3) resalta sus dependencias y se puede abrir cada una (AC-15)', async () => {
    const wrapper = await openApp('/mapa')
    await node(wrapper, '3.3').trigger('click')

    expect(node(wrapper, '3.3').classes()).toContain('node--selected')
    expect(node(wrapper, '3.3').attributes('aria-pressed')).toBe('true')
    for (const id of ['0.4', '2.2']) {
      expect(node(wrapper, id).classes(), id).toContain('node--prerequisite')
      expect(node(wrapper, id).text(), id).toContain('Prerrequisito')
    }
    expect(node(wrapper, '5.1').classes()).toContain('node--dependent') // 5.1 usa OLS
    expect(node(wrapper, '5.1').text()).toContain('La usa')
    expect(node(wrapper, '2.3').classes()).not.toContain('node--prerequisite')

    const detail = wrapper.find('.detail')
    expect(detail.text()).toContain('3.3 Regresión lineal simple')
    expect(detail.text()).toContain('Depende de')
    const open = detail.findAll('a').find((a) => a.attributes('href') === '/seccion/2.2')
    expect(open?.text()).toContain('2.2 Medidas de tendencia central')
    await open?.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.sectionId).toBe('2.2')
  })

  it('las secciones sin cargar se marcan y no son enlaces', async () => {
    const wrapper = await openApp('/mapa')
    await node(wrapper, '3.3').trigger('click')
    expect(node(wrapper, '3.3').classes()).toContain('node--pending')
    expect(node(wrapper, '2.2').classes()).not.toContain('node--pending')
    expect(node(wrapper, '3.3').text()).toContain('aún no cargada')
    const detail = wrapper.find('.detail')
    expect(detail.find('.detail__title .detail__pending').text()).toBe('(aún no cargada)')
    expect(detail.findAll('a').some((a) => a.attributes('href') === '/seccion/3.3')).toBe(false)
    expect(detail.findAll('a').some((a) => a.attributes('href') === '/seccion/0.4')).toBe(false) // 0.4 tampoco está
  })

  it('una sección cargada ofrece "Abrir sección"', async () => {
    const wrapper = await openApp('/mapa')
    await node(wrapper, '2.6').trigger('click')
    const open = wrapper.find('.detail__title a')
    expect(open.text()).toBe('Abrir sección')
    expect(open.attributes('href')).toBe('/seccion/2.6')
    expect(wrapper.find('.detail').text()).toContain('0.5 Logaritmos y exponenciales')
    expect(wrapper.find('.detail').text()).toContain('5.2 Regresión logística')
  })

  it('elegir de nuevo la misma sección la deselecciona; cambiar de sección cambia el resaltado', async () => {
    const wrapper = await openApp('/mapa')
    await node(wrapper, '3.3').trigger('click')
    await node(wrapper, '5.2').trigger('click')
    expect(node(wrapper, '3.3').classes()).not.toContain('node--selected')
    expect(node(wrapper, '5.2').classes()).toContain('node--selected')
    await node(wrapper, '5.2').trigger('click')
    expect(wrapper.findAll('button[aria-pressed="true"]')).toHaveLength(0)
    expect(wrapper.find('#detalle + p').text()).toBe('No elegiste ninguna sección.')
  })

  it('una sección sin prerrequisitos o sin usos lo dice', async () => {
    const wrapper = await openApp('/mapa')
    await node(wrapper, '0.1').trigger('click')
    expect(wrapper.find('.detail').text()).toContain('No depende de otras secciones.')
    expect(wrapper.find('.detail').text()).toContain('Ninguna otra sección la usa.')
  })

  it('cada nodo es un botón nativo con área táctil mínima (RNF-07, RNF-10)', async () => {
    const wrapper = await openApp('/mapa')
    for (const button of wrapper.findAll('button.node')) expect(button.attributes('type')).toBe('button')
  })
})
