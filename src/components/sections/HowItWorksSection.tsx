import { ErrorBoundary } from '../ErrorBoundary';
import { Check, MessageCircle, Truck, Home, Clock, MapPin, Sparkles, X } from 'lucide-react';
import { ENVIO_ORIGEN_MAPS_URL, ENVIO_ORIGEN, ENVIO_BASE_GS } from '../../utils/envio';
import { formatGuarani } from '../../data/products';

interface HowItWorksSectionProps {}

export function HowItWorksSection() {
  return (
    <ErrorBoundary>
      <section className="mt-14 bg-white/80 border border-[#102A43]/10 rounded-3xl p-6 sm:p-8 shadow-xs hidden sm:block">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Flujo de Compra Rápido
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mt-2 mb-2">
            ¿Cómo realizo mi pedido?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6">
            Sin registros lentos ni pasarelas complejas. Cuatro simples pasos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="font-semibold text-xs text-neutral-900">Elegí tus productos</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  Presioná "+" en cualquier sérum o crema para sumarlo al carrito.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="font-semibold text-xs text-neutral-900">Revisá en tu pedido</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  Tocá el carrito flotante para verificar cantidades y el total estimado.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="font-semibold text-xs text-neutral-900">Datos para el envío</h4>
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                  Completá en el carrito tus datos para coordinar la entrega:
                </p>
                <ul className="mt-1.5 space-y-0.5 text-[10px] text-neutral-700 font-medium">
                  <li className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                    <span>Nombre del cliente</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                    <span>Lugar de ubicación para envío</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                    <span>Link de Google Maps</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h4 className="font-semibold text-xs text-neutral-900">Pedir por WhatsApp</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  Se abrirá tu chat con la lista completa de productos y todos tus datos listos para confirmar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}