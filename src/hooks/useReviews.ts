import { useCallback, useEffect, useState } from 'react';
import { ProductReview, TipoPiel } from '../types';
import { INITIAL_DEMO_REVIEWS } from '../data/demoReviews';
import {
  fetchApprovedReviews,
  fetchAllReviews,
  submitReview,
  setReviewStatus,
  deleteReview,
  setReviewFeatured,
  toggleReviewUtil,
  responderReview,
} from '../data/reviews';
import { Reviewer } from '../data/identity';

const REVIEWS_STORAGE_KEY = 'skinhealth_reviews_v1';

function loadCache(): ProductReview[] {
  try {
    const saved = sessionStorage.getItem(REVIEWS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_DEMO_REVIEWS;
}

function saveCache(reviews: ProductReview[]) {
  try {
    sessionStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // fallback
  }
}

export type ModerateAction = 'approve' | 'hide' | 'delete' | 'feature';

/**
 * Reviews module (hook): única interfaz para leer, enviar y moderar.
 * Fuente pública: Supabase (approved). Caché local + demos solo como fallback offline.
 * Agregados (rating/count) se leen de las columnas de productos, no se recalculan acá.
 */
export function useReviews() {
  const [reviews, setReviews] = useState<ProductReview[]>(loadCache);
  const [adminReviews, setAdminReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const fresh = await fetchApprovedReviews();
      setReviews(fresh);
      saveCache(fresh);
    } catch {
      // sin conexión: se mantiene caché local o demos
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = useCallback(
    async (
      reviewer: Reviewer,
      data: {
        productId: string;
        rating: number;
        comment: string;
        city?: string;
        tipoPiel?: TipoPiel;
        fotos?: string[];
      }
    ): Promise<{ ok: boolean; message?: string }> => {
      if (!reviewer.userId) {
        return { ok: false, message: 'NOT_AUTHENTICATED' };
      }
      try {
        await submitReview({
          productId: data.productId,
          rating: data.rating,
          comment: data.comment,
          authorName: reviewer.displayName,
          city: data.city,
          tipoPiel: data.tipoPiel,
          fotos: data.fotos,
        });
        return { ok: true };
      } catch (err) {
        if ((err as { code?: string })?.code === '23505') {
          return { ok: false, message: 'Ya tenés una reseña enviada para este producto.' };
        }
        return { ok: false, message: 'No pudimos guardar tu reseña. Probá de nuevo.' };
      }
    },
    []
  );

  /** R13: toggle útil (optimistic UI). */
  const toggleUtil = useCallback(async (reviewId: string): Promise<void> => {
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              usuarioMarcoUtil: !r.usuarioMarcoUtil,
              utilesCount: (r.utilesCount ?? 0) + (r.usuarioMarcoUtil ? -1 : 1),
            }
          : r
      )
    );
    try {
      await toggleReviewUtil(reviewId);
    } catch {
      // Rollback si falla
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                usuarioMarcoUtil: !r.usuarioMarcoUtil,
                utilesCount: (r.utilesCount ?? 0) + (r.usuarioMarcoUtil ? -1 : 1),
              }
            : r
        )
      );
    }
  }, []);

  /** R14: admin responde a una reseña. Vacío = borra la respuesta. */
  const responder = useCallback(
    async (reviewId: string, respuesta: string): Promise<void> => {
      await responderReview(reviewId, respuesta);
      const now = new Date().toISOString();
      const trimmed = respuesta.trim();
      setAdminReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                respuestaAdmin: trimmed || undefined,
                respuestaAdminCreadaEn: trimmed ? now : undefined,
              }
            : r
        )
      );
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                respuestaAdmin: trimmed || undefined,
                respuestaAdminCreadaEn: trimmed ? now : undefined,
              }
            : r
        )
      );
    },
    []
  );

  const loadForModeration = useCallback(async () => {
    try {
      setAdminReviews(await fetchAllReviews());
    } catch {
      setAdminReviews((prev) => (prev.length > 0 ? prev : reviews));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moderate = useCallback(
    async (id: string, action: ModerateAction): Promise<void> => {
      if (action === 'delete') {
        await deleteReview(id);
        setAdminReviews((prev) => prev.filter((r) => r.id !== id));
        setReviews((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      if (action === 'feature') {
        const current = adminReviews.find((r) => r.id === id);
        await setReviewFeatured(id, !(current?.isFeatured ?? false));
        setAdminReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
        );
        return;
      }
      const updated = await setReviewStatus(id, action === 'approve' ? 'approved' : 'hidden');
      setAdminReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      await refresh();
    },
    [adminReviews, refresh]
  );

  return {
    reviews,
    adminReviews,
    loading,
    refresh,
    submit,
    loadForModeration,
    moderate,
    toggleUtil,
    responder,
  };
}
