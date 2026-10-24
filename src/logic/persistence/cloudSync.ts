import type { SupabaseClient } from '@supabase/supabase-js'
import { mergeStoredData } from './merge'
import { parseStoredData, type StoredData } from './schema'

/**
 * Consulta el documento guardado en Supabase para el usuario indicado.
 * Devuelve `null` si no existe fila, si ocurre un error de red o si el JSON no es válido.
 */
export async function fetchRemoteData(
  supabase: SupabaseClient,
  userId: string,
): Promise<StoredData | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data || !data.data) return null

    const raw = typeof data.data === 'string' ? data.data : JSON.stringify(data.data)
    return parseStoredData(raw)
  } catch {
    return null
  }
}

/**
 * Guarda el documento completo en Supabase mediante upsert.
 * Devuelve `false` si ocurre cualquier fallo de red o permisos.
 */
export async function saveRemoteData(
  supabase: SupabaseClient,
  userId: string,
  data: StoredData,
): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_progress').upsert({
      user_id: userId,
      data,
      updated_at: new Date().toISOString(),
    })
    return !error
  } catch {
    return false
  }
}

/**
 * Realiza la sincronización bidireccional completa:
 * 1. Lee los datos remotos de Supabase.
 * 2. Si existen, los fusiona determinísticamente con los datos locales.
 * 3. Si no existen, inicializa la nube con los datos locales.
 * 4. Guarda el resultado fusionado en la nube y lo devuelve para el almacenamiento local.
 */
export async function syncDataWithRemote(
  supabase: SupabaseClient,
  userId: string,
  localData: StoredData,
): Promise<{ data: StoredData; success: boolean }> {
  try {
    const remote = await fetchRemoteData(supabase, userId)
    if (!remote) {
      const saved = await saveRemoteData(supabase, userId, localData)
      return { data: localData, success: saved }
    }
    const merged = mergeStoredData(localData, remote)
    const saved = await saveRemoteData(supabase, userId, merged)
    return { data: merged, success: saved }
  } catch {
    return { data: localData, success: false }
  }
}
