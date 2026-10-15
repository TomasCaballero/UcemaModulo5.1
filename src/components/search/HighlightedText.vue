<script setup lang="ts">
import type { Segment } from '@/logic/search/normalize'

defineProps<{ segments: Segment[] }>()
</script>

<template>
  <template v-for="(segment, index) in segments" :key="index">
    <mark v-if="segment.match">{{ segment.text }}</mark>
    <template v-else>{{ segment.text }}</template>
  </template>
</template>

<style scoped>
mark {
  background: var(--color-advertencia-bg);
  color: inherit;
  outline: 1px solid var(--color-advertencia-border);
}
</style>
