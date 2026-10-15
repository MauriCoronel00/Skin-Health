import { ErrorBoundary } from '../ErrorBoundary';
import { HeroBanner } from '../HeroBanner';

interface HeroSectionProps {
  onScrollToCatalog: () => void;
  onOpenQuiz: () => void;
  compact?: boolean;
}

export function HeroSection({ onScrollToCatalog, onOpenQuiz, compact = false }: HeroSectionProps) {
  return (
    <ErrorBoundary>
      <HeroBanner onScrollToCatalog={onScrollToCatalog} onOpenQuiz={onOpenQuiz} compact={compact} />
    </ErrorBoundary>
  );
}