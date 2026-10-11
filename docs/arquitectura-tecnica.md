# Skin Health — Documentación Técnica y de Arquitectura

> **Radiografía 100% exacta del proyecto** para auditores externos, arquitectos de software y diseñadores UX.

---

## 1. Stack Tecnológico & Infraestructura

### Frontend

| Concern | Tecnología | Versión | Ubicación |
|---|---|---|---|
| Build tool | Vite | ^6.2.3 | `vite.config.ts` |
| UI library | React | ^19.0.1 | `package.json` |
| Lenguaje | TypeScript | ~5.8.2 | `tsconfig.json` |
| Styling | Tailwind CSS (Vite plugin) | ^4.1.14 | `vite.config.ts` → `@tailwindcss/vite` |
| Animaciones | Motion (Framer) | ^12.23.24 | importado como `motion/react` |
| Iconos | lucide-react | ^0.546.0 | — |
| PWA | vite-plugin-pwa | ^1.3.0 | `vite.config.ts` |
| Pre-render SEO | react-snap (Puppeteer) | ^1.23.0 | `package.json` → `reactSnap` |
| Tests | Vitest | ^5.0.1 | `vitest.config.ts` |

**Gestión de estado global:** React Context + `useState` + `useCallback` + `useMemo`. No hay Zustand/Redux.

Providers en `src/main.tsx`:
```
StrictMode > MotionConfig > LanguageProvider > AuthProvider > ProductProvider > CartProvider > App
```

**Navegación:** Sin React Router. Vistas controladas por estado + query params (`?p=`, `?track=`, `?blog=`, `?shortcut=`).

**Path alias:** `@/*` → raíz del proyecto.

**Code splitting:** chunks `vendor-react`, `vendor-motion`, `vendor-supabase`, `vendor-icons`.

### Backend & Base de Datos

| Concern | Tecnología | Detalles |
|---|---|---|
| Motor de DB | PostgreSQL (Supabase) | Proyecto `Skin Health Shop`, id `utiwzektfctdfyhgqode` |
| Cliente DB | `@supabase/supabase-js` | ^2.45.0 — `src/lib/supabaseClient.ts` |
| Auth | Supabase Auth | Google OAuth (`signInWithOAuth`) — `src/contexts/AuthContext.tsx` |
| Storage | Supabase Storage | Imágenes de producto, comprobantes de pago |
| AI | `@google/genai` | ^2.4.0 — respuestas del bot WhatsApp |
| WhatsApp SDK | `@kapso/whatsapp-cloud-api` | ^0.3.0 |

**Patrón de acceso a datos:** Módulos "deep" (ADR-007) — un archivo por dominio en `src/data/`:
- `pedidos.ts`, `admin.ts`, `cart.ts`, `products.ts`, `identity.ts`, `reviews.ts`, `tracking.ts`, `blog.ts`, `productImage.ts`

**Cliente Supabase:**
```typescript
// src/lib/supabaseClient.ts
createClient(url, anonKey)
```

### Hosting & Deployment

| Aspecto | Detalle |
|---|---|
| Plataforma | Vercel |
| Dominio | `https://skin-health-three.vercel.app/` |
| Deploy | Auto-deploy en push a `main` |
| CDN | Vercel Edge Network (implícito) |
| API serverless | `api/webhooks/whatsapp.ts` (Vercel function) |

**Estrategia de renderizado: CSR puro** (Client-Side Render). No hay SSR/ISR/SSG.

`react-snap` pre-renderiza para SEO baseline:
- `/`
- `/?shortcut=catalog`
- `/?shortcut=cart`

SEO dinámico vía `src/utils/seo.ts` (inyección de meta tags).

**Config Vercel (`vercel.json`):**
- SPA fallback: `/(.*) → /index.html`
- Security headers: CSP, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy, Permissions-Policy

**Variables de entorno:**

