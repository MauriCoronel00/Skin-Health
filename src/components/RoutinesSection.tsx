import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Plus, Sparkles, AlertCircle, Info, ShoppingBag } from 'lucide-react';
import { SkincareRoutine, Product } from '../types';
import { SKINCARE_ROUTINES } from '../data/routines';
import { formatGuarani } from '../data/products';
import { productImageUrl } from '../data/productImage';

interface RoutinesSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddMultipleToCart: (products: Product[]) => void;
  onQuickView: (product: Product) => void;
  cartQuantities: Record<string, number>;
}
export const RoutinesSection: React.FC<RoutinesSectionProps> = ({
  products,
  onAddToCart,
  onAddMultipleToCart,
  onQuickView,
  cartQuantities,
}) => {
  const [addedRoutineId, setAddedRoutineId] = useState<string | null>(null);
  // Store selected option per routine step: key is `${routineId}-${stepNumber}` -> productId
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Helper to find full product by ID
const getProduct = (productId: string): Product | undefined => {
  return products.find((p) => p.id === productId);
};

  const getActiveProductId = (routineId: string, stepNumber: number, defaultId: string): string => {
    const key = `${routineId}-${stepNumber}`;
    return selectedOptions[key] || defaultId;
  };

  const handleSelectOption = (routineId: string, stepNumber: number, productId: string) => {
    const key = `${routineId}-${stepNumber}`;
    setSelectedOptions((prev) => ({ ...prev, [key]: productId }));
  };

  const handleAddFullRoutine = (routine: SkincareRoutine) => {
    const productsToAdd: Product[] = [];
    for (const step of routine.steps) {
      const activeId = getActiveProductId(routine.id, step.stepNumber, step.productId);
      const prod = getProduct(activeId);
      if (prod) productsToAdd.push(prod);
    }

    if (productsToAdd.length > 0) {
      onAddMultipleToCart(productsToAdd);
      setAddedRoutineId(routine.id);
      setTimeout(() => setAddedRoutineId(null), 1400);
    }
  };

  return (
    <section id="rutinas" className="my-12 sm:my-16 scroll-mt-20">
      {/* Header section based on PDF */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102A43]/5 text-[#102A43] text-xs font-semibold tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Guía visual simple y ordenada</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43] tracking-tight">
          Rutinas de Skincare
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
          Guía Orientativa: Productos organizados por necesidad de la piel, con el orden de aplicación indicado para facilitar la venta y explicar cada rutina al cliente.
        </p>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-6 sm:space-y-8">
        {SKINCARE_ROUTINES.map((routine) => {
          // Calculate routine sum based on currently selected active products
          const routineProducts = routine.steps
            .map((s) => getProduct(getActiveProductId(routine.id, s.stepNumber, s.productId)))
            .filter((p): p is Product => Boolean(p));

          const routineTotalPrice = routineProducts.reduce(
            (acc, curr) => acc + curr.price,
            0
          );

          const isJustAdded = addedRoutineId === routine.id;
          const gridColsClass =
            routine.steps.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

          return (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl border border-[#102A43]/15 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Routine Header */}
              <div className="p-5 sm:p-6 border-b border-neutral-100 bg-[#FAF8F5]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#102A43] bg-[#102A43]/10 px-2 py-0.5 rounded-lg">
                      {routine.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                      {routine.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#102A43]/80 font-medium mt-1">
                    {routine.goal}
                  </p>
                </div>

                {/* Right: Routine Price & Add All Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-200">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Rutina Completa
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#102A43]">
                      {formatGuarani(routineTotalPrice)}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddFullRoutine(routine)}
                    className={`text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#102A43] hover:bg-[#102A43]/90 text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Rutina Agregada!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar Rutina Completa</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Steps Visual Layout */}
              <div className="p-5 sm:p-6">
                <div className={`grid ${gridColsClass} gap-4 relative`}>
                  {routine.steps.map((step) => {
                    const activeId = getActiveProductId(routine.id, step.stepNumber, step.productId);
                    const product = getProduct(activeId);
                    if (!product) return null;

                    const inCartCount = cartQuantities[product.id] || 0;
                    const allOptions = [step.productId, ...(step.alternativeProductIds || [])];
                    const hasOptions = allOptions.length > 1;

                    return (
                      <div
                        key={step.stepNumber}
                        className="relative group bg-[#FAF8F5] rounded-2xl p-4 border border-neutral-200/80 hover:border-[#102A43]/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Step indicator tag */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                                {step.stepNumber}
                              </span>
                              <span className="text-xs font-bold text-neutral-800">
                                {step.label}
                              </span>
                            </div>

                            {inCartCount > 0 && (
                              <span className="text-[10px] bg-[#102A43] text-white font-bold px-1.5 py-0.5 rounded-md">
                                {inCartCount} en carrito
                              </span>
                            )}
                          </div>

                          {/* Options selector tabs if step has alternatives */}
                          {hasOptions && (
                            <div className="mb-2.5 p-1 bg-white/90 rounded-xl border border-neutral-200/70">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block px-1 mb-1">
                                Opciones de producto:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {allOptions.map((optId) => {
                                  const optProduct = getProduct(optId);
                                  if (!optProduct) return null;
                                  const isSelected = optId === activeId;
                                  return (
                                    <button
                                      key={optId}
                                      onClick={() => handleSelectOption(routine.id, step.stepNumber, optId)}
                                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer truncate max-w-full ${
                                        isSelected
                                          ? 'bg-[#102A43] text-white shadow-2xs'
                                          : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80'
                                      }`}
                                      title={optProduct.name}
                                    >
                                      {optProduct.brand === 'La Roche-Posay'
                                        ? 'Effaclar'
                                        : optProduct.name.replace('Facial Cleanser', '').replace('Solution', '').trim()}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Thumbnail & Product Details */}
                          <div
                            onClick={() => onQuickView(product)}
                            className="flex items-center gap-3 cursor-pointer py-1"
                          >
                            <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-neutral-100 overflow-hidden">
                              <img
                                src={productImageUrl(product.image, 200)}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-semibold text-[#102A43]/70 uppercase tracking-wider block">
                                {product.brand}
                              </span>
                              <h4 className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#102A43]">
                                {product.name}
                              </h4>
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                {step.note || product.volume}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price & Individual Add Button */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-200/80 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#102A43]">
                            {formatGuarani(product.price)}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:border-[#102A43] text-neutral-700 hover:text-[#102A43] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title={`Agregar ${product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Callout Notice from PDF (ORDEN / IMPORTANTE) */}
                {routine.instructionText && (
                  <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#102A43]/15 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed">
                    {routine.instructionType === 'ORDEN' ? (
                      <Info className="w-4 h-4 text-[#102A43] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-[#102A43] mr-1">
                        {routine.instructionType || 'NOTA'}:
                      </span>
                      <span>
                        {routine.instructionText.replace(
                          `${routine.instructionType}: `,
                          ''
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

