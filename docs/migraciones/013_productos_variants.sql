-- Migración: Tabla de variantes de producto
-- Permite manejar diferentes tamaños/presentaciones de un mismo producto
-- ej: un sérum puede venir en 30ml y 50ml, o una crema en unidad y pack x3

-- 1. Tabla principal de variantes
create table if not exists public.producto_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.productos(id) on delete cascade,
  size text,           -- ej: '30ml', '50ml', '100ml'
  volume text,         -- alias de size, ej: '30ml'
  pack text,           -- ej: 'unidad', 'pack x3', 'x2'
  price_gs integer,    -- precio específico de la variante (en guaraníes)
  sku text,            -- código de barras opcional
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices para lookup rápido por producto y búsqueda
create index if not exists idx_producto_variants_product_id on public.producto_variants(product_id);
create index if not exists idx_producto_variants_sku on public.producto_variants(sku) where sku is not null;

-- 2. RLS: Cada producto puede tener múltiples variantes visibles
alter table public.producto_variants enable row level security;

-- Política: Solo variantes activas son visibles públicamente
create policy "producto_variants_select_active" on public.producto_variants
  for select using (active = true);

-- Política: Admin puede gestionar todas las variantes
create policy "producto_variants_admin_manage" on public.producto_variants
  for all using (auth.role() = 'service_role');

-- 3. Función helper para obtener variantes de un producto
create or replace function public.get_product_variants(
  p_product_id uuid
) returns jsonb language plpgsql security definer as $$
begin
  return (
    select jsonb_agg(row_to_json(v))
    from public.producto_variants v
    where v.product_id = p_product_id and v.active = true
  );
end;
$$;

-- 4. Trigger para actualizar updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trigger_producto_variants_updated_at
  before update on public.producto_variants
  for each row execute function public.set_updated_at();