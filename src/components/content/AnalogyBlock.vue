<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'analogy'> }>()
</script>

<template>
  <blockquote class="analogy"><RichText :text="block.text" /></blockquote>
</template>

<style scoped>
.analogy {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: var(--color-analogy-bg);
  border-left: 6px solid var(--color-analogy-border);
  border-radius: 4px;
}
</style>
