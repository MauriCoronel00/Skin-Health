# Skin Health — Frontend: estructura, bases técnicas y fachada

> Radiografía del frontend desplegado en `https://skin-health-three.vercel.app/`.
> Complementa `arquitectura-tecnica.md` (que cubre backend con más profundidad).
> Estado verificado contra el código el 2026-10-15.

---

## 1. Estructura (`src/`)

```
src/
├── main.tsx            # Boot: providers + render (ver §2)
├── App.tsx             # Composición de vistas y secciones (~520 líneas)
├── types.ts            # Tipos compartidos (Product, CartItem, Review…)
├── index.css           # Tokens, base, utilidades, animaciones, reduced-motion
├── components/         # 30 componentes de UI (PascalCase.tsx)
│   └── sections/       # 19 wrappers: ErrorBoundary (+Suspense/lazy donde aplica)
├── contexts/           # Language, Auth, Product, Cart (React Context, sin Redux)
├── data/               # Capa de acceso a datos, un módulo por dominio (ADR-007)
├── hooks/              # useSupabase, useReviews
├── i18n/               # Diccionarios por idioma (ES/PT/EN) + tipos y formato moneda
├── lib/                # supabaseClient
├── utils/              # analytics, envio, seo, productLink, quizWhatsApp,
│                       # recuperacion, reviewsStorage, exchangeRate (+*.test.ts)
├── assets/             # Imagen hero + imágenes empaquetadas
└── test/               # setup vitest
```

**Reglas de la casa (AGENTS.md):** totales y stock viven en RPCs (`crear_pedido`,
`ajustar_stock`), nunca se calculan en cliente; Supabase es fuente de verdad,
WhatsApp es solo notificación (ADR-002); precios en PYG con conversión a BRL/USD
sola para visualización (1 USD = 5890 Gs, 1 BRL = 1140 Gs); toda utilidad nueva
lleva su `.test.ts`.

---

## 2. Cómo está construida (boot y runtime)

**Boot** (`src/main.tsx`):

```
StrictMode > MotionConfig(reducedMotion=user) > LanguageProvider >
AuthProvider > ProductProvider > CartProvider > App
```

| Base técnica | Detalle preciso |
|---|---|
| React 19.0.1 + TypeScript 5.8.2 + Vite 6.2.3 | Sin React Router |
| Estilos | Tailwind CSS v4 (plugin Vite), clases utilitarias + vars CSS en `index.css` |
| Navegación | Estado + query params: `?p=` producto, `?track=` seguimiento, `?blog=` post, `?shortcut=` atajos PWA |
| Estado global | 4 Contexts. Carrito: `localStorage` + fila server `carritos` (RPCs `get_cart`/`upsert_cart`/`clear_cart`), estrategia *server-wins*, sin intervalo de polling |
| i18n | `translations.ts` (tipos + `formatCurrency`) y `translations.{es,pt,en}.ts`; ES en bundle inicial, PT/EN por `import()` dinámico al cambiar idioma |
| PWA | `vite-plugin-pwa`, `registerType: autoUpdate`, precache + `NetworkFirst` (con `no-store`) para Supabase, `CacheFirst` 1 año para Google Fonts |
| Iconos / animación | `lucide-react`, `motion/react` (MotionConfig respeta `prefers-reduced-motion`; `index.css` además anula animaciones con `reduce`) |
| Analítica | `utils/analytics.ts`: interfaz `track*` con sinks gtag/dataLayer/fbq detrás |
| SEO | Meta + OG/Twitter + JSON-LD (Store, FAQPage) en `index.html`; `react-snap` configurado en `package.json` pero **no** enganchado al `build` |
| Tests | Vitest: 13 archivos, 129 tests (`npm test -- --run`) |
| Calidad | `npm run lint` = `tsc --noEmit && eslint .` (2 errores preexistentes conocidos) |
| Deploy | Push a `main` → Vercel auto-deploy. Sin CI. |

**Bundle medido (build local, oct-2026):**

