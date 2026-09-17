# ADR-003: RPC `crear_pedido` valida total y stock server-side

- Estado: aceptado (grill-me Ronda 4, Q7)
- Fecha: 2026-09-17

## Contexto

El total (`total_gs`) se calcula en el cliente y se inserta tal cual; `orderId`
(`#SKIN-aleatorio`) también se genera en cliente (colisiones posibles). Un total
manipulado o un oversell entran a `pedidos` sin resistencia. El `CHECK (stock >= 0)`
solo falla tardío, al confirmar el pago.

## Decisión

- Nueva función `public.crear_pedido(...)` `SECURITY DEFINER` (ver
  `docs/migraciones/002_rpc_crear_pedido.sql`) que, en una transacción:
  1. exige usuario autenticado y al menos 1 ítem;
  2. por cada ítem: verifica producto `activo`, lee `precio_gs` y `stock` reales,
     rechaza si no hay stock suficiente;
  3. recalcula el total (ignora el total del cliente);
  4. genera `codigo_pedido` server-side (`SKIN-XXXXXXXX`, único por constraint);
  5. inserta pedido + ítems con `precio_unitario_gs` de la DB y retorna el `id`.
- `EXECUTE` revocado a `public`, otorgado solo a `authenticated`.
- El frontend deja de insertar directo en `pedidos`/`pedido_items` para el checkout
  (las policies de INSERT se mantienen como red de seguridad, no como vía principal).

## Consecuencias

- Precio y stock validados en servidor; el CHECK de stock queda como defensa en
  profundidad, no como control principal.
- El `codigo_pedido` pasa a formato nuevo; el frontend lo recibe del RPC en vez de
  generarlo.
- Stock no se reserva al crear (se descuenta al pagar, flujo actual); oversell entre
  creación y pago sigue posible pero acotado y visible (ver ADR-005).
