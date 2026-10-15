<script setup lang="ts">
import { useReviewStore } from '@/stores/review'

const review = useReviewStore()

// Se calcula al montar: el reloj no es reactivo y el conteo se actualiza al volver al inicio.
const dueCount = review.dueQuestions().length
</script>

<template>
  <section aria-labelledby="repaso" class="review-summary">
    <h2 id="repaso">Repaso</h2>
    <p v-if="dueCount > 0">
      Tenés <strong>{{ dueCount }}</strong> {{ dueCount === 1 ? 'pregunta' : 'preguntas' }} para repasar.
    </p>
    <p v-else>No tenés preguntas para repasar ahora.</p>
    <p v-if="dueCount > 0">
      <RouterLink class="button review-summary__link" :to="{ name: 'review' }">Empezar el repaso</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.review-summary__link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
</style>
