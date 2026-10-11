import { Product, CategoryOption, ProductVariant, Language } from '../types';
import { supabase } from '../lib/supabaseClient';

// Tasa base oficial según usuario: 1 USD = 5890 Gs
const BASE_RATE = 5890;

/**
 * Formatea un precio mostrando tanto Gs como USD convertidos usando la tasa oficial
 * @param amountGs Monto en Guaraníes
 * @param language Idioma: 'es', 'pt' o 'en'
 * @returns String formateado ej: "₲ 1.000 ( $17.03 )"
 */
export const formatPriceWithRate = (
  amountGs: number,
  language: 'es' | 'pt' | 'en'
): string => {
  if (!amountGs || amountGs <= 0) return '--';

  const amountUsd = Math.round((amountGs / BASE_RATE) * 100) / 100;

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
 * Hook para formatear precio con la tasa oficial (1 USD = 5890 Gs)
 * Debe usarse dentro de un componente que tenga acceso al lenguaje actual
 */
export const useFormattedPrice = (amountGs: number, language: Language): string => {
  return formatPriceWithRate(amountGs, language);
};

/**
 * Fetch products with the given language
 * @param language Idioma para leer nombres/descripciones multilingües
 */
export async function fetchProducts(language: Language = 'es'): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, marca, subtitle, categoria_id, categoria_label,
      precio_gs, imagen_url, volumen, badge, rating, reviews_count,
      descripcion, key_ingredients, skin_type, how_to_use, stock,
      nombre_es, nombre_pt, nombre_en,
      subtitle_es, subtitle_pt, subtitle_en,
      descripcion_es, descripcion_pt, descripcion_en,
      skin_type_es, skin_type_pt, skin_type_en,
      how_to_use_es, how_to_use_pt, how_to_use_en,
      key_ingredients_es, key_ingredients_pt, key_ingredients_en,
      producto_beneficios ( titulo, descripcion, orden )
    `)
    .eq('activo', true);

  if (error) throw error;

  return (data ?? []).map((p) => {
    const variants: ProductVariant[] = [];

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