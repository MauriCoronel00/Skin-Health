import { ErrorBoundary } from '../ErrorBoundary';
import { MobileBottomNav } from '../MobileBottomNav';

interface MobileBottomNavSectionProps {
  activeTab: any;
  onTabChange: (tab: any) => void;
  cartCount: number;
  isCartOpen: boolean;
  onOpenCart: () => void;
}

export function MobileBottomNavSection({
  activeTab,
  onTabChange,
  cartCount,
  isCartOpen,
  onOpenCart,
}: MobileBottomNavSectionProps) {
  return (
    <ErrorBoundary>
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        cartCount={cartCount}
        isCartOpen={isCartOpen}
        onOpenCart={onOpenCart}
      />
    </ErrorBoundary>
  );
}