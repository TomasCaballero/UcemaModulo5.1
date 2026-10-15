import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { studyAdvice } from '@/content'
import { createAppRouter, routeTitle } from '@/router'
import { installTestServices } from '../helpers/services'

let router: ReturnType<typeof createAppRouter>

// Las vistas se cargan bajo demanda; se precargan para que flushPromises alcance.
beforeAll(async () => {
  window.scrollTo = () => {} // jsdom no lo implementa; el router lo usa al navegar
  await Promise.all([
    import('@/views/ModuleView.vue'),
    import('@/views/SectionView.vue'),
    import('@/components/content/MathInline.vue'),
  ])
})

async function openApp(path: string): Promise<VueWrapper> {
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router, createPinia()] } })
  await router.isReady()
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  installTestServices()
  router = createAppRouter(createMemoryHistory())
})

describe('inicio', () => {
  it('lista exactamente 8 módulos numerados 0 a 7 en orden (AC-01)', async () => {
    const wrapper = await openApp('/')
    const numbers = wrapper.findAll('.module-card__number').map((n) => n.text())
    expect(numbers).toEqual(['Módulo 0', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4', 'Módulo 5', 'Módulo 6', 'Módulo 7'])
  })

  it('muestra la sugerencia de orden de estudio de la guía (RF-06)', async () => {
    const wrapper = await openApp('/')
    expect(wrapper.find('#como-estudiar').text()).toBe('Cómo estudiar con esta guía')
    const items = wrapper.findAll('section[aria-labelledby="como-estudiar"] li')
    expect(items).toHaveLength(studyAdvice.length)
    expect(items[0]?.text()).toContain('Primero el Módulo 0 y el 2')
  })

  it('cualquier módulo se abre sin completar los anteriores (AC-05)', async () => {
    const wrapper = await openApp('/')
    const links = wrapper.findAll('a.module-card__link')
    expect(links).toHaveLength(8)
    expect(links[7]?.attributes('href')).toBe('/modulo/7')
    await links[7]?.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('module')
    expect(wrapper.find('h1').text()).toBe('Módulo 7: Teoría Formal del Aprendizaje Automático')
  })
})

describe('módulo', () => {
  it('lista las secciones 2.1 a 2.7 y muestra la apertura del módulo', async () => {
    const wrapper = await openApp('/modulo/2')
    expect(wrapper.findAll('.section-index__id').map((n) => n.text())).toEqual([
      '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
    ])
    expect(wrapper.text()).toContain('tomar decisiones razonables')
  })

  it('un módulo sin secciones cargadas lo avisa en vez de quedar vacío', async () => {
    const wrapper = await openApp('/modulo/7')
    expect(wrapper.text()).toContain('todavía no están cargadas')
  })

  it('un módulo inexistente muestra "no encontrado"', async () => {
    const wrapper = await openApp('/modulo/9')
    expect(wrapper.find('h1').text()).toBe('No encontrado')
  })
})

describe('sección', () => {
  it('desde 2.4, "Siguiente" lleva a 2.5 y "Anterior" a 2.3 (AC-03)', async () => {
    const wrapper = await openApp('/seccion/2.4')
    const next = wrapper.find('a[rel="next"]')
    const previous = wrapper.find('a[rel="prev"]')
    expect(next.text()).toContain('2.5')
    expect(previous.text()).toContain('2.3')

    await next.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.sectionId).toBe('2.5')

    await wrapper.find('a[rel="prev"]').trigger('click')
    await flushPromises()
    await wrapper.find('a[rel="prev"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.sectionId).toBe('2.3')
  })

  it('la primera y la última sección del módulo cargado no tienen vecino en ese extremo', async () => {
    const first = await openApp('/seccion/2.1')
    expect(first.find('a[rel="prev"]').exists()).toBe(false)
    expect(first.find('a[rel="next"]').exists()).toBe(true)
    const last = await openApp('/seccion/2.7')
    expect(last.find('a[rel="next"]').exists()).toBe(false)
  })

  it('el menú de secciones lista todas las del módulo y marca la actual (AC-04)', async () => {
    const wrapper = await openApp('/seccion/2.3')
    const menu = wrapper.find('details.layout__menu')
    expect(menu.findAll('a')).toHaveLength(8) // 7 secciones + la autoevaluación (AC-02)
    const current = menu.find('a[aria-current="page"]')
    expect(current.text()).toContain('2.3')
  })

  it('la barra lateral muestra el mismo índice', async () => {
    const wrapper = await openApp('/seccion/2.3')
    expect(wrapper.find('nav.layout__sidebar').findAll('a')).toHaveLength(8)
  })

  it('una sección inexistente muestra "no encontrado"', async () => {
    const wrapper = await openApp('/seccion/9.9')
    expect(wrapper.find('h1').text()).toBe('No encontrado')
  })
})

describe('routeTitle', () => {
  it('pone un título propio a cada pantalla', async () => {
    await router.push('/seccion/2.3')
    expect(routeTitle(router.currentRoute.value)).toContain('2.3 Escalas de medición')
    await router.push('/modulo/2')
    expect(routeTitle(router.currentRoute.value)).toContain('Módulo 2: Estadística')
    await router.push('/')
    expect(routeTitle(router.currentRoute.value)).toBe('Curso de Estadística, Econometría y Ciencia de Datos')
    await router.push('/seccion/9.9')
    expect(routeTitle(router.currentRoute.value)).toBe('Curso de Estadística, Econometría y Ciencia de Datos')
  })
})