| Variable | Propósito |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key |
| `GEMINI_API_KEY` | API key Gemini AI |
| `APP_URL` | URL autorreferencial |
| `VITE_META_PIXEL_ID` | Meta Pixel (opcional) |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics (opcional) |
| `KAPSO_WEBHOOK_SECRET` | Secreto HMAC webhook (soporta multi-secreto separado por coma) |
| `KAPSO_API_KEY` | API key Kapso |
| `KAPSO_PHONE_NUMBER_ID` | Phone number ID WhatsApp Business |

---

## 2. Esquema de Base de Datos (Database Schema)

### Tablas principales

#### `productos`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `nombre` | text | Nombre principal (ES) |
| `marca` | text | |
| `subtitle` | text | |
| `categoria_id` | text | FK lógica → `categorias.id` |
| `categoria_label` | text | Denormalizado |
| `precio_gs` | numeric | Precio en guaraníes |
| `imagen_url` | text | URL Supabase Storage |
| `volumen` | text | ej. "50ml" |
| `badge` | text | ej. "Bestseller" |
| `rating` | numeric | Calculado por trigger |
| `reviews_count` | integer | Calculado por trigger |
| `descripcion` | text | |
| `key_ingredients` | text | |
| `skin_type` | text | `grasa`, `seca`, `mixta`, `sensible`, `normal` |
| `how_to_use` | text | |
| `stock` | integer | |
| `activo` | boolean | Soft delete |
| `nombre_es/pt/en` | text | Traducciones |
| `subtitle_es/pt/en` | text | |
| `descripcion_es/pt/en` | text | |
| `skin_type_es/pt/en` | text | |
| `how_to_use_es/pt/en` | text | |
| `key_ingredients_es/pt/en` | text | |
| `producto_beneficios` | jsonb | Array `{titulo, descripcion, orden}` |
| `producto_beneficios_pt/en` | jsonb | |

#### `categorias`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | text | PK (`all`, `hydrate`, `brighten`, `calm`, `protect`, `cleanse`) |
| `label` | text | |
| `icon` | text | |
| `description` | text | |
| `label_pt/en` | text | |
| `description_pt/en` | text | |

#### `pedidos`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `auth.users.id` (nullable para guest) |
| `cliente_nombre` | text | |
| `cliente_telefono` | text | |
| `total_gs` | numeric | Total calculado server-side |
| `costo_envio_gs` | numeric | |
| `estado` | text | Ver estados abajo |
| `direccion_envio` | text | |
| `codigo_pedido` | text | Formato `SKIN-XXXXXXXX` |
| `creado_en` | timestamptz | |
| `metodo_pago` | text | |
| `referencia_pago` | text | |
| `comprobante_url` | text | URL del comprobante |
| `confirmado_por` | text | Admin que confirmó |

#### `pedido_items`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `pedido_id` | uuid | FK → `pedidos.id` |
| `producto_id` | uuid | FK → `productos.id` |
| `cantidad` | integer | |
| `precio_unitario_gs` | numeric | Precio snapshot al momento de la compra |

#### `movimientos_stock`
| Columna | Tipo | Notas |
|---|---|---|
| `producto_id` | uuid | FK → `productos.id` |
| `cantidad` | integer | Delta (negativo = venta) |
| `motivo` | text | `'ajuste'` o `'venta'` |

#### `perfiles`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, FK → `auth.users.id` |
| `nombre` | text | |
| `telefono` | text | |
| `email` | text | |
| `rol` | text | `'cliente'` o `'admin'` |

#### `reviews`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `producto_id` | uuid | FK → `productos.id` |
| `user_id` | uuid | FK → `auth.users.id` (nullable) |
| `author_name` | text | |
| `rating` | integer | 1-5 |
| `comment` | text | |
| `city` | text | |
| `status` | text | `pending`, `approved`, `hidden` |
| `is_featured` | boolean | |
| `creado_en` | timestamptz | |
| `compra_verificada` | boolean | Por trigger |
| `utiles_count` | integer | Denormalizado |
| `respuesta_admin` | text | |
| `respuesta_admin_creada_en` | timestamptz | |
| `tipo_piel` | text | |
| `fotos` | text[] | |

