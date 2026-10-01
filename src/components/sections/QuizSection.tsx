import { ErrorBoundary } from '../ErrorBoundary';
import { DiagnosticQuiz } from '../DiagnosticQuiz';

interface QuizSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (routineId: string) => void;
}

export function QuizSection({ isOpen, onClose, onComplete }: QuizSectionProps) {
  if (!isOpen) return null;
  return (
    <ErrorBoundary>
      <DiagnosticQuiz isOpen={isOpen} onClose={onClose} onComplete={onComplete} />
    </ErrorBoundary>
  );
}