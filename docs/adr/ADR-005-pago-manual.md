# ADR-005: Pago manual (transferencia + WhatsApp) se mantiene

- Estado: aceptado (grill-me, flujo verificado en DB)
- Fecha: 2026-09-17

## Contexto

`pedidos.metodo_pago` defaultea a `transferencia_bancaria`; `referencia_pago` y
`comprobante_url` existen para el comprobante que el cliente envía por WhatsApp.
No hay pasarela de pagos.

## Decisión

- Se mantiene el pago por transferencia con comprobante por WhatsApp.
- El admin registra en el panel: referencia, comprobante y cambio a `'pagado'`
  (o `'cancelado'`), con lo que el trigger `trigger_descontar_stock` descuenta stock y
  escribe `movimientos_stock`.
- Estados válidos (`CHECK` existente): `pendiente, pagado, enviado, entregado, cancelado`.

## Consecuencias

- Sin integración de pagos en el horizonte cercano; si se agrega, debe engancharse al
  mismo cambio de estado para no duplicar el descuento de stock.
- El trigger no es idempotente ante re-UPDATEs al mismo estado: la guarda
  `OLD.estado IS DISTINCT FROM 'pagado'` ya lo cubre; no tocar.
