import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ReviewFormModal } from '../ReviewFormModal';

interface ReviewFormSectionProps {
  reviewingProduct: any;
  onClose: () => void;
  currentUser: any;
  onUserAuthenticated: (user: any) => void;
  onSubmitReview: (reviewData: any) => Promise<any>;
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