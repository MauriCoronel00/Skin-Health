import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { useState, useEffect, useMemo, useRef, lazy, Suspense, Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-3xl border border-rose-200 p-8 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Algo salió mal</h2>
            <p className="text-sm text-neutral-600 mb-4">
              La aplicación se encontró con un error inesperado.
            </p>
            {this.state.error && (
              <details className="text-left text-xs text-neutral-500 bg-neutral-50 rounded-xl p-3 mb-4">
                <summary className="font-mono cursor-pointer mb-1">Ver detalle técnico</summary>
                <pre className="whitespace-pre-wrap font-mono">{this.state.error.message}</pre>
                {this.state.error.stack && (
                  <pre className="whitespace-pre-wrap font-mono mt-2">{this.state.error.stack}</pre>
                )}
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#102A43] text-white text-sm font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, SlidersHorizontal, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, CartItem, CategoryId, CategoryOption } from './types';
import { fetchProducts, fetchCategories } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';

import { TestimoniosSection } from './components/TestimoniosSection';
import { FloatingCart } from './components/FloatingCart';
import { Footer } from './components/Footer';
import { OrderDetails } from './components/OrderConfirmationModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ReviewUser } from './types';
import { getSavedGoogleUser } from './utils/reviewsStorage';
import { supabase } from './lib/supabaseClient';
import { useReviews } from './hooks/useReviews';
import { currentReviewer } from './data/identity';
import { isCurrentUserAdmin } from './data/admin';
import { productIdFromUrl, syncProductUrl } from './utils/productLink';
import { setHomeSEO, injectOrganizationSchema } from './utils/seo';
import { MobileBottomNav, TabId } from './components/MobileBottomNav';
import { ProductGridSkeleton, CategoryPillsSkeleton, TestimoniosSectionSkeleton } from './components/Skeleton';
import { CollapsibleRoutines } from './components/CollapsibleRoutines';
import { SKINCARE_ROUTINES } from './data/routines';

// Lazy: solo se cargan cuando se abren (no bloquean primera carga)
const CartDrawer = lazy(() => import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer })));
const ProductQuickView = lazy(() => import('./components/ProductQuickView').then((m) => ({ default: m.ProductQuickView })));
const DiagnosticQuiz = lazy(() => import('./components/DiagnosticQuiz').then((m) => ({ default: m.DiagnosticQuiz })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel })));
const TrackingView = lazy(() => import('./components/TrackingView').then((m) => ({ default: m.TrackingView })));
const OrderConfirmationModal = lazy(() => import('./components/OrderConfirmationModal').then((m) => ({ default: m.OrderConfirmationModal })));
const ReviewFormModal = lazy(() => import('./components/ReviewFormModal').then((m) => ({ default: m.ReviewFormModal })));

const CART_STORAGE_KEY = 'skinhealth_cart_v1';

