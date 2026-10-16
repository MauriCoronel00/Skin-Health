import React, { useState } from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';
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
  const { language, setLanguage, formatCurrency, t } = useLanguage();

  const languages: Language[] = ['es', 'pt', 'en'];
  const flagImages = {
    es: 'https://flagcdn.com/w40/py.png',
    pt: 'https://flagcdn.com/w40/br.png',
    en: 'https://flagcdn.com/w40/us.png',
  };
  const flagLabels = { es: 'ES', pt: 'PT', en: 'EN' };

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const searchInputClass =
    'w-full h-10 pl-10 pr-9 rounded-full bg-white/80 border border-[#34483B]/10 text-sm text-[#34483B] placeholder:text-[#34483B]/40 outline-none focus:bg-white focus:border-[#34483B]/50 focus:ring-2 focus:ring-[#34483B]/15 transition-all shadow-sm';

  return (
    <header className="sticky top-0 z-30 bg-[#F1F4EF]/90 backdrop-blur-xl border-b border-[#34483B]/10 shadow-[0_1px_12px_rgba(16,42,67,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo - LEFT */}
        <div className="cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandLogo size="sm" variant="full" />
        </div>

        {/* Search (desktop) - CENTER */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#34483B]/40 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className={searchInputClass}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label={t.navClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#34483B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Actions - Google Login + Language Dropdown + Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <LoginButton />

          {/* Language selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu((prev) => !prev)}
              aria-label={t.navChangeLanguage}
              aria-expanded={showLanguageMenu}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#34483B]/20 ${
                showLanguageMenu
                  ? 'bg-white text-[#34483B] shadow-sm ring-1 ring-[#34483B]/10'
                  : 'text-[#34483B]/70 hover:text-[#34483B] hover:bg-white/70'
              }`}
            >
              <img src={flagImages[language]} alt="" className="w-5 h-auto rounded-full shadow-xs" />
              <span className="text-xs font-semibold tracking-wide">{flagLabels[language]}</span>
            </button>

            {showLanguageMenu && (
              <>
                <button
                  type="button"
                  aria-label={t.commonClose}
                  className="fixed inset-0 z-40 cursor-default bg-transparent"
                  onClick={() => setShowLanguageMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white py-1.5 px-1.5 shadow-xl ring-1 ring-[#34483B]/10 z-50">
                  <span className="text-[10px] font-semibold text-[#34483B]/50 uppercase tracking-[0.14em] block px-2.5 pt-1 pb-1.5">
                    {t.navLanguageHeader}
                  </span>
                  <div className="space-y-0.5">
                    {languages.map((lang) => {
                      const isCurrent = lang === language;
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageSelect(lang)}
                          aria-label={t.navSwitchTo.replace('{lang}', flagLabels[lang])}
                          className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                            isCurrent
                              ? 'bg-[#34483B] text-white font-medium'
                              : 'text-[#34483B]/80 hover:bg-[#F1F4EF]'
                          }`}
                        >
                          <img src={flagImages[lang]} alt="" className="w-4 h-auto rounded-full" />
                          <span className="text-xs font-semibold tracking-wide">{flagLabels[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Button */}
          <motion.button
            id="desktop-header-cart-btn"
            onClick={onOpenCart}
            aria-label={
              totalItems > 0
                ? t.navOpenOrderItems.replace('{count}', String(totalItems))
                : t.navOpenOrder
            }
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${
              totalItems > 0
                ? 'bg-[#34483B] text-white hover:bg-[#1e3a5f]'
                : 'bg-white text-[#34483B] ring-1 ring-[#34483B]/20 hover:ring-[#34483B]/40 hover:bg-[#F1F4EF]/50'
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
                  className="absolute -top-1.5 -right-2 bg-[#C98A2C] text-white text-[10px] font-bold min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            <span className="hidden sm:inline">
              {totalItems > 0 ? `${t.cartLabel} (${totalItems})` : t.cartLabel}
            </span>
            {totalItems > 0 && (
              <span className="hidden md:inline pl-2 text-xs text-white/85 font-normal border-l border-white/25">
                {formatCurrency(totalAmount)}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Search (mobile) */}
      <div className="md:hidden px-4 pb-3 relative">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-[calc(50%+6px)] text-[#34483B]/40 pointer-events-none" />
        <input
          id="mobile-search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className={searchInputClass}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label={t.navClearSearch}
            className="absolute right-6 top-1/2 -translate-y-[calc(50%+6px)] text-neutral-400 hover:text-[#34483B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
