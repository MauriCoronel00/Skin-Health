-- Migración: Tabla de carritos persistentes (server-side cart)
-- Permite persistencia cross-device para usuarios anónimos y autenticados

-- 1. Tabla principal de carritos
create table if not exists public.carritos (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,           -- ID único del dispositivo (anon)
  user_id uuid references auth.users(id) on delete set null,  -- null = anónimo
  items jsonb not null default '[]'::jsonb,  -- [{product_id, quantity, price_gs, added_at}]
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Índice para lookup rápido por device_id (anon) o user_id (auth)
create index if not exists idx_carritos_device_id on public.carritos(device_id);
create index if not exists idx_carritos_user_id on public.carritos(user_id);

-- 2. RLS: Cada usuario/dispositivo solo ve su carrito
alter table public.carritos enable row level security;

-- Política para usuarios anónimos (por device_id)
drop policy if exists "anon_select_own_cart" on public.carritos;
create policy "anon_select_own_cart" on public.carritos
  for select using (user_id is null and device_id = current_setting('app.current_device_id', true));

drop policy if exists "anon_insert_own_cart" on public.carritos;
create policy "anon_insert_own_cart" on public.carritos
  for insert with check (user_id is null and device_id = current_setting('app.current_device_id', true));

drop policy if exists "anon_update_own_cart" on public.carritos;
create policy "anon_update_own_cart" on public.carritos
  for update using (user_id is null and device_id = current_setting('app.current_device_id', true));

drop policy if exists "anon_delete_own_cart" on public.carritos;
create policy "anon_delete_own_cart" on public.carritos
  for delete using (user_id is null and device_id = current_setting('app.current_device_id', true));

-- Política para usuarios autenticados (por user_id)
drop policy if exists "auth_select_own_cart" on public.carritos;
create policy "auth_select_own_cart" on public.carritos
  for select using (auth.uid() = user_id);

drop policy if exists "auth_insert_own_cart" on public.carritos;
create policy "auth_insert_own_cart" on public.carritos
  for insert with check (auth.uid() = user_id);

drop policy if exists "auth_update_own_cart" on public.carritos;
create policy "auth_update_own_cart" on public.carritos
  for update using (auth.uid() = user_id);

drop policy if exists "auth_delete_own_cart" on public.carritos;
create policy "auth_delete_own_cart" on public.carritos
  for delete using (auth.uid() = user_id);

-- 3. Función helper para upsert de carrito (server-side)
create or replace function public.upsert_cart(
  p_device_id text,
  p_user_id uuid default null,
  p_items jsonb default '[]'::jsonb
) returns public.carritos language plpgsql security definer as $$
declare
  v_cart public.carritos;
begin
  -- Intentar actualizar existente
  update public.carritos
  set items = p_items, updated_at = now()
  where (p_user_id is not null and user_id = p_user_id)
     or (p_user_id is null and user_id is null and device_id = p_device_id)
  returning * into v_cart;

  -- Si no existe, crear nuevo
  if v_cart is null then
    insert into public.carritos (device_id, user_id, items)
    values (p_device_id, p_user_id, p_items)
    returning * into v_cart;
  end if;

  return v_cart;
end;
$$;

-- 4. Función para obtener carrito (server-side)
-- (elimina sobrecarga vieja p_user_id text que causaba PGRST203 300 Multiple Choices)
drop function if exists public.get_cart(text, text);
create or replace function public.get_cart(
  p_device_id text,
  p_user_id uuid default null
) returns public.carritos language plpgsql security definer as $$
declare
  v_cart public.carritos;
begin
  select * into v_cart
  from public.carritos
  where (p_user_id is not null and user_id = p_user_id)
     or (p_user_id is null and user_id is null and device_id = p_device_id)
  limit 1;

  return v_cart;
end;
$$;

-- 5. Función para limpiar carrito
create or replace function public.clear_cart(
  p_device_id text,
  p_user_id uuid default null
) returns void language plpgsql security definer as $$
begin
  delete from public.carritos
  where (p_user_id is not null and user_id = p_user_id)
     or (p_user_id is null and user_id is null and device_id = p_device_id);
end;
$$;

-- 6. Trigger para actualizar updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_carritos_updated_at on public.carritos;
create trigger trigger_carritos_updated_at
  before update on public.carritos
  for each row execute function public.set_updated_at();

-- 7. Permisos: PostgREST solo expone funciones con EXECUTE para anon/authenticated.
-- Sin estos grants, los RPC devuelven 404 PGRST202 aunque la función exista.
grant execute on function public.upsert_cart(text, uuid, jsonb) to anon, authenticated;
grant execute on function public.get_cart(text, uuid) to anon, authenticated;
grant execute on function public.clear_cart(text, uuid) to anon, authenticated;