import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AuthButton from '@/components/auth/AuthButton.vue'
import { setSupabaseForTesting } from '@/platform/supabase'
import { useAuthStore } from '@/stores/auth'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('AuthButton', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setSupabaseForTesting(null)
  })

  afterEach(() => {
    setSupabaseForTesting(undefined)
  })

  it('no renderiza nada si Supabase no está configurado', () => {
    setSupabaseForTesting(null)
    const wrapper = mount(AuthButton)
    expect(wrapper.find('.auth-box').exists()).toBe(false)
  })

  it('muestra botón de acceder con Google cuando Supabase está configurado pero no hay sesión', () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signInWithOAuth: vi.fn(),
      },
    } as unknown as SupabaseClient

    setSupabaseForTesting(mockSupabase)
    const wrapper = mount(AuthButton)
    expect(wrapper.find('.auth-box').exists()).toBe(true)
    expect(wrapper.find('.auth-btn--login').exists()).toBe(true)
    expect(wrapper.text()).toContain('Acceder')
  })

  it('llama a loginWithGoogle al hacer clic en Acceder', async () => {
    const signInWithOAuth = vi.fn().mockResolvedValue({ error: null })
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signInWithOAuth,
      },
    } as unknown as SupabaseClient

    setSupabaseForTesting(mockSupabase)
    const wrapper = mount(AuthButton)
    await wrapper.find('.auth-btn--login').trigger('click')
    expect(signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' }),
    )
  })

  it('muestra perfil de usuario y avatar cuando está autenticado', async () => {
    const mockUser = {
      id: 'usr-1',
      email: 'juan@test.com',
      user_metadata: { full_name: 'Juan Perez', avatar_url: 'https://example.com/avatar.jpg' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: '2026-10-01',
    }
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: mockUser } }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    } as unknown as SupabaseClient

    setSupabaseForTesting(mockSupabase)
    const auth = useAuthStore()
    await auth.init()

    const wrapper = mount(AuthButton)
    expect(wrapper.find('.auth-user-btn').exists()).toBe(true)
    expect(wrapper.find('img.auth-avatar').attributes('src')).toBe('https://example.com/avatar.jpg')
    expect(wrapper.text()).toContain('Juan')

    // Al hacer clic en el botón de usuario, se despliega el menú
    await wrapper.find('.auth-user-btn').trigger('click')
    expect(wrapper.find('.auth-dropdown').exists()).toBe(true)
    expect(wrapper.text()).toContain('juan@test.com')
    expect(wrapper.text()).toContain('Cerrar sesión')
  })
})
