import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/supabaseClient', () => {
  const mockSupabaseAuth = vi.fn();
  const mockSupabaseFrom = vi.fn();
  const mockSupabaseRpc = vi.fn();
  const mockSupabaseStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/user-1/abc.jpg' } }),
    })),
  };

  return {
    supabase: {
      auth: { getUser: mockSupabaseAuth },
      from: mockSupabaseFrom,
      rpc: mockSupabaseRpc,
      storage: mockSupabaseStorage,
    },
  };
});

import { supabase } from '../lib/supabaseClient';
import {
  fetchApprovedReviews,
  fetchAllReviews,
  submitReview,
  setReviewStatus,
  deleteReview,
  setReviewFeatured,
  toggleReviewUtil,
  responderReview,
  uploadReviewPhoto,
} from './reviews';

const mockApprovedRow = {
  id: 'rev-1',
  producto_id: 'prod-1',
  user_id: 'user-1',
  author_name: 'Ana',
  rating: 5,
  comment: 'Excelente producto',
  city: 'Asunción',
  status: 'approved',
  is_featured: false,
  creado_en: '2024-01-15T10:00:00Z',
  compra_verificada: true,
  utiles_count: 3,
  respuesta_admin: null,
  respuesta_admin_creada_en: null,
  tipo_piel: 'mixta',
  fotos: ['https://example.com/foto.jpg'],
};

const mockPendingRow = { ...mockApprovedRow, id: 'rev-2', status: 'pending', is_featured: false };

describe('reviews.ts - fetchApprovedReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: null } });
  });

  it('mapea filas aprobadas a ProductReview', async () => {
    // Mock that supports chained .order().order() calls
    let orderCallCount = 0;
    const reviewsQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(() => {
        orderCallCount++;
        if (orderCallCount === 1) return reviewsQuery;
        return { then: (resolve) => resolve({ data: [mockApprovedRow], error: null }) };
      }),
    };
    
    const utilesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    
    (supabase.from as vi.Mock).mockImplementation((table: string) => {
      if (table === 'reviews') {
        orderCallCount = 0;
        return reviewsQuery;
      }
      if (table === 'reviews_utiles') return utilesQuery;
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    const reviews = await fetchApprovedReviews();
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      id: 'rev-1',
      productId: 'prod-1',
      rating: 5,
      comment: 'Excelente producto',
      author: { name: 'Ana' },
      isVerifiedPurchase: true,
      status: 'approved',
      city: 'Asunción',
      tipoPiel: 'mixta',
      fotos: ['https://example.com/foto.jpg'],
      utilesCount: 3,
      isFeatured: false,
    });
  });

  it('devuelve array vacío si no hay datos', async () => {
    let orderCallCount = 0;
    const reviewsQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(() => {
        orderCallCount++;
        if (orderCallCount === 1) return reviewsQuery;
        return { then: (resolve) => resolve({ data: [], error: null }) };
      }),
    };
    
    const utilesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    
    (supabase.from as vi.Mock).mockImplementation((table: string) => {
      if (table === 'reviews') {
        orderCallCount = 0;
        return reviewsQuery;
      }
      if (table === 'reviews_utiles') return utilesQuery;
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    const reviews = await fetchApprovedReviews();
    expect(reviews).toEqual([]);
  });

  it('lanza error si Supabase falla', async () => {
    let orderCallCount = 0;
    const errorQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(() => {
        orderCallCount++;
        if (orderCallCount === 1) return errorQuery;
        return { then: (resolve) => resolve({ data: null, error: new Error('DB error') }) };
      }),
    };
    
    const utilesQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    
    (supabase.from as vi.Mock).mockImplementation((table: string) => {
      if (table === 'reviews') {
        orderCallCount = 0;
        return errorQuery;
      }
      if (table === 'reviews_utiles') return utilesQuery;
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    await expect(fetchApprovedReviews()).rejects.toThrow('DB error');
  });
});

describe('reviews.ts - fetchAllReviews (admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null }); // es_admin
  });

  it('requiere admin y devuelve todas las reviews', async () => {
    const query = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [mockApprovedRow, mockPendingRow], error: null }),
    };
    
    (supabase.from as vi.Mock).mockReturnValue(query);

    const reviews = await fetchAllReviews();
    expect(reviews).toHaveLength(2);
    expect(supabase.rpc).toHaveBeenCalledWith('es_admin');
  });

  it('lanza NOT_ADMIN si no es admin', async () => {
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: false, error: null });
    await expect(fetchAllReviews()).rejects.toThrow('NOT_ADMIN');
  });
});

