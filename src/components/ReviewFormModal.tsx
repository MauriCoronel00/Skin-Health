import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, AlertCircle, Sparkles, Send, ShieldCheck, X } from 'lucide-react';
import { Product, ProductReview, ReviewUser } from '../types';
import { StarRatingInput } from './StarRatingInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import { validateReviewContent } from '../utils/reviewsStorage';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: ReviewUser | null;
  onUserAuthenticated: (user: ReviewUser | null) => void;
  onSubmitReview: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    author: ReviewUser;
    city?: string;
  }) => Promise<{ ok: boolean; message?: string }>;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUser,
  onUserAuthenticated,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Step 1: Star validation
    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg('Por favor selecciona una calificación de 1 a 5 estrellas.');
      return;
    }

    // Step 2: Auth check
    if (!currentUser) {
      setErrorMsg('Por favor identifícate con tu cuenta Google para firmar tu valoración.');
      return;
    }

    // Step 3: Comment validation (optional, but if present must be respectful & clean)
    const valResult = validateReviewContent(comment);
    if (!valResult.isValid) {
      setErrorMsg(valResult.message || 'El comentario no es válido.');
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmitReview({
      productId: product.id,
      rating,
      comment: comment.trim(),
      author: currentUser,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMsg(result.message || 'No pudimos guardar tu reseña. Probá de nuevo.');
      return;
    }

    setIsSuccess(true);

    // Auto close after showing thank you state
    setTimeout(() => {
      setIsSuccess(false);
      setComment('');
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl z-10 border border-neutral-100 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors"
          aria-label="Cerrar formulario"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 font-serif">
              ¡Muchas gracias por tu opinión!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
              Tu opinión quedó en revisión y será visible tras la moderación. ¡Gracias por ayudar a la comunidad!
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Header & Product reference */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100 mb-5">
              <div className="w-14 h-14 bg-[#FAF8F5] rounded-xl p-1.5 shrink-0 border border-neutral-100 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#102A43]/70">
                  {product.brand}
                </span>
                <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                  {product.name}
                </h3>
                <p className="text-[11px] text-neutral-500 truncate">
                  Dejá tu valoración sincera
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Star Rating */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-neutral-100/90 text-center sm:text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2">
                  1. ¿Qué puntuación le das al producto? <span className="text-rose-500">*</span>
                </label>
                <StarRatingInput value={rating} onChange={setRating} size="lg" />
              </div>

              {/* Step 2: Comment (optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-800">
                    2. Tu comentario u opinión <span className="text-neutral-400 font-normal">(Opcional)</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {comment.length}/600
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={600}
                  placeholder="Contanos tu experiencia: textura, cómo te sentó en la piel, rapidez de entrega..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-[#102A43] focus:ring-1 focus:ring-[#102A43] resize-none leading-relaxed"
                />
              </div>

              {/* Step 3: Google Identification */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  3. Identificación antes de publicar <span className="text-rose-500">*</span>
                </label>
                <GoogleAuthButton
                  currentUser={currentUser}
                  onUserAuthenticated={onUserAuthenticated}
                />
              </div>

              {/* Error prompt */}
              {errorMsg && (
                <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    !currentUser || rating === 0
                      ? 'bg-[#102A43]/70 hover:bg-[#102A43]'
                      : 'bg-[#102A43] hover:bg-[#102A43]/90'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Publicando opinión...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publicar mi Reseña</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
