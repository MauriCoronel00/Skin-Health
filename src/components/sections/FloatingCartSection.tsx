import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { FloatingCart } from '../FloatingCart';

interface FloatingCartSectionProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  lastAddedTime?: number;
}

export function FloatingCartSection({
  totalItems,
  totalAmount,
  onOpenCart,
  lastAddedTime,
}: FloatingCartSectionProps) {
  if (totalItems === 0) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <FloatingCart
          totalItems={totalItems}
          totalAmount={totalAmount}
          onOpenCart={onOpenCart}
          lastAddedTime={lastAddedTime}
        />
      </Suspense>
    </ErrorBoundary>
  );
}