import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, MessageCircle, X } from 'lucide-react';
import { STORE_PHONE_NUMBER } from '../data/products';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  showWhatsAppFallback?: boolean;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-[#102A43] text-white border-rose-500/30'
                : toast.type === 'success'
                ? 'bg-white text-neutral-900 border-emerald-500/30'
                : 'bg-white text-neutral-900 border-neutral-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0 text-xs">
              <h4 className="font-semibold text-sm leading-tight mb-0.5">{toast.title}</h4>
              {toast.description && (
                <p
                  className={`leading-relaxed ${
                    toast.type === 'error' ? 'text-white/80' : 'text-neutral-600'
                  }`}
                >
                  {toast.description}
                </p>
              )}

              {toast.showWhatsAppFallback && (
                <a
                  href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health%2C%20necesito%20asistencia%20con%20mi%20pedido`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                  <span>Pedir directamente por WhatsApp</span>
                </a>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-neutral-200 p-1 -mr-1 -mt-1 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
