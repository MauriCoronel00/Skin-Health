import { formatGuarani } from '../data/products';

export interface RecuperacionItem {
  producto_nombre?: string | null;
  producto_id: string | null;
  cantidad: number;
  precio_unitario_gs: number;
}

/** Normaliza un teléfono PY (09xx...) al formato wa.me (5959xx...). Null si inválido. */
export function toWhatsAppNumber(telefono: string | null | undefined): string | null {
  if (!telefono) return null;
  const digits = telefono.replace(/\D/g, '');
  if (/^09\d{8}$/.test(digits)) return `595${digits.slice(1)}`;
  if (/^5959\d{8}$/.test(digits)) return digits;
  return null;
}

function resumenItems(items: RecuperacionItem[]): string {
  return items
    .map((it) => `• ${it.producto_nombre ?? it.producto_id ?? 'Producto'} × ${it.cantidad}`)
    .join('\n');
}

/** Mensaje de recuperación para pedido pendiente (1er toque, amable + fricción cero). */
export function mensajeRecuperacion(
  nombre: string,
  codigo: string,
  totalGs: number,
  items: RecuperacionItem[]
): string {
  const primero = (nombre ?? '').trim().split(' ')[0] || 'hola';
  return (
    `Hola ${primero}, somos Skin Health 💙\n` +
    `Vimos tu pedido ${codigo} por ${formatGuarani(totalGs)}:\n` +
    `${resumenItems(items)}\n\n` +
    `¿Te lo reservo? Solo pasame la captura del pago y tu dirección y te lo enviamos hoy.`
  );
}

/** Mensaje para pedido cancelado (2do toque, incentivo). */
export function mensajeReactivacion(
  nombre: string,
  codigo: string,
  totalGs: number,
  items: RecuperacionItem[]
): string {
  const primero = (nombre ?? '').trim().split(' ')[0] || 'hola';
  return (
    `Hola ${primero}, somos Skin Health 💙\n` +
    `Tu pedido ${codigo} por ${formatGuarani(totalGs)} quedó pendiente:\n` +
    `${resumenItems(items)}\n\n` +
    `Si lo retomás hoy te asesoramos gratis tu rutina. ¿Te lo armamos de nuevo?`
  );
}

/** Link wa.me listo para abrir. Null si el teléfono no es válido. */
export function linkRecuperacion(
  telefono: string | null | undefined,
  mensaje: string
): string | null {
  const numero = toWhatsAppNumber(telefono);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
