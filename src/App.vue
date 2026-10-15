<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
import StorageNotice from '@/components/common/StorageNotice.vue'
</script>

<template>
  <StorageNotice />
  <AppHeader />
  <RouterView />
</template>
