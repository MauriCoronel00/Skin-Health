import { ErrorBoundary } from '../ErrorBoundary';
import { ToastContainer } from '../Toast';

interface ToastSectionProps {
  toasts: any[];
  onDismiss: (id: string) => void;
}

export function ToastSection({ toasts, onDismiss }: ToastSectionProps) {
  return (
    <ErrorBoundary>
      <ToastContainer toasts={toasts} onDismiss={onDismiss} />
    </ErrorBoundary>
  );
}