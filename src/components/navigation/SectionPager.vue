<script setup lang="ts">
import type { Section } from '@/content/types'

defineProps<{ previous?: Section; next?: Section }>()
</script>

<template>
  <nav class="pager" aria-label="Sección anterior y siguiente">
    <RouterLink
      v-if="previous"
      class="pager__link pager__link--previous"
      rel="prev"
      :to="{ name: 'section', params: { sectionId: previous.id } }"
    >
      <span class="pager__direction">← Anterior</span>
      <span>{{ previous.id }} {{ previous.title }}</span>
    </RouterLink>
    <RouterLink
      v-if="next"
      class="pager__link pager__link--next"
      rel="next"
      :to="{ name: 'section', params: { sectionId: next.id } }"
    >
      <span class="pager__direction">Siguiente →</span>
      <span>{{ next.id }} {{ next.title }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.pager {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.pager__link {
  display: flex;
  flex: 1 1 14rem;
  flex-direction: column;
  min-height: var(--touch-min);
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  text-decoration: none;
}

.pager__link:hover {
  background: var(--color-surface);
}

.pager__link--next {
  align-items: flex-end;
  margin-left: auto;
  text-align: right;
}

.pager__direction {
  color: var(--color-muted);
  font-size: 0.875rem;
}
</style>
