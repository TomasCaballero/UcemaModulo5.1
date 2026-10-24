import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let customClient: SupabaseClient | null | undefined

function initClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey || typeof url !== 'string' || typeof anonKey !== 'string') {
    return null
  }
  try {
    return createClient(url, anonKey, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch {
    return null
  }
}

/** Devuelve la instancia de Supabase o null si faltan las variables de entorno. */
export function getSupabase(): SupabaseClient | null {
  if (customClient !== undefined) return customClient
  customClient = initClient()
  return customClient
}

/** Indica si las credenciales de Supabase están disponibles en el entorno. */
export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null
}

/** Permite inyectar un cliente mock en tests o resetearlo pasando undefined. */
export function setSupabaseForTesting(client?: SupabaseClient | null): void {
  customClient = client
}
