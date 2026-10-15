<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import { AsyncMath } from './AsyncMath'

defineProps<{ block: BlockOf<'formula'> }>()
</script>

<template>
  <AsyncMath :latex="block.latex" display />
</template>
