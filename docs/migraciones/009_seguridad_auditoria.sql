-- Migración 009: Hardening de seguridad + R11-R15 completos
-- Proyecto: Skin Health Shop | 100% idempotente, no depende de 008.

-- R11
alter table public.reviews add column if not exists compra_verificada boolean not null default false;

create or replace function public.usuario_compro_producto(p_user_id uuid, p_producto_id text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.pedidos pe join public.pedido_items pi on pi.pedido_id = pe.id where pe.user_id = p_user_id and pi.producto_id = p_producto_id and pe.estado in ('pagado', 'enviado', 'entregado'));
$$;
grant execute on function public.usuario_compro_producto(uuid, text) to authenticated;

create or replace function public.marcar_compra_verificada() returns trigger language plpgsql set search_path = public as $$
begin
  if new.user_id is not null then
    new.compra_verificada := public.usuario_compro_producto(new.user_id, new.producto_id);
  end if;
  return new;
end;
$$;
drop trigger if exists trg_marcar_compra_verificada on public.reviews;
create trigger trg_marcar_compra_verificada before insert or update of user_id, producto_id on public.reviews for each row execute function public.marcar_compra_verificada();
update public.reviews r set compra_verificada = public.usuario_compro_producto(r.user_id, r.producto_id) where r.user_id is not null and r.compra_verificada = false;

