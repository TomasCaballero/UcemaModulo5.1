<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AttemptHistory from '@/components/assessment/AttemptHistory.vue'
import QuestionCard from '@/components/assessment/QuestionCard.vue'
import RichText from '@/components/content/RichText.vue'
import NotFound from '@/components/navigation/NotFound.vue'
import { courseIndex } from '@/content'
import { buildAttempt, type AttemptRecord, type QuestionResult } from '@/logic/assessment/attempt'
import { presentQuestion, type PresentedQuestion } from '@/logic/assessment/present'
import { calibration, calibrationMessage, percentOf, VERDICT_TEXT } from '@/logic/assessment/scoring'
import { useServices } from '@/services'
import { useAttemptsStore } from '@/stores/attempts'
import { useReviewStore } from '@/stores/review'

const props = defineProps<{ moduleId: string }>()

type Phase = 'confidence' | 'question' | 'result'

const { clock, random } = useServices()
const attempts = useAttemptsStore()
const review = useReviewStore()

const module = computed(() => courseIndex.getModule(Number(props.moduleId)))
const questions = computed(() => (module.value ? courseIndex.questionsOf(module.value.id) : []))

const phase = ref<Phase>('confidence')
const confidence = ref<number | null>(null)
const presented = ref<PresentedQuestion[]>([])
const results = ref<QuestionResult[]>([])
const index = ref(0)
const answered = ref(false)
const finished = ref<AttemptRecord | undefined>()
const questionHeading = ref<HTMLElement | null>(null)

const confidenceValid = computed(
  () => confidence.value !== null && Number.isInteger(confidence.value) && confidence.value >= 0 && confidence.value <= 100,
)
const current = computed(() => presented.value[index.value])
const isLast = computed(() => index.value === presented.value.length - 1)
const failed = computed(() =>
  (finished.value?.failedQuestionIds ?? []).flatMap((id) => {
    const question = courseIndex.getQuestion(id)
    return question ? [question] : []
  }),
)
const calibrationResult = computed(() =>
  finished.value && finished.value.confidence !== null
    ? calibration(finished.value.confidence, finished.value.correct, finished.value.total)
    : undefined,
)

function start(): void {
  if (!confidenceValid.value) return
  presented.value = questions.value.map((question) => presentQuestion(question, random))
  results.value = []
  index.value = 0
  answered.value = false
  finished.value = undefined
  phase.value = 'question'
}

function onConfirmed(correct: boolean): void {
  const question = current.value?.question
  if (!question) return
  results.value.push({ questionId: question.id, correct })
  answered.value = true
}

async function next(): Promise<void> {
  if (isLast.value) {
    finish()
    return
  }
  index.value++
  answered.value = false
  await nextTick()
  questionHeading.value?.focus()
}

function finish(): void {
  const attempt = buildAttempt({
    moduleId: Number(props.moduleId),
    takenAt: new Date(clock.now()).toISOString(),
    results: results.value,
    confidence: confidence.value,
  })
  attempts.recordAttempt(attempt)
  review.scheduleFailed(attempt.failedQuestionIds)
  finished.value = attempt
  phase.value = 'result'
}

function retry(): void {
  confidence.value = null
  phase.value = 'confidence'
}
</script>

<template>
  <main v-if="module" class="page">
    <nav aria-label="Ubicación">
      <RouterLink :to="{ name: 'home' }">Inicio</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink :to="{ name: 'module', params: { moduleId: module.id } }">Módulo {{ module.id }}</RouterLink>
    </nav>
    <h1>Autoevaluación del Módulo {{ module.id }}</h1>

    <form v-if="phase === 'confidence'" class="confidence" @submit.prevent="start">
      <p>
        Esta evaluación tiene {{ questions.length }} preguntas. Antes de empezar, estimá qué porcentaje esperás
        acertar. Al final te mostramos cuánto difiere de tu resultado.
      </p>
      <label for="confidence-input">Mi estimación (0 a 100 %)</label>
      <input id="confidence-input" v-model.number="confidence" class="confidence__input" type="number" min="0" max="100" step="1" inputmode="numeric" required />
      <button type="submit" class="button" :disabled="!confidenceValid">Empezar</button>
    </form>

    <section v-else-if="phase === 'question' && current" aria-labelledby="question-heading">
      <h2 id="question-heading" ref="questionHeading" tabindex="-1">Pregunta {{ index + 1 }} de {{ presented.length }}</h2>
      <QuestionCard :key="current.question.id" :presented="current" @confirmed="onConfirmed" />
      <p v-if="answered">
        <button type="button" class="button" @click="next">{{ isLast ? 'Ver resultado' : 'Siguiente pregunta' }}</button>
      </p>
    </section>

    <section v-else-if="phase === 'result' && finished" aria-labelledby="result-heading">
      <h2 id="result-heading">Resultado</h2>
      <p class="result__score">{{ finished.correct }}/{{ finished.total }}</p>
      <p>{{ percentOf(finished.correct, finished.total) }} % de aciertos.</p>
      <template v-if="calibrationResult">
        <p class="result__calibration">{{ calibrationMessage(calibrationResult) }}</p>
        <p>{{ VERDICT_TEXT[calibrationResult.verdict] }}</p>
      </template>

      <template v-if="failed.length > 0">
        <h3>Preguntas falladas ({{ failed.length }})</h3>
        <ul class="result__failed">
          <li v-for="question in failed" :key="question.id">
            <p><RichText :text="question.prompt" /></p>
            <p>
              Respuesta correcta: <RichText :text="question.options[question.correctIndex] ?? ''" />
              <br />
              <RouterLink :to="{ name: 'section', params: { sectionId: question.sectionId } }">
                Ver en la guía: sección {{ question.sectionId }}
              </RouterLink>
            </p>
          </li>
        </ul>
      </template>
      <p v-else>¡Sin errores!</p>

      <p class="result__actions">
        <button type="button" class="button" @click="retry">Reintentar</button>
        <RouterLink class="button" :to="{ name: 'module', params: { moduleId: module.id } }">Volver al módulo</RouterLink>
      </p>
    </section>

    <section v-if="attempts.attemptsOf(module.id).length > 0 && phase !== 'question'" aria-labelledby="history-heading">
      <h2 id="history-heading">Historial de intentos</h2>
      <AttemptHistory :attempts="attempts.attemptsOf(module.id)" />
    </section>
  </main>
  <NotFound v-else :message="`No existe el módulo ${moduleId}.`" />
</template>

<style scoped>
.confidence {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.confidence__input {
  width: 8rem;
  min-height: var(--touch-min);
  padding: 0 0.6rem;
  font: inherit;
}

.result__score {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.result__calibration {
  font-weight: 600;
}

.result__failed {
  padding-left: 1.25rem;
}

.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result__actions a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
</style>
