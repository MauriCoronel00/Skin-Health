import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Star, Eye, Share2, Link2 } from 'lucide-react';
import { Product } from '../types';
import { formatGuarani } from '../data/products';
import { productLink } from '../utils/productLink';
import { trackAddToCart } from '../utils/analytics';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  ratingAverage?: number;
  reviewsCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onQuickView,
  ratingAverage,
  reviewsCount,
}) => {
  const [showAddedAnim, setShowAddedAnim] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState<{ id: number; x: number; y: number }[]>([]);

  const displayRating = ratingAverage !== undefined ? ratingAverage : product.rating;
  const displayCount = reviewsCount !== undefined ? reviewsCount : product.reviewsCount;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showAddedAnim) return;

    onAddToCart(product);
    trackAddToCart(product, 1);

    // Micro-interaction: floating +1 bubble
    setShowAddedAnim(true);
    setTimeout(() => setShowAddedAnim(false), 900);

    const newAnimId = Date.now();
    setClickCoordinates((prev) => [...prev, { id: newAnimId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClickCoordinates((prev) => prev.filter((item) => item.id !== newAnimId));
    }, 800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl p-2 sm:p-3 border border-[#102A43]/10 hover:border-[#E8E6FF] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-2">
          {product.badge ? (
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#102A43]/5 text-[#102A43]">
              {product.badge}
            </span>
          ) : (
            <span className="inline-block text-[10px] text-neutral-400 font-medium">
              {product.volume}
            </span>
          )}

          {/* Quick View Button on Desktop Hover */}
          <div className="flex items-center gap-0.5">
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

        {/* Product Image */}
        <div
          onClick={() => onQuickView(product)}
          className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 cursor-pointer flex items-center justify-center p-2"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

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

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium mb-1">
          <span className="uppercase tracking-wider text-[#102A43]/70 font-semibold">
            {product.brand}
          </span>
          <span>{product.volume}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="font-medium text-sm sm:text-base text-neutral-900 leading-snug line-clamp-2 hover:text-[#102A43] cursor-pointer mb-1"
        >
          {product.name}
        </h3>

        {/* Subtitle / Key Benefit */}
        <p className="text-xs text-neutral-500 line-clamp-1 mb-2 font-normal">
          {product.subtitle}
        </p>

        {/* Rating */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="flex items-center gap-1.5 text-xs text-neutral-600 mb-2.5 hover:opacity-80 transition-opacity cursor-pointer group/rating"
          title="Ver opiniones del producto"
        >
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="ml-1 font-semibold text-neutral-800">{displayRating.toFixed(1)}</span>
          </div>
          <span className="text-neutral-400 group-hover/rating:text-[#102A43] transition-colors">
            ({displayCount})
          </span>
        </button>

        {/* Compact Key Benefits (Espacio optimizado y legible) */}
        {product.benefits && product.benefits.length > 0 && (
          <ul className="mb-3 space-y-1 bg-neutral-50/90 rounded-xl p-2 border border-neutral-100/90 text-[11px] leading-tight">
            {product.benefits.map((b, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-neutral-600"
                title={`${b.title}: ${b.desc}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#102A43]/60 mt-1 shrink-0" />
                <span className="line-clamp-1">
                  <strong className="font-semibold text-neutral-900">{b.title}:</strong>{' '}
                  <span className="text-neutral-500 font-normal">{b.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price & Add Button */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            Precio
          </span>
          <span className="font-semibold text-sm sm:text-base text-[#102A43] tracking-tight">
            {formatGuarani(product.price)}
          </span>
        </div>

        {/* Prominent Quick-Add "+" Button (Section 11) */}
        <div className="relative">
          <motion.button
            whileTap={!showAddedAnim ? { scale: 0.85 } : {}}
            onClick={handleAddClick}
            disabled={showAddedAnim}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm relative overflow-hidden ${
              showAddedAnim
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-[#102A43] hover:bg-[#102A43]/90 text-white hover:shadow-md'
            }`}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            <AnimatePresence mode="wait">
              {showAddedAnim ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Floating "+1" micro-feedback bubble */}
          <AnimatePresence>
            {showAddedAnim && (
              <motion.span
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -30, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="pointer-events-none absolute -top-4 -right-1 bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md z-20"
              >
                +1
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
