import { ErrorBoundary } from '../ErrorBoundary';
import { OfferBanner } from '../OfferBanner';

interface OfferBannerSectionProps {
  onOpenQuiz: () => void;
}

export function OfferBannerSection({ onOpenQuiz }: OfferBannerSectionProps) {
  return (
    <ErrorBoundary>
      <OfferBanner onOpenQuiz={onOpenQuiz} />
    </ErrorBoundary>
  );
}
