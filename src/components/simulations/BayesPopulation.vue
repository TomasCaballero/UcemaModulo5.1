<script setup lang="ts">
import { computed, ref } from 'vue'
import { bayes, populationCells, type BayesCell } from '@/logic/simulations/bayes'
import ParamSlider from './ParamSlider.vue'

// Porcentajes del ejemplo de la guía (0.2): prevalencia 1 %, sensibilidad 90 %, falsos positivos 5 %.
const prevalence = ref(1)
const sensitivity = ref(90)
const falsePositiveRate = ref(5)

const COLUMNS = 40
const CELL = 10

const result = computed(() =>
  bayes({
    prevalence: prevalence.value / 100,
    sensitivity: sensitivity.value / 100,
    falsePositiveRate: falsePositiveRate.value / 100,
  }),
)
const cells = computed(() => populationCells(result.value))
const rows = computed(() => Math.ceil(cells.value.length / COLUMNS))

const fmt = (value: number): string => (Math.round(value * 10) / 10).toString()
const posteriorText = computed(() =>
  result.value.posterior === null ? 'no se puede calcular (nadie da positivo)' : `${fmt(result.value.posterior * 100)} %`,
)

const legend = computed<{ cell: BayesCell; label: string; count: number }[]>(() => [
  { cell: 'truePositive', label: 'Enfermos con test positivo', count: result.value.truePositives },
  { cell: 'falsePositive', label: 'Sanos con test positivo', count: result.value.falsePositives },
  { cell: 'falseNegative', label: 'Enfermos con test negativo', count: result.value.falseNegatives },
  { cell: 'trueNegative', label: 'Sanos con test negativo', count: result.value.trueNegatives },
])

const summary = computed(
  () =>
    `Hay ${fmt(result.value.positives)} personas con test positivo de ${result.value.population}: ` +
    `${fmt(result.value.truePositives)} enfermas y ${fmt(result.value.falsePositives)} sanas. ` +
    `Si das positivo, la probabilidad de estar enfermo es ${posteriorText.value}.`,
)
</script>

<template>
  <div class="bayes">
    <div class="bayes__controls">
      <ParamSlider v-model="prevalence" label="Prevalencia (personas enfermas)" :min="0" :max="50" :step="0.5" unit=" %" />
      <ParamSlider v-model="sensitivity" label="Sensibilidad (enfermos que dan positivo)" :min="0" :max="100" :step="1" unit=" %" />
      <ParamSlider v-model="falsePositiveRate" label="Falsos positivos (sanos que dan positivo)" :min="0" :max="50" :step="0.5" unit=" %" />
    </div>

    <p class="bayes__result" aria-live="polite">
      P(enfermo | +) = <strong class="bayes__posterior">{{ posteriorText }}</strong>
    </p>

    <svg
      class="bayes__chart"
      :viewBox="`0 0 ${COLUMNS * CELL} ${rows * CELL}`"
      role="img"
      :aria-label="`1000 personas dibujadas como cuadritos. ${summary}`"
    >
      <rect
        v-for="(cell, index) in cells"
        :key="index"
        :class="['bayes__cell', `bayes__cell--${cell}`]"
        :x="(index % COLUMNS) * CELL"
        :y="Math.floor(index / COLUMNS) * CELL"
        :width="CELL - 2"
        :height="CELL - 2"
        rx="1.5"
      />
    </svg>

    <ul class="bayes__legend">
      <li v-for="item in legend" :key="item.cell">
        <svg class="bayes__swatch" viewBox="0 0 10 10" aria-hidden="true">
          <rect :class="['bayes__cell', `bayes__cell--${item.cell}`]" width="10" height="10" rx="1.5" />
        </svg>
        {{ item.label }}: <strong>{{ fmt(item.count) }}</strong>
      </li>
    </ul>
    <p class="bayes__summary">{{ summary }}</p>
  </div>
</template>

<style scoped>
.bayes__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}

.bayes__result {
  margin: 0.5rem 0;
  font-size: 1.25rem;
}

.bayes__chart {
  display: block;
  width: 100%;
  max-width: 40rem;
  height: auto;
}

.bayes__cell--truePositive {
  fill: var(--series-1);
}

.bayes__cell--falsePositive {
  fill: var(--series-2);
}

.bayes__cell--falseNegative {
  fill: var(--series-3);
}

.bayes__cell--trueNegative {
  fill: var(--viz-neutral);
}

.bayes__legend {
  display: grid;
  gap: 0.25rem 1.5rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}

.bayes__legend li {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.bayes__swatch {
  flex: none;
  width: 0.9rem;
  height: 0.9rem;
}

.bayes__summary {
  color: var(--color-muted);
  font-size: 0.9375rem;
}

@media (min-width: 40rem) {
  .bayes__legend {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
