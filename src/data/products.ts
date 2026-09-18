import { Product, CategoryOption } from '../types';
import { supabase } from '../lib/supabaseClient';

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

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      id, nombre, marca, subtitle, categoria_id, categoria_label,
      precio_gs, imagen_url, volumen, badge, rating, reviews_count,
      descripcion, key_ingredients, skin_type, how_to_use,
      producto_beneficios ( titulo, descripcion, orden )
    `)
    .eq('activo', true);

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.nombre ?? '',
    brand: p.marca,
    subtitle: p.subtitle ?? '',
    category: p.categoria_id,
    categoryLabel: p.categoria_label ?? '',
    price: p.precio_gs ?? 0,
    image: p.imagen_url ?? '',
    volume: p.volumen ?? '',
    badge: p.badge ?? undefined,
    rating: Number(p.rating ?? 0),
    reviewsCount: p.reviews_count ?? 0,
    description: p.descripcion ?? '',
    benefits: (p.producto_beneficios ?? [])
      .sort((a: any, b: any) => a.orden - b.orden)
      .map((b: any) => ({ title: b.titulo, desc: b.descripcion })),
    keyIngredients: p.key_ingredients ?? [],
    skinType: p.skin_type ?? '',
    howToUse: p.how_to_use ?? '',
  }));
}

// Estas dos quedan igual que antes, no vienen de la base de datos
export const formatGuarani = (amount: number): string => {
  return `₲ ${amount.toLocaleString('es-PY')}`;
};

export const STORE_PHONE_NUMBER = '595976659748';
export const STORE_PHONE_DISPLAY = '+595 976 659 748';
