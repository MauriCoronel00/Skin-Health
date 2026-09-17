-- Migración 004: ajustar_stock acepta precio opcional (edición de precio en panel)
-- Proyecto: Skin Health Shop | ADR-004
-- Firma nueva (text, int, int default null). Elimina la firma anterior de la 003.
-- Uso precio: supabase.rpc('ajustar_stock', { p_producto_id, p_nuevo_stock, p_precio_gs })
-- (pasar el stock actual si solo se quiere cambiar el precio).
-- Errores: NOT_ADMIN, NEGATIVE_STOCK, INVALID_PRICE, NOT_FOUND.
drop function if exists public.ajustar_stock(text, int);

create or replace function public.ajustar_stock(p_producto_id text, p_nuevo_stock int, p_precio_gs int default null)
returns int
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_actual int;
  v_diff int;
begin
  if not public.es_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  if p_nuevo_stock < 0 then
    raise exception 'NEGATIVE_STOCK';
  end if;

  if p_precio_gs is not null and p_precio_gs <= 0 then
    raise exception 'INVALID_PRICE';
  end if;

  select stock into v_actual
  from public.productos
  where id = p_producto_id;

  if not found then
    raise exception 'NOT_FOUND: %', p_producto_id;
  end if;

  v_diff := p_nuevo_stock - v_actual;

  update public.productos
  set stock = p_nuevo_stock,
      precio_gs = coalesce(p_precio_gs, precio_gs)
  where id = p_producto_id;

  if v_diff <> 0 then
    insert into public.movimientos_stock (producto_id, cantidad, motivo)
    values (p_producto_id, v_diff, 'ajuste');
  end if;

  return p_nuevo_stock;
end;
$function$;

revoke all on function public.ajustar_stock(text, int, int) from public, anon;
grant execute on function public.ajustar_stock(text, int, int) to authenticated;
