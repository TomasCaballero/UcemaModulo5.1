<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label: string; min: number; max: number; step: number; unit?: string }>()

const model = defineModel<number>({ required: true })
const id = useId()
</script>

<template>
  <div class="slider">
    <label :for="id">{{ label }}</label>
    <div class="slider__row">
      <input :id="id" v-model.number="model" type="range" :min="min" :max="max" :step="step" />
      <output :for="id" class="slider__value">{{ model }}{{ unit ?? '' }}</output>
    </div>
  </div>
</template>

<style scoped>
.slider {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 12rem;
  flex: 1 1 12rem;
}

.slider__row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

input[type='range'] {
  flex: 1;
  min-height: var(--touch-min);
  accent-color: var(--color-accent);
}

.slider__value {
  min-width: 3.5rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  text-align: right;
}
</style>
