<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import QuestionCard from '@/components/assessment/QuestionCard.vue'
import type { Question } from '@/content/types'
import { presentQuestion, type PresentedQuestion } from '@/logic/assessment/present'
import { useServices } from '@/services'
import { useReviewStore } from '@/stores/review'

type Phase = 'intro' | 'question' | 'done'

const { random } = useServices()
const review = useReviewStore()

const phase = ref<Phase>('intro')
const due = ref<Question[]>(review.dueQuestions())
const presented = ref<PresentedQuestion[]>([])
const index = ref(0)
const answered = ref(false)
const correctCount = ref(0)
const heading = ref<HTMLElement | null>(null)

const current = computed(() => presented.value[index.value])
const isLast = computed(() => index.value === presented.value.length - 1)
const nextReview = computed(() => (phase.value === 'done' || due.value.length === 0 ? review.nextReviewAt() : undefined))

const formatDate = new Intl.DateTimeFormat('es', { dateStyle: 'long' })

function start(): void {
  presented.value = due.value.map((question) => presentQuestion(question, random))
  index.value = 0
  correctCount.value = 0
  answered.value = false
  phase.value = 'question'
}

function onConfirmed(correct: boolean): void {
  const question = current.value?.question
  if (!question) return
  review.recordReview(question.id, correct)
  if (correct) correctCount.value++
  answered.value = true
}

async function next(): Promise<void> {
  if (isLast.value) {
    phase.value = 'done'
    return
  }
  index.value++
  answered.value = false
  await nextTick()
  heading.value?.focus()
}
</script>

<template>
  <main class="page">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Repaso</h1>

    <template v-if="phase === 'intro'">
      <template v-if="due.length > 0">
        <p>
          Tenés {{ due.length }} {{ due.length === 1 ? 'pregunta' : 'preguntas' }} para repasar. Las que
          aciertes volverán a aparecer más adelante; las que falles, mañana.
        </p>
        <button type="button" class="button" @click="start">Empezar el repaso</button>
      </template>
      <p v-else>No tenés preguntas para repasar ahora.</p>
    </template>

    <section v-else-if="phase === 'question' && current" aria-labelledby="review-heading">
      <h2 id="review-heading" ref="heading" tabindex="-1">Pregunta {{ index + 1 }} de {{ presented.length }}</h2>
      <QuestionCard :key="current.question.id" :presented="current" @confirmed="onConfirmed" />
      <p v-if="answered">
        <button type="button" class="button" @click="next">{{ isLast ? 'Terminar repaso' : 'Siguiente pregunta' }}</button>
      </p>
    </section>

    <section v-else-if="phase === 'done'" aria-labelledby="done-heading">
      <h2 id="done-heading">Repaso terminado</h2>
      <p class="done__score">Acertaste {{ correctCount }} de {{ presented.length }}.</p>
    </section>

    <p v-if="nextReview" class="next-review">
      Próximo repaso: <time :datetime="nextReview">{{ formatDate.format(new Date(nextReview)) }}</time>.
    </p>
  </main>
</template>

<style scoped>
.done__score {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
