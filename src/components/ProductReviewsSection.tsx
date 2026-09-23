import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, ThumbsUp, ImageIcon, MessageSquare } from 'lucide-react';
import { Product, ProductReview, ReviewUser, TipoPiel } from '../types';
import { getProductRatingStats } from '../data/demoReviews';
import { formatReviewDate } from '../utils/reviewsStorage';

interface ProductReviewsSectionProps {
  product: Product;
  reviews: ProductReview[];
  onOpenReviewModal: () => void;
  currentUser: ReviewUser | null;
  onToggleUtil?: (reviewId: string) => void;
}

type SortMode = 'utiles' | 'recientes' | 'mejores' | 'peores';

const TIPO_PIEL_LABEL: Record<TipoPiel, string> = {
  grasa: 'Piel grasa',
  seca: 'Piel seca',
  mixta: 'Piel mixta',
  sensible: 'Piel sensible',
  normal: 'Piel normal',
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  reviews,
  onOpenReviewModal,
  currentUser,
  onToggleUtil,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [filterConFotos, setFilterConFotos] = useState(false);
  const [filterVerificado, setFilterVerificado] = useState(false);
  const [filterTipoPiel, setFilterTipoPiel] = useState<TipoPiel | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('utiles');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Relevant approved reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && (r.status === 'approved' || r.status === undefined)
  );

  const stats = getProductRatingStats(product.id, reviews);

  // Filtros aplicados
  const filteredReviews = productReviews.filter((r) => {
    if (selectedFilter !== 'all' && Math.round(r.rating) !== selectedFilter) return false;
    if (filterConFotos && (!r.fotos || r.fotos.length === 0)) return false;
    if (filterVerificado && !r.isVerifiedPurchase) return false;
    if (filterTipoPiel !== 'all' && r.tipoPiel !== filterTipoPiel) return false;
    return true;
  });

  // Ordenar
  const displayedReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    switch (sortMode) {
      case 'utiles':
        return sorted.sort(
          (a, b) =>
            (b.utilesCount ?? 0) - (a.utilesCount ?? 0) ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'recientes':
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'mejores':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'peores':
        return sorted.sort((a, b) => a.rating - b.rating);
    }
  }, [filteredReviews, sortMode]);

  const handleToggleUtil = (reviewId: string) => {
    if (!currentUser) {
      onOpenReviewModal(); // fuerza login
      return;
    }
    onToggleUtil?.(reviewId);
  };

  const activeFiltersCount =
    (selectedFilter !== 'all' ? 1 : 0) +
    (filterConFotos ? 1 : 0) +
    (filterVerificado ? 1 : 0) +
    (filterTipoPiel !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedFilter('all');
    setFilterConFotos(false);
    setFilterVerificado(false);
    setFilterTipoPiel('all');
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
                <span className="w-8 text-right text-xs text-neutral-400 font-medium">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtros + Sort */}
      <div className="flex flex-col gap-3">
        {/* Chips de filtro */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterConFotos((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterConFotos
                ? 'bg-[#102A43] text-white border-[#102A43]'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#102A43]/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Con fotos
          </button>
          <button
            type="button"
            onClick={() => setFilterVerificado((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterVerificado
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-500/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Compra verificada
          </button>
          {(['grasa', 'seca', 'mixta', 'sensible', 'normal'] as TipoPiel[]).map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setFilterTipoPiel((current) => (current === tp ? 'all' : tp))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterTipoPiel === tp
                  ? 'bg-[#102A43] text-white border-[#102A43]'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#102A43]/40'
              }`}
            >
              {TIPO_PIEL_LABEL[tp]}
            </button>
          ))}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#102A43] font-semibold hover:underline cursor-pointer ml-1"
            >
              Limpiar filtros ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Sort dropdown + contador */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {displayedReviews.length}{' '}
            {displayedReviews.length === 1 ? 'reseña' : 'reseñas'}
            {activeFiltersCount > 0 && ' con estos filtros'}
          </span>
          <label className="inline-flex items-center gap-2">
            <span className="text-neutral-500">Ordenar:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="text-xs font-semibold text-[#102A43] bg-white border border-neutral-200 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-[#102A43]/40"
            >
              <option value="utiles">Más útiles</option>
              <option value="recientes">Más recientes</option>
              <option value="mejores">Mejor puntaje</option>
              <option value="peores">Peor puntaje</option>
            </select>
          </label>
        </div>
      </div>

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
          displayedReviews.slice(0, 5).map((rev) => {
            const isHelpful = !!rev.usuarioMarcoUtil;
            const utilesCount = rev.utilesCount ?? 0;

            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-2xs hover:border-[#102A43]/20 transition-all"
              >
                {/* Review Header: avatar + nombre + badges + fecha */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {rev.author.avatarUrl ? (
                      <img
                        src={rev.author.avatarUrl}
                        alt={rev.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#102A43]/10 text-[#102A43] font-bold text-xs flex items-center justify-center shrink-0">
                        {rev.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-neutral-900 leading-tight">
                          {rev.author.name}
                        </span>

                        {rev.isVerifiedPurchase && (
                          <span
                            className="inline-flex items-center gap-0.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-1.5 py-0.5 rounded-md"
                            title="Este cliente compró el producto en Skin Health"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verificada
                          </span>
                        )}

                        {rev.tipoPiel && (
                          <span className="inline-flex items-center text-xs text-[#102A43] bg-[#102A43]/5 border border-[#102A43]/15 font-semibold px-1.5 py-0.5 rounded-md">
                            {TIPO_PIEL_LABEL[rev.tipoPiel]}
                          </span>
                        )}

                        {rev.city && (
                          <span className="text-xs text-neutral-400">— {rev.city}</span>
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

                  <span
                    className="text-xs text-neutral-400 whitespace-nowrap shrink-0"
                    title={new Date(rev.createdAt).toLocaleString('es-PY')}
                  >
                    {formatReviewDate(rev.createdAt)}
                  </span>
                </div>

                {/* Comentario */}
                {rev.comment && (
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pl-1 sm:pl-11 font-normal">
                    &quot;{rev.comment}&quot;
                  </p>
                )}

                {/* Fotos (R12) */}
                {rev.fotos && rev.fotos.length > 0 && (
                  <div className="mt-3 pl-1 sm:pl-11 flex flex-wrap gap-2">
                    {rev.fotos.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setLightboxUrl(url)}
                        className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 hover:border-[#102A43]/40 transition-all cursor-zoom-in"
                        aria-label="Ver foto en grande"
                      >
                        <img src={url} alt="Foto de reseña" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Respuesta del vendedor (R14) */}
                {rev.respuestaAdmin && (
                  <div className="mt-3 pl-1 sm:pl-11">
                    <div className="bg-[#102A43]/5 border-l-2 border-[#102A43] rounded-r-xl px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3 h-3 text-[#102A43]" />
                        <span className="text-xs font-bold text-[#102A43]">
                          Skin Health responde
                        </span>
                        {rev.respuestaAdminCreadaEn && (
                          <span className="text-xs text-neutral-400">
                            · {formatReviewDate(rev.respuestaAdminCreadaEn)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        {rev.respuestaAdmin}
                      </p>
                    </div>
                  </div>
                )}

                {/* Helpful button + count (R13) */}
                <div className="mt-3 pl-1 sm:pl-11 flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => handleToggleUtil(rev.id)}
                    className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      isHelpful
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'hover:bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isHelpful ? 'fill-emerald-600' : ''}`} />
                    <span>
                      {isHelpful ? 'Te resultó útil' : '¿Te resultó útil?'}
                      {utilesCount > 0 && ` (${utilesCount})`}
                    </span>
                  </button>

                  <span className="text-xs text-neutral-400">
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
            className="text-xs text-neutral-500 hover:text-[#102A43] underline underline-offset-2"
          >
            Déjanos tu opinión
          </button>
        </div>
      </div>

      {/* Lightbox de fotos (R12) */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
          role="dialog"
          aria-label="Foto de reseña ampliada"
        >
          <img
            src={lightboxUrl}
            alt="Foto de reseña"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
