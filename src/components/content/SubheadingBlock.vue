<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'subheading'> }>()
</script>

<template>
  <h2><RichText :text="block.text" /></h2>
</template>
