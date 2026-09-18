import React from 'react';
import { ShoppingBag, MessageCircle, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { LoginButton } from './LoginButton';
import { formatGuarani, STORE_PHONE_NUMBER } from '../data/products';

interface NavbarProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalItems,
  totalAmount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#102A43]/10 transition-all">
      {/* Announcement bar */}
      <div className="bg-[#102A43] text-[#FAF8F5] text-[11px] py-1.5 px-4 text-center font-medium uppercase tracking-[0.18em]">
        Productos 100% originales • Envíos a todo Paraguay
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo */}
        <div className="cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandLogo size="md" />
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar producto, marca o ingrediente…"
            aria-label="Buscar productos"
            className="w-full h-10 pl-10 pr-9 rounded-full bg-white border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#102A43]/40 focus:ring-2 focus:ring-[#102A43]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <LoginButton />
          {/* Direct WhatsApp help */}
          <a
            href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health%2C%20tengo%20una%20consulta%20sobre%20sus%20productos`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#102A43] bg-white border border-[#102A43]/15 hover:bg-[#102A43]/5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Asesoría</span>
          </a>

          {/* Desktop Cart Button */}
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

      {/* Search (mobile) */}
      <div className="md:hidden px-4 pb-3 relative">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-[calc(50%+6px)] text-neutral-400 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar producto, marca o ingrediente…"
          aria-label="Buscar productos"
          className="w-full h-10 pl-10 pr-9 rounded-full bg-white border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#102A43]/40 focus:ring-2 focus:ring-[#102A43]/10 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-6 top-1/2 -translate-y-[calc(50%+6px)] text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
