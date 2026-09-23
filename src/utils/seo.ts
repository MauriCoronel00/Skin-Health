/**
 * Helpers de SEO para SPA: actualizan meta tags, título y JSON-LD al vuelo.
 *
 * Nota: para link previews en WhatsApp/Facebook (que NO ejecutan JS), lo que
 * cuenta es el HTML base servido por Vercel. Estos helpers sirven para:
 *   1. Google Bot moderno (sí ejecuta JS y respeta cambios)
 *   2. Historial del navegador (título correcto en tabs y bookmarks)
 *   3. Compartir con extensiones/screenshots que capturan estado actual
 *
 * Para SEO real (link previews que respeten producto), migrar a SSR con Astro
 * o vite-plugin-ssr — está en el roadmap como fase 2 de P3.
 */

import type { Product } from '../types';
import { formatGuarani } from '../data/products';

const SITE_URL = 'https://skin-health-three.vercel.app';
const SITE_NAME = 'Skin Health';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Actualiza o crea una <meta> tag específica. */
function setMeta(selector: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    // Detectar si es property (og:*) o name (description, twitter:*)
    const propMatch = selector.match(/property="([^"]+)"/);
    const nameMatch = selector.match(/name="([^"]+)"/);
    if (propMatch) el.setAttribute('property', propMatch[1]);
    if (nameMatch) el.setAttribute('name', nameMatch[1]);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Actualiza el <link rel="canonical">. */
function setCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * SEO por defecto de la homepage. Llamar al montar App y al cerrar cualquier
 * vista específica (producto, tracking) para restaurar el estado base.
 */
export function setHomeSEO(): void {
  const title = `${SITE_NAME} · Skincare importado en Paraguay`;
  const description =
    'Rutinas y productos de dermocosmética importada de laboratorios oficiales (CeraVe, La Roche-Posay, The Ordinary, SKIN1004). Envío a todo Paraguay. Pagos por transferencia.';

  document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', DEFAULT_OG_IMAGE);
  setMeta('meta[property="og:url"]', SITE_URL);
  setMeta('meta[property="og:type"]', 'website');
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', DEFAULT_OG_IMAGE);
  setCanonical(SITE_URL);
}

/**
 * SEO para una página de producto (cuando se abre QuickView o navegación
 * profunda `?product=<id>`).
 */
export function setProductSEO(product: Product): void {
  const title = `${product.brand} ${product.name} · ${SITE_NAME}`;
  const description =
    (product.description && product.description.trim()) ||
    product.subtitle ||
    `${product.brand} ${product.name} — ${formatGuarani(product.price)}. Envío a todo Paraguay.`;
  const productUrl = `${SITE_URL}/?product=${encodeURIComponent(product.id)}`;
  const image = product.image || DEFAULT_OG_IMAGE;

  document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:url"]', productUrl);
  setMeta('meta[property="og:type"]', 'product');
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
  setCanonical(productUrl);

  // Schema.org Product JSON-LD para Google Shopping y ricos resultados
  injectJsonLd('product-schema', {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    image: [image],
    description,
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PYG',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating && product.reviewsCount && product.reviewsCount >= 3
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          },
        }
      : {}),
  });
}

/** Remueve el schema de producto (al cerrar QuickView). */
export function clearProductSEO(): void {
  removeJsonLd('product-schema');
  setHomeSEO();
}

/**
 * Inyecta o reemplaza un bloque <script type="application/ld+json"> con un id
 * dado. Permite gestionar múltiples schemas coexistiendo.
 */
export function injectJsonLd(id: string, schema: Record<string, unknown>): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

function removeJsonLd(id: string): void {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/** Schema de Organización, se inyecta una vez al iniciar la app. */
export function injectOrganizationSchema(): void {
  injectJsonLd('organization-schema', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    description:
      'Tienda de skincare importado en Paraguay. Productos oficiales de CeraVe, La Roche-Posay, The Ordinary y SKIN1004. Envío a todo el país.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PY',
      addressLocality: 'Asunción',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+595-976-659-748',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
      areaServed: 'PY',
    },
    sameAs: ['https://www.instagram.com/skinhealthpy'],
  });
}
