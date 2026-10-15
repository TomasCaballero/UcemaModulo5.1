<script setup lang="ts">
import 'katex/dist/katex.min.css'
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{ latex: string; display?: boolean }>()

// KaTeX escapa el texto no matemático; el HTML que devuelve es seguro para v-html.
const html = computed(() =>
  katex.renderToString(props.latex, { displayMode: props.display ?? false, throwOnError: false }),
)
</script>

<template>
  <span :class="display ? 'math-display' : 'math-inline'" v-html="html" />
</template>

<style scoped>
.math-display {
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25rem 0;
}
</style>