#### `reviews_utiles`
| Columna | Tipo | Notas |
|---|---|---|
| `review_id` | uuid | FK → `reviews.id` |
| `user_id` | uuid | FK → `auth.users.id` |
| `creado_en` | timestamptz | |
| PK | (review_id, user_id) | |

#### `skincare_routines`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | text | PK (ej. `hidratacion-sensible`) |
| `number` | integer | Orden de visualización |
| `title` | text | |
| `goal` | text | |
| `steps` | jsonb | Array `{label, productId, stepNumber}` |
| `instruction_type` | text | |
| `instruction_text` | text | |
| `title_pt/en` | text | |
| `instruction_text_pt/en` | text | |
| `steps_pt/en` | jsonb | |

#### `carritos`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `device_id` | text | Identificador anónimo |
| `user_id` | uuid | FK → `auth.users.id` (nullable) |
| `items` | jsonb | Array de items |
| `updated_at` | timestamptz | |
| `created_at` | timestamptz | |

#### `producto_variants`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `product_id` | uuid | FK → `productos.id` |
| `size` | text | |
| `volume` | text | |
| `pack` | text | |
| `price_gs` | numeric | |
| `sku` | text | |
| `active` | boolean | |

#### `wishlist`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `auth.users.id` (nullable) |
| `device_id` | text | |
| `producto_id` | uuid | FK → `productos.id` |
| `created_at` | timestamptz | |
| UNIQUE | (product_id, user_id, device_id) | |

#### `audit_log`
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `admin_user_id` | uuid | FK → `auth.users.id` |
| `accion` | text | |
| `tabla_objetivo` | text | |
| `registro_objetivo` | text | |
| `detalle` | jsonb | |
| `realizado_en` | timestamptz | |

### Relaciones (FKs)

```
perfiles.id → auth.users.id
pedidos.user_id → auth.users.id (nullable)
pedido_items.pedido_id → pedidos.id
pedido_items.producto_id → productos.id
movimientos_stock.producto_id → productos.id
reviews.producto_id → productos.id
reviews.user_id → auth.users.id (nullable)
reviews_utiles.review_id → reviews.id
reviews_utiles.user_id → auth.users.id
carritos.user_id → auth.users.id (nullable)
producto_variants.product_id → productos.id
wishlist.user_id → auth.users.id (nullable)
wishlist.producto_id → productos.id
audit_log.admin_user_id → auth.users.id
```

### Estados de órdenes

**Type:** `PedidoEstado = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'`

Definido en:
- `src/data/admin.ts` → `PedidoEstado`
- `src/data/tracking.ts` → `TrackingEstado`

**Transiciones válidas (desde `AdminPanel.tsx` → `nextActions()`):**

```
pendiente  → [pagado, cancelado]
pagado     → [enviado, cancelado]
enviado    → [entregado]
entregado → [] (terminal)
cancelado  → [] (terminal, puede activar mensaje de "Reclamar")
```

**Dónde ocurren las transiciones:**

| Función | Archivo | Descripción |
|---|---|---|
| `setPedidoEstado(id, estado)` | `src/data/admin.ts` | Actualización genérica de estado |
| `registrarPago(pedidoId, {referencia, comprobanteUrl})` | `src/data/admin.ts` | Set `estado='pagado'` + metadata de pago + `confirmado_por` |
| `handleEstado()` | `src/components/AdminPanel.tsx` | UI caller |
| `handleConfirmPago()` | `src/components/AdminPanel.tsx` | UI caller |

**Formato de código:** `SKIN-XXXXXXXX` — generado server-side: `'SKIN-' || upper(substr(md5(gen_random_uuid()::text), 1, 8))`

**Códigos de error del cliente (`PedidoErrorCode` en `src/data/pedidos.ts`):**
`EMPTY`, `CUSTOMER_DATA`, `NOT_AUTHENTICATED`, `NO_STOCK`, `UNAVAILABLE`, `ORDER_FAILED`

### Triggers de base de datos

