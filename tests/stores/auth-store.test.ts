import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setSupabaseForTesting } from '@/platform/supabase'
import { useAuthStore } from '@/stores/auth'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setSupabaseForTesting(null)
  })

  afterEach(() => {
    setSupabaseForTesting(undefined)
  })

  it('inicia en estado no autenticado cuando no hay supabase configurado', async () => {
    const auth = useAuthStore()
    await auth.init()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.userName).toBe('Estudiante')
    expect(auth.loading).toBe(false)
  })

  it('informa error al intentar login si supabase no está disponible', async () => {
    const auth = useAuthStore()
    const result = await auth.loginWithGoogle()
    expect(result.error).toContain('Supabase no está configurado')
    expect(auth.isAuthenticated).toBe(false)
  })

  it('detecta sesión activa e inicializa usuario', async () => {
    const mockUser = {
      id: 'usr-123',
      email: 'alumno@ucema.edu.ar',
      user_metadata: { full_name: 'Juan Perez', avatar_url: 'https://example.com/avatar.jpg' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: '2026-10-01',
    }
    const mockSession = {
      access_token: 'tok-123',
      refresh_token: 'ref-123',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    }

    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signInWithOAuth: vi.fn(),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    } as unknown as SupabaseClient

    setSupabaseForTesting(mockSupabase)
    const auth = useAuthStore()
    await auth.init()

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.userName).toBe('Juan Perez')
    expect(auth.userEmail).toBe('alumno@ucema.edu.ar')
    expect(auth.userAvatar).toBe('https://example.com/avatar.jpg')

    await auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
  })
})
