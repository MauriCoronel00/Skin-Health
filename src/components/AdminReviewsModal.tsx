import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, EyeOff, Trash2, CheckCircle, Star, X, AlertTriangle } from 'lucide-react';
import { ProductReview } from '../types';
import { formatReviewDate } from '../utils/reviewsStorage';

interface AdminReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ProductReview[];
  onToggleStatus: (reviewId: string, newStatus: 'approved' | 'hidden') => void;
  onDeleteReview: (reviewId: string) => void;
  onToggleFeatured: (reviewId: string) => void;
}

export const AdminReviewsModal: React.FC<AdminReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  onToggleStatus,
  onDeleteReview,
  onToggleFeatured,
}) => {
  const [filter, setFilter] = useState<'all' | 'user' | 'example' | 'hidden'>('all');

  if (!isOpen) return null;

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'user') return !r.isExample;
    if (filter === 'example') return !!r.isExample;
    if (filter === 'hidden') return r.status === 'hidden';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl z-10 border border-neutral-100 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#102A43] text-white">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="font-semibold text-lg text-[#102A43]">
                Panel de Moderación de Reseñas
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Gestiona, aprueba, oculta o elimina opiniones enviadas por clientes y contenido de demostración.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filter === 'all'
                ? 'bg-[#102A43] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Todas ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filter === 'user'
                ? 'bg-[#102A43] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Nuevas / Usuarios ({reviews.filter((r) => !r.isExample).length})
          </button>
          <button
            onClick={() => setFilter('example')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filter === 'example'
                ? 'bg-[#102A43] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Contenido Demostración ({reviews.filter((r) => !!r.isExample).length})
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filter === 'hidden'
                ? 'bg-[#102A43] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Ocultas ({reviews.filter((r) => r.status === 'hidden').length})
          </button>
        </div>

        {/* Reviews List table/cards */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              No hay reseñas en esta categoría.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-3.5 rounded-2xl border transition-all text-xs ${
                  rev.status === 'hidden'
                    ? 'bg-neutral-50/80 border-neutral-200 opacity-60'
                    : 'bg-white border-neutral-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{rev.author.name}</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      ★ {rev.rating}
                    </span>
                    {rev.isExample ? (
                      <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-medium border border-sky-100">
                        Demo
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-100">
                        Cliente Real
                      </span>
                    )}
                    {rev.status === 'hidden' && (
                      <span className="text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-semibold">
                        Oculta
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-neutral-400">
                    {formatReviewDate(rev.createdAt)}
                  </span>
                </div>

                <p className="text-neutral-700 leading-relaxed mb-3 italic">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    ID Producto: {rev.productId}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onToggleStatus(rev.id, rev.status === 'hidden' ? 'approved' : 'hidden')
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        rev.status === 'hidden'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {rev.status === 'hidden' ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Aprobar / Mostrar</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ocultar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar reseña"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
