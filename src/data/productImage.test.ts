import { describe, expect, it } from 'vitest';
import { productImageUrl } from './productImage';

const PUB =
  'https://utiwzektfctdfyhgqode.supabase.co/storage/v1/object/public/Imagenes-Productos/skin-health-imagenes/x.jpg';

describe('productImageUrl', () => {
  it('reescribe a render con width, quality y webp', () => {
    expect(productImageUrl(PUB, 600)).toBe(
      'https://utiwzektfctdfyhgqode.supabase.co/storage/v1/render/image/public/Imagenes-Productos/skin-health-imagenes/x.jpg?width=600&quality=75&format=webp',
    );
  });

  it('respeta query existente con &', () => {
    expect(productImageUrl(PUB + '?v=2', 200)).toContain('&width=200&quality=75&format=webp');
  });

  it('devuelve intactas urls externas y vacías', () => {
    expect(productImageUrl('https://ejemplo.com/a.png', 600)).toBe('https://ejemplo.com/a.png');
    expect(productImageUrl('', 600)).toBe('');
  });
});