| Chunk | Raw | gzip | Cuándo se pide |
|---|---|---|---|
| `index` (app + ES) | 359 KB | 114,7 KB | Siempre |
| `vendor-supabase` | 227 KB | 58,9 KB | Siempre (catálogo) |
| `vendor-motion` | 138 KB | 45,8 KB | Siempre (hero, tarjetas) |
| `vendor-icons` | 24 KB | 5,5 KB | Siempre |
| 8 lazy (`CartDrawer`, `ProductQuickView`, `AdminPanel`, `ReviewFormModal`, `DiagnosticQuiz`, `TrackingView`, `BlogPostView`, `OrderConfirmationModal`) | 10–25 KB c/u | — | Solo al usarse (`React.lazy` + `Suspense`) |
| `translations.pt` / `translations.en` | ~18/17 KB | ~7/6,6 KB | Solo al cambiar idioma |

Historial: index 486,6 KB → 393,7 KB (lazy-split) → 359,2 KB (split i18n). Total −26%.

**Fuentes:** Google Fonts con `preconnect` + `preload as=style` y stylesheet `media=print` que conmuta a `all` (`Plus Jakarta Sans` 300–700 + itálica, `Fraunces` 400–700 óptico).

**Imágenes:** `<img>` nativo (sin `next/image`). Hero con `width/height` + `fetchpriority="high"`. Producto vía `productImageUrl()` → Supabase Image Transformations (`width`, `height=width`, `resize=contain`, `quality=75`, `format=webp`); resto con `loading="lazy"` + `decoding="async"`. Tarjetas y QuickView usan `object-contain` (+ `mix-blend-multiply`); avatares/fotos de reseña usan `object-cover` a propósito.

---

## 3. Fachada (lo que se ve, en orden)

Contenedor: `max-w-6xl`, fondo porcelana `#F1F4EF`. Vista home de arriba a abajo:

1. **Navbar** fija (`sticky`, blur): logo, buscador, login Google, selector ES/PY–BR/US, botón pedido con contador.
2. **Hero** (`HeroBanner`): tarjeta tinta `#102A43` con foto que florece a la derecha (máscara en desktop, velo en móvil), marca de agua 한굴 `피부`, titular editorial Fraunces, CTA quiz (blanco/azul) + catálogo fantasma, prueba 4.9★, franja del ritual en 4 capas (Limpieza·Tratamiento·Hidratación·Protección), fila de 6 marcas oficiales.
3. **SavedQuizBanner** (solo si hay diagnóstico guardado): tu piel + rutina lista + CTA WhatsApp + rehacer.
4. **Catálogo**: título serif + contador, pills de marca, filtros (necesidad, piel, precio con moneda convertida), grilla 2 → 3 (`md`) → 4 (`lg`) columnas de `ProductCard` (badge, wishlist, lupa, imagen cuadrada `bg-slate-50`, marca, nombre, precio, botón + que muta a ✓).
5. **Testimonios**: kicker pino + citas de reseñas aprobadas destacadas.
6. **PremiumSection**: panel oscuro de suscripción mensual (CTA a WhatsApp).
7. **HowItWorksSection**: 3–4 pasos + enlace Google Maps.
8. **Rutinas** (`CollapsibleRoutines`): 5 acordeones por tipo de piel con pasos, productos sustituibles y "llevar rutina completa".
9. **Footer** + **MobileBottomNav** (inicio, buscar, pedido, asesoría→WhatsApp, cuenta).

**Capas flotantes** (siempre montadas, visibles por estado): `FloatingCart` (píldora con total), `CartDrawer` (datos, zona con `ZonaCard`, pin Maps colapsable, pago, CTA WhatsApp), `OrderConfirmationModal` (resumen + reabrir WhatsApp), `ProductQuickView` (detalle + reseñas + zoom), `ReviewFormModal`, `Toast`, `WelcomePopup` (primera visita), `InstallBanner` (PWA), `AdminPanel` (solo rol admin).

**Vistas alternas** (reemplazan el home): `?blog=` → `BlogPostView` (cuerpo ES + chrome traducido); `?track=` → `TrackingView` (línea de tiempo pendiente→pagado→enviado→entregado + mapa).

**Tokens de diseño** (`index.css`): tinta `#102A43`, porcelana `#F1F4EF`, vidrio `#DCE9E4`, pino `#1E4D3B` (acciones), ámbar `#C98A2C` (hilo ritual), salvia `#93A896`, éxito `#059669`. Foco visible `#102A43` en todos los interactivos.

**Flujo que vende:** hero/quiz (60 seg) → resultado abre **WhatsApp** con `*DIAGNÓSTICO WEB*` + piel, preocupaciones, nivel, protector y rutina (`utils/quizWhatsApp.ts`) para que el bot asesore y cierre → pedido con transferencia → seguimiento en vivo.
