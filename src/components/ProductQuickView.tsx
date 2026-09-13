import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Plus, Check, ShieldCheck, Sparkles, Droplets } from 'lucide-react';
import { Product } from '../types';
import { formatGuarani } from '../data/products';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  quantityInCart: number;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  quantityInCart,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
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

              {/* Rating & reviews */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-neutral-600 mb-4">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span className="ml-1 font-bold text-neutral-900">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-neutral-400">({product.reviewsCount} reseñas verificadas)</span>
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
              Descripción & Beneficios
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

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
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
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
