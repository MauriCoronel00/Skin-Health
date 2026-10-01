import { supabase } from '../lib/supabaseClient';

export type PedidoEstado = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';

export interface AdminPedido {
  id: string;
  codigo_pedido: string | null;
  cliente_nombre: string;
  cliente_telefono: string;
  total_gs: number;
  costo_envio_gs: number | null;
  estado: PedidoEstado;
  creado_en: string;
  direccion_envio: string | null;
  metodo_pago: string | null;
  referencia_pago: string | null;
  comprobante_url: string | null;
  confirmado_por: string | null;
}

export interface AdminPedidoItem {
  id: string;
  producto_id: string | null;
  cantidad: number;
  precio_unitario_gs: number;
  producto_nombre?: string;
}

export interface StockRow {
  id: string;
  nombre: string;
  marca: string;
  stock: number;
  precio_gs: number;
  activo: boolean;
}

export interface AuditLogEntry {
  id: string;
  admin_user_id: string | null;
  accion: string;
  tabla_objetivo: string;
  registro_objetivo: string | null;
  detalle: string | null;
  realizado_en: string;
}

/** true si la sesión actual tiene rol admin en perfiles. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.rpc('es_admin');
  if (error) return false;
  return data === true;
}

export async function fetchPedidos(): Promise<AdminPedido[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select(
      'id, codigo_pedido, cliente_nombre, cliente_telefono, total_gs, costo_envio_gs, estado, creado_en, direccion_envio, metodo_pago, referencia_pago, comprobante_url, confirmado_por'
    )
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminPedido[];
}

export async function fetchPedidoItems(pedidoId: string): Promise<AdminPedidoItem[]> {
  const { data, error } = await supabase
    .from('pedido_items')
    .select('id, producto_id, cantidad, precio_unitario_gs, productos ( nombre )')
    .eq('pedido_id', pedidoId);
  if (error) throw error;
  return ((data ?? []) as unknown[]).map((r) => {
    const row = r as {
      id: string;
      producto_id: string | null;
      cantidad: number;
      precio_unitario_gs: number;
      productos: { nombre: string } | null;
    };
    return {
      id: row.id,
      producto_id: row.producto_id,
      cantidad: row.cantidad,
      precio_unitario_gs: row.precio_unitario_gs,
      producto_nombre: row.productos?.nombre,
    };
  });
}

export async function setPedidoEstado(id: string, estado: PedidoEstado): Promise<void> {
  const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id);
  if (error) throw error;
}

/**
 * Registra un pago: pasa a 'pagado' (dispara stock) y deja quién lo confirmó,
 * con referencia y comprobante. Requiere admin.
 */
export async function registrarPago(
  pedidoId: string,
  input: { referencia?: string; comprobanteUrl?: string }
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');
  const { error } = await supabase
    .from('pedidos')
    .update({
      estado: 'pagado',
      referencia_pago: input.referencia?.trim() || null,
      comprobante_url: input.comprobanteUrl?.trim() || null,
      confirmado_por: user.email ?? user.id,
    })
    .eq('id', pedidoId);
  if (error) throw error;
}

export async function fetchStock(): Promise<StockRow[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, marca, stock, precio_gs, activo')
    .order('stock', { ascending: true });
  if (error) throw error;
  return (data ?? []) as StockRow[];
}

/** Ajusta el stock vía RPC (valida admin, registra movimiento 'ajuste'). */
export async function ajustarStock(productoId: string, nuevoStock: number): Promise<number> {
  const { data, error } = await supabase.rpc('ajustar_stock', {
    p_producto_id: productoId,
    p_nuevo_stock: nuevoStock,
  });
  if (error) throw error;
  return data as number;
}

/** Actualiza el precio vía RPC (requiere admin). Mantiene el stock actual. */
export async function actualizarPrecio(productoId: string, precioGs: number): Promise<void> {
  const { data: row, error: readError } = await supabase
    .from('productos')
    .select('stock')
    .eq('id', productoId)
    .single();
  if (readError) throw readError;
  const { error } = await supabase.rpc('ajustar_stock', {
    p_producto_id: productoId,
    p_nuevo_stock: (row as { stock: number }).stock,
    p_precio_gs: precioGs,
  });
  if (error) throw error;
}

/** Trae el log de acciones admin del audit_log. */
export async function fetchAuditLog(): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('realizado_en', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AuditLogEntry[];
}