-- R13
create table if not exists public.reviews_utiles (review_id uuid not null references public.reviews(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, creado_en timestamptz not null default now(), primary key (review_id, user_id));
alter table public.reviews_utiles enable row level security;
drop policy if exists "Lectura publica de utiles" on public.reviews_utiles;
create policy "Lectura de utiles" on public.reviews_utiles for select to authenticated using (true);
drop policy if exists "Usuario marca util" on public.reviews_utiles;
create policy "Usuario marca util" on public.reviews_utiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Usuario desmarca util" on public.reviews_utiles;
create policy "Usuario desmarca util" on public.reviews_utiles for delete to authenticated using (auth.uid() = user_id);
alter table public.reviews add column if not exists utiles_count int not null default 0;

create or replace function public.recalcular_utiles_count() returns trigger language plpgsql set search_path = public as $$
declare v_review_id uuid := coalesce(new.review_id, old.review_id);
begin
  update public.reviews r set utiles_count = (select count(*)::int from public.reviews_utiles where review_id = v_review_id) where r.id = v_review_id;
  return coalesce(new, old);
end;
$$;
drop trigger if exists trg_utiles_count_ins on public.reviews_utiles;
create trigger trg_utiles_count_ins after insert on public.reviews_utiles for each row execute function public.recalcular_utiles_count();
drop trigger if exists trg_utiles_count_del on public.reviews_utiles;
create trigger trg_utiles_count_del after delete on public.reviews_utiles for each row execute function public.recalcular_utiles_count();

create or replace function public.toggle_util(p_review_id uuid) returns boolean language plpgsql security definer set search_path = public as $$
declare v_user_id uuid := auth.uid(); v_exists boolean;
begin
  if v_user_id is null then raise exception 'NO_AUTH'; end if;
  select exists (select 1 from public.reviews_utiles where review_id = p_review_id and user_id = v_user_id) into v_exists;
  if v_exists then delete from public.reviews_utiles where review_id = p_review_id and user_id = v_user_id; return false;
  else insert into public.reviews_utiles (review_id, user_id) values (p_review_id, v_user_id); return true; end if;
end;
$$;
grant execute on function public.toggle_util(uuid) to authenticated;

-- R14
alter table public.reviews add column if not exists respuesta_admin text check (respuesta_admin is null or char_length(respuesta_admin) between 5 and 1000);
alter table public.reviews add column if not exists respuesta_admin_creada_en timestamptz;
create or replace function public.responder_review(p_review_id uuid, p_respuesta text) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.es_admin() then raise exception 'NOT_ADMIN'; end if;
  update public.reviews set respuesta_admin = nullif(trim(p_respuesta), ''), respuesta_admin_creada_en = case when trim(coalesce(p_respuesta, '')) = '' then null else now() end where id = p_review_id;
  if not found then raise exception 'REVIEW_NOT_FOUND'; end if;
end;
$$;
grant execute on function public.responder_review(uuid, text) to authenticated;

-- R15
alter table public.reviews add column if not exists tipo_piel text check (tipo_piel is null or tipo_piel in ('grasa', 'seca', 'mixta', 'sensible', 'normal'));

-- R12
alter table public.reviews add column if not exists fotos text[] not null default '[]'::text[];

-- S-01 RLS perfiles
alter table public.perfiles enable row level security;
drop policy if exists "Usuario lee su propio perfil" on public.perfiles;
create policy "Usuario lee su propio perfil" on public.perfiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Usuario actualiza su propio perfil" on public.perfiles;
create policy "Usuario actualiza su propio perfil" on public.perfiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Admin ve todos los perfiles" on public.perfiles;
create policy "Admin ve todos los perfiles" on public.perfiles for select to authenticated using (public.es_admin());

-- S-08 Validación de contenido
create or replace function public.validar_contenido_review(p_comment text) returns text language plpgsql stable set search_path = public as $$
declare v_trimmed text; v_url_pattern text := '(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|xyz|io|app|ru|tk|biz))';
begin
  v_trimmed := trim(p_comment);
  if char_length(v_trimmed) < 5 then raise exception 'CONTENT_TOO_SHORT'; end if;
  if char_length(v_trimmed) > 600 then raise exception 'CONTENT_TOO_LONG'; end if;
  if v_trimmed ~* v_url_pattern then raise exception 'CONTENT_HAS_LINK'; end if;
  if v_trimmed ~* '\b(estafa|estafadores|mierda|basura|puta|pelotudo|fraude|hack|casino|porn|viagra|crypto|bitcoin)\b' then raise exception 'CONTENT_HAS_FORBIDDEN_WORD'; end if;
  return 'OK';
end;
$$;
grant execute on function public.validar_contenido_review(text) to authenticated;
create or replace function public.validar_comment_review() returns trigger language plpgsql set search_path = public as $$
begin perform public.validar_contenido_review(new.comment); return new; end;
$$;
drop trigger if exists trg_validar_comment_review on public.reviews;
create trigger trg_validar_comment_review before insert or update of comment on public.reviews for each row execute function public.validar_comment_review();

-- S-14 Auditoría
create table if not exists public.audit_log (id uuid primary key default gen_random_uuid(), admin_user_id uuid not null references auth.users(id) on delete set null, accion text not null check (char_length(accion) between 2 and 100), tabla_objetivo text not null check (char_length(tabla_objetivo) between 2 and 50), registro_objetivo uuid, detalle text, realizado_en timestamptz not null default now());
alter table public.audit_log enable row level security;
drop policy if exists "Admin lee el audit log" on public.audit_log;
create policy "Admin lee el audit log" on public.audit_log for select to authenticated using (public.es_admin());
create or replace function public.auditar_accion(p_accion text, p_tabla_objetivo text, p_registro_objetivo uuid, p_detalle text) returns void language plpgsql security definer set search_path = public as $$
begin insert into public.audit_log (admin_user_id, accion, tabla_objetivo, registro_objetivo, detalle) values (auth.uid(), p_accion, p_tabla_objetivo, p_registro_objetivo, p_detalle); end;
$$;
grant execute on function public.auditar_accion(text, text, uuid, text) to authenticated;

-- Grants
grant execute on function public.es_admin() to authenticated;
grant execute on function public.es_admin() to anon;

-- Índices
create index if not exists idx_reviews_producto_status on public.reviews (producto_id, status);
create index if not exists idx_reviews_utiles_count on public.reviews (utiles_count desc, creado_en desc) where status = 'approved';
create index if not exists idx_reviews_utiles_review on public.reviews_utiles (review_id);
