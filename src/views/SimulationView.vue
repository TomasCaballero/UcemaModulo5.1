<script setup lang="ts">
import { computed } from 'vue'
import NotFound from '@/components/navigation/NotFound.vue'
import SimulationHost from '@/components/simulations/SimulationHost.vue'
import { courseIndex } from '@/content'

const props = defineProps<{ simulationId: string }>()

const meta = computed(() => courseIndex.getSimulation(props.simulationId))
const module = computed(() => (meta.value ? courseIndex.getModule(meta.value.moduleId) : undefined))
</script>

<template>
  <main v-if="meta && module" class="page">
    <nav aria-label="Ubicación">
      <RouterLink :to="{ name: 'home' }">Inicio</RouterLink>
      <span aria-hidden="true"> / </span>
      <RouterLink :to="{ name: 'module', params: { moduleId: module.id } }">Módulo {{ module.id }}</RouterLink>
    </nav>
    <h1>{{ meta.id }} · {{ meta.title }}</h1>
    <SimulationHost :simulation-id="meta.id" :show-title="false" />
    <p>
      Se explica en:
      <template v-for="(sectionId, index) in meta.sectionIds" :key="sectionId">
        <template v-if="index > 0">, </template>
        <RouterLink v-if="courseIndex.hasSection(sectionId)" :to="{ name: 'section', params: { sectionId } }">
          sección {{ sectionId }}
        </RouterLink>
        <template v-else>sección {{ sectionId }}</template>
      </template>
    </p>
  </main>
  <NotFound v-else :message="`No existe la simulación ${simulationId}.`" />
</template>
