import React from 'react';
import {
  ArrowUp,
  BadgeCheck,
  Crown,
  Droplets,
  Eye,
  Flower2,
  Glasses,
  Image,
  Layers,
  MessageCircle,
  RefreshCw,
  Shield,
  Shirt,
  ShoppingBag,
  Watch,
} from 'lucide-react';
import { SectionVisibilityMap } from '../../context/CommerceContext';

export type DevPresetId = 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';

export type DevTabKey =
  | DevPresetId
  | 'golden'
  | 'templates'
  | 'security'
  | 'colors'
  | 'typography'
  | 'sections'
  | 'content';

export interface DevConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'danger' | 'warning';
  onConfirm: () => void;
}

export interface DevPresetMeta {
  id: DevPresetId;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradientBg: string;
}

export interface DevSectionMeta {
  key: keyof SectionVisibilityMap;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  tag: { ar: string; en: string };
  locationHint: { ar: string; en: string };
  previewImage: string;
}

export const devPresetsList: DevPresetMeta[] = [
  {
    id: 'cosmetics',
    name: { ar: 'متجر التجميل والعناية (NADI / So Beauty)', en: 'Cosmetics & Skincare (NADI)' },
    desc: { ar: 'تنسيق ناعم، ألوان باستيل لافندر، قسم للبشرة ومقارنة قبل وبعد.', en: 'Pastel lavender, dewy aesthetics, skin routine picker, before/after proof.' },
    icon: Flower2,
    color: 'from-purple-500 to-pink-500',
    gradientBg: 'from-purple-950/80 via-pink-950/40 to-slate-950 border-purple-500/30',
  },
  {
    id: 'fashion',
    name: { ar: 'متجر أزياء وملابس (Elegance Studio)', en: 'High Fashion & Apparel (Elegance)' },
    desc: { ar: 'تصميم أنيق داكن، شبكة صور عريضة، وبكجات تسوق الإطلالة.', en: 'Editorial minimalism, Italian tailoring, Shop The Look bundle.' },
    icon: Shirt,
    color: 'from-neutral-700 to-stone-900',
    gradientBg: 'from-neutral-900 via-stone-900 to-slate-950 border-neutral-700/50',
  },
  {
    id: 'eyewear',
    name: { ar: 'متجر نظارات وبصريات (Vision Optics)', en: 'Optics & Eyewear (Vision)' },
    desc: { ar: 'حواف رقيقة، تفاصيل أبعاد الإطار، ومحاكي كاميرا الواقع المعزز AR.', en: 'Bespoke titanium frames with live virtual AR try-on camera.' },
    icon: Glasses,
    color: 'from-cyan-600 to-slate-900',
    gradientBg: 'from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-500/30',
  },
  {
    id: 'electronics',
    name: { ar: 'متجر أجهزة وإلكترونيات (TechZone Matrix)', en: 'Gadgets & Electronics (TechZone)' },
    desc: { ar: 'ثيم تكنولوجي حديث، جدول مواصفات متقدم، وتنبيهات الحجز المسبق.', en: 'High-tech matrix, tech specs accordion, zero-stock WhatsApp override.' },
    icon: Watch,
    color: 'from-blue-600 to-indigo-800',
    gradientBg: 'from-blue-950/80 via-indigo-950/40 to-slate-950 border-blue-500/30',
  },
];