| Trigger | Tabla | Propósito |
|---|---|---|
| `trigger_recalcular_rating` | `reviews` | After insert/update/delete → recalcula `productos.rating` y `reviews_count` desde reviews aprobadas |
| `trg_marcar_compra_verificada` | `reviews` | Before insert/update → set `compra_verificada` vía `usuario_compro_producto()` |
| `trg_utiles_count_ins/del` | `reviews_utiles` | Mantiene `reviews.utiles_count` denormalizado |
| `trg_validar_comment_review` | `reviews` | Before insert/update → moderación de contenido |
| Stock decrement | `pedidos` | On transición a `'pagado'` → decrementa `productos.stock`, inserta en `movimientos_stock` con `motivo='venta'`. Guard `OLD.estado IS DISTINCT FROM 'pagado'` previene doble decremento |

### Funciones RPC (Postgres)

| RPC | Propósito | Archivo migración |
|---|---|---|
| `crear_pedido` | Crea orden server-side, valida stock/total, genera código `SKIN-XXXXXXXX`. Acepta `user_id` NULL para guest. Grants a `anon, authenticated` | `007_checkout_guest.sql` |
| `ajustar_stock` | Edición admin de stock + precio opcional. Registra delta en `movimientos_stock` | `004_ajustar_stock_con_precio.sql` |
| `get_pedido_tracking` | Tracking público por código. Retorna solo datos no sensibles. Grants a `anon, authenticated` | `006_tracking_publico.sql` |
| `es_admin()` | Retorna true si el usuario actual tiene `rol='admin'` en `perfiles` | `001_reviews_rol_admin.sql` |
| `get_cart` / `upsert_cart` / `clear_cart` | CRUD de carrito server-side | `012_carritos_server_side.sql` |
| `get_product_variants` | Retorna variantes activas de un producto | `013_productos_variants.sql` |
| `upsert_wishlist` / `get_wishlist` | Gestión de wishlist | `014_wishlist.sql` |
| `toggle_util` | Toggle voto "útil" en review | `008_reviews_mejoras.sql` |
| `responder_review` | Admin responde una review | `008_reviews_mejoras.sql` |
| `usuario_compro_producto` | Verifica si usuario tiene orden pagada/enviada/entregada con el producto | `008_reviews_mejoras.sql` |
| `auditar_accion` | Inserta en `audit_log` | `009_seguridad_auditoria.sql` |
| `validar_contenido_review` | Moderación de contenido (longitud, links, palabras prohibidas) | `009_seguridad_auditoria.sql` |

### Políticas RLS clave

| Tabla | Política |
|---|---|
| `reviews` | Lectura pública de `approved`; autor lee las suyas; admin acceso total |
| `pedidos` | Solo admin (select/update) |
| `carritos` | `device_id` (anon) o `user_id` (authenticated) |
| `wishlist` | `device_id` o `user_id` |
| `audit_log` | Solo admin |
| `productos` | Anon puede leer productos activos |
| `categorias` / `skincare_routines` | Lectura pública (anon select) |

---

## 3. Flujos de Usuario & Lógica de Negocio

### Flujo del Carrito

**Context/Store:** `src/contexts/CartContext.tsx` → `CartProvider` / `useCart()`

**Estado:**
```typescript
cartItems, lastAddedTime, isSyncing, syncError, initialized
```

**Acciones:** `addToCart`, `addMultipleToCart`, `updateQuantity`, `removeItem`, `clearCart`

**Computados:** `totalItems`, `totalAmount`, `cartQuantidades`

**Persistencia dual-capa:**

1. **localStorage** — key `skinhealth_cart_v1`, cargado al init, guardado en cada cambio
2. **Supabase `carritos`** vía RPCs (`get_cart`, `upsert_cart`, `clear_cart`) — `src/data/cart.ts`

**Identidad de dispositivo:**
- `getDeviceId()` en `src/data/cart.ts` — key `skinhealth_device_id_v1` en localStorage, usa `crypto.randomUUID()`

