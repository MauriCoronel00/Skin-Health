-- Migración 011: RLS SELECT para anon en skincare_routines
-- Proyecto: Skin Health Shop | 100% idempotente.
-- Aplicada en: Supabase SQL Editor / API.

-- Habilitar RLS en la tabla (si no está habilitado)
alter table public.skincare_routines enable row level security;

-- Policy: anon puede leer todas las rutinas (públicas)
drop policy if exists "anon select rutinas" on public.skincare_routines;
create policy "anon select rutinas" on public.skincare_routines
  for select to anon
  using (true);

-- Policy: authenticated también puede leer (hereda de anon, pero explícito por claridad)
drop policy if exists "authenticated select rutinas" on public.skincare_routines;
create policy "authenticated select rutinas" on public.skincare_routines
  for select to authenticated
  using (true);

-- Nota: Admin gestiona rutinas via service role (bypass RLS) o políticas separadas si se requiere UI admin.
-- No se añaden INSERT/UPDATE/DELETE para anon/authenticated.