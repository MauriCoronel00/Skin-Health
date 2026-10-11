import { MapPin, CheckCircle2 } from 'lucide-react';
import { ZonaEnvio } from '../data/zonasEnvio';

interface ZonaCardProps {
  zona: ZonaEnvio;
  isSelected: boolean;
  onSelect: () => void;
}

export const ZonaCard = ({ zona, isSelected, onSelect }: ZonaCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/10'
          : 'border-stone-200 hover:border-stone-300 bg-white'
      }`}
    >
      <div className="flex gap-3 items-start">
        <MapPin className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-stone-400'}`} />
        <div className="space-y-0.5">
          <p className="font-semibold text-stone-900 text-sm">
            {zona.nombre}
          </p>
          <p className="text-xs text-stone-500">
            ₲ {zona.precioGs.toLocaleString('es-PY')} — {zona.tiempoEstimado}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center w-5 h-5 ml-2">
        {isSelected ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <div className="w-4 h-4 rounded-full border border-stone-300" />
        )}
      </div>
    </button>
  );
};