export default function App() {
  // Productos y categorías ahora vienen de Supabase (antes eran PRODUCTS/CATEGORIES fijos)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  // Mobile bottom navigation tabs state
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // State for collapsible routines
  const [openRoutines, setOpenRoutines] = useState<Set<string>>(new Set());

  // State for diagnostic quiz
  const [quizOpen, setQuizOpen] = useState(false);

  const { user } = useAuth();

  // Handle auth-required event from MobileBottomNav
  useEffect(() => {
    const handler = () => {
      // The LoginButton will handle the auth flow
      // We just need to trigger a re-render or the user will be redirected
      console.log('Auth required for account tab');
    };
    window.addEventListener('auth-required', handler);
    return () => window.removeEventListener('auth-required', handler);
  }, []);

  // SEO: schema de Organizacion + meta tags de homepage (una sola vez al montar)
  useEffect(() => {
    injectOrganizationSchema();
    setHomeSEO();
  }, []);

  const loadCatalog = async () => {
    setIsLoadingProducts(true);
    setCatalogError(false);
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error cargando el catálogo desde Supabase:', err);
      setCatalogError(true);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  // Cart state initialized from localStorage for persistence (Section 15)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore localStorage errors
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSkin, setSelectedSkin] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastAddedTime, setLastAddedTime] = useState<number>(0);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Reviews module: lectura, envío y moderación tras una sola interfaz
  const {
    reviews,
    adminReviews,
    submit: submitReviewHook,
    loadForModeration,
    moderate,
    toggleUtil,
    responder,
  } = useReviews();

  // Current authenticated Google user state
  const [googleUser, setGoogleUser] = useState<ReviewUser | null>(() => getSavedGoogleUser());

  // Review Form Modal target product
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);

  // Admin moderation modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  // Panel admin (pedidos + stock). Solo visible con rol admin.
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  // Reviews visibles para moderación (incluye pending/hidden) + rol admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Detectar rol admin de la sesión (para moderación y panel)
  useEffect(() => {
    const check = async () => {
      try {
        setIsAdmin(await isCurrentUserAdmin());
      } catch {
        setIsAdmin(false);
      }
    };
    void check();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void check();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Deep link ?p=id: abre el QuickView del producto al cargar
  useEffect(() => {
    if (isLoadingProducts || products.length === 0) return;
    const id = productIdFromUrl();
    if (!id) return;
    const found = products.find((p) => p.id === id);
    if (found) setQuickViewProduct(found);
  }, [isLoadingProducts, products]);

  // Refleja el QuickView en la URL para compartir
  useEffect(() => {
    syncProductUrl(quickViewProduct?.id ?? null);
  }, [quickViewProduct]);

  const handleOpenReviewModal = (product: Product) => {
    setReviewingProduct(product);
  };

  const handleCloseReviewModal = () => {
    setReviewingProduct(null);
  };

  const handleSubmitReview = async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    author: ReviewUser;
    city?: string;
    tipoPiel?: import('./types').TipoPiel;
    fotos?: string[];
  }): Promise<{ ok: boolean; message?: string }> => {
    // Identidad unificada: el nombre sale del módulo identity, el user_id de la sesión
    const reviewer = await currentReviewer();
    if (!reviewer?.userId) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      return {
        ok: false,
        message: 'Te redirigimos al login de Google. Volvé a enviar tu reseña al regresar.',
      };
    }

    const result = await submitReviewHook(reviewer, {
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      city: reviewData.city,
      tipoPiel: reviewData.tipoPiel,
      fotos: reviewData.fotos,
    });
    if (result.ok) {
      showToast(
        '¡Reseña enviada!',
        'Quedará visible luego de la moderación. ¡Gracias!',
        'success'
      );
    }
    return result;
  };

  const handleOpenAdminReviews = async () => {
    if (!isAdmin) {
      showToast(
        'Zona de administradores',
        'Iniciá sesión con una cuenta administradora para moderar.',
        'info'
      );
      return;
    }
    try {
      await loadForModeration();
    } catch {
      // el hook ya aplica fallback
    }
    setIsAdminModalOpen(true);
  };

  const handleToggleReviewStatus = async (
    reviewId: string,
    newStatus: 'approved' | 'hidden'
  ) => {
    try {
      await moderate(reviewId, newStatus === 'approved' ? 'approve' : 'hide');
      showToast(
        newStatus === 'hidden' ? 'Reseña oculta' : 'Reseña aprobada',
        undefined,
        'info'
      );
    } catch {
      showToast('No se pudo actualizar', 'Probá de nuevo en unos segundos.', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await moderate(reviewId, 'delete');
      showToast('Reseña eliminada', undefined, 'info');
    } catch {
      showToast('No se pudo eliminar', 'Probá de nuevo en unos segundos.', 'error');
    }
  };

  const handleToggleFeatured = async (reviewId: string) => {
    try {
      await moderate(reviewId, 'feature');
    } catch {
      showToast('No se pudo actualizar', 'Probá de nuevo en unos segundos.', 'error');
    }
  };

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'error' | 'info' = 'info',
    showWhatsAppFallback = false
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type, showWhatsAppFallback }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOrderSuccess = (order: OrderDetails) => {
    setConfirmedOrder(order);
    setIsCartOpen(false);
  };

  const catalogRef = useRef<HTMLDivElement>(null);

  // Vista de seguimiento ?track=CODIGO (se evalúa una vez al cargar)
  const [trackCode] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('track');
    } catch {
      return null;
    }
  });

  const exitTracking = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('track');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Sin historial: no hace nada.
    }
    window.scrollTo({ top: 0 });
    window.location.reload();
  };

  // Persist cart changes to localStorage (Section 15)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // LocalStorage fallback
    }
  }, [cartItems]);

  // Cart calculation totals
  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Map of product ID -> quantity currently in cart
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  // Handle Add to Cart with Section 11 specifications
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Record timestamp to trigger microanimation in FloatingCart
    setLastAddedTime(Date.now());
  };

  const handleAddMultipleToCart = (products: Product[]) => {
    setCartItems((prev) => {
      let updated = [...prev];
      for (const prod of products) {
        const existingIdx = updated.findIndex((item) => item.product.id === prod.id);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + 1,
          };
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      }
      return updated;
    });
    setLastAddedTime(Date.now());
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filtros catálogo: tipo de piel (keywords sobre skin_type; "Todo tipo" coincide
  // con todo) y rango de precio en Gs.
  const SKIN_FILTERS: { id: string; label: string; test: RegExp }[] = [
    { id: 'grasa', label: 'Grasa', test: /grasa|brillo/i },
    { id: 'seca', label: 'Seca', test: /seca|deshidratada/i },
    { id: 'mixta', label: 'Mixta', test: /mixta/i },
    { id: 'sensible', label: 'Sensible', test: /sensible|irritada|agredida|recuperaci/i },
  ];
  const PRICE_FILTERS: { id: string; label: string; test: (price: number) => boolean }[] = [
    { id: 'low', label: 'Hasta Gs. 150.000', test: (p) => p <= 150000 },
    { id: 'mid', label: 'Gs. 150.000 – 250.000', test: (p) => p > 150000 && p <= 250000 },
    { id: 'high', label: 'Más de Gs. 250.000', test: (p) => p > 250000 },
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Skin type filter
      if (selectedSkin !== 'all') {
        const skin = product.skinType ?? '';
        const matcher = SKIN_FILTERS.find((f) => f.id === selectedSkin);
        if (matcher && !/todo tipo/i.test(skin) && !matcher.test.test(skin)) {
          return false;
        }
      }

      // Price range filter
      if (selectedPrice !== 'all') {
        const range = PRICE_FILTERS.find((f) => f.id === selectedPrice);
        if (range && !range.test(product.price ?? 0)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (product.name ?? '').toLowerCase().includes(query);
        const matchesBrand = (product.brand ?? '').toLowerCase().includes(query);
        const matchesSubtitle = (product.subtitle ?? '').toLowerCase().includes(query);
        const matchesIngredients = (product.keyIngredients ?? []).some((ing) =>
          (ing ?? '').toLowerCase().includes(query)
        );
        return (
          matchesName || matchesBrand || matchesSubtitle || matchesIngredients
        );
      }

      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, selectedSkin, selectedPrice]);

  // Product count by category (dynamic: works with any category id from Supabase)
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const product of products) {
      const key = product.category ?? 'all';
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col selection:bg-[#102A43] selection:text-white">
      {/* Top Navbar with logo and desktop cart shortcut */}
      <Navbar
        totalItems={totalItems}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area - Note the extra bottom padding (pb-36 sm:pb-44) to ensure the floating cart NEVER obstructs content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-36 sm:pb-44">
        {trackCode !== null ? (
          <Suspense fallback={<div className="py-20 text-center text-neutral-500 text-sm">Cargando seguimiento…</div>}>
            <TrackingView codigoInicial={trackCode} onVolver={exitTracking} />
          </Suspense>
        ) : (
        <>
        {/* Hero unificado: CTA quiz + marcas oficiales + social proof */}
        <HeroBanner onScrollToCatalog={scrollToCatalog} onOpenQuiz={() => setQuizOpen(true)} />

        {/* Diagnostic Quiz - 4 steps (lazy: solo carga al abrir) */}
        {quizOpen && (
        <Suspense fallback={null}>
        <DiagnosticQuiz
          isOpen={quizOpen}
          onClose={() => setQuizOpen(false)}
          onComplete={(routineId) => {
            setQuizOpen(false);
            console.log('Rutina recomendada:', routineId);

            // Buscar la rutina completa desde SKINCARE_ROUTINES
            const routine = SKINCARE_ROUTINES.find((r) => r.id === routineId);
            if (!routine) {
              console.error('Rutina no encontrada:', routineId);
              return;
            }

            // Mapear cada step.productId al Product real cargado desde Supabase
            const routineProducts: Product[] = [];
            for (const step of routine.steps) {
              const prod = products.find((p) => p.id === step.productId);
              if (prod) routineProducts.push(prod);
              else console.warn(`Producto no encontrado: ${step.productId}`);
            }

            if (routineProducts.length === 0) {
              console.error('Ningún producto de la rutina existe en el catálogo');
              return;
            }

            // Agregar los productos de la rutina al carrito
            handleAddMultipleToCart(routineProducts);

            // Abrir el CartDrawer para que el cliente complete sus datos y confirme
            // Ahí se genera el pedido real con código SH-XXXX vía createPedido() RPC
            setTimeout(() => setIsCartOpen(true), 300);
          }}
        />
        </Suspense>
        )}

        {/* Collapsible Routines List - 5 routines with expand/collapse */}
        <CollapsibleRoutines
          onAddRoutineToCart={handleAddMultipleToCart}
          onQuickView={setQuickViewProduct}
        />

        {/* Catalog Section Header & Brand Filter */}
        <div
          ref={catalogRef}
          className="pt-4 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#102A43]/10"
        >
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43]">
                {selectedCategory === 'all'
                ? 'Catálogo Completo'
                : categories.find((c) => c.id === selectedCategory)?.label || 'Catálogo Completo'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              20 fórmulas esenciales seleccionadas para resultados visibles.
            </p>
          </div>

          {/* Quick brand filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] text-neutral-400 font-medium mr-1 hidden sm:inline">
              Marca:
            </span>
            {['all', 'SKIN1004', 'The Ordinary', 'La Roche-Posay', 'CeraVe'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {brand === 'all' ? 'Todas' : brand}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros: tipo de piel + rango de precio */}
        <div className="flex flex-col gap-2 pb-4 border-b border-[#102A43]/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-neutral-400 font-medium mr-1 shrink-0">
              Piel:
            </span>
            {[{ id: 'all', label: 'Todas' }, ...SKIN_FILTERS].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSkin(f.id)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedSkin === f.id
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-neutral-400 font-medium mr-1 shrink-0">
              Precio:
            </span>
            {[{ id: 'all', label: 'Todos' }, ...PRICE_FILTERS].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedPrice(f.id)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedPrice === f.id
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="mt-6">
          {isLoadingProducts ? (
            <ProductGridSkeleton count={8} />
          ) : catalogError ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-100 p-8">
              <h3 className="font-semibold text-neutral-800 text-lg mb-1">
                No pudimos cargar el catálogo
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-5">
                Revisá tu conexión e intentá de nuevo. Si sigue fallando, escribinos por WhatsApp.
              </p>
              <button
                onClick={() => void loadCatalog()}
                className="px-5 py-2.5 bg-[#102A43] text-white text-xs font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100 p-8">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-neutral-400 mb-3">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-neutral-800 text-lg mb-1">
                No encontramos productos con esos filtros
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-5">
                Intenta buscar con otro término o limpia los filtros para ver los productos disponibles.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                  setSelectedSkin('all');
                  setSelectedPrice('all');
                }}
                className="px-5 py-2.5 bg-[#102A43] text-white text-xs font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            >
              {filteredProducts.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartQuantities[product.id] || 0}
                    onQuickView={setQuickViewProduct}
                  />
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Section based strictly on PDF: Rutinas de Skincare */}


        {/* Testimonios: reseñas aprobadas visibles */}
        {isLoadingProducts ? (
          <TestimoniosSectionSkeleton />
        ) : (
          <TestimoniosSection />
        )}

        {/* Suscripción Premium - Purelis adaptada 55k - azul */}
        <section className="mt-10 bg-[#E0F2FE] border border-[#1e3a5f]/10 rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1e3a5f]">💎 Suscripción Premium</h3>
            <p className="text-sm text-[#1e3a5f]/80 mt-2">Acceso exclusivo para cuidar tu piel sin equivocarte. Asesoría directa con especialista.</p>
            <ul className="mt-4 text-sm text-[#1e3a5f] text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-xs">🔹</span> Rutina 100% personalizada + seguimiento mensual</li>
              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-xs">🔹</span> Asesoría prioritaria 24h por WhatsApp</li>
              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-xs">🔹</span> Acceso anticipado a nuevos ingresos</li>
              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-xs">🔹</span> Envíos Priority a todo el país</li>
            </ul>
            <a href="https://wa.me/595976659748?text=Hola%20Skin%20Health%20quiero%20la%20suscripcion%20Premium%2055.000Gs" target="_blank" className="mt-6 inline-flex px-6 py-3 rounded-full bg-[#1e3a5f] text-white text-sm font-bold hover:bg-[#102A43]">💙 Suscribirme — 55.000 Gs./mes</a>
            <p className="text-[11px] text-[#1e3a5f]/70 mt-2">Cancelás cuando quieras. Atención directa por WhatsApp.</p>
          </div>
        </section>

        {/* Section 19: Principio Fundamental - How it works - hidden on mobile for app feel */}
        <section className="mt-14 bg-white/80 border border-[#102A43]/10 rounded-3xl p-6 sm:p-8 shadow-xs hidden sm:block">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Flujo de Compra Rápido
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#102A43] mt-2 mb-2">
              ¿Cómo realizo mi pedido?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Sin registros lentos ni pasarelas complejas. Cuatro simples pasos:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900">Elegí tus productos</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                    Presioná &quot;+&quot; en cualquier sérum o crema para sumarlo al carrito.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900">Revisá en tu pedido</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                    Tocá el carrito flotante para verificar cantidades y el total estimado.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#102A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900">Datos para el envío</h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                    Completá en el carrito tus datos para coordinar la entrega:
                  </p>
                  <ul className="mt-1.5 space-y-0.5 text-[10px] text-neutral-700 font-medium">
                    <li className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                      <span>Nombre del cliente</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                      <span>Lugar de ubicación para envío</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                      <span>Link de Google Maps</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-neutral-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900">Pedir por WhatsApp</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                    Se abrirá tu chat con la lista completa de productos y todos tus datos listos para confirmar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
        )}
      </main>

      {/* SECTION 10 & 17: CARRITO FLOTANTE (ELEMENTO CENTRAL) */}
      <FloatingCart
        totalItems={totalItems}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        lastAddedTime={lastAddedTime}
      />

      {/* SECTION 12, 13 & 14: CART BOTTOM SHEET (MOBILE) / SIDE CART (DESKTOP) */}
      <AnimatePresence>
        {isCartOpen && (
          <Suspense fallback={null}>
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onOrderSuccess={handleOrderSuccess}
              onShowToast={showToast}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Post-Purchase Order Confirmation Modal */}
      <AnimatePresence>
        {confirmedOrder && (
          <Suspense fallback={null}>
            <OrderConfirmationModal
              isOpen={!!confirmedOrder}
              onClose={() => setConfirmedOrder(null)}
              order={confirmedOrder}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Product Quick View Modal with Reviews */}
      <AnimatePresence>
        {quickViewProduct && (
          <Suspense fallback={null}>
            <ProductQuickView
              product={quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              onAddToCart={handleAddToCart}
              quantityInCart={cartQuantities[quickViewProduct.id] || 0}
              reviews={reviews}
              onOpenReviewModal={handleOpenReviewModal}
              currentUser={googleUser}
              allProducts={filteredProducts}
              currentIndex={filteredProducts.findIndex(p => p.id === quickViewProduct.id)}
              onToggleUtil={toggleUtil}
              onNavigate={(direction) => {
                const idx = filteredProducts.findIndex(p => p.id === quickViewProduct.id);
                const newIdx = direction === 'next' ? idx + 1 : idx - 1;
                if (newIdx >= 0 && newIdx < filteredProducts.length) {
                  setQuickViewProduct(filteredProducts[newIdx]);
                }
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {reviewingProduct && (
          <Suspense fallback={null}>
            <ReviewFormModal
              isOpen={!!reviewingProduct}
              onClose={handleCloseReviewModal}
              product={reviewingProduct}
              currentUser={googleUser}
              onUserAuthenticated={setGoogleUser}
              onSubmitReview={handleSubmitReview}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Admin Panel (pedidos + stock + reseñas) */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <Suspense fallback={null}>
            <AdminPanel
              isOpen={isAdminPanelOpen}
              onClose={() => setIsAdminPanelOpen(false)}
              onShowToast={showToast}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalItems}
        isCartOpen={isCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
      />

        {/* Footer */}
      <Footer
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isAdmin={isAdmin}
      />
    </div>
  </AuthProvider>
</ErrorBoundary>
  );
}
