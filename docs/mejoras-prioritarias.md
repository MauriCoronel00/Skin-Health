# Roadmap de mejoras · Skin Health

Basado en auditoría crítica del 23-sep-2026. Ordenado por impacto/esfuerzo, no por gusto.

## Estimaciones

- **Esfuerzo**: XS (<1h), S (1-3h), M (3-8h), L (1-3 días), XL (>3 días)
- **Impacto**: conversión (más ventas) · percepción (marca premium) · técnico (mantenibilidad/velocidad)

---

## Prioridad ALTA (impacto directo en ventas)

### P1 · Checkout guest sin login obligatorio

- **Esfuerzo:** M (backend RPC + frontend CartDrawer)
- **Impacto:** conversión +30-50% (elimina el mayor punto de abandono)
- **Cambios:**
  - Modificar RPC `crear_pedido` en Supabase para aceptar `user_id NULL` cuando se provee `cliente_telefono`
  - En `createPedido()` no exigir `supabase.auth.getUser()` si hay teléfono
  - CartDrawer: mostrar login como opcional ("¿Ya sos cliente? Iniciá sesión") en vez de bloqueante
  - Preservar identidad por teléfono para tracking de pedidos: `?track=<telefono>` con validación por WhatsApp
- **Riesgo:** RLS de tabla `pedidos` — hay que ajustar policies para que anon pueda INSERT vía RPC pero no leer pedidos ajenos

### P2 · Code splitting agresivo

- **Esfuerzo:** S (2-3h)
- **Impacto:** técnico + conversión (–60% tiempo primera carga en 3G)
- **Cambios:**
  - `React.lazy()` en: `AdminPanel`, `ProductQuickView`, `DiagnosticQuiz`, `TrackingView`, `CartDrawer`
  - `build.rollupOptions.output.manualChunks` en `vite.config.ts` para separar vendor
  - Reducir el bundle de 769 KB → objetivo <400 KB inicial

### P3 · SEO base

- **Esfuerzo:** M (meta tags dinámicos) + L (SSR con Astro o vite-ssr)
- **Impacto:** long-tail — Google no indexa hoy nada útil
- **Cambios rápidos primero (M):**
  - Meta description específica por página
  - Open Graph tags dinámicos por producto (para preview en WhatsApp/Instagram)
  - Schema.org Product JSON-LD para aparecer en Google Shopping
- **Cambio de fondo después (L):**
  - Evaluar Astro para SSR de listado + producto (mantener SPA solo en checkout)

---

## Prioridad MEDIA (impacto en percepción y UX)

### P4 · ProductCard: reducir densidad visual

- **Esfuerzo:** S (1-2h)
- **Impacto:** percepción + conversión
- **Bugs a arreglar:**
  - `volume` renderizado 2 veces (líneas 69 y 132 de `ProductCard.tsx`) — bug de código
  - Rating `0.0 (0)` visible cuando no hay reviews — señal negativa; ocultar si `reviewsCount < 3`
- **Rediseño del card:**
  - Sacar la `<ul>` de beneficios del card (esa info va en QuickView)
  - Botón "+" → pill con texto: `[+ Agregar]` para mejor discoverabilidad
  - Título `line-clamp-1` con font menor en vez de `line-clamp-2`

### P5 · Rutinas: mejorar cards de steps

- **Esfuerzo:** S (2h)
- **Impacto:** percepción + conversión
- **Cambios:**
  - Imagen producto de 56×56 → 80×80 con sombra suave
  - Cada step clickeable → abre `ProductQuickView` del producto
  - Alternativas como chips clickeables (`[The Ordinary Salicylic 2%]`) que permiten intercambiar antes de agregar
  - Reducir jerarquías tipográficas: 2 niveles máximo por card (hoy hay 3)

### P6 · Hero unificado + social proof

- **Esfuerzo:** M (3-4h)
- **Impacto:** conversión (menos scroll para llegar al producto)
- **Cambios:**
  - Fusionar `HeroBanner` + `HeroRitualCTA` en un solo hero
  - Agregar fila de logos de marcas (CeraVe, La Roche-Posay, The Ordinary, SKIN1004) debajo del hero
  - Micro-testimonio arriba del fold: 1 estrella + 1 frase real + foto de clienta
  - Sección "Best sellers de esta semana" reemplazando el segundo hero

### P7 · Sistema tipográfico y color

- **Esfuerzo:** M (3-4h)
- **Impacto:** percepción (marca premium vs template)
- **Cambios:**
  - Reemplazar Playfair Display por **Fraunces** (gratis en Google Fonts, mucho más específica)
  - Definir color accent secundario para CTAs (opciones: rosa cuarzo `#E8B7B0`, verde salvia `#93A896`, dorado apagado `#B8975F`)
  - Ajustar `tailwind.config` con tokens semánticos: `primary`, `accent`, `success`, `danger`
  - Aplicar accent en botones críticos: agregar carrito, confirmar pedido

### P8 · Accesibilidad WCAG AA

- **Esfuerzo:** S (2h)
- **Impacto:** percepción + legal + SEO indirecto
- **Cambios:**
  - Font-sizes: subir todos los 9-10px a 12px mínimo
  - Focus visible en todos los botones custom (hoy solo inputs)
  - `role="alert"` en Toast de errores
  - Contrastes: revisar `text-neutral-400` sobre blanco (probablemente falla)

---

## Prioridad BAJA (nice to have)

### P9 · Copywriting con voz de marca

- **Esfuerzo:** M (día completo con foco)
- **Impacto:** percepción
- **Cambios:**
  - Definir tono (workshop de 1h: ¿experta cercana? ¿clínica premium? ¿amiga que sabe?)
  - Reescribir todos los headlines de secciones
  - Micro-copy en botones: "Agregar rutina completa" → "Llevo esta rutina (4 productos)"
  - Mensaje de WhatsApp del pedido: más humano, menos formal

### P10 · Fotos editoriales propias

- **Esfuerzo:** XL (sesión + edición, tarea externa)
- **Impacto:** percepción (2x precio percibido) — el cambio más grande sin tocar código
- **Presupuesto estimado:** USD 300-500 en Paraguay
- **Requisitos:**
  - Fotógrafo con experiencia en producto/beauty
  - Bodegones con texturas (mármol, seda, arena, agua)
  - 2-3 versiones por producto: solo, en contexto, macro
  - Formatos: JPG + WebP, 1200px, optimizadas

---

## Ejecución sugerida (siguientes 4 semanas)

### Semana 1 — Sin fricción de compra
- P1 · Checkout guest
- P4 · Fix ProductCard (volumen duplicado + rating hidden)

### Semana 2 — Velocidad y encontrable
- P2 · Code splitting
- P3 · SEO base (meta tags dinámicos + OG + Schema.org)

### Semana 3 — Mejor experiencia
- P5 · Rutinas mejoradas
- P6 · Hero unificado
- P8 · Accesibilidad

### Semana 4 — Marca
- P7 · Tipografía y color
- P9 · Copywriting
- P10 · Coordinar sesión de fotos (paralelo)

---

## Métricas a trackear antes/después

Antes de empezar, snapshot en Google Analytics / Vercel Analytics:

- **Tasa de conversión** (visitas → pedidos creados)
- **Tasa de abandono en checkout** (agregaron al carrito pero no confirmaron)
- **Time to Interactive** (Lighthouse mobile 3G)
- **Bounce rate** en la home
- **Pedidos por semana**

Comparar semanalmente. Si un cambio no mueve la aguja en 2 semanas, revisar hipótesis.
