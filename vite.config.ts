import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    // Uso sin conexión (RNF-13): el service worker precachea toda la app tras la primera visita.
    // Solo guarda archivos estáticos propios; no toca datos del usuario (RNF-21).
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Curso de Estadística, Econometría y Ciencia de Datos',
        short_name: 'Curso',
        description: 'Curso interactivo con simulaciones y evaluaciones, basado en la guía de estudio.',
        lang: 'es',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0a4fb3',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        // woff2 alcanza para los navegadores soportados; se omiten las demás variantes de KaTeX.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
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
      include: ['src/core/**', 'src/content/**', 'src/logic/**', 'src/stores/**', 'tools/**'],
      exclude: ['src/content/**/data/**'],
      thresholds: { lines: 85, functions: 85, branches: 85, statements: 85 },
    },
  },
})
