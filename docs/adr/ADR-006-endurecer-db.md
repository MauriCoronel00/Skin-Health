# ADR-006: Endurecer DB y documentar entorno

- Estado: aceptado (grill-me, linter Supabase 2026-09-17)
- Fecha: 2026-09-17

## Contexto

El linter reporta: `search_path` mutable en `descontar_stock_al_pagar` y
`crear_perfil_nuevo_usuario`; `crear_perfil_nuevo_usuario()` ejecutable por `anon`;
`movimientos_stock` con RLS pero sin policies. Además `.env.example` no documenta
`VITE_SUPABASE_URL` ni `VITE_SUPABASE_ANON_KEY`.

## Decisión

- Fijar `search_path = public` en funciones existentes y nuevas (`SET search_path`
  en `CREATE/ALTER FUNCTION`).
- Policy de lectura de `movimientos_stock` solo para admin (sigue cerrada para el resto).
- `crear_perfil_nuevo_usuario` se deja ejecutable (es trigger de `auth.users`; el aviso
  del linter es ruido conocido) pero con `search_path` fijo.
- `auth`: solo se usa login Google OAuth; la protección de passwords filtrados no aplica,
  se deja deshabilitada con este registro.
- Completar `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
  (sin valores reales).

## Consecuencias

- Quedan 0 WARN accionables del linter salvo el `SECURITY DEFINER` documentado arriba.
- Onboarding local documentado: copiar `.env.example` → `.env` y pedir las claves.
