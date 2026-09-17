-- Migración 001: reviews en Supabase + rol admin + hardening
-- Proyecto: Skin Health Shop | ADR-001, ADR-004, ADR-006
-- Aplicar en: Supabase Dashboard > SQL Editor (o `supabase db push`).
-- Orden: todo el archivo es una sola transacción implícita por statement;
-- las secciones están ordenadas por dependencia. Idempotente donde se indica.

-- ============================================================================
-- 1. Columna rol en perfiles (PRIMERO: es_admin() la referencia al crearse)
-- ============================================================================
alter table public.perfiles
  add column if not exists rol text not null default 'cliente'
  check (rol in ('cliente', 'admin'));

-- PROMOVER EL PRIMER ADMIN (editar el email y ejecutar manualmente):
-- update public.perfiles set rol = 'admin'
-- where email = 'tu-email@gmail.com';

-- ============================================================================
-- 2. Helper es_admin() (evita recursión RLS en policies)
-- ============================================================================
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- ============================================================================
-- 3. Tabla reviews
-- ============================================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  producto_id text not null references public.productos(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade, -- NULL = seed/demo
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 5 and 600),
  city text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'hidden')),
  is_featured boolean not null default false,
  creado_en timestamptz not null default now(),
  unique (producto_id, user_id) -- NULLs no colisionan: permite múltiples seeds
);

alter table public.reviews enable row level security;

drop policy if exists "Lectura publica de aprobadas" on public.reviews;
create policy "Lectura publica de aprobadas"
  on public.reviews for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "Autor ve sus propias reviews" on public.reviews;
create policy "Autor ve sus propias reviews"
  on public.reviews for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Autor crea reviews pendientes" on public.reviews;
create policy "Autor crea reviews pendientes"
  on public.reviews for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Autor edita sus pendientes" on public.reviews;
create policy "Autor edita sus pendientes"
  on public.reviews for update to authenticated
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Admin gestiona reviews" on public.reviews;
create policy "Admin gestiona reviews"
  on public.reviews for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ============================================================================
-- 4. Trigger: recalcula rating / reviews_count solo con approved
-- ============================================================================
create or replace function public.recalcular_rating_producto()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  v_producto text := coalesce(new.producto_id, old.producto_id);
begin
  update public.productos p
  set rating = coalesce(s.promedio, 0),
      reviews_count = coalesce(s.total, 0)
  from (
    select avg(rating)::numeric(3,2) as promedio, count(*)::int as total
    from public.reviews
    where producto_id = v_producto and status = 'approved'
  ) s
  where p.id = v_producto;
  return coalesce(new, old);
end;
$function$;

drop trigger if exists trigger_recalcular_rating on public.reviews;
create trigger trigger_recalcular_rating
after insert or update or delete on public.reviews
for each row execute function public.recalcular_rating_producto();

-- ============================================================================
-- 5. Policies admin: pedidos, pedido_items, movimientos_stock
-- ============================================================================
drop policy if exists "Admin ve todos los pedidos" on public.pedidos;
create policy "Admin ve todos los pedidos"
  on public.pedidos for select to authenticated
  using (public.es_admin());

drop policy if exists "Admin actualiza pedidos" on public.pedidos;
create policy "Admin actualiza pedidos"
  on public.pedidos for update to authenticated
  using (public.es_admin())
  with check (public.es_admin());

drop policy if exists "Admin ve items de pedidos" on public.pedido_items;
create policy "Admin ve items de pedidos"
  on public.pedido_items for select to authenticated
  using (public.es_admin());

drop policy if exists "Admin lee movimientos de stock" on public.movimientos_stock;
create policy "Admin lee movimientos de stock"
  on public.movimientos_stock for select to authenticated
  using (public.es_admin());

-- ============================================================================
-- 6. Hardening: search_path fijo en funciones existentes (ADR-006)
-- ============================================================================
alter function public.descontar_stock_al_pagar() set search_path = public;
alter function public.crear_perfil_nuevo_usuario() set search_path = public;

