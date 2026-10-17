import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { BrandLogo } from './BrandLogo';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenQuiz?: () => void;
  compact?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog, onOpenQuiz, compact = false }) => {
  const { t, formatCurrency } = useLanguage();
  const { products } = useProducts();

  const ritualSteps = [t.ritualCleanse, t.ritualTreat, t.ritualHydrate, t.ritualProtect];
  const [stepIdx, setStepIdx] = useState(0);

  const categoryLabel = (cat?: string) => {
    if (cat === 'cleanse') return t.ritualCleanse;
    if (cat === 'hydrate') return t.ritualHydrate;
    if (cat === 'protect') return t.ritualProtect;
    return t.ritualTreat;
  };

  useEffect(() => {
    const id = setInterval(() => setStepIdx((i) => (i + 1) % ritualSteps.length), 4000);
    return () => clearInterval(id);
  }, [ritualSteps.length]);

  const { main, side } = useMemo(() => {
    const withImage = products.filter((p) => p.image);
    const findCat = (cat: string) => withImage.find((p) => p.category === cat);
    return {
      main: findCat('hydrate') ?? withImage[0] ?? null,
      side: findCat('cleanse') ?? withImage[1] ?? null,
    };
  }, [products]);

  return (
    <section className="p-2 md:p-3">
      <div
        className={`arc-field relative flex flex-col overflow-hidden rounded-3xl bg-[#f4f7fb] [--arc-x:-14%] ${
          compact ? 'min-h-[max(calc(100svh-1.5rem),42rem)]' : 'min-h-[max(calc(100svh-1.5rem),48rem)]'
        }`}
      >
        {/* Contenido: columna centrada, revelación escalonada */}
        <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col items-center justify-center px-4 pt-6 pb-6 text-center sm:pt-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#6B7280]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2C]" aria-hidden="true" />
            {t.heroEyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-display max-w-4xl text-5xl leading-[1.02] font-medium text-[#20231F] md:text-6xl lg:text-7xl 2xl:text-8xl"
          >
            {t.heroTitle1}
            <br />
            {t.heroTitle2}
          </motion.h1>

          {/* Línea rotativa: los cuatro pasos del ritual */}
          <div className="mt-5 flex min-h-6 items-center justify-center md:min-h-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={stepIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm text-[#6B7280] md:text-lg"
              >
                {`0${stepIdx + 1}`} {ritualSteps[stepIdx]}.
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTAs: primario pino + secundario salvia */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {onOpenQuiz && (
              <button
                onClick={onOpenQuiz}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#102a43] px-6 text-sm font-semibold text-white transition-all hover:bg-[#1e3a5f] active:scale-[0.98] cursor-pointer"
              >
                <span>{t.heroCtaQuiz}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onScrollToCatalog}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#dbeafe] px-6 text-sm font-semibold text-[#102a43] transition-all hover:bg-[#d6e3f0] active:scale-[0.98] cursor-pointer"
            >
              <span>{t.heroCtaCatalog}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Prueba social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#6B7280]"
          >
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex items-center gap-0.5 text-[#C98A2C]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current stroke-current" />
                ))}
              </span>
              <span className="font-semibold text-[#20231F]">4.9</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.heroTagline.replace(/^·\s*/, '')}</span>
          </motion.div>
        </div>

        {/* Banda de arcos: galería del ritual */}
        <div className="relative z-10 mx-auto flex h-[clamp(15rem,34svh,26rem)] w-full max-w-5xl shrink-0 items-end justify-center px-2">
          {/* Arco lateral izquierdo */}
          <div className="relative -me-6 hidden h-[62%] w-44 shrink-0 overflow-hidden rounded-t-2xl bg-[#dfe8f3] ring-4 ring-[#f4f7fb] sm:block">
            {side?.image && (
              <img src={side.image} alt={side.name} className="h-full w-full object-cover" loading="eager" decoding="async" />
            )}
          </div>

          {/* Arco central: sello de marca (reemplaza la foto de producto) */}
          <div className="animate-reveal-up relative h-full w-[min(20rem,58vw)] shrink-0 overflow-hidden rounded-t-full bg-[#102a43] ring-4 ring-[#f4f7fb]">
            <div className="absolute inset-0 bg-[linear-gradient(168deg,#0e2338_0%,#102a43_46%,#2f5c8f_100%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(115%_80%_at_50%_22%,rgba(219,234,254,0.32),transparent_64%)]" aria-hidden="true" />
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-5 pt-9 pb-4 text-center sm:gap-4 sm:pt-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f7fb] ring-1 ring-white/40 shadow-[0_8px_22px_rgba(6,20,35,0.35)]">
                <BrandLogo variant="icon-only" size="md" />
              </span>
              <span className="font-sans text-[clamp(0.95rem,2.1vw,1.35rem)] font-semibold uppercase tracking-[0.24em] text-white">
                SKIN HEALTH
              </span>
              <span className="h-px w-10 bg-[#9db8dc]/70" aria-hidden="true" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#dbeafe] sm:text-[10px]">
                {t.heroBrandTagline}
              </span>
            </div>
          </div>

          {/* Arco de información */}
          <div className="relative -ms-6 hidden h-[62%] w-44 shrink-0 flex-col justify-end rounded-t-2xl bg-white p-3 text-left ring-4 ring-[#f4f7fb] sm:flex">
            {main ? (
              <>
                <span className="text-[11px] font-medium text-[#6B7280]">{categoryLabel(main.category)}</span>
                <p className="mt-1 line-clamp-2 font-serif text-lg font-medium leading-tight text-[#20231F]">
                  {main.name}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">{formatCurrency(main.price)}</p>
                <button
                  onClick={onScrollToCatalog}
                  className="mt-2 inline-flex items-center justify-center gap-1 rounded-full bg-[#102a43] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1e3a5f] cursor-pointer"
                >
                  {t.heroCtaCatalog}
                </button>
              </>
            ) : (
              <div className="h-full w-full rounded-2xl bg-[#dfe8f3]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
