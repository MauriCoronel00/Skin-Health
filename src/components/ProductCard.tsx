import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Link2, Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { productLink } from '../utils/productLink';
import { productImageUrl } from '../data/productImage';
import { formatGuarani } from '../data/products';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onQuickView: (product: Product) => void;
  onAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onQuickView,
  onAdd,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAdd) return;
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl p-2 sm:p-3 border border-[#102A43]/10 hover:border-[#102A43]/25 hover:shadow-[0_6px_24px_rgba(16,42,67,0.12)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Top row: badge + actions (altura fija para alinear la grilla) */}
      <div className="flex items-center justify-between gap-1 mb-2 h-6">
        {product.badge ? (
          <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43] truncate max-w-[62%]">
            {product.badge}
          </span>
        ) : (
          <span className="inline-block text-xs text-transparent select-none">·</span>
        )}

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await navigator.clipboard.writeText(productLink(product.id));
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 1500);
              } catch {
                // Portapapeles no disponible: no hace nada.
              }
            }}
            className="text-neutral-400 hover:text-[#102A43] p-1 rounded-full hover:bg-neutral-100 transition-colors"
            title="Copiar link del producto"
            aria-label="Copiar link del producto"
          >
            {linkCopied ? <Link2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="text-neutral-400 hover:text-[#102A43] p-1 rounded-full hover:bg-neutral-100 transition-colors"
            title="Ver detalles del producto"
            aria-label="Ver detalles"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Image: cuadrado fijo sobre fondo tinteado, zoom sutil al hover */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-xl bg-[#FAF8F5] cursor-pointer overflow-hidden flex items-center justify-center p-3 sm:p-4"
      >
        {product.image && !imgError ? (
          <img
            src={productImageUrl(product.image, 400)}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" aria-label={product.name}>
            <span className="font-serif text-5xl font-semibold text-[#102A43]/15 select-none">
              {(product.name || '?').charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* If already in cart, subtle tag indicator */}
        {quantityInCart > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 bg-[#102A43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs"
          >
            {quantityInCart} en carrito
          </motion.span>
        )}
      </div>

      {/* Info: marca, nombre y fila de precio + agregar */}
      <div className="px-0.5 pt-2.5 pb-0.5">
        <p className="text-[10px] sm:text-[11px] font-medium text-neutral-400 truncate">
          {product.brand}
          {product.volume ? ` · ${product.volume}` : ''}
        </p>
        <h3
          onClick={() => onQuickView(product)}
          className="font-serif text-[13px] sm:text-sm font-semibold text-[#102A43] leading-snug line-clamp-2 min-h-[2.6em] mt-0.5 cursor-pointer hover:text-[#1e3a5f] transition-colors"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-sm sm:text-[15px] font-bold text-[#102A43] tabular-nums tracking-tight">
            {formatGuarani(product.price)}
          </span>
          {onAdd && (
            <button
              onClick={handleAdd}
              aria-label={`Agregar ${product.name} al pedido`}
              aria-pressed={justAdded}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-colors duration-300 ${
                justAdded
                  ? 'bg-[#93A896] text-[#102A43]'
                  : 'bg-[#102A43] text-white hover:bg-[#1e3a5f]'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="flex"
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="flex"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
