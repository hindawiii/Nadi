import React from 'react';
import {
  Award,
  BadgeCheck,
  BookOpen,
  Compass,
  Crown,
  Droplets,
  Eye,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  SplitSquareVertical,
} from 'lucide-react';

export interface FieldResetBtnProps {
  lang: 'ar' | 'en';
  path: string;
  descAr: string;
  descEn: string;
  isFieldModified: (path: string) => boolean;
  resetFieldToDefault: (path: string, descAr: string, descEn: string) => void;
}

export const FieldResetBtn: React.FC<FieldResetBtnProps> = ({
  lang,
  path,
  descAr,
  descEn,
  isFieldModified,
  resetFieldToDefault,
}) => {
  const modified = isFieldModified(path);
  return (
    <button
      type="button"
      onClick={() => resetFieldToDefault(path, descAr, descEn)}
      title={
        lang === 'ar'
          ? `استعادة القيمة الافتراضية لـ (${descAr})`
          : `Reset (${descEn}) to factory default`
      }
      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
        modified
          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 shadow-xs'
          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
      }`}
    >
      <RotateCcw className="w-3 h-3" />
      <span>
        {lang === 'ar'
          ? modified
            ? 'استعادة الافتراضي ↺'
            : 'افتراضي'
          : modified
            ? 'Reset ↺'
            : 'Default'}
      </span>
    </button>
  );
};

export type PresetNicheKey = 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';

export function getCustomizerAdaptiveMeta(effectivePresetId: PresetNicheKey) {
  const c6Info = (() => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'كتالوج الإطلالات وتنسيق الأزياء', en: 'Lookbook & Outfit Styling' },
          desc: {
            ar: 'تنسيق أزياء الموسم، تفاصيل الأقمشة، ومجموعات الموديل التحريرية',
            en: 'Curated seasonal outfits, fabric composition & editorial looks',
          },
          icon: Sliders,
        };
      case 'electronics':
        return {
          name: { ar: 'جدول المواصفات والخصائص الذكية', en: 'Tech Specs & Matrix' },
          desc: {
            ar: 'مصفوفة المعالجات، قدرات الشاشات، سعة البطاريات، ومقاييس الأداء',
            en: 'Chipset benchmarks, display refresh rate & battery specs',
          },
          icon: Sliders,
        };
      case 'eyewear':
        return {
          name: { ar: 'أبعاد الإطارات وعدسات الحماية (AR)', en: 'Frame Specs & AR Optics' },
          desc: {
            ar: 'مقاسات الإطارات التيتانيوم، حماية الأشعة فوق البنفسجية، وتجربة الـ AR',
            en: 'Titanium frame sizing, UV400 lens grades & AR try-on',
          },
          icon: Eye,
        };
      default:
        return {
          name: { ar: 'تشخيص الروتين والعناية الذكية', en: 'Skin Routine Diagnosis' },
          desc: {
            ar: 'بطاقات خطوات الروتين الأربعة (الغسول، السيروم، المرطب، الحماية)',
            en: '4-step skincare routine cards with botanical ingredients',
          },
          icon: Droplets,
        };
    }
  })();

  const c9Info = (() => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'دور الأزياء وبكجات تسوق الإطلالة', en: 'Fashion Houses & Shop The Look' },
          desc: {
            ar: 'بنرات دور الأزياء الإيطالية وبكجات تسوق الإطلالة الكاملة المنسقة',
            en: 'Italian couture banners and complete bundle look packages',
          },
          tag: { ar: 'قسم أزياء الموسم', en: 'Season Outfits' },
        };
      case 'electronics':
        return {
          name: { ar: 'أجهزة المستقبل وبنرات العتاد الذكي', en: 'Flagship Tech & Gadget Trio' },
          desc: {
            ar: 'بنرات أحدث المعالجات والأجهزة الذكية وملحقات الأداء العالي',
            en: 'Next-gen silicon hardware and flagship gadget spotlight',
          },
          tag: { ar: 'قسم الأجهزة التقنية', en: 'Tech Spotlight' },
        };
      case 'eyewear':
        return {
          name: { ar: 'إطارات التيتانيوم وماركات البصريات', en: 'Titanium Frames & Designer Trio' },
          desc: {
            ar: 'بنرات تشكيلات المصممين الحصرية وإطارات التيتانيوم خفيفة الوزن',
            en: 'Ultra-lightweight titanium collections and designer optics',
          },
          tag: { ar: 'قسم النظارات المميزة', en: 'Eyewear Spotlight' },
        };
      default:
        return {
          name: { ar: 'أجهزة الشعر وبنرات الماركات (Trio)', en: 'Hair Devices & Trio Banners' },
          desc: {
            ar: 'بنرات الماركات الثلاث (سيل تك، أوكيما، كلارا) وسلايدر أجهزة الشعر',
            en: '3 Brand spotlight banners and smooth horizontal devices carousel',
          },
          tag: { ar: 'قسم أجهزة الشعر', en: 'Hair Devices Section' },
        };
    }
  })();

  const c10Info = (() => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'مقارنة التنسيق (نهاري vs مسائي)', en: 'Styling (Day vs Night)' },
          desc: {
            ar: 'مقارنة مرئية تفاعلية لتنسيق القطعة للإطلالة النهارية والرسمية المسائية',
            en: 'Interactive split-screen proof: Casual Daywear vs Evening Gala look',
          },
        };
      case 'electronics':
        return {
          name: { ar: 'مقارنة الأداء والسرعة (Benchmark)', en: 'Speed & Benchmarks Proof' },
          desc: {
            ar: 'مقارنة بصرية حية لمعدل الإطارات وسرعة المعالجة بين الجيل السابق والجديد',
            en: 'Live visual comparison: Next-gen refresh rate vs legacy performance',
          },
        };
      case 'eyewear':
        return {
          name: { ar: 'وضوح الرؤية مع العدسات المستقطبة', en: 'Polarized Vision Proof' },
          desc: {
            ar: 'محاكاة حية لتأثير العدسات المستقطبة وعزل التوهج الشمسي المباشر',
            en: 'Split-screen proof: Raw harsh glare vs polarized HD visual clarity',
          },
        };
      default:
        return {
          name: { ar: 'قبل وبعد (Visual Proof Slider)', en: 'Before & After Proof Slider' },
          desc: {
            ar: 'شريط المقارنة التفاعلي لنتائج العناية الفورية قبل وبعد الاستخدام',
            en: 'Interactive before & after slider proving visible skincare results',
          },
        };
    }
  })();

  const cornersList = [
    { id: 'corner-1', num: 1, name: { ar: 'شريط الإعلانات العلوي', en: 'Top Announcement Bar' }, icon: Megaphone },
    { id: 'corner-2', num: 2, name: { ar: 'الهيدر وشعار وهوية المتجر', en: 'Header & Store Branding' }, icon: Award },
    { id: 'corner-3', num: 3, name: { ar: 'البنر الترحيبي وشرائحه', en: 'Hero Banner & Slides' }, icon: Layers },
    { id: 'corner-4', num: 4, name: { ar: 'شريط الماركات المتحرك', en: 'Infinite Brand Ticker' }, icon: Sliders },
    { id: 'corner-5', num: 5, name: { ar: 'تصنيفات وتبويبات المتجر', en: 'Categories Navigation' }, icon: Compass },
    { id: 'corner-6', num: 6, name: c6Info.name, icon: c6Info.icon },
    { id: 'corner-7', num: 7, name: { ar: 'كتالوج المنتجات والمخزون', en: 'Products Catalog & Pricing' }, icon: ShoppingBag },
    { id: 'corner-8', num: 8, name: { ar: 'العرض الخاص وشرائحه الأربعة', en: 'Special Offer & 4 Slides' }, icon: ImageIcon },
    { id: 'corner-9', num: 9, name: c9Info.name, icon: Crown },
    { id: 'corner-10', num: 10, name: c10Info.name, icon: SplitSquareVertical },
    { id: 'corner-11', num: 11, name: { ar: 'آراء وتقييمات العملاء', en: 'Customer Testimonials' }, icon: BadgeCheck },
    { id: 'corner-12', num: 12, name: { ar: 'شريط مزايا المتجر والثقة', en: 'Store Value Props' }, icon: ShieldCheck },
    { id: 'corner-13', num: 13, name: { ar: 'التذييل ومعلومات التواصل', en: 'Footer & WhatsApp' }, icon: Phone },
    { id: 'corner-14', num: 14, name: { ar: 'الأسئلة الشائعة (FAQ)', en: 'Store FAQ Section' }, icon: HelpCircle },
    { id: 'corner-15', num: 15, name: { ar: 'صفحة من نحن وقصتنا', en: 'About Us Page' }, icon: BookOpen },
    { id: 'corner-16', num: 16, name: { ar: 'صفحة سياسة الخصوصية', en: 'Privacy Policy Page' }, icon: ShieldCheck },
  ];

  return { c6Info, c9Info, c10Info, cornersList };
}
