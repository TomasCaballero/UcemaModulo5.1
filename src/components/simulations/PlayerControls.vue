<script setup lang="ts">
import type { Player } from '@/composables/usePlayer'

defineProps<{ player: Player; stepLabel?: string }>()
</script>

<template>
  <div class="player">
    <template v-if="player.animated.value">
      <button v-if="!player.isPlaying.value" type="button" class="button" @click="player.play()">Reproducir</button>
      <button v-else type="button" class="button" @click="player.pause()">Pausar</button>
      <button type="button" class="button" @click="player.reset()">Reiniciar</button>
      <span class="player__step">{{ stepLabel ?? `Paso ${player.step.value} de ${player.state.value.lastStep}` }}</span>
    </template>
    <p v-else class="player__static">
      Tenés activada la preferencia "reducir movimiento": no hay animación, se muestra el resultado final.
    </p>
  </div>
</template>

<style scoped>
.player {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin: 0.5rem 0;
}

.player__step {
  color: var(--color-muted);
  font-size: 0.9375rem;
}

.player__static {
  margin: 0;
  color: var(--color-muted);
}
</style>
