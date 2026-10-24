<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { isSupabaseConfigured } from '@/platform/supabase'
import { useAuthStore } from '@/stores/auth'
import { useUserDataStore } from '@/stores/userData'

const auth = useAuthStore()
const userData = useUserDataStore()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const isConfigured = computed(() => isSupabaseConfigured())

function toggleMenu(): void {
  isOpen.value = !isOpen.value
}

function closeMenu(): void {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

function handleClickOutside(event: MouseEvent): void {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

async function handleLogin(): Promise<void> {
  await auth.loginWithGoogle()
}

async function handleLogout(): Promise<void> {
  closeMenu()
  await auth.logout()
}

async function handleManualSync(): Promise<void> {
  await userData.syncWithCloud()
}

const syncLabel = computed(() => {
  switch (userData.syncStatus) {
    case 'syncing':
      return 'Sincronizando con la nube…'
    case 'synced':
      return 'Progreso sincronizado en la nube'
    case 'error':
      return 'Fallo al sincronizar (reintentar)'
    default:
      return 'Listo para sincronizar'
  }
})
</script>

<template>
  <div v-if="isConfigured" ref="menuRef" class="auth-box">
    <!-- Botón cuando NO está autenticado -->
    <button
      v-if="!auth.isAuthenticated"
      type="button"
      class="button auth-btn auth-btn--login"
      aria-label="Iniciar sesión con Google para sincronizar progreso"
      @click="handleLogin"
    >
      <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>Acceder</span>
    </button>

    <!-- Menú cuando SÍ está autenticado -->
    <div v-else class="auth-logged">
      <button
        type="button"
        class="auth-user-btn"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        aria-label="Menú de usuario y estado de sincronización"
        @click="toggleMenu"
      >
        <img
          v-if="auth.userAvatar"
          :src="auth.userAvatar"
          :alt="auth.userName"
          class="auth-avatar"
          referrerpolicy="no-referrer"
        />
        <span v-else class="auth-avatar-fallback">{{ auth.userName.charAt(0).toUpperCase() }}</span>

        <span class="auth-sync-dot" :class="`auth-sync-dot--${userData.syncStatus}`" :title="syncLabel" />
        <span class="auth-username-short">{{ auth.userName.split(' ')[0] }}</span>
      </button>

      <!-- Panel desplegable -->
      <div v-if="isOpen" class="auth-dropdown" role="dialog" aria-label="Perfil y sincronización">
        <div class="auth-dropdown__header">
          <p class="auth-dropdown__name">{{ auth.userName }}</p>
          <p class="auth-dropdown__email">{{ auth.userEmail }}</p>
        </div>

        <div class="auth-dropdown__sync">
          <p class="auth-dropdown__status" :class="`auth-dropdown__status--${userData.syncStatus}`">
            <span class="auth-sync-dot" :class="`auth-sync-dot--${userData.syncStatus}`" />
            <span>{{ syncLabel }}</span>
          </p>
          <button
            type="button"
            class="button auth-dropdown__action"
            :disabled="userData.syncStatus === 'syncing'"
            @click="handleManualSync"
          >
            Sincronizar ahora
          </button>
        </div>

        <div class="auth-dropdown__footer">
          <button type="button" class="button button--danger auth-dropdown__action" @click="handleLogout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-box {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.9375rem;
}

.google-icon {
  flex-shrink: 0;
}

.auth-logged {
  position: relative;
}

.auth-user-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: var(--touch-min);
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
}

.auth-user-btn:hover {
  background: var(--color-surface);
}

.auth-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.auth-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-weight: bold;
  font-size: 0.85rem;
}

.auth-sync-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--viz-neutral);
  flex-shrink: 0;
}

.auth-sync-dot--syncing {
  background: #f59e0b;
  animation: pulse 1s infinite alternate;
}

.auth-sync-dot--synced {
  background: #10b981;
}

.auth-sync-dot--error {
  background: #ef4444;
}

@keyframes pulse {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

.auth-username-short {
  max-width: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 100;
  min-width: 17rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.auth-dropdown__header {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.auth-dropdown__name {
  margin: 0;
  font-weight: 600;
}

.auth-dropdown__email {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: var(--color-muted);
  word-break: break-all;
}

.auth-dropdown__sync {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.auth-dropdown__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.auth-dropdown__action {
  width: 100%;
  font-size: 0.9rem;
  min-height: 38px;
}

.auth-dropdown__footer {
  padding-top: 0.75rem;
}
</style>
