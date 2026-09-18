import { supabase } from '../lib/supabaseClient';
import { formatGuarani } from './products';

export type TrackingEstado = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';

export interface TrackingItem {
  nombre: string;
  cantidad: number;
}

export interface TrackingInfo {
  codigo: string;
  estado: TrackingEstado;
  totalGs: number;
  costoEnvioGs: number;
  creadoEn: string;
  zona: string;
  items: TrackingItem[];
}

export const TRACKING_STEPS: { id: Exclude<TrackingEstado, 'cancelado'>; label: string }[] = [
  { id: 'pendiente', label: 'Recibido' },
  { id: 'pagado', label: 'Pagado' },
  { id: 'enviado', label: 'En camino' },
  { id: 'entregado', label: 'Entregado' },
];

/** Seguimiento público por código (sin datos sensibles). Null si no existe. */
export async function fetchTracking(codigo: string): Promise<TrackingInfo | null> {
  const clean = codigo.trim().toUpperCase();
  if (!clean) return null;
  const { data, error } = await supabase.rpc('get_pedido_tracking', {
    p_codigo: clean,
  });
  if (error) return null;
  const r = data as {
    codigo: string;
    estado: TrackingEstado;
    total_gs: number;
    costo_envio_gs: number;
    creado_en: string;
    zona: string;
    items: TrackingItem[];
  };
  return {
    codigo: r.codigo,
    estado: r.estado,
    totalGs: r.total_gs,
    costoEnvioGs: r.costo_envio_gs ?? 0,
    creadoEn: r.creado_en,
    zona: r.zona,
    items: r.items ?? [],
  };
}

export function trackingLink(codigo: string): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('track', codigo.toUpperCase());
  return url.toString();
}

export function formatTrackingTotal(t: TrackingInfo): string {
  return formatGuarani(t.totalGs + t.costoEnvioGs);
}
