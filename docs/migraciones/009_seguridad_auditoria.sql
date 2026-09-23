-- Migración 009: Hardening de seguridad y auditoría
-- Proyecto: Skin Health Shop
-- Objetivo: cerrar hallazgos S-01, S-05, S-08 del análisis de seguridad.
-- Aplicar DESPUÉS de 008. Idempotente.

-- ============================================================================
-- S-01 · RLS en perfiles + policies
-- ============================================================================

alter table public.perfiles enable row level security;

-- Usuario puede leer su propio perfil (usado por identity.ts y pedidos.ts)
drop policy if exists "Usuario lee su propio perfil" on public.perfiles;
create policy "Usuario lee su propio perfil"
  on public.perfiles for select to authenticated
  using (auth.uid() = id);

-- Usuario puede actualizar su propio perfil (telefono desde pedidos.ts)
drop policy if exists "Usuario actualiza su propio perfil" on public.perfiles;
create policy "Usuario actualiza su propio perfil"
  on public.perfiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Solo admin puede ver todos los perfiles (usado por isCurrentUserAdmin vía es_admin())
drop policy if exists "Admin ve todos los perfiles" on public.perfiles;
create policy "Admin ve todos los perfiles"
  on public.perfiles for select to authenticated
  using (public.es_admin());

-- Insertar perfil es manejado por el trigger crear_perfil_nuevo_usuario (función SECURITY DEFINER)
-- No se necesita policy de insert para anon/authenticated si el trigger hace el insert.
-- Si se necesita insert directo, descomentar:
-- drop policy if exists "Auto-insert perfil en signup" on public.perfiles;
-- create policy "Auto-insert perfil en signup"
--   on public.perfiles for insert to anon, authenticated
--   with check (auth.uid() = id);

-- ============================================================================
-- S-05 · Fix policy reviews_utiles: eliminar anon del SELECT
-- ============================================================================

drop policy if exists "Lectura publica de utiles" on public.reviews_utiles;
create policy "Lectura de utiles"
  on public.reviews_utiles for select to authenticated
  using (true);

-- ============================================================================
-- S-08 · Validación de contenido en el servidor (backend del filtro frontend)
-- ============================================================================

-- Función que valida contenido de reseñas en el servidor
create or replace function public.validar_contenido_review(
  p_comment text
)
returns text
language plpgsql
stable
set search_path = public
as $function$
declare
  v_trimmed text;
  v_url_pattern text := '(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|xyz|io|app|ru|tk|biz))';
begin
  v_trimmed := trim(p_comment);

  if char_length(v_trimmed) < 5 then
    raise exception 'CONTENT_TOO_SHORT';
  end if;
  if char_length(v_trimmed) > 600 then
    raise exception 'CONTENT_TOO_LONG';
  end if;

  -- Detectar links
  if v_trimmed ~* v_url_pattern then
    raise exception 'CONTENT_HAS_LINK';
  end if;

  -- Detectar palabras prohibidas
  if v_trimmed ~* '\b(estafa|estafadores|mierda|basura|puta|pelotudo|fraude|hack|casino|porn|viagra|crypto|bitcoin)\b' then
    raise exception 'CONTENT_HAS_FORBIDDEN_WORD';
  end if;

  return 'OK';
end;
$function$;

grant execute on function public.validar_contenido_review(text) to authenticated;

-- Trigger: validar antes de insertar o actualizar el comment de una review
create or replace function public.validar_comment_review()
returns trigger
language plpgsql
set search_path = public
as $function$
begin
  perform public.validar_contenido_review(new.comment);
  return new;
end;
$function$;

drop trigger if exists trg_validar_comment_review on public.reviews;
create trigger trg_validar_comment_review
  before insert or update of comment on public.reviews
  for each row execute function public.validar_comment_review();

-- ============================================================================
-- Auditoría: tabla de log de cambios admin
-- ============================================================================

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete set null,
  accion text not null check (char_length(accion) between 2 and 100),
  tabla_objetivo text not null check (char_length(tabla_objetivo) between 2 and 50),
  registro_objetivo uuid,
  detalle text,
  realizado_en timestamptz not null default now()
);

alter table public.audit_log enable row level security;

drop policy if exists "Admin lee el audit log" on public.audit_log;
create policy "Admin lee el audit log"
  on public.audit_log for select to authenticated
  using (public.es_admin());

-- Trigger helper para logging (se usa desde las funciones admin existentes)
create or replace function public.auditar_accion(
  p_accion text,
  p_tabla_objetivo text,
  p_registro_objetivo uuid,
  p_detalle text
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
  insert into public.audit_log (admin_user_id, accion, tabla_objetivo, registro_objetivo, detalle)
  values (auth.uid(), p_accion, p_tabla_objetivo, p_registro_objetivo, p_detalle);
end;
$function$;

grant execute on function public.auditar_accion(text, text, uuid, text) to authenticated;

-- ============================================================================
-- Fix de es_admin() para que sea invocable desde RPC (cliente y anon)
-- ============================================================================

grant execute on function public.es_admin() to authenticated;
grant execute on function public.es_admin() to anon;

-- ============================================================================
-- Notas
-- ============================================================================
-- La función crear_perfil_nuevo_usuario (trigger de auth.users) debe tener
-- permisos de insert en perfiles sin RLS bloqueándola. Si RLS bloquea el
-- insert del trigger, ejecutar:
--   alter table public.perfiles force row level security;
--   create policy "Trigger crear perfil" on public.perfiles for insert
--     to authenticated with check (true);
-- y luego restringir en el trigger:
--   where auth.uid() = new.id
--
-- El trigger de validación de contenido (S-08) aplica a todas las reviews
-- nuevas o editadas. Los seed/demo reviews con user_id NULL no pasan por
-- este trigger si se insertan directamente por SQL (sino por el trigger).
-- Si el seed genera errores, los seed comments ya están moderados.
