import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Sparkles, Leaf, Droplets, ShieldCheck, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { buildQuizWhatsAppUrl } from '../utils/quizWhatsApp';

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

interface DiagnosticQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (routineId: string) => void;
}

type Step = 1 | 2 | 3 | 4 | 'result';

/** Scoring por prioridad: sensible/rojez > acné/poros > manchas > líneas > hidratación. */
function matchRoutine(skin: string, concerns: string[]): string {
  const c = new Set(concerns);
  if (skin === 'sensible' || c.has('rojez')) return 'hidratacion-sensible';
  if ((c.has('acne') || c.has('poros')) && skin !== 'seca') return 'piel-grasa';
  if (c.has('manchas')) return 'manchas-luminosidad';
  if (c.has('lineas')) return 'anti-edad-renovacion';
  return skin === 'seca' ? 'hidratacion-sensible' : 'hidratacion-universal';
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedRoutine, setMatchedRoutine] = useState<string | null>(null);

  const ROUTINE_TITLES: Record<string, string> = {
    'piel-grasa': t.quizRoutineOily,
    'hidratacion-sensible': t.quizRoutineSensitive,
    'manchas-luminosidad': t.quizRoutineSpots,
    'anti-edad-renovacion': t.quizRoutineAntiAge,
    'hidratacion-universal': t.quizRoutineUniversal,
  };

  const QUESTIONS = {
    1: {
      title: t.quizQ1Title,
      subtitle: t.quizQ1Sub,
      options: [
        { id: 'grasa', label: t.quizOptionOily, desc: t.quizOptionOilyDesc, icon: Droplets },
        { id: 'mixta', label: t.quizOptionCombo, desc: t.quizOptionComboDesc, icon: Leaf },
        { id: 'seca', label: t.quizOptionDry, desc: t.quizOptionDryDesc, icon: Droplets },
        { id: 'sensible', label: t.quizOptionSensitive, desc: t.quizOptionSensitiveDesc, icon: ShieldCheck },
      ],
    },
    2: {
      title: t.quizQ2Title,
      subtitle: t.quizQ2Sub,
      multiSelect: true,
      options: [
        { id: 'acne', label: t.quizConcernAcne, desc: t.quizConcernAcneDesc, icon: Sparkles },
        { id: 'poros', label: t.quizConcernPores, desc: t.quizConcernPoresDesc, icon: Leaf },
        { id: 'manchas', label: t.quizConcernSpots, desc: t.quizConcernSpotsDesc, icon: Sparkles },
        { id: 'lineas', label: t.quizConcernLines, desc: t.quizConcernLinesDesc, icon: Leaf },
        { id: 'hidratacion', label: t.quizConcernDehydr, desc: t.quizConcernDehydrDesc, icon: Droplets },
        { id: 'rojez', label: t.quizConcernRedness, desc: t.quizConcernRednessDesc, icon: ShieldCheck },
      ],
    },
    3: {
      title: t.quizQ3Title,
      subtitle: t.quizQ3Sub,
      options: [
        { id: 'basica', label: t.quizRoutineBasic, desc: t.quizRoutineBasicDesc, icon: Leaf },
        { id: 'completa', label: t.quizRoutineComplete, desc: t.quizRoutineCompleteDesc, icon: Sparkles },
        { id: 'avanzada', label: t.quizRoutineAdvanced, desc: t.quizRoutineAdvancedDesc, icon: ShieldCheck },
      ],
    },
    4: {
      title: t.quizQ4Title,
      subtitle: t.quizQ4Sub,
      options: [
        { id: 'siempre', label: t.quizQ4Daily, desc: t.quizQ4DailyDesc, icon: ShieldCheck },
        { id: 'salgo', label: t.quizQ4SometimesLabel, desc: t.quizQ4SometimesDesc, icon: Leaf },
        { id: 'maquillaje', label: t.quizQ4MakeupLabel, desc: t.quizQ4MakeupDesc, icon: Droplets },
        { id: 'nunca', label: t.quizQ4NeverLabel, desc: t.quizQ4NeverDesc, icon: Sparkles },
      ],
    },
  };

  // Save quiz result to localStorage when matched
  useEffect(() => {
    if (matchedRoutine) {
      const savedResult: SavedQuizResult = {
        routineId: matchedRoutine,
        routineTitle: ROUTINE_TITLES[matchedRoutine] || matchedRoutine,
        skinType: (answers[1] as string) ?? 'mixta',
        concerns: ((answers[2] as string[]) ?? []) as string[],
        routineLevel: (answers[3] as string) ?? 'completa',
        spfHabit: (answers[4] as string) ?? 'nunca',
        completedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(savedResult));
      } catch {
        // ignore storage errors
      }
    }
  }, [matchedRoutine, answers]);

  if (!isOpen) return null;

  const handleAnswer = (step: number, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [step]: value }));
    // Multiselect (paso 2): no auto-avanzar, el usuario confirma con Continuar.
    if (step < 4 && !(QUESTIONS[step as 1 | 2 | 3] as { multiSelect?: boolean }).multiSelect) {
      setTimeout(() => setCurrentStep((step + 1) as Step), 150);
    } else if (step >= 4) {
      setIsSubmitting(true);
      setTimeout(() => {
        const routineId = matchRoutine(
          (answers[1] as string) ?? 'mixta',
          ((answers[2] as string[]) ?? []) as string[]
        );
        setMatchedRoutine(routineId);
        setCurrentStep('result');
        setIsSubmitting(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep === 'result') {
      setCurrentStep(4);
      setMatchedRoutine(null);
    } else if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setAnswers({});
    setMatchedRoutine(null);
    onClose();
  };

  const handleViewRoutine = () => {
    if (matchedRoutine) {
      // El resultado va a WhatsApp para que el bot asesore y cierre la venta.
      const url = buildQuizWhatsAppUrl({
        routineId: matchedRoutine,
        skinType: (answers[1] as string) ?? 'mixta',
        concerns: ((answers[2] as string[]) ?? []) as string[],
        routineLevel: (answers[3] as string) ?? 'completa',
        spfHabit: (answers[4] as string) ?? 'nunca',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
      onComplete(matchedRoutine);
      handleClose();
    }
  };

  const progress = currentStep === 'result' ? 100 : (currentStep / 4) * 100;

  const question = QUESTIONS[currentStep as number];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            aria-label={t.quizClose}
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="quiz-title" className="font-serif text-lg sm:text-xl font-semibold text-[#102A43] text-center flex-1 px-4">
            {t.quizTitle}
          </h2>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 pt-4 pb-2 shrink-0">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#102A43] to-[#1e3a5f] rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-400 mt-1.5 px-0.5">
            <span>{t.quizStep} 1</span>
            <span>{t.quizStep} 2</span>
            <span>{t.quizStep} 3</span>
            <span>{t.quizStep} 4</span>
          </div>
        </div>

        {/* Cuerpo scrolleable: en pantallas chicas las 6 opciones exceden el alto */}
        <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        <AnimatePresence mode="wait">
          {currentStep !== 'result' && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6"
            >
              <div className="text-center mb-6">
                <span className="text-xs font-semibold text-[#102A43] uppercase tracking-wider">
                  {t.quizStep} {currentStep} {t.quizStepOf} 4
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 mt-2">
                  {question.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">{question.subtitle}</p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label={question.title}>
                {question.options.map((opt) => {
                  const isSelected = question.multiSelect
                    ? (answers[currentStep] as string[])?.includes(opt.id)
                    : answers[currentStep] === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (question.multiSelect) {
                          const current = (answers[currentStep] as string[]) || [];
                          const updated = current.includes(opt.id)
                            ? current.filter(id => id !== opt.id)
                            : [...current, opt.id];
                          handleAnswer(currentStep, updated);
                        } else {
                          handleAnswer(currentStep, opt.id);
                        }
                      }}
                      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'border-[#102A43] bg-[#102A43]/5'
                          : 'border-neutral-200 hover:border-[#102A43]/30 bg-neutral-50/50'
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#102A43] text-white'
                          : 'bg-neutral-100 text-neutral-400 group-hover:bg-[#102A43]/10 group-hover:text-[#102A43]'
                      }`}>
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-semibold text-sm ${isSelected ? 'text-[#102A43]' : 'text-neutral-900'}`}>
                          {opt.label}
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{opt.desc}</p>
                      </div>
                      <motion.div
                        animate={{ scale: isSelected ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-white bg-[#102A43] shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation: fija abajo para que Continuar nunca quede cortado */}
              <div className="flex justify-between items-center mt-6 pt-4 pb-1 border-t border-neutral-100 sticky bottom-0 bg-white/95 backdrop-blur-sm">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-[#102A43] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.quizBack}
                </motion.button>
                {question.multiSelect && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrentStep((currentStep + 1) as Step)}
                    disabled={!((answers[currentStep] as string[]) ?? []).length}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#102A43] text-white text-sm font-semibold rounded-2xl hover:bg-[#102A43]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    <span>{t.quizContinue}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
                {currentStep === 4 && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(4, answers[4] as string)}
                    disabled={!answers[4] || isSubmitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#102A43] text-white text-sm font-semibold rounded-2xl hover:bg-[#102A43]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.quizAnalyzing}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.quizViewRoutine}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && matchedRoutine && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h3 className="font-serif text-2xl font-semibold text-[#102A43] mb-2">
                {t.quizResultTitle}
              </h3>
              <p className="text-neutral-600 mb-2">{t.quizBasedOn}</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#102A43]/5 border border-[#102A43]/20 rounded-2xl p-4 mb-6"
              >
                <p className="font-bold text-[#102A43] text-lg">{ROUTINE_TITLES[matchedRoutine]}</p>
                <p className="text-sm text-neutral-600 mt-1">
                  {t.quizStepsForSkin.replace('{count}', String(matchedRoutine === 'manchas-luminosidad' ? 3 : 4))}
                </p>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleViewRoutine}
                className="w-full py-3.5 px-6 bg-[#25D366] text-white font-bold text-base rounded-2xl hover:bg-[#25D366]/90 transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5 inline-block mr-2" />
                {t.quizWhatsCta}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCurrentStep(1); setMatchedRoutine(null); }}
                className="w-full mt-3 py-2.5 text-sm font-medium text-neutral-500 hover:text-[#102A43] transition-colors"
              >
                {t.quizRestart}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
