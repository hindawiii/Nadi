import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { purgeLegacyImageCaches } from './lib/imageResilience';
import { installGlobalErrorHandlers } from './lib/errorGuard';

// Capture uncaught runtime errors & unhandled rejections with pinpoint diagnostics
installGlobalErrorHandlers();

// Purge legacy poisoned opaque image caches so previously affected mobile devices recover automatically
void purgeLegacyImageCaches();

// Register service worker for offline caching & PWA capabilities
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
  onOfflineReady() {
    console.info('PWA: Store content cached for offline browsing.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
