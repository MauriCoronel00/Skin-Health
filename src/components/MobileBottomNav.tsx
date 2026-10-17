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
import { useLanguage } from '../contexts/LanguageContext';
import { STORE_PHONE_NUMBER } from '../data/products';

export type TabId = 'home' | 'search' | 'cart' | 'chat' | 'account';

interface MobileBottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  cartCount: number;
  isCartOpen: boolean;
  onOpenCart: () => void;
}

const tabs: { id: TabId; icon: React.ReactNode; requiresAuth?: boolean }[] = [
  { id: 'home', icon: <Home className="w-5 h-5" /> },
  { id: 'search', icon: <Search className="w-5 h-5" /> },
  { id: 'cart', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'chat', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'account', icon: <User className="w-5 h-5" />, requiresAuth: true },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  isCartOpen,
  onOpenCart,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const labels: Record<TabId, string> = {
    home: t.navHome,
    search: t.navSearch,
    cart: t.navCart,
    chat: t.navAdvice,
    account: t.navAccount,
  };

  const handleTabClick = (tabId: TabId) => {
    // Special handling for cart - open drawer instead of switching tab
    if (tabId === 'cart') {
      onOpenCart();
      return;
    }

    // Asesoría: abrir WhatsApp de Skin Health directamente
    if (tabId === 'chat') {
      const mensaje = t.navWhatsMessage;
      const whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Buscar: revelar el buscador del Navbar y enfocarlo
    if (tabId === 'search') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('search-open'));
      onTabChange(tabId);
      return;
    }

    // Check auth for account tab
    if (tabId === 'account' && !user) {
      // Abrir el login con Google (LoginButton escucha este evento)
      window.dispatchEvent(new CustomEvent('auth-required'));
      return;
    }

    onTabChange(tabId);
  };

  return (
    <motion.nav
      id="mobile-bottom-nav"
      role="navigation"
      aria-label={t.navAria}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-4 right-4 z-40 sm:hidden max-w-md mx-auto pb-safe"
    >
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-100 shadow-[0_10px_30px_rgba(16,42,67,0.08)] rounded-full px-4 py-2.5 flex items-center justify-between gap-1 min-h-[4.25rem]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'cart' && cartCount > 0;

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              whileTap={{ scale: 0.92 }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 cursor-pointer relative active:scale-90 transition-all duration-200 px-3 py-1.5 ${
                isActive
                  ? 'text-white bg-[#102A43] rounded-full shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={labels[tab.id]}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="z-10">{tab.icon}</span>
                {showBadge && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className={`absolute -top-1 -right-1 text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ${
                      isActive
                        ? 'bg-white text-[#102A43] ring-[#102A43]'
                        : 'bg-[#102A43] text-white ring-white'
                    }`}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </div>
              <span className={`w-full max-w-full truncate text-center text-[11px] leading-none font-medium tracking-wide transition-colors ${
                isActive ? 'text-white' : 'text-neutral-400'
              }`}>
                {labels[tab.id]}
              </span>
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