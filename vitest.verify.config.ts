import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Scripts de verificación del PRD (RNF-17, 18, 19 y presupuesto de descarga). Se corren con
// `npm run verify`; con VERIFY_STRICT=1 (`npm run verify:strict`) lo pendiente también falla.
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'node', include: ['verify/**/*.verify.ts'], reporters: ['default'] },
})