describe('reviews.ts - submitReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('requiere sesión autenticada', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValueOnce({ data: { user: null } });
    await expect(submitReview({ productId: 'p1', rating: 5, comment: 'test', authorName: 'Ana' })).rejects.toThrow('NOT_AUTHENTICATED');
  });

  it('inserta review en estado pending', async () => {
    const pendingRow = { ...mockApprovedRow, status: 'pending', is_featured: false };
    (supabase.from as vi.Mock).mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: pendingRow, error: null }),
    });

    const review = await submitReview({
      productId: 'prod-1',
      rating: 5,
      comment: 'Genial',
      authorName: 'Ana',
      city: 'Asunción',
      tipoPiel: 'mixta',
      fotos: ['foto.jpg'],
    });

    expect(review.productId).toBe('prod-1');
    expect(review.status).toBe('pending');
  });
});

describe('reviews.ts - setReviewStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null });
  });

  it.each(['approved', 'hidden', 'pending'] as const)('cambia estado a %s', async (status) => {
    (supabase.from as vi.Mock).mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { ...mockApprovedRow, status }, error: null }),
    });

    const review = await setReviewStatus('rev-1', status);
    expect(review.status).toBe(status);
  });
});

describe('reviews.ts - deleteReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null });
  });

  it('elimina review', async () => {
    (supabase.from as vi.Mock).mockReturnValueOnce({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(deleteReview('rev-1')).resolves.toBeUndefined();
  });
});

describe('reviews.ts - setReviewFeatured', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null });
  });

  it('actualiza is_featured', async () => {
    (supabase.from as vi.Mock).mockReturnValueOnce({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await setReviewFeatured('rev-1', true);
    expect(supabase.from).toHaveBeenCalledWith('reviews');
  });
});

describe('reviews.ts - toggleReviewUtil (RPC)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'user-1' } } });
  });

  it('devuelve true/false según RPC', async () => {
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null });
    await expect(toggleReviewUtil('rev-1')).resolves.toBe(true);

    (supabase.rpc as vi.Mock).mockResolvedValue({ data: false, error: null });
    await expect(toggleReviewUtil('rev-1')).resolves.toBe(false);
  });
});

describe('reviews.ts - responderReview (RPC)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'admin-1' } } });
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: true, error: null });
  });

  it('llama RPC con respuesta', async () => {
    await responderReview('rev-1', 'Gracias por su opinión');
    expect(supabase.rpc).toHaveBeenCalledWith('responder_review', {
      p_review_id: 'rev-1',
      p_respuesta: 'Gracias por su opinión',
    });
  });

  it('respuesta vacía borra la respuesta', async () => {
    await responderReview('rev-1', '');
    expect(supabase.rpc).toHaveBeenCalledWith('responder_review', {
      p_review_id: 'rev-1',
      p_respuesta: '',
    });
  });
});

describe('reviews.ts - uploadReviewPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'user-1' } } });
    (supabase.storage.from as vi.Mock).mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/user-1/abc.jpg' } }),
    });
  });

  it('requiere sesión autenticada', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValueOnce({ data: { user: null } });
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await expect(uploadReviewPhoto(file)).rejects.toThrow('NOT_AUTHENTICATED');
  });

  it('rechaza MIME no permitido', async () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    await expect(uploadReviewPhoto(file)).rejects.toThrow('INVALID_FILE_TYPE');
  });

  it('rechaza archivo > 5MB', async () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
    await expect(uploadReviewPhoto(file)).rejects.toThrow('FILE_TOO_LARGE');
  });

  it('usa extensión por MIME, no por nombre', async () => {
    (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: { id: 'user-1' } } });
    (supabase.storage.from as vi.Mock).mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/user-1/abc.png' } }),
    });

    const file = new File([''], 'malicious.php', { type: 'image/png' });
    const url = await uploadReviewPhoto(file);
    expect(url).toBe('https://cdn.example.com/user-1/abc.png');
    const uploadCall = (supabase.storage.from as vi.Mock).mock.results[0].value.upload.mock.calls[0];
    expect(uploadCall[0]).toMatch(/^user-1\/[a-f0-9-]+\.png$/);
  });
});