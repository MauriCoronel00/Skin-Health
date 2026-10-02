import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { OrderConfirmationModal } from '../OrderConfirmationModal';
import { OrderDetails } from '../OrderConfirmationModal';

interface OrderConfirmationSectionProps {
  confirmedOrder: OrderDetails | null;
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