import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Leaf, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';

export const HeroRitualCTA: React.FC<{
  onScrollToCatalog: () => void;
  onOpenQuiz: () => void;
}> = ({ onScrollToCatalog, onOpenQuiz }) => {
  const steps = [
    { icon: Leaf, label: 'Diagnóstico', desc: 'Tu tipo de piel y necesidades' },
    { icon: Sparkles, label: 'Rutina', desc: '4 pasos personalizados' },
    { icon: Droplets, label: 'Productos', desc: 'Fórmulas coreanas 100% originales' },
    { icon: ShieldCheck, label: 'Seguimiento', desc: 'Asesoría WhatsApp + envíos priority' },
  ];

  return (
    <section className="hero-ritual-cta relative rounded-3xl p-6 sm:p-8 text-white mx-4 sm:mx-6 mt-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#102A43] via-[#1e3a5f] to-[#2563eb]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Tu Ritual Personalizado
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold mt-3 leading-tight"
          >
            Descubrí la rutina que tu piel pide a gritos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed"
          >
            En 60 segundos te armamos 4 pasos a tu medida: limpieza, tratamiento, hidratación y protección.
            Sin adivinar. Sin gastar de más. Con asesoría real por WhatsApp.
          </motion.p>
        </div>

        {/* 4-Step Ritual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="group relative p-4 sm:p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-3 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all duration-300">
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base text-center mb-1">
                {step.label}
              </h4>
              <p className="text-[11px] sm:text-xs text-white/70 text-center leading-relaxed">
                {step.desc}
              </p>
              {/* Step number */}
              <span className="absolute top-2 right-2 text-[10px] font-bold text-white/20 group-hover:text-white/40 transition-colors">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
<motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenQuiz}
              className="flex-1 sm:w-auto py-4 px-8 bg-[#102A43] text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all group border border-white/20"
            >
              <span>Empezar mi diagnóstico</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="group-hover:translate-x-1 transition-transform"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScrollToCatalog}
            className="flex-1 sm:w-auto py-3.5 px-8 border-2 border-white/30 text-white font-semibold text-sm sm:text-base rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all"
          >
            Ver catálogo completo
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 pt-6 border-t border-white/10 text-[11px] text-white/60"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Productos 100% originales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Fórmulas coreanas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-300" />
            <span>Envío coordinado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Asesoría real por WhatsApp</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};