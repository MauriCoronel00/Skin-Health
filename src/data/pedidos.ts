import { supabase } from '../lib/supabaseClient';
import { formatGuarani, STORE_PHONE_NUMBER } from './products';
import { trackOrderSubmitted } from '../utils/analytics';

export interface CreatePedidoItemInput {
  productoId: string;
  cantidad: number;
}

export interface CreatePedidoInput {
  nombre: string;
  telefono: string;
  direccion: string;
  items: CreatePedidoItemInput[];
}

export interface PedidoReceipt {
  pedidoId: string;
  codigo: string;
  totalGs: number;
  message: string;
  whatsappUrl: string;
}

export type PedidoErrorCode =
  | 'EMPTY'
  | 'CUSTOMER_DATA'
  | 'NOT_AUTHENTICATED'
  | 'NO_STOCK'
  | 'UNAVAILABLE'
  | 'ORDER_FAILED';

export class PedidoError extends Error {
  code: PedidoErrorCode;
  userMessage: string;
  constructor(code: PedidoErrorCode, userMessage: string) {
    super(`${code}: ${userMessage}`);
    this.code = code;
    this.userMessage = userMessage;
  }
}

export interface PedidoMessageLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** Mensaje de WhatsApp para un pedido ya registrado (fuente de verdad: Supabase). */
export function buildPedidoMessage(opts: {
  codigo: string;
  lines: PedidoMessageLine[];
  totalGs: number;
  nombre: string;
  telefono: string;
  direccion: string;
  /** El borrador copiado a mano es estimado; el registrado es final. */
  totalLabel?: 'TOTAL' | 'TOTAL ESTIMADO';
}): string {
  const itemsLines = opts.lines
    .map((l) => `• ${l.name} x${l.quantity} — ${formatGuarani(l.lineTotal)}`)
    .join('\n');

  let message = `Hola 👋 Quiero realizar el pedido *${opts.codigo}* en *Skin Health*:\n\n🛍️ *PRODUCTOS SELECCIONADOS*\n${itemsLines}\n\n💰 *${opts.totalLabel ?? 'TOTAL'}*: ${formatGuarani(
    opts.totalGs
  )}\n\n📍 *REQUISITOS PARA EL ENVÍO*:\n• *Nombre del cliente*: ${
    opts.nombre.trim() ? opts.nombre.trim() : '[Por especificar]'
  }\n• *Teléfono de contacto*: ${
    opts.telefono.trim() ? opts.telefono.trim() : '[Por especificar]'
  }\n• *Lugar de ubicación*: ${
    opts.direccion.trim() ? opts.direccion.trim() : '[Por especificar]'
  }`;

  message += `\n\nQuedo a la espera de confirmación de stock y métodos de pago. ¡Muchas gracias!`;
  return message;
}

export function rpcErrorToPedidoError(err: unknown): PedidoError {
  const msg = err instanceof Error ? err.message : '';
  if (msg.includes('NO_STOCK'))
    return new PedidoError(
      'NO_STOCK',
      'Algún producto se quedó sin stock. Ajustá cantidades e intentá de nuevo.'
    );
  if (msg.includes('UNAVAILABLE'))
    return new PedidoError(
      'UNAVAILABLE',
      'Algún producto ya no está disponible. Revisá tu carrito e intentá de nuevo.'
    );
  if (msg.includes('EMPTY_ORDER') || msg.includes('MISSING_CUSTOMER_DATA'))
    return new PedidoError(
      'CUSTOMER_DATA',
      'Revisá los datos del pedido e intentá de nuevo.'
    );
  return new PedidoError(
    'ORDER_FAILED',
    'Tu carrito está a salvo. Probá de nuevo en unos segundos.'
  );
}

/**
 * Pedido intake: valida, crea el pedido vía RPC (total y stock server-side),
 * sincroniza el teléfono del perfil y arma el aviso de WhatsApp.
 * Si falla, NO hay recibo ni URL: el llamador no debe abrir WhatsApp (ADR-002).
 */
export async function createPedido(input: CreatePedidoInput): Promise<PedidoReceipt> {
  if (input.items.length === 0) {
    throw new PedidoError('EMPTY', 'Agregá productos antes de confirmar.');
  }
  if (!input.nombre.trim() || !input.direccion.trim()) {
    throw new PedidoError(
      'CUSTOMER_DATA',
      'Completá tu nombre y ubicación para coordinar la entrega.'
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new PedidoError(
      'NOT_AUTHENTICATED',
      'Iniciá sesión para continuar con tu pedido.'
    );
  }

  let pedidoId: string;
  try {
    const { data, error } = await supabase.rpc('crear_pedido', {
      p_cliente_nombre: input.nombre.trim(),
      p_cliente_telefono: input.telefono.trim(),
      p_direccion_envio: input.direccion.trim(),
      p_items: input.items.map((item) => ({
        producto_id: item.productoId,
        cantidad: item.cantidad,
      })),
    });
    if (error) throw error;
    pedidoId = data as string;
  } catch (err) {
    throw rpcErrorToPedidoError(err);
  }

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .select('codigo_pedido, total_gs')
    .eq('id', pedidoId)
    .single();
  if (pedidoError || !pedido) {
    throw new PedidoError(
      'ORDER_FAILED',
      'Tu carrito está a salvo. Probá de nuevo en unos segundos.'
    );
  }

  const codigo = (pedido as { codigo_pedido: string }).codigo_pedido;
  const totalGs = (pedido as { total_gs: number }).total_gs;

  // Mejor esfuerzo: no bloquea el pedido si falla.
  if (input.telefono.trim()) {
    await supabase
      .from('perfiles')
      .update({ telefono: input.telefono.trim() })
      .eq('id', user.id);
  }

  const message = await buildReceiptMessage(
    pedidoId,
    codigo,
    totalGs,
    input.nombre,
    input.telefono,
    input.direccion
  );
  const whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message.text)}`;

  trackOrderSubmitted(
    codigo,
    message.lines.map((l) => ({
      product: { id: l.productId, name: l.name, brand: '', price: l.unitPrice },
      quantity: l.quantity,
    })),
    totalGs
  );

  return { pedidoId, codigo, totalGs, message: message.text, whatsappUrl };
}

/** Arma las líneas del recibo desde la DB (nombres y precios reales). */
async function buildReceiptMessage(
  pedidoId: string,
  codigo: string,
  totalGs: number,
  nombre: string,
  telefono: string,
  direccion: string
): Promise<{ text: string; lines: PedidoMessageLine[] }> {
  const { data: itemRows } = await supabase
    .from('pedido_items')
    .select('cantidad, precio_unitario_gs, producto_id, productos ( nombre )')
    .eq('pedido_id', pedidoId);

  const lines = ((itemRows ?? []) as unknown as {
    cantidad: number;
    precio_unitario_gs: number;
    producto_id: string | null;
    productos: { nombre: string } | null;
  }[]).map((r) => ({
    productId: r.producto_id ?? '',
    name: r.productos?.nombre ?? r.producto_id ?? '?',
    quantity: r.cantidad,
    unitPrice: r.precio_unitario_gs,
    lineTotal: r.precio_unitario_gs * r.cantidad,
  }));

  const text = buildPedidoMessage({
    codigo,
    lines,
    totalGs,
    nombre,
    telefono,
    direccion,
  });
  return { text, lines };
}
