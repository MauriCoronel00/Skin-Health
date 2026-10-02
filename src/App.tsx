import { useCart } from './contexts/CartContext';
import { useProducts } from './contexts/ProductContext';
import { getBlogPost } from './data/blog';
import { BlogPostView } from './components/BlogPostView';
import React, { useState, useEffect, useRef, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { InstallBanner } from './components/InstallBanner';
import { TrackingView } from './components/TrackingView';
import { ToastMessage } from './components/Toast';

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

import { Product } from './types';
import { Navbar } from './components/Navbar';
import type { OrderDetails } from './components/OrderConfirmationModal';
import { ReviewUser } from './types';
import { getSavedGoogleUser } from './utils/reviewsStorage';
import { useReviews } from './hooks/useReviews';
import { currentReviewer } from './data/identity';
import { isCurrentUserAdmin } from './data/admin';
import { productIdFromUrl, syncProductUrl } from './utils/productLink';
import { setHomeSEO, injectOrganizationSchema } from './utils/seo';
import { TabId } from './components/MobileBottomNav';

import { HeroSection } from './components/sections/HeroSection';
import { WelcomeSection } from './components/sections/WelcomeSection';
import { QuizSection } from './components/sections/QuizSection';
import { SavedQuizBannerSection } from './components/sections/SavedQuizBannerSection';
import { RoutinesSectionWrapper } from './components/sections/RoutinesSection';
import { CatalogFiltersSection } from './components/sections/CatalogFiltersSection';
import { CatalogSection } from './components/sections/CatalogSection';
import { TestimoniosSectionWrapper } from './components/sections/TestimoniosSectionWrapper';
import { PremiumSection } from './components/sections/PremiumSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { FloatingCartSection } from './components/sections/FloatingCartSection';
import { CartDrawerSection } from './components/sections/CartDrawerSection';
import { OrderConfirmationSection } from './components/sections/OrderConfirmationSection';
import { ToastSection } from './components/sections/ToastSection';
import { ProductQuickViewSection } from './components/sections/ProductQuickViewSection';
import { ReviewFormSection } from './components/sections/ReviewFormSection';
import { AdminPanelSection } from './components/sections/AdminPanelSection';
import { MobileBottomNavSection } from './components/sections/MobileBottomNavSection';
import { FooterSection } from './components/sections/FooterSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [quizOpen, setQuizOpen] = useState(false);
  const [focusRoutineNumber, setFocusRoutineNumber] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [googleUser, setGoogleUser] = useState<ReviewUser | null>(() => getSavedGoogleUser());
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { cartItems, addToCart, addMultipleToCart, updateQuantity, removeItem, clearCart, totalItems, totalAmount, cartQuantities, lastAddedTime } = useCart();
  const { products, categories, isLoadingProducts, catalogError, loadCatalog, selectedCategory, searchQuery, setSearchQuery, selectedBrand, setSelectedBrand, selectedSkin, setSelectedSkin, selectedPrice, setSelectedPrice, filteredProducts, brandOptions, resetFilters } = useProducts();

  const dismissWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem('sh_welcome_seen_v1', '1');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem('sh_welcome_seen_v1') === '1';
    } catch {
      // ignore
    }
    if (seen || quizOpen) return;
    const t = setTimeout(() => setShowWelcome(true), 5000);
    return () => clearTimeout(t);
  }, [quizOpen]);

  useEffect(() => {
    const handler = () => {};
    window.addEventListener('auth-required', handler);
    return () => window.removeEventListener('auth-required', handler);
  }, []);

  useEffect(() => {
    injectOrganizationSchema();
    setHomeSEO();
  }, []);

  const {
    reviews,
    submit: submitReviewHook,
    toggleUtil,
  } = useReviews();

  useEffect(() => {
    const check = async () => {
      try {
        setIsAdmin(await isCurrentUserAdmin());
      } catch {
        setIsAdmin(false);
      }
    };
    void check();
    let listener: { subscription: { unsubscribe: () => void } } | null = null;
    (async () => {
      const { supabase } = await import('./lib/supabaseClient');
      const { data } = supabase.auth.onAuthStateChange(() => {
        void check();
      });
      listener = data;
    })();
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoadingProducts || products.length === 0) return;
    const id = productIdFromUrl();
    if (!id) return;
    const found = products.find((p) => p.id === id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setQuickViewProduct(found);
  }, [isLoadingProducts, products]);

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
    const reviewer = await currentReviewer();
    if (!reviewer?.userId) {
      const { supabase } = await import('./lib/supabaseClient');
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

  const [trackCode] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('track');
    } catch {
      return null;
    }
  });

  const [blogSlug, setBlogSlug] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('blog');
    } catch {
      return null;
    }
  });

  const blogPost = blogSlug ? getBlogPost(blogSlug) : undefined;

  const exitTracking = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('track');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0 });
    window.location.reload();
  };

  const exitBlog = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('blog');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
    setBlogSlug(null);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSavedQuizRetake = () => {
    setQuizOpen(true);
  };

  const handleSavedQuizViewRoutine = (routineId: string) => {
    setFocusRoutineNumber(routineId);
    setTimeout(() => {
      document.getElementById('rutinas')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBlogProductClick = (productId: string) => {
    exitBlog();
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('p', productId);
      window.history.replaceState(null, '', url.toString());
      window.location.reload();
    }, 100);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col selection:bg-[#102A43] selection:text-white">
              <Navbar
                totalItems={totalItems}
                totalAmount={totalAmount}
                onOpenCart={() => setIsCartOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <Suspense fallback={null}>
                <InstallBanner />
              </Suspense>

              <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-36 sm:pb-44">
                {blogPost ? (
                  <BlogPostView post={blogPost} onBack={exitBlog} onProductClick={handleBlogProductClick} />
                ) : trackCode !== null ? (
                  <Suspense fallback={<div className="py-20 text-center text-neutral-500 text-sm">Cargando seguimiento…</div>}>
                    <TrackingView codigoInicial={trackCode} onVolver={exitTracking} />
                  </Suspense>
                ) : (
                <>
                <HeroSection onScrollToCatalog={scrollToCatalog} onOpenQuiz={() => setQuizOpen(true)} />

                <SavedQuizBannerSection
                  onRetakeQuiz={handleSavedQuizRetake}
                  onViewRoutine={handleSavedQuizViewRoutine}
                />

                <WelcomeSection
                  open={showWelcome}
                  onStartQuiz={() => {
                    dismissWelcome();
                    setQuizOpen(true);
                  }}
                  onClose={dismissWelcome}
                />

                <QuizSection
                  isOpen={quizOpen}
                  onClose={() => setQuizOpen(false)}
                  onComplete={(routineId) => {
                    setQuizOpen(false);
                    setFocusRoutineNumber(routineId);
                    setTimeout(() => {
                      document.getElementById('rutinas')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                />

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
                      {products.length} fórmulas esenciales seleccionadas para resultados visibles.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <span className="text-[11px] text-neutral-400 font-medium mr-1 hidden sm:inline">
                      Marca:
                    </span>
                    {brandOptions.map((brand) => (
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

                <CatalogFiltersSection
                  selectedSkin={selectedSkin}
                  setSelectedSkin={setSelectedSkin}
                  selectedPrice={selectedPrice}
                  setSelectedPrice={setSelectedPrice}
                />

                <CatalogSection
                  isLoadingProducts={isLoadingProducts}
                  catalogError={catalogError}
                  filteredProducts={filteredProducts}
                  cartQuantities={cartQuantities}
                  onQuickView={setQuickViewProduct}
                  onAdd={addToCart}
                  loadCatalog={loadCatalog}
                  resetFilters={resetFilters}
                />

                <TestimoniosSectionWrapper isLoadingProducts={isLoadingProducts} />

                <PremiumSection />

                <HowItWorksSection />

                {/* Rutinas como sugerencia debajo del catálogo */}
                <RoutinesSectionWrapper
                  onAddRoutineToCart={addMultipleToCart}
                  onQuickView={setQuickViewProduct}
                  focusNumber={focusRoutineNumber}
                />
                </>
                )}
              </main>

              <FloatingCartSection
                totalItems={totalItems}
                totalAmount={totalAmount}
                onOpenCart={() => setIsCartOpen(true)}
                lastAddedTime={lastAddedTime}
              />

              <CartDrawerSection
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onClearCart={clearCart}
                onOrderSuccess={handleOrderSuccess}
                onShowToast={showToast}
              />

              <OrderConfirmationSection
                confirmedOrder={confirmedOrder}
                onClose={() => setConfirmedOrder(null)}
              />

              <ToastSection toasts={toasts} onDismiss={dismissToast} />

              <ProductQuickViewSection
                quickViewProduct={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onAddToCart={addToCart}
                quantityInCart={cartQuantities[quickViewProduct?.id] || 0}
                reviews={reviews}
                onOpenReviewModal={handleOpenReviewModal}
                currentUser={googleUser}
                allProducts={filteredProducts}
                currentIndex={filteredProducts.findIndex(p => p.id === quickViewProduct?.id)}
                onToggleUtil={toggleUtil}
                onNavigate={(direction) => {
                  const idx = filteredProducts.findIndex(p => p.id === quickViewProduct?.id);
                  const newIdx = direction === 'next' ? idx + 1 : idx - 1;
                  if (newIdx >= 0 && newIdx < filteredProducts.length) {
                    setQuickViewProduct(filteredProducts[newIdx]);
                  }
                }}
              />

              <ReviewFormSection
                reviewingProduct={reviewingProduct}
                onClose={handleCloseReviewModal}
                currentUser={googleUser}
                onUserAuthenticated={setGoogleUser}
                onSubmitReview={handleSubmitReview}
              />

              <AdminPanelSection
                isOpen={isAdminPanelOpen}
                onClose={() => setIsAdminPanelOpen(false)}
                onShowToast={showToast}
              />

              <MobileBottomNavSection
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                cartCount={totalItems}
                isCartOpen={isCartOpen}
                onOpenCart={() => setIsCartOpen(true)}
              />

              <FooterSection
                onOpenAdminPanel={() => {
                  if (isAdmin) setIsAdminPanelOpen(true);
                  else showToast('Zona de administradores', 'Iniciá sesión con una cuenta administradora.', 'info');
                }}
                isAdmin={isAdmin}
              />
            </div>
    </ErrorBoundary>
  );
}