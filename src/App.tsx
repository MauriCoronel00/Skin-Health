import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, SlidersHorizontal, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, CartItem, CategoryId, CategoryOption } from './types';
import { fetchProducts, fetchCategories } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { RoutinesSection } from './components/RoutinesSection';
import { FloatingCart } from './components/FloatingCart';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickView } from './components/ProductQuickView';
import { Footer } from './components/Footer';
import { OrderConfirmationModal, OrderDetails } from './components/OrderConfirmationModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ProductReview, ReviewUser } from './types';
import { INITIAL_DEMO_REVIEWS, getProductRatingStats } from './data/demoReviews';
import { ReviewFormModal } from './components/ReviewFormModal';
import { AdminReviewsModal } from './components/AdminReviewsModal';
import { getSavedGoogleUser } from './utils/reviewsStorage';

const CART_STORAGE_KEY = 'skinhealth_cart_v1';
const REVIEWS_STORAGE_KEY = 'skinhealth_reviews_v1';

export default function App() {
  // Productos y categorías ahora vienen de Supabase (antes eran PRODUCTS/CATEGORIES fijos)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Error cargando el catálogo desde Supabase:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    })();
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastAddedTime, setLastAddedTime] = useState<number>(0);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Reviews State initialized with DEMO reviews and user saved submissions
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DEMO_REVIEWS;
  });

  // Current authenticated Google user state
  const [googleUser, setGoogleUser] = useState<ReviewUser | null>(() => getSavedGoogleUser());

  // Review Form Modal target product
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);

  // Admin moderation modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Persist reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // fallback
    }
  }, [reviews]);

  const handleOpenReviewModal = (product: Product) => {
    setReviewingProduct(product);
  };

  const handleCloseReviewModal = () => {
    setReviewingProduct(null);
  };

  const handleSubmitReview = (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    author: ReviewUser;
    city?: string;
  }) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      author: reviewData.author,
      createdAt: new Date().toISOString(),
      isExample: false,
      // If the user previously completed an order in this browser session, mark verified purchase
      isVerifiedPurchase: !!confirmedOrder,
      status: 'approved',
      city: reviewData.city || 'Paraguay',
    };

    setReviews((prev) => [newReview, ...prev]);
    showToast('¡Reseña publicada!', 'Tu valoración ha sido compartida con éxito.', 'success');
  };

  const handleToggleReviewStatus = (reviewId: string, newStatus: 'approved' | 'hidden') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );
    showToast(
      newStatus === 'hidden' ? 'Reseña oculta' : 'Reseña aprobada',
      undefined,
      'info'
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Reseña eliminada', undefined, 'info');
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r))
    );
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

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesIngredients = product.keyIngredients.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        return (
          matchesName || matchesBrand || matchesSubtitle || matchesIngredients
        );
      }

      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  // Product count by category
  const productCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: products.length,
      hydrate: 0,
      brighten: 0,
      calm: 0,
      protect: 0,
      cleanse: 0,
    };
    for (const product of products) {
      if (counts[product.category] !== undefined) {
        counts[product.category]++;
      }
    }
    return counts;
  }, [products]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col selection:bg-[#102A43] selection:text-white">
      {/* Top Navbar with logo and desktop cart shortcut */}
      <Navbar
        totalItems={totalItems}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area - Note the extra bottom padding (pb-36 sm:pb-44) to ensure the floating cart NEVER obstructs content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-36 sm:pb-44">
        {/* Editorial Luxury Hero Banner */}
        <HeroBanner onScrollToCatalog={scrollToCatalog} />

        {/* Category Pills (Hydrate, Brighten, Calm, Protect, Cleanse) */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={productCounts}
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
                : categories.find((c) => c.id === selectedCategory)?.label ||
                  'Catálogo'}
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

        {/* Catalog Grid */}
        <div className="mt-6">
          {isLoadingProducts ? (
            <div className="text-center py-16 text-neutral-400 text-sm">
              Cargando catálogo...
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
                }}
                className="px-5 py-2.5 bg-[#102A43] text-white text-xs font-semibold rounded-full hover:bg-[#102A43]/90 transition-colors"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            >
              {filteredProducts.map((product) => {
                const stats = getProductRatingStats(product.id, reviews);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartQuantities[product.id] || 0}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                    ratingAverage={stats.averageRating}
                    reviewsCount={stats.totalReviews}
                  />
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Section based strictly on PDF: Rutinas de Skincare */}
        <RoutinesSection
          onAddToCart={handleAddToCart}
          onAddMultipleToCart={handleAddMultipleToCart}
          onQuickView={setQuickViewProduct}
          cartQuantities={cartQuantities}
        />

        {/* Section 19: Principio Fundamental - How it works explanation */}
        <section className="mt-14 bg-white/80 border border-[#102A43]/10 rounded-3xl p-6 sm:p-8 shadow-xs">
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
        )}
      </AnimatePresence>

      {/* Post-Purchase Order Confirmation Modal */}
      <AnimatePresence>
        {confirmedOrder && (
          <OrderConfirmationModal
            isOpen={!!confirmedOrder}
            onClose={() => setConfirmedOrder(null)}
            order={confirmedOrder}
          />
        )}
      </AnimatePresence>

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Product Quick View Modal with Reviews */}
      <AnimatePresence>
        {quickViewProduct && (
          <ProductQuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            quantityInCart={cartQuantities[quickViewProduct.id] || 0}
            reviews={reviews}
            onOpenReviewModal={handleOpenReviewModal}
            currentUser={googleUser}
          />
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {reviewingProduct && (
          <ReviewFormModal
            isOpen={!!reviewingProduct}
            onClose={handleCloseReviewModal}
            product={reviewingProduct}
            currentUser={googleUser}
            onUserAuthenticated={setGoogleUser}
            onSubmitReview={handleSubmitReview}
          />
        )}
      </AnimatePresence>

      {/* Admin Moderation Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <AdminReviewsModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            reviews={reviews}
            onToggleStatus={handleToggleReviewStatus}
            onDeleteReview={handleDeleteReview}
            onToggleFeatured={handleToggleFeatured}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer onOpenAdminReviews={() => setIsAdminModalOpen(true)} />
    </div>
  );
}
