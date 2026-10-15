import { defineAsyncComponent } from 'vue'

/** KaTeX se carga bajo demanda para no pesar en la descarga inicial (RNF-05). */
export const AsyncMath = defineAsyncComponent(() => import('./MathInline.vue'))
