import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline caching & PWA capabilities
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('PWA: A new version of the store is ready.');
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
