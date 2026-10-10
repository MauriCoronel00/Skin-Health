import React, { useState } from 'react';
import { ShoppingBag, Search, X, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { LoginButton } from './LoginButton';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

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
  const { language, setLanguage, currency, formatCurrency } = useLanguage();

  const languages: Language[] = ['es', 'pt', 'en'];
  const flagEmojis = { es: '🇵🇾', pt: '🇧🇷', en: '🇺🇸' };
  const flagLabels = { es: 'ES', pt: 'PT', en: 'EN' };

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#102A43]/10 transition-all">
      {/* Announcement bar - navy centered, proper height */}
      <div className="bg-[#102A43] text-white text-[11px] py-2.5 px-4 text-center font-medium tracking-wide border-b border-white/10 flex justify-center items-center min-h-[28px]">
        Productos 100% originales — Envíos a todo Paraguay
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo - LEFT */}
        <div className="cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandLogo size="sm" variant="full" />
        </div>

        {/* Search (desktop) - CENTER */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-4">
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

        {/* Right Actions - Google Login + Language Dropdown + Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <LoginButton />

          {/* Language selector - dropdown */}
          <div
            className="relative"
            onClick={() => setShowLanguageMenu((prev) => !prev)}
            aria-label="Cambiar idioma"
          >
            <button
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-[#102A43] transition-colors focus:outline-none focus:ring-2 focus:ring-[#102A43]/20 ${showLanguageMenu ? 'bg-white' : 'bg-transparent'}` }
            >
              <span className="w-4 h-4">
                {flagEmojis[language]}
              </span>
              <span className="hidden sm:inline text-[10px] mr-1">{flagLabels[language]}</span>
            </button>
          </div>

          {/* Language menu dropdown */}
          {showLanguageMenu && (
            <div
              className="absolute right-0 mt-2 w-32 rounded-md bg-white py-2 shadow-lg border border-neutral-200 z-50 min-w max-w-fit"
              style={{
                visibility: 'visible',
                opacity: '1',
                transition: 'visibility 0s, opacity 0.2s ease',
              }}
            >
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Idioma</span>
              <div className="space-y-1 px-1">
                {languages.map((lang) => {
                  const isCurrent = lang === language;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageSelect(lang)}
                      className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${
                        isCurrent
                          ? 'bg-[#102A43] text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                      aria-label={`Cambiar a ${flagLabels[lang]}`}
                    >
                      <span className="w-3 h-3">
                        {flagEmojis[lang]}
                      </span>
                      <span className="hidden sm:inline">{flagLabels[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desktop Cart Button */}
          <motion.button
            id="desktop-header-cart-btn"
            onClick={onOpenCart}
            aria-label={totalItems > 0 ? `Abrir mi pedido, ${totalItems} productos` : 'Abrir mi pedido'}
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
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-1.5 -right-2 bg-white text-[#102A43] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-1 ring-[#102A43]/15"
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
                {formatCurrency(totalAmount)}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Search (mobile) */}
      <div className="md:hidden px-4 pb-3 relative">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-[calc(50%+6px)] text-neutral-400 pointer-events-none" />
        <input
          id="mobile-search-input"
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