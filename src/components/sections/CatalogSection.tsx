import { ErrorBoundary } from '../ErrorBoundary';
import { ProductGridSkeleton } from '../Skeleton';
import { ProductCard } from '../ProductCard';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface CatalogSectionProps {
  isLoadingProducts: boolean;
  catalogError: boolean;
  filteredProducts: Product[];
  cartQuantities: Record<string, number>;
  onQuickView: (product: Product) => void;
  onAdd: (product: Product) => void;
  loadCatalog: () => Promise<void>;
  resetFilters: () => void;
}

export function CatalogSection({
  isLoadingProducts,
  catalogError,
  filteredProducts,
  cartQuantities,
  onQuickView,
  onAdd,
  loadCatalog,
  resetFilters,
}: CatalogSectionProps) {
  const { t } = useLanguage();
  return (
    <ErrorBoundary>
      <div className="mt-6">
        {isLoadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : catalogError ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100 p-8">
            <h3 className="font-semibold text-neutral-800 text-lg mb-1">
              {t.catalogError}
            </h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-5">
              {t.catalogErrorHint}
            </p>
            <button
              onClick={() => void loadCatalog()}
              className="px-5 py-2.5 bg-[#102A43] text-white text-xs font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
            >
              {t.catalogRetry}
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100 p-8">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-neutral-400 mb-3">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-800 text-lg mb-1">
              {t.catalogEmpty}
            </h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-5">
              {t.catalogEmptyHint}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#102A43] text-white text-xs font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
            >
              {t.catalogResetFilters}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={cartQuantities[product.id] || 0}
                onQuickView={onQuickView}
                onAdd={onAdd}
              />
            ))}
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}