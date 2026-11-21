import type { ColorPalette, TypographyPair } from './siteTypes';

export const curatedPalettes: ColorPalette[] = [
  {
    id: 'imperial-orchid',
    name: { ar: 'أوركيد إمبراطوري فاخر (Imperial Orchid)', en: 'Imperial Orchid & Rose' },
    category: { ar: 'تجميل وعناية', en: 'Beauty & Skincare' },
    primary: '#5A3E7A',
    primaryHover: '#483162',
    accent: '#E11D48',
    accentHover: '#BE123C',
    surface: '#FAF5FF',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#F3E8FF',
    badgeBg: '#E11D48',
    heroGradient: 'from-purple-50 via-slate-50 to-white',
    previewColors: ['#5A3E7A', '#8B5CF6', '#E11D48', '#FAF5FF']
  },
  {
    id: 'emerald-velvet',
    name: { ar: 'مخمل زمردي وذهب ملكي (Emerald & Royal Gold)', en: 'Emerald Velvet & Royal Gold' },
    category: { ar: 'فخامة وطبيعة', en: 'Luxury & Nature' },
    primary: '#0F4C3A',
    primaryHover: '#0A3528',
    accent: '#D97706',
    accentHover: '#B45309',
    surface: '#F4FAF6',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#D1FAE5',
    badgeBg: '#D97706',
    heroGradient: 'from-emerald-50 via-teal-50/30 to-white',
    previewColors: ['#0F4C3A', '#059669', '#D97706', '#F4FAF6']
  },
  {
    id: 'midnight-obsidian',
    name: { ar: 'أوبسيديان منتصف الليل وروز جولد (Midnight Obsidian)', en: 'Midnight Obsidian & Rose Gold' },
    category: { ar: 'أناقة داكنة ومجوهرات', en: 'Haute Horlogerie & Fashion' },
    primary: '#18181B',
    primaryHover: '#09090B',
    accent: '#E07A5F',
    accentHover: '#C86247',
    surface: '#F7F7F8',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#E4E4E7',
    badgeBg: '#E07A5F',
    heroGradient: 'from-zinc-100 via-stone-50 to-white',
    previewColors: ['#18181B', '#3F3F46', '#E07A5F', '#F7F7F8']
  },
  {
    id: 'terracotta-amber',
    name: { ar: 'تيراكوتا ترابي وعنبر طبيعي (Warm Terracotta)', en: 'Warm Terracotta & Teal' },
    category: { ar: 'عضوي وأصالة', en: 'Organic & Heritage' },
    primary: '#9A3412',
    primaryHover: '#7C2D12',
    accent: '#0D9488',
    accentHover: '#0F766E',
    surface: '#FFFBF7',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#FFEDD5',
    badgeBg: '#0D9488',
    heroGradient: 'from-amber-50 via-orange-50/20 to-white',
    previewColors: ['#9A3412', '#EA580C', '#0D9488', '#FFFBF7']
  },
  {
    id: 'royal-sapphire',
    name: { ar: 'ياقوت أزرق ملكي وفضة (Royal Sapphire)', en: 'Royal Sapphire & Celestial' },
    category: { ar: 'إلكترونيات وبصريات', en: 'Optics & High-Tech' },
    primary: '#1E3A8A',
    primaryHover: '#172554',
    accent: '#0284C7',
    accentHover: '#0369A1',
    surface: '#F0F7FF',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#DBEAFE',
    badgeBg: '#0284C7',
    heroGradient: 'from-blue-50 via-indigo-50/20 to-white',
    previewColors: ['#1E3A8A', '#2563EB', '#0284C7', '#F0F7FF']
  },
  {
    id: 'blush-cashmere',
    name: { ar: 'كشمير زهري وذهب بودري (Blush Cashmere)', en: 'Blush Cashmere & Muted Gold' },
    category: { ar: 'عطور ومكياج', en: 'Fragrance & Fine Cosmetics' },
    primary: '#831843',
    primaryHover: '#701A75',
    accent: '#CA8A04',
    accentHover: '#A16207',
    surface: '#FFF5F8',
    textOnPrimary: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderTint: '#FCE7F3',
    badgeBg: '#CA8A04',
    heroGradient: 'from-rose-50 via-pink-50/20 to-white',
    previewColors: ['#831843', '#DB2777', '#CA8A04', '#FFF5F8']
  }
];

