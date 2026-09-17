import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Star, Plus, Check, ShieldCheck, Sparkles, Droplets, MessageSquarePlus } from 'lucide-react';
import { Product, ProductReview, ReviewUser } from '../types';
import { formatGuarani } from '../data/products';
import { trackAddToCart } from '../utils/analytics';
import { ProductReviewsSection } from './ProductReviewsSection';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  quantityInCart: number;
  reviews: ProductReview[];
  onOpenReviewModal: (product: Product) => void;
  currentUser: ReviewUser | null;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  quantityInCart,
  reviews,
  onOpenReviewModal,
  currentUser,
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    if (justAdded) return;
    onAddToCart(product);
    trackAddToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors shadow-xs"
          aria-label="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Header & Brand */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Packshot */}
            <div className="w-48 h-48 sm:w-52 sm:h-52 bg-[#FAF8F5] rounded-2xl p-4 flex items-center justify-center shrink-0 border border-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Title & Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#102A43]">
                  {product.brand}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">{product.volume}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 leading-tight mb-2">
                {product.name}
              </h3>

              <p className="text-sm text-neutral-600 mb-3 font-normal">
                {product.subtitle}
              </p>

              {/* Rating & reviews shortcut */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm text-neutral-600 mb-4 flex-wrap">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="flex items-center text-amber-500 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span className="ml-1 font-bold text-neutral-900">{product.rating.toFixed(1)}</span>
                </button>
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="text-neutral-500 hover:text-[#102A43] hover:underline cursor-pointer text-xs"
                >
                  ({product.reviewsCount} opiniones de clientes)
                </button>
                <span className="text-neutral-300">•</span>
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(product)}
                  className="text-xs font-semibold text-[#102A43] hover:underline cursor-pointer"
                >
                  Dejar opinión
                </button>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-[#102A43]">
                {formatGuarani(product.price)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#102A43] mb-1.5">
              Descripción
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#102A43] mb-2">
                Beneficios Principales
              </h4>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#102A43]/10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#102A43] mt-2 shrink-0" />
                    <div>
                      <strong className="font-semibold text-neutral-900">{b.title}:</strong>{' '}
                      <span className="text-neutral-600">{b.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Ingredients */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#102A43] mb-2">
              Ingredientes Activos Clave
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.keyIngredients.map((ingredient, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#FAF8F5] text-[#102A43] border border-[#102A43]/10 px-2.5 py-1 rounded-lg font-medium"
                >
                  ✨ {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Skin Type & How to use */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#102A43]/5 text-xs">
            <div>
              <span className="font-semibold text-[#102A43] block mb-1">
                Tipo de Piel:
              </span>
              <p className="text-neutral-600">{product.skinType}</p>
            </div>
            <div>
              <span className="font-semibold text-[#102A43] block mb-1">
                Modo de Uso:
              </span>
              <p className="text-neutral-600">{product.howToUse}</p>
            </div>
          </div>

          {/* Section: Opiniones de clientes */}
          <div ref={reviewsSectionRef} className="pt-2">
            <ProductReviewsSection
              product={product}
              reviews={reviews}
              onOpenReviewModal={() => onOpenReviewModal(product)}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Modal Action footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-neutral-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
              Precio Unitario
            </span>
            <span className="text-lg font-bold text-[#102A43]">
              {formatGuarani(product.price)}
            </span>
          </div>

          <motion.button
            whileTap={!justAdded ? { scale: 0.95 } : {}}
            onClick={handleAdd}
            disabled={justAdded}
            className={`flex-1 max-w-xs py-3 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#102A43] hover:bg-[#102A43]/90 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>
                  {quantityInCart > 0
                    ? `Agregar otro (+${quantityInCart} en carrito)`
                    : 'Agregar al Pedido'}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
