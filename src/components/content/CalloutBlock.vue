<script setup lang="ts">
import type { BlockOf, CalloutKind } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'callout'> }>()

const LABELS: Record<CalloutKind, string> = {
  cuidado: 'Cuidado',
  ojo: 'Ojo',
  advertencia: 'Advertencia',
  salvedad: 'Salvedad',
}
</script>

<template>
  <aside :class="['callout', `callout--${block.kind}`]">
    <strong class="callout__label">{{ LABELS[block.kind] }}:</strong>
    <RichText :text="block.text" />
  </aside>
</template>

<style scoped>
.callout {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 6px solid;
  border-radius: 4px;
}

.callout--cuidado {
  background: var(--color-cuidado-bg);
  border-color: var(--color-cuidado-border);
}

.callout--ojo {
  background: var(--color-ojo-bg);
  border-color: var(--color-ojo-border);
}

.callout--advertencia {
  background: var(--color-advertencia-bg);
  border-color: var(--color-advertencia-border);
}

.callout--salvedad {
  background: var(--color-salvedad-bg);
  border-color: var(--color-salvedad-border);
}
</style>
