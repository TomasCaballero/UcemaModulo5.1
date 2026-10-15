<script setup lang="ts">
import { computed, ref } from 'vue'
import { SeededRandom } from '@/core/random'
import { usePlayer } from '@/composables/usePlayer'
import {
  chooseInitialCentroids,
  demoBlobs,
  elbowCurve,
  GUIDE_POINTS,
  GUIDE_START_INDEXES,
  kmeansFrames,
  type Point,
} from '@/logic/simulations/kmeans'
import { useReducedMotion } from '@/platform/motion'
import { useServices } from '@/services'
import ClusterPoint from './ClusterPoint.vue'
import PlayerControls from './PlayerControls.vue'

type DatasetKind = 'guide' | 'blobs'

const WIDTH = 400
const HEIGHT = 260
const MARGIN = { top: 14, right: 14, bottom: 30, left: 34 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom
const MAX_K = 6
// Con la paleta validada hay tres grupos distinguibles a la vez (ver tokens --series-*).
const K_OPTIONS = [2, 3]

const { random } = useServices()
const drawSeed = (): number => Math.floor(random.next() * 2 ** 31)

const dataset = ref<DatasetKind>('blobs')
const k = ref(3)
const seed = ref(drawSeed())

const blobs = demoBlobs(new SeededRandom(7))
const points = computed<readonly Point[]>(() => (dataset.value === 'guide' ? GUIDE_POINTS : blobs))
const clusters = computed(() => (dataset.value === 'guide' ? 2 : k.value))
const frames = computed(() => {
  const initial =
    dataset.value === 'guide'
      ? GUIDE_START_INDEXES.map((index) => GUIDE_POINTS[index] as Point)
      : chooseInitialCentroids(blobs, k.value, new SeededRandom(seed.value))
  return kmeansFrames(points.value, initial)
})
const elbow = computed(() => elbowCurve(points.value, MAX_K, new SeededRandom(99)))

const reducedMotion = useReducedMotion()
const player = usePlayer({
  lastStep: computed(() => frames.value.length - 1),
  restartOn: [dataset, k, seed],
  reducedMotion,
  intervalMs: 1000,
})

const frame = computed(() => frames.value[player.step.value] ?? frames.value[0]!)
const isLastFrame = computed(() => player.step.value === frames.value.length - 1)

const bounds = computed(() => {
  const dimension = (index: number): [number, number] => {
    const values = points.value.map((p) => p[index] ?? 0)
    const low = Math.min(...values)
    const high = Math.max(...values)
    const pad = (high - low) * 0.08 || 1
    return [low - pad, high + pad]
  }
  return { x: dimension(0), y: points.value[0]?.length === 2 ? dimension(1) : ([-1, 1] as [number, number]) }
})
const sx = (value: number): number => MARGIN.left + ((value - bounds.value.x[0]) / (bounds.value.x[1] - bounds.value.x[0])) * PLOT_W
const sy = (value: number): number =>
  MARGIN.top + PLOT_H - ((value - bounds.value.y[0]) / (bounds.value.y[1] - bounds.value.y[0])) * PLOT_H
const ticks = (range: [number, number]): number[] => Array.from({ length: 5 }, (_, i) => range[0] + ((range[1] - range[0]) * i) / 4)
const pointY = (point: Point): number => sy(point[1] ?? 0)

const fmt = (value: number): string => value.toFixed(2)
const coords = (point: Point): string => `(${point.map(fmt).join('; ')})`

const phaseText = computed(() => {
  const current = frame.value
  const sseText = current.sse === null ? '' : ` SSE = ${fmt(current.sse)}.`
  if (current.phase === 'init') {
    return dataset.value === 'guide'
      ? 'Centroides iniciales: 1 y 10, los del ejemplo de la guía.'
      : `Centroides iniciales: ${clusters.value} puntos elegidos al azar.`
  }
  if (current.phase === 'assign') {
    return isLastFrame.value
      ? `Las asignaciones ya no cambian: el algoritmo terminó.${sseText}`
      : `Asignar: cada punto va al centroide más cercano.${sseText}`
  }
  return `Recalcular: cada centroide pasa a ser el promedio de sus puntos.${sseText}`
})

const groupRows = computed(() =>
  frame.value.centroids.map((centroid, index) => ({
    index,
    count: frame.value.labels === null ? null : frame.value.labels.filter((label) => label === index).length,
    centroid,
  })),
)

// Gráfico del codo (SSE contra K).
const EW = 360
const EH = 170
const EM = { top: 16, right: 16, bottom: 30, left: 44 }
const elbowMax = computed(() => Math.max(...elbow.value.map((p) => p.sse), 1))
const ex = (kValue: number): number => EM.left + ((kValue - 1) / Math.max(elbow.value.length - 1, 1)) * (EW - EM.left - EM.right)
const ey = (value: number): number => EM.top + (EH - EM.top - EM.bottom) * (1 - value / elbowMax.value)
const elbowPath = computed(() => elbow.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${ex(p.k)},${ey(p.sse)}`).join(' '))

const chartLabel = computed(
  () =>
    `Gráfico de ${points.value.length} puntos con ${clusters.value} centroides. ${phaseText.value} ` +
    `Los grupos se distinguen por color y por forma.`,
)
</script>

<template>
  <div class="kmeans">
    <div class="kmeans__controls">
      <label>
        Datos
        <select v-model="dataset">
          <option value="blobs">Tres grupos en 2D</option>
          <option value="guide">Ejemplo de la guía (1D, K = 2)</option>
        </select>
      </label>
      <label v-if="dataset === 'blobs'">
        Cantidad de grupos (K)
        <select v-model.number="k">
          <option v-for="option in K_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <button v-if="dataset === 'blobs'" type="button" class="button" @click="seed = drawSeed()">
        Nuevos centroides iniciales
      </button>
    </div>

    <PlayerControls :player="player" :step-label="`Paso ${player.step.value} de ${player.state.value.lastStep}`" />
    <p class="kmeans__phase" aria-live="polite">{{ phaseText }}</p>

    <svg class="kmeans__chart" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="chartLabel">
      <g class="kmeans__grid">
        <line v-for="tick in ticks(bounds.x)" :key="`gx${tick}`" :x1="sx(tick)" :x2="sx(tick)" :y1="MARGIN.top" :y2="MARGIN.top + PLOT_H" />
        <line
          v-for="tick in dataset === 'guide' ? [] : ticks(bounds.y)"
          :key="`gy${tick}`"
          :x1="MARGIN.left"
          :x2="WIDTH - MARGIN.right"
          :y1="sy(tick)"
          :y2="sy(tick)"
        />
      </g>
      <g class="kmeans__axis">
        <text v-for="tick in ticks(bounds.x)" :key="`tx${tick}`" :x="sx(tick)" :y="HEIGHT - 10" text-anchor="middle">{{ Math.round(tick * 10) / 10 }}</text>
        <template v-if="dataset === 'blobs'">
          <text v-for="tick in ticks(bounds.y)" :key="`ty${tick}`" :x="MARGIN.left - 6" :y="sy(tick) + 4" text-anchor="end">
            {{ Math.round(tick) }}
          </text>
        </template>
      </g>

      <ClusterPoint
        v-for="(point, index) in points"
        :key="index"
        :x="sx(point[0] ?? 0)"
        :y="dataset === 'guide' ? sy(0) : pointY(point)"
        :cluster="frame.labels ? (frame.labels[index] ?? null) : null"
        :radius="5"
        :label="`Punto ${coords(point)}${frame.labels ? `, grupo ${(frame.labels[index] ?? 0) + 1}` : ''}`"
      />

      <g v-for="(centroid, index) in frame.centroids" :key="`c${index}`" :class="`kmeans__centroid kmeans__centroid--${index % 3}`">
        <path
          class="kmeans__halo"
          :d="`M${sx(centroid[0] ?? 0) - 7},${(dataset === 'guide' ? sy(0) : pointY(centroid)) - 7} l14,14 m0,-14 l-14,14`"
        />
        <path
          class="kmeans__cross"
          :d="`M${sx(centroid[0] ?? 0) - 7},${(dataset === 'guide' ? sy(0) : pointY(centroid)) - 7} l14,14 m0,-14 l-14,14`"
        />
        <text :x="sx(centroid[0] ?? 0) + 10" :y="(dataset === 'guide' ? sy(0) : pointY(centroid)) - 9">C{{ index + 1 }}</text>
        <title>Centroide {{ index + 1 }} {{ coords(centroid) }}</title>
      </g>
    </svg>

    <table class="kmeans__table">
      <caption>Grupos en este paso</caption>
      <thead>
        <tr>
          <th scope="col">Grupo</th>
          <th scope="col">Puntos</th>
          <th scope="col">Centroide</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in groupRows" :key="row.index">
          <th scope="row">
            <svg class="kmeans__swatch" viewBox="-6 -6 12 12" aria-hidden="true">
              <ClusterPoint :x="0" :y="0" :cluster="row.index" :radius="4.5" />
            </svg>
            {{ row.index + 1 }}
          </th>
          <td>{{ row.count ?? '—' }}</td>
          <td>{{ coords(row.centroid) }}</td>
        </tr>
      </tbody>
    </table>

    <p class="kmeans__subtitle"><strong>Método del codo: SSE final según K</strong></p>
    <svg class="kmeans__elbow" :viewBox="`0 0 ${EW} ${EH}`" role="img" :aria-label="`Gráfico del codo: SSE final para K de 1 a ${elbow.length}. ${elbow.map((p) => `K ${p.k}: ${fmt(p.sse)}`).join('; ')}.`">
      <line class="kmeans__elbow-axis" :x1="EM.left" :x2="EW - EM.right" :y1="ey(0)" :y2="ey(0)" />
      <path class="kmeans__elbow-line" :d="elbowPath" />
      <g v-for="item in elbow" :key="item.k">
        <circle
          :class="['kmeans__elbow-dot', { 'is-current': item.k === clusters }]"
          :cx="ex(item.k)"
          :cy="ey(item.sse)"
          :r="item.k === clusters ? 6 : 4.5"
        >
          <title>K = {{ item.k }}: SSE {{ fmt(item.sse) }}</title>
        </circle>
        <text class="kmeans__elbow-text" :x="ex(item.k)" :y="EH - 12" text-anchor="middle">{{ item.k }}</text>
        <text v-if="item.k === clusters || item.k === 1" class="kmeans__elbow-text" :x="ex(item.k) + 8" :y="ey(item.sse) - 8">
          {{ Math.round(item.sse) }}
        </text>
      </g>
      <text class="kmeans__elbow-text" :x="EM.left + (EW - EM.left - EM.right) / 2" :y="EH - 1" text-anchor="middle">K (grupos)</text>
    </svg>
    <p class="kmeans__note">El punto grande marca el K elegido. El SSE siempre baja al aumentar K: se busca el codo, donde la mejora se aplana.</p>
  </div>
</template>

<style scoped>
.kmeans__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  align-items: flex-end;
}

.kmeans__controls label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-weight: 600;
}

.kmeans__controls select {
  min-height: var(--touch-min);
  padding: 0 0.5rem;
  font: inherit;
  font-weight: 400;
}

.kmeans__phase {
  min-height: 3em;
  margin: 0.25rem 0;
  font-weight: 600;
}

.kmeans__chart,
.kmeans__elbow {
  display: block;
  width: 100%;
  max-width: 36rem;
  height: auto;
}

.kmeans__grid line {
  stroke: var(--viz-grid);
  stroke-width: 1;
}

.kmeans__axis text,
.kmeans__elbow-text {
  fill: var(--color-muted);
  font-size: 11px;
}

.kmeans__halo {
  fill: none;
  stroke: #ffffff;
  stroke-width: 6;
  stroke-linecap: round;
}

.kmeans__cross {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
}

.kmeans__centroid text {
  fill: var(--color-text);
  font-size: 11px;
  font-weight: 700;
}

.kmeans__centroid--0 .kmeans__cross {
  stroke: var(--series-1);
}

.kmeans__centroid--1 .kmeans__cross {
  stroke: var(--series-2);
}

.kmeans__centroid--2 .kmeans__cross {
  stroke: var(--series-3);
}

.kmeans__table {
  width: 100%;
  max-width: 36rem;
  margin-top: 0.5rem;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.kmeans__table caption {
  padding-bottom: 0.25rem;
  font-weight: 600;
  text-align: left;
}

.kmeans__table th,
.kmeans__table td {
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.kmeans__swatch {
  width: 0.9rem;
  height: 0.9rem;
  margin-right: 0.4rem;
  vertical-align: middle;
}

.kmeans__subtitle {
  margin: 1rem 0 0.25rem;
}

.kmeans__elbow-axis {
  stroke: var(--viz-neutral-strong);
}

.kmeans__elbow-line {
  fill: none;
  stroke: var(--viz-neutral-strong);
  stroke-width: 2;
}

.kmeans__elbow-dot {
  fill: var(--viz-neutral-strong);
  stroke: #ffffff;
  stroke-width: 2;
}

.kmeans__elbow-dot.is-current {
  fill: var(--series-1);
}

.kmeans__note {
  color: var(--color-muted);
  font-size: 0.9375rem;
}
</style>
