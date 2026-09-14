import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, ShieldCheck, ArrowDown, Sparkle } from 'lucide-react';
import heroRadiantBg from '../assets/images/woman_applying_skincare_cream_1789318644556.jpg';
import { STORE_PHONE_NUMBER } from '../data/products';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0E2338] text-white shadow-xl my-4 sm:my-6 border border-[#102A43]/30 min-h-[440px] sm:min-h-[480px] flex flex-col justify-between">
      {/* Background with the radiant skincare woman image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroRadiantBg}
          alt="Tu piel, en su versión más radiante - Skin Health"
          className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-65 sm:opacity-75 filter contrast-105"
        />
        {/* Optical gradient overlay to guarantee perfect contrast on text while showcasing the girl's face */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2338] via-[#0E2338]/80 to-transparent sm:bg-gradient-to-r sm:from-[#0E2338] sm:via-[#0E2338]/90 sm:via-45% sm:to-transparent" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 flex items-center flex-1">
        <div className="max-w-xl sm:max-w-2xl flex flex-col justify-center">
          {/* Subtle pill tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white/95 mb-4 w-fit shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Catálogo Oficial • Asunción & Gran Asunción</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-white leading-[1.15] mb-4 drop-shadow-sm"
          >
            Tu piel, en su versión más radiante.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mb-7 font-light drop-shadow-xs"
          >
            Soluciones avanzadas para la salud y el cuidado de tu piel. Trabajamos con marcas líderes en dermatología y K-Beauty: CeraVe, La Roche-Posay, SKIN1004 y The Ordinary. Asesoramiento continuo y entregas coordinadas a través de WhatsApp
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onScrollToCatalog}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#0E2338] text-sm font-semibold hover:bg-neutral-100 transition-all shadow-md cursor-pointer group"
            >
              <span>Explorar Catálogo</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            <a
              href="#rutinas"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-semibold transition-all cursor-pointer"
            >
              <Sparkle className="w-4 h-4 text-emerald-300" />
              <span>Ver Rutinas</span>
            </a>

            <a
              href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health%2C%20quisiera%20asesoramiento%20para%20elegir%20mi%20rutina`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Consultar por WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Brand values footer ribbon inside hero */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xs px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Productos Originales</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-300 shrink-0" />
          <span>Fórmulas dermatológicas</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Atención personalizada</span>
        </div>
      </div>
    </section>
  );
};
