import { ErrorBoundary } from '../ErrorBoundary';
import { ToastContainer, ToastMessage } from '../Toast';

interface ToastSectionProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastSection({ toasts, onDismiss }: ToastSectionProps) {
  return (
    <ErrorBoundary>
      <ToastContainer toasts={toasts} onDismiss={onDismiss} />
    </ErrorBoundary>
  );
}