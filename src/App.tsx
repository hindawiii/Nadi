import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Header } from './components/Header';
import { MobileNavigationDrawer } from './components/MobileNavigationDrawer';
import { StorefrontView } from './components/StorefrontView';
import { AboutView } from './components/AboutView';
import { PDPView } from './components/PDPView';
import { WishlistView } from './components/WishlistView';
import { CartPageView } from './components/CartPageView';
import { AdminPanel } from './components/AdminPanel';
import { OrderTrackerView } from './components/OrderTrackerView';
import { LoginPageView } from './components/LoginPageView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTopProgress } from './components/common/ScrollToTopProgress';
import { Toast } from './components/Toast';
import { CompareModal } from './components/CompareModal';
import { hairStylingDevices } from './components/HairDevicesSpotlight';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy load heavy admin & developer tools to keep initial customer bundle featherlight for Vercel
const DeveloperPanel = lazy(() => import('./components/DeveloperPanel').then(m => ({ default: m.DeveloperPanel })));

const AppContent: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    isDeveloperModeLocked, 
    activeData, 
    openProductPDP, 
    sectionsControl,
    comparisonList,
    setIsCompareModalOpen,
    lang
  } = useCommerce();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const prevRouteRef = useRef<string>('');
  const hasInitializedRef = useRef<boolean>(false);

  // Enforce manual scroll restoration so reloading starts at the top of the store
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Check if initial URL points explicitly to admin or developer
    const initialHash = (window.location.hash || '').replace('#', '').trim().toLowerCase();
    const initialPath = (window.location.pathname || '').replace(/^\//, '').trim().toLowerCase();
    const targetRoute = initialPath || initialHash;

    if (targetRoute === 'admin') {
      setCurrentRoute('admin');
    } else if (targetRoute === 'developer') {
      setCurrentRoute('developer');
    } else {
      // Clean internal section anchors so refresh never jumps down to products
      if (initialHash === 'products-section' || initialHash === 'categories-section' || initialHash === 'campaign-section') {
        try {
          window.history.replaceState(null, '', window.location.pathname || '/');
          window.location.hash = '';
        } catch (_) {}
      }
      setCurrentRoute('store');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    hasInitializedRef.current = true;
  }, []);

  // Listen to user URL hash/popstate changes for explicit navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = (window.location.hash || '').replace('#', '').trim();
      const pathname = (window.location.pathname || '').replace(/^\//, '').trim();
      const route = pathname || hash;

      // Clean internal section anchors so refresh never jumps down to products
      if (hash === 'products-section' || hash === 'categories-section' || hash === 'campaign-section') {
        try {
          window.history.replaceState(null, '', window.location.pathname || '/');
        } catch (_) {}
        setCurrentRoute('store');
        return;
      }

      if (route.startsWith('product/') || hash.startsWith('product-')) {
        const prodId = route.startsWith('product/') 
          ? route.replace('product/', '') 
          : hash.replace('product-', '');
        
        // Search in both skincare products and hair styling devices
        const allProducts = [...activeData.products, ...hairStylingDevices];
        const target = allProducts.find((p) => p.id === prodId);
        if (target) {
          openProductPDP(target);
          prevRouteRef.current = 'pdp';
          return;
        }
      }

      if (route === 'admin') {
        setCurrentRoute('admin');
      } else if (route === 'developer') {
        setCurrentRoute('developer');
      } else if (route === 'about') {
        setCurrentRoute('about');
      } else if (route === 'wishlist') {
        setCurrentRoute('wishlist');
      } else if (route === 'cart') {
        setCurrentRoute('cart');
      } else if (route === 'tracker') {
        setCurrentRoute('tracker');
      } else if (route === 'login' || route === 'auth') {
        // Only set login if explicitly triggered and app has already completed initial mount
        if (hasInitializedRef.current) {
          setCurrentRoute('login');
        } else {
          setCurrentRoute('store');
        }
      } else {
        // Default everything else to store homepage
        if (prevRouteRef.current && prevRouteRef.current !== 'store' && !window.location.hash.startsWith('#product')) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        setCurrentRoute('store');
      }
      prevRouteRef.current = route || 'store';
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [activeData.products, hairStylingDevices, isDeveloperModeLocked, openProductPDP, setCurrentRoute]);

  const isControlPanelRoute = currentRoute === 'admin' || currentRoute === 'developer';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      <div className="flex-1 flex flex-col">
        {!isControlPanelRoute && <Header onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />}

        <main className="flex-1">
          {currentRoute === 'store' && <StorefrontView />}
          {currentRoute === 'about' && <AboutView />}
          {currentRoute === 'wishlist' && <WishlistView />}
          {currentRoute === 'cart' && <CartPageView />}
          {currentRoute === 'pdp' && <PDPView />}
          {currentRoute === 'admin' && <AdminPanel />}
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
          {currentRoute === 'tracker' && <OrderTrackerView />}
          {currentRoute === 'login' && <LoginPageView />}
        </main>
      </div>

      {/* Central Footer for public-facing store pages */}
      {!isControlPanelRoute && <Footer />}

      {/* Global Mobile Off-Canvas Navigation Drawer (100dvh Root Portal) */}
      <MobileNavigationDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
      />

      {/* Global Interactive Overlays & Controls */}
      <AuthModal />
      <ReviewModal />
      
      {/* Floating Widgets tied dynamically to central sectionsControl - Only on public pages */}
      {!isControlPanelRoute && sectionsControl.floatingWhatsApp && <FloatingWhatsApp />}
      {!isControlPanelRoute && sectionsControl.scrollToTop && <ScrollToTopProgress />}

      {/* Floating Comparison Drawer Trigger Bar (Appears when >= 1 item is compared) */}
      {comparisonList.length > 0 && !isControlPanelRoute && (
        <div className="fixed bottom-20 start-4 z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-full shadow-xl border border-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="w-5 h-5 rounded-full bg-white text-[#5A3E7A] text-xs font-black flex items-center justify-center">
              {comparisonList.length}
            </span>
            <span className="text-xs font-bold">
              {lang === 'ar' ? 'مقارنة المنتجات' : 'Compare Products'}
            </span>
          </button>
        </div>
      )}

      {/* Global Product Comparison Modal */}
      <CompareModal />

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
