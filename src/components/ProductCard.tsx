import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { productLink } from '../utils/productLink';
import { productImageUrl } from '../data/productImage';

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
  const { formatCurrency, language, t } = useLanguage();

  const labels = {
    es: { lowStock: '¡Pocas unidades!', variants: 'variantes', inCart: 'en carrito' },
    pt: { lowStock: 'Poucas unidades!', variants: 'variantes', inCart: 'no carrinho' },
    en: { lowStock: 'Low stock!', variants: 'variants', inCart: 'in cart' },
  };
  const L = labels[language];
  const [linkCopied, setLinkCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Cargar estado de wishlist desde localStorage al montar (usando setTimeout para evitar setState sincrono)
  useEffect(() => {
    const saved = localStorage.getItem('skinhealth_wishlist_v1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const item = data.find((item: any) => item.product_id === product.id);
        // Usar setTimeout para evitar calling setState synchronously within an effect
        setTimeout(() => setIsInWishlist(!!item), 0);
      } catch {
        // Si hay error parsing, empezar limpio
      }
    }
  }, [product.id]);

  const handleToggleWishlist = () => {
    setIsInWishlist((prev) => {
      const newVal = !prev;
      // Guardar en localStorage
      const saved = localStorage.getItem('skinhealth_wishlist_v1');
      let data = saved ? JSON.parse(saved) : [];
      if (newVal) {
        // Agregar si no existe
        if (!data.some((item: any) => item.product_id === product.id)) {
          data.push({ product_id: product.id, created_at: new Date().toISOString() });
        }
      } else {
        // Remover
        data = data.filter((item: any) => item.product_id !== product.id);
      }
      localStorage.setItem('skinhealth_wishlist_v1', JSON.stringify(data));
      return newVal;
    });
  };

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
      className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-[#102A43]/10 hover:border-[#102A43]/25 hover:shadow-[0_4px_12px_rgba(16,42,67,0.08)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Top row: badge + actions (altura fija para alinear la grilla) */}
      <div className="flex items-center justify-between gap-2 mb-3 h-6">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {product.badge ? (
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43] truncate">
              {product.badge}
            </span>
          ) : (
            <span className="inline-block text-xs text-transparent select-none">·</span>
          )}
          {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
              {L.lowStock}
            </span>
          )}
          {product.variants && product.variants.length > 1 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43]">
              {product.variants.length} {L.variants}
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
              isInWishlist
                ? 'bg-amber-50 text-amber-700 border border-amber-100 hover:border-amber-200'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
            title={isInWishlist ? t.wishlistRemove : t.wishlistSave}
            aria-label={isInWishlist ? t.wishlistRemove : t.wishlistSave}
          >
            {isInWishlist ? (
              <Check className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            ) : (
              <Plus className="w-1.5 h-1.5" />
            )}
            <span className="hidden sm:inline">{" "}</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onQuickView(product)}
            className="text-neutral-400 hover:text-[#102A43] p-1 rounded-full hover:bg-neutral-100 transition-colors"
            title={t.productDetails}
            aria-label={t.productDetails}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Image: cuadrado fijo sobre fondo tinteado, zoom sutil al hover */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-xl bg-slate-50 cursor-pointer overflow-hidden flex items-center justify-center p-4 sm:p-5 tap-feedback"
      >
        {product.image && !imgError ? (
          <img
            src={productImageUrl(product.image, 400)}
            alt={product.name}
            className="w-full h-full object-contain object-center mix-blend-multiply brightness-[1.06] contrast-[1.08] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
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
            {quantityInCart} {L.inCart}
          </motion.span>
        )}
      </div>

      {/* Info: marca, nombre y fila de precio + agregar */}
      <div className="px-2 pt-3 pb-2">
        <p className="text-[10px] sm:text-[11px] font-medium text-neutral-400 truncate">
          {product.brand}
          {product.volume ? ` · ${product.volume}` : ''}
          {product.variants?.[0]?.size && ` ${product.variants[0].size}`}
        </p>
        <h3
          onClick={() => onQuickView(product)}
          className="font-serif text-[13px] sm:text-sm font-semibold text-[#102A43] leading-snug line-clamp-2 min-h-[2.6em] mt-0.5 cursor-pointer hover:text-[#1e3a5f] transition-colors"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-3 mt-3">
          <span className="text-sm sm:text-[15px] font-bold text-[#102A43] tabular-nums tracking-tight">
            {formatCurrency(product.price)}
          </span>
          {onAdd && (
            <button
              onClick={handleAdd}
              aria-label={t.addToOrderAria.replace('{name}', product.name)}
              aria-pressed={justAdded}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform duration-150 ease-out active:brightness-95 transition-colors duration-300 ${
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