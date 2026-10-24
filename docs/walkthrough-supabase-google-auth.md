# Walkthrough: Persistencia Local-First con Supabase y Google Auth

Implementación completa de persistencia en la nube mediante **Supabase** con autenticación de **Google (Google OAuth)** bajo una arquitectura **Local-First**, manteniendo el funcionamiento 100 % gratuito y offline en **Vercel**.

---

## Cambios Implementados

### 1. Dependencias y Variables de Entorno
- **`package.json`**: Incorporación de `@supabase/supabase-js`.
- **`.gitignore`**: Protección de `.env` y `.env.*` (manteniendo `*.local` y `.env.example`).
- **`.env.example`**: Plantilla documentada con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

### 2. Capa de Infraestructura
- **`src/platform/supabase.ts`**: Cliente singleton de Supabase con flujo PKCE para OAuth, detección de variables y utilidades de mock para pruebas aisladas (`setSupabaseForTesting`).

### 3. Fusión de Datos Determinística (Merge Strategy)
- **`src/logic/persistence/merge.ts`**:
  - **Secciones:** Unión sin duplicados (`completedSections`).
  - **Última sección:** Prioriza la sección activa del dispositivo local.
  - **Intentos de evaluación:** Unión deduplicada y ordenada cronológicamente de forma ascendente.
  - **Repaso espaciado:** Preservación del estado de repaso con `lastAnsweredAt` más reciente para cada pregunta.
  - Cumple estrictamente con la validación de `parseStoredData`.

### 4. Sincronización en la Nube
- **`src/logic/persistence/cloudSync.ts`**:
  - `fetchRemoteData`: Lee la fila del usuario en `user_progress` con manejo tolerante a fallas.
  - `saveRemoteData`: Realiza `upsert` atómico en PostgreSQL.
  - `syncDataWithRemote`: Descarga, fusiona local con remoto y actualiza ambos extremos.

### 5. Stores de Pinia
- **`src/stores/auth.ts`**: Store reactivo para sesión, usuario (nombre, correo, avatar), login con Google OAuth y logout.
- **`src/stores/userData.ts`**:
  - Mantiene la reactividad local inmediata (0 latencia).
  - Guarda localmente de forma síncrona.
  - Si el usuario está autenticado, programa una sincronización en la nube con debounce de 1 segundo.
  - Sincroniza bidireccionalmente de forma automática al iniciar sesión.

### 6. Interfaz de Usuario y Accesibilidad
- **`src/components/auth/AuthButton.vue`**:
  - Botón *"Acceder"* con el isotipo oficial de Google cuando no hay sesión.
  - Menú de perfil de usuario accesible (soporte de teclado con `Escape`, cierre al clickear fuera, `aria-haspopup`, `aria-expanded`).
  - Indicador visual del estado de sincronización (verde = sincronizado, amarillo pulsante = sincronizando, rojo = reintentar).
  - Botón *"Sincronizar ahora"* y *"Cerrar sesión"*.
  - No renderiza nada si Supabase no está configurado (degradación elegante).
- **`src/components/common/AppHeader.vue`**: Integración de `AuthButton` en la cabecera adaptable responsive.
- **`src/components/progress/DataManagement.vue`**: Mensaje contextual que informa si el progreso está sincronizado con la cuenta de Google o es local al dispositivo.
- **`src/App.vue`**: Inicialización del ciclo de vida de autenticación.

---

## Resultados de Pruebas y Validación

### Pruebas Unitarias y de Integración (`npm run test`)
Se crearon suites de pruebas dedicadas para cada nuevo componente y lógica:
- `tests/logic/merge.test.ts` (6 tests): Unión de secciones, deduplicación de intentos, desempate de repasos y validación de esquema.
- `tests/logic/cloudSync.test.ts` (5 tests): Mock de consultas Supabase, lectura, upsert y sincronización combinada.
- `tests/stores/auth-store.test.ts` (3 tests): Ciclo de autenticación, sesión, logout y fallback sin Supabase.
- `tests/components/auth-button.test.ts` (4 tests): Renderizado condicional, clic de login y apertura de panel de perfil.

> **Total de pruebas en Vitest:** **471 tests pasados** en 37 archivos (0 fallas).

### Verificación de Tipos TypeScript (`npm run typecheck`)
- Verificado con `vue-tsc --noEmit` en modo estricto: **0 errores**.

### Compilación y Bundle de Producción (`npm run build`)
- Compilado exitoso con Vite.
- Service Worker generado correctamente por `vite-plugin-pwa` (Workbox) con 67 entradas pre-cacheadas.

### Verificaciones del PRD (`npm run verify`)
- **RNF-05 (Presupuesto de descarga inicial):** 228.2 KB (por debajo del límite de 300 KB).
- **RNF-18 (Ejemplos numéricos):** 85/85 coinciden con la guía.
- **RNF-19 / RNF-20 (Trazabilidad):** 8/8 módulos cubiertos con al menos 12 preguntas por módulo.
- **RNF-17 (Encabezados de la guía):** 82/82 cubiertos.
- **Referencias hacia adelante:** 0 referencias cruzadas no permitidas.

---

## Cómo Probarlo en Local

1. En la raíz del proyecto, crea tu archivo `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://fwyglvkcdlunactytsif.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_public
   ```
2. Inicia el servidor de desarrollo:
   ```powershell
   npm run dev
   ```
3. Abre `http://localhost:5173`. Verás el botón **"Acceder"** con el ícono de Google en el encabezado.
4. Al hacer clic, te redirigirá al inicio de sesión de Google y volverá a la app con tu sesión iniciada, sincronizando tu progreso en segundo plano.
