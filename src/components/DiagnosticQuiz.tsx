import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Sparkles, Leaf, Droplets, ShieldCheck, X } from 'lucide-react';

interface DiagnosticQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (routineId: string) => void;
}

type Step = 1 | 2 | 3 | 4 | 'result';

const QUESTIONS = {
  1: {
    title: '¿Cómo es tu tipo de piel?',
    subtitle: 'Seleccioná la que mejor te describe',
    options: [
      { id: 'grasa', label: 'Piel grasa / con brillo', desc: 'Brillo en zona T, poros visibles, tendencia a granos', icon: Droplets },
      { id: 'mixta', label: 'Piel mixta', desc: 'Grasa en zona T, normal/seca en mejillas', icon: Leaf },
      { id: 'seca', label: 'Piel seca / tirante', desc: 'Sensación de tirantez, descamación, líneas finas', icon: Droplets },
      { id: 'sensible', label: 'Piel sensible / reactiva', desc: 'Enrojecimiento fácil, picor, reacciona a productos', icon: ShieldCheck },
    ],
  },
  2: {
    title: '¿Cuál es tu principal preocupación?',
    subtitle: 'Podés elegir más de una',
    multiSelect: true,
    options: [
      { id: 'acne', label: 'Acné / granos', desc: 'Brotes frecuentes, marcas post-acné', icon: Sparkles },
      { id: 'poros', label: 'Poros dilatados', desc: 'Textura irregular, puntos negros', icon: Leaf },
      { id: 'manchas', label: 'Manchas / hiperpigmentación', desc: 'Tono desigual, manchas solares, melasma', icon: Sparkles },
      { id: 'lineas', label: 'Líneas de expresión / firmeza', desc: 'Arrugas tempranas, pérdida de elasticidad', icon: Leaf },
      { id: 'hidratacion', label: 'Deshidratación / falta de luminosidad', desc: 'Piel apagada, líneas finas por sequedad', icon: Droplets },
      { id: 'rojez', label: 'Enrojecimiento / rosácea', desc: 'Calor facial, vasos visibles, sensibilidad', icon: ShieldCheck },
    ],
  },
  3: {
    title: '¿Qué nivel de rutina buscás?',
    subtitle: 'Según tu tiempo y compromiso',
    options: [
      { id: 'basica', label: 'Básica (3 pasos)', desc: 'Limpieza + Tratamiento + Protección — 2 min', icon: Leaf },
      { id: 'completa', label: 'Completa (4 pasos)', desc: 'Limpieza + Tónico/Sérum + Hidratación + Protección — 4 min', icon: Sparkles },
      { id: 'avanzada', label: 'Avanzada (5+ pasos)', desc: 'Doble limpieza + múltiples sérums + contorno ojos + crema + SPF — 6 min', icon: ShieldCheck },
    ],
  },
  4: {
    title: '¿Cuándo aplicás protector solar?',
    subtitle: 'Clave para definir tu rutina de día',
    options: [
      { id: 'siempre', label: 'Todos los días, llueva o truene', desc: 'Hábito instalado, reaplico cada 2-3hs', icon: ShieldCheck },
      { id: 'salgo', label: 'Solo cuando salgo al sol directo', desc: 'Playa, pileta, deporte al aire libre', icon: Leaf },
      { id: 'maquillaje', label: 'Solo si mi base/crema tiene SPF', desc: 'Dependo del SPF del maquillaje', icon: Droplets },
      { id: 'nunca', label: 'Casi nunca / me olvido', desc: 'No es parte de mi rutina actual', icon: Sparkles },
    ],
  },
};

const ROUTINE_MATCH: Record<string, string> = {
  'grasa-acne-poros-siempre': 'piel-grasa',
  'grasa-acne-poros-salgo': 'piel-grasa',
  'grasa-acne-poros-maquillaje': 'piel-grasa',
  'grasa-acne-poros-nunca': 'piel-grasa',
  'grasa-manchas-lineas-siempre': 'manchas-luminosidad',
  'grasa-hidratacion-rojez-siempre': 'hidratacion-sensible',
  'mixta-acne-poros-siempre': 'piel-grasa',
  'mixta-manchas-lineas-siempre': 'manchas-luminosidad',
  'mixta-hidratacion-rojez-siempre': 'hidratacion-universal',
  'seca-manchas-lineas-siempre': 'manchas-luminosidad',
  'seca-hidratacion-rojez-siempre': 'hidratacion-sensible',
  'seca-hidratacion-rojez-salgo': 'hidratacion-universal',
  'sensible-acne-poros-siempre': 'hidratacion-sensible',
  'sensible-manchas-lineas-siempre': 'hidratacion-sensible',
  'sensible-hidratacion-rojez-siempre': 'hidratacion-sensible',
  'sensible-hidratacion-rojez-salgo': 'hidratacion-universal',
};

const ROUTINE_TITLES: Record<string, string> = {
  'piel-grasa': 'Rutina para Piel Grasa y Tendencia al Acné',
  'hidratacion-sensible': 'Rutina para Piel Sensible y Barrera Cutánea',
  'manchas-luminosidad': 'Rutina para Manchas, Hiperpigmentación y Luminosidad',
  'anti-edad-renovacion': 'Rutina Anti-Edad y Textura (Renovación)',
  'hidratacion-universal': 'Rutina Básica de Hidratación Universal',
};

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedRoutine, setMatchedRoutine] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnswer = (step: number, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [step]: value }));
    if (step < 4) {
      setTimeout(() => setCurrentStep((step + 1) as Step), 150);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        const key = `${answers[1]}-${(answers[2] as string[]).join('-')}-${answers[3]}-${answers[4]}`;
        const routineId = ROUTINE_MATCH[key] || 'hidratacion-universal';
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
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            aria-label="Cerrar diagnóstico"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="quiz-title" className="font-serif text-lg sm:text-xl font-semibold text-[#102A43] text-center flex-1 px-4">
            Diagnóstico de Piel
          </h2>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 pt-4 pb-2">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#102A43] to-[#1e3a5f] rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1.5 px-0.5">
            <span>Paso 1</span>
            <span>Paso 2</span>
            <span>Paso 3</span>
            <span>Paso 4</span>
          </div>
        </div>

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
                  Paso {currentStep} de 4
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
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{opt.desc}</p>
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

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t border-neutral-100">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-[#102A43] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </motion.button>
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
                        <span>Analizando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ver mi rutina</span>
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
                ¡Tu rutina está lista!
              </h3>
              <p className="text-neutral-600 mb-2">Basado en tus respuestas, te recomendamos:</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#102A43]/5 border border-[#102A43]/20 rounded-2xl p-4 mb-6"
              >
                <p className="font-bold text-[#102A43] text-lg">{ROUTINE_TITLES[matchedRoutine]}</p>
                <p className="text-sm text-neutral-600 mt-1">4 pasos personalizados para tu piel</p>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleViewRoutine}
                className="w-full py-3.5 px-6 bg-[#102A43] text-white font-bold text-base rounded-2xl hover:bg-[#102A43]/90 transition-all shadow-lg"
              >
                Ver mi rutina completa
                <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCurrentStep(1); setMatchedRoutine(null); }}
                className="w-full mt-3 py-2.5 text-sm font-medium text-neutral-500 hover:text-[#102A43] transition-colors"
              >
                Hacer el diagnóstico de nuevo
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};