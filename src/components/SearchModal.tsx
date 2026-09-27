import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Sparkles, Star, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_RECENT_SEARCHES = 'luxe_recent_searches_v1';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { lang, activeData, convertPrice, openProductPDP } = useCommerce();
  const isRtl = lang === 'ar';
  
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT_SEARCHES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Trending search suggestions
  const trendingTags = [
    { ar: 'سيروم فيتامين سي', en: 'Vitamin C Serum' },
    { ar: 'مرطب الهيالورونيك', en: 'Hyaluronic Moisturizer' },
    { ar: 'مجموعة التصفيف الذكية', en: 'Hair Styler' },
    { ar: 'واقي شمس شفاف', en: 'Sunscreen Gel' },
    { ar: 'غسول رغوي عميق', en: 'Deep Foam Cleanser' },
  ];

  // Derive categories dynamically from active products
  const categoriesMap = new Map<string, { name: { ar: string; en: string }; count: number }>();
  activeData.products.forEach(p => {
    const key = p.category.en;
    if (!categoriesMap.has(key)) {
      categoriesMap.set(key, { name: p.category, count: 1 });
    } else {
      categoriesMap.get(key)!.count += 1;
    }
  });
  const categories = Array.from(categoriesMap.values());

  // Auto focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save query to recent searches
  const saveRecentSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY_RECENT_SEARCHES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== term);
      try {
        localStorage.setItem(STORAGE_KEY_RECENT_SEARCHES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY_RECENT_SEARCHES);
    } catch {}
  };

  // Live filter products
  const matchingProducts = query.trim() === '' ? [] : activeData.products.filter(p => {
    const q = query.toLowerCase().trim();
    return (
      p.name.ar.toLowerCase().includes(q) ||
      p.name.en.toLowerCase().includes(q) ||
      p.category.ar.toLowerCase().includes(q) ||
      p.category.en.toLowerCase().includes(q) ||
      p.tabs.description.ar.toLowerCase().includes(q) ||
      p.tabs.description.en.toLowerCase().includes(q)
    );
  });

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.name[lang]);
    onClose();
    openProductPDP(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4">
      {/* Dimmed Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Spotlight Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#5A3E7A] shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matchingProducts.length > 0) {
                handleSelectProduct(matchingProducts[0]);
              }
            }}
            placeholder={lang === 'ar' ? 'ابحثِ عن منتج، ماركة، مكون، أو فئة...' : 'Search products, ingredients, categories...'}
            className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          
          {/* STATE 1: Empty Query - Show Trending & Recent Searches */}
          {query.trim() === '' && (
            <div className="space-y-6">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {lang === 'ar' ? 'عمليات البحث الأخيرة' : 'Recent Searches'}
                    </span>
                    <button
                      onClick={clearAllRecent}
                      className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors"
                    >
                      {lang === 'ar' ? 'مسح الكل' : 'Clear all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <div
                        key={idx}
                        onClick={() => setQuery(term)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#5A3E7A] hover:text-[#5A3E7A] hover:bg-purple-50/50 cursor-pointer transition-all"
                      >
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'ar' ? 'الأكثر بحثاً وشهرة' : 'Trending Now'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(tag[lang])}
                      className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-[#5A3E7A] text-[#5A3E7A] hover:text-white text-xs font-bold border border-purple-100 hover:border-transparent transition-all flex items-center gap-1.5 group"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400 group-hover:text-white transition-colors" />
                      <span>{tag[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Jump */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  {lang === 'ar' ? 'تصفح حسب القسم' : 'Browse Categories'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(cat.name[lang])}
                      className="p-3 rounded-2xl border border-slate-100 hover:border-[#5A3E7A] bg-slate-50/50 hover:bg-purple-50/30 text-start transition-all"
                    >
                      <p className="text-xs font-bold text-slate-800 truncate">{cat.name[lang]}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cat.count} {lang === 'ar' ? 'منتج' : 'items'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Has Query - Show Live Filtered Results */}
          {query.trim() !== '' && (
            <div>
              {matchingProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {lang === 'ar' ? `لا توجد نتائج لـ "${query}"` : `No results found for "${query}"`}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {lang === 'ar' 
                      ? 'تأكدي من صحة الكلمات أو جربي البحث بكلمات عامة مثل (سيروم، كريم، مصفف)'
                      : 'Check for typos or try searching with generic terms like serum, cream, or styler'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {lang === 'ar' ? `تم العثور على (${matchingProducts.length}) منتج` : `Found (${matchingProducts.length}) products`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'ar' ? 'انقري على المنتج لعرض التفاصيل' : 'Click to view product'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {matchingProducts.map((product) => {
                      const price = convertPrice(product.basePriceUSD);
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="flex items-center gap-3.5 p-2.5 sm:p-3 hover:bg-purple-50/60 rounded-2xl cursor-pointer transition-all group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name[lang]}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-[#5A3E7A] uppercase tracking-wider block">
                              {product.category[lang]}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#5A3E7A] transition-colors">
                              {product.name[lang]}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-slate-800">{product.rating}</span>
                              <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                            </div>
                          </div>
                          <div className="text-end shrink-0 ps-2">
                            <span className="text-sm sm:text-base font-extrabold text-[#5A3E7A] block">
                              {price.text}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1 mt-1 group-hover:text-[#5A3E7A] transition-colors">
                              {lang === 'ar' ? 'عرض' : 'View'}
                              {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
