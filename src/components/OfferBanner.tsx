import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OfferBannerProps {
  onOpenQuiz: () => void;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({ onOpenQuiz }) => {
  const { t } = useLanguage();

  return (
    <motion.section
      aria-label={t.welcomeTitle}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-[#102A43] text-white my-4 sm:my-6 shadow-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-14 w-48 h-48 rounded-full bg-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 top-10 w-24 h-24 rounded-full bg-[#C98A2C]/20 blur-xl"
      />
      <div className="relative z-10 p-5 sm:p-7 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2C]" aria-hidden="true" />
            {t.quizTitle}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-tight text-balance">
            {t.welcomeTitle}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-1 line-clamp-2">
            {t.welcomeDesc}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenQuiz}
          className="shrink-0 inline-flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-white text-[#102A43] text-sm font-bold hover:bg-white/90 transition-all shadow-sm cursor-pointer"
        >
          <span className="hidden sm:inline">{t.heroCtaQuiz}</span>
          <span className="sm:hidden">{t.quizViewRoutine}</span>
          <span className="w-8 h-8 rounded-full bg-[#102A43] text-white flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </motion.section>
  );
};
