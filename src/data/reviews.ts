import { ProductReview, TipoPiel } from '../types';
import { supabase } from '../lib/supabaseClient';

interface ReviewRow {
  id: string;
  producto_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  comment: string;
  city: string | null;
  status: 'approved' | 'pending' | 'hidden';
  is_featured: boolean;
  creado_en: string;
  compra_verificada?: boolean;
  utiles_count?: number;
  respuesta_admin?: string | null;
  respuesta_admin_creada_en?: string | null;
  tipo_piel?: TipoPiel | null;
  fotos?: string[] | null;
}

const SELECT =
  'id, producto_id, user_id, author_name, rating, comment, city, status, is_featured, creado_en, compra_verificada, utiles_count, respuesta_admin, respuesta_admin_creada_en, tipo_piel, fotos';

export function mapRowToReview(
  row: ReviewRow,
  usuarioUtiles?: Set<string>
): ProductReview {
  return {
    id: row.id,
    productId: row.producto_id,
    rating: row.rating,
    comment: row.comment,
    author: { name: row.author_name },
    createdAt: row.creado_en,
    isExample: row.user_id === null,
    isVerifiedPurchase: row.compra_verificada ?? false,
    status: row.status,
    isFeatured: row.is_featured,
    city: row.city ?? undefined,
    tipoPiel: row.tipo_piel ?? undefined,
    fotos: row.fotos ?? [],
    utilesCount: row.utiles_count ?? 0,
    usuarioMarcoUtil: usuarioUtiles?.has(row.id) ?? false,
    respuestaAdmin: row.respuesta_admin ?? undefined,
    respuestaAdminCreadaEn: row.respuesta_admin_creada_en ?? undefined,
  };
}

/** Devuelve el set de review_ids que el usuario actual marcó como útiles. */
async function fetchUsuarioUtiles(): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from('reviews_utiles')
    .select('review_id')
    .eq('user_id', user.id);
  if (error) return new Set();
  return new Set(((data ?? []) as { review_id: string }[]).map((r) => r.review_id));
}

/** Reviews públicas (aprobadas). Ordenadas por útiles + recientes. */
export async function fetchApprovedReviews(): Promise<ProductReview[]> {
  const [{ data, error }, usuarioUtiles] = await Promise.all([
    supabase
      .from('reviews')
      .select(SELECT)
      .eq('status', 'approved')
      .order('utiles_count', { ascending: false })
      .order('creado_en', { ascending: false }),
    fetchUsuarioUtiles(),
  ]);
  if (error) throw error;
  return ((data ?? []) as ReviewRow[]).map((r) => mapRowToReview(r, usuarioUtiles));
}

/** Todas las visibles para la sesión (admin ve todo, autor ve las suyas). */
export async function fetchAllReviews(): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(SELECT)
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ReviewRow[]).map((r) => mapRowToReview(r));
}

/** Crea una review en estado pending. Requiere sesión Supabase. */
export async function submitReview(input: {
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
  city?: string;
  tipoPiel?: TipoPiel;
  fotos?: string[];
}): Promise<ProductReview> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      producto_id: input.productId,
      user_id: user.id,
      author_name: input.authorName,
      rating: input.rating,
      comment: input.comment,
      city: input.city ?? null,
      tipo_piel: input.tipoPiel ?? null,
      fotos: input.fotos ?? [],
      status: 'pending',
    })
    .select(SELECT)
    .single();
  if (error) throw error;
  return mapRowToReview(data as ReviewRow);
}

export async function setReviewStatus(
  id: string,
  status: 'approved' | 'hidden' | 'pending'
): Promise<ProductReview> {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id)
    .select(SELECT)
    .single();
  if (error) throw error;
  return mapRowToReview(data as ReviewRow);
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

export async function setReviewFeatured(
  id: string,
  featured: boolean
): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({ is_featured: featured })
    .eq('id', id);
  if (error) throw error;
}

/** R13: toggle útil vía RPC. Devuelve el nuevo estado (true = marcada). */
export async function toggleReviewUtil(reviewId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_util', { p_review_id: reviewId });
  if (error) throw error;
  return data as boolean;
}

/** R14: admin responde una review. Vacío = borra la respuesta. */
export async function responderReview(
  reviewId: string,
  respuesta: string
): Promise<void> {
  const { error } = await supabase.rpc('responder_review', {
    p_review_id: reviewId,
    p_respuesta: respuesta,
  });
  if (error) throw error;
}

/** R12: sube una foto al bucket 'review-photos' y devuelve URL pública. */
export async function uploadReviewPhoto(file: File): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('review-photos')
    .upload(path, file, { cacheControl: '31536000', upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('review-photos').getPublicUrl(path);
  return data.publicUrl;
}
