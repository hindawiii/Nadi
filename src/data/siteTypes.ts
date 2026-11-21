import type {
  AboutStoryConfig,
  EditorialHeroSlideConfig,
  PrivacyPolicyConfig,
  PromoBannerConfig,
  StoreFaqSectionConfig,
} from './storeContentDefaults';

export interface ProductTabs {
  description: { ar: string; en: string };
  usage: { ar: string; en: string };
  ingredientsOrSpecs?: { ar: string; en: string };
  reviews: { ar: string; en: string };
}

export interface TechSpecItem {
  label: { ar: string; en: string };
  value: { ar: string; en: string };
}

export interface BundleItem {
  id: string;
  name: { ar: string; en: string };
  priceUSD: number;
  image: string;
}

export interface Product {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  basePriceUSD: number;
  originalPriceUSD?: number;
  discountPercentage?: number;
  stock: number;
  badge?: { ar: string; en: string };
  rating: number;
  reviewsCount: number;
  images: string[];
  hasAR?: boolean;
  isTechSpecs?: boolean;
  techSpecs?: TechSpecItem[];
  bundle?: {
    title: { ar: string; en: string };
    discount: number; // e.g. 15%
    items: BundleItem[];
  };
  tabs: ProductTabs;
}

export interface CurrencyConfig {
  symbol: string | { ar: string; en: string };
  name: string;
  rate: number;
  country: string;
  isCrypto?: boolean;
}

export interface PresetNiche {
  id: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
  nicheLabel: { ar: string; en: string };
  storeName: { ar: string; en: string };
  storeLogo?: string;
  storeSlogan: { ar: string; en: string };
  topAnnouncement: { ar: string; en: string };
  announcementSlides?: { ar: string; en: string }[];
  brandTickerItems?: {
    brandAr: string;
    brandEn: string;
    sloganAr: string;
    sloganEn: string;
    tagAr: string;
    tagEn: string;
  }[];
  heroTitle: { ar: string; en: string };
  heroSubtitle: { ar: string; en: string };
  heroCtaPrimary: { ar: string; en: string };
  heroCtaSecondary: { ar: string; en: string };
  heroImage: string;
  heroSlides?: EditorialHeroSlideConfig[];
  promoBanner?: PromoBannerConfig;
  beforeAfterMedia?: {
    title: { ar: string; en: string };
    subtitle: { ar: string; en: string };
    badge: { ar: string; en: string };
    beforeImage: string;
    afterImage: string;
    beforeLabel: { ar: string; en: string };
    afterLabel: { ar: string; en: string };
  };
  trioBanners?: {
    id: string;
    brand: string;
    title: { ar: string; en: string };
    subtitle: { ar: string; en: string };
    targetTab?: string;
    bgGradient?: string;
    accentColor?: string;
    image: string;
    isDarkText?: boolean;
  }[];
  footerAbout?: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    badge: { ar: string; en: string };
  };
  skinDiagnosisCards?: {
    id: string;
    title: { ar: string; en: string };
    ingredient: { ar: string; en: string };
    desc: { ar: string; en: string };
    image: string;
    fallbackImage?: string;
    badge: { ar: string; en: string };
    bg: string;
    badgeColor: string;
  }[];
  testimonials?: {
    id: number;
    name: { ar: string; en: string };
    city: { ar: string; en: string };
    avatar: string;
    purchasedProduct: { ar: string; en: string; id: string };
    date: { ar: string; en: string };
    comment: { ar: string; en: string };
    badge: { ar: string; en: string };
    rating?: number;
    status?: 'approved' | 'pending' | 'rejected';
  }[];
  theme: {
    primaryBg: string;
    primaryText: string;
    primaryHover: string;
    accentColor: string;
    badgeBg: string;
    heroGradient: string;
  };
  valueProps: {
    icon: string;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
  }[];
  contactInfo: {
    address: { ar: string; en: string };
    phone: string;
    email: string;
    whatsapp: string;
    instagramUrl?: string;
    facebookUrl?: string;
    paymentWallets?: {
      binancePayId: string;
      redotPayId: string;
      paypalEmail: string;
      bankakAccount: string;
      cashiNumber: string;
      bravoNumber: string;
    };
  };
  aboutStory: AboutStoryConfig;
  faqSection?: StoreFaqSectionConfig;
  privacyPolicy?: PrivacyPolicyConfig;
  products: Product[];
}

export interface ColorPalette {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  primary: string;       // 60-30-10: 30% Brand identity color
  primaryHover: string;
  accent: string;        // 60-30-10: 10% CTA High conversion accent
  accentHover: string;
  surface: string;       // 60-30-10: 60% Clean base background/surface
  textOnPrimary: string;
  cardBg: string;
  borderTint: string;
  badgeBg: string;
  heroGradient: string;
  previewColors: string[];
}

export interface TypographyPair {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  headingFamilyAr: string;
  headingFamilyEn: string;
  bodyFamilyAr: string;
  bodyFamilyEn: string;
  headingClassAr: string;
  headingClassEn: string;
  bodyClass: string;
  lineHeight: string;
  sampleHeading: { ar: string; en: string };
  sampleBody: { ar: string; en: string };
}

export interface ImportableTemplate {
  id: string;
  name: { ar: string; en: string };
  nicheLabel: { ar: string; en: string };
  badge: { ar: string; en: string };
  description: { ar: string; en: string };
  previewImage: string;
  paletteId: string;
  typographyId: string;
  presetData: PresetNiche;
}

export interface SiteConfig {
  security: {
    adminPin: string;
    developerPin: string;
    isDeveloperModeLocked: boolean;
    developerRecoveryPhone?: string;
    developerRecoveryEmail?: string;
  };
  currencies: Record<string, CurrencyConfig>;
  presets: Record<'cosmetics' | 'fashion' | 'eyewear' | 'electronics', PresetNiche>;
}
