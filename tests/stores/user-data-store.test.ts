import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/core/storage'
import { DATA_KEY } from '@/logic/persistence/repository'
import { InvalidDataError } from '@/logic/persistence/schema'
import { provideServices } from '@/services'
import { useAttemptsStore } from '@/stores/attempts'
import { useProgressStore } from '@/stores/progress'
import { useUserDataStore } from '@/stores/userData'
import { installTestServices } from '../helpers/services'

/** Simula abrir la app de nuevo: pinia nueva sobre el mismo almacenamiento. */
function reopen() {
  setActivePinia(createPinia())
  return useUserDataStore()
}

const attempt = {
  moduleId: 2,
  takenAt: '2026-10-14T12:00:00.000Z',
  correct: 9,
  total: 12,
  failedQuestionIds: ['m2-q01', 'm2-q02', 'm2-q03'],
  confidence: 90,
}

beforeEach(() => {
  installTestServices()
  setActivePinia(createPinia())
})

afterEach(() => provideServices(undefined))

describe('borrar progreso', () => {
  it('deja todo en 0 %, sin historial, y vacía lo guardado (AC-41)', () => {
    const progress = useProgressStore()
    progress.markSectionCompleted('2.1')
    progress.visit('2.1')
    useAttemptsStore().recordAttempt(attempt)
    useUserDataStore().resetData()
    expect(progress.overall.percent).toBe(0)
    expect(progress.continueSection).toBeUndefined()
    expect(useAttemptsStore().attemptsOf(2)).toEqual([])
    expect(reopen().hasContent).toBe(false)
  })
})

describe('exportar e importar', () => {
  it('el archivo se llama con la fecha del reloj', () => {
    expect(useUserDataStore().exportData().fileName).toBe('curso-progreso-2026-10-14.json')
  })

  it('importar en un dispositivo sin datos reproduce progreso e historial (AC-40)', () => {
    const progress = useProgressStore()
    progress.markSectionCompleted('2.1')
    progress.markSectionCompleted('2.5')
    progress.visit('2.5')
    useAttemptsStore().recordAttempt(attempt)
    const origin = useUserDataStore()
    const { text } = origin.exportData()
    const originalData = JSON.parse(JSON.stringify(origin.data))

    installTestServices(new MemoryStorage(true)) // otro navegador
    const target = reopen()
    expect(target.hasContent).toBe(false)
    target.replaceData(target.parseImport(text))
    expect(target.data).toEqual(originalData)
    expect(reopen().data).toEqual(originalData) // y quedó guardado
  })

  it('rechaza un archivo inválido sin tocar el progreso', () => {
    const progress = useProgressStore()
    progress.markSectionCompleted('2.1')
    expect(() => useUserDataStore().parseImport('{no es json')).toThrow(InvalidDataError)
    expect(progress.isCompleted('2.1')).toBe(true)
  })

  it('hay contenido con solo un intento registrado', () => {
    useAttemptsStore().recordAttempt(attempt)
    expect(useUserDataStore().hasContent).toBe(true)
  })
})

describe('aviso de almacenamiento (RNF-15)', () => {
  it('no avisa cuando se puede guardar', () => {
    expect(useUserDataStore().storageWarning).toBeUndefined()
  })

  it('avisa que el progreso no se guardará si el almacenamiento no es persistente (AC-51)', () => {
    installTestServices(new MemoryStorage(false))
    const store = reopen()
    expect(store.storageWarning).toContain('no se guardará')
    useProgressStore().markSectionCompleted('2.1') // el avance en memoria sigue funcionando
    expect(useProgressStore().isCompleted('2.1')).toBe(true)
  })

  it('avisa si guardar falla', () => {
    const { storage } = installTestServices()
    const store = reopen()
    storage.set = () => {
      throw new DOMException('lleno', 'QuotaExceededError')
    }
    useProgressStore().markSectionCompleted('2.1')
    expect(store.storageWarning).toContain('No se pudo guardar')
  })

  it('avisa si lo guardado era ilegible', () => {
    const { storage } = installTestServices()
    storage.set(DATA_KEY, 'basura')
    expect(reopen().storageWarning).toContain('No se pudo leer')
  })

  it('importar datos válidos limpia el aviso de datos ilegibles', () => {
    const { storage } = installTestServices()
    storage.set(DATA_KEY, 'basura')
    const store = reopen()
    store.replaceData(store.parseImport(store.exportData().text))
    expect(store.storageWarning).toBeUndefined()
  })
})
