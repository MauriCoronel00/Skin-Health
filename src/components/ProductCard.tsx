import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Plus, Check, Heart } from 'lucide-react';
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

  useEffect(() => {
    const saved = localStorage.getItem('skinhealth_wishlist_v1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const item = data.find((item: any) => item.product_id === product.id);
        setTimeout(() => setIsInWishlist(!!item), 0);
      } catch {
        // ignore parse errors, start fresh
      }
    }
  }, [product.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInWishlist((prev) => {
      const newVal = !prev;
      const saved = localStorage.getItem('skinhealth_wishlist_v1');
      let data = saved ? JSON.parse(saved) : [];
      if (newVal) {
        if (!data.some((item: any) => item.product_id === product.id)) {
          data.push({ product_id: product.id, created_at: new Date().toISOString() });
        }
      } else {
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
      className="group relative bg-white rounded-3xl p-4 border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Top row: badge + wishlist heart */}
      <div className="flex items-center justify-between gap-2 mb-3 h-6">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {product.badge ? (
            <span className="inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43] truncate">
              {product.badge}
            </span>
          ) : (
            <span className="inline-block text-xs text-transparent select-none">·</span>
          )}
          {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
              {L.lowStock}
            </span>
          )}
          {product.variants && product.variants.length > 1 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43]">
              {product.variants.length} {L.variants}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleWishlist}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isInWishlist
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-rose-500 hover:bg-white shadow-sm'
            }`}
            title={isInWishlist ? t.wishlistRemove : t.wishlistSave}
            aria-label={isInWishlist ? t.wishlistRemove : t.wishlistSave}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isInWishlist ? 'fill-current' : 'fill-none stroke-current'
              }`}
              aria-hidden="true"
            />
          </button>

          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-[#102A43] hover:bg-white shadow-sm transition-all duration-200"
            title={t.productDetails}
            aria-label={t.productDetails}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Image: cuadrado fijo sobre fondo neutro, zoom sutil al hover */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-2xl bg-gray-50 cursor-pointer overflow-hidden flex items-center justify-center p-3 tap-feedback"
      >
        {product.image && !imgError ? (
          <img
            src={productImageUrl(product.image, 400)}
            alt={product.name.replace(/[^\p{L}\p{N}\s\p{P}]/gu, '').trim()}
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
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

        {quantityInCart > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 bg-[#102A43] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs"
          >
            {quantityInCart} {L.inCart}
          </motion.span>
        )}
      </div>

      {/* Info: marca, nombre y fila de precio + agregar */}
      <div className="pt-3 pb-2">
        <p className="text-xs font-medium text-[var(--text-muted)] truncate">
          {product.brand}
          {product.volume ? ` · ${product.volume}` : ''}
          {product.variants?.[0]?.size && ` ${product.variants[0].size}`}
        </p>
        <h3
          onClick={() => onQuickView(product)}
          className="font-serif text-sm font-semibold text-[var(--text-main)] leading-snug line-clamp-2 min-h-[2.6em] mt-0.5 cursor-pointer hover:text-[#1e3a5f] transition-colors"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-3 mt-3">
          <span className="text-sm font-bold text-[var(--text-main)] tabular-nums tracking-tight">
            {formatCurrency(product.price)}
          </span>
          {onAdd && (
            <button
              onClick={handleAdd}
              aria-label={t.addToOrderAria.replace('{name}', product.name)}
              aria-pressed={justAdded}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform duration-150 ease-out active:brightness-95 transition-colors duration-300 ${
                justAdded
                  ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-ink)]'
                  : 'bg-[var(--text-main)] text-white hover:bg-[var(--brand-navy-hover)]'
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
                    <Check className="w-4.5 h-4.5" strokeWidth={3} />
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
                    <Plus className="w-4.5 h-4.5" />
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