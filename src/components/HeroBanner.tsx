import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import heroRadiantBg from '../assets/images/woman_applying_skincare_cream_1789318644556.jpg';

// Logos textuales de marcas oficiales (refuerzo de legitimidad)
const BRAND_MARKS = ['Anua', 'Beauty of Joseon', 'COSRX', 'SKIN1004', 'Laneige', 'Medicube'];

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenQuiz?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog, onOpenQuiz }) => {
  const { t } = useLanguage();
  const ritualSteps = [t.ritualCleanse, t.ritualTreat, t.ritualHydrate, t.ritualProtect];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#102A43] text-white shadow-sm my-4 sm:my-6 border border-[#102A43]/20 flex flex-col">
      {/* Foto: florece a la derecha en desktop, velo en móvil */}
      <div className="absolute inset-0 sm:left-auto sm:right-0 sm:w-[48%] z-0 pointer-events-none">
        <img
          src={heroRadiantBg}
          alt="Skin Health · Rutinas de skincare importado en Paraguay"
          width={1200}
          height={670}
          className="w-full h-full object-cover object-[75%_center] opacity-40 sm:opacity-95 sm:[mask-image:linear-gradient(to_right,transparent,black_38%)]"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/85 to-transparent sm:hidden" />
      </div>

      {/* Marca de agua en hangul: lengua vernácula del producto */}
      <div
        aria-hidden="true"
        className="absolute -right-3 top-4 sm:top-8 z-0 select-none leading-none font-bold text-white/[0.05] text-[130px] sm:text-[190px] pointer-events-none"
      >
        피부
      </div>

      {/* Contenido: una sola revelación orquestada */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 p-6 sm:p-10 md:p-12 flex items-center min-h-[440px] sm:min-h-[480px]"
      >
        <div className="max-w-xl flex flex-col justify-center">
          {/* Pill de contexto */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4 w-fit shadow-xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2C]" aria-hidden="true" />
            <span>{t.heroEyebrow}</span>
          </div>

          {/* Heading */}
          <h1 className="hero-display font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.05] mb-4">
            {t.heroTitle1}<br />{t.heroTitle2}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl mb-5 font-light">
            {t.heroSubtitle}
          </p>

          {/* CTAs: quiz en ámbar (acción que vende) + catálogo fantasma */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {onOpenQuiz && (
              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#102A43] text-sm font-bold hover:bg-white/90 transition-all shadow-sm cursor-pointer"
              >
                <span>{t.heroCtaQuiz}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onScrollToCatalog}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>{t.heroCtaCatalog}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Micro-social proof */}
          <div className="flex items-center gap-2 text-xs text-white/80">
            <div className="flex items-center gap-0.5 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
              ))}
            </div>
            <span className="font-semibold">4.9</span>
            <span className="text-white/60">{t.heroTagline}</span>
          </div>
        </div>
      </motion.div>

      {/* Franja del ritual: capas, no tarjetas */}
      <div className="relative z-10 border-t border-white/10 bg-white/[0.04] backdrop-blur-sm px-6 sm:px-10 py-4">
        <div className="flex items-center gap-0">
          {ritualSteps.map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && (
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mx-2 sm:mx-3" aria-hidden="true" />
              )}
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2C]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-white/85 whitespace-nowrap">
                  {step}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Fila de marcas oficiales */}
      <div className="relative z-10 border-t border-white/20 bg-black/25 backdrop-blur-md px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
          <span className="text-xs font-semibold text-white/60 shrink-0">
            {t.officialBrands}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5">
            {BRAND_MARKS.map((brand, i) => (
              <React.Fragment key={brand}>
                {i > 0 && (
                  <span className="hidden sm:inline text-white/30 select-none" aria-hidden="true">·</span>
                )}
                <span className="text-base sm:text-lg font-serif font-semibold text-white tracking-tight">
                  {brand}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
