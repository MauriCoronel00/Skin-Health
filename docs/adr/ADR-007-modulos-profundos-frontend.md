# ADR-007: Módulos profundos en el frontend

- Estado: aceptado (skill improve-codebase-architecture, reporte en %TEMP%)
- Fecha: 2026-09-17

## Contexto

El reporte de arquitectura encontró 4 fricciones (vocabulario: módulo, interfaz,
profundidad, seam, adapter): intake de Pedido mezclado en el UI, doble identidad,
caché de reviews duplicando la DB y sinks de analytics sin interfaz.

## Decisión

- **Pedido intake** (`src/data/pedidos.ts`): `createPedido()` absorbe validación, RPC,
  perfil, mensaje y analytics; `PedidoError` con código + mensaje. `CartDrawer` solo
  renderiza estados. Respeta ADR-002/003 (el flujo servidor no cambia).
- **Identidad** (`src/data/identity.ts`): `currentReviewer()` unifica sesión Supabase
  (adapter primario, con user_id) e identidad local (adapter de respaldo, display).
- **Reviews** (`src/hooks/useReviews.ts`): única interfaz de lectura/envío/moderación;
  rating y count se leen de las columnas de `productos` (trigger), no se recalculan
  en cliente. Respeta ADR-001.
- **Analytics** (`src/utils/analytics.ts`): misma interfaz `track*`; sinks
  (gtag/dataLayer/fbq) tras la interfaz. Agregar un destino = agregar un sink.

## Consecuencias

- Tests futuros cruzan una sola interfaz por módulo.
- Sin suite de tests hoy (`tsc` + `vite build` como verificación): montar vitest es
  el follow-up natural, empezando por `buildPedidoMessage` y los sinks.
