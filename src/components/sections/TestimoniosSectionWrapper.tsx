import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { TestimoniosSection } from '../TestimoniosSection';
import { TestimoniosSectionSkeleton } from '../Skeleton';

interface TestimoniosSectionWrapperProps {
  isLoadingProducts: boolean;
}

export function TestimoniosSectionWrapper({ isLoadingProducts }: TestimoniosSectionWrapperProps) {
  return (
    <ErrorBoundary>
      {isLoadingProducts ? (
        <TestimoniosSectionSkeleton />
      ) : (
        <Suspense fallback={<TestimoniosSectionSkeleton />}>
          <TestimoniosSection />
        </Suspense>
      )}
    </ErrorBoundary>
  );
}