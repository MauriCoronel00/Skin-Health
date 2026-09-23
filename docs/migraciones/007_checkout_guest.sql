-- Migración 007: Checkout guest (sin login obligatorio)
-- Proyecto: Skin Health Shop
-- Objetivo: permitir crear pedidos sin sesión Google, usando teléfono como
-- identidad. Reduce fricción de checkout (P1 del roadmap).
--
-- Cambios:
--   1. crear_pedido acepta user_id NULL (usuarios anónimos)
--   2. Requiere teléfono válido (mínimo 8 dígitos) como identidad alternativa
--   3. Grant execute a anon (además de authenticated)
--   4. RLS de pedidos NO cambia: anon sigue sin poder SELECT directo.
--      Los pedidos guest se consultan solo por la RPC pública get_pedido_tracking
--      (código único) que ya existe (migración 006).
--
-- Aplicar DESPUÉS de 006. Idempotente: se puede correr múltiples veces.
--
-- Verificar tras aplicar:
--   1. En SQL Editor: SELECT public.crear_pedido(...) sin sesión debe funcionar
--      si se envía teléfono válido.
--   2. Un cliente con sesión Google debe seguir viendo user_id en su pedido.
--   3. Anon NO debe poder hacer SELECT * FROM pedidos (RLS lo bloquea).

-- Reemplazar la firma existente (5 args)
drop function if exists public.crear_pedido(text, text, text, jsonb, int);

create or replace function public.crear_pedido(
  p_cliente_nombre text,
  p_cliente_telefono text,
  p_direccion_envio text,
  p_items jsonb,
  p_costo_envio_gs int default 0
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid := auth.uid(); -- NULL si es guest
  v_pedido_id uuid;
  v_codigo text;
  v_total int := 0;
  v_envio int := coalesce(p_costo_envio_gs, 0);
  v_item jsonb;
  v_pid text;
  v_cant int;
  v_precio int;
  v_stock int;
  v_tel text;
begin
  -- Validación de items
  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_ORDER';
  end if;

  -- Validación de datos del cliente (guest o autenticado, siempre requeridos)
  if coalesce(nullif(trim(p_cliente_nombre), ''), null) is null
     or coalesce(nullif(trim(p_cliente_telefono), ''), null) is null then
    raise exception 'MISSING_CUSTOMER_DATA';
  end if;

  -- Guest: exigir teléfono válido como identidad alternativa (mínimo 8 dígitos)
  v_tel := regexp_replace(trim(p_cliente_telefono), '[^0-9]', '', 'g');
  if v_user_id is null and length(v_tel) < 8 then
    raise exception 'INVALID_PHONE';
  end if;

  if v_envio < 0 or v_envio > 200000 then
    raise exception 'INVALID_SHIPPING';
  end if;

  -- 1. Validar contra la DB y recalcular el total (server-side)
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

  -- 3. Insert atómico pedido + ítems
  --    user_id puede ser NULL para pedidos guest
  insert into public.pedidos
    (user_id, cliente_nombre, cliente_telefono, total_gs, costo_envio_gs,
     estado, direccion_envio, codigo_pedido)
  values
    (v_user_id, trim(p_cliente_nombre), trim(p_cliente_telefono),
     v_total, v_envio, 'pendiente', nullif(trim(p_direccion_envio), ''), v_codigo)
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

-- Grants: ahora también anon puede ejecutar la RPC
revoke all on function public.crear_pedido(text, text, text, jsonb, int) from public;
grant execute on function public.crear_pedido(text, text, text, jsonb, int) to anon, authenticated;
