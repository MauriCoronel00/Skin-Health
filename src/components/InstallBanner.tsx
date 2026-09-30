import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, X, Share } from 'lucide-react';

const DISMISS_KEY = 'sh_install_dismissed_v1';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Banner "Agregar a pantalla de inicio" (PWA). Solo si no está instalada. */
export const InstallBanner: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Ya instalada (standalone): nada que ofrecer
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      // storage no disponible: mostrar igual
    }
    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(ios);
    if (ios) {
      setVisible(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') dismiss();
    setDeferred(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-4 sm:mx-6 mt-3 flex items-center gap-3 bg-[#102A43] text-white rounded-2xl px-4 py-3 shadow-md"
          role="complementary"
          aria-label="Instalar aplicación"
        >
          <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            {isIos ? <Share className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </span>
          <p className="flex-1 text-xs leading-snug text-white/90">
            {isIos ? (
              <>En iPhone: tocá <strong>Compartir</strong> y elegí <strong>Agregar a pantalla de inicio</strong>.</>
            ) : (
              <>Agregá Skin Health a tu inicio para comprar en 1 toque.</>
            )}
          </p>
          {!isIos && deferred && (
            <button
              onClick={() => void install()}
              className="shrink-0 px-4 py-2 rounded-full bg-white text-[#102A43] text-xs font-bold hover:bg-white/90 transition-colors cursor-pointer"
            >
              Instalar
            </button>
          )}
          <button
            onClick={dismiss}
            aria-label="Ocultar aviso"
            className="shrink-0 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
