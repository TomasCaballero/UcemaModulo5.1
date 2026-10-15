/** Contrato mínimo de almacenamiento clave-valor de strings. */
export interface KeyValueStorage {
  /** `false` si los datos no sobreviven al cierre del navegador (RNF-15). */
  readonly persistent: boolean
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
}

/** Almacenamiento en memoria: sirve de respaldo y de doble en tests. */
export class MemoryStorage implements KeyValueStorage {
  private readonly data = new Map<string, string>()

  constructor(readonly persistent = false) {}

  get(key: string): string | null {
    return this.data.get(key) ?? null
  }

  set(key: string, value: string): void {
    this.data.set(key, value)
  }

  remove(key: string): void {
    this.data.delete(key)
  }
}

/** Adapter sobre la API `Storage` del navegador (único lugar que la toca). */
export class WebStorageAdapter implements KeyValueStorage {
  readonly persistent = true

  constructor(private readonly backend: Storage) {}

  get(key: string): string | null {
    return this.backend.getItem(key)
  }

  set(key: string, value: string): void {
    this.backend.setItem(key, value)
  }

  remove(key: string): void {
    this.backend.removeItem(key)
  }
}

const PROBE_KEY = '__ucema_probe__'

function isUsable(backend: Storage): boolean {
  try {
    backend.setItem(PROBE_KEY, '1')
    backend.removeItem(PROBE_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Devuelve almacenamiento persistente si el navegador lo permite; si está
 * bloqueado o ausente, cae a memoria con `persistent = false` para que la UI
 * avise que el progreso no se guardará (RNF-15).
 */
export function createBrowserStorage(
  resolveBackend: () => Storage | undefined = () => globalThis.localStorage,
): KeyValueStorage {
  try {
    const backend = resolveBackend()
    if (backend && isUsable(backend)) return new WebStorageAdapter(backend)
  } catch {
    // acceder a localStorage puede lanzar con cookies bloqueadas
  }
  return new MemoryStorage(false)
}
