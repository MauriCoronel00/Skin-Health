/** Links compartibles por producto (?p=id). Sin router: Query param + QuickView. */

export function productLink(productId: string): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('p', productId);
  return url.toString();
}

export function productIdFromUrl(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('p');
  } catch {
    return null;
  }
}

/** Refleja el QuickView abierto en la URL (reemplaza, sin recargar). */
export function syncProductUrl(productId: string | null): void {
  try {
    const url = new URL(window.location.href);
    if (productId) {
      url.searchParams.set('p', productId);
    } else {
      url.searchParams.delete('p');
    }
    window.history.replaceState(null, '', url.toString());
  } catch {
    // Sin historial disponible (SSR/tests): no hace nada.
  }
}
