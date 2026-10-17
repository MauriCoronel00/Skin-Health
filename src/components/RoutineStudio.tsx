import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import type { Language, Product } from '../types';

/* ------------------------------------------------------------------ */
/* Modelo: 4 pasos mapeados a las categorías reales de los productos   */
/* ------------------------------------------------------------------ */

type StepId = 'cleanse' | 'treat' | 'moisturize' | 'protect';
type ConcernId = 'cleanse' | 'brighten' | 'calm' | 'hydrate' | 'protect';
type SkinId = 'grasa' | 'mixta' | 'seca' | 'sensible';

interface StepDef {
  id: StepId;
  num: string;
  cats: string[];
}

const STEPS: StepDef[] = [
  { id: 'cleanse', num: '01', cats: ['cleanse'] },
  { id: 'treat', num: '02', cats: ['brighten', 'calm'] },
  { id: 'moisturize', num: '03', cats: ['hydrate'] },
  { id: 'protect', num: '04', cats: ['protect'] },
];

const STEP_LABEL: Record<StepId, Record<Language, string>> = {
  cleanse: { es: 'Limpiar', pt: 'Limpar', en: 'Cleanse' },
  treat: { es: 'Tratar', pt: 'Tratar', en: 'Treat' },
  moisturize: { es: 'Hidratar', pt: 'Hidratar', en: 'Moisturize' },
  protect: { es: 'Proteger', pt: 'Proteger', en: 'Protect' },
};

const STEP_BLURB: Record<StepId, Record<Language, string>> = {
  cleanse: { es: 'Sacá maquillaje, protector y exceso de grasa.', pt: 'Tire maquiagem, protetor e oleosidade.', en: 'Remove makeup, SPF and oil.' },
  treat: { es: 'Trabajá una necesidad a la vez.', pt: 'Trabalhe uma necessidade por vez.', en: 'Work on one concern at a time.' },
  moisturize: { es: 'Retené el agua en la piel.', pt: 'Retenha água na pele.', en: 'Keep water in your skin.' },
  protect: { es: 'Protector solar, todas las mañanas.', pt: 'Protetor solar, todas as manhãs.', en: 'SPF, every morning.' },
};

const CONCERNS: { id: ConcernId; cat: string }[] = [
  { id: 'brighten', cat: 'brighten' },
  { id: 'calm', cat: 'calm' },
  { id: 'hydrate', cat: 'hydrate' },
  { id: 'protect', cat: 'protect' },
];

const SKINS: SkinId[] = ['grasa', 'mixta', 'seca', 'sensible'];

