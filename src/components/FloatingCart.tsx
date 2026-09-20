import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatGuarani } from '../data/products';

interface FloatingCartProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  lastAddedTime?: number;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({
  totalItems,
  totalAmount,
  onOpenCart,
  lastAddedTime,
}) => {
  const [pulse, setPulse] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' = 'light') => {
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'light' ? 10 : 20);
    }
  };

  // Trigger pulse effect when an item is added
  useEffect(() => {
    if (lastAddedTime) {
      setPulse(true);
      triggerHaptic('medium');
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTime, totalItems]);

  const handleTouchStart = () => {
    setPressed(true);
    triggerHaptic('light');
  };

  const handleTouchEnd = () => {
    setPressed(false);
  };

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <aside
          aria-label="Carrito flotante de compras"
          className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center pb-safe"
        >
          <motion.div
            id="floating-cart-bar"
            role="region"
            aria-live="polite"
            initial={{ y: 90, opacity: 0, scale: 0.92 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: pulse ? 1.03 : pressed ? 0.98 : 1,
            }}
            exit={{ y: 90, opacity: 0, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            className="pointer-events-auto w-full max-w-md sm:max-w-lg bg-[#0E2338]/95 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-white/15 shadow-black/25 select-none active:scale-[0.98] transition-transform"
          >
            {/* Top row: Cart icon + count and Total price */}
            <div className="flex items-center justify-between gap-3 mb-2.5 px-1">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{
                    scale: pulse ? [1, 1.25, 1] : 1,
                    rotate: pulse ? [0, -8, 8, 0] : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <div className="flex items-baseline gap-1.5">
                  <motion.span
                    key={totalItems}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-bold text-base sm:text-lg tracking-tight"
                  >
                    {totalItems}
                  </motion.span>
                  <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                    {totalItems === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
              </div>

              {/* Total amount formatted in Guaraníes */}
              <div className="text-right">
                <motion.span
                  key={totalAmount}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-semibold text-base sm:text-lg text-emerald-300 tracking-tight"
                >
                  {formatGuarani(totalAmount)}
                </motion.span>
              </div>
            </div>

            {/* Bottom Row / CTA button: "Ver pedido →" */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCart}
              className="w-full bg-white hover:bg-neutral-100 text-[#0E2338] font-semibold text-sm sm:text-base py-2.5 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md group"
            >
              <span>Ver pedido</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
};
