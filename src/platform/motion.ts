import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/** `true` mientras el sistema tenga activada la preferencia "reducir movimiento" (RF-21). */
export function useReducedMotion(): Ref<boolean> {
  const query = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : undefined
  const reduced = ref(query?.matches ?? false)
  const onChange = (event: MediaQueryListEvent): void => {
    reduced.value = event.matches
  }
  onMounted(() => query?.addEventListener('change', onChange))
  onBeforeUnmount(() => query?.removeEventListener('change', onChange))
  return reduced
}
