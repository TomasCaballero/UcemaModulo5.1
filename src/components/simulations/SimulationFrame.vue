<script setup lang="ts">
import { useId } from 'vue'
import type { SimulationMeta } from '@/content/types'

withDefaults(defineProps<{ meta: SimulationMeta; showTitle?: boolean }>(), { showTitle: true })

const descriptionId = useId()
</script>

<template>
  <figure class="simulation" role="group" :aria-label="meta.title" :aria-describedby="descriptionId">
    <figcaption v-if="showTitle" class="simulation__title">{{ meta.id }} · {{ meta.title }}</figcaption>
    <p :id="descriptionId" class="simulation__description">{{ meta.description }}</p>
    <slot />
  </figure>
</template>

<style scoped>
.simulation {
  margin: 1.25rem 0;
  padding: 0.75rem 1rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.simulation__title {
  font-weight: 700;
}

.simulation__description {
  margin: 0.25rem 0 0.75rem;
  color: var(--color-muted);
  font-size: 0.9375rem;
}
</style>