export const devSectionsList: DevSectionMeta[] = [
  {
    key: 'hero',
    title: { ar: 'البنر الرئيسي للهيرو', en: 'Hero Section' },
    desc: { ar: 'العنوان البارز، الشعار الترويجي، وأزرار توجيه العميل المباشرة.', en: 'Primary headline, slogan badge, and main call-to-action buttons.' },
    icon: Crown,
    tag: { ar: 'رئيسي', en: 'Core' },
    locationHint: { ar: 'أعلى الصفحة الرئيسية (قمة المتجر)', en: 'Top of Storefront (Above the Fold)' },
    previewImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'brandTicker',
    title: { ar: 'شريط الماركات المتحرك', en: 'Brand & Slogan Ticker' },
    desc: { ar: 'شريط لامتناهي متحرك يعرض هوية المتجر والماركات المعتمدة.', en: 'Smooth infinite loop showcasing brand credentials & marquee slogans.' },
    icon: RefreshCw,
    tag: { ar: 'هوية', en: 'Branding' },
    locationHint: { ar: 'أسفل بنر الهيرو مباشرة (شريط متحرك)', en: 'Directly below hero (Marquee strip)' },
    previewImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'valueProps',
    title: { ar: 'شريط المزايا والقيمة', en: 'Value Propositions Strip' },
    desc: { ar: 'شريط الضمانات الأربعة: نتائج فعالة، شحن سريع، أصلية 100%، دفع آمن.', en: '4-pillar trust badges: Proven Results, Fast Shipping, 100% Original, Secure COD.' },
    icon: Shield,
    tag: { ar: 'ثقة', en: 'Trust' },
    locationHint: { ar: 'شريط الضمانات والمزايا الأربعة للمصداقية', en: 'Trust & 4-Pillars Guarantee Strip' },
    previewImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'routineDiagnosis',
    title: { ar: 'تشخيص البشرة الذكي', en: 'Smart Skin Routine Diagnosis' },
    desc: { ar: 'بطاقات التصفية التفاعلية الأربعة لاختيار الروتين الملائم للبشرة.', en: '4 interactive solution cards filtering products by tailored skin needs.' },
    icon: Droplets,
    tag: { ar: 'تفاعلي', en: 'Interactive' },
    locationHint: { ar: 'قسم اختيار وتشخيص روتين البشرة التفاعلي', en: 'Interactive Skin Routine Diagnosis' },
    previewImage: 'https://images.unsplash.com/photo-1512290900672-1f41b2f6ef8d?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'productsCatalog',
    title: { ar: 'كتالوج المنتجات وفلاتر التصنيف', en: 'Products Grid & Filters' },
    desc: { ar: 'شبكة المنتجات الرئيسية مع فلاتر التصنيف وشارات الخصم وأزرار الشراء.', en: 'Dynamic products catalog with live sorting, filter pills & discount badges.' },
    icon: ShoppingBag,
    tag: { ar: 'تجارة', en: 'Commerce' },
    locationHint: { ar: 'شبكة المنتجات الرئيسية وفلاتر التصنيف', en: 'Main Products Catalog & Filter Grid' },
    previewImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'hairDevices',
    title: { ar: 'أجهزة الشعر وبنرات الماركات', en: 'Hair Devices & Brand Spotlight' },
    desc: { ar: 'بنرات الماركات (سيل تك، أوكيما، كلارا) مع تبويبات الأجهزة وتصفحها.', en: 'Styling devices carousel with brand spotlight banners & tabbed categories.' },
    icon: Layers,
    tag: { ar: 'تسويق', en: 'Spotlight' },
    locationHint: { ar: 'أجهزة الشعر وبنرات الماركات المميزة', en: 'Hair Styling Devices & Brand Spotlight' },
    previewImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'promoBanner',
    title: { ar: 'البنر الترويجي للحملات', en: 'Promo Campaign Banner' },
    desc: { ar: 'بنر حملة المكونات الطبيعية والبوكسات مع نسبة الخصم والصور المميزة.', en: 'High-impact editorial campaign banner with gift boxes and special discounts.' },
    icon: Image,
    tag: { ar: 'حملات', en: 'Campaign' },
    locationHint: { ar: 'البنر الترويجي للحملات والخصومات الكبرى', en: 'Mid-Page Promotional Campaign Banner' },
    previewImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'beforeAfter',
    title: { ar: 'مقارنة قبل وبعد التفاعلية', en: 'Before & After Transformation Slider' },
    desc: { ar: 'سلايدر السحب التفاعلي لمقارنة نضارة البشرة قبل وبعد 14 يوماً.', en: 'Interactive touch slider comparing real photographic results over 14 days.' },
    icon: Eye,
    tag: { ar: 'مصداقية', en: 'Social Proof' },
    locationHint: { ar: 'سلايدر مقارنة قبل وبعد 14 يوماً باللمس', en: 'Interactive Before & After Touch Slider' },
    previewImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'testimonials',
    title: { ar: 'شهادات وتقييمات العميلات', en: 'Customer Reviews Carousel' },
    desc: { ar: 'آراء موثقة مع تفاصيل المنتجات المقتناة وزر المشاركة.', en: 'Verified buyer testimonials with product tags, helpful voting & modal submit.' },
    icon: BadgeCheck,
    tag: { ar: 'تقييمات', en: 'Reviews' },
    locationHint: { ar: 'شهادات وتقييمات العميلات الموثقة', en: 'Customer Testimonials & Reviews Carousel' },
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'scrollToTop',
    title: { ar: 'زر الصعود للأعلى بحلقة الامتلاء الذكية', en: 'Circular Progress Scroll-to-Top' },
    desc: { ar: 'زر عائم ذكي بحلقة دائرية تمتلئ تدريجياً بنسبة نزول الزائر في الصفحة وتصعد به بنعومة.', en: 'Floating smart button with circular progress ring filling proportionally to scroll depth.' },
    icon: ArrowUp,
    tag: { ar: 'ملاحة ذكية', en: 'Navigation' },
    locationHint: { ar: 'زر الصعود للأعلى الدائري الذكي العائم', en: 'Floating Circular Scroll-To-Top Button' },
    previewImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'floatingWhatsApp',
    title: { ar: 'زر الدعم والواتساب العائم المتطور', en: 'Floating WhatsApp & Call Speed-Dial' },
    desc: { ar: 'زر الاتصال والمحادثة السريعة الفوري مع دعم السحب والنافذة الذكية لمطابقة الهاتف.', en: 'Speed-dial floating actions for instant WhatsApp consultation and direct verified phone calls.' },
    icon: MessageCircle,
    tag: { ar: 'دعم العملاء', en: 'Support' },
    locationHint: { ar: 'زر التواصل والواتساب وسرعة الاتصال العائم', en: 'Floating WhatsApp & Speed-Dial Hub' },
    previewImage: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80',
  },
];
