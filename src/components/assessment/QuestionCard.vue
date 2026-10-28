<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import RichText from '@/components/content/RichText.vue'
import { richTextToReadable } from '@/content/plainText'
import { correctPosition, isCorrectChoice, type PresentedQuestion } from '@/logic/assessment/present'

const props = withDefaults(defineProps<{ presented: PresentedQuestion; guideLink?: boolean }>(), { guideLink: true })
const emit = defineEmits<{ confirmed: [correct: boolean] }>()

const groupName = useId()
const selected = ref<number | null>(null)
const confirmed = ref(false)
const feedback = ref<HTMLElement | null>(null)

const correct = computed(() => selected.value !== null && isCorrectChoice(props.presented, selected.value))
const answerPosition = computed(() => correctPosition(props.presented))

async function confirm(): Promise<void> {
  if (selected.value === null || confirmed.value) return
  confirmed.value = true
  emit('confirmed', correct.value)
  await nextTick()
  feedback.value?.focus()
}

// Una opción con fórmulas se nombra con su versión legible: el texto de KaTeX no cuenta como rótulo
// para todas las tecnologías de asistencia. Las opciones de solo texto conservan el rótulo nativo.
function optionLabel(text: string): string | undefined {
  return text.includes('$') ? richTextToReadable(text) : undefined
}

function optionState(position: number): 'correct' | 'wrong' | undefined {
  if (!confirmed.value) return undefined
  if (position === answerPosition.value) return 'correct'
  return position === selected.value ? 'wrong' : undefined
}
</script>

<template>
  <form class="question" @submit.prevent="confirm">
    <fieldset :disabled="confirmed">
      <legend class="question__prompt"><RichText :text="presented.question.prompt" /></legend>
      <label
        v-for="(option, position) in presented.options"
        :key="option.originalIndex"
        class="question__option"
        :class="optionState(position) && `question__option--${optionState(position)}`"
      >
        <input v-model="selected" type="radio" :name="groupName" :value="position" :aria-label="optionLabel(option.text)" />
        <span class="question__text">
          <RichText :text="option.text" />
          <strong v-if="optionState(position) === 'correct'" class="question__tag"> — Respuesta correcta</strong>
          <strong v-else-if="optionState(position) === 'wrong'" class="question__tag"> — Tu respuesta</strong>
        </span>
      </label>
    </fieldset>

    <button v-if="!confirmed" type="submit" class="button" :disabled="selected === null">Confirmar</button>

    <div v-if="confirmed" ref="feedback" class="question__feedback" tabindex="-1" aria-live="polite">
      <p class="question__verdict">{{ correct ? '¡Correcto!' : 'Incorrecto' }}</p>
      <p><RichText :text="presented.question.explanation" /></p>
      <p v-if="guideLink">
        <RouterLink :to="{ name: 'section', params: { sectionId: presented.question.sectionId } }">
          Ver en la guía: sección {{ presented.question.sectionId }}
        </RouterLink>
      </p>
    </div>
  </form>
</template>

<style scoped>
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.question__prompt {
  margin-bottom: 0.5rem;
  padding: 0;
  font-weight: 600;
}

.question__option {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  min-height: var(--touch-min);
  margin-bottom: 0.4rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
}

.question__option input {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.2rem;
}

.question__option--correct {
  background: var(--color-analogy-bg);
  border-color: var(--color-analogy-border);
}

.question__option--wrong {
  background: var(--color-ojo-bg);
  border-color: var(--color-ojo-border);
}

.question__text {
  min-width: 0;
}

.question__feedback {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border-radius: 6px;
}

.question__verdict {
  margin: 0 0 0.25rem;
  font-weight: 700;
}
</style>
