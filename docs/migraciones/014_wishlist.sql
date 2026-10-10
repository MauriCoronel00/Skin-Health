-- Migración: Tabla de wishlist (productos guardados para después)
-- Permite a usuarios guardar productos en una lista personalizada
-- Ideal para "guardar para comparar" o "deseos"

-- 1. Tabla principal de wishlist
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,  -- null para invitados, linked a user si está logueado
  device_id text,                                          -- fallback para usuarios anónimos
  product_id uuid not null references public.productos(id) on delete cascade,
  created_at timestamptz not null default now(),
  UNIQUE(product_id, user_id, device_id)  -- evita duplicados
);

-- Índices para lookup rápido
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);
create index if not exists idx_wishlist_device_id on public.wishlist(device_id);
create index if not exists idx_wishlist_product_id on public.wishlist(product_id);

-- 2. RLS: Cada usuario/dispositivo solo ve sus propios wishlist items
alter table public.wishlist enable row level security;

-- Políticas para usuarios anónimos (por device_id)
create policy "anon_select_own_wishlist" on public.wishlist
  for select using (user_id is null and device_id = current_setting('app.current_device_id', true));

create policy "anon_insert_own_wishlist" on public.wishlist
  for insert with check (user_id is null and device_id = current_setting('app.current_device_id', true));

create policy "anon_delete_own_wishlist" on public.wishlist
  for delete using (user_id is null and device_id = current_setting('app.current_device_id', true));

-- Políticas para usuarios autenticados (por user_id)
create policy "auth_select_own_wishlist" on public.wishlist
  for select using (auth.uid() = user_id);

create policy "auth_insert_own_wishlist" on public.wishlist
  for insert with check (auth.uid() = user_id);

create policy "auth_delete_own_wishlist" on public.wishlist
  for delete using (auth.uid() = user_id);

-- 3. Función helper para upsert en wishlist
create or replace function public.upsert_wishlist(
  p_device_id text,
  p_user_id uuid default null,
  p_product_id uuid
) returns public.wishlist language plpgsql security definer as $$
declare
  v_wishlist public.wishlist;
begin
  -- Intentar insertar (si ya existe, la UNIQUE constraint fallará suavemente)
  insert into public.wishlist (device_id, user_id, product_id)
  values (p_device_id, p_user_id, p_product_id)
  returning * into v_wishlist;

  -- Si ya existe (conflicto de UNIQUE), solo actualizamos el created_at
  if v_wishlist is null then
    -- El item ya existe, solo lo seleccionamos
    select * into v_wishlist
    from public.wishlist
    where (p_user_id is not null and user_id = p_user_id)
       or (p_user_id is null and user_id is null and device_id = p_device_id)
       and product_id = p_product_id
    limit 1;
  end if;

  return v_wishlist;
end;
$$;

-- 4. Función para obtener wishlist de un usuario/dispositivo
create or replace function public.get_wishlist(
  p_device_id text,
  p_user_id uuid default null
) returns jsonb language plpgsql security definer as $$
begin
  return (
    select jsonb_agg(row_to_json(w))
    from public.wishlist w
    where (p_user_id is not null and w.user_id = p_user_id)
       or (p_user_id is null and w.user_id is null and w.device_id = p_device_id)
  );
end;
$$;