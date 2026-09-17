import { ProductReview } from '../types';
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
}

const SELECT =
  'id, producto_id, user_id, author_name, rating, comment, city, status, is_featured, creado_en';

export function mapRowToReview(row: ReviewRow): ProductReview {
  return {
    id: row.id,
    productId: row.producto_id,
    rating: row.rating,
    comment: row.comment,
    author: { name: row.author_name },
    createdAt: row.creado_en,
    isExample: row.user_id === null,
    isVerifiedPurchase: false,
    status: row.status,
    isFeatured: row.is_featured,
    city: row.city ?? undefined,
  };
}

/** Reviews públicas (aprobadas). Lo que ve el catálogo. */
export async function fetchApprovedReviews(): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(SELECT)
    .eq('status', 'approved')
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ReviewRow[]).map(mapRowToReview);
}

/** Todas las visibles para la sesión (admin ve todo, autor ve las suyas). */
export async function fetchAllReviews(): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(SELECT)
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ReviewRow[]).map(mapRowToReview);
}

/** Crea una review en estado pending. Requiere sesión Supabase. */
export async function submitReview(input: {
  productId: string;
  rating: number;
  comment: string;
  authorName: string;
  city?: string;
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
