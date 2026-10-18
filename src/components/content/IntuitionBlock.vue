<script setup lang="ts">
import { computed } from 'vue'
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

const props = defineProps<{ block: BlockOf<'intuition'> }>()

const paragraphs = computed(() =>
  props.block.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
)
</script>

<template>
  <details class="intuition">
    <summary class="intuition__summary">
      <span class="intuition__badge">💡 En palabras simples</span>
      <span class="intuition__title">{{ block.title || 'Cómo pensarlo sin tecnicismos' }}</span>
      <span class="intuition__chevron" aria-hidden="true">▾</span>
    </summary>
    <div class="intuition__body">
      <p v-for="(p, i) in paragraphs" :key="i" class="intuition__paragraph">
        <RichText :text="p" />
      </p>
    </div>
  </details>
</template>

<style scoped>
.intuition {
  margin: 1.25rem 0;
  border: 1px solid var(--color-border);
  border-left: 5px solid var(--color-accent);
  border-radius: 8px;
  background: var(--color-surface);
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.intuition[open] {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.intuition__summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  min-height: var(--touch-min, 44px);
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
  user-select: none;
}

.intuition__summary::-webkit-details-marker {
  display: none;
}

.intuition__badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  border-radius: 20px;
  letter-spacing: 0.01em;
}

.intuition__title {
  flex: 1;
  min-width: 180px;
  font-size: 0.975rem;
  color: var(--color-text);
}

.intuition__chevron {
  margin-left: auto;
  font-size: 1rem;
  color: var(--color-muted);
  transition: transform 0.2s ease;
}

.intuition[open] .intuition__chevron {
  transform: rotate(180deg);
}

.intuition__body {
  padding: 0.75rem 1.15rem 1.15rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
  font-size: 1rem;
  line-height: 1.65;
}

.intuition__paragraph {
  margin: 0 0 0.85rem;
}

.intuition__paragraph:last-child {
  margin-bottom: 0;
}
</style>
