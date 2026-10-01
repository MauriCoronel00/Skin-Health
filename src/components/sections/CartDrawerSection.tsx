import { Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CartDrawer } from '../CartDrawer';

interface CartDrawerSectionProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: any) => void;
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