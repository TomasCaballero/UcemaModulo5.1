<script setup lang="ts">
import { useUserDataStore } from '@/stores/userData'

const userData = useUserDataStore()
</script>

<template>
  <p v-if="userData.storageWarning" class="storage-notice" role="status">{{ userData.storageWarning }}</p>
</template>

<style scoped>
.storage-notice {
  margin: 0;
  padding: 0.6rem 1rem;
  background: var(--color-advertencia-bg);
  border-bottom: 2px solid var(--color-advertencia-border);
  text-align: center;
}
</style>