**Estrategia de sync (`syncCart()` en `src/data/cart.ts`):**
- Al init: si carrito server vacío → sube local; si existe → merge (suma cantidades, precio server gana)
- Sync periódico cada 30s (`SYNC_INTERVAL_MS`)
- En login: `migrateCartToUser(deviceId, userId)` — mueve carrito anónimo a usuario
- Debounced save (500ms) después de cada mutación

**Cálculo de envíos — `src/utils/envio.ts`:**

```typescript
ENVIO_BASE_GS = 8000
ENVIO_KM_BASE = 3
ENVIO_EXTRA_POR_KM_GS = 2000
ENVIO_MAX_GS = 200000
ENVIO_ORIGEN = 'Asunción'

calcularEnvio(distKm)  // estimado client-side, validado server-side en crear_pedido (check INVALID_SHIPPING)
```

En `CartDrawer.tsx` — el usuario ingresa distancia en km, envío se calcula en vivo.

### Flujo del Quiz de Diagnóstico de Piel

**Componente:** `src/components/DiagnosticQuiz.tsx` — wizard de 4 pasos + resultado

**Preguntas:**

1. **Tipo de piel** (single-select): `grasa`, `mixta`, `seca`, `sensible`
2. **Preocupaciones** (multi-select): `acne`, `poros`, `manchas`, `lineas`, `hidratacion`, `rojez`
3. **Nivel de rutina** (single): `basica`, `completa`, `avanzada`
4. **Hábito SPF** (single): `siempre`, `salgo`, `maquillaje`, `nunca`

**Mapeo resultado → rutina (`matchRoutine()`):**

Prioridad: `sensible/rojez` > `acne/poros` > `manchas` > `lineas` > `hidratacion`

| Condición | Routine ID |
|---|---|
| `skin==='sensible'` OR `rojez` | `hidratacion-sensible` |
| `acne`/`poros` AND `skin!=='seca'` | `piel-grasa` |
| `manchas` | `manchas-luminosidad` |
| `lineas` | `anti-edad-renovacion` |
| `skin==='seca'` (fallback) | `hidratacion-sensible` |
| default | `hidratacion-universal` |

**Persistencia:** localStorage key `skinhealth_quiz_result_v1` — guarda `routineId`, `routineTitle`, `skinType`, `concerns`, `routineLevel`, `spfHabit`, `completedAt`

**Datos de rutina:** Supabase `skincare_routines` con jsonb `steps` — cada paso: `{label, productId, stepNumber}` (multilingüe vía `steps_pt`, `steps_en`). 5 rutinas definidas.

### Flujo de Checkout

**Componente:** `src/components/CartDrawer.tsx` — drawer slide-in con formulario de cliente

**Datos del cliente:**
- `nombre`, `telefono`, `direccion`, `googleMapsUrl`
- Persistidos en localStorage key `skinhealth_customer_data_v1`
- Honeypot anti-bot: campo `website`
- Throttle: 45 segundos entre órdenes por dispositivo (`ORDER_THROTTLE_KEY`)
- Protección anti-spam + double-click

**Captura de ubicación:**
- Input free-text `direccion` + link opcional de Google Maps
- Concatenado como `"address — mapsUrl"` pasado a `crear_pedido` como `direccion_envio`
- Input de distancia (km) para cálculo de envío
- **Sin geocoding/detección de zona** — Asunción vs Interior es implícito vía distancia

**Métodos de pago:**
- **Sin integración automática de pago** — flujo manual
- El mensaje de WhatsApp incluye detalles de la orden; la tienda coordina pago vía transferencia bancaria
- Admin verifica comprobante manualmente en Admin Panel (`registrarPago`)
- No hay lógica específica de USDT/SIPAAP en código — se manejan conversacionalmente vía bot WhatsApp

**Generación del payload WhatsApp — `buildPedidoMessage()` en `src/data/pedidos.ts`:**

