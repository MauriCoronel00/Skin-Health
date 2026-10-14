import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Evita que el cache HTTP del navegador sirva catálogo viejo (URLs de imagen
// ya inexistentes). El service worker (NetworkFirst) sigue dando soporte
// offline; no-store solo salta el cache HTTP antes de llegar a la red.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: noStoreFetch },
});
