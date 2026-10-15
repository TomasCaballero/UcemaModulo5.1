<script setup lang="ts">
import type { Completion } from '@/logic/progress/progress'

defineProps<{ completion: Completion; label: string }>()
</script>

<template>
  <div class="progress">
    <progress :value="completion.completed" :max="Math.max(completion.total, 1)" :aria-label="label" />
    <span class="progress__text">
      {{ completion.completed }} de {{ completion.total }} secciones ({{ completion.percent }} %)
    </span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

progress {
  width: 100%;
  height: 0.75rem;
  accent-color: var(--color-accent);
}

.progress__text {
  color: var(--color-muted);
  font-size: 0.875rem;
}
</style>
