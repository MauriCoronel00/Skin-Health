import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy: importa el cliente bajo demanda para no bloquear la primera pintura.
// Usar en funciones async: const supabase = await getSupabase();
let cached: SupabaseClient | null = null;
export async function getSupabase(): Promise<SupabaseClient> {
  if (!cached) cached = (await import('./supabaseClient')).supabase;
  return cached;
}
