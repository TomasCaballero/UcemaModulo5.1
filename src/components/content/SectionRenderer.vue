<script setup lang="ts">
import type { ContentBlock } from '@/content/types'
import { blockComponents } from './blockRegistry'

defineProps<{ blocks: ContentBlock[] }>()
</script>

<template>
  <div class="section-body">
    <template v-for="(block, index) in blocks" :key="index">
      <component :is="blockComponents[block.type]" :block="block" />
    </template>
  </div>
</template>
