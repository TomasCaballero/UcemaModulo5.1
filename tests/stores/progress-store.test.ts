import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { courseContent } from '@/content'
import { DATA_KEY } from '@/logic/persistence/repository'
import { provideServices } from '@/services'
import { useProgressStore } from '@/stores/progress'
import { useUserDataStore } from '@/stores/userData'
import { installTestServices } from '../helpers/services'

/** Simula abrir la app de nuevo: pinia nueva sobre el mismo almacenamiento. */
function reopen() {
  setActivePinia(createPinia())
  return useProgressStore()
}

beforeEach(() => {
  installTestServices()
  setActivePinia(createPinia())
})

afterEach(() => provideServices(undefined))

describe('progreso', () => {
  it('"Marcar como vista" marca la sección y suma uno al módulo (AC-32)', () => {
    const store = useProgressStore()
    expect(store.moduleCompletion(2).completed).toBe(0)
    store.markSectionCompleted('2.1')
    expect(store.isCompleted('2.1')).toBe(true)
    expect(store.moduleCompletion(2)).toEqual({ completed: 1, total: 7, percent: 14 })
  })

  it('el avance total cuenta todas las secciones cargadas', () => {
    const store = useProgressStore()
    store.markSectionCompleted('2.1')
    store.markSectionCompleted('2.2')
    const total = courseContent.sections.length
    expect(store.overall).toEqual({ completed: 2, total, percent: Math.round((2 / total) * 100) })
  })

  it('ignora secciones que no existen', () => {
    const store = useProgressStore()
    store.markSectionCompleted('9.9')
    store.visit('9.9')
    const { progress } = useUserDataStore().data
    expect(progress.completedSections).toEqual([])
    expect(progress.lastSectionId).toBeNull()
  })

  it('marcar dos veces la misma sección no vuelve a guardar', () => {
    const { storage } = installTestServices()
    setActivePinia(createPinia())
    const store = useProgressStore()
    store.markSectionCompleted('2.1')
    storage.set(DATA_KEY, 'marca')
    store.markSectionCompleted('2.1')
    expect(storage.get(DATA_KEY)).toBe('marca')
  })

  it('persiste tras cerrar y reabrir (AC-34)', () => {
    useProgressStore().markSectionCompleted('2.3')
    useProgressStore().visit('2.3')
    const reopened = reopen()
    expect(reopened.isCompleted('2.3')).toBe(true)
    expect(reopened.continueSection?.id).toBe('2.3')
  })

  it('"continuar" apunta a la última sección visitada (AC-35)', () => {
    const store = useProgressStore()
    expect(store.continueSection).toBeUndefined()
    store.visit('2.2')
    store.visit('2.4')
    expect(store.continueSection?.id).toBe('2.4')
  })

  it('"continuar" ignora una última sección que ya no existe en el curso', () => {
    const { storage } = installTestServices()
    storage.set(DATA_KEY, JSON.stringify({ version: 1, progress: { completedSections: [], lastSectionId: '9.9' } }))
    expect(reopen().continueSection).toBeUndefined()
  })
})

describe('desmarcar secciones', () => {
  it('"Marcar como no vista" quita la sección y baja el avance del módulo', () => {
    const store = useProgressStore()
    store.markSectionCompleted('2.1')
    store.markSectionCompleted('2.2')
    store.unmarkSectionCompleted('2.1')
    expect(store.isCompleted('2.1')).toBe(false)
    expect(store.moduleCompletion(2).completed).toBe(1)
  })

  it('el marcado automático no vuelve a marcar una sección desmarcada', () => {
    const store = useProgressStore()
    store.markSectionCompleted('2.1', { auto: true })
    store.unmarkSectionCompleted('2.1')
    store.markSectionCompleted('2.1', { auto: true })
    expect(store.isCompleted('2.1')).toBe(false)
  })

  it('el botón manual sí puede volver a marcarla', () => {
    const store = useProgressStore()
    store.markSectionCompleted('2.1')
    store.unmarkSectionCompleted('2.1')
    store.markSectionCompleted('2.1')
    expect(store.isCompleted('2.1')).toBe(true)
  })

  it('el desmarcado sobrevive a cerrar y abrir la app', () => {
    const store = useProgressStore()
    store.markSectionCompleted('2.1')
    store.unmarkSectionCompleted('2.1')
    const reopened = reopen()
    expect(reopened.isCompleted('2.1')).toBe(false)
    reopened.markSectionCompleted('2.1', { auto: true })
    expect(reopened.isCompleted('2.1')).toBe(false)
  })

  it('ignora secciones que no existen', () => {
    const store = useProgressStore()
    store.unmarkSectionCompleted('9.9')
    expect(store.overall.completed).toBe(0)
  })
})
