<script setup lang="ts">
import { computed } from 'vue'
import { courseIndex } from '@/content'
import SimulationFrame from './SimulationFrame.vue'
import { simulationComponent } from './registry'

const props = withDefaults(defineProps<{ simulationId: string; showTitle?: boolean }>(), { showTitle: true })

const meta = computed(() => courseIndex.getSimulation(props.simulationId))
const component = computed(() => simulationComponent(props.simulationId))
</script>

<template>
  <SimulationFrame v-if="meta && component" :meta="meta" :show-title="showTitle">
    <component :is="component" />
  </SimulationFrame>
  <p v-else class="simulation-note" role="alert">La simulación {{ simulationId }} todavía no está disponible.</p>
</template>
