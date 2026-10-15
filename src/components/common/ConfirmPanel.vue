<script setup lang="ts">
defineProps<{ message: string; confirmLabel: string }>()
defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <div class="confirm" role="alertdialog" aria-label="Confirmación">
    <p class="confirm__message">{{ message }}</p>
    <div class="confirm__actions">
      <button type="button" class="button button--danger" @click="$emit('confirm')">{{ confirmLabel }}</button>
      <button type="button" class="button" @click="$emit('cancel')">Cancelar</button>
    </div>
  </div>
</template>

<style scoped>
.confirm {
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  background: var(--color-ojo-bg);
  border: 1px solid var(--color-ojo-border);
  border-radius: 6px;
}

.confirm__message {
  margin: 0 0 0.75rem;
}

.confirm__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
