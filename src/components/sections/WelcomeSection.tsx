import { ErrorBoundary } from '../ErrorBoundary';
import { WelcomePopup } from '../WelcomePopup';

interface WelcomeSectionProps {
  open: boolean;
  onStartQuiz: () => void;
  onClose: () => void;
}

export function WelcomeSection({ open, onStartQuiz, onClose }: WelcomeSectionProps) {
  if (!open) return null;
  return (
    <ErrorBoundary>
      <WelcomePopup open={open} onStartQuiz={onStartQuiz} onClose={onClose} />
    </ErrorBoundary>
  );
}