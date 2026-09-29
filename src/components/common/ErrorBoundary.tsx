import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: { ar: string; en: string };
  fallbackMessage?: { ar: string; en: string };
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught runtime exception:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleAutoRepair = () => {
    try {
      // Safely clear potentially corrupted local config keys while preserving essential user session
      localStorage.removeItem('luxe_active_preset');
      localStorage.removeItem('nadi_store_dynamic_config');
    } catch (e) {
      console.warn('Could not clear localStorage keys:', e);
    }
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.hash = '';
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.dir === 'rtl' || !document.documentElement.dir;

      return (
        <div 
          className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="w-full max-w-xl bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl mx-auto flex items-center justify-center border border-rose-500/40">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {this.props.fallbackTitle 
                  ? (isArabic ? this.props.fallbackTitle.ar : this.props.fallbackTitle.en)
                  : (isArabic ? 'صمام الأمان البرمجي: تم رصد استثناء غير متوقع' : 'Safety Shield: Runtime Exception Caught')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {this.props.fallbackMessage
                  ? (isArabic ? this.props.fallbackMessage.ar : this.props.fallbackMessage.en)
                  : (isArabic 
                    ? 'منع نظام الحماية المتجر من التوقف أو ظهور الشاشة البيضاء. يمكنك الإصلاح التلقائي واستعادة الإعدادات السليمة بضغطة زر.'
                    : 'The self-healing shield intercepted an error to prevent a blank screen. Click below to auto-repair state and restore stability.')}
              </p>
            </div>

            {/* Error Details for Developer */}
            {this.state.error && (
              <div className="text-start bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-rose-300 overflow-x-auto space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  <Bug className="w-3.5 h-3.5 text-amber-400" />
                  <span>Technical Diagnostics</span>
                </div>
                <p className="font-semibold text-rose-300 break-words">{this.state.error.toString()}</p>
              </div>
            )}

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleAutoRepair}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isArabic ? 'إصلاح تلقائي واستعادة الاستقرار' : 'Auto-Repair & Restore Defaults'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                <span>{isArabic ? 'العودة للواجهة الرئيسية' : 'Return to Storefront'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
