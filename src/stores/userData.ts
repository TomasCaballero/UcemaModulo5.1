import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { emptyStoredData, parseStoredData, serializeStoredData, type StoredData } from '@/logic/persistence/schema'
import { useServices } from '@/services'

export interface ExportedFile {
  fileName: string
  text: string
}

/**
 * Dueño único del documento de datos del usuario (progreso, historial…): carga,
 * guarda, exporta, importa y borra. Los demás stores solo leen y cambian su parte
 * con `update`.
 */
export const useUserDataStore = defineStore('userData', () => {
  const { repository, clock } = useServices()

  const loaded = repository.load()
  const data = ref<StoredData>(loaded.data)
  const unreadableData = ref(loaded.status === 'corrupt')
  const saveFailed = ref(false)

  /** Aplica el cambio en memoria y lo guarda; si guardar falla, lo avisa. */
  function commit(next: StoredData): void {
    data.value = next
    saveFailed.value = !repository.save(next)
  }

  /** Aplica `change` al documento; si devuelve el mismo objeto, no hay nada que guardar. */
  function update(change: (current: StoredData) => StoredData): void {
    const next = change(data.value)
    if (next !== data.value) commit(next)
  }

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
    repository.clear()
    unreadableData.value = false
    saveFailed.value = false
    data.value = emptyStoredData()
  }

  return { data, hasContent, storageWarning, update, exportData, parseImport, replaceData, resetData }
})
