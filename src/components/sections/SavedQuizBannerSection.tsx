import { ErrorBoundary } from '../ErrorBoundary';
import { SavedQuizBanner } from '../SavedQuizBanner';

interface SavedQuizBannerSectionProps {
  onRetakeQuiz: () => void;
}

export function SavedQuizBannerSection({ onRetakeQuiz }: SavedQuizBannerSectionProps) {
  return (
    <ErrorBoundary>
      <SavedQuizBanner
        onDismiss={() => {}}
        onRetakeQuiz={onRetakeQuiz}
      />
    </ErrorBoundary>
  );
}