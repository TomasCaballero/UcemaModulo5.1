<script setup lang="ts">
import { computed } from 'vue'
import { courseIndex } from '@/content'
import SectionRenderer from '@/components/content/SectionRenderer.vue'
import SectionIndex from '@/components/navigation/SectionIndex.vue'
import NotFound from '@/components/navigation/NotFound.vue'
import AttemptHistory from '@/components/assessment/AttemptHistory.vue'
import ProgressBar from '@/components/progress/ProgressBar.vue'
import { useAttemptsStore } from '@/stores/attempts'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ moduleId: string }>()

const progress = useProgressStore()
const attempts = useAttemptsStore()
const module = computed(() => courseIndex.getModule(Number(props.moduleId)))
const questionCount = computed(() => (module.value ? courseIndex.questionsOf(module.value.id).length : 0))
const history = computed(() => (module.value ? attempts.attemptsOf(module.value.id) : []))
const simulations = computed(() => (module.value ? courseIndex.simulationsOf(module.value.id) : []))
const sections = computed(() => (module.value ? courseIndex.sectionsOf(module.value.id) : []))
</script>

<template>
  <main v-if="module" class="page">
    <nav aria-label="Ubicación"><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></nav>
    <h1>Módulo {{ module.id }}: {{ module.title }}</h1>
    <ProgressBar :completion="progress.moduleCompletion(module.id)" :label="`Progreso del módulo ${module.id}`" />
    <SectionRenderer v-if="module.intro" :blocks="module.intro" />

    <h2>Secciones</h2>
    <SectionIndex :sections="sections" :completed-ids="progress.completedIds" :assessment-module-id="questionCount > 0 ? module.id : undefined" @unmark="progress.unmarkSectionCompleted" />
    <section v-if="simulations.length > 0" aria-labelledby="simulaciones">
      <h2 id="simulaciones">Simulaciones</h2>
      <ul class="simulation-list">
        <li v-for="simulation in simulations" :key="simulation.id">
          <RouterLink :to="{ name: 'simulation', params: { simulationId: simulation.id } }">
            {{ simulation.id }} · {{ simulation.title }}
          </RouterLink>
        </li>
      </ul>
    </section>
    <section v-if="questionCount > 0" aria-labelledby="evaluacion">
      <h2 id="evaluacion">Autoevaluación</h2>
      <p>
        <RouterLink class="button assessment-link" :to="{ name: 'assessment', params: { moduleId: module.id } }">
          Hacer la autoevaluación ({{ questionCount }} preguntas)
        </RouterLink>
      </p>
      <template v-if="history.length > 0">
        <h3>Historial de puntajes</h3>
        <AttemptHistory :attempts="history" />
      </template>
    </section>
  </main>
  <NotFound v-else :message="`No existe el módulo ${moduleId}.`" />
</template>

<style scoped>
.assessment-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
</style>
