# ADR-001: Reviews migran a Supabase

- Estado: aceptado (grill-me Ronda 4, Q5+Q9)
- Fecha: 2026-09-17

## Contexto

Las reviews viven en `localStorage` (`skinhealth_reviews_v1`) + `INITIAL_DEMO_REVIEWS` en
`src/data/demoReviews.ts`. Consecuencias: se pierden entre dispositivos, no hay moderación
real, y `productos.rating` / `reviews_count` nunca se actualizan con opiniones de clientes.

## Decisión

- Nueva tabla `public.reviews` (ver `docs/migraciones/001_reviews_rol_admin.sql`):
  `producto_id` FK, `user_id` nullable (NULL = seed/demo), `author_name`, `rating` 1–5,
  `comment` 5–600 chars, `city`, `status` (`pending/approved/hidden`, default `pending`),
  `is_featured`, `creado_en`. Única por (`producto_id`, `user_id`).
- RLS: lectura pública solo `approved`; autor ve/crea/edita las suyas (solo `pending`
  para insertar/editar); admin gestión total.
- Seed con las 34 demos existentes como `approved` con `user_id` NULL. Ojo: 3 `productId`
  del frontend no existen en DB y se mapean en el seed:
  `cerave-sa-cleanser` → `cerave-sa-smoothing-cleanser`,
  `cerave-daily-lotion` → `cerave-daily-moisturizing-lotion`,
  `cerave-retinol-serum` → `cerave-resurfacing-retinol-serum`.
  El frontend deberá usar los ids reales al migrar (ticket).
- Trigger `trigger_recalcular_rating`: recalcula `productos.rating` (promedio 2 decimales)
  y `reviews_count` solo con reviews `approved`, en INSERT/UPDATE/DELETE.
- Reviews locales en dispositivos se descartan (no hay forma fiable de recolectarlas).

## Consecuencias

- El frontend cambia su fuente de reviews a Supabase; `getProductRatingStats` pasa a leerse
  de `productos` o calcularse sobre reviews `approved`.
- La validación de contenido (`validateReviewContent`) se mantiene en cliente como primera
  barrera; la moderación real es el estado `pending` + panel admin.
- Cambio incompatible menor: `rating` en DB queda con 2 decimales; el frontend ya usa
  `number`, sin fricción.
