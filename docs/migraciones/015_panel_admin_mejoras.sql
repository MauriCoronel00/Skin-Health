-- Migración 015: mejoras del panel de administración
-- Proyecto: Skin Health Shop | idempotente.
-- Aplicar en: Supabase Dashboard > SQL Editor (o `supabase db push`).
-- Resuelve: P1 (editar precio sin tocar stock), P8 (CRUD de productos),
--           P4 (índice para paginación de pedidos).

-- ============================================================================
-- 1. RPC: actualizar SOLO el precio (no toca stock, no registra movimiento).
--    Reemplaza el patrón leer-stock -> ajustar_stock, que podía pisar el stock
--    con un valor viejo si entraba una venta en el medio.
-- ============================================================================
create or replace function public.actualizar_precio_producto(p_producto_id text, p_precio_gs int)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
  if not public.es_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  if p_precio_gs is null or p_precio_gs <= 0 then
    raise exception 'INVALID_PRICE';
  end if;

  update public.productos
  set precio_gs = p_precio_gs
  where id = p_producto_id;

  if not found then
    raise exception 'NOT_FOUND: %', p_producto_id;
  end if;
end;
$function$;

revoke all on function public.actualizar_precio_producto(text, int) from public, anon;
grant execute on function public.actualizar_precio_producto(text, int) to authenticated;

-- ============================================================================
-- 2. RLS admin sobre productos: permite crear / editar / desactivar desde el
--    panel. La policy de lectura pública de activos sigue existiendo (las
--    policies permisivas se suman por OR).
-- ============================================================================
alter table public.productos enable row level security;

drop policy if exists "Admin gestiona productos" on public.productos;
create policy "Admin gestiona productos"
  on public.productos for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ============================================================================
-- 3. Índice para paginar pedidos por estado + fecha (P4).
-- ============================================================================
create index if not exists idx_pedidos_estado_creado
  on public.pedidos (estado, creado_en desc);

-- ============================================================================
-- 4. Beneficios: el storefront lee los beneficios ES de esta tabla relacionada
--    (no de la columna `producto_beneficios_es`), así que el panel debe poder
--    escribirla al crear/editar productos. Lectura pública + escritura admin.
-- ============================================================================
alter table public.producto_beneficios enable row level security;

drop policy if exists "Lectura publica de beneficios" on public.producto_beneficios;
create policy "Lectura publica de beneficios"
  on public.producto_beneficios for select to anon, authenticated
  using (true);

drop policy if exists "Admin gestiona beneficios" on public.producto_beneficios;
create policy "Admin gestiona beneficios"
  on public.producto_beneficios for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());
