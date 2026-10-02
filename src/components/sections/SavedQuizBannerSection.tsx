import { ErrorBoundary } from '../ErrorBoundary';
import { SavedQuizBanner } from '../SavedQuizBanner';

interface SavedQuizBannerSectionProps {
  onRetakeQuiz: () => void;
  onViewRoutine: (routineId: string) => void;
}

export function SavedQuizBannerSection({ onRetakeQuiz, onViewRoutine }: SavedQuizBannerSectionProps) {
  return (
    <ErrorBoundary>
      <SavedQuizBanner
        onDismiss={() => {}}
        onRetakeQuiz={onRetakeQuiz}
        onViewRoutine={onViewRoutine}
      />
    </ErrorBoundary>
  );
}