<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RichText from '@/components/content/RichText.vue'
import GlossaryReferences from '@/components/search/GlossaryReferences.vue'
import { courseContent } from '@/content'
import { filterGlossary } from '@/logic/search/filter'

const route = useRoute()
const router = useRouter()

const fromRoute = (): string => (typeof route.query.q === 'string' ? route.query.q : '')
const query = ref(fromRoute())

// El filtro vive en la URL: se puede enlazar (desde los resultados de búsqueda) y sobrevive a recargar.
watch(() => route.query.q, () => (query.value = fromRoute()))
watch(query, (text) => void router.replace({ name: 'glossary', query: text ? { q: text } : {} }))

const entries = computed(() => filterGlossary(courseContent.glossary, query.value))
</script>

<template>
  <main class="page">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Glosario</h1>
    <p>Los números entre paréntesis indican dónde se explica cada término.</p>

    <label for="glossary-filter">Filtrar términos</label>
    <input id="glossary-filter" v-model="query" class="filter" type="search" autocomplete="off" />
    <p role="status" class="count">
      {{
        entries.length === 0
          ? 'No hay términos que coincidan.'
          : `${entries.length} de ${courseContent.glossary.length} términos`
      }}
    </p>

    <dl class="glossary">
      <div v-for="entry in entries" :key="entry.term" class="glossary__entry">
        <dt><strong><RichText :text="entry.term" /></strong></dt>
        <dd><RichText :text="entry.definition" /> <GlossaryReferences :references="entry.references" /></dd>
      </div>
    </dl>
  </main>
</template>

<style scoped>
.filter {
  display: block;
  width: 100%;
  max-width: 24rem;
  min-height: var(--touch-min);
  margin-top: 0.25rem;
  padding: 0 0.6rem;
  font: inherit;
}

.count {
  color: var(--color-muted);
}

.glossary {
  margin: 0;
}

.glossary__entry {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}

dd {
  margin: 0.15rem 0 0;
}
</style>
