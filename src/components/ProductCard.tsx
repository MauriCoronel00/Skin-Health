import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Link2, Eye, Plus } from 'lucide-react';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl p-2 sm:p-3 border border-[#102A43]/10 hover:border-[#102A43]/20 hover:shadow-[0_4px_20px_rgba(16,42,67,0.1)] transition-all duration-300"
    >
      {/* Top row: badge + actions (altura fija para alinear la grilla) */}
      <div className="flex items-center justify-between gap-1 mb-2 h-6">
        {product.badge ? (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43] truncate">
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

      {/* Product Image: cuadrado fijo, todas las cards igual altura */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-xl bg-white cursor-pointer overflow-hidden flex items-center justify-center p-3"
      >
        {product.image && !imgError ? (
          <img
            src={productImageUrl(product.image, 400)}
            alt={product.name}
            className="w-full h-full object-contain"
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

        {/* Price chip + quick add (comparar y comprar sin abrir la ficha) */}
        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[#102A43] text-[11px] font-bold px-2 py-1 rounded-full shadow-xs border border-[#102A43]/10">
          {formatGuarani(product.price)}
        </span>
        {onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            aria-label={`Agregar ${product.name} al pedido`}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#102A43] text-white flex items-center justify-center shadow-md hover:bg-[#102A43]/90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
