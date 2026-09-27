import React from 'react';
import { 
  X, Star, Trash2, Plus, Sparkles, ArrowLeftRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { StoreCartIcon } from './common/StoreCartIcon';
import { SmartDiscountBadge } from './common/SmartDiscountBadge';

export const CompareModal: React.FC = () => {
  const { 
    lang, 
    comparisonList, 
    removeFromCompare, 
    clearCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen,
    activeData,
    convertPrice,
    addToCart,
    openProductPDP,
    toggleCompare
  } = useCommerce();

  if (!isCompareModalOpen) return null;

  const allProducts = activeData.products;
  const comparedProducts = allProducts.filter(p => comparisonList.includes(p.id));

  // Determine candidate products to suggest for comparison
  const candidateProducts = allProducts.filter(p => !comparisonList.includes(p.id));

  const handleSelectCandidate = (productId: string) => {
    toggleCompare(productId);
  };

  // Clean and exit: Close modal AND clear comparison list so floating button disappears
  const handleCloseAndReset = () => {
    setIsCompareModalOpen(false);
    clearCompare();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 select-none animate-in fade-in duration-200">
      {/* Dimmed Blur Backdrop - Clicking outside closes and clears the comparison */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={handleCloseAndReset}
      />

      {/* Main Fullscreen (Mobile) / Max-Viewport (Desktop) Comparison Window */}
      <div className="relative w-full h-full sm:h-[94vh] sm:max-w-7xl bg-white sm:rounded-3xl shadow-2xl border border-purple-100 overflow-hidden z-10 flex flex-col">
        
        {/* Header Bar */}
        <div className="px-3.5 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A3E7A] animate-pulse shrink-0" />
            <div>
              <h2 className="text-xs sm:text-lg font-black text-slate-900 leading-tight">
                {lang === 'ar' ? 'مقارنة المنتجات والمواصفات' : 'Product & Specs Comparison'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500">
                {lang === 'ar' 
                  ? `مقارنة مباشرة بين (${comparedProducts.length}) منتجات`
                  : `Side-by-side comparison of (${comparedProducts.length}) products`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1"
                title={lang === 'ar' ? 'مسح السجل' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'مسح الكل' : 'Clear all'}</span>
              </button>
            )}

            {/* Close Button: Cleans list and closes modal */}
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="p-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
              title={lang === 'ar' ? 'إغلاق وإلغاء' : 'Close and exit'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6">
          {comparedProducts.length === 0 ? (
            /* Empty State */
            <div className="py-12 sm:py-20 text-center max-w-lg mx-auto px-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-[#5A3E7A] flex items-center justify-center mx-auto mb-4 border border-purple-100">
                <ArrowLeftRight className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {lang === 'ar' ? 'اختاري المنتجات التي ترغبين بمقارنتها' : 'Select products to compare'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                {lang === 'ar' 
                  ? 'انقري على أيقونة المقارنة على المنتجات، أو اختاري من المقترحات أدناه للمقارنة فوراً'
                  : 'Click compare icon on any product or choose suggested items below'}
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-start">
                {allProducts.slice(0, 4).map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => toggleCompare(p.id)}
                    className="p-3 rounded-2xl border border-purple-100 bg-purple-50/40 hover:bg-purple-100/60 flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <img src={p.images[0]} alt={p.name[lang]} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name[lang]}</h4>
                      <span className="text-[11px] font-bold text-[#5A3E7A]">{convertPrice(p.basePriceUSD).text}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-theme-primary text-white shrink-0 shadow-2xs">
                      + {lang === 'ar' ? 'مقارنة' : 'Compare'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Contextual Banner for Single Selection */}
              {comparedProducts.length === 1 && (
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-100/90 to-purple-50 border border-purple-200 flex items-center gap-2.5 shadow-2xs">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A3E7A] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {lang === 'ar' 
                        ? `اخترتِ "${comparedProducts[0].name[lang]}".` 
                        : `Selected "${comparedProducts[0].name[lang]}".`}
                    </p>
                    <p className="text-[10px] sm:text-xs text-purple-900/80">
                      {lang === 'ar'
                        ? 'أضيفي منتجاً ثانياً من المقترحات بالأسفل ليظهرا كرتين جنباً إلى جنب ⬇️'
                        : 'Pick a 2nd product below to compare both side-by-side ⬇️'}
                    </p>
                  </div>
                </div>
              )}

              {/* DUAL-CARD MOBILE GRID (grid-cols-2 on mobile, grid-cols-2/3/4 on larger screens) */}
              <div className={`grid gap-2.5 sm:gap-4 items-stretch ${
                comparedProducts.length === 1 
                  ? 'grid-cols-2 md:grid-cols-2' 
                  : comparedProducts.length === 2 
                    ? 'grid-cols-2' 
                    : comparedProducts.length === 3 
                      ? 'grid-cols-2 md:grid-cols-3' 
                      : 'grid-cols-2 md:grid-cols-4'
              }`}>
                
                {comparedProducts.map((p) => {
                  const price = convertPrice(p.basePriceUSD);
                  const origPrice = p.originalPriceUSD ? convertPrice(p.originalPriceUSD) : null;
                  
                  return (
                    <div 
                      key={p.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-sm p-2.5 sm:p-5 flex flex-col justify-between relative group hover:border-[#5A3E7A] transition-all"
                    >
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 end-2 sm:top-3 sm:end-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors z-10"
                        title={lang === 'ar' ? 'إزالة' : 'Remove'}
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <div className="space-y-2 sm:space-y-3">
                        {/* Image */}
                        <div 
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            openProductPDP(p);
                          }}
                          className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 cursor-pointer relative group-hover:opacity-95 transition-opacity"
                        >
                          <img 
                            src={p.images[0]} 
                            alt={p.name[lang]} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1.5 start-1.5 sm:bottom-2.5 sm:start-2.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-black/60 text-white text-[9px] sm:text-[11px] backdrop-blur-xs font-bold">
                            {lang === 'ar' ? 'التفاصيل' : 'Details'}
                          </span>
                        </div>

                        {/* Title & Category */}
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-[#5A3E7A] uppercase tracking-wider block mb-0.5">
                            {p.category[lang]}
                          </span>
                          <h4 
                            onClick={() => {
                              setIsCompareModalOpen(false);
                              openProductPDP(p);
                            }}
                            className="text-xs sm:text-base font-extrabold text-slate-900 line-clamp-2 hover:text-[#5A3E7A] cursor-pointer transition-colors leading-snug"
                          >
                            {p.name[lang]}
                          </h4>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current shrink-0" />
                          <span className="text-[11px] sm:text-xs font-bold text-slate-800">{p.rating}</span>
                          <span className="text-[9px] sm:text-[11px] text-slate-400">({p.reviewsCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 pt-0.5 pb-1.5 border-b border-slate-100">
                          <span className="text-sm sm:text-xl font-black text-[#5A3E7A]">
                            {price.text}
                          </span>
                          {origPrice && (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              {origPrice.text}
                            </span>
                          )}
                          <SmartDiscountBadge
                            basePriceUSD={p.basePriceUSD}
                            originalPriceUSD={p.originalPriceUSD}
                            manualPercent={p.discountPercentage}
                            lang={lang}
                            size="sm"
                          />
                        </div>

                        {/* Specs & Detailed Breakdown */}
                        <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-slate-700 pt-0.5">
                          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
                            <span className="text-slate-400">{lang === 'ar' ? 'التوفر:' : 'Stock:'}</span>
                            <span className="font-bold text-emerald-600">
                              {p.stock > 0 ? (lang === 'ar' ? 'متوفر فوري' : 'In Stock') : (lang === 'ar' ? 'حجز مسبق' : 'Pre-order')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
                            <span className="text-slate-400">{lang === 'ar' ? 'الجودة:' : 'Quality:'}</span>
                            <span className="font-bold text-slate-900">
                              {lang === 'ar' ? 'طبيعي 100%' : '100% Organic'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-0.5 border-b border-slate-50">
                            <span className="text-slate-400">{lang === 'ar' ? 'التوصيل:' : 'Delivery:'}</span>
                            <span className="font-bold text-slate-900">
                              {lang === 'ar' ? '24 - 48 س' : '24-48h'}
                            </span>
                          </div>

                          {/* Highlights */}
                          <div className="pt-1">
                            <span className="text-slate-400 block mb-0.5 text-[9px] sm:text-[11px] font-bold">
                              {lang === 'ar' ? 'التركيبة والفوائد:' : 'Key Benefits:'}
                            </span>
                            <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed bg-purple-50/50 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-purple-100/60 line-clamp-3">
                              {p.tabs.description[lang]}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Add to Bag CTA */}
                      <button
                        type="button"
                        onClick={() => addToCart(p)}
                        className="mt-3 sm:mt-5 w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md min-h-[40px] sm:min-h-[46px]"
                      >
                        <StoreCartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                        <span className="truncate">{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
                      </button>
                    </div>
                  );
                })}

                {/* If exactly 1 product is selected, display an inviting second card slot beside it */}
                {comparedProducts.length === 1 && (
                  <div className="border-2 border-dashed border-purple-200 rounded-2xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center justify-center text-center bg-purple-50/20">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white shadow-xs border border-purple-200 flex items-center justify-center mb-2 sm:mb-4 text-[#5A3E7A]">
                      <Plus className="w-5 h-5 sm:w-8 sm:h-8" />
                    </div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 mb-1 leading-snug">
                      {lang === 'ar' ? 'أضيفي منتجاً ثانياً' : 'Add 2nd product'}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs mb-3 hidden sm:block">
                      {lang === 'ar' 
                        ? 'اختاري أي منتج من البدائل المقترحة بالأسفل وسيقوم النظام بمقارنتهما تلقائياً جنباً إلى جنب' 
                        : 'Pick from suggested products below to compare side-by-side'}
                    </p>
                    <p className="text-[10px] text-purple-700 font-bold sm:hidden">
                      {lang === 'ar' ? 'اختاري من المقترحات أدناه ⬇️' : 'Choose below ⬇️'}
                    </p>
                  </div>
                )}

              </div>

              {/* CANDIDATE SELECTOR DRAWER (Inline suggestions at the bottom) */}
              {candidateProducts.length > 0 && (
                <div className="pt-3 sm:pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A3E7A]" />
                      <span>{lang === 'ar' ? 'منتجات مقترحة للمقارنة الفورية:' : 'Suggested to Compare:'}</span>
                    </h4>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">
                      {lang === 'ar' ? 'انقري للإضافة والمقارنة' : 'Click to add'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {candidateProducts.slice(0, 4).map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => handleSelectCandidate(cand.id)}
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#5A3E7A] bg-slate-50/70 hover:bg-white flex items-center gap-2 sm:gap-3 cursor-pointer transition-all hover:shadow-xs group"
                      >
                        <img 
                          src={cand.images[0]} 
                          alt={cand.name[lang]} 
                          className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0" 
                        />
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate group-hover:text-[#5A3E7A] transition-colors">
                            {cand.name[lang]}
                          </p>
                          <span className="text-[10px] sm:text-[11px] font-bold text-[#5A3E7A]">
                            {convertPrice(cand.basePriceUSD).text}
                          </span>
                        </div>
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-100 text-[#5A3E7A] flex items-center justify-center shrink-0 group-hover:bg-[#5A3E7A] group-hover:text-white transition-colors">
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
