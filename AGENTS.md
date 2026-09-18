# AGENTS.md — Skin Health Shop

Skincare catalog (React 19 + Vite 6 + Tailwind 4) backed by Supabase. Orders are
created in-app, paid by bank transfer, confirmed via WhatsApp. Prices in PYG.

## Commands

- `npm run dev` — Vite on port 3000 (`--host=0.0.0.0`)
- `npm run lint` — `tsc --noEmit` (typecheck; no ESLint)
- `npm test -- --run` — vitest; single file: `npx vitest run src/utils/<name>.test.ts`
- `npm run build` — `vite build` (chunk-size warning is pre-existing, ignore)
- Verify order: `lint` → `test` → `build`
- No CI. Deploy: push to `main` on GitHub → Vercel auto-deploys
  `https://skin-health-three.vercel.app/`. Vercel CLI is NOT authorized here;
  never try `vercel deploy` — push instead.

## Backend (Supabase project `Skin Health Shop`, id `utiwzektfctdfyhgqode`)

- Source of truth is Supabase, WhatsApp is notification only (ADR-002). If the
  `crear_pedido` RPC insert fails: error toast with retry, keep cart, do NOT
  open WhatsApp.
- Totals/server logic live in RPCs (`crear_pedido`, `ajustar_stock`). Never
  compute totals or discount stock client-side.
- Stock decrements via trigger on transition to `'pagado'`; the
  `OLD.estado IS DISTINCT FROM 'pagado'` guard already handles re-UPDATEs — do not touch.
- Valid order states: `pendiente → pagado → enviado → entregado`, or `cancelado`.
  Only admins advance states (AdminPanel).
- Reviews: only `approved` are public; read rating/count from `productos`
  columns (DB trigger), never recompute client-side.
- Auth: Google OAuth via Supabase; `currentReviewer()` (`src/data/identity.ts`)
  unifies session identity + local fallback. Role check: `isCurrentUserAdmin()`.

## Frontend architecture (ADR-007: deep modules, one interface each)

- `src/data/pedidos.ts` — order intake (`createPedido`, `PedidoError`); CartDrawer only renders states
- `src/data/identity.ts` — who acts; `src/hooks/useReviews.ts` — reviews;
  `src/utils/analytics.ts` — `track*` interface, sinks (gtag/dataLayer/fbq) behind it
- `src/utils/recuperacion.ts` — cart-recovery WhatsApp messages + `wa.me` links
  (PY phones `09xx` → `5959xx`); AdminPanel "Reclamar" button uses it
- New utility? Add a `.test.ts` next to it (vitest is the established pattern).

## Gotchas learned the hard way

- Supabase nullable columns (`subtitle`, `descripcion`, `imagen_url`, …) arrive
  as `null` — coerce in `src/data/products.ts` mappers (`?? ''`), plus defensive
  `??` at use sites (the search filter once crashed on null `subtitle`).
- Category ids come from the `categorias` table — never hardcode the id set;
  counts/filters must be keyed dynamically (`Record<string, number>`).
- `docs/glosario.md` is the domain language authority; `docs/adr/` (7 ADRs)
  records accepted decisions — read the relevant ADR before changing
  orders/payments/reviews flows.
- `.env*` (except `.env.example`) and `.vercel/` are gitignored; never commit secrets.
- Shell here is PowerShell 5.1: no `&&` chaining, `fc` is aliased (use `fc.exe`).

## Marketing (do not mix with app code)

- CTA is always the store link (link in bio); WhatsApp (+595 976 659 748) is for
  advice/closing only. Prices always in Gs.
- `redes/` holds calendar, closing script (`CIERRE.md`), n8n template.
  n8n has no MCP access in this setup — credentials/publish happen in n8n UI.
- The `social-skin-health` marketing agent lives OUTSIDE this repo
  (`Default Project/.opencode/agent/`); code changes here don't affect it and
  vice versa — but keep CTA/price rules in sync manually.
