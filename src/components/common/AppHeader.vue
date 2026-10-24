<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthButton from '@/components/auth/AuthButton.vue'

const router = useRouter()
const query = ref('')

function search(): void {
  const text = query.value.trim()
  void router.push({ name: 'search', query: text ? { q: text } : {} })
}
</script>

<template>
  <header class="app-header">
    <nav aria-label="Principal" class="app-header__nav">
      <RouterLink :to="{ name: 'home' }">Inicio</RouterLink>
      <RouterLink :to="{ name: 'glossary' }">Glosario</RouterLink>
      <RouterLink :to="{ name: 'synthesis' }">Síntesis</RouterLink>
      <RouterLink :to="{ name: 'concepts' }">Mapa</RouterLink>
      <RouterLink :to="{ name: 'review' }">Repaso</RouterLink>
    </nav>
    <div class="app-header__actions">
      <form role="search" class="app-header__search" @submit.prevent="search">
        <label class="visually-hidden" for="header-search">Buscar en secciones y glosario</label>
        <input id="header-search" v-model="query" type="search" placeholder="Buscar…" autocomplete="off" />
        <button type="submit" class="button">Buscar</button>
      </form>
      <AuthButton />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.app-header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
}

.app-header__nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--touch-min);
  min-height: var(--touch-min);
  font-weight: 600;
}

.app-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.app-header__search {
  display: flex;
  flex: 1 1 12rem;
  gap: 0.5rem;
  max-width: 20rem;
}

.app-header__search input {
  flex: 1;
  min-width: 0;
  min-height: var(--touch-min);
  padding: 0 0.6rem;
  font: inherit;
}
</style>
