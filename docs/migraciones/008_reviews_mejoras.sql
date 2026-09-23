-- Migración 008: Mejoras al sistema de reseñas
-- Proyecto: Skin Health Shop
-- Objetivo: R11 (compra verificada), R13 (helpful persistente),
--           R14 (respuesta admin), R15 (tipo de piel), R12 (fotos).
--
-- Aplicar DESPUÉS de 007. Idempotente.

-- ============================================================================
-- R11 · Verificación de compra automática
-- ============================================================================

alter table public.reviews
  add column if not exists compra_verificada boolean not null default false;

-- Helper: chequea si un usuario tiene un pedido pagado/enviado/entregado
-- con un producto específico
create or replace function public.usuario_compro_producto(
  p_user_id uuid,
  p_producto_id text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pedidos pe
    join public.pedido_items pi on pi.pedido_id = pe.id
    where pe.user_id = p_user_id
      and pi.producto_id = p_producto_id
      and pe.estado in ('pagado', 'enviado', 'entregado')
  );
$$;

grant execute on function public.usuario_compro_producto(uuid, text) to authenticated;

-- Trigger: al insertar/actualizar una review, marcar automáticamente
-- compra_verificada si el user_id tiene un pedido correspondiente
create or replace function public.marcar_compra_verificada()
returns trigger
language plpgsql
set search_path = public
as $function$
begin
  if new.user_id is not null then
    new.compra_verificada := public.usuario_compro_producto(new.user_id, new.producto_id);
  end if;
  return new;
end;
$function$;

drop trigger if exists trg_marcar_compra_verificada on public.reviews;
create trigger trg_marcar_compra_verificada
  before insert or update of user_id, producto_id on public.reviews
  for each row execute function public.marcar_compra_verificada();

-- Backfill: marcar reviews existentes
update public.reviews r
set compra_verificada = public.usuario_compro_producto(r.user_id, r.producto_id)
where r.user_id is not null and r.compra_verificada = false;

-- ============================================================================
-- R13 · Helpful votes persistentes
-- ============================================================================

create table if not exists public.reviews_utiles (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  creado_en timestamptz not null default now(),
  primary key (review_id, user_id)
);

alter table public.reviews_utiles enable row level security;

drop policy if exists "Lectura publica de utiles" on public.reviews_utiles;
create policy "Lectura publica de utiles"
  on public.reviews_utiles for select to anon, authenticated
  using (true);

drop policy if exists "Usuario marca util" on public.reviews_utiles;
create policy "Usuario marca util"
  on public.reviews_utiles for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Usuario desmarca util" on public.reviews_utiles;
create policy "Usuario desmarca util"
  on public.reviews_utiles for delete to authenticated
  using (auth.uid() = user_id);

-- Columna denormalizada para orden rápido
alter table public.reviews
  add column if not exists utiles_count int not null default 0;

-- Trigger: mantiene utiles_count sincronizado
create or replace function public.recalcular_utiles_count()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  v_review_id uuid := coalesce(new.review_id, old.review_id);
begin
  update public.reviews r
  set utiles_count = (
    select count(*)::int from public.reviews_utiles where review_id = v_review_id
  )
  where r.id = v_review_id;
  return coalesce(new, old);
end;
$function$;

drop trigger if exists trg_utiles_count_ins on public.reviews_utiles;
create trigger trg_utiles_count_ins
  after insert on public.reviews_utiles
  for each row execute function public.recalcular_utiles_count();

drop trigger if exists trg_utiles_count_del on public.reviews_utiles;
create trigger trg_utiles_count_del
  after delete on public.reviews_utiles
  for each row execute function public.recalcular_utiles_count();

-- RPC toggle: marca o desmarca útil según estado actual
create or replace function public.toggle_util(p_review_id uuid)
returns boolean -- true = ahora está marcada, false = se desmarcó
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid := auth.uid();
  v_exists boolean;
begin
  if v_user_id is null then
    raise exception 'NO_AUTH';
  end if;

  select exists (
    select 1 from public.reviews_utiles
    where review_id = p_review_id and user_id = v_user_id
  ) into v_exists;

  if v_exists then
    delete from public.reviews_utiles
    where review_id = p_review_id and user_id = v_user_id;
    return false;
  else
    insert into public.reviews_utiles (review_id, user_id)
    values (p_review_id, v_user_id);
    return true;
  end if;
end;
$function$;

grant execute on function public.toggle_util(uuid) to authenticated;

-- ============================================================================
-- R14 · Respuesta del vendedor (admin)
-- ============================================================================

alter table public.reviews
  add column if not exists respuesta_admin text
    check (respuesta_admin is null or char_length(respuesta_admin) between 5 and 1000);

alter table public.reviews
  add column if not exists respuesta_admin_creada_en timestamptz;

-- RPC: solo admin puede responder / editar respuesta
create or replace function public.responder_review(
  p_review_id uuid,
  p_respuesta text
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
  if not public.es_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  update public.reviews
  set respuesta_admin = nullif(trim(p_respuesta), ''),
      respuesta_admin_creada_en = case
        when trim(coalesce(p_respuesta, '')) = '' then null
        else now()
      end
  where id = p_review_id;

  if not found then
    raise exception 'REVIEW_NOT_FOUND';
  end if;
end;
$function$;

grant execute on function public.responder_review(uuid, text) to authenticated;

-- ============================================================================
-- R15 · Tipo de piel del reviewer
-- ============================================================================

alter table public.reviews
  add column if not exists tipo_piel text
    check (tipo_piel is null or tipo_piel in ('grasa', 'seca', 'mixta', 'sensible', 'normal'));

-- ============================================================================
-- R12 · Fotos en reseñas (URLs; el bucket se crea desde el Dashboard)
-- ============================================================================

alter table public.reviews
  add column if not exists fotos text[] not null default '{}';

-- IMPORTANTE: crear el bucket 'review-photos' desde Supabase Dashboard
-- (Storage > New bucket, public, con policies de INSERT/DELETE para authenticated)
-- Ver docs/migraciones/README-storage.md para pasos exactos.

-- ============================================================================
-- Índices para performance
-- ============================================================================

create index if not exists idx_reviews_producto_status
  on public.reviews (producto_id, status);

create index if not exists idx_reviews_utiles_count
  on public.reviews (utiles_count desc, creado_en desc)
  where status = 'approved';

create index if not exists idx_reviews_utiles_review
  on public.reviews_utiles (review_id);
