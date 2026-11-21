import React, { useEffect, useLayoutEffect, useRef, useState, Suspense, lazy } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Header } from './components/Header';
import { MobileNavigationDrawer } from './components/MobileNavigationDrawer';
import { StorefrontView } from './components/StorefrontView';
import { Footer } from './components/Footer';
import { FloatingActionDock } from './components/common/FloatingActionDock';
import { Toast } from './components/Toast';
import { hairStylingDevices } from './components/HairDevicesSpotlight';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { safeExecuteAsync } from './lib/errorGuard';

// Reusable dynamic importers so we can both lazy-load routes and prefetch hot chunks during browser idle time
const loadPDPView = () => import('./components/PDPView');
const loadCartPageView = () => import('./components/CartPageView');
const loadWishlistView = () => import('./components/WishlistView');
const loadOrderTrackerView = () => import('./components/OrderTrackerView');
const loadAboutView = () => import('./components/AboutView');
const loadPrivacyPolicyView = () => import('./components/PrivacyPolicyView');
const loadLoginPageView = () => import('./components/LoginPageView');

// Lazy load secondary routes, modals, and admin/developer tools to keep initial storefront load ultra-fast
const AboutView = lazy(() => loadAboutView().then(m => ({ default: m.AboutView })));
const PrivacyPolicyView = lazy(() => loadPrivacyPolicyView().then(m => ({ default: m.PrivacyPolicyView })));
const PDPView = lazy(() => loadPDPView().then(m => ({ default: m.PDPView })));
const WishlistView = lazy(() => loadWishlistView().then(m => ({ default: m.WishlistView })));
const CartPageView = lazy(() => loadCartPageView().then(m => ({ default: m.CartPageView })));
const OrderTrackerView = lazy(() => loadOrderTrackerView().then(m => ({ default: m.OrderTrackerView })));
const LoginPageView = lazy(() => loadLoginPageView().then(m => ({ default: m.LoginPageView })));
const ReviewModal = lazy(() => import('./components/ReviewModal').then(m => ({ default: m.ReviewModal })));
const CompareModal = lazy(() => import('./components/CompareModal').then(m => ({ default: m.CompareModal })));
const DeveloperPanel = lazy(() => import('./components/DeveloperPanel').then(m => ({ default: m.DeveloperPanel })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));

