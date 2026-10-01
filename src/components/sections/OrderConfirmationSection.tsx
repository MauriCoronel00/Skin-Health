import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { OrderConfirmationModal } from '../OrderConfirmationModal';

interface OrderConfirmationSectionProps {
  confirmedOrder: any | null;
  onClose: () => void;
}

export function OrderConfirmationSection({ confirmedOrder, onClose }: OrderConfirmationSectionProps) {
  if (!confirmedOrder) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <OrderConfirmationModal
          isOpen={!!confirmedOrder}
          onClose={onClose}
          order={confirmedOrder}
        />
      </Suspense>
    </ErrorBoundary>
  );
}