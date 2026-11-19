import React from 'react';
import { 
  Heart, ShoppingBag, ArrowLeft, ArrowRight, Trash2, 
  Check, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { ProductCard } from './ProductCard';
import { hairStylingDevices } from './HairDevicesSpotlight';

export const WishlistView: React.FC = () => {
  const { 
    lang, wishlist, toggleWishlist, clearWishlist, 
    addAllWishlistToCart, activeData, activePresetId, convertPrice, 
    addToCart, openProductPDP, navigateTo 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const allProducts = activePresetId === 'cosmetics'
    ? [...activeData.products, ...hairStylingDevices]
    : activeData.products;
  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs transition-all min-h-[44px] cursor-pointer active:scale-95"
          >
            {isRtl ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
            <span className="whitespace-nowrap">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <span className="text-xs font-bold text-[#5A3E7A]">
            {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
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
                {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
              </h1>
              <span className="px-3 py-1 bg-[#5A3E7A] text-white text-xs font-bold rounded-full">
                {wishlistedProducts.length} {lang === 'ar' ? 'منتجات' : 'items'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {lang === 'ar' 
                ? 'منتجاتكِ المحفوظة للعودة إليها أو نقلها للسلة بضغطة واحدة.' 
                : 'Your saved picks, ready to revisit or move to your bag in one tap.'}
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={clearWishlist}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ar' ? 'تفريغ المفضلة' : 'Clear All'}</span>
              </button>

              <button
                onClick={addAllWishlistToCart}
                className="px-6 py-2.5 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
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
              {lang === 'ar' ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {lang === 'ar' 
                ? 'احفظي المنتجات التي تعجبكِ بالضغط على رمز القلب للرجوع إليها بسهولة.' 
                : 'Tap the heart icon on any product to save it here for later.'}
            </p>
            <button
              onClick={() => navigateTo('store')}
              className="px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white text-sm font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 min-h-[48px] cursor-pointer"
            >
              <span>{lang === 'ar' ? 'تصفح المتجر' : 'Browse Store'}</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 pt-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
