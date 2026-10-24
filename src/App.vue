<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import StorageNotice from '@/components/common/StorageNotice.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  void auth.init()
})
</script>

<template>
  <StorageNotice />
  <AppHeader />
  <RouterView />
</template>
