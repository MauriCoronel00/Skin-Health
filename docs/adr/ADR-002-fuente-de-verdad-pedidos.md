# ADR-002: Supabase es la fuente de verdad del pedido

- Estado: aceptado (grill-me Ronda 4, Q6)
- Fecha: 2026-09-17

## Contexto

`CartDrawer.tsx` inserta en `pedidos` + `pedido_items` y luego abre WhatsApp con el resumen.
Si el insert falla, igual abre WhatsApp: el pedido existe en el chat pero no en la DB
(doble fuente de verdad, imposible conciliar).

## Decisión

- Supabase manda. WhatsApp es solo canal de aviso de un pedido **ya registrado**.
- Si el insert (vía RPC `crear_pedido`, ADR-003) falla: toast de error reintentable, el
  carrito se conserva y **no se abre WhatsApp**.
- Fallback manual explícito: si el cliente insiste, el mensaje de WhatsApp debe incluir
  la leyenda de que el pedido no quedó registrado y un admin lo carga después.

## Consecuencias

- Desaparecen los pedidos "fantasma" (WhatsApp sin registro).
- El checkout necesita estado de error con reintento (ticket frontend).
- Métricas y stock se calculan siempre sobre `pedidos`/`pedido_items`.
