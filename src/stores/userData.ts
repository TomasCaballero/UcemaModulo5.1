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

  /** Sincroniza (trae, fusiona y sube) en segundo plano con debounce de 1s. */
  function scheduleCloudPush(): void {
    if (!getSupabase() || !auth.user) return

    if (syncTimeout !== undefined) {
      clearTimeout(syncTimeout)
    }
    syncStatus.value = 'syncing'
    syncTimeout = setTimeout(() => {
      syncTimeout = undefined
      void syncWithCloud()
    }, 1000)
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

  /** Sincronización bidireccional inmediata con Supabase (al iniciar sesión). */
  async function syncWithCloud(): Promise<void> {
    const supabase = getSupabase()
    if (!supabase || !auth.user) {
      syncStatus.value = 'idle'
      return
    }
    syncStatus.value = 'syncing'
    const snapshot = data.value
    const { data: merged, success } = await syncDataWithRemote(supabase, auth.user.id, snapshot)
    if (success) {
      // Si el usuario cambió algo mientras se sincronizaba, ese cambio ya programó otra
      // sincronización que lo fusionará; no se pisa el documento local con una versión vieja.
      if (data.value === snapshot) {
        data.value = merged
        repository.save(merged)
      }
      syncStatus.value = 'synced'
      lastSyncedAt.value = new Date().toISOString()
    } else {
      syncStatus.value = 'error'
    }
  }

  // Al cambiar la sesión (login), sincronizar automáticamente
  watch(
    () => auth.user,
    (newUser) => {
      if (newUser) {
        void syncWithCloud()
      } else {
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
    if (syncTimeout !== undefined) {
      clearTimeout(syncTimeout)
      syncTimeout = undefined
    }
    repository.clear()
    unreadableData.value = false
    saveFailed.value = false
    const empty = emptyStoredData()
    data.value = empty

    const supabase = getSupabase()
    if (supabase && auth.user) {
      void saveRemoteData(supabase, auth.user.id, empty)
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
