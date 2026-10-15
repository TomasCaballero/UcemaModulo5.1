<script setup lang="ts">
import type { Inline } from '@/content/richText'
import { AsyncMath } from './AsyncMath'

defineProps<{ nodes: Inline[] }>()
</script>

<template>
  <template v-for="(node, index) in nodes" :key="index">
    <template v-if="node.type === 'text'">{{ node.value }}</template>
    <strong v-else-if="node.type === 'bold'"><InlineNodes :nodes="node.children" /></strong>
    <em v-else-if="node.type === 'italic'"><InlineNodes :nodes="node.children" /></em>
    <AsyncMath v-else-if="node.type === 'math'" :latex="node.latex" />
    <RouterLink v-else :to="{ name: 'section', params: { sectionId: node.sectionId } }">{{ node.label }}</RouterLink>
  </template>
</template>