const RouteLoadingFallback: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => (
  <div className="min-h-[55vh] flex flex-col items-center justify-center p-8 gap-3 bg-slate-50 text-slate-700">
    <div className="w-9 h-9 border-3 border-[#5A3E7A] border-t-transparent rounded-full animate-spin" />
    <p className="text-xs sm:text-sm font-semibold text-slate-500">
      {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
    </p>
  </div>
);

const AppContent: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    activeData,
    openProductPDP,
    returnFromPDPToStore,
    getSavedStoreScrollY,
    comparisonList,
    isCompareModalOpen,
    setIsCompareModalOpen,
    isReviewModalOpen,
    lang
  } = useCommerce();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  // Keep-Alive flag: once the storefront mounts, keep it alive in the DOM while browsing sub-pages
  // so returning to store is instantaneous (<16ms), preserves filters/batches, and restores exact scroll pixel
  const [hasMountedStore, setHasMountedStore] = useState<boolean>(currentRoute === 'store');
  const prevRouteRef = useRef<string>(currentRoute);
  const hasInitializedRef = useRef<boolean>(false);
  const isNavigatingRef = useRef<boolean>(false);

  // Stable references to prevent effect thrashing and recursive loops
  const currentRouteRef = useRef(currentRoute);
  currentRouteRef.current = currentRoute;
  const activeProductsRef = useRef(activeData.products);
  activeProductsRef.current = activeData.products;
  const openProductPDPRef = useRef(openProductPDP);
  openProductPDPRef.current = openProductPDP;
  const returnFromPDPToStoreRef = useRef(returnFromPDPToStore);
  returnFromPDPToStoreRef.current = returnFromPDPToStore;
  const setCurrentRouteRef = useRef(setCurrentRoute);
  setCurrentRouteRef.current = setCurrentRoute;
  const getSavedStoreScrollYRef = useRef(getSavedStoreScrollY);
  getSavedStoreScrollYRef.current = getSavedStoreScrollY;

  useEffect(() => {
    if (currentRoute === 'store' && !hasMountedStore) {
      setHasMountedStore(true);
    }
  }, [currentRoute, hasMountedStore]);

  // Synchronous Pre-Paint Scroll Restoration when unhiding Keep-Alive StorefrontView (Zero Drag / Zero Flash)
  useLayoutEffect(() => {
    const previousRoute = prevRouteRef.current;
    if (hasInitializedRef.current && currentRoute === 'store' && previousRoute !== 'store') {
      const targetY = getSavedStoreScrollYRef.current();
      window.scrollTo({ top: targetY, behavior: 'instant' });
    }
    prevRouteRef.current = currentRoute;
  }, [currentRoute]);

  // Quiet background prefetching of hot secondary routes (PDP + Cart) after initial paint settles
  useEffect(() => {
    let cancelled = false;
    const prefetchHotRoutes = () => {
      if (cancelled) return;
      void safeExecuteAsync(async () => {
        await Promise.all([loadPDPView(), loadCartPageView()]);
        return true;
      }, false, 'App.prefetchHotRoutes');
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(prefetchHotRoutes, { timeout: 2000 });
      return () => {
        cancelled = true;
        win.cancelIdleCallback?.(idleId);
      };
    }

    const timerId = window.setTimeout(prefetchHotRoutes, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, []);

  // Enforce manual scroll restoration so reloading starts at the top of the store
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Check initial URL path/hash for direct deep-linking (product pages, admin, developer, tracker, etc.)
    const rawHash = (window.location.hash || '').replace('#', '').trim();
    const rawPath = (window.location.pathname || '').replace(/^\//, '').trim();
    const route = rawPath || rawHash;
    const normalizedRoute = route.toLowerCase();

    if (normalizedRoute === 'admin') {
      setCurrentRoute('admin');
    } else if (normalizedRoute === 'developer') {
      setCurrentRoute('developer');
    } else if (route.startsWith('product/') || rawHash.startsWith('product-')) {
      const prodId = route.startsWith('product/')
        ? route.replace('product/', '')
        : rawHash.replace('product-', '');
      const allProducts = [...activeProductsRef.current, ...hairStylingDevices];
      const target = allProducts.find((p) => p.id === prodId);
      if (target) {
        openProductPDPRef.current(target, false);
        prevRouteRef.current = 'pdp';
      } else {
        setCurrentRoute('store');
      }
    } else if (normalizedRoute === 'about') {
      setCurrentRoute('about');
    } else if (normalizedRoute === 'privacy') {
      setCurrentRoute('privacy');
    } else if (normalizedRoute === 'wishlist') {
      setCurrentRoute('wishlist');
    } else if (normalizedRoute === 'cart') {
      setCurrentRoute('cart');
    } else if (normalizedRoute === 'tracker') {
      setCurrentRoute('tracker');
    } else if (normalizedRoute === 'login' || normalizedRoute === 'auth') {
      setCurrentRoute('login');
    } else {
      // Clean internal section anchors so refresh never jumps down unexpectedly
      if (
        normalizedRoute === 'products-section' ||
        normalizedRoute === 'categories-section' ||
        normalizedRoute === 'campaign-section'
      ) {
        try {
          window.history.replaceState(null, '', window.location.pathname || '/');
        } catch (_) {}
      }
      setCurrentRoute('store');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    hasInitializedRef.current = true;
  }, []);

  // Listen to user URL popstate changes with loop-guard protection
  useEffect(() => {
    const handleLocationChange = () => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      try {
        const hash = (window.location.hash || '').replace('#', '').trim();
        const pathname = (window.location.pathname || '').replace(/^\//, '').trim();
        const route = pathname || hash;

        // Clean internal section anchors
        if (hash === 'products-section' || hash === 'categories-section' || hash === 'campaign-section') {
          try {
            window.history.replaceState(null, '', window.location.pathname || '/');
          } catch (_) {}
          setCurrentRouteRef.current('store');
          return;
        }

        if (route.startsWith('product/') || hash.startsWith('product-')) {
          const prodId = route.startsWith('product/')
            ? route.replace('product/', '')
            : hash.replace('product-', '');

          const allProducts = [...activeProductsRef.current, ...hairStylingDevices];
          const target = allProducts.find((p) => p.id === prodId);
          if (target) {
            // Skip pushing history when already handling a popstate navigation
            openProductPDPRef.current(target, false);
            return;
          }
        }

        if (route === 'admin') {
          setCurrentRouteRef.current('admin');
        } else if (route === 'developer') {
          setCurrentRouteRef.current('developer');
        } else if (route === 'about') {
          setCurrentRouteRef.current('about');
        } else if (route === 'privacy') {
          setCurrentRouteRef.current('privacy');
        } else if (route === 'wishlist') {
          setCurrentRouteRef.current('wishlist');
        } else if (route === 'cart') {
          setCurrentRouteRef.current('cart');
        } else if (route === 'tracker') {
          setCurrentRouteRef.current('tracker');
        } else if (route === 'login' || route === 'auth') {
          if (hasInitializedRef.current) {
            setCurrentRouteRef.current('login');
          } else {
            setCurrentRouteRef.current('store');
          }
        } else {
          // Returning to store cleanly via popstate without mutating history
          returnFromPDPToStoreRef.current(true);
        }
      } finally {
        isNavigatingRef.current = false;
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const isControlPanelRoute = currentRoute === 'admin' || currentRoute === 'developer';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white flex flex-col justify-between overflow-x-clip">
      <div className="flex-1 flex flex-col">
        {!isControlPanelRoute && <Header onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />}

        <main className="flex-1">
          {/* Keep-Alive Storefront: Preserves exact scroll height, filters, loaded batches, and decoded images across route switches */}
          {!isControlPanelRoute && (hasMountedStore || currentRoute === 'store') && (
            <div
              className={currentRoute === 'store' ? 'block' : 'hidden'}
              aria-hidden={currentRoute !== 'store'}
            >
              <ErrorBoundary scope="StorefrontView">
                <StorefrontView />
              </ErrorBoundary>
            </div>
          )}

          {currentRoute === 'about' && (
            <ErrorBoundary key="about" scope="AboutView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <AboutView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'privacy' && (
            <ErrorBoundary key="privacy" scope="PrivacyPolicyView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <PrivacyPolicyView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'wishlist' && (
            <ErrorBoundary key="wishlist" scope="WishlistView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <WishlistView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'cart' && (
            <ErrorBoundary key="cart" scope="CartPageView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <CartPageView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'pdp' && (
            <ErrorBoundary key="pdp" scope="PDPView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <PDPView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'admin' && (
            <ErrorBoundary
              key="admin"
              scope="AdminPanel"
              fallbackTitle={{
                ar: 'لوحة التحكم: تم تفعيل صمام الأمان',
                en: 'Admin Suite: Safety Guard Active'
              }}
            >
              <Suspense fallback={
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4 bg-slate-50 text-slate-800">
                  <div className="w-10 h-10 border-3 border-[#5A3E7A] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-600 font-semibold text-sm">
                    {lang === 'ar' ? 'جاري تحميل لوحة التحكم الفاخرة...' : 'Loading Admin Suite...'}
                  </p>
                </div>
              }>
                <AdminPanel />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'developer' && (
            <ErrorBoundary
              key="developer"
              scope="DeveloperPanel"
              fallbackTitle={{
                ar: 'بوابة المطور البرمجية: تم تفعيل صمام الأمان',
                en: 'Developer Console: Safety Guard Active'
              }}
              fallbackMessage={{
                ar: 'تم حماية شاشة المطور من الانقطاع أو الشاشة البيضاء. يمكنك الضغط على زر الإصلاح التلقائي لإعادة ضبط الذاكرة المؤقتة وتشغيل اللوحة فوراً.',
                en: 'Developer console caught a state discrepancy. Click Auto-Repair to reset corrupted session caches and restore the panel immediately.'
              }}
            >
              <Suspense fallback={
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4 bg-slate-950 text-white">
                  <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-300 font-semibold text-sm">Loading Developer Console...</p>
                </div>
              }>
                <DeveloperPanel />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'tracker' && (
            <ErrorBoundary key="tracker" scope="OrderTrackerView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <OrderTrackerView />
              </Suspense>
            </ErrorBoundary>
          )}
          {currentRoute === 'login' && (
            <ErrorBoundary key="login" scope="LoginPageView">
              <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
                <LoginPageView />
              </Suspense>
            </ErrorBoundary>
          )}
        </main>
      </div>

      {/* Central Footer for public-facing store pages */}
      {!isControlPanelRoute && <Footer />}

      {/* Global Mobile Off-Canvas Navigation Drawer (100dvh Root Portal) */}
      <MobileNavigationDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Global Interactive Overlays & Controls (Mounted lazily only when opened) */}
      {isReviewModalOpen && (
        <ErrorBoundary scope="ReviewModal">
          <Suspense fallback={null}>
            <ReviewModal />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Unified Vertical Magnetic Floating Action Dock (WhatsApp on top + collapsible Scroll-to-Top below) */}
      {!isControlPanelRoute && <FloatingActionDock />}

      {/* Floating Comparison Drawer Trigger Bar (Centered cleanly between corner FABs) */}
      {comparisonList.length > 0 && !isControlPanelRoute && (
        <div className="fixed bottom-4 inset-x-0 mx-auto w-fit z-30 animate-in slide-in-from-bottom duration-300">
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-full shadow-xl border border-white/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap min-h-[44px] cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-white text-[#5A3E7A] text-xs font-black flex items-center justify-center shrink-0">
              {comparisonList.length}
            </span>
            <span className="text-xs font-bold">
              {lang === 'ar' ? 'مقارنة المنتجات' : 'Compare'}
            </span>
          </button>
        </div>
      )}

      {/* Global Product Comparison Modal (Mounted lazily only when opened) */}
      {isCompareModalOpen && (
        <ErrorBoundary scope="CompareModal">
          <Suspense fallback={null}>
            <CompareModal />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* PWA In-App Install Promotion & Offline Connectivity Indicator */}
      {!isControlPanelRoute && <PWAInstallBanner />}
      <OfflineIndicator />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary scope="AppRoot">
      <CommerceProvider>
        <AppContent />
      </CommerceProvider>
    </ErrorBoundary>
  );
}
