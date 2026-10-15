import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import type { CartItem } from '../../types';
import type { OrderDetails } from '../OrderConfirmationModal';

const CartDrawer = lazy(() => import('../CartDrawer').then((m) => ({ default: m.CartDrawer })));

interface CartDrawerSectionProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: OrderDetails) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info', showWhatsAppFallback?: boolean) => void;
}

export function CartDrawerSection({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  onShowToast,
}: CartDrawerSectionProps) {
  if (!isOpen) return null;
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <CartDrawer
          isOpen={isOpen}
          onClose={onClose}
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onOrderSuccess={onOrderSuccess}
          onShowToast={onShowToast}
        />
      </Suspense>
    </ErrorBoundary>
  );
}