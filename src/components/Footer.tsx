import React from 'react';
import { BrandLogo } from './BrandLogo';
import { MessageCircle, ShieldCheck, Truck, RefreshCw, Heart, Instagram } from 'lucide-react';
import { STORE_PHONE_NUMBER, STORE_PHONE_DISPLAY } from '../data/products';

interface FooterProps {
  onOpenAdminReviews?: () => void;
  onOpenAdminPanel?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminReviews, onOpenAdminPanel, isAdmin }) => {
  return (
    <footer className="mt-16 bg-[#0E2338] text-white pt-12 pb-24 sm:pb-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Value props row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">100% Originales</h4>
              <p className="text-xs text-white/70 mt-0.5">
                Productos importados directamente de laboratorios oficiales y Corea del Sur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Delivery en Paraguay</h4>
              <p className="text-xs text-white/70 mt-0.5">
                Entregas en el día en Asunción y Gran Asunción. Envíos a todo el interior.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Pedidos por WhatsApp</h4>
              <p className="text-xs text-white/70 mt-0.5">
                Sin registros engorrosos. Armás tu carrito y coordinamos todo directo por chat.
              </p>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size="md" inverted={true} />

          <div className="text-center sm:text-right">
            <p className="text-xs text-white/60">
              Síguenos en las redes:
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
              Atención y pedidos al instante:
            </p>
            <a
              href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 mt-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{STORE_PHONE_DISPLAY} (WhatsApp)</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Skin Health. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-white/60">
              Dermocosmética hecha con <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> para tu piel.
            </span>
            {isAdmin && onOpenAdminPanel && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="text-emerald-300/80 hover:text-emerald-200 transition-colors text-[11px] underline cursor-pointer"
              >
                Panel admin
              </button>
            )}
            {onOpenAdminReviews && (
              <button
                type="button"
                onClick={onOpenAdminReviews}
                className="text-white/40 hover:text-white/80 transition-colors text-[11px] underline cursor-pointer"
              >
                Moderación de reseñas
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
