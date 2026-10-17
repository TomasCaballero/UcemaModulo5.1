<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GlossaryReferences from '@/components/search/GlossaryReferences.vue'
import HighlightedText from '@/components/search/HighlightedText.vue'
import { courseSearch } from '@/content/search'
import type { GlossaryResult, SectionResult } from '@/logic/search/engine'

const route = useRoute()
const router = useRouter()

const fromRoute = (): string => (typeof route.query.q === 'string' ? route.query.q : '')
const query = ref(fromRoute())

watch(() => route.query.q, () => (query.value = fromRoute()))
watch(query, (text) => void router.replace({ name: 'search', query: text ? { q: text } : {} }))

const results = computed(() => courseSearch.search(query.value))
const glossaryResults = computed(() => results.value.filter((r): r is GlossaryResult => r.kind === 'glossary'))
const sectionResults = computed(() => results.value.filter((r): r is SectionResult => r.kind === 'section'))
const searched = computed(() => query.value.trim().length > 0)
</script>

<template>
  <main class="page">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Búsqueda</h1>

    <label for="search-input">Buscar en secciones y glosario</label>
    <input id="search-input" v-model="query" class="search-input" type="search" autocomplete="off" />

    <p role="status" class="status">
      <template v-if="!searched">Escribí una palabra o dos para buscar.</template>
      <template v-else-if="results.length === 0">No hay resultados para «{{ query.trim() }}».</template>
      <template v-else>{{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }}</template>
    </p>

    <section v-if="glossaryResults.length > 0" aria-labelledby="glosario-resultados">
      <h2 id="glosario-resultados">Glosario ({{ glossaryResults.length }})</h2>
      <ul class="results">
        <li v-for="result in glossaryResults" :key="result.term" class="results__item">
          <RouterLink :to="{ name: 'glossary', query: { q: result.term } }">
            <strong><HighlightedText :segments="result.heading" /></strong>
          </RouterLink>
          <p><HighlightedText :segments="result.snippet" /> <GlossaryReferences :references="result.references" /></p>
        </li>
      </ul>
    </section>

    <section v-if="sectionResults.length > 0" aria-labelledby="secciones-resultados">
      <h2 id="secciones-resultados">Secciones ({{ sectionResults.length }})</h2>
      <ul class="results">
        <li v-for="result in sectionResults" :key="result.sectionId" class="results__item">
          <RouterLink :to="{ name: 'section', params: { sectionId: result.sectionId } }">
            <strong><HighlightedText :segments="result.heading" /></strong>
          </RouterLink>
          <p><HighlightedText :segments="result.snippet" /></p>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.search-input {
  display: block;
  width: 100%;
  max-width: 28rem;
  min-height: var(--touch-min);
  margin-top: 0.25rem;
  padding: 0 0.6rem;
  font: inherit;
}

.status {
  color: var(--color-muted);
}

.results {
  margin: 0;
  padding: 0;
  list-style: none;
}

.results__item {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.results__item a {
  display: inline-flex;
  align-items: center;
  min-width: var(--touch-min);
  min-height: var(--touch-min);
}

.results__item p {
  margin: 0;
}
</style>
