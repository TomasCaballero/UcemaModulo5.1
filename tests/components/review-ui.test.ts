import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { SeededRandom } from '@/core/random'
import { courseIndex } from '@/content'
import { correctPosition, presentQuestion } from '@/logic/assessment/present'
import { DATA_KEY } from '@/logic/persistence/repository'
import { emptyStoredData, parseStoredData } from '@/logic/persistence/schema'
import type { ReviewItem } from '@/logic/review/scheduler'
import { createAppRouter } from '@/router'
import { provideServices } from '@/services'
import { answerAll, button, startAssessment } from '../helpers/assessment'
import { installTestServices, START_TIME, type TestServices } from '../helpers/services'

const DAY = 24 * 60 * 60 * 1000
let router: ReturnType<typeof createAppRouter>
let services: TestServices

beforeAll(async () => {
  window.scrollTo = () => {}
  await Promise.all([
    import('@/views/AssessmentView.vue'),
    import('@/views/ReviewView.vue'),
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

const item = (questionId: string, dueMs: number): ReviewItem => ({
  questionId,
  box: 0,
  dueAt: new Date(dueMs).toISOString(),
  lastAnsweredAt: new Date(START_TIME - 7 * DAY).toISOString(),
})

function seed(items: ReviewItem[]): void {
  services.storage.set(DATA_KEY, JSON.stringify({ ...emptyStoredData(), reviews: items }))
}

const saved = () => parseStoredData(services.storage.get(DATA_KEY) ?? '')

/** 5 vencidas (q01 la más atrasada) y 2 a futuro. */
const fiveDue = (): ReviewItem[] => [
  ...['m2-q01', 'm2-q02', 'm2-q03', 'm2-q04', 'm2-q05'].map((id, i) => item(id, START_TIME - (5 - i) * DAY)),
  item('m2-q06', START_TIME + DAY),
  item('m2-q07', START_TIME + 3 * DAY),
]

describe('evaluación → repaso', () => {
  it('al terminar una evaluación, las falladas quedan programadas para mañana (RF-38)', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    await answerAll(wrapper, 3)
    const { reviews } = saved()
    expect(reviews.map((r) => r.questionId)).toEqual(['m2-q01', 'm2-q02', 'm2-q03'])
    for (const review of reviews) {
      expect(review.box).toBe(0)
      expect(review.dueAt).toBe(new Date(START_TIME + DAY).toISOString())
    }
  })

  it('una evaluación perfecta no programa nada', async () => {
    const wrapper = await openApp('/modulo/2/evaluacion')
    await startAssessment(wrapper, 70)
    await answerAll(wrapper, 0)
    expect(saved().reviews).toEqual([])
  })
})

describe('inicio', () => {
  it('muestra cuántas preguntas hay para repasar y enlaza al repaso', async () => {
    seed(fiveDue())
    const home = await openApp('/')
    expect(home.find('.review-summary').text()).toContain('Tenés 5 preguntas para repasar.')
    expect(home.find('.review-summary__link').attributes('href')).toBe('/repaso')
  })

  it('usa el singular con una sola pregunta', async () => {
    seed([item('m2-q01', START_TIME - DAY)])
    expect((await openApp('/')).find('.review-summary').text()).toContain('Tenés 1 pregunta para repasar.')
  })

  it('sin preguntas vencidas lo dice y no ofrece empezar', async () => {
    seed([item('m2-q01', START_TIME + DAY)])
    const home = await openApp('/')
    expect(home.find('.review-summary').text()).toContain('No tenés preguntas para repasar ahora.')
    expect(home.find('.review-summary__link').exists()).toBe(false)
  })
})

describe('sesión de repaso', () => {
  it('contiene exactamente las 5 vencidas (AC-39)', async () => {
    seed(fiveDue())
    const wrapper = await openApp('/repaso')
    expect(wrapper.text()).toContain('Tenés 5 preguntas para repasar')
    await button(wrapper, 'Empezar el repaso').trigger('click')
    expect(wrapper.find('h2').text()).toBe('Pregunta 1 de 5')
  })

  it('aciertos suben de caja, errores vuelven a mañana, y al final resume (RF-39)', async () => {
    seed(fiveDue())
    const wrapper = await openApp('/repaso')
    await button(wrapper, 'Empezar el repaso').trigger('click')

    const random = new SeededRandom(2026)
    const due = ['m2-q01', 'm2-q02', 'm2-q03', 'm2-q04', 'm2-q05']
    for (const [i, id] of due.entries()) {
      const question = courseIndex.getQuestion(id)
      if (!question) throw new Error(id)
      const correct = correctPosition(presentQuestion(question, random))
      const choice = i < 2 ? (correct + 1) % 4 : correct // las dos primeras, mal
      await wrapper.findAll('input[type="radio"]')[choice]?.setValue()
      await wrapper.find('form.question').trigger('submit')
      await flushPromises()
      await button(wrapper, i === due.length - 1 ? 'Terminar repaso' : 'Siguiente pregunta').trigger('click')
      await flushPromises()
    }

    expect(wrapper.find('h2').text()).toBe('Repaso terminado')
    expect(wrapper.text()).toContain('Acertaste 3 de 5.')

    const byId = new Map(saved().reviews.map((r) => [r.questionId, r]))
    for (const id of ['m2-q01', 'm2-q02']) {
      expect(byId.get(id)?.box).toBe(0)
      expect(byId.get(id)?.dueAt).toBe(new Date(START_TIME + DAY).toISOString())
    }
    for (const id of ['m2-q03', 'm2-q04', 'm2-q05']) {
      expect(byId.get(id)?.box).toBe(1)
      expect(byId.get(id)?.dueAt).toBe(new Date(START_TIME + 3 * DAY).toISOString())
    }
    expect(byId.get('m2-q06')?.box).toBe(0) // las futuras no se tocan
    expect(wrapper.find('.next-review').text()).toContain('Próximo repaso')
  })

  it('sin preguntas vencidas avisa y muestra la próxima fecha', async () => {
    seed([item('m2-q01', START_TIME + 2 * DAY)])
    const wrapper = await openApp('/repaso')
    expect(wrapper.text()).toContain('No tenés preguntas para repasar ahora.')
    expect(wrapper.findAll('button').map((b) => b.text())).not.toContain('Empezar el repaso')
    expect(wrapper.find('.next-review time').attributes('datetime')).toBe(new Date(START_TIME + 2 * DAY).toISOString())
  })

  it('sin ningún calendario avisa y no muestra próxima fecha', async () => {
    const wrapper = await openApp('/repaso')
    expect(wrapper.text()).toContain('No tenés preguntas para repasar ahora.')
    expect(wrapper.find('.next-review').exists()).toBe(false)
  })

  it('usa el singular y el título propio de la pantalla', async () => {
    seed([item('m2-q01', START_TIME - DAY)])
    const wrapper = await openApp('/repaso')
    expect(wrapper.text()).toContain('Tenés 1 pregunta para repasar')
    expect(document.title).toBe('Repaso · Curso de Estadística, Econometría y Ciencia de Datos')
  })
})
