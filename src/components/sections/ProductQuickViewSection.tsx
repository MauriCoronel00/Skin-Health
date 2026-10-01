import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ProductQuickView } from '../ProductQuickView';

interface ProductQuickViewSectionProps {
  quickViewProduct: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  quantityInCart: number;
  reviews: any[];
  onOpenReviewModal: (product: any) => void;
  currentUser: any;
  allProducts: any[];
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