export const curatedTypographyPairs: TypographyPair[] = [
  {
    id: 'royal-luxury',
    name: { ar: 'التوليفة الملكية الفاخرة (Royal Luxury)', en: 'Royal Luxury (El Messiri + Cairo)' },
    category: { ar: 'المتاجر الفاخرة ومستحضرات التجميل', en: 'High Luxury & Cosmetics' },
    headingFamilyAr: 'El Messiri',
    headingFamilyEn: 'Playfair Display',
    bodyFamilyAr: 'Cairo',
    bodyFamilyEn: 'Plus Jakarta Sans',
    headingClassAr: 'font-heading-ar font-bold',
    headingClassEn: 'font-heading-en font-bold tracking-wide',
    bodyClass: 'leading-relaxed font-normal',
    lineHeight: '1.625',
    sampleHeading: {
      ar: 'إشراقة ملكية، ونقاء طبيعي لا يُضاهى',
      en: 'Timeless Radiance & Botanical Perfection'
    },
    sampleBody: {
      ar: 'تركيبة متوازنة تمنح بشرتك العناية الفائقة مع ضمان كامل للأصالة والنقاء الطبيعي مع تباعد أسطر مريح بدون أي تداخل في التشكيل.',
      en: 'Carefully engineered botanical formulas designed to restore deep hydration while maintaining effortless legibility.'
    }
  },
  {
    id: 'modern-clean',
    name: { ar: 'التوليفة الهندسية الحديثة (Modern Tech & Clean)', en: 'Modern Clean (Cairo Bold + Cairo)' },
    category: { ar: 'الإلكترونيات والمنتجات التقنية', en: 'Tech, Gadgets & Direct Commerce' },
    headingFamilyAr: 'Cairo',
    headingFamilyEn: 'Outfit',
    bodyFamilyAr: 'Cairo',
    bodyFamilyEn: 'Plus Jakarta Sans',
    headingClassAr: 'font-sans font-black',
    headingClassEn: 'font-brand-geometric font-extrabold tracking-wider',
    bodyClass: 'leading-relaxed font-normal',
    lineHeight: '1.625',
    sampleHeading: {
      ar: 'دقة هندسية، وأداء استثنائي متطور',
      en: 'Precision Engineering & Superior Performance'
    },
    sampleBody: {
      ar: 'أحدث التقنيات المبتكرة المصممة لرفع كفاءتك اليومية مع مقروئية رقمية واضحة ومتباعدة الأسطر بدقة فائقة.',
      en: 'Next-generation industrial aesthetics balanced with razor-sharp geometric typography for modern storefronts.'
    }
  },
  {
    id: 'neo-editorial',
    name: { ar: 'التوليفة الصحفية المعاصرة (Neo-Editorial Chic)', en: 'Neo-Editorial Chic (Alexandria + Cairo)' },
    category: { ar: 'الأزياء الراقية والملابس الحصرية', en: 'Editorial Fashion & Haute Couture' },
    headingFamilyAr: 'Alexandria',
    headingFamilyEn: 'Playfair Display',
    bodyFamilyAr: 'Cairo',
    bodyFamilyEn: 'Inter',
    headingClassAr: 'font-bold tracking-tight',
    headingClassEn: 'italic font-bold',
    bodyClass: 'leading-relaxed font-normal',
    lineHeight: '1.65',
    sampleHeading: {
      ar: 'أناقة حصرية تُعيد تعريف الإطلالة',
      en: 'Exquisite Tailoring & Editorial Finesse'
    },
    sampleBody: {
      ar: 'تصاميم إيطالية متميزة تجمع بين الحرفية الكلاسيكية والروح العصرية المفعمة بالحيوية والتفرد.',
      en: 'Sculpted silhouettes and bespoke craftsmanship brought forward in high-fashion editorial clarity.'
    }
  },
  {
    id: 'fluid-minimalist',
    name: { ar: 'التوليفة الانسيابية الهادئة (Fluid Minimalist)', en: 'Fluid Minimalist (Tajawal + Cairo)' },
    category: { ar: 'النظارات والمجوهرات الدقيقة', en: 'Minimalist Eyewear & Fine Jewelry' },
    headingFamilyAr: 'Tajawal',
    headingFamilyEn: 'Plus Jakarta Sans',
    bodyFamilyAr: 'Cairo',
    bodyFamilyEn: 'Plus Jakarta Sans',
    headingClassAr: 'font-bold',
    headingClassEn: 'font-semibold tracking-wide',
    bodyClass: 'leading-relaxed font-normal',
    lineHeight: '1.625',
    sampleHeading: {
      ar: 'بساطة مطلقة تُبرز جوهر التفاصيل',
      en: 'Understated Elegance in Every Contour'
    },
    sampleBody: {
      ar: 'خطوط هادئة وانسيابية خالية من التكلف، تمنح المتصفح تجربة قراءة فائقة الراحة والوضوح.',
      en: 'Quiet, unhurried typography that lets products speak with authentic purity and zero clutter.'
    }
  }
];
