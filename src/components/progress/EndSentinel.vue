<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{ reached: [] }>()

const element = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

// Marca el final de la sección: al verse en pantalla, la sección se recorrió (RF-32).
// Sin IntersectionObserver queda el botón "Marcar como vista".
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !element.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      emit('reached')
      observer?.disconnect()
    }
  })
  observer.observe(element.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="element" class="end-sentinel" aria-hidden="true" />
</template>

<style scoped>
.end-sentinel {
  height: 1px;
}
</style>
