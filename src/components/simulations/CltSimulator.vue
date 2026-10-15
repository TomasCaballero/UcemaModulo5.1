<script setup lang="ts">
import { computed, ref } from 'vue'
import { SeededRandom } from '@/core/random'
import { usePlayer } from '@/composables/usePlayer'
import {
  displayRange,
  expectedNormalCounts,
  histogram,
  POPULATIONS,
  sampleMeans,
  summarize,
  theoreticalStandardError,
  type PopulationKind,
} from '@/logic/simulations/clt'
import { useReducedMotion } from '@/platform/motion'
import { useServices } from '@/services'
import PlayerControls from './PlayerControls.vue'

const TOTAL_MEANS = 400
const BATCH = 10
const STEPS = TOTAL_MEANS / BATCH
const BINS = 24
const WIDTH = 480
const HEIGHT = 240
const MARGIN = { top: 12, right: 12, bottom: 34, left: 40 }
const SAMPLE_SIZES = [1, 2, 5, 10, 30, 100]

const { random } = useServices()
const drawSeed = (): number => Math.floor(random.next() * 2 ** 31)

const kind = ref<PopulationKind>('skewed')
const n = ref(5)
const seed = ref(drawSeed())

const population = computed(() => POPULATIONS[kind.value])
const means = computed(() => sampleMeans(population.value, n.value, TOTAL_MEANS, new SeededRandom(seed.value)))
const range = computed(() => displayRange(population.value, n.value))
const se = computed(() => theoreticalStandardError(population.value, n.value))

const reducedMotion = useReducedMotion()
// Al cambiar de población, de n o de muestras se vuelve a mostrar el resultado completo.
const player = usePlayer({
  lastStep: computed(() => STEPS),
  restartOn: [kind, n, seed],
  reducedMotion,
  intervalMs: 150,
  showFinalOnResize: true,
})


const revealed = computed(() => means.value.slice(0, player.step.value * BATCH))
const counts = computed(() => histogram(revealed.value, BINS, range.value[0], range.value[1]))
const finalMax = computed(() => Math.max(...histogram(means.value, BINS, range.value[0], range.value[1])))
const expected = computed(() =>
  expectedNormalCounts(population.value.mean, se.value, BINS, range.value[0], range.value[1], revealed.value.length),
)
const yMax = computed(() => Math.max(5, Math.ceil(finalMax.value * 1.15)))
const summary = computed(() => summarize(revealed.value))

const plotWidth = WIDTH - MARGIN.left - MARGIN.right
const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
const barWidth = plotWidth / BINS
const x = (value: number): number => MARGIN.left + ((value - range.value[0]) / (range.value[1] - range.value[0])) * plotWidth
const y = (count: number): number => MARGIN.top + plotHeight - (count / yMax.value) * plotHeight

const xTicks = computed(() =>
  Array.from({ length: 5 }, (_, i) => range.value[0] + ((range.value[1] - range.value[0]) * i) / 4),
)
const yTicks = computed(() => [0, Math.round(yMax.value / 2), yMax.value])
const curve = computed(() =>
  expected.value.map((count, i) => `${i === 0 ? 'M' : 'L'}${MARGIN.left + (i + 0.5) * barWidth},${y(count)}`).join(' '),
)

const fmt = (value: number): string => value.toFixed(3)
const summaryText = computed(() => {
  const s = summary.value
  if (s.count === 0) return 'Todavía no se dibujó ninguna media. Pulsá Reproducir.'
  const spread = s.sd === null ? '' : ` Desviación típica de las medias: ${fmt(s.sd)}.`
  return (
    `Medias dibujadas: ${s.count} de ${TOTAL_MEANS}. Promedio de las medias: ${fmt(s.mean)} (μ = ${fmt(population.value.mean)}).` +
    `${spread} Error estándar teórico σ/√n = ${fmt(se.value)}.`
  )
})
const chartLabel = computed(
  () =>
    `Histograma de ${revealed.value.length} medias muestrales de tamaño ${n.value} de una población ${population.value.label.toLowerCase()}. ` +
    `Con n más grande se parece más a una curva Normal centrada en ${fmt(population.value.mean)}.`,
)
</script>

