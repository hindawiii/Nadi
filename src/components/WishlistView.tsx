import React from 'react';
import { 
  Heart, ShoppingBag, ArrowLeft, ArrowRight, Trash2, 
  Sparkles, Check, Star, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';

export const WishlistView: React.FC = () => {
  const { 
    lang, wishlist, toggleWishlist, clearWishlist, 
    addAllWishlistToCart, activeData, convertPrice, 
    addToCart, openProductPDP, navigateTo 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const allProducts = activeData.products;
  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <button 
            onClick={() => navigateTo('store')} 
            className="hover:text-[#5A3E7A] transition-colors font-medium flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#5A3E7A]">
            {lang === 'ar' ? 'المفضلة الفاخرة' : 'Luxury Wishlist'}
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5A3E7A]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'ar' ? 'قائمة المفضلة الفاخرة' : 'My Luxury Wishlist'}
              </h1>
              <span className="px-3 py-1 bg-[#5A3E7A] text-white text-xs font-bold rounded-full">
                {wishlistedProducts.length} {lang === 'ar' ? 'منتجات' : 'items'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {lang === 'ar' 
                ? 'منتجاتك المختارة بعناية، احفظيها أو انقليها مباشرة إلى سلة التسوق لتجربة فريدة.' 
                : 'Your curated personal picks. Save them or move them directly to your shopping bag.'}
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => navigateTo('store')}
                className="px-4 py-2.5 rounded-full border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-bold text-[#5A3E7A] transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</span>
              </button>

              <button
                onClick={clearWishlist}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ar' ? 'تفريغ المفضلة' : 'Clear All'}</span>
              </button>

              <button
                onClick={addAllWishlistToCart}
                className="px-6 py-2.5 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ar' ? 'نقل الكل إلى السلة' : 'Move All to Bag'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {wishlistedProducts.length === 0 ? (
          /* Luxe Empty State */
          <div className="py-16 sm:py-24 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5A3E7A] shadow-inner mb-6">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {lang === 'ar' ? 'قائمة المفضلة فارغة حالياً' : 'Your Wishlist is Empty'}
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {lang === 'ar' 
                ? 'لم تقومي بحفظ أي منتجات حتى الآن. تصفحي تركيباتنا الطبيعية ومجموعاتنا الفاخرة وأضيفي ما يعجبك بضغطة واحدة على رمز القلب.' 
                : 'You have not added any products yet. Explore our natural botanical formulations and luxury sets to curate your routine.'}
            </p>
            <button
              onClick={() => navigateTo('store')}
              className="px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white text-sm font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 min-h-[48px]"
            >
              <span>{lang === 'ar' ? 'استكشاف تشكيلة المتجر' : 'Explore The Collection'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Bestseller suggestions */}
            <div className="mt-16 pt-12 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">
                {lang === 'ar' ? 'منتجات مقترحة لكِ' : 'Curated Recommendations'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {allProducts.slice(0, 2).map((p) => {
                  const price = convertPrice(p.basePriceUSD);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => openProductPDP(p)}
                      className="group cursor-pointer bg-white p-3 rounded-2xl border border-slate-100 hover:shadow-md transition-all text-start"
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name[lang]} 
                        className="w-full h-32 object-cover rounded-xl mb-2 group-hover:scale-102 transition-transform" 
                      />
                      <p className="text-xs font-bold text-slate-900 truncate">{p.name[lang]}</p>
                      <p className="text-xs font-black text-[#5A3E7A] mt-1">{price.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {wishlistedProducts.map((product) => {
              const currentPrice = convertPrice(product.basePriceUSD);
              const origPrice = product.originalPriceUSD ? convertPrice(product.originalPriceUSD) : null;

              return (
                <div 
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative">
                    {/* Product Image */}
                    <div 
                      onClick={() => openProductPDP(product)}
                      className="cursor-pointer overflow-hidden bg-slate-50 aspect-square"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name[lang]} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 end-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>

                    {/* Category Pill */}
                    <div className="absolute top-3 start-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#5A3E7A]/90 text-white backdrop-blur-md">
                        {product.category[lang]}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-slate-800">{product.rating}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>

                      <h3 
                        onClick={() => openProductPDP(product)}
                        className="text-base font-bold text-slate-900 group-hover:text-[#5A3E7A] transition-colors cursor-pointer line-clamp-2"
                      >
                        {product.name[lang]}
                      </h3>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-black text-slate-900">
                          {currentPrice.text}
                        </span>
                        {origPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {origPrice.text}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-3 bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'إضافة إلى السلة' : 'Add to Bag'}</span>
                      </button>

                      <button
                        onClick={() => openProductPDP(product)}
                        className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-[#5A3E7A] transition-colors flex items-center justify-center gap-1 min-h-[36px]"
                      >
                        <span>{lang === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Details'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