```
Hola 👋 Quiero realizar el pedido *{codigo}* en *Skin Health*:

🛍️ *PRODUCTOS SELECCIONADOS*
• {name} x{qty} — ₲ {lineTotal}
...

💰 *Subtotal*: ₲ {totalGs}
🚚 *Envío*: ₲ {envio}
💰 *TOTAL*: ₲ {totalGs + envio}

📍 *REQUISITOS PARA EL ENVÍO*:
• *Nombre del cliente*: {nombre}
• *Teléfono de contacto*: {telefono}
• *Lugar de ubicación*: {direccion}

Quedo a la espera de confirmación de stock y métodos de pago. ¡Muchas gracias!
```

**Link `wa.me`:** `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
- `STORE_PHONE_NUMBER = '595976659748'` (desde `src/data/products.ts`)
- Abierto vía `window.open(whatsappUrl, '_blank', 'noopener,noreferrer')`

**Modal de confirmación (`OrderConfirmationModal.tsx`):**
- Muestra código de orden con botón copiar
- 3 pasos siguientes (WhatsApp, pago, entrega)
- Resumen con items, envío, total
- Acciones: Tracking live, Re-abrir WhatsApp, Pedir review

---

## 4. Integraciones & Automatizaciones

### Integración con WhatsApp

**Webhook Kapso (Vercel serverless):**
- `api/webhooks/whatsapp.ts` — Vercel function
- Desactiva body parser (`bodyParser: false`), verifica firma HMAC-SHA256 contra `KAPSO_WEBHOOK_SECRET` (soporta multi-secreto separado por coma)
- Procesa eventos `whatsapp.message.received` (batch-aware)
- Actualmente **log-only** — respuesta real manejada por Kapso Flow
- Retorna 200 en <10s

**Bot n8n:**
- `whatsapp-bot/workflow.json` — definición completa del workflow n8n
- Nodos: `Webhook WhatsApp` → `Extraer mensaje` (Code) → `Es cliente?` (IF) → `Responder menu` (Code) / `Buscar catalogo` (Supabase) → `Respuesta IA` → `Enviar WhatsApp`
- Consulta Supabase directamente para info de productos
- Menu regex: `^(hola|menu|ayuda|precio|envio|pedido)`
- Respuesta incluye link catálogo, tarifas de envío

**Mensajes de recuperación (`src/utils/recuperacion.ts`):**
- `mensajeRecuperacion(nombre, codigo, totalGs, items)` — 1er toque, amigable
- `mensajeReactivacion(nombre, codigo, totalGs, items)` — 2do toque, incentivo
- `toWhatsAppNumber(telefono)` — normaliza PY `09xx` → `5959xx`
- `linkRecuperacion(telefono, mensaje)` — link wa.me al cliente
- Usado en Admin Panel botones "Reclamar" / "Avisar"

**Links wa.me dinámicos:**
- Tienda: `https://wa.me/595976659748?text=...`
- Recuperación cliente: `https://wa.me/{normalized}?text=...`
- Link de tracking embebido en mensajes de notificación de estado

### Gestión de Inventario y Reservas

**Stock:**
- Columna `productos.stock` (integer)
- Decrementado vía trigger DB en transición de `pedidos.estado` a `'pagado'`
- Guard `OLD.estado IS DISTINCT FROM 'pagado'` previene doble decremento

**Ajustes de stock (Admin):**
- RPC `ajustar_stock` (`src/data/admin.ts` → `ajustarStock()`):
  - Valida admin vía `es_admin()`
  - Rechaza stock negativo (`NEGATIVE_STOCK`)
  - Registra delta en `movimientos_stock` con `motivo='ajuste'`
- `actualizarPrecio()` — lee stock actual, lo pasa de vuelta con nuevo precio (sin cambio de stock)
- UI Admin Panel: `StockEditor` inline (steppers + input) y `PriceEditor`

**Sin liberación automática:**
- Órdenes pendientes **no** bloquean/reservan stock
- Stock solo decrementa en transición a `pagado`
- No existe mecanismo de liberación por TTL
- Riesgo de over-selling mitigado por re-validación server-side en `crear_pedido` (chequea `v_stock < v_cant`)

