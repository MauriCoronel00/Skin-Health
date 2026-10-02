import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ProductQuickView } from '../ProductQuickView';
import { Product, ProductReview, ReviewUser } from '../../types';

interface ProductQuickViewSectionProps {
  quickViewProduct: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  quantityInCart: number;
  reviews: ProductReview[];
  onOpenReviewModal: (product: Product) => void;
  currentUser: ReviewUser | null;
  allProducts: Product[];
  currentIndex: number;
  onToggleUtil: (reviewId: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function ProductQuickViewSection({
  quickViewProduct,
  onClose,
  onAddToCart,
  quantityInCart,
  reviews,
  onOpenReviewModal,
  currentUser,
  allProducts,
  currentIndex,
  onToggleUtil,
  onNavigate,
}: ProductQuickViewSectionProps) {
  if (!quickViewProduct) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <ProductQuickView
          product={quickViewProduct}
          onClose={onClose}
          onAddToCart={onAddToCart}
          quantityInCart={quantityInCart}
          reviews={reviews}
          onOpenReviewModal={onOpenReviewModal}
          currentUser={currentUser}
          allProducts={allProducts}
          currentIndex={currentIndex}
          onToggleUtil={onToggleUtil}
          onNavigate={onNavigate}
        />
      </Suspense>
    </ErrorBoundary>
  );
}