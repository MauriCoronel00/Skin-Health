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

/** Producto completo para edición en el panel (columnas base + beneficios ES). */
export interface ProductoAdmin {
  id: string;
  nombre: string;
  marca: string;
  subtitle: string;
  categoria_id: string;
  categoria_label: string;
  precio_gs: number;
  stock: number;
  volumen: string;
  badge: string;
  descripcion: string;
  key_ingredients: string;
  skin_type: string;
  how_to_use: string;
  imagen_url: string;
  activo: boolean;
  beneficios: { titulo: string; descripcion: string; orden: number }[];
}

export interface FetchPedidosOptions {
  estado?: PedidoEstado;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface FetchPedidosResult {
  rows: AdminPedido[];
  hasMore: boolean;
}

const PEDIDO_COLS =
  'id, codigo_pedido, cliente_nombre, cliente_telefono, total_gs, costo_envio_gs, estado, creado_en, direccion_envio, metodo_pago, referencia_pago, comprobante_url, confirmado_por';

const PRODUCTO_COLS =
  'id, nombre, marca, subtitle, categoria_id, categoria_label, precio_gs, stock, volumen, badge, descripcion, key_ingredients, skin_type, how_to_use, imagen_url, activo, producto_beneficios ( titulo, descripcion, orden )';

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

/**
 * Pedidos paginados (server-side), filtrables por estado y texto.
 * Trae `limit + 1` filas para saber si hay más sin un COUNT extra.
 */
export async function fetchPedidos(opts: FetchPedidosOptions = {}): Promise<FetchPedidosResult> {
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  let query = supabase.from('pedidos').select(PEDIDO_COLS).order('creado_en', { ascending: false });

  if (opts.estado) query = query.eq('estado', opts.estado);

  const term = (opts.search ?? '').trim().replace(/[%(),*]/g, '');
  if (term) {
    query = query.or(
      `cliente_nombre.ilike.%${term}%,cliente_telefono.ilike.%${term}%,codigo_pedido.ilike.%${term}%`
    );
  }

  const { data, error } = await query.range(offset, offset + limit);
  if (error) throw error;

  const rows = (data ?? []) as AdminPedido[];
  return { rows: rows.slice(0, limit), hasMore: rows.length > limit };
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

/**
 * Cambia el estado de un pedido. Verifica que la fila se haya modificado:
 * si la RLS lo bloquea o el pedido no existe, lanza en vez de reportar éxito falso.
 */
export async function setPedidoEstado(id: string, estado: PedidoEstado): Promise<void> {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NOT_APPLIED');
}

/**
 * Registra un pago: pasa a 'pagado' (dispara stock) y deja quién lo confirmó,
 * con referencia y comprobante. Requiere admin (RLS lo enforce).
 */
export async function registrarPago(
  pedidoId: string,
  input: { referencia?: string; comprobanteUrl?: string }
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');
  const { data, error } = await supabase
    .from('pedidos')
    .update({
      estado: 'pagado',
      referencia_pago: input.referencia?.trim() || null,
      comprobante_url: input.comprobanteUrl?.trim() || null,
      confirmado_por: user.email ?? user.id,
    })
    .eq('id', pedidoId)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NOT_APPLIED');
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

/**
 * Actualiza SOLO el precio vía RPC (requiere admin). No toca el stock, así que
 * no puede pisarlo con un valor viejo (ver migración 015).
 */
export async function actualizarPrecio(productoId: string, precioGs: number): Promise<void> {
  const { error } = await supabase.rpc('actualizar_precio_producto', {
    p_producto_id: productoId,
    p_precio_gs: precioGs,
  });
  if (error) throw error;
}

function mapProductoAdmin(row: Record<string, unknown>): ProductoAdmin {
  // El storefront lee los beneficios ES de la tabla relacionada
  // `producto_beneficios` (no de la columna `_es`), así que esa es la fuente.
  const beneficios = Array.isArray(row.producto_beneficios)
    ? (row.producto_beneficios as { titulo?: string; descripcion?: string; orden?: number }[])
    : [];
  return {
    id: String(row.id ?? ''),
    nombre: String(row.nombre ?? ''),
    marca: String(row.marca ?? ''),
    subtitle: String(row.subtitle ?? ''),
    categoria_id: String(row.categoria_id ?? ''),
    categoria_label: String(row.categoria_label ?? ''),
    precio_gs: Number(row.precio_gs ?? 0),
    stock: Number(row.stock ?? 0),
    volumen: String(row.volumen ?? ''),
    badge: String(row.badge ?? ''),
    descripcion: String(row.descripcion ?? ''),
    key_ingredients: String(row.key_ingredients ?? ''),
    skin_type: String(row.skin_type ?? ''),
    how_to_use: String(row.how_to_use ?? ''),
    imagen_url: String(row.imagen_url ?? ''),
    activo: row.activo !== false,
    beneficios: beneficios
      .map((b, i) => ({
        titulo: String(b.titulo ?? ''),
        descripcion: String(b.descripcion ?? ''),
        orden: Number(b.orden ?? i),
      }))
      .sort((a, b) => a.orden - b.orden),
  };
}

/** Lee un producto completo para editarlo en el panel. */
export async function fetchProductoAdmin(id: string): Promise<ProductoAdmin> {
  const { data, error } = await supabase.from('productos').select(PRODUCTO_COLS).eq('id', id).single();
  if (error) throw error;
  return mapProductoAdmin(data as Record<string, unknown>);
}

/** Columnas de escritura (base + traducciones ES espejadas para evitar NOT NULL). */
function toProductoRow(input: ProductoAdmin): Record<string, unknown> {
  const nombre = input.nombre.trim();
  const subtitle = input.subtitle.trim();
  const descripcion = input.descripcion.trim();
  const keyIngredients = input.key_ingredients.trim();
  const skinType = input.skin_type.trim();
  const howToUse = input.how_to_use.trim();
  return {
    nombre,
    marca: input.marca.trim(),
    subtitle,
    categoria_id: input.categoria_id,
    categoria_label: input.categoria_label.trim(),
    precio_gs: input.precio_gs,
    stock: input.stock,
    volumen: input.volumen.trim(),
    badge: input.badge.trim(),
    descripcion,
    key_ingredients: keyIngredients,
    skin_type: skinType,
    how_to_use: howToUse,
    imagen_url: input.imagen_url.trim(),
    activo: input.activo,
    producto_beneficios_es: input.beneficios.filter((b) => b.titulo.trim() || b.descripcion.trim()),
    nombre_es: nombre,
    subtitle_es: subtitle,
    descripcion_es: descripcion,
    key_ingredients_es: keyIngredients,
    skin_type_es: skinType,
    how_to_use_es: howToUse,
  };
}

/**
 * Reemplaza los beneficios (tabla `producto_beneficios`) de un producto.
 * El storefront lee de aquí los beneficios en español, por eso no basta con la
 * columna `producto_beneficios_es`.
 */
async function replaceBeneficios(productoId: string, beneficios: ProductoAdmin['beneficios']): Promise<void> {
  const rows = beneficios
    .filter((b) => b.titulo.trim() || b.descripcion.trim())
    .map((b, i) => ({
      producto_id: productoId,
      titulo: b.titulo.trim(),
      descripcion: b.descripcion.trim(),
      orden: b.orden ?? i,
    }));

  const del = await supabase.from('producto_beneficios').delete().eq('producto_id', productoId);
  if (del.error) throw del.error;
  if (rows.length === 0) return;

  const ins = await supabase.from('producto_beneficios').insert(rows);
  if (ins.error) throw ins.error;
}

/** Crea un producto (requiere admin — RLS de la migración 015). */
export async function createProducto(input: ProductoAdmin): Promise<void> {
  const id = input.id.trim();
  const { error } = await supabase
    .from('productos')
    .insert({ id, ...toProductoRow(input) });
  if (error) throw error;
  await replaceBeneficios(id, input.beneficios);
}

/** Edita un producto existente (requiere admin). */
export async function updateProducto(id: string, input: ProductoAdmin): Promise<void> {
  const { data, error } = await supabase
    .from('productos')
    .update(toProductoRow(input))
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NOT_APPLIED');
  await replaceBeneficios(id, input.beneficios);
}

/** Activa / desactiva un producto (soft delete). */
export async function setProductoActivo(id: string, activo: boolean): Promise<void> {
  const { data, error } = await supabase
    .from('productos')
    .update({ activo })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('NOT_APPLIED');
}

/** Trae el log de acciones admin del audit_log (paginado por límite). */
export async function fetchAuditLog(limit = 200): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('realizado_en', { ascending: false })
    .range(0, limit - 1);
  if (error) throw error;
  return (data ?? []) as AuditLogEntry[];
}
