import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

export const CollapsibleRoutines: React.FC = () => {
  const { supabase } = useSupabase();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutines();
  }, [supabase]);

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skincare_routines')
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.error('Supabase error fetching routines:', error);
        throw error;
      }
      console.log('Routines data from Supabase:', data);
      setRoutines(data || []);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching routines from Supabase:', err.message || err);
      // Still set loading to false so UI doesn't get stuck
      setLoading(false);
    }
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

  return (
    <>
      <section id="rutinas" className="my-12 sm:my-16 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102A43]/5 text-[#102A43] text-xs font-semibold tracking-wider uppercase mb-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
            <span>Guía visual simple y ordenada</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#102A43] tracking-tight">
            Rutinas de Skincare
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Guía Orientativa: Productos organizados por necesidad de la piel, con el orden de aplicación indicado para facilitar la venta y explicar cada rutina al cliente.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {routines.length === 0 && !loading && (
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
{routine.steps.map((step) => {
                        const productId = step.productId || step.stepNumber.toString();
                        const price = step.priceGs || 0;
                        const productNote = step.note || '';
                        // Acortar nombre del producto para display en circulo
                        const shortLabel = step.label.length > 12 ? `${step.label.substring(0, 10)}...` : step.label;

                        return (
                          <motion.div
                            key={step.stepNumber}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + step.stepNumber * 0.05, duration: 0.2 }}
                            className="bg-[#FAF8F5] rounded-full p-2.5 border border-neutral-200/80 hover:border-[#102A43]/30 transition-all flex items-center justify-center min-w-max"
                          >
                            <span className="text-xs font-semibold text-neutral-800">
                              {shortLabel}
                            </span>
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