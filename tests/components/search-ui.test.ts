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
    import('@/views/GlossaryView.vue'),
    import('@/views/SearchView.vue'),
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

describe('encabezado', () => {
  it.each(['/', '/glosario', '/seccion/2.1'])('ofrece navegación principal y un buscador en %s', async (path) => {
    const wrapper = await openApp(path)
    const links = wrapper.find('nav[aria-label="Principal"]').findAll('a').map((a) => a.text())
    expect(links).toEqual(['Inicio', 'Glosario', 'Repaso'])
    expect(wrapper.find('form[role="search"] input[type="search"]').exists()).toBe(true)
  })

  it('buscar desde el encabezado lleva a los resultados', async () => {
    const wrapper = await openApp('/')
    await wrapper.find('#header-search').setValue('  varianza ')
    await wrapper.find('form[role="search"]').trigger('submit')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('search')
    expect(router.currentRoute.value.query.q).toBe('varianza')
    expect(wrapper.find('h1').text()).toBe('Búsqueda')
    expect(wrapper.find('#search-input').element).toHaveProperty('value', 'varianza')
  })

  it('buscar sin texto abre la búsqueda vacía', async () => {
    const wrapper = await openApp('/')
    await wrapper.find('form[role="search"]').trigger('submit')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('search')
    expect(router.currentRoute.value.query.q).toBeUndefined()
  })
})

describe('glosario', () => {
  it('lista los 80 términos y cuenta cuántos hay', async () => {
    const wrapper = await openApp('/glosario')
    expect(wrapper.findAll('.glossary__entry')).toHaveLength(80)
    expect(wrapper.find('.count').text()).toBe('80 de 80 términos')
  })

  it('escribir "heterocedasticidad" muestra el término con su definición (AC-11)', async () => {
    const wrapper = await openApp('/glosario')
    await wrapper.find('#glossary-filter').setValue('heterocedasticidad')
    const entries = wrapper.findAll('.glossary__entry')
    expect(entries).toHaveLength(1)
    expect(entries[0]?.text()).toContain('Heterocedasticidad')
    expect(entries[0]?.text()).toContain('varianza del error no constante')
    expect(wrapper.find('.count').text()).toBe('1 de 80 términos')
  })

  it('sin coincidencias lo avisa', async () => {
    const wrapper = await openApp('/glosario')
    await wrapper.find('#glossary-filter').setValue('zzzz')
    expect(wrapper.findAll('.glossary__entry')).toHaveLength(0)
    expect(wrapper.find('.count').text()).toBe('No hay términos que coincidan.')
  })

  it('el filtro queda en la URL y se puede abrir enlazado', async () => {
    const wrapper = await openApp('/glosario')
    await wrapper.find('#glossary-filter').setValue('lasso')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBe('lasso')

    const linked = await openApp('/glosario?q=poisson')
    expect(linked.findAll('.glossary__entry')).toHaveLength(1)
    expect(linked.find('#glossary-filter').element).toHaveProperty('value', 'poisson')
  })

  it('la referencia a una sección cargada es un enlace a esa sección (AC-12)', async () => {
    const wrapper = await openApp('/glosario?q=desviacion tipica')
    const link = wrapper.find('.glossary__entry .references a')
    expect(link.text()).toContain('2.2')
    expect(link.attributes('href')).toBe('/seccion/2.2')
    await link.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.sectionId).toBe('2.2')
  })

  it('una referencia a una sección que todavía no está cargada se muestra como texto', async () => {
    const wrapper = await openApp('/glosario?q=lasso')
    const entry = wrapper.find('.glossary__entry')
    expect(entry.find('.references').text()).toContain('6.4')
    expect(entry.find('.references a').exists()).toBe(false)
  })

  it('una referencia solo al módulo enlaza a la página del módulo', async () => {
    const wrapper = await openApp('/glosario?q=atributo')
    const link = wrapper.find('.glossary__entry .references a')
    expect(link.text()).toBe('Módulo 4')
    expect(link.attributes('href')).toBe('/modulo/4')
  })

  it('con varias referencias las separa con comas', async () => {
    const wrapper = await openApp('/glosario?q=varianza')
    const entry = wrapper.findAll('.glossary__entry').find((e) => e.text().startsWith('Varianza'))
    expect(entry?.find('.references').text()).toMatch(/\(.*2\.2.*,.*6\.2.*\)/)
  })

  it('las fórmulas del glosario se renderizan', async () => {
    const wrapper = await openApp('/glosario?q=chi-cuadrado')
    await flushPromises()
    expect(wrapper.find('.glossary__entry .katex').exists()).toBe(true)
  })
})

describe('búsqueda', () => {
  it('sin texto invita a escribir', async () => {
    const wrapper = await openApp('/buscar')
    expect(wrapper.find('.status').text()).toBe('Escribí una palabra o dos para buscar.')
    expect(wrapper.findAll('.results__item')).toHaveLength(0)
  })

  it('"varianza" muestra la entrada del glosario y la sección 2.2, con la palabra resaltada', async () => {
    const wrapper = await openApp('/buscar?q=varianza')
    expect(wrapper.find('#glosario-resultados').text()).toContain('Glosario')
    expect(wrapper.find('#secciones-resultados').text()).toContain('Secciones')
    const sectionLinks = wrapper.findAll('#secciones-resultados + ul a').map((a) => a.attributes('href'))
    expect(sectionLinks).toContain('/seccion/2.2')
    expect(wrapper.findAll('mark').some((m) => m.text().toLowerCase() === 'varianza')).toBe(true)
    expect(wrapper.find('.status').text()).toMatch(/^\d+ resultados$/)
  })

  it('el resultado del glosario enlaza al glosario filtrado por ese término', async () => {
    const wrapper = await openApp('/buscar?q=heterocedasticidad')
    const link = wrapper.find('#glosario-resultados + ul a')
    expect(link.attributes('href')).toBe('/glosario?q=Heterocedasticidad')
  })

  it('sin resultados lo dice', async () => {
    const wrapper = await openApp('/buscar?q=zzzzzz')
    expect(wrapper.find('.status').text()).toBe('No hay resultados para «zzzzzz».')
  })

  it('escribir en el campo actualiza resultados y URL', async () => {
    const wrapper = await openApp('/buscar')
    await wrapper.find('#search-input').setValue('poisson')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBe('poisson')
    expect(wrapper.findAll('.results__item').length).toBeGreaterThan(0)
    await wrapper.find('#search-input').setValue('')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBeUndefined()
  })

  it('usa el singular con un solo resultado', async () => {
    const wrapper = await openApp('/buscar?q=heterocedasticidad')
    expect(wrapper.find('.status').text()).toBe('1 resultado')
  })

  it('una nueva búsqueda desde el encabezado reemplaza la consulta', async () => {
    const wrapper = await openApp('/buscar?q=poisson')
    await wrapper.find('#header-search').setValue('normal')
    await wrapper.find('form[role="search"]').trigger('submit')
    await flushPromises()
    expect(wrapper.find('#search-input').element).toHaveProperty('value', 'normal')
  })

  it('tiene título propio', async () => {
    await openApp('/buscar')
    expect(document.title).toBe('Búsqueda · Curso de Estadística, Econometría y Ciencia de Datos')
    await openApp('/glosario')
    expect(document.title).toBe('Glosario · Curso de Estadística, Econometría y Ciencia de Datos')
  })
})
