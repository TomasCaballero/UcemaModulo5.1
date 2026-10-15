<script setup lang="ts">
import { computed } from 'vue'
import { courseIndex } from '@/content'
import { parseRichText } from '@/content/richText'
import InlineNodes from './InlineNodes.vue'

const props = defineProps<{ text: string }>()

const nodes = computed(() => parseRichText(props.text, courseIndex.hasSection))
</script>

<template>
  <InlineNodes :nodes="nodes" />
</template>
