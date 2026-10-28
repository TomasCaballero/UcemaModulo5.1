<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'recall'> }>()
</script>

<template>
  <section class="recall" aria-label="Antes de seguir, ¿te acordás?">
    <p class="recall__label">Antes de seguir, ¿te acordás?</p>
    <p class="recall__hint">Intentá responder cada una de memoria antes de abrirla.</p>
    <details v-for="(item, i) in block.items" :key="i" class="recall__item">
      <summary class="recall__question">
        <span class="recall__question-text"><RichText :text="item.question" /></span>
        <span class="recall__chevron" aria-hidden="true">▾</span>
      </summary>
      <p class="recall__answer"><RichText :text="item.answer" /></p>
    </details>
  </section>
</template>

<style scoped>
.recall {
  margin: 0 0 1.5rem;
  padding: 0.8rem 1rem 0.9rem;
  background: var(--color-recall-bg);
  border-left: 6px solid var(--color-recall-border);
  border-radius: 6px;
}

.recall__label {
  margin: 0;
  color: var(--color-recall-border);
  font-weight: 700;
}

.recall__hint {
  margin: 0.1rem 0 0.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.recall__item {
  border-top: 1px solid var(--color-border);
}

.recall__question {
  display: flex;
  align-items: center;
  min-height: var(--touch-min, 44px);
  padding: 0.35rem 0;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

.recall__question::-webkit-details-marker {
  display: none;
}

.recall__question-text {
  flex: 1;
}

.recall__chevron {
  color: var(--color-recall-border);
  transition: transform 0.2s ease;
}

.recall__item[open] .recall__chevron {
  transform: rotate(180deg);
}

.recall__answer {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.8rem;
  background: var(--color-bg);
  border-radius: 4px;
}
</style>
