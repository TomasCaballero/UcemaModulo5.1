<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'extra'> }>()
</script>

<template>
  <div class="extra" role="note" aria-label="Ejemplo extra">
    <p class="extra__label">Ejemplo extra · no es de la guía</p>
    <p class="extra__text"><RichText :text="block.text" /></p>
  </div>
</template>

<style scoped>
.extra {
  margin: 1rem 0;
  padding: 0.6rem 1rem;
  background: var(--color-bg);
  border: 1px dashed var(--color-muted);
  border-radius: 6px;
}

.extra__label {
  margin: 0 0 0.25rem;
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 700;
}

.extra__text {
  margin: 0;
}
</style>
