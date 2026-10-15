import { describe, expect, it } from 'vitest'
import { MemoryStorage, WebStorageAdapter, createBrowserStorage } from '@/core/storage'

describe('MemoryStorage', () => {
  it('guarda, lee y borra', () => {
    const storage = new MemoryStorage(true)
    expect(storage.get('a')).toBeNull()
    storage.set('a', '1')
    expect(storage.get('a')).toBe('1')
    storage.remove('a')
    expect(storage.get('a')).toBeNull()
    expect(storage.persistent).toBe(true)
  })
})

describe('createBrowserStorage', () => {
  it('usa el almacenamiento del navegador si funciona', () => {
    const storage = createBrowserStorage(() => window.localStorage)
    expect(storage).toBeInstanceOf(WebStorageAdapter)
    expect(storage.persistent).toBe(true)
    storage.set('k', 'v')
    expect(storage.get('k')).toBe('v')
    storage.remove('k')
    expect(storage.get('k')).toBeNull()
  })

  it('cae a memoria no persistente si escribir lanza (almacenamiento bloqueado)', () => {
    const blocked = {
      setItem() {
        throw new DOMException('bloqueado', 'QuotaExceededError')
      },
      removeItem() {},
    } as unknown as Storage
    const storage = createBrowserStorage(() => blocked)
    expect(storage.persistent).toBe(false)
    storage.set('k', 'v')
    expect(storage.get('k')).toBe('v')
  })

  it('cae a memoria si acceder al backend lanza', () => {
    const storage = createBrowserStorage(() => {
      throw new Error('SecurityError')
    })
    expect(storage.persistent).toBe(false)
  })

  it('cae a memoria si no hay backend', () => {
    expect(createBrowserStorage(() => undefined).persistent).toBe(false)
  })
})
