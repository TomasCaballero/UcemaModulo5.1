# AGENTS.md

## Propósito
SPA estática, offline y sin backend que convierte `recorrido-guias-de-aprendizaje-v3.md` en un curso interactivo (8 módulos, 67 simulaciones, evaluaciones con repetición espaciada) para un único usuario.
`PRD.md` manda sobre cualquier suposición; la guía es la única fuente de contenido.

## Stack
- Node 22 (instalado: 22.20.0), npm 10
- Vue 3 + TypeScript (estricto) + Vite, Pinia, Vue Router en modo hash
- KaTeX para fórmulas; gráficos en SVG/Canvas a mano (sin librerías de gráficos)
- PWA con `vite-plugin-pwa` (Workbox) para el uso offline
- Tests: Vitest (lógica, cobertura ≥ 85 %), Playwright (e2e y humo de los 67 interactivos), Lighthouse CI
- Contenido (secciones, glosario, preguntas) en archivos TS tipados bajo `src/content/`, con fórmulas como strings LaTeX
- Deploy: Vercel (hosting estático)

## Cómo correr (PowerShell)
```powershell
npm install            # instalar
npm run dev            # levantar (puerto por defecto de Vite)
npm run test           # tests unitarios (Vitest)
npm run test:coverage  # cobertura de la lógica de negocio
npm run test:e2e       # Playwright
npm run build; npm run preview   # build de producción (probar el service worker)
```
Scripts de verificación del PRD (RNF-17 encabezados, RNF-18 números, RNF-19 trazabilidad de las 82 preguntas): a crear, quedan bajo `npm run verify:*`.

## Qué NO hacer
- No agregar backend, cuentas ni enviar datos de progreso o respuestas a servidores externos (RNF-21).
- No inventar ni alterar contenido o cifras de la guía; los resultados numéricos deben coincidir con ella (RNF-17/18).
- No usar `localStorage` ni `Math.random` directos: pasar por las abstracciones de almacenamiento, reloj y aleatoriedad.
- No entregar nada que rompa contraste (≥ 4.5:1), responsive (desde 360 px) o lo ya funcionando: verificar antes de dar algo por terminado.
