<script setup lang="ts">
import { computed } from 'vue'

/** Punto de un gráfico de grupos: color y forma según el grupo, así no depende solo del color. */
const props = defineProps<{ x: number; y: number; cluster: number | null; radius: number; label?: string }>()

const shape = computed(() => (props.cluster === null ? 0 : props.cluster % 3))
const trianglePoints = computed(() => {
  const { x, y, radius: r } = props
  return `${x},${y - r * 1.25} ${x + r * 1.15},${y + r * 0.9} ${x - r * 1.15},${y + r * 0.9}`
})
const cssClass = computed(() => (props.cluster === null ? 'point point--none' : `point point--${props.cluster % 3}`))
</script>

<template>
  <g :class="cssClass">
    <circle v-if="shape === 0" :cx="x" :cy="y" :r="radius" />
    <rect v-else-if="shape === 1" :x="x - radius" :y="y - radius" :width="radius * 2" :height="radius * 2" rx="0.4" />
    <polygon v-else :points="trianglePoints" />
    <title v-if="label">{{ label }}</title>
  </g>
</template>

<style scoped>
.point {
  stroke: #ffffff;
  stroke-width: 0.5;
}

.point--none {
  fill: var(--viz-neutral-strong);
}

.point--0 {
  fill: var(--series-1);
}

.point--1 {
  fill: var(--series-2);
}

.point--2 {
  fill: var(--series-3);
}
</style>
