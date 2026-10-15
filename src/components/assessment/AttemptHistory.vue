<script setup lang="ts">
import type { AttemptRecord } from '@/logic/assessment/attempt'
import { percentOf } from '@/logic/assessment/scoring'

defineProps<{ attempts: AttemptRecord[] }>()

const formatDate = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
  <ol class="history">
    <li v-for="(attempt, index) in attempts" :key="index" class="history__item">
      <time :datetime="attempt.takenAt">{{ formatDate.format(new Date(attempt.takenAt)) }}</time>
      <strong class="history__score">{{ attempt.correct }}/{{ attempt.total }} ({{ percentOf(attempt.correct, attempt.total) }} %)</strong>
    </li>
  </ol>
</template>

<style scoped>
.history {
  margin: 0;
  padding: 0;
  list-style: none;
}

.history__item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--color-border);
}
</style>
