import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, ShieldCheck, ArrowDown, PackageCheck } from 'lucide-react';
import heroBannerImg from '../assets/images/skin_health_hero_1789268252129.jpg';
import { STORE_PHONE_NUMBER } from '../data/products';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0E2338] text-white shadow-xl my-4 sm:my-6 border border-[#102A43]/30">
      {/* Ambient background with warm overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBannerImg}
          alt="Skin Health Colección Exclusiva"
          className="w-full h-full object-cover object-center opacity-30 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2338] via-[#0E2338]/90 to-[#0E2338]/70" />
      </div>

      {/* Main Hero Content - Responsive Grid */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Branding, Title, Description, and CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Subtle pill tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90 mb-4 w-fit"
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
            className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mb-6 font-light"
          >
            Selección exclusiva de dermocosmética premium y cuidado coreano: SKIN1004, The Ordinary y La Roche-Posay. Elegí tus favoritos y pedí directo por WhatsApp con entrega coordinada.
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
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Ver Rutinas</span>
            </a>

            <a
              href={`https://wa.me/${STORE_PHONE_NUMBER}?text=Hola%20Skin%20Health%2C%20quisiera%20asesoramiento%20para%20elegir%20mi%20rutina`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consultar por WhatsApp</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Prominent, Crisp Branding Showcase Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900/40 group">
            <img
              src={heroBannerImg}
              alt="Línea Oficial Skin Health - Presentación de Marca"
              className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700 aspect-16/10 sm:aspect-16/9"
              loading="eager"
            />
            {/* Elegant glass caption badge */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/50 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs text-white/95 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="font-medium">Skin Health Branding</span>
              </div>
              <span className="text-[11px] text-sky-200 font-light">el arte del cuidado de la piel.</span>
            </div>
          </div>
        </motion.div>
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
