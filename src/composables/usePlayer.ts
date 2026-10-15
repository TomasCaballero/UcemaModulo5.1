import { computed, onBeforeUnmount, ref, watch, type Ref, type WatchSource } from 'vue'
import { createPlayer, finish, pause, play, reset, resize, tick, type PlayerState } from '@/logic/animation/player'

export interface PlayerOptions {
  /** Cantidad de pasos; si cambia, el reproductor se reinicia. */
  lastStep: Ref<number>
  /** Otras fuentes (parámetros de la simulación) cuyo cambio también reinicia el reproductor. */
  restartOn?: WatchSource[]
  /** Preferencia "reducir movimiento": sin animación, se muestra el resultado final. */
  reducedMotion: Ref<boolean>
  intervalMs: number
  /** Al reiniciar por un cambio, mostrar directamente el resultado final en vez de volver al inicio. */
  showFinalOnResize?: boolean
}

/** Conecta la máquina de estados del reproductor con un reloj (`setInterval`). */
export function usePlayer(options: PlayerOptions) {
  const { lastStep, restartOn = [], reducedMotion, intervalMs, showFinalOnResize = false } = options

  const state = ref<PlayerState>(createPlayer(lastStep.value))
  let timer: ReturnType<typeof setInterval> | undefined

  const stopTimer = (): void => {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
  }

  function restart(): void {
    const fresh = resize(lastStep.value)
    state.value = reducedMotion.value || showFinalOnResize ? finish(fresh) : fresh
  }

  watch([lastStep, ...restartOn], restart)
  watch(
    reducedMotion,
    (reduced) => {
      state.value = reduced || showFinalOnResize ? finish(state.value) : reset(state.value)
    },
    { immediate: true },
  )
  watch(
    () => state.value.status,
    (status) => {
      stopTimer()
      if (status === 'playing') timer = setInterval(() => (state.value = tick(state.value)), intervalMs)
    },
  )
  onBeforeUnmount(stopTimer)

  return {
    state,
    step: computed(() => state.value.step),
    isPlaying: computed(() => state.value.status === 'playing'),
    /** Falso con "reducir movimiento": no hay controles de reproducción. */
    animated: computed(() => !reducedMotion.value),
    play: () => {
      if (!reducedMotion.value) state.value = play(state.value)
    },
    pause: () => {
      state.value = pause(state.value)
    },
    reset: () => {
      if (!reducedMotion.value) state.value = reset(state.value)
    },
  }
}

export type Player = ReturnType<typeof usePlayer>
