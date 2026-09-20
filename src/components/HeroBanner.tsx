import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageCircle, ShieldCheck, ArrowDown, Sparkles } from 'lucide-react';
import heroRadiantBg from '../assets/images/woman_applying_skincare_cream_1789318644556.jpg';
import { STORE_PHONE_NUMBER } from '../data/products';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#E8E6FF] text-[#1A202C] shadow-sm my-4 sm:my-6 border border-[#E8E6FF] min-h-[440px] sm:min-h-[480px] flex flex-col justify-between">
      {/* Background with the radiant skincare woman image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroRadiantBg}
          alt="Tu piel, en su versión más radiante - Skin Health"
          className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-90"
        />
        {/* Soft lavanda overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent sm:from-white sm:via-white/90 sm:to-transparent" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 flex items-center flex-1">
        <div className="max-w-xl sm:max-w-2xl flex flex-col justify-center">
          {/* Subtle pill tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6FF] text-xs font-medium text-[#1A202C] mb-4 w-fit shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B7FF7]" />
            <span>Skincare dermatológico • Asunción, Paraguay</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#1A202C] leading-[1.15] mb-4"
          >
            Entendé tu piel.<br />Amala.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-[#1A202C]/70 leading-relaxed max-w-xl mb-5 font-light"
          >
            Skincare inteligente con conocimiento. Descubrí qué necesita tu piel y armá una rutina que realmente funcione.
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B7FF7] text-white text-sm font-semibold hover:bg-[#7A6EE6] transition-all shadow-md cursor-pointer group"
            >
              <span>Descubrí tu rutina</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Brand values footer ribbon - Lumina style */}
      <div className="relative z-10 border-t border-[#E8E6FF] bg-white/80 backdrop-blur-sm px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#1A202C]/70">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B7FF7] shrink-0" />
          <span>Science backed</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B7FF7] shrink-0" />
          <span>Clean ingredients</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[#8B7FF7] shrink-0" />
          <span>Visible results</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#8B7FF7] shrink-0" />
          <span>Made for you</span>
        </div>
      </div>
    </section>
  );
};
