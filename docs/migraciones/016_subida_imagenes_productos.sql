-- Migración 016: subida de imágenes de productos
-- Proyecto: Skin Health Shop | idempotente.
-- Aplicar en: Supabase Dashboard > SQL Editor (o Management API).
-- El bucket `Imagenes-Productos` es público (lectura por URL) pero no tenía
-- policy de escritura: sin esto, el panel no puede subir imágenes.
-- Todo el resto del panel ya usa este bucket (carpeta skin-health-imagenes/).

drop policy if exists "Admin sube imagenes de productos" on storage.objects;
create policy "Admin sube imagenes de productos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'Imagenes-Productos' and public.es_admin());

drop policy if exists "Admin gestiona imagenes de productos" on storage.objects;
create policy "Admin gestiona imagenes de productos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'Imagenes-Productos' and public.es_admin());
