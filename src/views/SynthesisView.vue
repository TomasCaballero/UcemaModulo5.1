<script setup lang="ts">
import RichText from '@/components/content/RichText.vue'
import GlossaryReferences from '@/components/search/GlossaryReferences.vue'
import { commonErrors, ladder, techniques } from '@/content/data/synthesis'
</script>

<template>
  <main class="page page--wide">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Cuadro síntesis y guía de uso</h1>

    <section aria-labelledby="escalera">
      <h2 id="escalera">La escalera del conocimiento</h2>
      <ol class="ladder">
        <li v-for="level in ladder" :key="level.moduleId" class="ladder__step" :style="{ '--level': level.moduleId }">
          <RouterLink :to="{ name: 'module', params: { moduleId: level.moduleId } }">
            <span class="ladder__number">{{ level.moduleId }}</span>
            <span class="ladder__name">{{ level.name }}</span>
          </RouterLink>
          <span class="ladder__summary">{{ level.summary }}</span>
        </li>
      </ol>
    </section>

    <section aria-labelledby="tecnicas">
      <h2 id="tecnicas">¿Qué técnica uso para qué problema?</h2>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Quiero…</th>
              <th scope="col">Técnicas</th>
              <th scope="col">Módulo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in techniques" :key="row.goal">
              <th scope="row"><RichText :text="row.goal" /></th>
              <td>{{ row.techniques }}</td>
              <td>
                <template v-for="(moduleId, index) in row.modules" :key="moduleId">
                  <template v-if="index > 0">, </template>
                  <RouterLink :to="{ name: 'module', params: { moduleId } }">{{ moduleId }}</RouterLink>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="errores">
      <h2 id="errores">Los errores más comunes (y cómo evitarlos)</h2>
      <ol class="errors">
        <li v-for="error in commonErrors" :key="error.text">
          <RichText :text="error.text" /> <GlossaryReferences :references="error.references" />.
        </li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.page--wide {
  max-width: 60rem;
}

.ladder {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ladder__step {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
  align-items: center;
  margin-bottom: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-left: 6px solid var(--color-accent);
  background: var(--color-surface);
  border-radius: 4px;
}

.ladder__step a {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  min-height: var(--touch-min);
  font-weight: 700;
}

.ladder__number {
  min-width: 1.25rem;
  font-variant-numeric: tabular-nums;
}

.ladder__summary {
  color: var(--color-muted);
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
  overflow-wrap: anywhere;
}

thead th {
  background: var(--color-surface);
}

tbody th {
  font-weight: 400;
}

td a {
  display: inline-block;
  min-width: 1.5rem;
  text-align: center;
}

@media (min-width: 40rem) {
  /* La escalera sube hacia la derecha: más alto, más sangría. */
  .ladder__step {
    margin-left: calc(var(--level) * 1.5rem);
  }
}
</style>
