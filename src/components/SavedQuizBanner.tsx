import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, X, Sparkles, RotateCcw } from 'lucide-react';

const QUIZ_STORAGE_KEY = 'skinhealth_quiz_result_v1';

interface SavedQuizResult {
  routineId: string;
  routineTitle: string;
  skinType: string;
  concerns: string[];
  routineLevel: string;
  spfHabit: string;
  completedAt: string;
}

interface SavedQuizBannerProps {
  onDismiss: () => void;
  onRetakeQuiz: () => void;
  onViewRoutine: (routineId: string) => void;
}

const SKIN_TYPE_LABELS: Record<string, string> = {
  grasa: 'Piel grasa',
  mixta: 'Piel mixta',
  seca: 'Piel seca',
  sensible: 'Piel sensible',
};

export const SavedQuizBanner: React.FC<SavedQuizBannerProps> = ({
  onDismiss,
  onRetakeQuiz,
  onViewRoutine,
}) => {
  const [savedResult, setSavedResult] = useState<SavedQuizResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedQuizResult;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedResult(parsed);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsVisible(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleViewRoutine = () => {
    if (savedResult) {
      onViewRoutine(savedResult.routineId);
    }
  };

  if (!isVisible || !savedResult) return null;

  const skinLabel = SKIN_TYPE_LABELS[savedResult.skinType] || savedResult.skinType;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative mb-4 sm:mb-6"
    >
      <div className="relative bg-gradient-to-r from-[#102A43] via-[#1e3a5f] to-[#2c3e6b] rounded-3xl p-4 sm:p-6 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Ocultar recomendación guardada"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Main content */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-white leading-tight">
                ¡Tu rutina te espera!
              </h3>
            </div>
            <p className="text-white/80 text-sm sm:text-base mb-1.5">
              Hola de nuevo. Aquí tienes tu rutina para <span className="font-semibold underline underline-offset-1">{skinLabel}</span> lista para pedir.
            </p>
            <p className="text-white/60 text-xs sm:text-sm">
              {savedResult.routineTitle}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-center sm:justify-end flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleViewRoutine}
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 bg-white text-[#102A43] font-bold text-sm sm:text-base rounded-2xl hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Ver mi rutina</span>
            </motion.button>

            <button
              onClick={onRetakeQuiz}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refaz diagnóstico</span>
            </button>
          </div>
        </div>

        {/* Small timestamp */}
        <p className="absolute bottom-2 right-3 text-[10px] text-white/40 text-right">
          Diagnosticado {new Date(savedResult.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
        </p>
      </div>
    </motion.div>
  );
};