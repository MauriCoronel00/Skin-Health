export interface Product {
  id: string;
  name: string;
  brand: 'SKIN1004' | 'The Ordinary' | 'La Roche-Posay';
  subtitle: string;
  category: 'hydrate' | 'brighten' | 'calm' | 'protect' | 'cleanse';
  categoryLabel: string;
  price: number; // in Guaraníes (₲)
  image: string;
  volume: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  keyIngredients: string[];
  skinType: string;
  howToUse: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CategoryId = 'all' | 'hydrate' | 'brighten' | 'calm' | 'protect' | 'cleanse';

export interface CategoryOption {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}
