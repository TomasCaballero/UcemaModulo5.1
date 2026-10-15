<script setup lang="ts">
import { courseIndex } from '@/content'
import type { BlockOf } from '@/content/types'
import { presentQuestion, type PresentedQuestion } from '@/logic/assessment/present'
import { useServices } from '@/services'
import QuestionCard from './QuestionCard.vue'

const props = defineProps<{ block: BlockOf<'miniCheck'> }>()

const { random } = useServices()

// Se presentan una sola vez por montaje: las opciones no se reordenan al responder.
const presented: PresentedQuestion[] = props.block.questionIds.flatMap((id) => {
  const question = courseIndex.getQuestion(id)
  return question ? [presentQuestion(question, random)] : []
})
</script>

<template>
  <aside v-if="presented.length > 0" class="mini-check" aria-label="Mini-chequeo">
    <p class="mini-check__title">Mini-chequeo: probá responder antes de seguir leyendo</p>
    <QuestionCard v-for="item in presented" :key="item.question.id" :presented="item" :guide-link="false" />
  </aside>
</template>

<style scoped>
.mini-check {
  margin: 1.25rem 0;
  padding: 0.75rem 1rem;
  background: var(--color-salvedad-bg);
  border: 1px solid var(--color-salvedad-border);
  border-radius: 6px;
}

.mini-check__title {
  margin: 0 0 0.5rem;
  font-weight: 700;
}
</style>