<template>
  <div class="clt">
    <div class="clt__controls">
      <label>
        Población
        <select v-model="kind">
          <option v-for="item in Object.values(POPULATIONS)" :key="item.kind" :value="item.kind">{{ item.label }}</option>
        </select>
      </label>
      <label>
        Tamaño de muestra (n)
        <select v-model.number="n">
          <option v-for="size in SAMPLE_SIZES" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
      <button type="button" class="button" @click="seed = drawSeed()">Nuevas muestras</button>
    </div>

    <PlayerControls :player="player" :step-label="`${revealed.length} de ${TOTAL_MEANS} medias`" />

    <svg class="clt__chart" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="chartLabel">
      <g class="clt__grid">
        <line v-for="tick in yTicks" :key="`y${tick}`" :x1="MARGIN.left" :x2="WIDTH - MARGIN.right" :y1="y(tick)" :y2="y(tick)" />
      </g>
      <rect
        v-for="(count, i) in counts"
        :key="i"
        class="clt__bar"
        :x="MARGIN.left + i * barWidth + 0.5"
        :y="y(count)"
        :width="barWidth - 1"
        :height="MARGIN.top + plotHeight - y(count)"
        rx="2"
      >
        <title>{{ count }} {{ count === 1 ? 'media' : 'medias' }}</title>
      </rect>
      <path v-if="revealed.length > 0" class="clt__curve" :d="curve" />
      <g class="clt__axis">
        <line :x1="MARGIN.left" :x2="WIDTH - MARGIN.right" :y1="y(0)" :y2="y(0)" />
        <text v-for="tick in xTicks" :key="`x${tick}`" :x="x(tick)" :y="HEIGHT - 16" text-anchor="middle">{{ tick.toFixed(2) }}</text>
        <text v-for="tick in yTicks" :key="`t${tick}`" :x="MARGIN.left - 6" :y="y(tick) + 4" text-anchor="end">{{ tick }}</text>
        <text :x="MARGIN.left + plotWidth / 2" :y="HEIGHT - 2" text-anchor="middle">media de la muestra</text>
      </g>
    </svg>

    <ul class="clt__legend">
      <li><span class="clt__swatch clt__swatch--bar" aria-hidden="true" /> Medias muestrales</li>
      <li><span class="clt__swatch clt__swatch--line" aria-hidden="true" /> Curva Normal teórica N(μ, σ/√n)</li>
    </ul>
    <p class="clt__summary" aria-live="polite">{{ summaryText }}</p>
  </div>
</template>

<style scoped>
.clt__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  align-items: flex-end;
}

.clt__controls label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-weight: 600;
}

.clt__controls select {
  min-height: var(--touch-min);
  padding: 0 0.5rem;
  font: inherit;
  font-weight: 400;
}

.clt__chart {
  display: block;
  width: 100%;
  max-width: 40rem;
  height: auto;
}

.clt__grid line {
  stroke: var(--viz-grid);
  stroke-width: 1;
}

.clt__bar {
  fill: var(--series-1);
}

.clt__curve {
  fill: none;
  stroke: var(--series-2);
  stroke-width: 2;
  stroke-linejoin: round;
}

.clt__axis line {
  stroke: var(--viz-neutral-strong);
  stroke-width: 1;
}

.clt__axis text {
  fill: var(--color-muted);
  font-size: 11px;
}

.clt__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.clt__swatch {
  display: inline-block;
  vertical-align: middle;
}

.clt__swatch--bar {
  width: 0.9rem;
  height: 0.9rem;
  background: var(--series-1);
  border-radius: 2px;
}

.clt__swatch--line {
  width: 1.2rem;
  height: 0;
  border-top: 2px solid var(--series-2);
}

.clt__summary {
  color: var(--color-muted);
  font-size: 0.9375rem;
}
</style>
