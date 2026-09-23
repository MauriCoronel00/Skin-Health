import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Search,
  ShoppingBag,
  MessageCircle,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { STORE_PHONE_NUMBER } from '../data/products';

export type TabId = 'home' | 'search' | 'cart' | 'chat' | 'account';

interface MobileBottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  cartCount: number;
  isCartOpen: boolean;
  onOpenCart: () => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode; requiresAuth?: boolean }[] = [
  { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { id: 'search', label: 'Buscar', icon: <Search className="w-5 h-5" /> },
  { id: 'cart', label: 'Pedido', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'chat', label: 'Asesoría', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'account', label: 'Cuenta', icon: <User className="w-5 h-5" />, requiresAuth: true },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  isCartOpen,
  onOpenCart,
}) => {
  const { user } = useAuth();

  const handleTabClick = (tabId: TabId) => {
    // Special handling for cart - open drawer instead of switching tab
    if (tabId === 'cart') {
      onOpenCart();
      return;
    }

    // Asesoría: abrir WhatsApp de Skin Health directamente
    if (tabId === 'chat') {
      const mensaje = 'Hola Skin Health, necesito asesoría para elegir mi rutina.';
      const whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Buscar: scroll al top y focus en el input de búsqueda del Navbar
    if (tabId === 'search') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Delay para esperar el scroll antes de hacer focus
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input') as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.select();
        }
      }, 400);
      onTabChange(tabId);
      return;
    }

    // Check auth for account tab
    if (tabId === 'account' && !user) {
      // Trigger auth flow
      window.dispatchEvent(new CustomEvent('auth-required'));
      return;
    }

    onTabChange(tabId);
  };

  return (
    <motion.nav
      id="mobile-bottom-nav"
      role="navigation"
      aria-label="Navegación principal"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-100 sm:hidden pb-safe pl-safe pr-safe"
    >
      <div className="flex items-center justify-around h-14 px-2 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'cart' && cartCount > 0;

          // Don't render account tab if not authenticated (show chat instead)
          if (tab.id === 'account' && !user && activeTab !== 'account') {
            return null;
          }

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              whileTap={{ scale: 0.92 }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 cursor-pointer relative ${
                isActive ? 'text-[#102A43]' : 'text-neutral-400'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="z-10">{tab.icon}</span>
                {showBadge && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide transition-colors ${
                isActive ? 'text-[#102A43]' : 'text-neutral-400'
              }`}>
                {tab.label}
              </span>
              {/* Active indicator */}
              <motion.div
                layoutId="active-indicator"
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#102A43] ${
                  isActive ? 'opacity-100' : 'opacity-0 scale-0'
                }`}
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Floating CTA when cart is open - quick close access */}
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-full w-10 h-2 bg-neutral-300 rounded-full"
        />
      )}
    </motion.nav>
  );
};