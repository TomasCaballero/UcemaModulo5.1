<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'list'> }>()
</script>

<template>
  <component :is="block.ordered ? 'ol' : 'ul'">
    <li v-for="(item, index) in block.items" :key="index"><RichText :text="item" /></li>
  </component>
</template>
