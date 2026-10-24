<script setup lang="ts">
import { computed, watch } from 'vue'
import { courseIndex } from '@/content'
import SectionRenderer from '@/components/content/SectionRenderer.vue'
import SectionIndex from '@/components/navigation/SectionIndex.vue'
import SectionPager from '@/components/navigation/SectionPager.vue'
import NotFound from '@/components/navigation/NotFound.vue'
import EndSentinel from '@/components/progress/EndSentinel.vue'
import MarkAsSeen from '@/components/progress/MarkAsSeen.vue'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ sectionId: string }>()

const progress = useProgressStore()
watch(() => props.sectionId, (id) => progress.visit(id), { immediate: true })

const section = computed(() => courseIndex.getSection(props.sectionId))
const module = computed(() => (section.value ? courseIndex.getModule(section.value.moduleId) : undefined))
const moduleSections = computed(() => (section.value ? courseIndex.sectionsOf(section.value.moduleId) : []))
const assessmentModuleId = computed(() =>
  section.value && courseIndex.questionsOf(section.value.moduleId).length > 0 ? section.value.moduleId : undefined,
)
const neighbors = computed(() => courseIndex.neighbors(props.sectionId))
</script>

<template>
  <main v-if="section && module" class="page page--wide">
    <nav aria-label="Ubicación" class="crumbs">
      <RouterLink :to="{ name: 'home' }">Inicio</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink :to="{ name: 'module', params: { moduleId: module.id } }">Módulo {{ module.id }}</RouterLink>
    </nav>

    <div class="layout">
      <!-- Escritorio: barra lateral fija. Celular: menú desplegable. -->
      <nav class="layout__sidebar" :aria-label="`Secciones del módulo ${module.id}`">
        <p class="layout__module">Módulo {{ module.id }}: {{ module.title }}</p>
        <SectionIndex :sections="moduleSections" :current-id="section.id" :completed-ids="progress.completedIds" :assessment-module-id="assessmentModuleId" @unmark="progress.unmarkSectionCompleted" />
      </nav>

      <details class="layout__menu">
        <summary>Secciones del módulo {{ module.id }}</summary>
        <nav :aria-label="`Secciones del módulo ${module.id} (menú)`">
          <SectionIndex :sections="moduleSections" :current-id="section.id" :completed-ids="progress.completedIds" :assessment-module-id="assessmentModuleId" @unmark="progress.unmarkSectionCompleted" />
        </nav>
      </details>

      <article class="layout__content">
        <h1>
          {{ section.id }} {{ section.title }}
          <span v-if="section.optional" class="badge">opcional</span>
        </h1>
        <SectionRenderer :blocks="section.blocks" />
        <!-- `key`: cada sección estrena su marcador de fin, para no heredar el estado de la anterior. -->
        <EndSentinel :key="section.id" @reached="progress.markSectionCompleted(section.id, { auto: true })" />
        <MarkAsSeen :section-id="section.id" />
        <SectionPager :previous="neighbors.previous" :next="neighbors.next" />
      </article>
    </div>
  </main>
  <NotFound v-else :message="`No existe la sección ${sectionId}.`" />
</template>

<style scoped>
.page--wide {
  max-width: 72rem;
}

.crumbs {
  margin-bottom: 0.5rem;
}

.layout__sidebar {
  display: none;
}

.layout__menu {
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.layout__menu summary {
  display: flex;
  align-items: center;
  min-height: var(--touch-min);
  padding: 0 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.layout__menu nav {
  padding: 0 0.5rem 0.5rem;
}

.layout__content {
  min-width: 0;
}

.layout__module {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.badge {
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

@media (min-width: 56rem) {
  .layout {
    display: grid;
    grid-template-columns: 18rem minmax(0, 1fr);
    gap: 2rem;
    align-items: start;
  }

  .layout__sidebar {
    position: sticky;
    top: 1rem;
    display: block;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }

  .layout__menu {
    display: none;
  }
}
</style>
