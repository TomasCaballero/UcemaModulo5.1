import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase } from '@/platform/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email)
  const userName = computed(() => {
    const meta = user.value?.user_metadata
    return (meta?.full_name || meta?.name || user.value?.email?.split('@')[0] || 'Estudiante') as string
  })
  const userAvatar = computed(() => {
    const meta = user.value?.user_metadata
    return (meta?.avatar_url || meta?.picture) as string | undefined
  })

  let isInitialized = false

  async function init(): Promise<void> {
    if (isInitialized) return
    isInitialized = true

    const supabase = getSupabase()
    if (!supabase) {
      loading.value = false
      return
    }

    try {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        error.value = sessionError.message
      } else {
        session.value = data.session
        user.value = data.session?.user ?? null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al verificar sesión'
    } finally {
      loading.value = false
    }

    supabase.auth.onAuthStateChange((_event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
    })
  }

  async function loginWithGoogle(): Promise<{ error?: string }> {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: 'Supabase no está configurado. Revisa las variables de entorno.' }
    }
    try {
      error.value = null
      // Con vue-router hash history, el redirect al origin base evita conflictos de hash
      const redirectTo = `${window.location.origin}${window.location.pathname}`
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (authError) {
        error.value = authError.message
        return { error: authError.message }
      }
      return {}
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al conectar con Google'
      error.value = msg
      return { error: msg }
    }
  }

  async function logout(): Promise<void> {
    const supabase = getSupabase()
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } finally {
      user.value = null
      session.value = null
      error.value = null
    }
  }

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    userEmail,
    userName,
    userAvatar,
    init,
    loginWithGoogle,
    logout,
  }
})
