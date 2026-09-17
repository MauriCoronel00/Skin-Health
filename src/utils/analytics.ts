// Analytics: una interfaz (track*), un adapter por destino (sink).
// Agregar un destino = agregar un sink abajo. Los llamadores no cambian.

export interface AnalyticsProduct {
  id: string;
  name: string;
  brand: string;
  categoryLabel?: string;
  price: number;
}

type EventName = 'add_to_cart' | 'begin_checkout' | 'purchase';

interface NormalizedItem {
  item_id: string;
  item_name: string;
  item_brand: string;
  item_category: string;
  price: number;
  quantity: number;
}

interface NormalizedEvent {
  name: EventName;
  currency: 'PYG';
  value: number;
  items: NormalizedItem[];
  transaction_id?: string;
  num_items?: number;
}

interface Sink {
  send(e: NormalizedEvent): void;
}

function normalize(
  product: AnalyticsProduct,
  quantity: number
): NormalizedItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.brand,
    item_category: product.categoryLabel || 'Skincare',
    price: product.price,
    quantity,
  };
}

type GlobalWithSinks = typeof globalThis & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
};

const gtagSink: Sink = {
  send(e) {
    const w = window as unknown as GlobalWithSinks;
    if (typeof w.gtag !== 'function') return;
    const gaEvent = e.name === 'purchase' ? 'purchase' : e.name;
    w.gtag('event', gaEvent, {
      currency: e.currency,
      value: e.value,
      items: e.items,
      ...(e.transaction_id ? { transaction_id: e.transaction_id } : {}),
    });
  },
};

const dataLayerSink: Sink = {
  send(e) {
    const w = window as unknown as GlobalWithSinks;
    if (!Array.isArray(w.dataLayer)) return;
    w.dataLayer.push({
      event: e.name,
      ecommerce: { currency: e.currency, value: e.value, items: e.items },
    });
  },
};

const fbqSink: Sink = {
  send(e) {
    const w = window as unknown as GlobalWithSinks;
    if (typeof w.fbq !== 'function') return;
    const fbEvent =
      e.name === 'add_to_cart'
        ? 'AddToCart'
        : e.name === 'begin_checkout'
          ? 'InitiateCheckout'
          : 'Purchase';
    w.fbq('track', fbEvent, {
      content_ids: e.items.map((i) => i.item_id),
      content_type: 'product',
      value: e.value,
      currency: e.currency,
      ...(e.transaction_id ? { order_id: e.transaction_id } : {}),
      ...(e.num_items !== undefined ? { num_items: e.num_items } : {}),
    });
  },
};

const sinks: Sink[] = [gtagSink, dataLayerSink, fbqSink];

function dispatch(e: NormalizedEvent) {
  try {
    for (const sink of sinks) {
      try {
        sink.send(e);
      } catch {
        // un sink roto no tumba a los demás
      }
    }
  } catch {
    // analytics nunca rompe la app
  }
}

export const trackAddToCart = (product: AnalyticsProduct, quantity = 1) => {
  if (typeof window === 'undefined') return;
  dispatch({
    name: 'add_to_cart',
    currency: 'PYG',
    value: product.price * quantity,
    items: [normalize(product, quantity)],
  });
};

export const trackBeginCheckout = (
  items: Array<{ product: AnalyticsProduct; quantity: number }>,
  totalAmount: number
) => {
  if (typeof window === 'undefined') return;
  dispatch({
    name: 'begin_checkout',
    currency: 'PYG',
    value: totalAmount,
    items: items.map((i) => normalize(i.product, i.quantity)),
    num_items: items.reduce((acc, curr) => acc + curr.quantity, 0),
  });
};

export const trackOrderSubmitted = (
  orderId: string,
  items: Array<{ product: AnalyticsProduct; quantity: number }>,
  totalAmount: number
) => {
  if (typeof window === 'undefined') return;
  dispatch({
    name: 'purchase',
    currency: 'PYG',
    value: totalAmount,
    items: items.map((i) => normalize(i.product, i.quantity)),
    transaction_id: orderId,
    num_items: items.reduce((acc, curr) => acc + curr.quantity, 0),
  });
};
