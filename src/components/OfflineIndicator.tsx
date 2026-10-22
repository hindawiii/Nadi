import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useCommerce } from '../context/CommerceContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { lang } = useCommerce();
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowRestoredNotice(false);
    } else if (wasOffline) {
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <aside 
        aria-label={lang === 'ar' ? 'تنبيه حالة الاتصال' : 'Connectivity alert'}
        className="fixed bottom-4 start-4 sm:start-6 z-50 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-600/95 text-white shadow-xl backdrop-blur-xs border border-amber-400/30 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <WifiOff className="w-4 h-4 shrink-0 text-amber-100" />
          <span>
            {lang === 'ar' 
              ? 'وضع عدم الاتصال — يمكنك تصفح المنتجات المحفوظة' 
              : 'Offline Mode — browsing cached catalogue'}
          </span>
        </div>
      </aside>
    );
  }

  if (showRestoredNotice) {
    return (
      <aside 
        aria-label={lang === 'ar' ? 'تمت استعادة الاتصال' : 'Connection restored'}
        className="fixed bottom-4 start-4 sm:start-6 z-50 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/95 text-white shadow-xl backdrop-blur-xs border border-emerald-400/30 text-xs font-bold">
          <Wifi className="w-4 h-4 shrink-0 text-emerald-100" />
          <span>
            {lang === 'ar' ? 'تمت استعادة الاتصال بالإنترنت' : 'Back Online — sync active'}
          </span>
        </div>
      </aside>
    );
  }

  return null;
};
