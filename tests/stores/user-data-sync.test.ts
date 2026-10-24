import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setSupabaseForTesting } from '@/platform/supabase'
import { provideServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import { useUserDataStore } from '@/stores/userData'
import { installTestServices } from '../helpers/services'
import { emptyStoredData, type StoredData } from '@/logic/persistence/schema'
import type { SupabaseClient, User } from '@supabase/supabase-js'

/** Supabase falso: la "nube" es `state.remote` y los fallos se encolan con `failReads`/`failWrites`. */
function createCloud(remote: StoredData | null = null) {
  const state = { remote: remote as StoredData | null, failReads: 0, failWrites: 0, selects: 0, upserts: 0 }
  const client = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            state.selects += 1
            if (state.failReads > 0) {
              state.failReads -= 1
              return { data: null, error: { message: 'sin red' } }
            }
            return state.remote === null ? { data: null, error: null } : { data: { data: state.remote }, error: null }
          },
        }),
      }),
      upsert: async (payload: { data: StoredData }) => {
        state.upserts += 1
        if (state.failWrites > 0) {
          state.failWrites -= 1
          return { error: { message: 'sin red' } }
        }
        state.remote = payload.data
        return { error: null }
      },
    }),
  } as unknown as SupabaseClient
  return { state, client }
}

/** Deja correr las promesas pendientes y los timers que venzan dentro de `ms`. */
const settle = (ms = 0) => vi.advanceTimersByTimeAsync(ms)

function login() {
  useAuthStore().user = { id: 'u1' } as User
}

beforeEach(() => {
  vi.useFakeTimers()
  installTestServices()
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.useRealTimers()
  setSupabaseForTesting(undefined)
  provideServices(undefined)
})

describe('sincronización en la nube: reintentos', () => {
  it('reintenta con espera creciente hasta lograrlo', async () => {
    const cloud = createCloud()
    cloud.state.failReads = 2
    setSupabaseForTesting(cloud.client)
    const userData = useUserDataStore()

    login()
    await settle()
    expect(userData.syncStatus).toBe('error')
    expect(cloud.state.selects).toBe(1)

    await settle(1999)
    expect(cloud.state.selects).toBe(1)
    await settle(1) // primer reintento a los 2 s: vuelve a fallar
    expect(cloud.state.selects).toBe(2)
    expect(userData.syncStatus).toBe('error')

    await settle(3999)
    expect(cloud.state.selects).toBe(2)
    await settle(1) // segundo reintento a los 4 s: funciona
    expect(userData.syncStatus).toBe('synced')
    expect(cloud.state.upserts).toBe(1)
  })

  it('deja de reintentar tras el máximo de intentos', async () => {
    const cloud = createCloud()
    cloud.state.failReads = 100
    setSupabaseForTesting(cloud.client)
    const userData = useUserDataStore()

    login()
    await settle(10 * 60_000)
    expect(userData.syncStatus).toBe('error')
    expect(cloud.state.selects).toBe(7) // el intento inicial + 6 reintentos
  })

  it('un cambio nuevo reinicia los reintentos', async () => {
    const cloud = createCloud()
    cloud.state.failReads = 1
    setSupabaseForTesting(cloud.client)
    const userData = useUserDataStore()

    login()
    await settle()
    expect(userData.syncStatus).toBe('error')

    useProgressStore().markSectionCompleted('2.1')
    await settle(1000)
    expect(userData.syncStatus).toBe('synced')
    expect(cloud.state.remote?.progress.completedSections).toEqual(['2.1'])
  })
})

describe('sincronización en la nube: pestaña que se oculta', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'visibilityState')
  })

  it('sube lo pendiente sin esperar el debounce', async () => {
    const cloud = createCloud()
    setSupabaseForTesting(cloud.client)
    useUserDataStore()
    login()
    await settle()
    const antes = cloud.state.upserts

    useProgressStore().markSectionCompleted('2.1')
    await settle(100)
    expect(cloud.state.upserts).toBe(antes)

    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
    await settle()
    expect(cloud.state.upserts).toBe(antes + 1)
    expect(cloud.state.remote?.progress.completedSections).toEqual(['2.1'])
  })
})

describe('sincronización en la nube: borrar progreso', () => {
  const withProgress = (): StoredData => ({
    ...emptyStoredData(),
    progress: { completedSections: ['1.1', '1.2'], lastSectionId: '1.2' },
  })

  it('si la nube falla al borrar, reintenta y no revive el progreso viejo', async () => {
    const cloud = createCloud(withProgress())
    setSupabaseForTesting(cloud.client)
    const userData = useUserDataStore()
    login()
    await settle()
    expect(userData.syncStatus).toBe('synced')

    cloud.state.failWrites = 1
    userData.resetData()
    await settle()
    expect(userData.syncStatus).toBe('error')
    expect(cloud.state.remote?.progress.completedSections).toEqual(['1.1', '1.2'])

    await settle(2000)
    expect(userData.syncStatus).toBe('synced')
    expect(cloud.state.remote?.progress.completedSections).toEqual([])
    expect(userData.data.progress.completedSections).toEqual([])
  })
})
