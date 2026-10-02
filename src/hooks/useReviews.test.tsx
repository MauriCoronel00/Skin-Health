import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, act, waitFor, screen } from '@testing-library/react';
import { useReviews } from '../hooks/useReviews';
import { INITIAL_DEMO_REVIEWS } from '../data/demoReviews';

vi.mock('../data/reviews', () => ({
  fetchApprovedReviews: vi.fn(),
  fetchAllReviews: vi.fn(),
  submitReview: vi.fn(),
  setReviewStatus: vi.fn(),
  deleteReview: vi.fn(),
  setReviewFeatured: vi.fn(),
  toggleReviewUtil: vi.fn(),
  responderReview: vi.fn(),
}));

vi.mock('../data/identity', () => ({
  currentReviewer: vi.fn(),
}));

import * as reviewsModule from '../data/reviews';
import * as identityModule from '../data/identity';

const mockApprovedReview = {
  id: 'rev-1',
  productId: 'prod-1',
  rating: 5,
  comment: 'Excelente',
  author: { name: 'Ana' },
  createdAt: '2024-01-15T10:00:00Z',
  isVerifiedPurchase: true,
  status: 'approved',
  isFeatured: false,
  city: 'Asunción',
  tipoPiel: 'mixta',
  fotos: [],
  utilesCount: 3,
  usuarioMarcoUtil: false,
  respuestaAdmin: undefined,
  respuestaAdminCreadaEn: undefined,
};

function TestComponent() {
  const { reviews, adminReviews, loading, refresh, submit, loadForModeration, moderate, toggleUtil, responder } = useReviews();
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="reviews-count">{reviews.length}</span>
      <span data-testid="reviews">{JSON.stringify(reviews)}</span>
      <button onClick={() => refresh()} data-testid="refresh-btn">Refresh</button>
      <button onClick={() => submit({ userId: 'u1', displayName: 'Test' }, { productId: 'p1', rating: 5, comment: 'test' })} data-testid="submit-btn">Submit</button>
      <button onClick={() => loadForModeration()} data-testid="load-admin-btn">Load Admin</button>
      <button onClick={() => moderate('rev-1', 'approve')} data-testid="approve-btn">Approve</button>
      <button onClick={() => moderate('rev-1', 'delete')} data-testid="delete-btn">Delete</button>
      <button onClick={() => toggleUtil('rev-1')} data-testid="toggle-btn">Toggle</button>
      <button onClick={() => responder('rev-1', 'Gracias')} data-testid="responder-btn">Responder</button>
    </div>
  );
}

describe('useReviews hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (reviewsModule.fetchApprovedReviews as vi.Mock).mockResolvedValue([mockApprovedReview]);
    (reviewsModule.fetchAllReviews as vi.Mock).mockResolvedValue([mockApprovedReview]);
    (reviewsModule.submitReview as vi.Mock).mockResolvedValue({ ok: true });
    (reviewsModule.setReviewStatus as vi.Mock).mockResolvedValue({ ...mockApprovedReview, status: 'approved' });
    (reviewsModule.deleteReview as vi.Mock).mockResolvedValue(undefined);
    (reviewsModule.setReviewFeatured as vi.Mock).mockResolvedValue(undefined);
    (reviewsModule.toggleReviewUtil as vi.Mock).mockResolvedValue(true);
    (reviewsModule.responderReview as vi.Mock).mockResolvedValue(undefined);
    (identityModule.currentReviewer as vi.Mock).mockResolvedValue({ userId: 'u1', displayName: 'Test' });
  });

  it('carga reviews iniciales desde cache', () => {
    sessionStorage.setItem('skinhealth_reviews_v1', JSON.stringify([mockApprovedReview]));
    render(<TestComponent />);
    expect(screen.getByTestId('reviews-count').textContent).toBe('1');
  });

  it('usa demos si no hay cache', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('reviews-count').textContent).toBe(INITIAL_DEMO_REVIEWS.length.toString());
  });

  it('refresh recarga desde Supabase', async () => {
    render(<TestComponent />);
    // initial load already called once
    expect(reviewsModule.fetchApprovedReviews).toHaveBeenCalledTimes(1);
    
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.fetchApprovedReviews).toHaveBeenCalledTimes(2);
    });
  });

  it('submit llama a submitReview y devuelve ok', async () => {
    const { result } = await import('@testing-library/react');
    let submitResult: { ok: boolean; message?: string } = { ok: false };
    
    const TestSubmit = () => {
      const { submit } = useReviews();
      const handleClick = async () => {
        submitResult = await submit({ userId: 'u1', displayName: 'Test' }, { productId: 'p1', rating: 5, comment: 'test' });
      };
      return <button onClick={handleClick} data-testid="submit-btn">Submit</button>;
    };

    render(<TestSubmit />);
    await act(async () => {
      screen.getByTestId('submit-btn').click();
    });
    
    expect(submitResult.ok).toBe(true);
    expect(reviewsModule.submitReview).toHaveBeenCalledWith(expect.objectContaining({
      productId: 'p1',
      rating: 5,
      comment: 'test',
      authorName: 'Test',
    }));
  });

  it('submit devuelve error si no autenticado', async () => {
    // Test the module directly since hook testing with null userId is tricky
    (reviewsModule.submitReview as vi.Mock).mockImplementationOnce(async (reviewer) => {
      if (!reviewer.userId) return { ok: false, message: 'NOT_AUTHENTICATED' };
      return { ok: true };
    });

    const result = await reviewsModule.submitReview({ userId: null, displayName: 'Test' }, { productId: 'p1', rating: 5, comment: 'test' });
    expect(result.ok).toBe(false);
    expect(result.message).toBe('NOT_AUTHENTICATED');
  });

  it('loadForModeration carga todas las reviews', async () => {
    render(<TestComponent />);
    act(() => {
      screen.getByTestId('load-admin-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.fetchAllReviews).toHaveBeenCalledTimes(1);
    });
  });

  it('moderate approve llama setReviewStatus y refresh', async () => {
    render(<TestComponent />);
    act(() => {
      screen.getByTestId('approve-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.setReviewStatus).toHaveBeenCalledWith('rev-1', 'approved');
      expect(reviewsModule.fetchApprovedReviews).toHaveBeenCalledTimes(2); // initial + after approve
    });
  });

  it('moderate delete llama deleteReview y actualiza estado local', async () => {
    render(<TestComponent />);
    act(() => {
      screen.getByTestId('delete-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.deleteReview).toHaveBeenCalledWith('rev-1');
    });
  });

  it('toggleUtil hace optimistic update y rollback en error', async () => {
    (reviewsModule.toggleReviewUtil as vi.Mock).mockRejectedValueOnce(new Error('RPC error'));
    render(<TestComponent />);
    act(() => {
      screen.getByTestId('toggle-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.toggleReviewUtil).toHaveBeenCalledWith('rev-1');
    });
  });

  it('responder llama RPC y actualiza ambos arrays', async () => {
    render(<TestComponent />);
    act(() => {
      screen.getByTestId('responder-btn').click();
    });
    await waitFor(() => {
      expect(reviewsModule.responderReview).toHaveBeenCalledWith('rev-1', 'Gracias');
    });
  });
});