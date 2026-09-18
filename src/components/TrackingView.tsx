import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  PackageSearch,
  CheckCircle2,
  Truck,
  Home,
  Ban,
  MapPin,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  fetchTracking,
  TRACKING_STEPS,
  TrackingInfo,
  formatTrackingTotal,
} from '../data/tracking';
import { formatGuarani } from '../data/products';
import { ENVIO_ORIGEN_MAPS_URL } from '../utils/envio';

const STEP_ICON = [PackageSearch, CheckCircle2, Truck, Home] as const;

function stepIndex(estado: string): number {
  return TRACKING_STEPS.findIndex((s) => s.id === estado);
}

export const TrackingView: React.FC<{ codigoInicial: string; onVolver: () => void }> = ({
  codigoInicial,
  onVolver,
}) => {
  const [codigo, setCodigo] = useState(codigoInicial);
  const [info, setInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async (cod: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const t = await fetchTracking(cod);
      if (!t) setNotFound(true);
      setInfo(t);
    } catch {
      setNotFound(true);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(codigoInicial);
  }, [codigoInicial, load]);

  // Auto-refresh cada 30s mientras no esté entregado/cancelado
  useEffect(() => {
    if (!info || info.estado === 'entregado' || info.estado === 'cancelado') return;
    const id = window.setInterval(() => void load(info.codigo), 30000);
    return () => window.clearInterval(id);
  }, [info, load]);

  const mapQuery = info?.zona?.trim()
    ? `https://www.google.com/maps?q=${encodeURIComponent(info.zona + ', Paraguay')}&output=embed`
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onVolver}
        className="text-xs text-neutral-500 hover:text-[#102A43] mb-4 cursor-pointer"
      >
        ← Volver a la tienda
      </button>

      <div className="bg-white rounded-3xl border border-[#102A43]/10 p-6 sm:p-8 shadow-xs">
        <h2 className="font-serif text-2xl font-semibold text-[#102A43] text-center">
          Seguí tu pedido
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(codigo);
          }}
          className="flex gap-2 mt-4"
        >
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="SKIN-XXXXXXXX"
            aria-label="Código de pedido"
            className="flex-1 h-11 px-4 rounded-full bg-[#FAF8F5] border border-neutral-200 text-sm font-mono uppercase outline-none focus:border-[#102A43]/40"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-full bg-[#102A43] text-white text-sm font-semibold hover:bg-[#102A43]/90 cursor-pointer flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Ver</span>
          </button>
        </form>

        {notFound && !loading && (
          <p className="text-center text-sm text-rose-600 mt-6">
            No encontramos ese código. Revisalo e intentá de nuevo.
          </p>
        )}

        {info && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="text-center">
              <span className="font-mono font-bold text-[#102A43]">{info.codigo}</span>
              <span className="text-neutral-400 text-xs ml-2">
                actualiza solo cada 30 seg
              </span>
            </div>

            {info.estado === 'cancelado' ? (
              <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-700 text-sm font-semibold">
                <Ban className="w-5 h-5" />
                <span>Este pedido fue cancelado. Escribinos y lo armamos de nuevo.</span>
              </div>
            ) : (
              <ol className="mt-6 space-y-0">
                {TRACKING_STEPS.map((step, i) => {
                  const done = i <= stepIndex(info.estado);
                  const current = i === stepIndex(info.estado);
                  const Icon = STEP_ICON[i];
                  return (
                    <li key={step.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            done ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-400'
                          } ${current ? 'ring-4 ring-emerald-100' : ''}`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        {i < TRACKING_STEPS.length - 1 && (
                          <span className={`w-0.5 flex-1 min-h-6 ${done ? 'bg-emerald-300' : 'bg-neutral-100'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-semibold ${done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {step.label}
                        </p>
                        {current && (
                          <p className="text-xs text-emerald-600 font-medium">Estado actual</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-2 bg-[#FAF8F5] rounded-2xl p-4 border border-neutral-100 text-xs space-y-1">
              {info.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-neutral-600">
                  <span>{it.nombre} × {it.cantidad}</span>
                </div>
              ))}
              <div className="flex justify-between text-neutral-500 pt-1">
                <span>Envío a {info.zona || 'tu zona'}</span>
                <span>{formatGuarani(info.costoEnvioGs)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#102A43] pt-1 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatTrackingTotal(info)}</span>
              </div>
            </div>

            {mapQuery && (
              <div className="mt-4">
                <p className="text-xs text-neutral-500 flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Zona de entrega aproximada
                </p>
                <iframe
                  title={`Mapa de entrega ${info.codigo}`}
                  src={mapQuery}
                  className="w-full h-56 rounded-2xl border border-neutral-200"
                  loading="lazy"
                />
                <a
                  href={ENVIO_ORIGEN_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-700 underline mt-2 inline-block"
                >
                  Cómo llegar desde nuestro local
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
