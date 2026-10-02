import { ErrorBoundary } from '../ErrorBoundary';
import { Gem, Check, MessageCircle } from 'lucide-react';

export function PremiumSection() {
  return (
    <ErrorBoundary>
      <section className="mt-10 bg-[#102A43] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-white/90">
            <Gem className="w-3.5 h-3.5 text-emerald-300" />
            Plan mensual
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white mt-3">Suscripción Premium</h3>
          <p className="text-sm text-white/70 mt-2">Acceso exclusivo para cuidar tu piel sin equivocarte. Asesoría 100% enfocada a tu necesidad.</p>
          <ul className="mt-5 text-sm text-white/85 text-left max-w-md mx-auto space-y-2.5">
            <li className="flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-300" /></span> Rutina 100% personalizada + seguimiento mensual</li>
            <li className="flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-300" /></span> Atención prioritaria por WhatsApp</li>
            <li className="flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-300" /></span> Acceso anticipado a nuevos ingresos</li>
            <li className="flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-300" /></span> Envíos Priority a todo el país</li>
          </ul>
          <a href="https://wa.me/595976659748?text=Hola%20Skin%20Health%20quiero%20la%20suscripcion%20Premium%2055.000Gs" target="_blank" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#102A43] text-sm font-bold hover:bg-white/90 transition-all shadow-md">
            <MessageCircle className="w-4 h-4" />
            <span>Suscribirme — 55.000 Gs./mes</span>
          </a>
          <p className="text-[11px] text-white/60 mt-2">Cancelás cuando quieras. Atención directa por WhatsApp.</p>
        </div>
      </section>
    </ErrorBoundary>
  );
}