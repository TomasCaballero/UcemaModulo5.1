<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import SimulationHost from './SimulationHost.vue'

defineProps<{ block: BlockOf<'simulation'> }>()
</script>

<template>
  <SimulationHost :simulation-id="block.simulationId" />
</template>
