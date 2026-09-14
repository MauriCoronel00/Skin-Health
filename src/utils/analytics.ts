// Analytics event tracking utility compatible with Google Analytics 4 & Meta Pixel

export interface AnalyticsProduct {
  id: string;
  name: string;
  brand: string;
  categoryLabel?: string;
  price: number;
}

export const trackAddToCart = (product: AnalyticsProduct, quantity = 1) => {
  try {
    const item = {
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.categoryLabel || 'Skincare',
      price: product.price,
      quantity,
    };

    // Google Analytics 4 / gtag
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', 'add_to_cart', {
        currency: 'PYG',
        value: product.price * quantity,
        items: [item],
      });
    }

    // Google Tag Manager dataLayer
    if (typeof window !== 'undefined' && Array.isArray((window as unknown as { dataLayer: unknown[] }).dataLayer)) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'PYG',
          value: product.price * quantity,
          items: [item],
        },
      });
    }

    // Meta Pixel / fbq
    if (typeof window !== 'undefined' && typeof (window as unknown as { fbq: Function }).fbq === 'function') {
      (window as unknown as { fbq: Function }).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * quantity,
        currency: 'PYG',
      });
    }
  } catch (e) {
    // Fail silently in production
  }
};

export const trackBeginCheckout = (
  items: Array<{ product: AnalyticsProduct; quantity: number }>,
  totalAmount: number
) => {
  try {
    const formattedItems = items.map((i) => ({
      item_id: i.product.id,
      item_name: i.product.name,
      item_brand: i.product.brand,
      item_category: i.product.categoryLabel || 'Skincare',
      price: i.product.price,
      quantity: i.quantity,
    }));

    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', 'begin_checkout', {
        currency: 'PYG',
        value: totalAmount,
        items: formattedItems,
      });
    }

    if (typeof window !== 'undefined' && typeof (window as unknown as { fbq: Function }).fbq === 'function') {
      (window as unknown as { fbq: Function }).fbq('track', 'InitiateCheckout', {
        value: totalAmount,
        currency: 'PYG',
        num_items: items.reduce((acc, curr) => acc + curr.quantity, 0),
      });
    }
  } catch (e) {
    // Fail silently in production
  }
};

export const trackOrderSubmitted = (
  orderId: string,
  items: Array<{ product: AnalyticsProduct; quantity: number }>,
  totalAmount: number
) => {
  try {
    const formattedItems = items.map((i) => ({
      item_id: i.product.id,
      item_name: i.product.name,
      item_brand: i.product.brand,
      item_category: i.product.categoryLabel || 'Skincare',
      price: i.product.price,
      quantity: i.quantity,
    }));

    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'PYG',
        value: totalAmount,
        items: formattedItems,
      });
    }

    if (typeof window !== 'undefined' && typeof (window as unknown as { fbq: Function }).fbq === 'function') {
      (window as unknown as { fbq: Function }).fbq('track', 'Purchase', {
        value: totalAmount,
        currency: 'PYG',
        order_id: orderId,
      });
    }
  } catch (e) {
    // Fail silently in production
  }
};
