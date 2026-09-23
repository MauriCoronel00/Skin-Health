import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowDown, Sparkles, ArrowRight } from 'lucide-react';
import heroRadiantBg from '../assets/images/woman_applying_skincare_cream_1789318644556.jpg';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenQuiz?: () => void;
}

// Logos textuales de marcas oficiales (P6: refuerzo de legitimidad)
const BRAND_MARKS = ['CeraVe', 'La Roche-Posay', 'The Ordinary', 'SKIN1004'];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog, onOpenQuiz }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#102A43] text-white shadow-sm my-4 sm:my-6 border border-[#102A43]/20 flex flex-col">
      {/* Background con foto */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroRadiantBg}
          alt="Skin Health · Rutinas de skincare importado en Paraguay"
          className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/90 to-transparent sm:from-[#102A43] sm:via-[#102A43]/95 sm:to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 flex items-center min-h-[440px] sm:min-h-[480px]">
        <div className="max-w-xl sm:max-w-2xl flex flex-col justify-center">
          {/* Pill de contexto */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4 w-fit shadow-xs backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Skincare importado · Asunción, Paraguay</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-white leading-[1.15] mb-4"
          >
            Entendé tu piel.<br />Amala.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-xl mb-5 font-light"
          >
            Rutinas de dermocosmética con productos oficiales. 60 segundos de diagnóstico y armamos tu ritual de 4 pasos.
          </motion.p>

          {/* CTAs: quiz principal + catálogo secundario */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {onOpenQuiz && (
              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#102A43] text-sm font-bold hover:bg-white/90 transition-all shadow-md cursor-pointer group"
              >
                <span>Empezar mi diagnóstico</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
            <button
              onClick={onScrollToCatalog}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer group backdrop-blur-sm"
            >
              <span>Ver catálogo</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>

          {/* Micro-social proof (P6) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-xs text-white/80"
          >
            <div className="flex items-center gap-0.5 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
              ))}
            </div>
            <span className="font-semibold">4.9</span>
            <span className="text-white/60">· Rutinas armadas para clientas de todo Paraguay</span>
          </motion.div>
        </div>
      </div>

      {/* Fila de marcas oficiales (P6: legitimidad) */}
      <div className="relative z-10 border-t border-white/20 bg-black/25 backdrop-blur-md px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 shrink-0">
            Marcas oficiales
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
