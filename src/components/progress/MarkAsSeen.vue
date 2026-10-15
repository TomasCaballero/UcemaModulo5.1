<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ sectionId: string }>()

const progress = useProgressStore()
const seen = computed(() => progress.isCompleted(props.sectionId))
</script>

<template>
  <div class="mark-seen" aria-live="polite">
    <p v-if="seen" class="mark-seen__done">✓ Sección vista</p>
    <button v-else type="button" class="button" @click="progress.markSectionCompleted(sectionId)">
      Marcar como vista
    </button>
  </div>
</template>

<style scoped>
.mark-seen {
  margin-top: 2rem;
}

.mark-seen__done {
  display: flex;
  align-items: center;
  min-height: var(--touch-min);
  margin: 0;
  font-weight: 600;
}
</style>
