<script setup lang="ts">
import { courseIndex } from '@/content'
import type { GlossaryReference } from '@/content/types'

defineProps<{ references: GlossaryReference[] }>()

/** Una referencia con "." es una sección; sin ".", un módulo entero. */
const isSection = (reference: string): boolean => reference.includes('.')
</script>

<template>
  <span class="references">
    <span aria-hidden="true">(</span>
    <template v-for="(reference, index) in references" :key="reference">
      <template v-if="index > 0">, </template>
      <RouterLink
        v-if="isSection(reference) && courseIndex.hasSection(reference)"
        :to="{ name: 'section', params: { sectionId: reference } }"
      >
        <span class="visually-hidden">sección </span>{{ reference }}
      </RouterLink>
      <RouterLink v-else-if="!isSection(reference)" :to="{ name: 'module', params: { moduleId: reference } }">
        Módulo {{ reference }}
      </RouterLink>
      <template v-else>{{ reference }}</template>
    </template>
    <span aria-hidden="true">)</span>
  </span>
</template>

<style scoped>
.references a {
  display: inline-block;
  min-height: 1.5rem;
}
</style>
