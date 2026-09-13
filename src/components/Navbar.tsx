import React from 'react';
import { ShoppingBag, Search, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { formatGuarani } from '../data/products';

interface NavbarProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalItems,
  totalAmount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#102A43]/10 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#102A43] text-[#FAF8F5] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>✨ Cosmética Dermatológica & Coreana 100% Original</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Envíos a todo el país vía WhatsApp</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandLogo size="md" />
        </div>

        {/* Center search for desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <input
            type="text"
            placeholder="Buscar por producto, activo o marca..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/80 border border-[#102A43]/15 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-[#102A43] focus:ring-1 focus:ring-[#102A43] transition-all"
          />
          <Search className="w-4 h-4 text-[#102A43]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-[#102A43] hover:bg-[#102A43]/5 rounded-full transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Direct WhatsApp help */}
          <a
            href="https://wa.me/595981123456?text=Hola%20Skin%20Health%2C%20tengo%20una%20consulta%20sobre%20sus%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#102A43] bg-white border border-[#102A43]/15 hover:bg-[#102A43]/5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Asesoría</span>
          </a>

          {/* Desktop Cart Button (Section 18) */}
          <motion.button
            id="desktop-header-cart-btn"
            onClick={onOpenCart}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${
              totalItems > 0
                ? 'bg-[#102A43] text-white hover:bg-[#102A43]/90'
                : 'bg-white text-[#102A43] border border-[#102A43]/15 hover:bg-neutral-50'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            <span className="hidden sm:inline">
              {totalItems > 0 ? `Pedido (${totalItems})` : 'Mi Pedido'}
            </span>
            {totalItems > 0 && (
              <span className="hidden md:inline pl-1 text-xs text-white/80 font-normal border-l border-white/20">
                {formatGuarani(totalAmount)}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile search drop-down */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 pb-3 overflow-hidden"
          >
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Buscar por activo, producto..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white border border-[#102A43]/20 rounded-xl py-2 pl-10 pr-9 text-sm focus:outline-none focus:border-[#102A43]"
              />
              <Search className="w-4 h-4 text-[#102A43]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
