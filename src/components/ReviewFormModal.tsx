import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Send, X, ImagePlus, Loader2 } from 'lucide-react';
import { Product, ReviewUser, TipoPiel } from '../types';
import { StarRatingInput } from './StarRatingInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import { validateReviewContent } from '../utils/reviewsStorage';
import { uploadReviewPhoto } from '../data/reviews';

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
    tipoPiel?: TipoPiel;
    fotos?: string[];
  }) => Promise<{ ok: boolean; message?: string }>;
}

const TIPOS_PIEL: { value: TipoPiel; label: string }[] = [
  { value: 'grasa', label: 'Grasa' },
  { value: 'seca', label: 'Seca' },
  { value: 'mixta', label: 'Mixta' },
  { value: 'sensible', label: 'Sensible' },
  { value: 'normal', label: 'Normal' },
];

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
  const [tipoPiel, setTipoPiel] = useState<TipoPiel | ''>('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotos.length >= 3) {
      setErrorMsg('Máximo 3 fotos por reseña.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La foto debe pesar menos de 5MB.');
      return;
    }
    setErrorMsg(null);
    setUploadingPhoto(true);
    try {
      const url = await uploadReviewPhoto(file);
      setFotos((prev) => [...prev, url]);
    } catch (err: any) {
      setErrorMsg('No pudimos subir la foto. Probá de nuevo.');
      console.error(err);
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const removePhoto = (url: string) => {
    setFotos((prev) => prev.filter((u) => u !== url));
  };

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
      tipoPiel: tipoPiel || undefined,
      fotos: fotos.length > 0 ? fotos : undefined,
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
      setTipoPiel('');
      setFotos([]);
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#102A43]/70">
                  {product.brand}
                </span>
                <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-500 truncate">
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
                  <span className="text-xs text-neutral-400">
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

              {/* Step 3: Tipo de piel */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  3. Tu tipo de piel <span className="text-neutral-400 font-normal">(Opcional, ayuda a otros clientes)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIPOS_PIEL.map((tp) => {
                    const active = tipoPiel === tp.value;
                    return (
                      <button
                        key={tp.value}
                        type="button"
                        onClick={() => setTipoPiel(active ? '' : tp.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#102A43] text-white border-[#102A43]'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#102A43]/40'
                        }`}
                      >
                        {tp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Fotos */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  4. Fotos del producto <span className="text-neutral-400 font-normal">(Opcional, hasta 3)</span>
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {fotos.map((url) => (
                    <div
                      key={url}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200"
                    >
                      <img src={url} alt="Foto de reseña" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(url)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                        aria-label="Eliminar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {fotos.length < 3 && (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-[#102A43]/40 hover:bg-neutral-50 transition-all text-neutral-400">
                      {uploadingPhoto ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-5 h-5" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingPhoto || !currentUser}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {!currentUser && (
                  <p className="text-xs text-neutral-400 mt-1">Identificate primero para subir fotos.</p>
                )}
              </div>

              {/* Step 5: Google Identification */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-2">
                  5. Identificación antes de publicar <span className="text-rose-500">*</span>
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
