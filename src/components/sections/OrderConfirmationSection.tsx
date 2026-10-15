import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import type { OrderDetails } from '../OrderConfirmationModal';

const OrderConfirmationModal = lazy(() =>
  import('../OrderConfirmationModal').then((m) => ({ default: m.OrderConfirmationModal }))
);

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