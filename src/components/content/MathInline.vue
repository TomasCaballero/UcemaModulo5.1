<script setup lang="ts">
import 'katex/dist/katex.min.css'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import katex from 'katex'

const props = defineProps<{ latex: string; display?: boolean }>()

// KaTeX escapa el texto no matemático; el HTML que devuelve es seguro para v-html.
const html = computed(() =>
  katex.renderToString(props.latex, { displayMode: props.display ?? false, throwOnError: false }),
)

// Una fórmula en bloque más ancha que la pantalla se desplaza: para que también se pueda
// recorrer con teclado, solo entonces recibe foco (así no suma paradas de tabulación de más).
const element = ref<HTMLElement | null>(null)
const scrolls = ref(false)
let observer: ResizeObserver | undefined

function measure(): void {
  const target = element.value
  scrolls.value = !!props.display && !!target && target.scrollWidth > target.clientWidth
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && element.value) {
    observer = new ResizeObserver(measure)
    observer.observe(element.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <span
    ref="element"
    :class="display ? 'math-display' : 'math-inline'"
    :tabindex="scrolls ? 0 : undefined"
    :role="scrolls ? 'group' : undefined"
    :aria-label="scrolls ? 'Fórmula (se desplaza horizontalmente)' : undefined"
    v-html="html"
  />
</template>

<style scoped>
.math-display {
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25rem 0;
}
</style>
