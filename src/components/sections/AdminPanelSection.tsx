import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

const AdminPanel = lazy(() => import('../AdminPanel').then((m) => ({ default: m.AdminPanel })));

interface AdminPanelSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminPanelSection({
  isOpen,
  onClose,
  onShowToast,
}: AdminPanelSectionProps) {
  if (!isOpen) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <AdminPanel
          isOpen={isOpen}
          onClose={onClose}
          onShowToast={onShowToast}
        />
      </Suspense>
    </ErrorBoundary>
  );
}