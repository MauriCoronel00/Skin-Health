# Skin Health — Estructura y construcción (datos técnicos)

## 1. Stack
- React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4.
- `motion` (animaciones), `lucide-react` (iconos), `@supabase/supabase-js` v2.
- PWA: `vite-plugin-pwa` (`manifest.webmanifest`, `registerSW.js`, `sw.js`).
- Tests: Vitest 5 + Testing Library + jsdom (13 archivos, 129 tests).
- Lint: `tsc --noEmit` + ESLint. Build: `vite build` (solo `vite`, sin `tsc`).
- Fuentes: `Plus Jakarta Sans` + `Fraunces` (Google Fonts, carga diferida).

## 2. Scripts (`package.json`)
| Script | Comando |
|---|---|
| `dev` | `vite --port=3000 --host=0.0.0.0` |
| `lint` | `tsc --noEmit && eslint .` |
| `test` | `vitest run` |
| `build` | `vite build` |
| `build:check` | `tsc && vite build` (solo local/CI) |
| `prerender` | `react-snap` (separado; requiere Chromium en `/usr/bin/chromium-browser`) |

## 3. Árbol `src/`
```
src/
  App.tsx                 # composición home (secciones) + vistas blog/tracking
  main.tsx                # bootstrap React
  types.ts                # tipos compartidos (Product, Language, …)
  index.css               # Tailwind 4 + tokens (porcelana #F1F4EF, pino #1E4D3B,
                          #   ámbar #C98A2C, tinta #102A43, salvia #93A896)
  assets/images/          # logo .webp + foto hero (JPG local)
  components/             # ~30 componentes (Navbar, HeroBanner, CartDrawer,
                          #   ProductCard, DiagnosticQuiz, …) + sections/ (wrappers
                          #   lazy por sección: Catalog, Quiz, Routines, …)
  contexts/               # ProductContext, CartContext, LanguageContext, AuthContext
  data/                   # capa de acceso a datos (ver §5)
  hooks/                  # useReviews, useSupabase
  i18n/                   # translations.ts (tipos) + translations.{es,pt,en}.ts
                          #   ES en bundle; PT/EN por import() dinámico
  lib/supabaseClient.ts   # cliente Supabase (anon key)
  utils/                  # analytics, envio, productLink, quizWhatsApp,
                          #   recuperacion, seo (+ .test.ts por utilidad)
```

## 4. Render home (orden en `App.tsx`)
Navbar → InstallBanner → SavedQuizBanner → Quiz (modal) → Hero (compacto:
foto + diagnóstico + ver catálogo) → catálogo (filtros + grilla) →
testimonios → premium → cómo funciona → rutinas → footer. Flotantes:
FloatingCart, CartDrawer, OrderConfirmation, Toast, QuickView, ReviewForm,
MobileBottomNav, WelcomePopup.

## 5. Capa de datos (`src/data/`, un módulo = una interfaz)
- `products.ts` — `fetchProducts(lang)` (fallback `*_es/pt/en` → base),
  `fetchCategories`, `formatPriceWithRate`, `formatGuarani`.
- `pedidos.ts` — `createPedido`, `PedidoError`, mensaje WhatsApp del pedido.
- `cart.ts` — sincronización carrito server-wins vía RPC (sin polling).
- `identity.ts` — identidad sesión + fallback local; `admin.ts` — rol admin.
- `reviews.ts` / `useReviews.ts` — reseñas (solo `approved` públicas;
  rating/count se leen de columnas de `productos`, no se recalculan).
- `tracking.ts` — seguimiento público por código.
- `zonasEnvio.ts` — zonas y precios (Luque 15000; Zona 1 30000; Zona 2 35000;
  interior `precioGs: null` = precio a confirmar).
- `blog.ts`, `demoReviews.ts`, `productImage.ts` (URLs con `resize=contain`).

## 6. Backend — Supabase (proyecto `utiwzektfctdfyhgqode`)
- Tablas: `productos` (+ columnas `*_es/_pt/_en`), `categorias`,
  `skincare_routines`, `producto_beneficios` (+ `_pt`, `_en`),
  `carritos`, pedidos, reviews, wishlist, variantes (ver `docs/migraciones/`).
- RPCs: `crear_pedido`, `ajustar_stock`, `get_cart`, `upsert_cart`, `clear_cart`.
- Reglas: totales y stock solo en servidor (nunca cálculo cliente); stock
  decrementa por trigger al pasar a `'pagado'` (guard
  `OLD.estado IS DISTINCT FROM 'pagado'`); estados válidos
  `pendiente → pagado → enviado → entregado` o `cancelado`; solo admins avanzan.
- Auth: Google OAuth; RLS con `GRANT EXECUTE` a `anon`/`authenticated` en RPCs.
- Migraciones: `docs/migraciones/001–014_*.sql` + `traducciones_*.sql`
  (idempotentes; se aplican desde el dashboard de Supabase).
- WhatsApp es solo notificación (el pedido vive en Supabase). Si `crear_pedido`
  falla: toast con reintento, se conserva el carrito, NO se abre WhatsApp.

## 7. Moneda
- Precios base en guaraníes (PYG). Tasas fijas: 1 USD = 5890 Gs
  (`GS_PER_USD`), 1 BRL = 1140 Gs (`GS_PER_BRL`).
- `formatCurrency` convierte según idioma; `formatGuarani` muestra solo Gs.

## 8. i18n
- Tres idiomas (`es` por defecto, `pt`, `en`), clave única `t.*` en toda la UI.
- Fechas por locale (`es-PY`, `pt-BR`, `en-US`).

## 9. SEO / marketing técnico
- `index.html`: meta description/keywords, Open Graph, Twitter Card, canonical,
  JSON-LD `Store` + `FAQPage`, `sitemap.xml`, `robots.txt`, `llms.txt`,
  `ai-catalog.json`, speculation rules (prerender `?shortcut=catalog`).
- `src/utils/analytics.ts`: interfaz `track*` (gtag/dataLayer/fbq detrás).
- Teléfonos PY `09xx` → `5959xx` en links `wa.me` (`utils/recuperacion.ts`).

## 10. Deploy
- Push a `main` en GitHub → Vercel auto-deploy
  (`https://skin-health-three.vercel.app/`). Sin CI propio en repo
  (verificación local: `lint` → `test` → `build`).
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  (`.env*` salvo `.env.example` y `.vercel/` están en `.gitignore`).
