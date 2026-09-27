import React, { useState } from 'react';
import { X, Check, Star, ArrowRight, ArrowLeft, Plus, Droplets, Sparkles, Shield, Eye } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { StoreCartIcon } from './common/StoreCartIcon';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductA?: Product | null;
  initialProductB?: Product | null;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  initialProductA,
  initialProductB,
}) => {
  const { lang, activeData, convertPrice, addToCart, openProductPDP } = useCommerce();
  const isRtl = lang === 'ar';
  const products = activeData.products;

  const [productAId, setProductAId] = useState<string>(initialProductA?.id || products[0]?.id || 'sb-01');
  const [productBId, setProductBId] = useState<string>(
    initialProductB?.id || products[1]?.id || products[0]?.id || 'sb-02'
  );

  if (!isOpen) return null;

  const productA = products.find((p) => p.id === productAId) || products[0];
  const productB = products.find((p) => p.id === productBId) || products[1] || products[0];

  const priceA = convertPrice(productA.basePriceUSD);
  const priceB = convertPrice(productB.basePriceUSD);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#5A3E7A]">
              <Sparkles className="w-5 h-5 text-[#5A3E7A]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {lang === 'ar' ? 'مصفوفة المقارنة المزدوجة الفاخرة' : 'Side-by-Side Product Comparison'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'قارني بين المكونات، الفوائد، والأسعار لاختيار الأنسب لبشرتك' : 'Compare active ingredients, benefits, and price points.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {/* 1. Header Selectors & Product Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 pb-6">
            {/* Product A Column */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'ar' ? 'المنتج الأول' : 'Product 1'}
              </label>
              <select
                value={productAId}
                onChange={(e) => setProductAId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[lang]}
                  </option>
                ))}
              </select>

              <img
                src={productA.images[0]}
                alt={productA.name[lang]}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm bg-white mb-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  onClose();
                  openProductPDP(productA);
                }}
              />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
                {productA.name[lang]}
              </h4>
              <span className="text-sm sm:text-base font-black text-[#5A3E7A] mt-1">
                {priceA.text}
              </span>
              <button
                type="button"
                onClick={() => addToCart(productA, 1)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <StoreCartIcon size="sm" className="text-white" />
                <span>{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Product B Column */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'ar' ? 'المنتج الثاني' : 'Product 2'}
              </label>
              <select
                value={productBId}
                onChange={(e) => setProductBId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[lang]}
                  </option>
                ))}
              </select>

              <img
                src={productB.images[0]}
                alt={productB.name[lang]}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm bg-white mb-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  onClose();
                  openProductPDP(productB);
                }}
              />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
                {productB.name[lang]}
              </h4>
              <span className="text-sm sm:text-base font-black text-[#5A3E7A] mt-1">
                {priceB.text}
              </span>
              <button
                type="button"
                onClick={() => addToCart(productB, 1)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <StoreCartIcon size="sm" className="text-white" />
                <span>{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>

          {/* 2. Rating & Customer Satisfaction */}
          <div className="py-4">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center mb-3">
              {lang === 'ar' ? 'التقييم ومراجعات العملاء' : 'Customer Rating'}
            </h5>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-900">{productA.rating}</span>
                <span className="text-xs text-slate-400">({productA.reviewsCount})</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-900">{productB.rating}</span>
                <span className="text-xs text-slate-400">({productB.reviewsCount})</span>
              </div>
            </div>
          </div>

          {/* 3. Key Ingredients */}
          <div className="py-4">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center mb-3">
              {lang === 'ar' ? 'المكونات الفعالة الأساسية' : 'Key Active Ingredients'}
            </h5>
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700 leading-relaxed text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                {productA.tabs.ingredientsOrSpecs?.[lang] || (lang === 'ar' ? 'مستخلصات نباتية طبيعية نقية 100%' : '100% Pure Botanical Extracts')}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                {productB.tabs.ingredientsOrSpecs?.[lang] || (lang === 'ar' ? 'مستخلصات نباتية طبيعية نقية 100%' : '100% Pure Botanical Extracts')}
              </div>
            </div>
          </div>

          {/* 4. Purpose / How it works */}
          <div className="py-4">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center mb-3">
              {lang === 'ar' ? 'الهدف والفاعلية العلاجية' : 'Target Benefits'}
            </h5>
            <div className="grid grid-cols-2 gap-4 text-xs font-normal text-slate-600 leading-relaxed text-center">
              <p className="bg-purple-50/30 p-3 rounded-xl border border-purple-100/50">
                {productA.tabs.description[lang]}
              </p>
              <p className="bg-amber-50/30 p-3 rounded-xl border border-amber-100/50">
                {productB.tabs.description[lang]}
              </p>
            </div>
          </div>

          {/* 5. How to use / Routine */}
          <div className="py-4">
            <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center mb-3">
              {lang === 'ar' ? 'طريقة الاستخدام والتطبيق' : 'How to Use'}
            </h5>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                {productA.tabs.usage[lang]}
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                {productB.tabs.usage[lang]}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{lang === 'ar' ? 'منتجات طبيعية أصلية 100% معتمدة' : '100% Certified Authentic Natural Skincare'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
