import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackAddToCart, trackOrderSubmitted } from './analytics';

type MockWindow = {
  gtag: ReturnType<typeof vi.fn>;
  dataLayer: unknown[];
  fbq: ReturnType<typeof vi.fn>;
};

function mockWindow(over: Partial<MockWindow> = {}): MockWindow {
  const w: MockWindow = {
    gtag: vi.fn(),
    dataLayer: [],
    fbq: vi.fn(),
    ...over,
  };
  (globalThis as unknown as { window: unknown }).window = w;
  return w;
}

function getWindow(): MockWindow {
  return (globalThis as unknown as { window: MockWindow }).window;
}

beforeEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
});

describe('analytics sinks', () => {
  it('reparte el evento a los tres sinks', () => {
    const w = mockWindow();
    trackAddToCart({ id: 'a', name: 'N', brand: 'B', price: 10000 }, 2);

    expect(w.gtag).toHaveBeenCalledTimes(1);
    expect(w.dataLayer).toHaveLength(1);
    expect(w.fbq).toHaveBeenCalledTimes(1);
  });

  it('un sink roto no tumba a los demás ni a la app', () => {
    const w = mockWindow({
      gtag: (() => {
        throw new Error('gtag down');
      }) as unknown as ReturnType<typeof vi.fn>,
    });
    expect(() => trackOrderSubmitted('SKIN-1', [], 100000)).not.toThrow();
    expect(w.fbq).toHaveBeenCalledTimes(1);
    expect(w.dataLayer).toHaveLength(1);
  });

  it('sin window no hace nada', () => {
    expect(() =>
      trackAddToCart({ id: 'a', name: 'N', brand: 'B', price: 1 }, 1)
    ).not.toThrow();
  });
});
