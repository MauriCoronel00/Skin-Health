import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomePopupProps {
  open: boolean;
  onStartQuiz: () => void;
  onClose: () => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onStartQuiz, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#102A43]/50 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#dbeafe]/60 blur-2xl pointer-events-none" />
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-[#102A43] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <h2 id="welcome-popup-title" className="font-serif text-2xl font-semibold text-[#102A43] leading-tight mb-2">
              Descubrí tu rutina ideal
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-5">
              Hacé el diagnóstico gratis de 60 segundos y te armamos tu ritual de 4 pasos con productos oficiales.
            </p>
            <button
              onClick={onStartQuiz}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#102A43] text-white text-sm font-bold hover:bg-[#102A43]/90 transition-all cursor-pointer group"
            >
              <span>Hacer mi diagnóstico gratis</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              Ahora no
            </button>
            <p className="text-[11px] text-neutral-400 text-center mt-1">
              Sin registro · Te toma un minuto
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