-- ============================================================================
-- 7. Seed: 34 reviews demo como approved (user_id NULL).
-- Nota: 3 productId del frontend no existen en DB y se mapean al id real:
--   cerave-sa-cleanser      -> cerave-sa-smoothing-cleanser
--   cerave-daily-lotion      -> cerave-daily-moisturizing-lotion
--   cerave-retinol-serum     -> cerave-resurfacing-retinol-serum
-- ============================================================================
insert into public.reviews (producto_id, user_id, author_name, rating, comment, city, status, creado_en) values
('madagascar-centella-ampoule', null, 'María González', 5, 'Me llegó rápido acá en Fernando de la Mora y vino bien embalado. Hasta ahora me gustó bastante, me calma las rojeces enseguida.', 'Fernando de la Mora', 'approved', '2026-09-02T14:22:00Z'),
('madagascar-centella-ampoule', null, 'Laura Benítez', 5, 'Lo compré para probar por recomendación de mi dermatóloga y la verdad que me sorprendió la textura ligera.', 'Asunción', 'approved', '2026-08-28T19:10:00Z'),
('madagascar-centella-ampoule', null, 'Diego Martínez', 4, 'Buen producto, llegó sin problemas y era igual a las fotos del catálogo. Rinde muchísimo el frasco de 55ml.', 'San Lorenzo', 'approved', '2026-08-20T11:45:00Z'),
('madagascar-centella-ampoule', null, 'Gabriela Fernández', 5, 'Mi hermana ya lo estaba usando y me lo prestó. Me pedí el mío por WhatsApp y me llegó en el mismo día.', 'Luque', 'approved', '2026-08-15T16:30:00Z'),
('madagascar-centella-ampoule', null, 'Juan Carlos López', 5, 'Super liviano para el calor de Asunción, no te deja la cara grasosa ni pesada. 10 puntos la atención.', 'Asunción', 'approved', '2026-08-10T10:15:00Z'),
('madagascar-centella-ampoule', null, 'Claudia Ramírez', 4, 'Todo bien con el pedido, llegó en el tiempo que me dijeron cuando mandé la ubicación.', 'Lambaré', 'approved', '2026-07-29T18:05:00Z'),
('ordinary-niacinamide-zinc', null, 'Sofía Martínez', 5, 'Controla el brillo de la zona T súper bien. Lo uso todas las mañanas antes del protector solar.', 'Asunción', 'approved', '2026-09-05T09:40:00Z'),
('ordinary-niacinamide-zinc', null, 'Ana Rodríguez', 4, 'Al principio pica un poquito apenas pero a los dos días ya te acostumbras. Se nota el cambio en los poros.', 'Capiatá', 'approved', '2026-08-25T14:15:00Z'),
('ordinary-niacinamide-zinc', null, 'Esteban Bogado', 5, 'Me vino con el precinto original intacto. Muy buena predisposición por WhatsApp para coordinar el delivery.', 'Mariano Roque Alonso', 'approved', '2026-08-18T17:50:00Z'),
('ordinary-niacinamide-zinc', null, 'Patricia Duarte', 5, 'Es la segunda vez que pido este sérum en Skin Health. El precio está muy accesible para ser importado original.', 'Asunción', 'approved', '2026-08-11T12:00:00Z'),
('ordinary-niacinamide-zinc', null, 'Leticia Vera', 4, 'Cumple lo que promete, no es milagroso pero ayuda bastante a que la base de maquillaje no se cuartee.', 'Ñemby', 'approved', '2026-07-22T20:30:00Z'),
('centella-hyalu-cica-sun-serum', null, 'Camila Ayala', 5, 'El mejor protector solar que probé en mi vida. Parece una crema hidratante acuosa, cero rastro blanco ni ojos llorosos.', 'Asunción', 'approved', '2026-09-08T15:20:00Z'),
('centella-hyalu-cica-sun-serum', null, 'Rodrigo Benítez', 5, 'Viene la cajita con el sello original de SKIN1004. Me sorprendió lo rápido que se absorbe.', 'San Lorenzo', 'approved', '2026-08-30T10:45:00Z'),
('centella-hyalu-cica-sun-serum', null, 'Valeria Insfrán', 5, 'Para los días de mucho calor y humedad viene genial porque no transpirás grasa. Recomendadísimo.', 'Encarnación', 'approved', '2026-08-19T13:10:00Z'),
('centella-hyalu-cica-sun-serum', null, 'Marcos Giménez', 4, 'Llegó en encomienda al interior en dos días hábiles. Todo impecable.', 'Ciudad del Este', 'approved', '2026-08-04T16:00:00Z'),
('laroche-anthelios-oil-control', null, 'Sebastián Romero', 5, 'Toque seco de verdad. No te brilla la frente en todo el día de trabajo.', 'Asunción', 'approved', '2026-09-06T18:15:00Z'),
('laroche-anthelios-oil-control', null, 'Mirtha Caballero', 5, 'Excelente producto. Mi dermatólogo me lo indicó por unas manchas solares y es el único que tolero bien.', 'Luque', 'approved', '2026-08-27T08:30:00Z'),
('laroche-anthelios-oil-control', null, 'Lucas Coronel', 4, 'Buenísimo el producto. Solo hay que recordar agitarlo bien antes de usar porque es bien líquido.', 'Lambaré', 'approved', '2026-08-14T11:20:00Z'),
('laroche-cicaplast-baume', null, 'Florencia Galeano', 5, 'Es un salvavidas cuando tenés la barrera dañada o la piel irritada del viento. En una noche te calma todo.', 'Asunción', 'approved', '2026-09-04T21:10:00Z'),
('laroche-cicaplast-baume', null, 'Silvia Maidana', 5, 'Lo uso después del retinol cuando siento la piel tirante y funciona increíble. Muy contenta con el servicio.', 'Villa Elisa', 'approved', '2026-08-22T14:40:00Z'),
('laroche-cicaplast-baume', null, 'Fernando Colmán', 4, 'Es denso, así que una pequeña cantidad ya rinde para toda la cara. Llegó super bien protegido.', 'San Antonio', 'approved', '2026-08-09T17:15:00Z'),
('cerave-hydrating-facial-cleanser', null, 'Belén Franco', 5, 'No hace espuma exagerada pero limpia sin dejar esa sensación tirante y reseca. Muy recomendado.', 'Asunción', 'approved', '2026-09-01T12:30:00Z'),
('cerave-hydrating-facial-cleanser', null, 'Alejandro Acosta', 5, 'El tamaño de 473ml rinde un montón, casi 4 meses me duró el anterior. Todo en orden con la entrega.', 'Fernando de la Mora', 'approved', '2026-08-24T19:00:00Z'),
('cerave-sa-smoothing-cleanser', null, 'Carlos Mendoza', 5, 'Me ayudó muchísimo con los granitos de los brazos y la textura de la frente. 100% satisfecho.', 'Luque', 'approved', '2026-09-03T16:45:00Z'),
('cerave-sa-smoothing-cleanser', null, 'Adriana Ortiz', 4, 'Muy buen limpiador con ácido salicílico. Llegó en el horario coordinado por WhatsApp.', 'San Lorenzo', 'approved', '2026-08-16T11:10:00Z'),
('ordinary-squalane-cleanser', null, 'Cecilia Barrios', 5, 'La textura bálsamo se derrite con el calor de las manos y saca el protector solar a prueba de agua sin frotar.', 'Asunción', 'approved', '2026-09-07T14:50:00Z'),
('ordinary-squalane-cleanser', null, 'Gustavo Paiva', 4, 'Ideal como primer paso de la doble limpieza nocturna. El tubo vino en óptimas condiciones.', 'Capiatá', 'approved', '2026-08-17T09:25:00Z'),
('ordinary-hyaluronic-acid', null, 'Lorena Villalba', 5, 'Lo uso con la cara húmeda y deja la piel súper rellena y suave. La entrega fue rapidísima.', 'Asunción', 'approved', '2026-09-02T18:30:00Z'),
('ordinary-hyaluronic-acid', null, 'Matias Rojas', 4, 'Buen hidratante, no me causó brotes ni alergia. Coordinamos el pago contra entrega sin vueltas.', 'Mariano Roque Alonso', 'approved', '2026-08-12T15:10:00Z'),
('laroche-vitaminc10', null, 'Andrea Cáceres', 5, 'Da un brillo saludable impresionante en la piel. Vale cada guaraní por la calidad que tiene.', 'Asunción', 'approved', '2026-08-29T10:05:00Z'),
('ordinary-glycolic-acid-toner', null, 'Natalia Samaniego', 5, 'Excelente para unificar textura dos veces por semana de noche. El producto es 100% auténtico.', 'Ñemby', 'approved', '2026-08-21T13:40:00Z'),
('centella-poremizing-ampoule', null, 'Raquel Vera', 5, 'La textura con sal rosa es hermosa y se absorbe al instante. Muy buen trato por WhatsApp.', 'Lambaré', 'approved', '2026-08-26T17:15:00Z'),
('cerave-daily-moisturizing-lotion', null, 'Hugo Alcaraz', 5, 'Textura ligera pero hidrata todo el día sin dejar pegajoso. Es básica en mi rutina.', 'Fernando de la Mora', 'approved', '2026-08-31T11:30:00Z'),
('cerave-resurfacing-retinol-serum', null, 'Viviana Silvero', 5, 'Retinol muy suave, ideal para principiantes como yo. No me descamó nada y se nota la piel más suave.', 'Asunción', 'approved', '2026-09-05T19:20:00Z')
on conflict do nothing;

-- Tras el seed, el trigger ya recalculó rating/reviews_count de los
-- productos alcanzados. Verificar con:
-- select id, nombre, rating, reviews_count from public.productos order by reviews_count desc;
