import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { saveRemoteData, syncDataWithRemote } from '@/logic/persistence/cloudSync'
import { emptyStoredData, parseStoredData, serializeStoredData, type StoredData } from '@/logic/persistence/schema'
import { getSupabase } from '@/platform/supabase'
import { useServices } from '@/services'
import { useAuthStore } from './auth'

export interface ExportedFile {
  fileName: string
  text: string
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

const SYNC_DEBOUNCE_MS = 1000
const RETRY_BASE_MS = 2000
const RETRY_MAX_MS = 60_000
const MAX_RETRIES = 6

/**
 * Dueño único del documento de datos del usuario (progreso, historial…): carga,
 * guarda, exporta, importa y borra. Los demás stores solo leen y cambian su parte
 * con `update`. Además, sincroniza en segundo plano con Supabase si hay una sesión activa.
 */
export const useUserDataStore = defineStore('userData', () => {
  const { repository, clock } = useServices()
  const auth = useAuthStore()

  const loaded = repository.load()
  const data = ref<StoredData>(loaded.data)
  const unreadableData = ref(loaded.status === 'corrupt')
  const saveFailed = ref(false)

  // Estado de sincronización en la nube
  const syncStatus = ref<SyncStatus>('idle')
  const lastSyncedAt = ref<string | null>(null)
  let syncTimeout: ReturnType<typeof setTimeout> | undefined
  let retryTimeout: ReturnType<typeof setTimeout> | undefined
  let retries = 0
  let inFlight = false
  let rerun = false
  /** Se borró el progreso y la nube todavía no lo sabe: hay que subir el local sin fusionar. */
  let pendingReset = false

  function clearTimers(): void {
    if (syncTimeout !== undefined) clearTimeout(syncTimeout)
    if (retryTimeout !== undefined) clearTimeout(retryTimeout)
    syncTimeout = undefined
    retryTimeout = undefined
  }

  /** Sincroniza (trae, fusiona y sube) en segundo plano con debounce de 1s. */
  function scheduleCloudPush(): void {
    if (!getSupabase() || !auth.user) return

    clearTimers()
    retries = 0
    syncStatus.value = 'syncing'
    syncTimeout = setTimeout(() => {
      syncTimeout = undefined
      void runSync()
    }, SYNC_DEBOUNCE_MS)
  }

  /** Reintenta tras un fallo con espera creciente, hasta `MAX_RETRIES` veces. */
  function scheduleRetry(): void {
    if (retries >= MAX_RETRIES || retryTimeout !== undefined) return
    const delay = Math.min(RETRY_BASE_MS * 2 ** retries, RETRY_MAX_MS)
    retries += 1
    retryTimeout = setTimeout(() => {
      retryTimeout = undefined
      void runSync()
    }, delay)
  }

  /** Sube ya lo que esté esperando el debounce (la pestaña se oculta o se cierra). */
  function flushPending(): void {
    if (syncTimeout === undefined) return
    clearTimeout(syncTimeout)
    syncTimeout = undefined
    void runSync()
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushPending()
    })
    window.addEventListener('pagehide', flushPending)
  }

  /** Aplica el cambio en memoria, lo guarda localmente y programa sincronización en la nube. */
  function commit(next: StoredData): void {
    data.value = next
    saveFailed.value = !repository.save(next)
    scheduleCloudPush()
  }

  /** Aplica `change` al documento; si devuelve el mismo objeto, no hay nada que guardar. */
  function update(change: (current: StoredData) => StoredData): void {
    const next = change(data.value)
    if (next !== data.value) commit(next)
  }

  /** Una pasada de sincronización; una sola a la vez (si llega otra pedido, se repite al terminar). */
  async function runSync(): Promise<void> {
    const supabase = getSupabase()
    const user = auth.user
    if (!supabase || !user) {
      syncStatus.value = 'idle'
      return
    }
    if (inFlight) {
      rerun = true
      return
    }
    inFlight = true
    if (retryTimeout !== undefined) {
      clearTimeout(retryTimeout)
      retryTimeout = undefined
    }
    syncStatus.value = 'syncing'

    let ok = false
    try {
      const snapshot = data.value
      if (pendingReset) {
        // Tras borrar, el local manda: se sube tal cual para que la nube no lo reviva.
        ok = await saveRemoteData(supabase, user.id, snapshot)
        if (ok) pendingReset = false
      } else {
        const { data: merged, success } = await syncDataWithRemote(supabase, user.id, snapshot)
        ok = success
        // Si el usuario cambió algo mientras se sincronizaba, ese cambio ya programó otra
        // sincronización que lo fusionará; no se pisa el documento local con una versión vieja.
        if (ok && data.value === snapshot) {
          data.value = merged
          repository.save(merged)
        }
      }
    } finally {
      inFlight = false
    }

    if (auth.user?.id !== user.id) {
      // Se cerró la sesión (o cambió de cuenta) durante la sincronización.
      syncStatus.value = 'idle'
    } else if (ok) {
      retries = 0
      syncStatus.value = 'synced'
      lastSyncedAt.value = new Date(clock.now()).toISOString()
    } else {
      syncStatus.value = 'error'
      scheduleRetry()
    }

    if (rerun) {
      rerun = false
      void runSync()
    }
  }

  /** Sincronización bidireccional inmediata (al iniciar sesión o con "Sincronizar ahora"). */
  async function syncWithCloud(): Promise<void> {
    retries = 0
    await runSync()
  }

  // Al cambiar la sesión (login), sincronizar automáticamente
  watch(
    () => auth.user,
    (newUser) => {
      if (newUser) {
        void syncWithCloud()
      } else {
        clearTimers()
        pendingReset = false
        syncStatus.value = 'idle'
      }
    },
  )

  /** Hay algo que perder si se reemplaza o borra el documento. */
  const hasContent = computed(
    () => data.value.progress.completedSections.length > 0 || data.value.attempts.length > 0 || data.value.reviews.length > 0,
  )

  /** Aviso para el usuario cuando el progreso no está a salvo (RNF-15). */
  const storageWarning = computed<string | undefined>(() => {
    if (unreadableData.value) {
      return 'No se pudo leer el progreso guardado, así que se empezó de cero. Se conservó una copia del original.'
    }
    if (!repository.persistent) return 'Tu navegador no permite guardar datos: el progreso no se guardará al cerrar la pestaña.'
    if (saveFailed.value) return 'No se pudo guardar el progreso (almacenamiento lleno o bloqueado).'
    return undefined
  })

  function exportData(): ExportedFile {
    const date = new Date(clock.now()).toISOString().slice(0, 10)
    return { fileName: `curso-progreso-${date}.json`, text: serializeStoredData(data.value) }
  }

  /** Valida un archivo exportado sin aplicarlo; lanza `InvalidDataError` si no sirve. */
  function parseImport(text: string): StoredData {
    return parseStoredData(text)
  }

  function replaceData(next: StoredData): void {
    unreadableData.value = false
    commit(next)
  }

  /** Borra todo (RF-41); la confirmación es responsabilidad de la interfaz. */
  function resetData(): void {
    clearTimers()
    repository.clear()
    unreadableData.value = false
    saveFailed.value = false
    data.value = emptyStoredData()

    if (getSupabase() && auth.user) {
      pendingReset = true
      retries = 0
      void runSync()
    }
  }

  return {
    data,
    hasContent,
    storageWarning,
    syncStatus,
    lastSyncedAt,
    update,
    syncWithCloud,
    exportData,
    parseImport,
    replaceData,
    resetData,
  }
})
