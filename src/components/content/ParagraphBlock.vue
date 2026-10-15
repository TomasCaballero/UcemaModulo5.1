<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'paragraph'> }>()
</script>

<template>
  <p><RichText :text="block.text" /></p>
</template>
