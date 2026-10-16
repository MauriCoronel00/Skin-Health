import { createClient } from '@supabase/supabase-js';

const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY ??
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  env.SUPABASE_ANON_KEY ??
  env.SUPABASE_PUBLISHABLE_KEY;

// Vitest importa los módulos de datos sin cargar el entorno de Vite. El cliente
// usa valores sintácticamente válidos solo como fallback de pruebas; en preview
// y producción se toman las variables públicas inyectadas arriba.
const resolvedSupabaseUrl = supabaseUrl ?? 'https://placeholder.supabase.co';
const resolvedSupabaseAnonKey = supabaseAnonKey ?? 'test-publishable-key';

// Evita que el cache HTTP del navegador sirva catálogo viejo (URLs de imagen
// ya inexistentes). El service worker (NetworkFirst) sigue dando soporte
// offline; no-store solo salta el cache HTTP antes de llegar a la red.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' });

export const supabase = createClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
  global: { fetch: noStoreFetch },
});
