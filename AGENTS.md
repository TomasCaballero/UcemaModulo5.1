# AGENTS.md

## Propósito
SPA estática, offline y sin backend propio que convierte `recorrido-guias-de-aprendizaje-v3.md` en un curso interactivo (8 módulos, 67 simulaciones, evaluaciones con repetición espaciada) para un único usuario. El progreso es local; opcionalmente se sincroniza con Supabase (Google Auth) si hay sesión y variables de entorno.
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
Verificaciones del PRD (corren con Vitest sobre `verify/`): `npm run verify` (RNF-17 encabezados, RNF-18 números, RNF-19/20 trazabilidad y banco, RNF-05 peso de descarga; este último necesita `npm run build` antes) y `npm run verify:strict`, que además exige que estén cargados los 8 módulos. Parsers y reglas en `tools/`.

Pruebas en navegador (Playwright, usa Chrome y Edge instalados; compila y sirve el build): `npm run test:e2e`. Lighthouse suelto: `npx -y lighthouse <url> --only-categories=accessibility,performance --chrome-flags="--headless=new"` con el servidor de `npm run preview` levantado.

## Qué NO hacer
- No agregar backend propio ni cuentas obligatorias. Sin sesión, 0 datos a servidores externos; con sesión, el progreso solo va a la fila del propio usuario en Supabase (RLS) y a ningún otro destino ni analítica (RNF-21). La app debe seguir funcionando igual sin Supabase configurado.
- Supabase: el esquema vive en `supabase/migrations/` (se aplica a mano en el SQL Editor); el cliente solo usa la anon key, nunca la service key.
- No inventar ni alterar contenido o cifras de la guía; los resultados numéricos deben coincidir con ella (RNF-17/18).
- No usar `localStorage` ni `Math.random` directos: pasar por las abstracciones de almacenamiento, reloj y aleatoriedad.
- No entregar nada que rompa contraste (≥ 4.5:1), responsive (desde 360 px) o lo ya funcionando: verificar antes de dar algo por terminado.
