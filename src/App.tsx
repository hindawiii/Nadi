import React, { useEffect, useRef } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Header } from './components/Header';
import { StorefrontView } from './components/StorefrontView';
import { AboutView } from './components/AboutView';
import { PDPView } from './components/PDPView';
import { WishlistView } from './components/WishlistView';
import { CartPageView } from './components/CartPageView';
import { AdminPanel } from './components/AdminPanel';
import { DeveloperPanel } from './components/DeveloperPanel';
import { OrderTrackerView } from './components/OrderTrackerView';
import { LoginPageView } from './components/LoginPageView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Toast } from './components/Toast';
import { hairStylingDevices } from './components/HairDevicesSpotlight';

const AppContent: React.FC = () => {
  const { currentRoute, setCurrentRoute, isDeveloperModeLocked, activeData, openProductPDP } = useCommerce();
  const prevRouteRef = useRef<string>('');

  // Enforce manual scroll restoration so reloading starts at the top of the store
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Listen to both URL pathname and hash changes for universal deep linking (/admin, /developer, /about, /wishlist, /cart, /product/id)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      const pathname = window.location.pathname.replace(/^\//, '');
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
        if (!isDeveloperModeLocked) {
          setCurrentRoute('developer');
        } else {
          setCurrentRoute('store');
        }
      } else if (route === 'about') {
        setCurrentRoute('about');
      } else if (route === 'wishlist') {
        setCurrentRoute('wishlist');
      } else if (route === 'cart') {
        setCurrentRoute('cart');
      } else if (route === 'tracker') {
        setCurrentRoute('tracker');
      } else if (route === 'login' || route === 'auth') {
        setCurrentRoute('login');
      } else {
        // Default everything else to store homepage without resetting scroll during active browsing
        if (prevRouteRef.current && prevRouteRef.current !== 'store' && !window.location.hash.startsWith('#product')) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        setCurrentRoute('store');
      }
      prevRouteRef.current = route || 'store';
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1">
          {currentRoute === 'store' && <StorefrontView />}
          {currentRoute === 'about' && <AboutView />}
          {currentRoute === 'wishlist' && <WishlistView />}
          {currentRoute === 'cart' && <CartPageView />}
          {currentRoute === 'pdp' && <PDPView />}
          {currentRoute === 'admin' && <AdminPanel />}
          {currentRoute === 'developer' && (!isDeveloperModeLocked ? <DeveloperPanel /> : <StorefrontView />)}
          {currentRoute === 'tracker' && <OrderTrackerView />}
          {currentRoute === 'login' && <LoginPageView />}
        </main>
      </div>

      {/* Central Footer for all public-facing pages */}
      {currentRoute !== 'developer' && <Footer />}

      {/* Global Interactive Overlays */}
      <AuthModal />
      <ReviewModal />
      {currentRoute !== 'developer' && <FloatingWhatsApp />}
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
