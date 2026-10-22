import React, { useState } from 'react';
import { 
  GripVertical, ArrowUp, ArrowDown, 
  RotateCcw, Sparkles, Layers, RefreshCw, Shield, 
  Droplets, ShoppingBag, Flame, Star, SplitSquareVertical,
  CheckCircle2, ExternalLink
} from 'lucide-react';
import { useCommerce, SectionId } from '../../context/CommerceContext';

interface SectionMeta {
  id: SectionId;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  tag: { ar: string; en: string };
  color: string;
}

export const sectionsMetadata: Record<SectionId, SectionMeta> = {
  hero: {
    id: 'hero',
    title: { ar: 'البنر الرئيسي للهيرو', en: 'Hero Section' },
    desc: { ar: 'العنوان البارز، الشعار الترويجي، صورة الواجهة، وأزرار توجيه العميل.', en: 'Headline, slogan badge, main visuals & CTA buttons.' },
    icon: Sparkles,
    tag: { ar: 'واجهة رئيسية', en: 'Main Hero' },
    color: 'from-purple-500 to-indigo-600'
  },
  brandTicker: {
    id: 'brandTicker',
    title: { ar: 'شريط الماركات المتحرك', en: 'Brand & Slogan Ticker' },
    desc: { ar: 'شريط لامتناهي متحرك يعرض هوية المتجر والماركات المعتمدة.', en: 'Smooth infinite marquee showcasing brand credentials.' },
    icon: RefreshCw,
    tag: { ar: 'هوية وثقة', en: 'Branding' },
    color: 'from-blue-500 to-cyan-600'
  },
  valueProps: {
    id: 'valueProps',
    title: { ar: 'شريط الضمانات والمزايا', en: 'Value Propositions Strip' },
    desc: { ar: 'الضمانات الأربعة: نتائج فعالة، شحن سريع، أصلية 100%، ودفع آمن.', en: '4 trust pillars: results, fast shipping, 100% genuine, COD.' },
    icon: Shield,
    tag: { ar: 'ضمانات', en: 'Trust' },
    color: 'from-emerald-500 to-teal-600'
  },
  routineDiagnosis: {
    id: 'routineDiagnosis',
    title: { ar: 'تشخيص البشرة الذكي', en: 'Smart Skin Routine Guide' },
    desc: { ar: 'بطاقات التصفية التفاعلية الأربعة لاختيار الروتين الملائم للبشرة.', en: 'Interactive solution cards filtering products by tailored needs.' },
    icon: Droplets,
    tag: { ar: 'دليل تفاعلي', en: 'Quiz' },
    color: 'from-sky-500 to-blue-600'
  },
  hairDevices: {
    id: 'hairDevices',
    title: { ar: 'قسم أجهزة تصفيف الشعر', en: 'Hair Styling Devices' },
    desc: { ar: 'عرض بطاقات تقنية احترافية لأجهزة ومصففات الشعر المتطورة.', en: 'Curated technical spotlight on hair stylers & electronics.' },
    icon: Flame,
    tag: { ar: 'أجهزة خاصة', en: 'Spotlight' },
    color: 'from-amber-500 to-orange-600'
  },
  productsCatalog: {
    id: 'productsCatalog',
    title: { ar: 'كتالوج المنتجات وفلاتر التصنيف', en: 'Products Catalog Grid' },
    desc: { ar: 'شبكة المنتجات الرئيسية مع فلاتر التصنيف وشارات الخصم وأزرار الشراء.', en: 'Dynamic products catalog with live sorting, filter pills & buy buttons.' },
    icon: ShoppingBag,
    tag: { ar: 'القلب التجاري', en: 'Core Store' },
    color: 'from-rose-500 to-purple-600'
  },
  promoBanner: {
    id: 'promoBanner',
    title: { ar: 'البنر الترويجي والعرض الماسي', en: 'Promo Banner & Diamond Offer' },
    desc: { ar: 'العرض الحصري، بطاقات الهدايا المجانية، ومجمع البكج المتكامل.', en: 'Exclusive campaign, complimentary velvet gifts & package offer.' },
    icon: Sparkles,
    tag: { ar: 'عرض حصري', en: 'Campaign' },
    color: 'from-fuchsia-500 to-pink-600'
  },
  beforeAfter: {
    id: 'beforeAfter',
    title: { ar: 'سلايدر المقارنة (قبل وبعد)', en: 'Before & After Slider' },
    desc: { ar: 'شريحة مقارنة تفاعلية تبرز النتائج الواقعية للمنتجات على البشرة.', en: 'Interactive comparison slider showing real visible skin results.' },
    icon: SplitSquareVertical,
    tag: { ar: 'إثبات نتائج', en: 'Visual Proof' },
    color: 'from-violet-500 to-purple-700'
  },
  testimonials: {
    id: 'testimonials',
    title: { ar: 'آراء وتقييمات العميلات', en: 'Verified Reviews & Testimonials' },
    desc: { ar: 'عرض آراء العميلات الحقيقية، النجوم، وتجارب الشراء المؤكدة.', en: 'Real verified reviews, buyer ratings, and experience testimonials.' },
    icon: Star,
    tag: { ar: 'تجارب حقيقية', en: 'Social Proof' },
    color: 'from-amber-400 to-amber-600'
  }
};

