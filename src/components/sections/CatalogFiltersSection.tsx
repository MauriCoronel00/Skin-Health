import { ErrorBoundary } from '../ErrorBoundary';
import { SKIN_FILTERS, PRICE_FILTERS } from '../../contexts/ProductContext';

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
  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-2 pb-4 border-b border-[#102A43]/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-neutral-400 font-medium mr-1 shrink-0">
            Piel:
          </span>
          {[{ id: 'all', label: 'Todas' }, ...SKIN_FILTERS].map((f) => (
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
          <span className="text-[11px] text-neutral-400 font-medium mr-1 shrink-0">
            Precio:
          </span>
          {[{ id: 'all', label: 'Todos' }, ...PRICE_FILTERS].map((f) => (
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