<script setup lang="ts">
import RichText from '@/components/content/RichText.vue'
import DataManagement from '@/components/progress/DataManagement.vue'
import ProgressBar from '@/components/progress/ProgressBar.vue'
import ReviewSummary from '@/components/progress/ReviewSummary.vue'
import { courseIndex, studyAdvice } from '@/content'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()
</script>

<template>
  <main class="page">
    <h1>Curso de Estadística, Econometría y Ciencia de Datos</h1>

    <p v-if="progress.continueSection" class="continue">
      <RouterLink
        class="button continue__link"
        :to="{ name: 'section', params: { sectionId: progress.continueSection.id } }"
      >
        Continuar: {{ progress.continueSection.id }} {{ progress.continueSection.title }}
      </RouterLink>
    </p>

    <ProgressBar :completion="progress.overall" label="Progreso total del curso" />

    <ReviewSummary />

    <section aria-labelledby="como-estudiar">
      <h2 id="como-estudiar">Cómo estudiar con esta guía</h2>
      <ol>
        <li v-for="(advice, index) in studyAdvice" :key="index"><RichText :text="advice" /></li>
      </ol>
    </section>

    <section aria-labelledby="modulos">
      <h2 id="modulos">Módulos</h2>
      <ol class="modules">
        <li v-for="module in courseIndex.modules" :key="module.id" class="module-card">
          <RouterLink class="module-card__link" :to="{ name: 'module', params: { moduleId: module.id } }">
            <span class="module-card__number">Módulo {{ module.id }}</span>
            <span class="module-card__title">{{ module.title }}</span>
            <span class="module-card__summary">{{ module.summary }}</span>
          </RouterLink>
          <ProgressBar :completion="progress.moduleCompletion(module.id)" :label="`Progreso del módulo ${module.id}`" />
        </li>
      </ol>
    </section>

    <DataManagement />
  </main>
</template>

<style scoped>
.continue__link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.modules {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.module-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.module-card__link {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: var(--touch-min);
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  text-decoration: none;
}

.module-card__link:hover {
  background: var(--color-surface);
}

.module-card__number {
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 600;
}

.module-card__title {
  font-size: 1.125rem;
  font-weight: 600;
}

.module-card__summary {
  color: var(--color-muted);
  font-size: 0.9375rem;
}

@media (min-width: 40rem) {
  .modules {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