export const SectionsLayoutReorder: React.FC<{
  onClose?: () => void;
  showStorefrontLink?: boolean;
}> = ({ onClose, showStorefrontLink = true }) => {
  const { 
    lang, sectionsControl, toggleSection,
    sectionsOrder, reorderSections, moveSectionUp, 
    moveSectionDown, resetSectionsOrder, navigateTo 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [draggedId, setDraggedId] = useState<SectionId | null>(null);
  const [dragOverId, setDragOverId] = useState<SectionId | null>(null);

  const handleDragStart = (id: SectionId) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: SectionId) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (targetId: SectionId) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const currentOrder = [...sectionsOrder];
    const fromIndex = currentOrder.indexOf(draggedId);
    const toIndex = currentOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, draggedId);
      reorderSections(currentOrder);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-[#5A3E7A]">
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سحب وترتيب أقسام المتجر (Live Drag & Drop)' : 'Sections Layout & Reorder'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {lang === 'ar' ? 'تخصيص ترتيب أقسام الصفحة الرئيسية' : 'Customize Storefront Sections Layout'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            {lang === 'ar' 
              ? 'يمكنك سحب وإفلات أي قسم لتغيير مكانه، أو استخدام أسهم التقديم والتأخير (⬆️ / ⬇️)، كما يمكنك تفعيل أو إخفاء أي قسم بنقرة واحدة.'
              : 'Drag & drop sections or use arrow buttons to arrange storefront order. Toggle visibility instantly.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={resetSectionsOrder}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            title={lang === 'ar' ? 'استعادة الترتيب الافتراضي للمتجر' : 'Reset to factory default layout'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'ar' ? 'استعادة الترتيب الافتراضي ↺' : 'Reset Order ↺'}</span>
          </button>

          {showStorefrontLink && (
            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="px-4 py-2.5 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <span>{lang === 'ar' ? 'معاينة المتجر الحي' : 'View Storefront'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </button>
          )}
        </div>
      </div>

      {/* Sections List with Drag & Drop and Arrows */}
      <div className="space-y-3">
        {sectionsOrder.map((secId, index) => {
          const meta = sectionsMetadata[secId];
          if (!meta) return null;
          const Icon = meta.icon;
          const isVisible = sectionsControl[secId];
          const isDragging = draggedId === secId;
          const isOver = dragOverId === secId;

          return (
            <div
              key={secId}
              draggable
              onDragStart={() => handleDragStart(secId)}
              onDragOver={(e) => handleDragOver(e, secId)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(secId)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDragging 
                  ? 'opacity-40 scale-95 border-purple-400 border-dashed bg-purple-50/50' 
                  : isOver
                  ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 scale-[1.01]'
                  : isVisible
                  ? 'bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-sm'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              {/* Left Side: Drag Handle, Number, Icon & Description */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Drag Handle */}
                <div 
                  className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-purple-700 hover:bg-slate-100 rounded-lg shrink-0 transition-colors"
                  title={lang === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
                >
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Position Index Badge */}
                <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {index + 1}
                </span>

                {/* Section Icon with subtle tint */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Section Text & Tag */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {meta.title[lang]}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {meta.tag[lang]}
                    </span>
                    {!isVisible && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {lang === 'ar' ? 'مخفي حالياً' : 'Hidden'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {meta.desc[lang]}
                  </p>
                </div>
              </div>

              {/* Right Side: Reorder Arrows & Visibility Toggle */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                {/* 1-Click Move Up Button */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSectionUp(secId)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    index === 0 
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50' 
                      : 'border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 active:scale-95'
                  }`}
                  title={lang === 'ar' ? 'تقديم للأعلى' : 'Move Up'}
                  aria-label={lang === 'ar' ? 'تقديم للأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* 1-Click Move Down Button */}
                <button
                  type="button"
                  disabled={index === sectionsOrder.length - 1}
                  onClick={() => moveSectionDown(secId)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    index === sectionsOrder.length - 1 
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50' 
                      : 'border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 active:scale-95'
                  }`}
                  title={lang === 'ar' ? 'تأخير للأسفل' : 'Move Down'}
                  aria-label={lang === 'ar' ? 'تأخير للأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleSection(secId)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isVisible
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                  }`}
                  title={isVisible ? (lang === 'ar' ? 'إخفاء القسم' : 'Hide Section') : (lang === 'ar' ? 'إظهار القسم' : 'Show Section')}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isVisible ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-rose-400'}`} />
                  <span className="hidden sm:inline">
                    {isVisible ? (lang === 'ar' ? 'مفعّل بالمتجر' : 'Active') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
