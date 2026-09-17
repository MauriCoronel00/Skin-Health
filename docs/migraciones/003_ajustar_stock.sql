-- Migración 003: RPC ajustar_stock (edición de stock desde el panel admin)
-- Proyecto: Skin Health Shop | ADR-004
-- Actualiza stock + registra el delta en movimientos_stock (motivo='ajuste'), atómico.
-- Uso: supabase.rpc('ajustar_stock', { p_producto_id, p_nuevo_stock })
-- Errores: NOT_ADMIN, NEGATIVE_STOCK, NOT_FOUND.
create or replace function public.ajustar_stock(p_producto_id text, p_nuevo_stock int)
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

  select stock into v_actual
  from public.productos
  where id = p_producto_id;

  if not found then
    raise exception 'NOT_FOUND: %', p_producto_id;
  end if;

  v_diff := p_nuevo_stock - v_actual;

  update public.productos
  set stock = p_nuevo_stock
  where id = p_producto_id;

  if v_diff <> 0 then
    insert into public.movimientos_stock (producto_id, cantidad, motivo)
    values (p_producto_id, v_diff, 'ajuste');
  end if;

  return p_nuevo_stock;
end;
$function$;

revoke all on function public.ajustar_stock(text, int) from public, anon;
grant execute on function public.ajustar_stock(text, int) to authenticated;