const copy = {
  es: {
    eyebrow: 'Armá tu rutina',
    q1: '¿Cómo está tu piel la mayoría de los días?',
    types: { grasa: 'Grasa', mixta: 'Mixta', seca: 'Seca', sensible: 'Sensible' } as Record<SkinId, string>,
    q2: '¿Qué te gustaría cambiar primero?',
    concerns: { brighten: 'Iluminar', calm: 'Calmar', hydrate: 'Hidratar', protect: 'Proteger' } as Record<ConcernId, string>,
    q3: '¿Cuántos pasos por día querés?',
    steps2: 'Dos', steps3: 'Tres', steps4: 'Los cuatro',
    sentence: { before: 'Mi piel es', mid: 'me gustaría empezar por', after: 'en', tail: 'pasos por día.' },
    yourRoutine: 'Tu rutina',
    addAll: (total: string) => `Agregar mi rutina · ${total}`,
    changeAnswers: 'Cambiar respuestas',
    startOver: 'Empezar de nuevo',
    pick: 'Elegí un producto por paso',
    add: 'Agregar',
    added: 'Agregada',
    total: 'Total',
    empty: 'Estamos cargando el catálogo…',
    why: 'Por qué',
    step: 'Paso',
  },
  pt: {
    eyebrow: 'Monte sua rotina',
    q1: 'Como está sua pele na maioria dos dias?',
    types: { grasa: 'Oleosa', mixta: 'Mista', seca: 'Seca', sensible: 'Sensível' } as Record<SkinId, string>,
    q2: 'O que você gostaria de mudar primeiro?',
    concerns: { brighten: 'Iluminar', calm: 'Acalmar', hydrate: 'Hidratar', protect: 'Proteger' } as Record<ConcernId, string>,
    q3: 'Quantos passos por dia você quer?',
    steps2: 'Dois', steps3: 'Três', steps4: 'Os quatro',
    sentence: { before: 'Minha pele é', mid: 'gostaria de começar por', after: 'em', tail: 'passos por dia.' },
    yourRoutine: 'Sua rotina',
    addAll: (total: string) => `Adicionar minha rotina · ${total}`,
    changeAnswers: 'Mudar respostas',
    startOver: 'Começar de novo',
    pick: 'Escolha um produto por passo',
    add: 'Adicionar',
    added: 'Adicionada',
    total: 'Total',
    empty: 'Carregando o catálogo…',
    why: 'Por quê',
    step: 'Passo',
  },
  en: {
    eyebrow: 'Build your routine',
    q1: 'What is your skin like most days?',
    types: { grasa: 'Oily', mixta: 'Combination', seca: 'Dry', sensible: 'Sensitive' } as Record<SkinId, string>,
    q2: 'What would you change first?',
    concerns: { brighten: 'Brighten', calm: 'Calm', hydrate: 'Hydrate', protect: 'Protect' } as Record<ConcernId, string>,
    q3: 'How many steps a day do you want?',
    steps2: 'Two', steps3: 'Three', steps4: 'All four',
    sentence: { before: 'My skin is', mid: "I'd like to start with", after: 'in', tail: 'steps a day.' },
    yourRoutine: 'Your routine',
    addAll: (total: string) => `Add my routine · ${total}`,
    changeAnswers: 'Change answers',
    startOver: 'Start over',
    pick: 'Pick one product for each step',
    add: 'Add',
    added: 'Added',
    total: 'Total',
    empty: 'Loading the catalog…',
    why: 'Why',
    step: 'Step',
  },
};

/* ------------------------------------------------------------------ */
/* Carrusel con vecinos que asoman + selección animada                 */
/* ------------------------------------------------------------------ */

interface PeekCarouselProps<T> {
  items: T[];
  keyOf: (item: T) => string;
  renderCard: (item: T, active: boolean) => React.ReactNode;
}

