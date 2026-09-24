import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCommerce();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-2.5 text-xs sm:text-sm font-semibold max-w-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