### Pasarelas de pago / validaciones automáticas

**Solo manual — sin validación automática:**
- No hay integración de API de crypto (USDT) ni transferencia bancaria en código
- Formulario Admin Panel "Registrar pago": `referencia` (texto) + `comprobanteUrl` (URL)
- `registrarPago()` set `estado='pagado'` lo cual triggera decremento de stock
- URL comprobante almacenada en `pedidos.comprobante_url`, link visible en Admin Panel
- Confirmado por almacenado en `pedidos.confirmado_por`

**Moderación de contenido (reviews):**
- `src/utils/reviewsStorage.ts` → `validateReviewContent()` — pre-check client-side
- `validar_contenido_review()` — trigger server-side
  - Longitud: 5-600 chars
  - Bloquea URLs/links
  - Palabras prohibidas: estafa, estafadores, mierda, basura, puta, pelotudo, fraude, hack, casino, porn, viagra, crypto, bitcoin

---

## 5. UI/UX & Componentes Clave

### Layouts principales

La app es una **SPA de página única** con modales/drawers. No hay rutas separadas.

| Componente | Archivo | Propósito |
|---|---|---|
| `App` | `src/App.tsx` | Orquestador principal SPA |
| `Navbar` | `src/components/Navbar.tsx` | Header sticky, búsqueda, switcher idioma, botón carrito, login |
| `HeroSection` | `src/components/sections/HeroSection.tsx` | Hero landing |
| `WelcomeSection` | `src/components/sections/WelcomeSection.tsx` | Auto-popup (delay 5s), CTA quiz |
| `QuizSection` | `src/components/sections/QuizSection.tsx` | Envuelve DiagnosticQuiz en ErrorBoundary |
| `SavedQuizBannerSection` | `src/components/sections/SavedQuizBannerSection.tsx` | Muestra resultado de quiz guardado |
| `CatalogFiltersSection` | `src/components/sections/CatalogFiltersSection.tsx` | Filtros tipo de piel + rango de precio |
| `CatalogSection` | `src/components/sections/CatalogSection.tsx` | Grid de productos |
| `RoutinesSectionWrapper` | `src/components/sections/RoutinesSection.tsx` | Acordeón con pasos |
| `TestimoniosSectionWrapper` | `src/components/sections/TestimoniosSectionWrapper.tsx` | Carrusel de reviews |
| `PremiumSection` | `src/components/sections/PremiumSection.tsx` | Marcas premium |
| `HowItWorksSection` | `src/components/sections/HowItWorksSection.tsx` | Explicador 3 pasos |
| `FloatingCartSection` | `src/components/sections/FloatingCartSection.tsx` | Barra flotante inferior |
| `CartDrawerSection` | `src/components/sections/CartDrawerSection.tsx` | Drawer slide-in checkout |
| `OrderConfirmationSection` | `src/components/sections/OrderConfirmationSection.tsx` | Modal éxito |
| `ProductQuickViewSection` | `src/components/sections/ProductQuickViewSection.tsx` | Modal detalle producto |
| `ReviewFormSection` | `src/components/sections/ReviewFormSection.tsx` | Formulario escribir review |
| `AdminPanelSection` | `src/components/sections/AdminPanelSection.tsx` | Zona admin |
| `MobileBottomNavSection` | `src/components/sections/MobileBottomNavSection.tsx` | Bottom tab bar |
| `FooterSection` | `src/components/sections/FooterSection.tsx` | Footer con acceso admin |
| `BlogPostView` | `src/components/BlogPostView.tsx` | Artículo blog (vía `?blog=`) |
| `TrackingView` | `src/components/TrackingView.tsx` | Tracking orden (vía `?track=`) |

### Optimización de assets

**Transformación de imágenes — `src/data/productImage.ts` → `productImageUrl(url, width=800)`:**

Convierte URLs de Supabase Storage public a render URLs:
```
/storage/v1/render/image/public/...?width=800&quality=75&format=webp
```

