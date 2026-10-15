import type { KeyValueStorage } from '@/core/storage'
import { emptyStoredData, InvalidDataError, parseStoredData, serializeStoredData, type StoredData } from './schema'

export const DATA_KEY = 'ucema:data'
export const CORRUPT_BACKUP_KEY = 'ucema:data:corrupt'

/** `corrupt`: había datos guardados pero ilegibles; se conservó una copia. */
export type LoadStatus = 'empty' | 'ok' | 'corrupt'

export interface LoadResult {
  data: StoredData
  status: LoadStatus
}

/** Guarda y recupera el documento de datos sobre cualquier `KeyValueStorage`. */
export class DataRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  /** `false` si lo guardado no sobrevivirá al cierre del navegador (RNF-15). */
  get persistent(): boolean {
    return this.storage.persistent
  }

  load(): LoadResult {
    let raw: string | null
    try {
      raw = this.storage.get(DATA_KEY)
    } catch {
      return { data: emptyStoredData(), status: 'corrupt' }
    }
    if (raw === null) return { data: emptyStoredData(), status: 'empty' }
    try {
      return { data: parseStoredData(raw), status: 'ok' }
    } catch (error) {
      if (!(error instanceof InvalidDataError)) throw error
      this.keepCorruptCopy(raw)
      return { data: emptyStoredData(), status: 'corrupt' }
    }
  }

  /** Devuelve `false` si el almacenamiento rechazó la escritura (bloqueado o lleno). */
  save(data: StoredData): boolean {
    try {
      this.storage.set(DATA_KEY, serializeStoredData(data))
      return true
    } catch {
      return false
    }
  }

  clear(): void {
    try {
      this.storage.remove(DATA_KEY)
    } catch {
      // sin almacenamiento disponible no hay nada que borrar
    }
  }

  private keepCorruptCopy(raw: string): void {
    try {
      this.storage.set(CORRUPT_BACKUP_KEY, raw)
    } catch {
      // la copia es un extra: si no se puede guardar, se sigue igual
    }
  }
}
