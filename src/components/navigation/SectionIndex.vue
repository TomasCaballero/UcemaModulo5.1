<script setup lang="ts">
import type { Section } from '@/content/types'

defineProps<{
  sections: Section[]
  currentId?: string
  completedIds?: ReadonlySet<string>
  /** Si se indica, agrega al final el acceso a la autoevaluación de ese módulo. */
  assessmentModuleId?: number
}>()
</script>

<template>
  <ol class="section-index">
    <li v-for="section in sections" :key="section.id">
      <RouterLink
        :to="{ name: 'section', params: { sectionId: section.id } }"
        :aria-current="section.id === currentId ? 'page' : undefined"
        :class="{ 'is-current': section.id === currentId }"
      >
        <span class="section-index__id">{{ section.id }}</span>
        <span class="section-index__title">{{ section.title }}</span>
        <template v-if="completedIds?.has(section.id)">
          <span aria-hidden="true">✓</span>
          <span class="visually-hidden">(vista)</span>
        </template>
      </RouterLink>
    </li>
    <li v-if="assessmentModuleId !== undefined">
      <RouterLink :to="{ name: 'assessment', params: { moduleId: assessmentModuleId } }" class="section-index__assessment">
        <span class="section-index__title">Autoevaluación</span>
      </RouterLink>
    </li>
  </ol>
</template>

<style scoped>
.section-index {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  min-height: var(--touch-min);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  color: var(--color-text);
  text-decoration: none;
}

a:hover {
  background: var(--color-surface);
}

a.is-current {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-weight: 600;
}

.section-index__id {
  min-width: 2.25rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.section-index__title {
  flex: 1;
}
</style>
