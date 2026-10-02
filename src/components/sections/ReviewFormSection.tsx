import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ReviewFormModal } from '../ReviewFormModal';
import { Product, ReviewUser, TipoPiel } from '../../types';

interface ReviewFormSectionProps {
  reviewingProduct: Product | null;
  onClose: () => void;
  currentUser: ReviewUser | null;
  onUserAuthenticated: (user: ReviewUser | null) => void;
  onSubmitReview: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    author: ReviewUser;
    city?: string;
    tipoPiel?: TipoPiel;
    fotos?: string[];
  }) => Promise<{ ok: boolean; message?: string }>;
}

export function ReviewFormSection({
  reviewingProduct,
  onClose,
  currentUser,
  onUserAuthenticated,
  onSubmitReview,
}: ReviewFormSectionProps) {
  if (!reviewingProduct) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <ReviewFormModal
          isOpen={!!reviewingProduct}
          onClose={onClose}
          product={reviewingProduct}
          currentUser={currentUser}
          onUserAuthenticated={onUserAuthenticated}
          onSubmitReview={onSubmitReview}
        />
      </Suspense>
    </ErrorBoundary>
  );
}