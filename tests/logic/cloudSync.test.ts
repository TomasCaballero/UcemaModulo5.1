import { describe, expect, it, vi } from 'vitest'
import { fetchRemoteData, saveRemoteData, syncDataWithRemote } from '@/logic/persistence/cloudSync'
import { emptyStoredData, type StoredData } from '@/logic/persistence/schema'
import type { SupabaseClient } from '@supabase/supabase-js'

function createMockSupabase(initialRemoteData: unknown = null) {
  let stored = initialRemoteData

  const mock = {
    from: vi.fn().mockImplementation((table: string) => {
      expect(table).toBe('user_progress')
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockImplementation(async () => {
              if (stored === null) return { data: null, error: null }
              return { data: { data: stored }, error: null }
            }),
          }),
        }),
        upsert: vi.fn().mockImplementation(async (payload: { data: unknown }) => {
          stored = payload.data
          return { error: null }
        }),
      }
    }),
  } as unknown as SupabaseClient

  return { mock, getStored: () => stored }
}

describe('cloudSync', () => {
  it('fetchRemoteData devuelve null si no hay fila remota', async () => {
    const { mock } = createMockSupabase(null)
    const result = await fetchRemoteData(mock, 'user-123')
    expect(result).toBeNull()
  })

  it('fetchRemoteData parsea y devuelve datos remotos válidos', async () => {
    const remoteData: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1'], lastSectionId: '1.1' },
    }
    const { mock } = createMockSupabase(remoteData)
    const result = await fetchRemoteData(mock, 'user-123')
    expect(result?.progress.completedSections).toEqual(['1.1'])
  })

  it('saveRemoteData guarda los datos correctamente', async () => {
    const { mock, getStored } = createMockSupabase(null)
    const dataToSave = emptyStoredData()
    const success = await saveRemoteData(mock, 'user-123', dataToSave)
    expect(success).toBe(true)
    expect(getStored()).toEqual(dataToSave)
  })

  it('syncDataWithRemote sube datos locales si la nube está vacía', async () => {
    const { mock, getStored } = createMockSupabase(null)
    const localData: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['2.1'], lastSectionId: '2.1' },
    }
    const res = await syncDataWithRemote(mock, 'user-123', localData)
    expect(res.success).toBe(true)
    expect(res.data.progress.completedSections).toEqual(['2.1'])
    expect(getStored()).toEqual(localData)
  })

  it('syncDataWithRemote fusiona datos locales con remotos y actualiza la nube', async () => {
    const remoteData: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1'], lastSectionId: '1.1' },
    }
    const localData: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.2'], lastSectionId: '1.2' },
    }
    const { mock, getStored } = createMockSupabase(remoteData)
    const res = await syncDataWithRemote(mock, 'user-123', localData)

    expect(res.success).toBe(true)
    // El resultado fusionado tiene ambas secciones
    expect(res.data.progress.completedSections.sort()).toEqual(['1.1', '1.2'].sort())
    // La nube se actualizó con la fusión
    expect((getStored() as StoredData).progress.completedSections.sort()).toEqual(['1.1', '1.2'].sort())
  })

  it('syncDataWithRemote no escribe si la lectura remota falla', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    const mock = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'network' } }),
          }),
        }),
        upsert,
      }),
    } as unknown as SupabaseClient

    const res = await syncDataWithRemote(mock, 'user-123', emptyStoredData())
    expect(res.success).toBe(false)
    expect(upsert).not.toHaveBeenCalled()
  })

  it('syncDataWithRemote no escribe si el JSON remoto es inválido', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    const mock = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: { data: { basura: true } }, error: null }),
          }),
        }),
        upsert,
      }),
    } as unknown as SupabaseClient

    const res = await syncDataWithRemote(mock, 'user-123', emptyStoredData())
    expect(res.success).toBe(false)
    expect(upsert).not.toHaveBeenCalled()
  })

  it('un dispositivo desactualizado no pisa lo que otro subió', async () => {
    const remoteData: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1', '1.2', '1.3'], lastSectionId: '1.3' },
    }
    const stale: StoredData = {
      ...emptyStoredData(),
      progress: { completedSections: ['1.1'], lastSectionId: '1.1' },
    }
    const { mock, getStored } = createMockSupabase(remoteData)
    await syncDataWithRemote(mock, 'user-123', stale)
    expect((getStored() as StoredData).progress.completedSections.sort()).toEqual(['1.1', '1.2', '1.3'])
  })
})
