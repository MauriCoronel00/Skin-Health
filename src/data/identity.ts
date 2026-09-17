import { supabase } from '../lib/supabaseClient';
import { getSavedGoogleUser } from '../utils/reviewsStorage';

export interface Reviewer {
  /** null cuando solo hay identidad local (sin sesión): no puede escribir en DB. */
  userId: string | null;
  displayName: string;
  avatarUrl?: string;
  source: 'supabase' | 'local';
}

/**
 * Identidad unificada: una sola interfaz para saber quién actúa.
 * Adapter primario: sesión Supabase (tiene user_id para RLS).
 * Adapter de respaldo: identidad local guardada (solo display, offline).
 */
export async function currentReviewer(): Promise<Reviewer | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
    let displayName = meta.full_name || meta.name || '';
    const avatarUrl = meta.avatar_url || meta.picture;

    if (!displayName) {
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', user.id)
        .single();
      displayName = (perfil as { nombre: string | null } | null)?.nombre ?? '';
    }
    if (!displayName) displayName = (user.email ?? 'Cliente').split('@')[0];

    return { userId: user.id, displayName, avatarUrl, source: 'supabase' };
  }

  const local = getSavedGoogleUser();
  if (local) {
    return { userId: null, displayName: local.name, avatarUrl: local.avatarUrl, source: 'local' };
  }
  return null;
}
