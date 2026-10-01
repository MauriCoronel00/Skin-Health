import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CollapsibleRoutines } from '../CollapsibleRoutines';
import { RoutinesSectionSkeleton } from '../Skeleton';

interface RoutinesSectionProps {
  onAddRoutineToCart: (products: any[]) => void;
  onQuickView: (product: any) => void;
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