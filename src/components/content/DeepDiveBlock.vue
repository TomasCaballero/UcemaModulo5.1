<script setup lang="ts">
import { computed, useId } from 'vue'
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

const props = defineProps<{ block: BlockOf<'deepDive'> }>()

// Una sección puede tener varias ampliaciones: cada región se nombra con su propio título.
const titleId = useId()

const paragraphs = computed(() =>
  props.block.text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
)
</script>

<template>
  <section class="deep-dive" :aria-labelledby="titleId">
    <p class="deep-dive__label">Ampliación · va más allá de la guía</p>
    <h2 :id="titleId" class="deep-dive__title"><RichText :text="block.title" /></h2>
    <p v-for="(p, i) in paragraphs" :key="i" class="deep-dive__paragraph">
      <RichText :text="p" />
    </p>
    <p class="deep-dive__sources">
      Fuentes:
      <template v-for="(source, i) in block.sources" :key="i">
        <template v-if="i > 0"> · </template>
        <RichText :text="source" />
      </template>
    </p>
  </section>
</template>

<style scoped>
.deep-dive {
  margin: 1.5rem 0;
  padding: 0.9rem 1.15rem 1rem;
  background: var(--color-deepdive-bg);
  border-left: 6px solid var(--color-deepdive-border);
  border-radius: 6px;
  line-height: 1.65;
}

.deep-dive__label {
  margin: 0;
  color: var(--color-deepdive-border);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.deep-dive__title {
  margin: 0.25rem 0 0.75rem;
  font-size: 1.125rem;
}

.deep-dive__paragraph {
  margin: 0 0 0.85rem;
}

.deep-dive__sources {
  margin: 0;
  padding-top: 0.6rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.875rem;
}
</style>
