<script setup lang="ts">
import { computed, ref } from 'vue'
import { conceptGraph } from '@/content/concepts'
import { courseIndex } from '@/content'
import type { ConceptNode } from '@/logic/concepts/graph'

const selectedId = ref<string | null>(null)
const panel = ref<HTMLElement | null>(null)

const nodesByModule = computed(() =>
  courseIndex.modules.map((module) => ({
    module,
    nodes: conceptGraph.nodes.filter((node) => node.id.startsWith(`${module.id}.`)),
  })),
)

const selected = computed<ConceptNode | undefined>(() => conceptGraph.nodes.find((node) => node.id === selectedId.value))
const links = computed(() => (selected.value ? conceptGraph.linksOf(selected.value.id) : undefined))

const titleOf = (id: string): string => conceptGraph.nodes.find((node) => node.id === id)?.title ?? ''
const isLoaded = (id: string): boolean => courseIndex.hasSection(id)

type Relation = 'selected' | 'prerequisite' | 'dependent' | undefined
function relationOf(id: string): Relation {
  if (id === selectedId.value) return 'selected'
  if (links.value?.prerequisites.includes(id)) return 'prerequisite'
  if (links.value?.dependents.includes(id)) return 'dependent'
  return undefined
}

const RELATION_TEXT: Record<Exclude<Relation, undefined>, string> = {
  selected: 'Elegida',
  prerequisite: 'Prerrequisito',
  dependent: 'La usa',
}

function select(id: string): void {
  selectedId.value = selectedId.value === id ? null : id
  panel.value?.scrollIntoView?.({ block: 'nearest' })
}
</script>

<template>
  <main class="page page--wide">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Mapa de conceptos</h1>
    <p>
      Cada casilla es una sección de la guía. Elegí una para ver de cuáles depende (prerrequisitos) y cuáles la usan.
      Las de líneas punteadas todavía no están cargadas en el curso.
    </p>

    <section ref="panel" class="detail" aria-labelledby="detalle" aria-live="polite">
      <h2 id="detalle">Detalle</h2>
      <p v-if="!selected">No elegiste ninguna sección.</p>
      <template v-else-if="links">
        <p class="detail__title">
          <strong>{{ selected.id }} {{ selected.title }}</strong>
          <RouterLink v-if="isLoaded(selected.id)" :to="{ name: 'section', params: { sectionId: selected.id } }">
            Abrir sección
          </RouterLink>
          <span v-else class="detail__pending">(aún no cargada)</span>
        </p>
        <div class="detail__lists">
          <div>
            <h3>Depende de</h3>
            <ul v-if="links.prerequisites.length > 0">
              <li v-for="id in links.prerequisites" :key="id">
                <RouterLink v-if="isLoaded(id)" :to="{ name: 'section', params: { sectionId: id } }">{{ id }} {{ titleOf(id) }}</RouterLink>
                <template v-else>{{ id }} {{ titleOf(id) }} <span class="detail__pending">(aún no cargada)</span></template>
              </li>
            </ul>
            <p v-else>No depende de otras secciones.</p>
          </div>
          <div>
            <h3>La usan</h3>
            <ul v-if="links.dependents.length > 0">
              <li v-for="id in links.dependents" :key="id">
                <RouterLink v-if="isLoaded(id)" :to="{ name: 'section', params: { sectionId: id } }">{{ id }} {{ titleOf(id) }}</RouterLink>
                <template v-else>{{ id }} {{ titleOf(id) }} <span class="detail__pending">(aún no cargada)</span></template>
              </li>
            </ul>
            <p v-else>Ninguna otra sección la usa.</p>
          </div>
        </div>
      </template>
    </section>

    <section v-for="group in nodesByModule" :key="group.module.id" :aria-labelledby="`modulo-${group.module.id}`">
      <h2 :id="`modulo-${group.module.id}`" class="module-title">Módulo {{ group.module.id }}: {{ group.module.title }}</h2>
      <ul class="nodes">
        <li v-for="node in group.nodes" :key="node.id">
          <button
            type="button"
            class="node"
            :class="[
              { 'node--pending': !isLoaded(node.id) },
              relationOf(node.id) && `node--${relationOf(node.id)}`,
            ]"
            :aria-pressed="selectedId === node.id"
            @click="select(node.id)"
          >
            <span class="node__id">{{ node.id }}</span>
            <span class="node__title">{{ node.title }}</span>
            <span v-if="relationOf(node.id)" class="node__tag">{{ RELATION_TEXT[relationOf(node.id)!] }}</span>
            <span v-if="!isLoaded(node.id)" class="visually-hidden">(aún no cargada)</span>
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page--wide {
  max-width: 72rem;
}

.detail {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.detail h2,
.detail h3 {
  margin: 0 0 0.25rem;
}

.detail h3 {
  font-size: 1rem;
}

.detail__title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  align-items: center;
}

.detail__title a {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-min);
}

.detail__pending {
  color: var(--color-muted);
}

.detail__lists {
  display: grid;
  gap: 0.75rem 2rem;
}

.detail ul {
  margin: 0;
  padding-left: 1.25rem;
}

.detail li a {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-min);
}

.module-title {
  margin: 1.25rem 0 0.5rem;
  font-size: 1.125rem;
}

.nodes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.node {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.5rem;
  align-items: baseline;
  width: 100%;
  min-height: var(--touch-min);
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.node:hover {
  background: var(--color-surface);
}

.node--pending {
  border-style: dashed;
  color: var(--color-muted);
}

.node--selected {
  border-width: 2px;
  border-color: var(--color-accent);
  background: var(--color-salvedad-bg);
}

.node--prerequisite {
  border-width: 2px;
  border-color: var(--series-3);
  background: var(--color-analogy-bg);
}

.node--dependent {
  border-width: 2px;
  border-color: var(--series-2);
  background: var(--color-advertencia-bg);
}

.node__id {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.node__title {
  flex: 1 1 8rem;
  min-width: 0;
}

.node__tag {
  padding: 0 0.4rem;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
}

@media (min-width: 40rem) {
  .detail__lists {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
