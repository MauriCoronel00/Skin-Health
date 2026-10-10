export interface ProductBenefit {
  title: string;
  desc: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
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
  benefits?: ProductBenefit[];
  keyIngredients: string[];
  skinType: string;
  howToUse: string;
  stock?: number; // Stock units available (from Supabase productos.stock)
  variants?: ProductVariant[]; // Diferentes tamaños/presentaciones
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RoutineStep {
  stepNumber: number;
  label: string;
  productId: string;
  alternativeProductIds?: string[];
  note?: string;
  timing?: string;
}

export interface SkincareRoutine {
  id: string;
  number: string; // "01", "02", "03", "04", "05"
  title: string;
  goal: string;
  steps: RoutineStep[];
  instructionType?: 'ORDEN' | 'IMPORTANTE';
  instructionText?: string;
}

export type CategoryId = 'all' | 'hydrate' | 'brighten' | 'calm' | 'protect' | 'cleanse';

export interface CategoryOption {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}

export interface ReviewUser {
  name: string;
  email?: string;
  avatarUrl?: string;
  isVerifiedBuyer?: boolean;
}

export type TipoPiel = 'grasa' | 'seca' | 'mixta' | 'sensible' | 'normal';

export interface ProductReview {
  id: string;
  productId: string;
  rating: number; // 1 to 5
  comment: string;
  author: ReviewUser;
  createdAt: string; // ISO string
  isExample?: boolean; // Identified internally as demo content
  isVerifiedPurchase?: boolean;
  status?: 'approved' | 'pending' | 'hidden';
  isFeatured?: boolean;
  city?: string;
  tipoPiel?: TipoPiel;
  fotos?: string[];
  utilesCount?: number;
  usuarioMarcoUtil?: boolean;
  respuestaAdmin?: string;
  respuestaAdminCreadaEn?: string;
}

export interface AuditLogEntry {
  id: string;
  admin_user_id: string | null;
  accion: string;
  tabla_objetivo: string;
  registro_objetivo: string | null;
  detalle: string | null;
  realizado_en: string;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  device_id?: string;
  user_id?: string;
  created_at: string;
}

export type Language = 'es' | 'pt' | 'en';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
  format: (amount: number) => string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string; // ej: '50ml', '100ml'
  volume?: string; // ej: '30ml', '50ml'
  pack?: string; // ej: 'unidad', 'pack x3'
  price_gs?: number; // precio específico de la variante (opcional)
  sku?: string; // código de barras opcional
}

export interface ProductRatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
