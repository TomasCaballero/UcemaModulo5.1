<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'workedExample'> }>()
</script>

<template>
  <details class="example">
    <summary class="example__summary"><RichText :text="block.title" /></summary>
    <ol class="example__steps">
      <li v-for="(step, index) in block.steps" :key="index"><RichText :text="step" /></li>
    </ol>
    <p class="example__result"><RichText :text="block.result" /></p>
  </details>
</template>

<style scoped>
.example {
  margin: 1rem 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.example__summary {
  display: block;
  min-height: var(--touch-min);
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.example__steps {
  margin: 0;
  padding: 0 1rem 0 2.25rem;
}

.example__result {
  margin: 0.5rem 0 0;
  padding: 0.6rem 1rem;
  border-top: 1px solid var(--color-border);
  font-weight: 600;
}
</style>
