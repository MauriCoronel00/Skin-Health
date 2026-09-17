# ADR-004: Rol admin en `perfiles` + panel admin en la app

- Estado: aceptado (grill-me Ronda 4, Q8+Q10)
- Fecha: 2026-09-17

## Contexto

Nadie puede poner un pedido en `'pagado'` desde la app (`pedidos` no tiene policy UPDATE
para ningún rol): la confirmación es manual por dashboard. No hay vista de pedidos ni de
stock en el frontend.

## Decisión

- Columna `perfiles.rol` (`'cliente'` default / `'admin'`, con CHECK).
- Helper `public.es_admin()` (`SECURITY DEFINER`, `search_path` fijo) para policies sin
  recursión RLS.
- Policies: admin SELECT + UPDATE en `pedidos`, SELECT en `pedido_items`,
  SELECT en `movimientos_stock`, gestión total en `reviews`.
- El primer admin se promueve por SQL manual (`UPDATE perfiles SET rol='admin' ...`).
- Panel admin en la app (ruta protegida por rol), alcance v1:
  listar pedidos con filtros por estado, detalle + comprobante, acciones
  pagar/cancelar, stock visible por producto. Gestión de catálogo queda para después.

## Consecuencias

- El flujo de stock ya construido (trigger al pasar a `'pagado'`) se activa desde la app.
- UPDATE de `pedidos` restringido a admin: el cliente no puede auto-confirmar pagos.
- La ruta admin del frontend debe verificar el rol vía query a `perfiles`, no por email
  hardcodeado.
