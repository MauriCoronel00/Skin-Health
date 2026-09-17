-- Migración 002: RPC crear_pedido (total + stock validados server-side)
-- Proyecto: Skin Health Shop | ADR-002, ADR-003
-- Aplicar DESPUÉS de 001. Probar primero con un pedido de prueba y cancelarlo.
--
-- Uso desde el frontend (supabase-js):
--   const { data, error } = await supabase.rpc('crear_pedido', {
--     p_cliente_nombre: '...', p_cliente_telefono: '...',
--     p_direccion_envio: '...',
--     p_items: [{ producto_id: '...', cantidad: 1 }]
--   });
-- Retorna el uuid del pedido. Códigos de error: NO_AUTH, EMPTY_ORDER,
-- MISSING_CUSTOMER_DATA, INVALID_QTY, UNAVAILABLE, NO_STOCK.

-- codigo_pedido único (el formato pasa a SKIN-XXXXXXXX generado en servidor)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'pedidos_codigo_pedido_unique'
  ) then
    alter table public.pedidos
      add constraint pedidos_codigo_pedido_unique unique (codigo_pedido);
  end if;
end $$;

create or replace function public.crear_pedido(
  p_cliente_nombre text,
  p_cliente_telefono text,
  p_direccion_envio text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid := auth.uid();
  v_pedido_id uuid;
  v_codigo text;
  v_total int := 0;
  v_item jsonb;
  v_pid text;
  v_cant int;
  v_precio int;
  v_stock int;
begin
  if v_user_id is null then
    raise exception 'NO_AUTH';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_ORDER';
  end if;

  if coalesce(nullif(trim(p_cliente_nombre), ''), null) is null
     or coalesce(nullif(trim(p_cliente_telefono), ''), null) is null then
    raise exception 'MISSING_CUSTOMER_DATA';
  end if;

  -- 1. Validar contra la DB y recalcular el total (se ignora el total del cliente)
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_pid := v_item ->> 'producto_id';
    v_cant := coalesce((v_item ->> 'cantidad')::int, 0);

    if v_cant < 1 then
      raise exception 'INVALID_QTY: %', v_pid;
    end if;

    select p.precio_gs, p.stock into v_precio, v_stock
    from public.productos p
    where p.id = v_pid and p.activo = true;

    if not found then
      raise exception 'UNAVAILABLE: %', v_pid;
    end if;

    if v_stock < v_cant then
      raise exception 'NO_STOCK: %', v_pid;
    end if;

    v_total := v_total + v_precio * v_cant;
  end loop;

  -- 2. Código server-side único
  v_codigo := 'SKIN-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));

  -- 3. Insert atómico pedido + ítems (con precio real de la DB)
  insert into public.pedidos
    (user_id, cliente_nombre, cliente_telefono, total_gs, estado, direccion_envio, codigo_pedido)
  values
    (v_user_id, trim(p_cliente_nombre), trim(p_cliente_telefono),
     v_total, 'pendiente', nullif(trim(p_direccion_envio), ''), v_codigo)
  returning id into v_pedido_id;

  insert into public.pedido_items (pedido_id, producto_id, cantidad, precio_unitario_gs)
  select v_pedido_id, x.pid, x.cant, p.precio_gs
  from (
    select (e.value ->> 'producto_id') as pid,
           (e.value ->> 'cantidad')::int as cant
    from jsonb_array_elements(p_items) e
  ) x
  join public.productos p on p.id = x.pid;

  return v_pedido_id;
end;
$function$;

-- Solo usuarios autenticados (el checkout exige login Google)
revoke all on function public.crear_pedido(text, text, text, jsonb) from public, anon;
grant execute on function public.crear_pedido(text, text, text, jsonb) to authenticated;
