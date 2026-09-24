-- Migración 010: Corrección de warnings del Supabase Linter
-- Proyecto: Skin Health Shop | 100% idempotente.
-- Aplicada en: Supabase SQL Editor / API.

-- ============================================================
-- 1. extension_in_public: mover unaccent a schema extensions
-- ============================================================
create schema if not exists extensions;
alter extension unaccent set schema extensions;

-- ============================================================
-- 2. rls_policy_always_true: eliminar anon update foto en productos
-- Policy original permitía UPDATE sin restricción (USING(true) + WITH CHECK(true)).
-- Se eliminó completamente — anon no debería poder UPDATE productos.
-- ============================================================
drop policy if exists "anon update foto" on public.productos;

-- ============================================================
-- 3. public_bucket_allows_listing: fix review-photos y rutinas
-- Policies amplias en storage.objects fueron reemplazadas por
-- policies que filtran por bucket_id (no permiten listing global).
-- ============================================================
drop policy if exists "Anyone can view review photos 1tsy3yu_0" on storage.objects;
create policy "view review photos" on storage.objects for select to anon
  using (bucket_id = 'review-photos');

drop policy if exists "public read rutinas" on storage.objects;
create policy "view rutinas photos" on storage.objects for select to anon
  using (bucket_id = 'rutinas');

-- ============================================================
-- 4. anon_security_definer_function_executable + authenticated:
-- Cambiar SECURITY DEFINER a SECURITY INVOKER y restringir grants.
-- ============================================================

-- es_admin: revocar de anon y public (solo authenticated necesita llamarlo)
revoke execute on function public.es_admin() from anon;
revoke execute on function public.es_admin() from public;
grant execute on function public.es_admin() to authenticated;

-- auditar_accion: SECURITY INVOKER + solo authenticated
create or replace function public.auditar_accion(p_accion text, p_tabla_objetivo text, p_registro_objetivo uuid, p_detalle text)
returns void language plpgsql security invoker set search_path = public as $$
begin insert into public.audit_log (admin_user_id, accion, tabla_objetivo, registro_objetivo, detalle) values (auth.uid(), p_accion, p_tabla_objetivo, p_registro_objetivo, p_detalle); end;
$$;
revoke execute on function public.auditar_accion(text, text, uuid, text) from public;
revoke execute on function public.auditar_accion(text, text, uuid, text) from anon;
grant execute on function public.auditar_accion(text, text, uuid, text) to authenticated;

-- toggle_util: SECURITY INVOKER + solo authenticated
create or replace function public.toggle_util(p_review_id uuid)
returns boolean language plpgsql security invoker set search_path = public as $$
declare v_user_id uuid := auth.uid(); v_exists boolean;
begin
  if v_user_id is null then raise exception 'NO_AUTH'; end if;
  select exists (select 1 from public.reviews_utiles where review_id = p_review_id and user_id = v_user_id) into v_exists;
  if v_exists then delete from public.reviews_utiles where review_id = p_review_id and user_id = v_user_id; return false;
  else insert into public.reviews_utiles (review_id, user_id) values (p_review_id, v_user_id); return true; end if;
end;
$$;
revoke execute on function public.toggle_util(uuid) from public;
revoke execute on function public.toggle_util(uuid) from anon;
grant execute on function public.toggle_util(uuid) to authenticated;

-- responder_review: SECURITY INVOKER + solo authenticated
create or replace function public.responder_review(p_review_id uuid, p_respuesta text)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if not public.es_admin() then raise exception 'NOT_ADMIN'; end if;
  update public.reviews set respuesta_admin = nullif(trim(p_respuesta), ''), respuesta_admin_creada_en = case when trim(coalesce(p_respuesta, '')) = '' then null else now() end where id = p_review_id;
  if not found then raise exception 'REVIEW_NOT_FOUND'; end if;
end;
$$;
revoke execute on function public.responder_review(uuid, text) from public;
revoke execute on function public.responder_review(uuid, text) from anon;
grant execute on function public.responder_review(uuid, text) to authenticated;

-- usuario_compro_producto: SECURITY INVOKER + solo authenticated
create or replace function public.usuario_compro_producto(p_user_id uuid, p_producto_id text)
returns boolean language sql stable security invoker set search_path = public as $$
  select exists (select 1 from public.pedidos pe join public.pedido_items pi on pi.pedido_id = pe.id where pe.user_id = p_user_id and pi.producto_id = p_producto_id and pe.estado in ('pagado', 'enviado', 'entregado'));
$$;
revoke execute on function public.usuario_compro_producto(uuid, text) from public;
revoke execute on function public.usuario_compro_producto(uuid, text) from anon;
grant execute on function public.usuario_compro_producto(uuid, text) to authenticated;

-- marcar_compra_verificada: SECURITY INVOKER (trigger function) + solo authenticated
create or replace function public.marcar_compra_verificada()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.user_id is not null then
    new.compra_verificada := public.usuario_compro_producto(new.user_id, new.producto_id);
  end if;
  return new;
end;
$$;
revoke execute on function public.marcar_compra_verificada() from public;
revoke execute on function public.marcar_compra_verificada() from anon;
grant execute on function public.marcar_compra_verificada() to authenticated;

-- validar_contenido_review: SECURITY INVOKER + solo authenticated
revoke execute on function public.validar_contenido_review(text) from public;
revoke execute on function public.validar_contenido_review(text) from anon;
grant execute on function public.validar_contenido_review(text) to authenticated;

-- validar_comment_review: SECURITY INVOKER + solo authenticated
revoke execute on function public.validar_comment_review() from public;
revoke execute on function public.validar_comment_review() FROM anon;
grant execute on function public.validar_comment_review() to authenticated;

-- ============================================================
-- NOTA: auth_leaked_password_protection
-- Requiere Supabase Pro Plan. No disponible en plan gratuito.
-- Habilitar desde Supabase Dashboard > Auth > Security.
-- ============================================================
