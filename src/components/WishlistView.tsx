import React from 'react';
import { 
  Heart, ShoppingBag, ArrowLeft, ArrowRight, Trash2, 
  Sparkles, Check, Star, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { ProductCard } from './ProductCard';

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
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
