import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Heart, Instagram } from 'lucide-react';
import { STORE_PHONE_NUMBER, STORE_PHONE_DISPLAY } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminPanel, isAdmin }) => {
  const { t } = useLanguage();
  return (
    <footer className="mt-16 bg-[#0E2338] text-white pt-12 pb-24 sm:pb-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Value props row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#B9CBBE]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">{t.footerOriginalTitle}</h4>
              <p className="text-xs text-white/70 mt-0.5">
                {t.footerOriginalDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">{t.footerDeliveryTitle}</h4>
              <p className="text-xs text-white/70 mt-0.5">
                {t.footerDeliveryDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-[#B9CBBE]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">{t.footerWhatsTitle}</h4>
              <p className="text-xs text-white/70 mt-0.5">
                {t.footerWhatsDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-right">
            <p className="text-xs text-white/60">
              {t.footerOrdered}
            </p>
            <a
              href="?track="
              className="text-sm font-semibold text-white hover:text-[#B9CBBE] inline-flex items-center gap-1.5 mt-1"
            >
              <Truck className="w-4 h-4" />
              <span>{t.footerTrack}</span>
            </a>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-xs text-white/60">
              {t.footerFollow}
            </p>
            <a
              href="https://www.instagram.com/skinhealthpy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Skin Health"
              className="inline-flex items-center justify-center w-10 h-10 mt-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-xs text-white/60">
              {t.footerContact}
            </p>
            <a
              href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#B9CBBE] hover:text-[#B9CBBE] inline-flex items-center gap-1.5 mt-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{STORE_PHONE_DISPLAY} (WhatsApp)</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Skin Health. {t.footerRights}</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-white/60">
                {t.footerKbeauty} <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> {t.footerKbeautyTail}
            </span>
            {isAdmin && onOpenAdminPanel && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="text-[#B9CBBE]/80 hover:text-[#B9CBBE] transition-colors text-xs underline cursor-pointer"
              >
                Panel admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

