import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    // Los tests de pantalla montan la app completa con vistas cargadas bajo demanda: con la
    // cobertura activa pueden pasar de los 5 s por defecto en una máquina cargada.
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      include: ['src/core/**', 'src/content/**', 'src/logic/**', 'src/stores/**'],
      exclude: ['src/content/**/data/**'],
      thresholds: { lines: 85, functions: 85, branches: 85, statements: 85 },
    },
  },
})
