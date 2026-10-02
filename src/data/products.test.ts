import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchProducts, fetchCategories, formatGuarani, STORE_PHONE_NUMBER } from './products';

const { mockSupabaseFrom } = vi.hoisted(() => ({
  mockSupabaseFrom: vi.fn(),
}));

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: mockSupabaseFrom,
  },
}));

const mockProductRow = {
  id: 'prod-1',
  nombre: 'Sérum Test',
  marca: 'TestBrand',
  subtitle: 'Subtitle test',
  categoria_id: 'hydrate',
  categoria_label: 'Hidratación',
  precio_gs: 150000,
  imagen_url: 'https://example.com/img.jpg',
  volumen: '30ml',
  badge: 'NUEVO',
  rating: 4.5,
  reviews_count: 10,
  descripcion: 'Descripción del producto',
  key_ingredients: ['Ácido hialurónico', 'Niacinamida'],
  skin_type: 'todo tipo',
  how_to_use: 'Aplicar mañana y noche',
  producto_beneficios: [
    { titulo: 'Hidrata', descripcion: 'Hidratación profunda', orden: 1 },
    { titulo: 'Ilumina', descripcion: 'Mejora tono', orden: 2 },
  ],
};

const mockCategoryRow = {
  id: 'hydrate',
  label: 'Hidratación',
  icon: 'droplets',
  description: 'Productos para hidratar',
};

describe('products.ts - fetchProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mapea campos correctamente y coercea nulls', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [mockProductRow], error: null }),
    });

    const products = await fetchProducts();
    expect(products).toHaveLength(1);
    const p = products[0];
    expect(p.id).toBe('prod-1');
    expect(p.name).toBe('Sérum Test');
    expect(p.brand).toBe('TestBrand');
    expect(p.subtitle).toBe('Subtitle test');
    expect(p.category).toBe('hydrate');
    expect(p.categoryLabel).toBe('Hidratación');
    expect(p.price).toBe(150000);
    expect(p.image).toBe('https://example.com/img.jpg');
    expect(p.volume).toBe('30ml');
    expect(p.badge).toBe('NUEVO');
    expect(p.rating).toBe(4.5);
    expect(p.reviewsCount).toBe(10);
    expect(p.description).toBe('Descripción del producto');
    expect(p.keyIngredients).toEqual(['Ácido hialurónico', 'Niacinamida']);
    expect(p.skinType).toBe('todo tipo');
    expect(p.howToUse).toBe('Aplicar mañana y noche');
    expect(p.benefits).toEqual([
      { title: 'Hidrata', desc: 'Hidratación profunda' },
      { title: 'Ilumina', desc: 'Mejora tono' },
    ]);
  });

  it('ordena beneficios por orden', async () => {
    const rowUnordered = {
      ...mockProductRow,
      producto_beneficios: [
        { titulo: 'Segundo', descripcion: 'B', orden: 2 },
        { titulo: 'Primero', descripcion: 'A', orden: 1 },
      ],
    };
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [rowUnordered], error: null }),
    });

    const products = await fetchProducts();
    expect(products[0].benefits?.[0].title).toBe('Primero');
    expect(products[0].benefits?.[1].title).toBe('Segundo');
  });

  it('coercea nulls a strings vacíos', async () => {
    const rowWithNulls = {
      ...mockProductRow,
      nombre: null,
      marca: null,
      subtitle: null,
      categoria_label: null,
      precio_gs: null,
      imagen_url: null,
      volumen: null,
      badge: null,
      rating: null,
      reviews_count: null,
      descripcion: null,
      key_ingredients: null,
      skin_type: null,
      how_to_use: null,
      producto_beneficios: null,
    };
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [rowWithNulls], error: null }),
    });

    const products = await fetchProducts();
    const p = products[0];
    expect(p.name).toBe('');
    expect(p.brand).toBe(null);
    expect(p.subtitle).toBe('');
    expect(p.categoryLabel).toBe('');
    expect(p.price).toBe(0);
    expect(p.image).toBe('');
    expect(p.volume).toBe('');
    expect(p.badge).toBeUndefined();
    expect(p.rating).toBe(0);
    expect(p.reviewsCount).toBe(0);
    expect(p.description).toBe('');
    expect(p.keyIngredients).toEqual([]);
    expect(p.skinType).toBe('');
    expect(p.howToUse).toBe('');
    expect(p.benefits).toEqual([]);
  });

  it('filtra solo productos activos', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    await fetchProducts();
    const eqCall = mockSupabaseFrom.mock.results[0].value.eq.mock.calls[0];
    expect(eqCall).toEqual(['activo', true]);
  });

  it('lanza error si Supabase falla', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
    });

    await expect(fetchProducts()).rejects.toThrow('DB error');
  });
});

describe('products.ts - fetchCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mapea categorías', async () => {
    mockSupabaseFrom.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue({ data: [mockCategoryRow], error: null }),
    });

    const cats = await fetchCategories();
    expect(cats).toHaveLength(1);
    expect(cats[0]).toEqual({
      id: 'hydrate',
      label: 'Hidratación',
      icon: 'droplets',
      description: 'Productos para hidratar',
    });
  });
});

describe('products.ts - formatGuarani', () => {
  it('formatea con separador de miles', () => {
    expect(formatGuarani(1000)).toBe('₲ 1.000');
    expect(formatGuarani(150000)).toBe('₲ 150.000');
    expect(formatGuarani(1250000)).toBe('₲ 1.250.000');
    expect(formatGuarani(0)).toBe('₲ 0');
  });
});

describe('products.ts - constants', () => {
  it('STORE_PHONE_NUMBER es string numérico', () => {
    expect(typeof STORE_PHONE_NUMBER).toBe('string');
    expect(STORE_PHONE_NUMBER).toMatch(/^\d+$/);
  });

  it('STORE_PHONE_DISPLAY tiene formato legible', () => {
    expect(STORE_PHONE_NUMBER).toBe('595976659748');
  });
});