function PeekCarousel<T>({ items, keyOf, renderCard }: PeekCarouselProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setCenter(best);
  }, []);

  useEffect(() => {
    onScroll();
  }, [items.length, onScroll]);

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2"
      style={{ paddingLeft: 'calc(50% - 7.5rem)', paddingRight: 'calc(50% - 7.5rem)' }}
    >
      {items.map((item, i) => {
        const active = i === center;
        return (
          <motion.button
            key={keyOf(item)}
            type="button"
            onClick={() => {
              const el = ref.current;
              const child = el?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }}
            animate={{
              opacity: active ? 1 : 0.45,
              filter: active ? 'blur(0px)' : 'blur(2px)',
              scale: active ? 1 : 0.93,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="snap-center shrink-0 w-60 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D3B]/40 rounded-3xl"
            aria-pressed={active}
          >
            {renderCard(item, active)}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chips de la oración                                                 */
/* ------------------------------------------------------------------ */

const Chip: React.FC<{ value: string; onClick: () => void; label: string }> = ({ value, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="group inline-flex items-center gap-1 border-b-2 border-[#1E4D3B]/40 text-[#1E4D3B] hover:border-[#C98A2C] transition-colors"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </button>
);

const Placeholder: React.FC<{ text: string }> = ({ text }) => (
  <span className="text-[#1E4D3B]/25">{text}</span>
);

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export const RoutineStudio: React.FC = () => {
  const { language, formatCurrency } = useLanguage();
  const { products } = useProducts();
  const { addMultipleToCart } = useCart();
  const c = copy[language];

  const [skin, setSkin] = useState<SkinId | null>(null);
  const [concern, setConcern] = useState<ConcernId | null>(null);
  const [steps, setSteps] = useState<2 | 3 | 4 | null>(null);
  const [picks, setPicks] = useState<Partial<Record<StepId, Product>>>({});
  const [added, setAdded] = useState(false);

  const activeSteps = useMemo<StepDef[]>(() => {
    if (steps === 2) return STEPS.filter((s) => s.id === 'cleanse' || s.id === 'moisturize');
    if (steps === 3) return STEPS.filter((s) => s.id !== 'protect');
    return STEPS;
  }, [steps]);

  const poolByStep = useMemo(() => {
    const map: Partial<Record<StepId, Product[]>> = {};
    for (const s of STEPS) {
      map[s.id] = products
        .filter((p) => s.cats.includes(p.category))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return map;
  }, [products]);

  const recommended = useCallback(
    (s: StepDef): Product | null => {
      const pool = poolByStep[s.id] ?? [];
      if (!pool.length) return null;
      const byConcern = concern ? pool.find((p) => p.category === concern) : null;
      return byConcern ?? pool[0];
    },
    [poolByStep, concern]
  );

  const productFor = useCallback(
    (s: StepDef): Product | null => picks[s.id] ?? recommended(s),
    [picks, recommended]
  );

  const chosen = activeSteps.map((s) => productFor(s)).filter(Boolean) as Product[];
  const total = chosen.reduce((sum, p) => sum + (p.price || 0), 0);
  const complete = skin != null && concern != null && steps != null;

  const currentQuestion: 'q1' | 'q2' | 'q3' = !skin ? 'q1' : !concern ? 'q2' : 'q3';

  const stepCountLabel = steps === 2 ? c.steps2 : steps === 3 ? c.steps3 : c.steps4;

  const handleAddAll = () => {
    if (!chosen.length) return;
    addMultipleToCart(chosen);
    setAdded(true);
  };

  const reset = () => {
    setSkin(null);
    setConcern(null);
    setSteps(null);
    setPicks({});
    setAdded(false);
  };

  return (
    <section className="relative w-full bg-[#F1F4EF] text-[#1E4D3B] py-12 sm:py-16">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#1E4D3B]/50 mb-6">
        {c.eyebrow}
      </p>
      <h2 className="sr-only">{c.eyebrow}</h2>

      {/* Pregunta actual (progresiva) */}
      <div className={`flex items-center justify-center px-4 ${complete ? '' : 'min-h-[7.5rem]'}`}>
        <AnimatePresence mode="wait">
          {!complete && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <p className="text-lg font-semibold mb-4">
                {currentQuestion === 'q1' ? c.q1 : currentQuestion === 'q2' ? c.q2 : c.q3}
              </p>
              <div
                className="flex flex-wrap items-center justify-center gap-2"
                role="radiogroup"
                aria-label={currentQuestion === 'q1' ? c.q1 : currentQuestion === 'q2' ? c.q2 : c.q3}
              >
                {currentQuestion === 'q1' &&
                  SKINS.map((s) => (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={skin === s}
                      onClick={() => setSkin(s)}
                      className="px-4 py-2 rounded-full bg-white ring-1 ring-[#1E4D3B]/15 hover:ring-[#1E4D3B]/40 text-sm font-medium transition-all cursor-pointer"
                    >
                      {c.types[s]}
                    </button>
                  ))}
                {currentQuestion === 'q2' &&
                  CONCERNS.map((s) => (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={concern === s.id}
                      onClick={() => setConcern(s.id)}
                      className="px-4 py-2 rounded-full bg-white ring-1 ring-[#1E4D3B]/15 hover:ring-[#1E4D3B]/40 text-sm font-medium transition-all cursor-pointer"
                    >
                      {c.concerns[s.id]}
                    </button>
                  ))}
                {currentQuestion === 'q3' &&
                  ([2, 3, 4] as const).map((n) => (
                    <button
                      key={n}
                      role="radio"
                      aria-checked={steps === n}
                      onClick={() => setSteps(n)}
                      className="px-5 py-2 rounded-full bg-white ring-1 ring-[#1E4D3B]/15 hover:ring-[#1E4D3B]/40 text-sm font-medium transition-all cursor-pointer"
                    >
                      {n === 2 ? c.steps2 : n === 3 ? c.steps3 : c.steps4}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Oración que se construye (chips con swap animado) */}
      <p className="mx-auto max-w-2xl px-4 text-center font-serif text-2xl sm:text-3xl md:text-4xl leading-tight">
        {skin ? (
          <>
            {c.sentence.before}{' '}
            <Chip value={c.types[skin]} onClick={() => setSkin(null)} label={`${c.q1} ${c.types[skin]}`} />,
          </>
        ) : (
          <>
            {c.sentence.before} <Placeholder text="____" />,
          </>
        )}{' '}
        {concern ? (
          <>
            {c.sentence.mid}{' '}
            <Chip value={c.concerns[concern]} onClick={() => setConcern(null)} label={`${c.q2} ${c.concerns[concern]}`} />,
          </>
        ) : (
          <>
            {c.sentence.mid} <Placeholder text="____" />,
          </>
        )}{' '}
        {stepCountLabel ? (
          <>
            {c.sentence.after}{' '}
            <Chip value={stepCountLabel} onClick={() => setSteps(null)} label={`${c.q3} ${stepCountLabel}`} /> {c.sentence.tail}
          </>
        ) : (
          <>
            {c.sentence.after} <Placeholder text="____" /> {c.sentence.tail}
          </>
        )}
      </p>

      {/* Resultado */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4 }}
            className="mt-8"
          >
            <div className="text-center px-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddAll}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E4D3B] text-white text-sm font-bold hover:bg-[#183E30] transition-all shadow-lg"
              >
                {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{added ? c.added : c.addAll(formatCurrency(total))}</span>
              </motion.button>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                <button onClick={() => setSteps(null)} className="font-medium text-[#1E4D3B] hover:text-[#C98A2C] transition-colors cursor-pointer">
                  {c.changeAnswers}
                </button>
                <button onClick={reset} className="font-medium text-[#1E4D3B]/60 hover:text-[#1E4D3B] transition-colors cursor-pointer">
                  {c.startOver}
                </button>
              </div>
            </div>

            {/* Carrusel de pasos al pie: corre y se selecciona */}
            {products.length === 0 ? (
              <p className="text-center text-sm text-[#1E4D3B]/50 py-10">{c.empty}</p>
            ) : (
              <div className="mt-8">
                <PeekCarousel
                  items={activeSteps}
                  keyOf={(s) => s.id}
                  renderCard={(s) => {
                    const product = productFor(s);
                    return (
                      <div className="rounded-3xl overflow-hidden bg-white ring-1 ring-[#1E4D3B]/10 shadow-sm">
                        <div className="relative aspect-[3/4] bg-[#DCE9E4]">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={product?.id}
                              src={product?.image}
                              alt={product?.name ?? ''}
                              loading="lazy"
                              initial={{ opacity: 0, scale: 1.04 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </AnimatePresence>
                          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#1E4D3B]">
                            {s.num} {STEP_LABEL[s.id][language]}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{product?.name}</p>
                          <p className="text-xs text-[#1E4D3B]/60">{formatCurrency(product?.price ?? 0)}</p>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            )}

            {/* Filas por paso: entrada escalonada + "+" para elegir */}
            <div className="mt-10 max-w-4xl mx-auto px-4">
              <p className="text-lg font-semibold mb-6">{c.pick}</p>
              <div className="space-y-8">
                {activeSteps.map((s, si) => {
                  const pool = poolByStep[s.id] ?? [];
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: si * 0.08 }}
                    >
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-semibold">{s.num}</span>
                        <span className="font-semibold">{STEP_LABEL[s.id][language]}</span>
                        <span className="text-sm text-[#1E4D3B]/55">{STEP_BLURB[s.id][language]}</span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                        {pool.map((p, pi) => {
                          const selected = productFor(s)?.id === p.id;
                          return (
                            <motion.button
                              key={p.id}
                              type="button"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.35, delay: pi * 0.05 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setPicks((prev) => ({ ...prev, [s.id]: p }));
                                setAdded(false);
                              }}
                              aria-pressed={selected}
                              className={`relative shrink-0 w-36 text-left rounded-2xl overflow-hidden ring-1 transition-all cursor-pointer ${
                                selected ? 'ring-2 ring-[#1E4D3B]' : 'ring-[#1E4D3B]/10 hover:ring-[#1E4D3B]/40'
                              }`}
                            >
                              <div className="relative aspect-square bg-[#DCE9E4]">
                                <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                <span
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                                    selected ? 'bg-[#1E4D3B]' : 'bg-[#1E4D3B]/70'
                                  }`}
                                >
                                  {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                </span>
                              </div>
                              <div className="p-2">
                                <p className="text-xs font-medium truncate">{p.name}</p>
                                <p className="text-[11px] text-[#1E4D3B]/60">{formatCurrency(p.price)}</p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RoutineStudio;
