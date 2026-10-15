<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <main class="page">
    <h1>No encontrado</h1>
    <p>{{ message }}</p>
    <p><RouterLink :to="{ name: 'home' }">Volver al inicio</RouterLink></p>
  </main>
</template>
