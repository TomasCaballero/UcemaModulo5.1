/**
 * Reproductor de animaciones paso a paso como máquina de estados (patrón State, RF-19).
 * Las transiciones son funciones puras: cada una depende del estado actual y devuelve el siguiente.
 */
export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'finished'

export interface PlayerState {
  status: PlayerStatus
  /** Paso mostrado, de 0 a `lastStep`. */
  step: number
  lastStep: number
}

export function createPlayer(lastStep: number): PlayerState {
  if (!Number.isInteger(lastStep) || lastStep < 0) throw new RangeError(`lastStep inválido: ${lastStep}`)
  return { status: 'idle', step: 0, lastStep }
}

/** Reproduce desde donde se pausó; si ya terminó, empieza de nuevo. */
export function play(state: PlayerState): PlayerState {
  if (state.lastStep === 0) return state
  switch (state.status) {
    case 'idle':
    case 'paused':
      return { ...state, status: 'playing' }
    case 'finished':
      return { ...state, status: 'playing', step: 0 }
    case 'playing':
      return state
  }
}

export function pause(state: PlayerState): PlayerState {
  return state.status === 'playing' ? { ...state, status: 'paused' } : state
}

/** Vuelve al primer paso, detenido. */
export function reset(state: PlayerState): PlayerState {
  return { ...state, status: 'idle', step: 0 }
}

/** Un paso del reloj: solo avanza si está reproduciendo. */
export function tick(state: PlayerState): PlayerState {
  if (state.status !== 'playing') return state
  const step = state.step + 1
  return step >= state.lastStep ? { ...state, status: 'finished', step: state.lastStep } : { ...state, step }
}

/** Salta al resultado final (versión estática para "reducir movimiento", RF-21). */
export function finish(state: PlayerState): PlayerState {
  return { ...state, status: 'finished', step: state.lastStep }
}

/** Cambia la cantidad de pasos (por ejemplo, al cambiar un parámetro) y vuelve al inicio. */
export function resize(lastStep: number): PlayerState {
  return createPlayer(lastStep)
}
