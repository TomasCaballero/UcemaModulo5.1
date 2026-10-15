import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeAll, describe, expect, it } from 'vitest'
import InlineNodes from '@/components/content/InlineNodes.vue'
import SectionRenderer from '@/components/content/SectionRenderer.vue'
import TableBlock from '@/components/content/TableBlock.vue'
import CalloutBlock from '@/components/content/CalloutBlock.vue'
import { courseIndex } from '@/content'
import type { BlockOf, CalloutKind } from '@/content/types'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/seccion/:sectionId', name: 'section', component: { template: '<div />' } },
  ],
})

// KaTeX se carga bajo demanda; se precarga para que flushPromises alcance.
beforeAll(async () => {
  await import('@/components/content/MathInline.vue')
})

const mountOptions = { global: { plugins: [router] } }

async function renderSection(id: string) {
  const section = courseIndex.getSection(id)
  if (!section) throw new Error(`Sección ${id} no encontrada`)
  const wrapper = mount(SectionRenderer, { props: { blocks: section.blocks }, ...mountOptions })
  await flushPromises()
  return wrapper
}

describe('SectionRenderer', () => {
  it('2.5: la fórmula del TLC se renderiza con notación matemática, sin "$" visibles (AC-08)', async () => {
    const wrapper = await renderSection('2.5')
    expect(wrapper.find('.katex-display, .math-display .katex').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('$')
  })

  it('ningún texto del Módulo 2 muestra delimitadores "$" crudos (salvo montos como $2000)', async () => {
    for (const id of ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7']) {
      const withoutAmounts = (await renderSection(id)).text().replace(/\$\d/g, '')
      expect(withoutAmounts, `sección ${id}`).not.toContain('$')
    }
  })

  it('2.3: conserva los montos literales con signo pesos', async () => {
    expect((await renderSection('2.3')).text()).toContain('un salario de $2000 sí es el doble que uno de $1000')
  })

  it('2.1: muestra las cinco definiciones y la analogía de la sopa (AC-54)', async () => {
    const text = (await renderSection('2.1')).text()
    for (const term of ['Población', 'Muestra', 'Variable', 'Parámetro', 'Estadístico']) {
      expect(text).toContain(term)
    }
    expect(text).toContain('cucharada de sopa')
  })

  it('2.2: el ejemplo numérico muestra sus pasos y el resultado s² = 7', async () => {
    const wrapper = await renderSection('2.2')
    const example = wrapper.find('details.example')
    expect(example.exists()).toBe(true)
    expect(example.findAll('ol li')).toHaveLength(2)
    expect(example.find('.example__result').text()).toContain('s2=28/4=7')
  })

  it('2.3: la tabla de Stevens tiene 4 columnas y 4 filas', async () => {
    const table = (await renderSection('2.3')).find('table')
    expect(table.findAll('thead th')).toHaveLength(4)
    expect(table.findAll('tbody tr')).toHaveLength(4)
  })

  it('2.6: muestra la nota "Ojo" y la analogía del aro y la estaca', async () => {
    const wrapper = await renderSection('2.6')
    expect(wrapper.find('.callout--ojo').text()).toContain('Ojo:')
    expect(wrapper.find('blockquote.analogy').text()).toContain('Analogía del aro y la estaca')
  })

  it('2.6: "Módulo 0.5" queda como texto mientras el Módulo 0 no está cargado', async () => {
    const wrapper = await renderSection('2.6')
    expect(wrapper.text()).toContain('Módulo 0.5')
    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})

describe('CalloutBlock', () => {
  it.each<[CalloutKind, string]>([
    ['cuidado', 'Cuidado:'],
    ['ojo', 'Ojo:'],
    ['advertencia', 'Advertencia:'],
    ['salvedad', 'Salvedad:'],
  ])('rotula la nota "%s" con texto, no solo con color', (kind, label) => {
    const wrapper = mount(CalloutBlock, { props: { block: { type: 'callout', kind, text: 'x' } }, ...mountOptions })
    expect(wrapper.find('aside').classes()).toContain(`callout--${kind}`)
    expect(wrapper.find('.callout__label').text()).toBe(label)
  })
})

describe('TableBlock', () => {
  const base: BlockOf<'table'> = { type: 'table', headers: ['A'], rows: [['1']] }

  it('muestra la etiqueta "ilustrativa" solo cuando corresponde (RF-16)', () => {
    const plain = mount(TableBlock, { props: { block: base }, ...mountOptions })
    expect(plain.text()).not.toContain('Ilustrativa')
    const illustrative = mount(TableBlock, { props: { block: { ...base, illustrative: true } }, ...mountOptions })
    expect(illustrative.text()).toContain('Ilustrativa (cifras inventadas)')
  })
})

describe('InlineNodes', () => {
  it('dibuja una referencia como enlace a la sección', async () => {
    const wrapper = mount(InlineNodes, {
      props: { nodes: [{ type: 'ref', sectionId: '0.4', label: 'Módulo 0.4' }] },
      ...mountOptions,
    })
    const link = wrapper.find('a')
    expect(link.text()).toBe('Módulo 0.4')
    expect(link.attributes('href')).toBe('/seccion/0.4')
  })
})
