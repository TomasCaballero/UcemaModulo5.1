import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { courseIndex } from '@/content'
import type { ModuleId } from '@/content/types'
import { createAppRouter } from '@/router'
import { provideServices } from '@/services'
import { useAttemptsStore } from '@/stores/attempts'
import { answerAll, button, expectedCorrectPositions, startAssessment } from '../helpers/assessment'
import { installTestServices, type TestServices } from '../helpers/services'

let router: ReturnType<typeof createAppRouter>
let services: TestServices

beforeAll(async () => {
  window.scrollTo = () => {}
  await Promise.all([
    import('@/views/ModuleView.vue'),
    import('@/views/SectionView.vue'),
    import('@/views/AssessmentView.vue'),
    import('@/components/content/MathInline.vue'),
  ])
})

beforeEach(() => {
  services = installTestServices()
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

describe('autoevaluación del Módulo 2', () => {
  it('pide la estimación antes de empezar y no deja empezar con un valor inválido (RF-31)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    expect(wrapper.find('h1').text()).toBe('Autoevaluación del Módulo 2')
    const start = button(wrapper, 'Empezar')
    expect(start.attributes('disabled')).toBeDefined()
    await wrapper.find('#confidence-input').setValue(150)
    expect(button(wrapper, 'Empezar').attributes('disabled')).toBeDefined()
    await wrapper.find('#confidence-input').setValue(90)
    expect(button(wrapper, 'Empezar').attributes('disabled')).toBeUndefined()
  })

  it('9 aciertos de 12: muestra 9/12, las 3 falladas y la descalibración (AC-28, AC-31)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 90)
    expect(wrapper.find('h2').text()).toBe('Pregunta 1 de 12')
    await answerAll(wrapper, 3)

    expect(wrapper.find('.result__score').text()).toBe('9/12')
    expect(wrapper.text()).toContain('75 % de aciertos')
    expect(wrapper.find('.result__calibration').text()).toBe('Estimaste 90 %, obtuviste 75 % (diferencia: 15 puntos)')
    expect(wrapper.text()).toContain('Sobreestimaste')
    expect(wrapper.findAll('.result__failed li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Preguntas falladas (3)')
  })

  it('guarda el intento en el historial con fecha, puntaje y falladas (AC-36)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 60)
    await answerAll(wrapper, 2)
    const [saved] = useAttemptsStore().attemptsOf(2)
    expect(saved).toMatchObject({ moduleId: 2, correct: 10, total: 12, confidence: 60, takenAt: '2026-10-14T12:00:00.000Z' })
    expect(saved?.failedQuestionIds).toEqual(['m2-q01', 'm2-q02'])
    expect(wrapper.find('.history').text()).toContain('10/12 (83 %)')
  })

  it('reintentar empieza un intento nuevo y el anterior queda en el historial (AC-29)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 50)
    await answerAll(wrapper, 4)
    services.clock.advance(60_000)

    await button(wrapper, 'Reintentar').trigger('click')
    expect(wrapper.find('#confidence-input').exists()).toBe(true)
    await startAssessment(wrapper, 80)
    await answerAll(wrapper, 0, 1)

    expect(wrapper.find('.result__score').text()).toBe('12/12')
    expect(wrapper.text()).toContain('¡Sin errores!')
    expect(wrapper.findAll('.history__item').map((i) => i.find('strong').text())).toEqual(['8/12 (67 %)', '12/12 (100 %)'])
  })

  it('una respuesta incorrecta se marca, indica la correcta y explica (AC-26, AC-27)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    const correct = expectedCorrectPositions(2)[0] as number
    await wrapper.findAll('input[type="radio"]')[(correct + 1) % 4]?.setValue()
    await wrapper.find('form.question').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.question__verdict').text()).toBe('Incorrecto')
    expect(wrapper.find('.question__option--correct').text()).toContain('Respuesta correcta')
    expect(wrapper.find('.question__option--wrong').text()).toContain('Tu respuesta')
    expect(wrapper.find('.question__feedback').text()).toContain('Dividir por')
    const link = wrapper.find('.question__feedback a')
    expect(link.text()).toContain('sección 2.2')
    expect(link.attributes('href')).toBe('/seccion/2.2')
  })

  it('una respuesta correcta lo dice', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    await wrapper.findAll('input[type="radio"]')[expectedCorrectPositions(2)[0] as number]?.setValue()
    await wrapper.find('form.question').trigger('submit')
    await flushPromises()
    expect(wrapper.find('.question__verdict').text()).toBe('¡Correcto!')
    expect(wrapper.find('.question__option--wrong').exists()).toBe(false)
  })

  it('no se puede confirmar sin elegir y, confirmada, no se puede cambiar', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    expect(button(wrapper, 'Confirmar').attributes('disabled')).toBeDefined()
    await wrapper.find('form.question').trigger('submit') // Enter sin opción elegida
    await flushPromises()
    expect(wrapper.find('.question__feedback').exists()).toBe(false)

    await wrapper.findAll('input[type="radio"]')[0]?.setValue()
    await wrapper.find('form.question').trigger('submit')
    await flushPromises()
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
  })

  it('usa controles nativos: opciones radio dentro de un formulario con fieldset y legend (AC-50)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    expect(wrapper.find('form.question fieldset legend').exists()).toBe(true)
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios).toHaveLength(4)
    expect(new Set(radios.map((r) => r.attributes('name'))).size).toBe(1)
    expect(button(wrapper, 'Confirmar').attributes('type')).toBe('submit')
  })
})

