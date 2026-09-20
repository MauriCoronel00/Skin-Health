import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, Check, Filter } from 'lucide-react';
import { Product, ProductReview, ReviewUser } from '../types';
import { getProductRatingStats } from '../data/demoReviews';
import { formatReviewDate } from '../utils/reviewsStorage';

interface ProductReviewsSectionProps {
  product: Product;
  reviews: ProductReview[];
  onOpenReviewModal: () => void;
  currentUser: ReviewUser | null;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  reviews,
  onOpenReviewModal,
  currentUser,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [helpfulIds, setHelpfulIds] = useState<Record<string, boolean>>({});

  // Relevant approved reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && (r.status === 'approved' || r.status === undefined)
  );

  const stats = getProductRatingStats(product.id, reviews);

  // Filtered list by star rating
  const displayedReviews = productReviews.filter((r) => {
    if (selectedFilter === 'all') return true;
    return Math.round(r.rating) === selectedFilter;
  });

  const toggleHelpful = (reviewId: string) => {
    setHelpfulIds((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Header with Title and "Dejar una reseña" action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#102A43]/10">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#102A43]">
              Opiniones de clientes
            </h4>
            <span className="text-xs bg-[#102A43]/5 text-[#102A43] font-semibold px-2.5 py-0.5 rounded-full">
              {stats.totalReviews}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Experiencias compartidas por compradores y recomendaciones de la comunidad.
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenReviewModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#102A43] text-white text-xs sm:text-sm font-semibold hover:bg-[#102A43]/90 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          </div>
          <span>Dejar una reseña</span>
        </motion.button>
      </div>

      {/* Summary Score & Distribution Breakdown Box */}
      <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-[#102A43]/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big Average Score */}
        <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center md:border-r md:border-[#102A43]/10 md:pr-6">
          <div className="text-4xl sm:text-5xl font-extrabold text-[#102A43] font-serif tracking-tight">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 my-1.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(stats.averageRating)
                    ? 'fill-amber-400 stroke-amber-400'
                    : 'fill-neutral-200 stroke-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            Basado en {stats.totalReviews} opiniones
          </span>
        </div>

        {/* Star Bars Breakdown */}
        <div className="md:col-span-8 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedFilter(selectedFilter === star ? 'all' : (star as 1 | 2 | 3 | 4 | 5))}
                className={`w-full flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors p-0.5 rounded-md cursor-pointer ${
                  selectedFilter === star ? 'font-bold text-[#102A43]' : ''
                }`}
              >
                <span className="w-12 text-left font-medium flex items-center gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 bg-neutral-200/80 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      star >= 4
                        ? 'bg-amber-400'
                        : star === 3
                        ? 'bg-amber-300'
                        : 'bg-neutral-400'
                    }`}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-neutral-400 font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips if any filter active */}
      {selectedFilter !== 'all' && (
        <div className="flex items-center justify-between text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
          <span>
            Mostrando opiniones de <strong>{selectedFilter} estrellas</strong> ({displayedReviews.length})
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className="text-[#102A43] font-semibold hover:underline cursor-pointer"
          >
            Ver todas
          </button>
        </div>
      )}

      {/* Reviews List - solo 3 + link pequeño Gmail */}
      <div className="space-y-3.5">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100 p-6">
            <p className="text-xs text-neutral-500 mb-3">
              No hay opiniones con esta cantidad de estrellas todavía.
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="text-xs text-[#102A43] font-semibold underline cursor-pointer"
            >
              Ver todas las opiniones
            </button>
          </div>
        ) : (
          displayedReviews.slice(0, 3).map((rev) => {
            const isHelpful = !!helpfulIds[rev.id];

            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-2xs hover:border-[#102A43]/20 transition-all"
              >
                {/* Review Header: User avatar, Name, Stars, Date */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    {rev.author.avatarUrl ? (
                      <img
                        src={rev.author.avatarUrl}
                        alt={rev.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#102A43]/10 text-[#102A43] font-bold text-xs flex items-center justify-center">
                        {rev.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-neutral-900 leading-tight">
                          {rev.author.name}
                        </span>

                        {/* Verified purchase badge only when genuine */}
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-1.5 py-0.2 rounded-md">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Compra verificada
                          </span>
                        )}

                        {/* Clean location indicator if provided */}
                        {rev.city && (
                          <span className="text-[11px] text-neutral-400">
                            — {rev.city}, Paraguay
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'fill-amber-400 stroke-amber-400'
                                  : 'fill-neutral-200 stroke-neutral-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-neutral-800 ml-1">
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Relative or formatted date */}
                  <span className="text-[11px] text-neutral-400 whitespace-nowrap shrink-0">
                    {formatReviewDate(rev.createdAt)}
                  </span>
                </div>

                {/* Review Comment Text */}
                {rev.comment && (
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pl-1 sm:pl-11 font-normal">
                    &quot;{rev.comment}&quot;
                  </p>
                )}

                {/* Helpful button */}
                <div className="mt-3 pl-1 sm:pl-11 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => toggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      isHelpful
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'hover:bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isHelpful ? 'fill-emerald-600' : ''}`} />
                    <span>{isHelpful ? 'Te resultó útil' : '¿Te resultó útil?'}</span>
                  </button>

                  <span className="text-[10px] text-neutral-400">
                    Opinión de cliente de Skin Health
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
        <div className="flex justify-end mt-3">
          <button
            onClick={onOpenReviewModal}
            className="text-[11px] text-neutral-500 hover:text-[#102A43] underline underline-offset-2"
          >
            Déjanos tu opinión
          </button>
        </div>
      </div>
    </div>
  );
};
