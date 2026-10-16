import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ShoppingBag, Repeat } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { fetchProducts } from '../data/products';
import { productImageUrl } from '../data/productImage';
import { RoutinesSectionSkeleton } from './Skeleton';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../types';

type ProductLookup = Record<string, Product>;

interface RoutineStep {
  productId: string;
  order: number;
  note?: string;
  label?: string;
  alternativeProductIds?: string[];
  stepNumber?: number;
}

interface SkincareRoutine {
  id: string;
  number: string | number;
  name: string;
  title: string;
  description?: string;
  steps: RoutineStep[];
  instructionText?: string;
  instructionType?: string;
  created_at?: string;
  updated_at?: string;
}

interface CollapsibleRoutinesProps {
  onAddRoutineToCart?: (products: Product[]) => void;
  onQuickView?: (product: Product) => void;
  /** Número ("01".."05") a expandir y mostrar (viene del quiz). */
  focusNumber?: string | null;
}

export const CollapsibleRoutines: React.FC<CollapsibleRoutinesProps> = ({ onAddRoutineToCart, onQuickView, focusNumber }) => {
  const { t, language, formatCurrency } = useLanguage();
  const { supabase } = useSupabase();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [routines, setRoutines] = useState<SkincareRoutine[]>([]);
  const [products, setProducts] = useState<ProductLookup>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedRoutineId, setAddedRoutineId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch en paralelo: rutinas (Supabase directo) + productos (helper)
      const [routinesRes, productsList] = await Promise.all([
        supabase
          .from('skincare_routines')
          .select('*'),
        fetchProducts().catch((e) => {
          console.error('⚠️ Error cargando productos:', e);
          return [] as Product[];
        }),
      ]);

      if (routinesRes.error) {
        setError(routinesRes.error.message || t.routinesError);
        throw routinesRes.error;
      }

      // Mapa productId → Product completo
      const lookup: ProductLookup = {};
      productsList.forEach((p) => {
        lookup[p.id] = p;
      });

      // Sort client-side por number numérico (tolerante a espacios/formato)
      const sortedRoutines = [...(routinesRes.data || [])].sort((a, b) => {
        const na = parseInt(String(a.number || '').trim(), 10) || 0;
        const nb = parseInt(String(b.number || '').trim(), 10) || 0;
        return na - nb;
      });

      // Mapear campos multilingües
      const localizedRoutines = sortedRoutines.map((r) => ({
        ...r,
        title: r[`title_${language}`] || r.title,
        steps: r[`steps_${language}`] || r.steps,
        instructionText: r[`instruction_text_${language}`] || r.instruction_text || r.instructionText,
      }));

      setProducts(lookup);
      setRoutines(localizedRoutines);
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.errUnexpected;
      console.error('❌ Excepción al fetch:', message);
      setError(message);
      setLoading(false);
    }
  }, [supabase, language, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const getRoutineProducts = (routine: SkincareRoutine): Product[] => {
    return (routine.steps || [])
      .map((step: RoutineStep) => (step.productId ? products[step.productId] : null))
      .filter((p: Product | null | undefined): p is Product => p != null);
  };

  const getRoutineTotal = (routine: SkincareRoutine): number => {
    return getRoutineProducts(routine).reduce((sum, p) => sum + (p.price || 0), 0);
  };

  const handleAddRoutine = (e: React.MouseEvent, routine: SkincareRoutine) => {
    e.stopPropagation();
    const routineProducts = getRoutineProducts(routine);
    if (routineProducts.length === 0 || !onAddRoutineToCart) return;

    onAddRoutineToCart(routineProducts);
    setAddedRoutineId(routine.id);
    setTimeout(() => setAddedRoutineId(null), 2000);
  };

  const toggleRoutine = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.forEach(_currentId => {
          if (_currentId !== id) next.delete(_currentId);
        });
        next.add(id);
      }
      return next;
    });
  };

  const isRoutineOpen = (id: string) => expanded.has(id);

  // Foco desde el quiz: expandir la rutina y llevarla a pantalla
  useEffect(() => {
    if (!focusNumber || routines.length === 0) return;
    const target = routines.find((r) => String(r.number).trim() === focusNumber.trim());
    if (!target) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(_prev => new Set([target.id]));
    setTimeout(() => {
      document.getElementById(`rutina-card-${target.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }, [focusNumber, routines]);

  if (loading) {
    return <RoutinesSectionSkeleton />;
  }

  // Si hubo error, mostrar mensaje útil
  if (error && !loading) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{t.routinesError}</p>
        <p className="mt-2 break-all">{error}</p>
        <p className="mt-4 text-sm text-neutral-600">
          {t.routinesCauses}
        </p>
        <ul className="mt-2 text-left text-neutral-600 text-xs max-w-lg mx-auto">
          <li>{t.routinesNoTable}</li>
          <li>{t.routinesRls}</li>
          <li>{t.routinesBadStructure}</li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <section id="rutinas" className="my-12 sm:my-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2C]" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#102A43]">{t.routinesBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43] tracking-tight">
            {t.routinesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            {t.routinesSubtitle}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {routines.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-neutral-500">
              {t.routinesNone}
            </div>
          )}

          {routines.map((routine) => {
            const id = routine.id;
            const isOpen = isRoutineOpen(id);
            const arrowIcon = isOpen ? <ChevronUp className="w-4 h-4 mt-1" /> : <ChevronDown className="w-4 h-4 mt-1" />;

            return (
              <motion.div
                key={id}
                id={`rutina-card-${id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35 }}
                className="bg-[var(--surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <button
                  type="button"
                  id={`rutina-trigger-${id}`}
                  onClick={() => toggleRoutine(id)}
                  aria-expanded={isOpen}
                  aria-controls={`rutina-panel-${id}`}
                  className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 bg-[var(--surface)] text-left cursor-pointer"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="text-sm font-bold text-[#102A43] bg-[#102A43]/10 px-2 py-0.5 rounded-lg shrink-0">
                      {routine.number}
                    </span>
                    <span className="min-w-0 block text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight leading-snug break-words">
                      {routine.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-[var(--text-main)]" aria-hidden="true">
                    {arrowIcon}
                  </span>
                </button>

                <motion.div
                  id={`rutina-panel-${id}`}
                  role="region"
                  aria-labelledby={`rutina-trigger-${id}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="overflow-hidden border-t border-neutral-100"
                >
                  <div className="p-5 sm:p-6">
                    {/* Steps Grid */}
                    <div className={`grid ${(routine.steps ?? []).length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4 relative`}>
                      {(routine.steps ?? []).map((step: RoutineStep) => {
                        const product = step.productId ? products[step.productId] : null;
                        const productName = product?.name || step.label;
                        const productBrand = product?.brand || '';
                        const productImage = product?.image;

                        const alternativeIds = step.alternativeProductIds || [];
                        const alternatives = alternativeIds
                          .map((id) => products[id])
                          .filter((p): p is Product => !!p);
                        const stepNote = step.note;

                        const canQuickView = !!(product && onQuickView);
                        const openQuickView = (e: React.MouseEvent, target: Product) => {
                          e.stopPropagation();
                          onQuickView?.(target);
                        };

                        return (
                          <motion.div
                            key={step.stepNumber}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + step.stepNumber * 0.05, duration: 0.2 }}
                            className={`bg-[var(--surface)] rounded-2xl p-3 border border-[var(--border-subtle)] hover:border-[#102A43]/30 hover:shadow-sm transition-all flex min-w-0 flex-col items-center text-center gap-2 ${
                              canQuickView ? 'cursor-pointer' : ''
                            }`}
                            onClick={(e) => {
                              if (canQuickView && product) openQuickView(e, product);
                            }}
                            role={canQuickView ? 'button' : undefined}
                            aria-label={
                              canQuickView
                                ? t.viewDetailsOf.replace('{brand}', productBrand).replace('{name}', productName)
                                : undefined
                            }
                          >
                            {/* Paso */}
                            <span className="w-full text-xs font-bold text-[#102A43]/70 uppercase tracking-wider leading-snug break-words">
                              {t.routinesStep} {step.stepNumber} · {step.label}
                            </span>

                            {/* Imagen del producto (80px) */}
                            {productImage && (
                              <img
                                src={productImage ? productImageUrl(productImage, 320) : productImage}
                                alt={productName}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full bg-[#FAF8F5] p-2 shadow-sm"
                                loading="lazy"
                              />
                            )}

                            {/* Marca + Nombre del producto */}
                            <div className="flex flex-col items-center gap-0.5">
                              {productBrand && (
                                <span className="text-xs font-semibold text-[#102A43]/70 uppercase">
                                  {productBrand}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-neutral-800 leading-tight line-clamp-2">
                                {productName}
                              </span>
                              {product?.price && (
                                <span className="text-xs font-semibold text-[#102A43] mt-1">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                            </div>

                            {/* Alternativas como mini-fichas con foto y precio */}
                            {alternatives.length > 0 && (
                              <div className="w-full mt-1 pt-2 border-t border-dashed border-neutral-200 flex flex-col items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                  <Repeat className="w-3 h-3" />
                                  O reemplazar por
                                </span>
                                <div className="flex flex-col gap-1.5 w-full">
                                  {alternatives.map((alt) => {
                                    const chipClickable = !!onQuickView;
                                    return (
                                      <button
                                        key={alt.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (chipClickable) onQuickView?.(alt);
                                        }}
                                        disabled={!chipClickable}
                                        className={`w-full flex items-center gap-2 p-1.5 rounded-xl border border-[#102A43]/10 bg-[#FAF8F5] text-left transition-all ${
                                          chipClickable
                                            ? 'hover:border-[#102A43]/30 hover:shadow-xs hover:bg-white cursor-pointer active:scale-[0.98]'
                                            : 'cursor-default'
                                        }`}
                                        aria-label={t.viewDetailsOf.replace('{brand}', alt.brand).replace('{name}', alt.name)}
                                      >
                                        <img
                                          src={productImageUrl(alt.image, 200)}
                                          alt={alt.name}
                                          loading="lazy"
                                          className="w-10 h-10 object-contain rounded-lg bg-white p-1 shrink-0 border border-neutral-100"
                                        />
                                        <span className="flex-1 min-w-0">
                                          <span className="block text-xs font-bold uppercase tracking-wider text-[#102A43]/60 leading-tight">
                                            {alt.brand}
                                          </span>
                                          <span className="block text-xs font-semibold text-neutral-800 leading-tight line-clamp-1">
                                            {alt.name}
                                          </span>
                                        </span>
                                        <span className="text-xs font-bold text-[#102A43] shrink-0">
                                          {formatCurrency(alt.price)}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Nota clínica del paso */}
                            {stepNote && (
                              <p className="text-xs text-neutral-500 italic leading-tight mt-1">
                                {stepNote}
                              </p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Instruction notice */}
                    {routine.instructionText && (
                      <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#102A43]/15 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed">
                        {routine.instructionType === 'ORDEN' ? (
                          <span className="w-4 h-4 text-[#102A43] shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
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
                    )}

                    {/* Botón Agregar Rutina al Carrito */}
                    {onAddRoutineToCart && (() => {
                      const routineProducts = getRoutineProducts(routine);
                      const total = getRoutineTotal(routine);
                      const isAdded = addedRoutineId === routine.id;
                      const disabled = routineProducts.length === 0;

                      return (
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#102A43]/5 to-[#102A43]/10 border border-[#102A43]/20">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-[#102A43]/70 uppercase tracking-wider">
                              {t.routineFullLabel.replace('{count}', String(routineProducts.length))}
                            </span>
                            <span className="text-lg font-bold text-[#102A43]">
                              {formatCurrency(total)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleAddRoutine(e, routine)}
                            disabled={disabled}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all shadow-sm ${
                              disabled
                                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                : isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#102A43] text-white hover:bg-[#102A43]/90 hover:shadow-md active:scale-95'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            {isAdded
                              ? `✓ ${t.routineAddedMsg}`
                              : t.routineAddCta.replace('{count}', String(routineProducts.length))}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};
