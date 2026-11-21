import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
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

// Lazy load secondary routes, modals, and admin/developer tools to keep initial storefront load ultra-fast
const AboutView = lazy(() => import('./components/AboutView').then(m => ({ default: m.AboutView })));
const PrivacyPolicyView = lazy(() => import('./components/PrivacyPolicyView').then(m => ({ default: m.PrivacyPolicyView })));
const PDPView = lazy(() => import('./components/PDPView').then(m => ({ default: m.PDPView })));
const WishlistView = lazy(() => import('./components/WishlistView').then(m => ({ default: m.WishlistView })));
const CartPageView = lazy(() => import('./components/CartPageView').then(m => ({ default: m.CartPageView })));
const OrderTrackerView = lazy(() => import('./components/OrderTrackerView').then(m => ({ default: m.OrderTrackerView })));
const LoginPageView = lazy(() => import('./components/LoginPageView').then(m => ({ default: m.LoginPageView })));
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
    comparisonList,
    isCompareModalOpen,
    setIsCompareModalOpen,
    isReviewModalOpen,
    lang
  } = useCommerce();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const prevRouteRef = useRef<string>('');
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
            prevRouteRef.current = 'pdp';
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
        prevRouteRef.current = route || 'store';
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
          {currentRoute === 'store' && <StorefrontView />}
          {currentRoute === 'about' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <AboutView />
            </Suspense>
          )}
          {currentRoute === 'privacy' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <PrivacyPolicyView />
            </Suspense>
          )}
          {currentRoute === 'wishlist' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <WishlistView />
            </Suspense>
          )}
          {currentRoute === 'cart' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <CartPageView />
            </Suspense>
          )}
          {currentRoute === 'pdp' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <PDPView />
            </Suspense>
          )}
          {currentRoute === 'admin' && (
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
          )}
          {currentRoute === 'developer' && (
            <ErrorBoundary
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
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <OrderTrackerView />
            </Suspense>
          )}
          {currentRoute === 'login' && (
            <Suspense fallback={<RouteLoadingFallback lang={lang} />}>
              <LoginPageView />
            </Suspense>
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
        <Suspense fallback={null}>
          <ReviewModal />
        </Suspense>
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
        <Suspense fallback={null}>
          <CompareModal />
        </Suspense>
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
    <CommerceProvider>
      <AppContent />
    </CommerceProvider>
  );
}
