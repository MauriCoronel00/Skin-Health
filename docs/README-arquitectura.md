# Arquitectura Skin Health

Resumen compacto de cómo funciona la app, la tienda y la automatización end-to-end.

## Frontend (app + tienda)

- **Stack:** React 19 + Vite 6 + Tailwind 4
- **Hosting:** Vercel (`skin-health-three.vercel.app`), auto-deploy en push a `main`
- **Catálogo:** 20 productos y 5 rutinas cargadas dinámicamente desde Supabase
- **Diagnóstico:** quiz de 4 pasos → recomienda 1 de 5 rutinas → agrega los 4 productos al carrito → abre CartDrawer
- **Rutinas:** acordeón con paso a paso (imagen + marca + nombre real), alternativas reemplazables por paso, botón "Agregar rutina completa" con precio total
- **Auth:** Google OAuth vía Supabase; admin restringido a `theskinhealth777@gmail.com` (rol en tabla `perfiles`)
- **Nav móvil:** Inicio · Buscar · Pedido · Asesoría (abre WhatsApp) · Cuenta

## Backend (Supabase)

- **Proyecto:** `Skin Health Shop`, id `utiwzektfctdfyhgqode`
- **Tablas principales:** `productos`, `categorias`, `pedidos`, `pedido_items`, `perfiles`, `skincare_routines`, `reseñas`
- **RPC `crear_pedido`:** valida stock, calcula total server-side, genera código `SH-XXXX` legítimo, inserta pedido en estado `pendiente`
- **Trigger AFTER UPDATE:** cuando `estado` transiciona a `'pagado'`, descuenta stock automáticamente (guard `OLD.estado IS DISTINCT FROM 'pagado'` previene doble descuento)
- **Estados válidos:** `pendiente → pagado → enviado → entregado` (o `cancelado`)
- **RLS:** activo en todas las tablas; anon puede leer productos, categorías, rutinas aprobadas y reseñas aprobadas

## Flujo del pedido (end-to-end)

1. Cliente entra a la app → ve productos/rutinas → hace quiz o elige directo
2. Arma carrito, completa nombre/teléfono/dirección, confirma
3. `createPedido()` RPC → código `SH-XXXX` real + pedido en Supabase con estado `pendiente`
4. Redirect a WhatsApp `+595 976 659 748` con mensaje completo (código, ítems, total, datos de envío)
5. Bot Kapso asesora, coordina pago por transferencia bancaria
6. Admin verifica transferencia en Admin Panel → marca estado `pagado`
7. Trigger de Supabase descuenta stock automáticamente
8. Confirmación final al cliente por WhatsApp

## Bot WhatsApp (Kapso)

- **Número:** `+595 976 659 748`
- **Rol:** asesoría, cierre de pedidos, notificaciones (nunca fuente de verdad — ver ADR-002)
- **Credenciales:** `KAPSO_API_KEY`, `KAPSO_PHONE_NUMBER_ID`, `KAPSO_WEBHOOK_SECRET` en `.env` (nunca commitear)

## Documentación visual del sistema

Canvas de 18 nodos en n8n local (`localhost:5678`, workflow inactivo, solo docs):

- **FASE 1 · Cliente + Quiz + WhatsApp** (7 nodos): Webhook → Ve productos → If (¿Hace quiz?) → DiagnosticQuiz / Elige directo → Merge → Redirect WhatsApp → Bot Kapso
- **FASE 2 · Pedido + descuento automático de stock** (5 nodos): Code (genera código) → INSERT pedidos → Trigger AFTER INSERT → UPDATE stock → Bot envía código + datos de transferencia
- **FASE 3 · Verificación manual + cierre** (6 nodos): Admin Panel → Verificar transferencia → If (¿Pago confirmado?) → UPDATE pagado=true / Pendiente-cancelado → Bot confirmación final → Pedido cerrado

Agrupado con sticky notes por fase. Backup JSON en `docs/skin-health-system-map.json`.

## Reglas del proyecto

Ver `AGENTS.md` en la raíz. Puntos críticos:

- Supabase es fuente de verdad; WhatsApp solo notifica
- Nunca calcular totales ni descontar stock client-side (todo vía RPC)
- Deploy: push a `main` en GitHub → Vercel auto-deploy. Nunca `vercel deploy`
- Precios siempre en Gs (guaraníes)
- Shell PowerShell 5.1 (sin `&&`, comandos con `;` o secuenciales)
- `.env*` y `.vercel/` en `.gitignore`, nunca commitear secretos

## Comandos útiles

```powershell
npm run dev            # Vite dev server puerto 3000
npm run lint           # tsc --noEmit
npm test -- --run      # vitest
npm run build          # vite build
```

Orden de verificación antes de push: `lint` → `test` → `build`.
