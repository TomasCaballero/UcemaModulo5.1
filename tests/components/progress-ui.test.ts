import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import { MemoryStorage } from '@/core/storage'
import { downloadTextFile } from '@/platform/download'
import { createAppRouter } from '@/router'
import { provideServices } from '@/services'
import { installTestServices } from '../helpers/services'

vi.mock('@/platform/download', () => ({ downloadTextFile: vi.fn() }))

let router: ReturnType<typeof createAppRouter>

// Las vistas se cargan bajo demanda; se precargan para que flushPromises alcance.
beforeAll(async () => {
  window.scrollTo = () => {}
  await Promise.all([
    import('@/views/ModuleView.vue'),
    import('@/views/SectionView.vue'),
    import('@/components/content/MathInline.vue'),
  ])
})

beforeEach(() => {
  router = createAppRouter(createMemoryHistory())
})

afterEach(() => {
  provideServices(undefined)
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

async function openApp(path: string): Promise<VueWrapper> {
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router, createPinia()] } })
  await router.isReady()
  await flushPromises()
  return wrapper
}

const buttonByText = (wrapper: VueWrapper, text: string) => {
  const button = wrapper.findAll('button').find((b) => b.text() === text)
  if (!button) throw new Error(`No hay botón "${text}"`)
  return button
}

describe('marcar como vista', () => {
  it('el botón marca la sección y el módulo suma uno (AC-32)', async () => {
    installTestServices()
    const section = await openApp('/seccion/2.1')
    await buttonByText(section, 'Marcar como vista').trigger('click')
    expect(section.find('.mark-seen__done').text()).toContain('Sección vista')

    const module = await openApp('/modulo/2')
    expect(module.find('.progress__text').text()).toBe('1 de 7 secciones (14 %)')
    expect(module.find('.section-index a').text()).toContain('✓')
  })

  it('llegar al final de la sección la marca como vista (RF-32)', async () => {
    installTestServices()
    let notify: IntersectionObserverCallback = () => {}
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const section = await openApp('/seccion/2.2')
    expect(section.find('.mark-seen__done').exists()).toBe(false)
    notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    await flushPromises()
    expect(section.find('.mark-seen__done').exists()).toBe(false)
    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    await flushPromises()
    expect(section.find('.mark-seen__done').exists()).toBe(true)
  })
})

describe('continuar', () => {
  it('sin visitas no hay botón; tras visitar 2.4 el inicio ofrece "Continuar: 2.4" (AC-35)', async () => {
    installTestServices()
    const fresh = await openApp('/')
    expect(fresh.find('.continue').exists()).toBe(false)

    await router.push('/seccion/2.4')
    await router.push('/')
    const home = await openApp('/')
    const link = home.find('.continue__link')
    expect(link.text()).toContain('Continuar: 2.4')
    await link.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.sectionId).toBe('2.4')
  })

  it('el inicio muestra el avance total y el de cada módulo', async () => {
    installTestServices()
    const home = await openApp('/')
    expect(home.findAll('progress')).toHaveLength(9) // total + 8 módulos
    expect(home.text()).toContain('0 de 7 secciones (0 %)')
  })
})

describe('borrar progreso', () => {
  async function homeWithProgress() {
    installTestServices()
    const section = await openApp('/seccion/2.1')
    await buttonByText(section, 'Marcar como vista').trigger('click')
    return openApp('/')
  }

  it('cancelar conserva los datos (AC-41)', async () => {
    const home = await homeWithProgress()
    await buttonByText(home, 'Borrar progreso').trigger('click')
    expect(home.find('[role="alertdialog"]').exists()).toBe(true)
    await buttonByText(home, 'Cancelar').trigger('click')
    expect(home.find('[role="alertdialog"]').exists()).toBe(false)
    expect(home.text()).toContain('1 de 7 secciones (14 %)')
  })

  it('confirmar deja el progreso en 0 % (AC-41)', async () => {
    const home = await homeWithProgress()
    await buttonByText(home, 'Borrar progreso').trigger('click')
    await buttonByText(home, 'Sí, borrar todo').trigger('click')
    expect(home.text()).not.toContain('1 de 7 secciones')
    expect(home.text()).toContain('Progreso borrado.')
    expect(home.find('.continue').exists()).toBe(false)
  })
})

describe('exportar e importar', () => {
  function chooseFile(wrapper: VueWrapper, content: string) {
    const input = wrapper.find('input[type="file"]')
    const file = new File([content], 'progreso.json', { type: 'application/json' })
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    return input.trigger('change')
  }

  it('exportar descarga el archivo con el progreso', async () => {
    installTestServices()
    const section = await openApp('/seccion/2.1')
    await buttonByText(section, 'Marcar como vista').trigger('click')
    const home = await openApp('/')
    await buttonByText(home, 'Exportar progreso').trigger('click')
    expect(downloadTextFile).toHaveBeenCalledTimes(1)
    const [fileName, text] = vi.mocked(downloadTextFile).mock.calls[0] as [string, string]
    expect(fileName).toBe('curso-progreso-2026-10-14.json')
    expect(JSON.parse(text).progress.completedSections).toEqual(['2.1'])
    expect(home.text()).toContain('Progreso exportado')
  })

  it('importar sin progreso previo lo aplica directo', async () => {
    installTestServices()
    const home = await openApp('/')
    const file = JSON.stringify({ version: 1, progress: { completedSections: ['2.1', '2.2'], lastSectionId: '2.2' } })
    await chooseFile(home, file)
    await vi.waitFor(() => expect(home.text()).toContain('Progreso importado.'))
    expect(home.text()).toContain('2 de 7 secciones (29 %)')
    expect(home.find('.continue__link').text()).toContain('2.2')
  })

  it('importar con progreso previo pide confirmar el reemplazo', async () => {
    installTestServices()
    const section = await openApp('/seccion/2.5')
    await buttonByText(section, 'Marcar como vista').trigger('click')
    const home = await openApp('/')
    const file = JSON.stringify({ version: 1, progress: { completedSections: ['2.1'], lastSectionId: null } })
    await chooseFile(home, file)
    await vi.waitFor(() => expect(home.find('[role="alertdialog"]').exists()).toBe(true))
    expect(home.text()).toContain('1 de 7 secciones') // todavía el progreso original (2.5)
    await buttonByText(home, 'Sí, reemplazar').trigger('click')
    expect(home.text()).toContain('Progreso importado.')
    expect(home.text()).toContain('1 de 7 secciones (14 %)')
  })

  it('un archivo inválido muestra el error y no cambia nada', async () => {
    installTestServices()
    const home = await openApp('/')
    await chooseFile(home, '{esto no es json')
    await vi.waitFor(() => expect(home.text()).toContain('No se pudo importar'))
    expect(home.text()).not.toContain('Progreso importado')
  })
})

describe('aviso de almacenamiento', () => {
  it('con almacenamiento bloqueado muestra el contenido y avisa que no se guardará (AC-51)', async () => {
    installTestServices(new MemoryStorage(false))
    const section = await openApp('/seccion/2.1')
    expect(section.find('h1').text()).toContain('2.1')
    expect(section.find('.storage-notice').text()).toContain('el progreso no se guardará')
  })

  it('con almacenamiento normal no muestra aviso', async () => {
    installTestServices()
    const home = await openApp('/')
    expect(home.find('.storage-notice').exists()).toBe(false)
  })
})
