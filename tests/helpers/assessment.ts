import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { SeededRandom } from '@/core/random'
import { courseIndex } from '@/content'
import { correctPosition, presentQuestion } from '@/logic/assessment/present'

export function button(wrapper: VueWrapper, text: string) {
  const found = wrapper.findAll('button').find((b) => b.text() === text)
  if (!found) throw new Error(`No hay botón "${text}"`)
  return found
}

/**
 * Posiciones correctas que verá el usuario en el intento número `attempt` (desde 0): la vista
 * consume el mismo azar con semilla, una mezcla por pregunta y por intento.
 */
export function expectedCorrectPositions(moduleId: 2, attempt = 0): number[] {
  const random = new SeededRandom(2026)
  const questions = courseIndex.questionsOf(moduleId)
  for (let skipped = 0; skipped < attempt; skipped++) questions.forEach((q) => presentQuestion(q, random))
  return questions.map((q) => correctPosition(presentQuestion(q, random)))
}

export async function startAssessment(wrapper: VueWrapper, estimate: number): Promise<void> {
  await wrapper.find('#confidence-input').setValue(estimate)
  await wrapper.find('form.confidence').trigger('submit')
  await flushPromises()
}

/** Responde todas las preguntas; las primeras `wrong` a propósito mal. */
export async function answerAll(wrapper: VueWrapper, wrong: number, attempt = 0): Promise<void> {
  const positions = expectedCorrectPositions(2, attempt)
  for (let i = 0; i < positions.length; i++) {
    const correct = positions[i] as number
    const choice = i < wrong ? (correct + 1) % 4 : correct
    await wrapper.findAll('input[type="radio"]')[choice]?.setValue()
    await wrapper.find('form.question').trigger('submit')
    await flushPromises()
    await button(wrapper, i === positions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta').trigger('click')
    await flushPromises()
  }
}
