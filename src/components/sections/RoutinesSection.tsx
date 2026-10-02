import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CollapsibleRoutines } from '../CollapsibleRoutines';
import { RoutinesSectionSkeleton } from '../Skeleton';
import { Product } from '../../types';

interface RoutinesSectionProps {
  onAddRoutineToCart: (products: Product[]) => void;
  onQuickView: (product: Product) => void;
  focusNumber: string | null;
}

export function RoutinesSectionWrapper({ onAddRoutineToCart, onQuickView, focusNumber }: RoutinesSectionProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RoutinesSectionSkeleton />}>
        <CollapsibleRoutines
          onAddRoutineToCart={onAddRoutineToCart}
          onQuickView={onQuickView}
          focusNumber={focusNumber}
        />
      </Suspense>
    </ErrorBoundary>
  );
}