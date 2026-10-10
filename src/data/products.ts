import { Product, CategoryOption, ProductVariant, Language } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useDaiExchangeRate } from '../utils/exchangeRate';

// Tasa base fija para desarrollo (aproximado: 1 USD = ~7.800 Gs)
const BASE_RATE = 7800;

/**
 * Obtiene las categorías desde Supabase
 */
export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, label, icon, description');

  if (error) throw error;

  return (data ?? []).map((c) => ({
    id: c.id,
    label: c.label,
    icon: c.icon,
    description: c.description,
  }));
}

/**
 * Formatea un precio mostrando tanto Gs como USD convertidos usando la tasa actual
 */
export const formatPriceWithRate = (
  amountGs: number,
  language: 'es' | 'pt' | 'en',
  rate: number = BASE_RATE
): string => {
  if (!amountGs || amountGs <= 0) return '--';

  const amountUsd = Math.round((amountGs / rate) * 100) / 100;

  // Formato según idioma para Gs
  const formattedGs = new Intl.NumberFormat(language === 'es' ? 'es-PY' : language === 'pt' ? 'pt-BR' : 'en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amountGs);

  // Formato USD
  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountUsd);

  // Prefijo según idioma
  const prefix = language === 'es'
    ? '₲'
    : language === 'pt'
    ? 'R$'
    : '$';

  return `${prefix} ${formattedGs} (${formattedUsd})`;
};

/**
 * Obtiene la cotización actual del dólar Dai y formatea el precio
 * Este hook debe usarse dentro de un componente con useLanguage
 */
export const useFormattedPrice = (amountGs: number, language: Language): string => {
  const rate = useDaiExchangeRate().rate;
  return formatPriceWithRate(amountGs, language, rate);
};

/**
 * Fetch products with the given language
 */
export async function fetchProducts(language: Language = 'es'): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, marca, subtitle, categoria_id, categoria_label,
      precio_gs, imagen_url, volumen, badge, rating, reviews_count,
      descripcion, key_ingredients, skin_type, how_to_use, stock,
      producto_beneficios ( titulo, descripcion, orden ),
      producto_variants (
        id, size, volume, pack, price_gs, sku, active, created_at, updated_at
      )
    `)
    .eq('activo', true);

  if (error) throw error;

  return (data ?? []).map((p) => {
    const variants: ProductVariant[] = (p.producto_variants ?? [])
      .filter((v) => v.active === true)
      .map((v) => ({
        id: v.id,
        product_id: p.id,
        size: v.size,
        volume: v.volume,
        pack: v.pack,
        price_gs: v.price_gs,
        sku: v.sku,
        active: v.active,
      }));

    // Helper para obtener valor por idioma con fallback
    const getText = (suffix: string, fallback: string = '') => {
      return p[`${suffix}_${language}`] || p[suffix] || '';
    };

    return {
      id: p.id,
      name: getText('nombre') ?? p.nombre ?? '',
      brand: p.marca,
      subtitle: getText('subtitle'),
      category: p.categoria_id,
      categoryLabel: p.categoria_label ?? '',
      price: p.precio_gs ?? 0,
      image: p.imagen_url ?? '',
      volume: p.volumen ?? '',
      badge: p.badge ?? undefined,
      rating: Number(p.rating ?? 0),
      reviewsCount: p.reviews_count ?? 0,
      description: getText('descripcion'),
      skinType: getText('skin_type'),
      howToUse: getText('how_to_use'),
      benefits: (p.producto_beneficios ?? [])
        .sort((a: any, b: any) => a.orden - b.orden)
        .map((b: any) => ({ title: b.titulo, desc: b.descripcion })),
      keyIngredients: p.key_ingredients ?? [],
      stock: p.stock ?? undefined,
      variants,
    };
  });
}

/**
 * Formatea el guarani tradicional (solo Gs, sin conversión USD)
 */
export const formatGuarani = (amount: number): string => {
  return `₲ ${amount.toLocaleString('es-PY')}`;
};

export const STORE_PHONE_NUMBER = '595976659748';
export const STORE_PHONE_DISPLAY = '+595 976 659 748';