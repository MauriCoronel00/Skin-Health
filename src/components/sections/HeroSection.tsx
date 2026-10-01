import { ErrorBoundary } from '../ErrorBoundary';
import { HeroBanner } from '../HeroBanner';

interface HeroSectionProps {
  onScrollToCatalog: () => void;
  onOpenQuiz: () => void;
}

export function HeroSection({ onScrollToCatalog, onOpenQuiz }: HeroSectionProps) {
  return (
    <ErrorBoundary>
      <HeroBanner onScrollToCatalog={onScrollToCatalog} onOpenQuiz={onOpenQuiz} />
    </ErrorBoundary>
  );
}