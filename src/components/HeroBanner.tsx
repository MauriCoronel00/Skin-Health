import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, ShieldCheck, ArrowDown } from 'lucide-react';
import heroBannerImg from '../assets/images/skincare_hero_banner_1789263283878.jpg';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0E2338] text-white shadow-xl my-4 sm:my-6">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBannerImg}
          alt="Skin Health Skincare Collection"
          className="w-full h-full object-cover object-center opacity-35 filter saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2338] via-[#0E2338]/85 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Catálogo Oficial • Asunción & Gran Asunción</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-3"
        >
          Tu piel, en su versión más radiante.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mb-6 font-light"
        >
          Selección exclusiva de dermocosmética premium y cuidado coreano: SKIN1004, The Ordinary y La Roche-Posay. Elegí tus favoritos y pedí directo por WhatsApp.
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
            href="https://wa.me/595981123456?text=Hola%20Skin%20Health%2C%20quisiera%20asesoramiento%20para%20elegir%20mi%20rutina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Consultar por WhatsApp</span>
          </a>
        </motion.div>
      </div>

      {/* Brand values footer ribbon inside hero */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xs px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white/80">
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
