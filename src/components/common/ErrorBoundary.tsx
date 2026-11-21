import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, ShieldAlert, Bug, RotateCcw } from 'lucide-react';
import { recordRuntimeError } from '../../lib/errorGuard';

interface Props {
  children: ReactNode;
  scope?: string;
  fallbackTitle?: { ar: string; en: string };
  fallbackMessage?: { ar: string; en: string };
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const scopeName = this.props.scope || 'AppBoundary';
    const entry = recordRuntimeError(error, `ErrorBoundary:${scopeName}`, {
      componentStack: errorInfo.componentStack?.slice(0, 800),
    });
    this.setState({ error, errorInfo, errorId: entry.id });
  }

  private handleRetrySection = () => {
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (e) {
        recordRuntimeError(e, 'ErrorBoundary.onReset');
      }
    }
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  private handleAutoRepair = () => {
    try {
      // Safely clear potentially corrupted local config keys while preserving user session
      localStorage.removeItem('luxe_active_preset');
      localStorage.removeItem('nadi_store_dynamic_config');
    } catch (e) {
      recordRuntimeError(e, 'ErrorBoundary.clearStorage');
    }
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (e) {
        recordRuntimeError(e, 'ErrorBoundary.onReset');
      }
    }
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
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
          className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="w-full max-w-xl bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl mx-auto flex items-center justify-center border border-rose-500/40">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                {this.props.fallbackTitle
                  ? (isArabic ? this.props.fallbackTitle.ar : this.props.fallbackTitle.en)
                  : (isArabic ? 'صمام الأمان البرمجي: تم رصد استثناء غير متوقع' : 'Safety Shield: Runtime Exception Caught')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {this.props.fallbackMessage
                  ? (isArabic ? this.props.fallbackMessage.ar : this.props.fallbackMessage.en)
                  : (isArabic
                    ? 'منع نظام الحماية المتجر من التوقف أو ظهور الشاشة البيضاء، وتم تسجيل تفاصيل الخطأ بدقة لإصلاحه فوراً.'
                    : 'The safety shield isolated this exception to keep the store running and logged exact diagnostic details.')}
              </p>
            </div>

            {/* Pinpoint Technical Diagnostics */}
            {this.state.error && (
              <div className="text-start bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-rose-300 overflow-x-auto space-y-1.5" dir="ltr">
                <div className="flex items-center justify-between gap-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  <span className="inline-flex items-center gap-1.5">
                    <Bug className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{this.props.scope || 'Runtime Guard'}</span>
                  </span>
                  {this.state.errorId && (
                    <span className="text-slate-500">{this.state.errorId}</span>
                  )}
                </div>
                <p className="font-semibold text-rose-300 break-words">{this.state.error.toString()}</p>
              </div>
            )}

            {/* Recovery Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleRetrySection}
                className="w-full sm:w-auto px-5 h-11 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'إعادة المحاولة فوراً' : 'Try Again'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleAutoRepair}
                className="w-full sm:w-auto px-5 h-11 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'إصلاح تلقائي وإعادة التحميل' : 'Auto-Repair & Reload'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'العودة للواجهة الرئيسية' : 'Return to Store'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
