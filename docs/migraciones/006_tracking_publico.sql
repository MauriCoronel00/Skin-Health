-- Migración 006: tracking público de pedidos por código
-- Proyecto: Skin Health Shop
-- Solo expone datos no sensibles (sin teléfono ni dirección exacta) vía RPC
-- con SECURITY DEFINER. Aplicar DESPUÉS de 005.

create or replace function public.get_pedido_tracking(p_codigo text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_pedido record;
  v_items jsonb;
begin
  select p.id, p.codigo_pedido, p.estado, p.total_gs, p.costo_envio_gs,
         p.creado_en, p.direccion_envio
    into v_pedido
  from public.pedidos p
  where upper(trim(p_codigo)) = p.codigo_pedido
  limit 1;

  if not found then
    raise exception 'NOT_FOUND';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'nombre', coalesce(pr.nombre, it.producto_id),
      'cantidad', it.cantidad
    ) order by pr.nombre
  ), '[]'::jsonb)
  into v_items
  from public.pedido_items it
  left join public.productos pr on pr.id = it.producto_id
  where it.pedido_id = v_pedido.id;

  return jsonb_build_object(
    'codigo', v_pedido.codigo_pedido,
    'estado', v_pedido.estado,
    'total_gs', v_pedido.total_gs,
    'costo_envio_gs', coalesce(v_pedido.costo_envio_gs, 0),
    'creado_en', v_pedido.creado_en,
    -- Zona aproximada (sin dirección exacta por privacidad)
    'zona', split_part(coalesce(v_pedido.direccion_envio, ''), '—', 1),
    'items', v_items
  );
end;
$function$;

revoke all on function public.get_pedido_tracking(text) from public, anon;
grant execute on function public.get_pedido_tracking(text) to anon, authenticated;
