<script setup lang="ts">
import type { Section } from '@/content/types'

defineProps<{
  sections: Section[]
  currentId?: string
  completedIds?: ReadonlySet<string>
  /** Si se indica, agrega al final el acceso a la autoevaluación de ese módulo. */
  assessmentModuleId?: number
}>()

defineEmits<{ unmark: [sectionId: string] }>()
</script>

<template>
  <ol class="section-index">
    <li v-for="section in sections" :key="section.id" class="section-index__item">
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
      <button
        v-if="completedIds?.has(section.id)"
        type="button"
        class="section-index__unmark"
        @click="$emit('unmark', section.id)"
      >
        Desmarcar<span class="visually-hidden"> la sección {{ section.id }} como no vista</span>
      </button>
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

.section-index__item {
  display: flex;
  align-items: center;
}

.section-index__item a {
  flex: 1;
  min-width: 0;
}

.section-index__unmark {
  min-width: var(--touch-min);
  min-height: var(--touch-min);
  padding: 0 0.6rem;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
}

.section-index__unmark:hover {
  background: var(--color-surface);
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