URLs no-Storage pasan sin cambio.

**Componentes de imagen:** `<img>` nativo con `loading="lazy"` (no hay `next/image`).

**PWA Workbox runtime caching:**
- Fuentes de Google: `CacheFirst`
- Supabase API: `NetworkFirst`

**PWA Manifest:**
- Nombre: `Skin Health`
- Modo: `standalone`
- Background: `#FAF8F5`
- Theme: `#102A43`
- Shortcuts: "Mi Pedido" (`/?shortcut=cart`), "Catálogo" (`/?shortcut=catalog`)
- Iconos: 72-512px maskable PNGs

---

## Patrones Clave

1. **Server-authoritative totals/stock** — el cliente nunca calcula totales finales ni decrementa stock; todo vía RPC `crear_pedido`
2. **Supabase como source of truth** — WhatsApp es solo notificación (ADR-002)
3. **Módulos deep** (ADR-007) — un archivo por dominio en `src/data/`
4. **Defensive null coercion** — columnas nullable de Supabase llegan como `null`, mappers usan `?? ''`
5. **Device ID + user ID dualidad** — carrito anónimo vía `device_id`, autenticado vía `user_id`, merge en login
6. **Optimistic UI con rollback** — toggle "útil" en review actualiza UI inmediatamente, rollback en fallo
7. **Sin router** — query params + vistas controladas por estado
8. **Multi-language vía columnas DB** — patrón `nombre_es/pt/en`, nunca hardcoded
9. **Moderación de contenido dual-layer** — pre-check client + trigger DB enforcement
10. **PWA-first** — offline-capable, installable, Workbox caching strategies

---

## Índice de Archivos Clave

| Área | Ruta |
|---|---|
| Entry point | `src/main.tsx` |
| App shell | `src/App.tsx` |
| Tipos | `src/types.ts` |
| Cliente Supabase | `src/lib/supabaseClient.ts` |
| Órdenes | `src/data/pedidos.ts` |
| Admin/órdenes | `src/data/admin.ts` |
| Carrito data | `src/data/cart.ts` |
| Productos | `src/data/products.ts` |
| Identidad | `src/data/identity.ts` |
| Reviews | `src/data/reviews.ts` |
| Tracking | `src/data/tracking.ts` |
| Blog | `src/data/blog.ts` |
| Image transform | `src/data/productImage.ts` |
| Cart context | `src/contexts/CartContext.tsx` |
| Auth context | `src/contexts/AuthContext.tsx` |
| Product context | `src/contexts/ProductContext.tsx` |
| Language context | `src/contexts/LanguageContext.tsx` |
| Reviews hook | `src/hooks/useReviews.ts` |
| Shipping calc | `src/utils/envio.ts` |
| Recovery WA | `src/utils/recuperacion.ts` |
| Analytics | `src/utils/analytics.ts` |
| SEO | `src/utils/seo.ts` |
| Exchange rate | `src/utils/exchangeRate.ts` |
| Product links | `src/utils/productLink.ts` |
| Review storage | `src/utils/reviewsStorage.ts` |
| Cart drawer | `src/components/CartDrawer.tsx` |
| Quiz | `src/components/DiagnosticQuiz.tsx` |
| Admin panel | `src/components/AdminPanel.tsx` |
| Order confirm | `src/components/OrderConfirmationModal.tsx` |
| Tracking view | `src/components/TrackingView.tsx` |
| Navbar | `src/components/Navbar.tsx` |
| WA webhook | `api/webhooks/whatsapp.ts` |
| n8n bot | `whatsapp-bot/workflow.json` |
| Vercel config | `vercel.json` |
| Vite config | `vite.config.ts` |
| TS config | `tsconfig.json` |
| Package.json | `package.json` |
| Env example | `.env.example` |
| Migraciones SQL | `docs/migraciones/001_reviews_rol_admin.sql` → `014_wishlist.sql` + 2 archivos traducciones |
| ADRs | `docs/adr/ADR-001` → `ADR-007` |
