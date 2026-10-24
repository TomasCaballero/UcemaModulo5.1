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
  const result = await fetchRemoteState(supabase, userId)
  return result.status === 'ok' ? result.data : null
}

export type RemoteState =
  | { status: 'ok'; data: StoredData }
  | { status: 'empty' }
  | { status: 'error' }

/**
 * Como `fetchRemoteData`, pero distingue "no hay fila" (`empty`) de "no se pudo leer"
 * (`error`: red, permisos o JSON inválido) para no pisar la nube ante un fallo de lectura.
 */
export async function fetchRemoteState(
  supabase: SupabaseClient,
  userId: string,
): Promise<RemoteState> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return { status: 'error' }
    if (!data || !data.data) return { status: 'empty' }

    const raw = typeof data.data === 'string' ? data.data : JSON.stringify(data.data)
    const parsed = parseStoredData(raw)
    return parsed ? { status: 'ok', data: parsed } : { status: 'error' }
  } catch {
    return { status: 'error' }
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
 * 4. Si la lectura falla, no escribe nada (evita pisar la nube con datos desactualizados).
 * 5. Guarda el resultado fusionado en la nube y lo devuelve para el almacenamiento local.
 */
export async function syncDataWithRemote(
  supabase: SupabaseClient,
  userId: string,
  localData: StoredData,
): Promise<{ data: StoredData; success: boolean }> {
  try {
    const remote = await fetchRemoteState(supabase, userId)
    if (remote.status === 'error') return { data: localData, success: false }
    if (remote.status === 'empty') {
      const saved = await saveRemoteData(supabase, userId, localData)
      return { data: localData, success: saved }
    }
    const merged = mergeStoredData(localData, remote.data)
    const saved = await saveRemoteData(supabase, userId, merged)
    return { data: merged, success: saved }
  } catch {
    return { data: localData, success: false }
  }
}