describe('módulo y acceso a la autoevaluación', () => {
  it('el módulo 2 la ofrece con el índice y el historial en orden cronológico (AC-02, AC-37)', async () => {
    setActivePinia(createPinia())
    const attempts = useAttemptsStore()
    for (const [takenAt, correct] of [['2026-10-16T10:00:00.000Z', 11], ['2026-10-14T10:00:00.000Z', 7], ['2026-10-15T10:00:00.000Z', 9]] as const) {
      attempts.recordAttempt({
        moduleId: 2,
        takenAt,
        correct,
        total: 12,
        failedQuestionIds: Array.from({ length: 12 - correct }, (_, i) => `m2-q${String(i + 1).padStart(2, '0')}`),
        confidence: null,
      })
    }
    const wrapper = await openApp('/modulo/2')
    expect(wrapper.text()).toContain('Hacer la autoevaluación (12 preguntas)')
    expect(wrapper.findAll('.section-index a').at(-1)?.text()).toBe('Autoevaluación')
    expect(wrapper.findAll('.history__item strong').map((s) => s.text())).toEqual([
      '7/12 (58 %)',
      '9/12 (75 %)',
      '11/12 (92 %)',
    ])
  })

  it('todos los módulos ofrecen su autoevaluación con la cantidad de preguntas del banco', async () => {
    for (const moduleId of [0, 1, 3, 4, 5, 6, 7]) {
      const module = await openApp(`/modulo/${moduleId}`)
      expect(module.text(), `Módulo ${moduleId}`).toContain(
        `Hacer la autoevaluación (${courseIndex.questionsOf(moduleId as ModuleId).length} preguntas)`,
      )
    }
  })

  it('las secciones enlazan a la autoevaluación desde el índice', async () => {
    const section = await openApp('/seccion/2.3')
    const links = section.find('nav.layout__sidebar').findAll('a')
    expect(links.at(-1)?.attributes('href')).toBe('/modulo/2/evaluacion')
  })

  it('un módulo inexistente muestra "no encontrado"', async () => {
    expect((await openApp('/modulo/9/evaluacion')).find('h1').text()).toBe('No encontrado')
  })
})

describe('mini-chequeos dentro de las secciones (RF-30)', () => {
  it('2.7 ofrece un mini-chequeo antes de la explicación de los errores Tipo I/II (AC-30)', async () => {
    const wrapper = await openApp('/seccion/2.7')
    const mini = wrapper.find('aside.mini-check')
    expect(mini.exists()).toBe(true)
    expect(mini.text()).toContain('reduce')
    const body = wrapper.find('.section-body').element
    const headings = [...body.querySelectorAll('aside.mini-check, h2')]
    const miniIndex = headings.findIndex((el) => el.matches('aside.mini-check'))
    const errorsIndex = headings.findIndex((el) => el.textContent === 'Errores posibles')
    expect(miniIndex).toBeGreaterThanOrEqual(0)
    expect(miniIndex).toBeLessThan(errorsIndex)
  })

  it('responder el mini-chequeo da el resultado y la explicación, sin enlace a la propia sección', async () => {
    const wrapper = await openApp('/seccion/2.7')
    const mini = wrapper.find('aside.mini-check')
    await mini.findAll('input[type="radio"]')[0]?.setValue()
    await mini.find('form').trigger('submit')
    await flushPromises()
    expect(mini.find('.question__verdict').exists()).toBe(true)
    expect(mini.find('.question__feedback').text()).toContain('equilibrio entre ambos errores')
    expect(mini.find('.question__feedback a').exists()).toBe(false)
  })

  it('las secciones sin mini-chequeo no muestran ninguno', async () => {
    const wrapper = await openApp('/seccion/2.1')
    expect(wrapper.find('aside.mini-check').exists()).toBe(false)
  })
})
