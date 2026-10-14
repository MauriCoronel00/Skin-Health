import { ErrorBoundary } from '../ErrorBoundary';
import { getSkinFilters, getPriceFilters } from '../../contexts/ProductContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CatalogFiltersSectionProps {
  selectedSkin: string;
  setSelectedSkin: (s: string) => void;
  selectedPrice: string;
  setSelectedPrice: (p: string) => void;
}

export function CatalogFiltersSection({
  selectedSkin,
  setSelectedSkin,
  selectedPrice,
  setSelectedPrice,
}: CatalogFiltersSectionProps) {
  const { t, formatCurrency } = useLanguage();
  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-2 pb-4 border-b border-[#102A43]/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-400 font-medium mr-1 shrink-0">
            {t.filterSkin}
          </span>
          {[{ id: 'all', label: t.filterAll }, ...getSkinFilters(t)].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedSkin(f.id)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedSkin === f.id
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-neutral-400 font-medium mr-1 shrink-0">
            {t.filterPrice}
          </span>
          {[{ id: 'all', label: t.filterPriceAll }, ...getPriceFilters(t, formatCurrency)].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedPrice(f.id)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPrice === f.id
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
