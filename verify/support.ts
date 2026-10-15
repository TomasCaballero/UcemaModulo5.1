import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const GUIDE_PATH = resolve(__dirname, '..', 'recorrido-guias-de-aprendizaje-v3.md')

export const readGuide = (): string => readFileSync(GUIDE_PATH, 'utf8')

/** Con VERIFY_STRICT=1 lo que todavía no se cargó cuenta como falla (para el curso completo). */
export const STRICT = process.env.VERIFY_STRICT === '1'
