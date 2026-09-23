import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ShoppingBag, Repeat } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { fetchProducts, formatGuarani } from '../data/products';
import { SKINCARE_ROUTINES } from '../data/routines';
import type { Product } from '../types';

type ProductLookup = Record<string, Product>;

interface CollapsibleRoutinesProps {
  onAddRoutineToCart?: (products: Product[]) => void;
  onQuickView?: (product: Product) => void;
}

export const CollapsibleRoutines: React.FC<CollapsibleRoutinesProps> = ({ onAddRoutineToCart, onQuickView }) => {
  const { supabase } = useSupabase();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [routines, setRoutines] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductLookup>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedRoutineId, setAddedRoutineId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
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
        setError(routinesRes.error.message || 'Error cargando rutinas');
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

      setProducts(lookup);
      setRoutines(sortedRoutines);
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Excepción al fetch:', err.message || err);
      setError(err.message || 'Error inesperado');
      setLoading(false);
    }
  };

  const getRoutineProducts = (routine: any): Product[] => {
    return (routine.steps || [])
      .map((step: any) => (step.productId ? products[step.productId] : null))
      .filter((p: Product | null): p is Product => p !== null);
  };

  const getRoutineTotal = (routine: any): number => {
    return getRoutineProducts(routine).reduce((sum, p) => sum + (p.price || 0), 0);
  };

  const handleAddRoutine = (e: React.MouseEvent, routine: any) => {
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
        next.forEach(currentId => {
          if (currentId !== id) next.delete(currentId);
        });
        next.add(id);
      }
      return next;
    });
  };

  const isRoutineOpen = (id: string) => expanded.has(id);

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-500">
        Cargando rutinas de skincare...
      </div>
    );
  }

  // Si hubo error, mostrar mensaje útil
  if (error && !loading) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error cargando rutinas:</p>
        <p className="mt-2 break-all">{error}</p>
        <p className="mt-4 text-sm text-neutral-600">
          Possibles causas:
        </p>
        <ul className="mt-2 text-left text-neutral-600 text-xs max-w-lg mx-auto">
          <li>Tabla skincare_routines sin datos</li>
          <li>RLS (Row Level Security) bloqueando acceso anon</li>
          <li>Estructura de tabla incorrecta</li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <section id="rutinas" className="my-12 sm:my-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102A43]/5 text-[#102A43] text-xs font-semibold tracking-wider uppercase mb-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
            <span>5 rituales · 5 tipos de piel</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43] tracking-tight">
            Encontrá tu rutina
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Cada rutina son 3 a 4 pasos con productos oficiales, en el orden correcto de aplicación. Elegí la que va con tu piel y llevala completa.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {routines.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-neutral-500">
              No se encontraron rutinas
            </div>
          )}

          {routines.map((routine) => {
            const id = routine.id;
            const isOpen = isRoutineOpen(id);
            const arrowIcon = isOpen ? <ChevronUp className="w-4 h-4 mt-1" /> : <ChevronDown className="w-4 h-4 mt-1" />;
            const containerHeight = isOpen ? 'unset' : '96px';

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl border border-[#102A43]/15 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                role="button"
                aria-expanded={isOpen}
                aria-label={`Ver ${routine.title}`}
                onClick={() => toggleRoutine(id)}
              >
                {/* Routine Header - entire header is clickable */}
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

                    {/* Toggle arrow in top right */}
                    <div className="flex items-center gap-2">
                      {arrowIcon}
                    </div>
                  </div>

                  {/* Routine Content - collapsible height */}
                  <motion.div
                    style={{ height: containerHeight }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                      duration: isOpen ? 300 : 150,
                    }}
                    className="p-5 sm:p-6 border-t border-neutral-100"
                  >
                    {/* Steps Grid */}
                    <div className={`grid ${routine.steps.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4 relative`}>
                      {routine.steps.map((step: any) => {
                        const product = step.productId ? products[step.productId] : null;
                        const productName = product?.name || step.label;
                        const productBrand = product?.brand || '';
                        const productImage = product?.image;

                        // Enriquecer con alternativas + nota desde datos hardcodeados
                        const hardcodedRoutine = SKINCARE_ROUTINES.find((r) => r.id === routine.id);
                        const hardcodedStep = hardcodedRoutine?.steps.find((s) => s.stepNumber === step.stepNumber);
                        const alternativeIds = hardcodedStep?.alternativeProductIds || [];
                        const alternatives = alternativeIds
                          .map((id) => products[id])
                          .filter((p): p is Product => !!p);
                        const stepNote = hardcodedStep?.note;

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
                            className={`bg-white rounded-2xl p-3 border border-neutral-200/80 hover:border-[#102A43]/30 hover:shadow-sm transition-all flex flex-col items-center text-center gap-2 ${
                              canQuickView ? 'cursor-pointer' : ''
                            }`}
                            onClick={(e) => {
                              if (canQuickView && product) openQuickView(e, product);
                            }}
                            role={canQuickView ? 'button' : undefined}
                            aria-label={canQuickView ? `Ver detalles de ${productBrand} ${productName}` : undefined}
                          >
                            {/* Paso */}
                            <span className="text-xs font-bold text-[#102A43]/70 uppercase tracking-wider">
                              Paso {step.stepNumber} · {step.label}
                            </span>

                            {/* Imagen del producto (80px) */}
                            {productImage && (
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-20 h-20 object-contain rounded-full bg-[#FAF8F5] p-2 shadow-sm"
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
                                  {formatGuarani(product.price)}
                                </span>
                              )}
                            </div>

                            {/* Alternativas como chips clickeables */}
                            {alternatives.length > 0 && (
                              <div className="w-full mt-1 pt-2 border-t border-dashed border-neutral-200 flex flex-col items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                  <Repeat className="w-3 h-3" />
                                  O reemplazar por
                                </span>
                                <div className="flex flex-wrap justify-center gap-1">
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
                                        className={`text-xs px-2 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 ${
                                          chipClickable
                                            ? 'hover:bg-amber-100 hover:border-amber-300 cursor-pointer transition-colors'
                                            : 'cursor-default'
                                        }`}
                                        aria-label={`Ver detalles de ${alt.brand} ${alt.name}`}
                                      >
                                        <span className="font-semibold">{alt.brand}</span> · {alt.name}
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
                              Rutina completa · {routineProducts.length} productos
                            </span>
                            <span className="text-lg font-bold text-[#102A43]">
                              {formatGuarani(total)}
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
                            {isAdded ? '✓ Listo, va en tu pedido' : `Llevo esta rutina (${routineProducts.length})`}
                          </button>
                        </div>
                      );
                    })()}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};