import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Footer } from '../Footer';

interface FooterSectionProps {
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
}

export function FooterSection({ onOpenAdminPanel, isAdmin }: FooterSectionProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Footer onOpenAdminPanel={onOpenAdminPanel} isAdmin={isAdmin} />
      </Suspense>
    </ErrorBoundary>
  );
}