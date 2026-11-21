import { additionalSkincareProducts } from '../skincareCatalog';
import { additionalHairDevices } from '../hairDevicesCatalog';
import { additionalGiftBundles } from '../bundlesCatalog';
import type { PresetNiche } from '../siteTypes';

export const cosmeticsPreset: PresetNiche = {
  id: "cosmetics",
  nicheLabel: { ar: "تجميل وعناية بالبشرة (نَـــــدِي - NADI)", en: "Cosmetics & Skincare (NADI)" },
  storeName: { ar: "نَـــــدِي", en: "NADI" },
  storeLogo: "",
  storeSlogan: { ar: "إشراقة طبيعية، تليق بك.", en: "Natural radiance, made for you." },
  topAnnouncement: {
    ar: "احفظي مفضلتكِ واطلبي عبر السلة أو واتساب",
    en: "Save favorites & order via bag or WhatsApp"
  },
  announcementSlides: [
    {
      ar: "احفظي مفضلتكِ واطلبي عبر السلة أو واتساب",
      en: "Save favorites & order via bag or WhatsApp"
    },
    {
      ar: "توصيل سريع • الدفع عند الاستلام أو أونلاين",
      en: "Fast delivery • Pay on delivery or online"
    },
    {
      ar: "مستحضرات نَدِي الأصلية • نقاء طبيعي يدوم",
      en: "Authentic NADI care • Lasting natural purity"
    }
  ],
  brandTickerItems: [
    {
      brandAr: "نَـــــدِي",
      brandEn: "NADI",
      sloganAr: "إشراقة طبيعية، تليق بك.",
      sloganEn: "Natural radiance, made for you.",
      tagAr: "جمال ونقاء نباتي",
      tagEn: "Pure Botanical Radiance"
    },
    {
      brandAr: "نَـــــدِي",
      brandEn: "NADI",
      sloganAr: "عناية فائقة تلائم رقة بشرتك",
      sloganEn: "Natural radiance, made for you.",
      tagAr: "خلاصات طبيعية 100%",
      tagEn: "Dermatologically Tested"
    }
  ],
  heroTitle: { ar: "عناية طبيعية، لنضارة يومية", en: "Natural care, everyday glow" },
  heroSubtitle: {
    ar: "تركيبات نباتية نقية لترطيب وإشراقة تدوم طوال اليوم.",
    en: "Pure botanical formulas for lasting hydration and glow."
  },
  heroCtaPrimary: { ar: "تسوّقي", en: "Shop Now" },
  heroCtaSecondary: { ar: "شاهدي العروض", en: "View Offers" },
  heroImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
  promoBanner: {
    badge: { ar: "عرض خاص", en: "Special Offer" },
    title: { ar: "وفّري 25% على بوكس العناية الكامل", en: "Save 25% on the Complete Care Box" },
    subtitle: { ar: "مع حقيبة مخملية وعينات مجانية وتوصيل سريع.", en: "Includes a velvet pouch, free samples & fast shipping." },
    image1: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
    image1Badge: { ar: "مكوّنات نباتية 100%", en: "100% Botanicals" },
    image2: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    image2Badge: { ar: "خصم 25% على البوكس", en: "25% OFF Boxes" },
    ctaText: { ar: "اطلبي البوكس الآن", en: "Order Routine Bundle" }
  },
  beforeAfterMedia: {
    title: { ar: "قبل وبعد — 14 يوماً", en: "Before & After — 14 Days" },
    subtitle: { ar: "اسحبي المؤشر للمقارنة.", en: "Slide to compare." },
    badge: { ar: "نتائج ملموسة", en: "Visible Results" },
    beforeImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    beforeLabel: { ar: "قبل", en: "Before" },
    afterLabel: { ar: "بعد", en: "After" }
  },
  trioBanners: [
    {
      id: 'siltek-banner',
      brand: 'Siltek',
      title: { ar: 'مكواة التمويج الثلاثية', en: 'Triple Barrel Waver' },
      subtitle: { ar: 'تمويجات عريضة تدوم طويلاً', en: 'Long-lasting Deep Waves' },
      targetTab: 'waving',
      bgGradient: 'from-[#0b2a23] via-[#0e372e] to-[#071f1a]',
      accentColor: '#2B827A',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'okema-banner',
      brand: 'Okema®',
      title: { ar: 'المصفف الذكي متعدد الرؤوس', en: 'Multi-Styler Air Brush' },
      subtitle: { ar: 'تصفيف وتجفيف متكامل 6 في 1', en: '6-in-1 Complete Styling' },
      targetTab: 'dryer',
      bgGradient: 'from-[#fbf8f5] via-[#f5ede3] to-[#ede4d7]',
      accentColor: '#b45309',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'clara-banner',
      brand: 'CLARA',
      title: { ar: 'مكواة التمليس والأيونات', en: 'Ceramic Ion Flat Iron' },
      subtitle: { ar: 'شعر حريري فائق النعومة', en: 'Silk Sleek Results' },
      targetTab: 'straightener',
      bgGradient: 'from-[#fdf5f7] via-[#f9e9ed] to-[#f4dde3]',
      accentColor: '#be185d',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    }
  ],
  footerAbout: {
    title: { ar: "عالم الجمال والعناية", en: "World of Botanical Care" },
    description: { ar: "وجهتكم الأولى لمنتجات العناية الطبيعية بالبشرة والمستخلصات النباتية الأصلية مع ضمان شامل وخدمة استشارات ما بعد الشراء.", en: "Your premier destination for authentic natural skincare and pure botanicals with comprehensive purity guarantee." },
    badge: { ar: "منتجات أصلية معتمدة 100%", en: "100% Certified Authentic" }
  },
  skinDiagnosisCards: [
    {
      id: 'hydrated',
      title: { ar: 'بشرة مرطبة', en: 'Moisturized Skin' },
      ingredient: { ar: 'حمض الهيالورونيك المكثف', en: 'Intense Hyaluronic Acid' },
      desc: { ar: 'حمض الهيالورونيك المكثف لحبس الرطوبة ومحاربة الجفاف.', en: 'Hyaluronic acid deep hydration barrier.' },
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      badge: { ar: 'ترطيب عميق', en: 'Deep Moisture' },
      bg: 'bg-blue-50/70 border-blue-200/80 hover:border-blue-400 text-blue-900',
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'even',
      title: { ar: 'بشرة موحّدة', en: 'Even Tone Skin' },
      ingredient: { ar: 'فيتامين سي العضوي', en: 'Pure Organic Vitamin C' },
      desc: { ar: 'فيتامين سي العضوي لتفتيح التصبغات وتوحيد لون البشرة.', en: 'Active Vitamin C to combat hyperpigmentation.' },
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      badge: { ar: 'تفتيح وتوحيد', en: 'Even Tone' },
      bg: 'bg-amber-50/70 border-amber-200/80 hover:border-amber-400 text-amber-900',
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'firm',
      title: { ar: 'بشرة مشدودة', en: 'Firm Skin' },
      ingredient: { ar: 'خلاصات الكولاجين النباتي', en: 'Botanical Collagen Boost' },
      desc: { ar: 'مستخلصات نباتية لتجديد الكولاجين والمرونة الطبيعية.', en: 'Plant botanicals restoring elasticity.' },
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      badge: { ar: 'شد ومرونة', en: 'Firm & Elastic' },
      bg: 'bg-purple-50/70 border-purple-200/80 hover:border-purple-400 text-purple-900',
      badgeColor: 'bg-purple-700 text-white'
    },
    {
      id: 'radiant',
      title: { ar: 'بشرة مشرقة', en: 'Radiant Skin' },
      ingredient: { ar: 'زيوت اللافندر والورد', en: 'Rose & Lavender Infusion' },
      desc: { ar: 'زيوت اللافندر والورد لنضارة فورية وإشراقة طبيعية تدوم.', en: 'Lavender & Rose extracts for healthy glow.' },
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      badge: { ar: 'إشراقة طبيعية', en: 'Natural Glow' },
      bg: 'bg-rose-50/70 border-rose-200/80 hover:border-rose-400 text-rose-900',
      badgeColor: 'bg-rose-600 text-white'
    }
  ],
  testimonials: [
    {
      id: 0,
      name: { ar: 'فاطمة عبدالله', en: 'Fatima Abdullah' },
      city: { ar: 'أم درمان', en: 'Omdurman' },
      avatar: '',
      purchasedProduct: { ar: 'مرطب الهيالورونيك المكثف', en: 'Intense Hyaluronic Moisturizer', id: 'sb-01' },
      date: { ar: 'منذ أسبوعين', en: '2 weeks ago' },
      comment: {
        ar: 'ترطيبه لطيف وملمسه خفيف على البشرة، ووصلني الطلب سريعاً.',
        en: 'Gentle hydration with a lightweight feel, and my order arrived quickly.'
      },
      badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
      rating: 5
    },
    {
      id: 1,
      name: { ar: 'ريم الصادق', en: 'Reem El Sadig' },
      city: { ar: 'الخرطوم', en: 'Khartoum' },
      avatar: '',
      purchasedProduct: { ar: 'سيروم فيتامين سي المشرق', en: 'Brightening Vitamin C Serum', id: 'sb-02' },
      date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
      comment: {
        ar: 'السيروم خفيف ويمتص بسرعة بدون لمعان دهني، حسّيت بنضارة هادئة.',
        en: 'Absorbs quickly without greasiness and left a soft, healthy glow.'
      },
      badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
      rating: 5
    },
    {
      id: 2,
      name: { ar: 'سارة عثمان', en: 'Sarah Osman' },
      city: { ar: 'بورتسودان', en: 'Port Sudan' },
      avatar: '',
      purchasedProduct: { ar: 'كريم الليل لتجديد الكولاجين', en: 'Collagen Renewal Night Cream', id: 'sb-03' },
      date: { ar: 'منذ شهر', en: '1 month ago' },
      comment: {
        ar: 'الكريم الليلي مريح وناعم قبل النوم، وبشرتي أصبحت أهدأ في الصباح.',
        en: 'Soothing and smooth before bed; my skin feels noticeably calmer by morning.'
      },
      badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
      rating: 5
    },
    {
      id: 3,
      name: { ar: 'مروة الطاهر', en: 'Marwa Al-Tahir' },
      city: { ar: 'الرياض', en: 'Riyadh' },
      avatar: '',
      purchasedProduct: { ar: 'مجموعة بوكس التوفير الكاملة', en: 'Natural Bloom Complete Box', id: 'sb-04' },
      date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
      comment: {
        ar: 'التغليف مرتب والمنتجات لطيفة على البشرة الحساسة، تجربة موفقة.',
        en: 'Thoughtful packaging and gentle on sensitive skin—a great experience overall.'
      },
      badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
      rating: 5
    }
  ],
  theme: {
    primaryBg: "bg-[#5A3E7A]",
    primaryText: "text-[#5A3E7A]",
    primaryHover: "hover:bg-[#483162]",
    accentColor: "#5A3E7A",
    badgeBg: "bg-rose-500",
    heroGradient: "from-purple-50 via-slate-50 to-white",
  },
  valueProps: [
    {
      icon: "Award",
      title: { ar: "نتائج ملموسة", en: "Visible Results" },
      desc: { ar: "تركيبات مدروسة لنتائج واضحة.", en: "Thoughtful formulas that work." },
    },
    {
      icon: "Truck",
      title: { ar: "توصيل سريع", en: "Fast Delivery" },
      desc: { ar: "يصلكِ طلبكِ بعناية وفي موعده.", en: "Packed with care, delivered fast." },
    },
    {
      icon: "ShieldCheck",
      title: { ar: "أصلية 100%", en: "100% Authentic" },
      desc: { ar: "جودة مضمونة في كل عبوة.", en: "Guaranteed quality in every bottle." },
    },
    {
      icon: "CreditCard",
      title: { ar: "دفع مرن وآمن", en: "Flexible Payment" },
      desc: { ar: "عند الاستلام أو أونلاين.", en: "Pay on delivery or online." },
    },
  ],
  contactInfo: {
    address: { ar: "أم درمان – شارع الوادي، السودان", en: "Omdurman - Al Wadi Street, Sudan" },
    phone: "+249900713251",
    email: "nadi.skincare@gmail.com",
    whatsapp: "249900713251",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    paymentWallets: {
      binancePayId: "829104432",
      redotPayId: "19482015",
      paypalEmail: "nadi.skincare@gmail.com",
      bankakAccount: "2891044",
      cashiNumber: "07040 2787 05198",
      bravoNumber: "0900713251",
    },
  },
  aboutStory: {
    title: { ar: "قصّة نَدِي - NADI", en: "The NADI Story" },
    body: {
      ar: "نَدِي علامة وُلدت من إيمان عميق بأن نضارة البشرة وجمالها ينبعان من نقاء الطبيعة ورطوبة الندى الصافي. نختار مكوّناتنا النباتية بعناية فائقة، ونقدّم لكِ مستحضرات عناية راقية تجمع بين النقاء الطبيعي والفاعلية العلمية، لتنعمي ببشرة صحيّة، نضرة ومشرقة كل يوم.",
      en: "NADI is born from the profound conviction that authentic beauty stems from botanical purity and dew-drop freshness. We curate our botanical ingredients meticulously, blending organic purity with advanced scientific care so every woman enjoys healthy, supple, and radiant skin."
    },
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80",
  },
  products: [
    {
      id: "sb-01",
      name: { ar: "مرطب الهيالورونيك المكثف", en: "Intense Hyaluronic Moisturizer" },
      category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
      basePriceUSD: 5.0,
      originalPriceUSD: 6.25,
      discountPercentage: 20,
      stock: 4,
      badge: { ar: "خصم 20%", en: "20% OFF" },
      rating: 4.9,
      reviewsCount: 128,
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      ],
      bundle: {
        title: { ar: "مجموعة الترطيب العميق (Shop The Look)", en: "Deep Hydration Bundle" },
        discount: 15,
        items: [
          {
            id: "sb-02",
            name: { ar: "سيروم فيتامين سي النقي", en: "Pure Vitamin C Serum" },
            priceUSD: 5.8,
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
          },
          {
            id: "sb-03",
            name: { ar: "كريم لافندر الليلي للترميم", en: "Lavender Night Cream" },
            priceUSD: 7.2,
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
          }
        ]
      },
      tabs: {
        description: {
          ar: "مرطب مكثف غني بحمض الهيالورونيك وخلاصة اللافندر الطبيعية. يعيد بناء حاجز الرطوبة ويحمي البشرة من الجفاف وعوامل الطقس القاسية.",
          en: "Intensive moisturizer enriched with triple hyaluronic acid and natural lavender extract to restore hydration and barrier vitality."
        },
        usage: {
          ar: "ضعي كمية مناسبة على الوجه والرقبة بعد التنظيف صباحاً ومساءً مع تدليك دائري خفيف حتى الامتصاص التام.",
          en: "Apply a small amount to clean face and neck in the morning and evening, gently massaging until fully absorbed."
        },
        ingredientsOrSpecs: {
          ar: "حمض الهيالورونيك النقي، خلاصة زهرة اللافندر، جل الصبار العضوي، زيت الجوجوبا وفيتامين E.",
          en: "Pure Hyaluronic Acid, Organic Lavender Blossom Water, Aloe Vera Extract, Jojoba Oil, Vitamin E."
        },
        reviews: {
          ar: "تقييم 4.9/5 من أكثر من 120 عميلة موثقة في السودان والخليج. 'أعطى بشرتي نضارة فورية من أول أسبوع!'",
          en: "Rated 4.9/5 by over 120 verified customers. 'Instant dewy glow within the first week of daily use!'"
        }
      }
    },
    {
      id: "sb-02",
      name: { ar: "سيروم فيتامين سي النقي", en: "Pure Vitamin C Serum" },
      category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
      basePriceUSD: 5.75,
      originalPriceUSD: 7.20,
      discountPercentage: 20,
      stock: 2,
      badge: { ar: "خصم 20%", en: "20% OFF" },
      rating: 4.8,
      reviewsCount: 94,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80",
      ],
      tabs: {
        description: {
          ar: "سيروم مركز بفيتامين سي النشط لتفتيح التصبغات وتوحيد لون البشرة ومكافحة الأكسدة والإجهاد البيئي.",
          en: "Concentrated active vitamin C serum formulated to target hyperpigmentation and reveal luminous radiance."
        },
        usage: {
          ar: "توضع 3 إلى 4 قطرات على بشرة نظيفة قبل النوم ثم يتبع بالمرطب المفضل.",
          en: "Apply 3-4 drops on clean dry skin before bed, followed by your preferred moisturizer."
        },
        ingredientsOrSpecs: {
          ar: "فيتامين سي نقي 15%، حمض الفيروليك، خلاصة الحمضيات الطبيعية.",
          en: "Pure Vitamin C (15%), Ferulic Acid, Botanical Citrus Bioflavonoids."
        },
        reviews: {
          ar: "تقييم 4.8/5. 'تصبغات الشمس خفت بشكل ملحوظ بعد 10 أيام فقط.'",
          en: "Rated 4.8/5. 'Noticeably lightened stubborn sun spots within just 10 days!'"
        }
      }
    },
    {
      id: "sb-03",
      name: { ar: "كريم لافندر الليلي للترميم", en: "Lavender Night Cream" },
      category: { ar: "ترميم البشرة", en: "Night Repair" },
      basePriceUSD: 6.5,
      originalPriceUSD: 8.0,
      discountPercentage: 18,
      stock: 6,
      badge: { ar: "الأكثر طلباً", en: "Best Seller" },
      rating: 4.95,
      reviewsCount: 156,
      images: [
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      ],
      tabs: {
        description: {
          ar: "تركيبة غنية مهدئة تعمل طوال الليل على ترميم خلايا البشرة المجهدة وإكسابها نعومة فائقة عند الاستيقاظ.",
          en: "A rich soothing night formula that repairs stressed skin cells and replenishes moisture overnight."
        },
        usage: {
          ar: "يوزع بلطف على الوجه والرقبة قبل النوم كآخر خطوة في روتين العناية المسائي.",
          en: "Gently smooth over face and neck before sleeping as the final step in your evening routine."
        },
        ingredientsOrSpecs: {
          ar: "زيت اللافندر الطبيعي، زبدة الشيا النقية، السيراميدات الأساسية.",
          en: "French Lavender Essential Oil, Organic Shea Butter, Plant Ceramides."
        },
        reviews: {
          ar: "تقييم 4.95/5. 'ريحته مهدئة جداً وتصحي الصباح ببشرة زي الأطفال.'",
          en: "Rated 4.95/5. 'Calming scent, wake up with ultra-soft baby skin.'"
        }
      }
    },
    {
      id: "sb-04",
      name: { ar: "بوكس Natural Bloom الكامل", en: "Natural Bloom Complete Box" },
      category: { ar: "البكجات والعروض", en: "Gift Sets" },
      basePriceUSD: 18.0,
      originalPriceUSD: 24.0,
      discountPercentage: 25,
      stock: 3,
      badge: { ar: "وفر 25%", en: "SAVE 25%" },
      rating: 5.0,
      reviewsCount: 88,
      images: [
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      ],
      tabs: {
        description: {
          ar: "البوكس الكامل الذي يضم المرطب، السيروم، كريم اللافندر، وغسول الوجه في حقيبة خشبية فاخرة مزينة بزهور الفرانجيباني.",
          en: "The all-in-one luxury botanical box featuring moisturizer, serum, night cream, and cleanser in a wooden gift tray."
        },
        usage: {
          ar: "برنامج عناية متكامل لمدة 30 يوماً يتضمن دليل الاستخدام الصباحي والمسائي.",
          en: "Complete 30-day regimen with morning and night routine roadmap included."
        },
        ingredientsOrSpecs: {
          ar: "4 منتجات كاملة الحجم خالية تماماً من الكيماويات القاسية والبارابين.",
          en: "4 full-sized products, 100% paraben-free and vegan certified."
        },
        reviews: {
          ar: "تقييم 5.0/5. 'هدية فخمة جداً والنتائج سحرية بشهادة كل من جربها.'",
          en: "Rated 5.0/5. 'The ultimate self-care gift. Remarkable results!'"
        }
      }
    },
    {
      id: "hd-01",
      name: { 
        ar: "جهاز تجعيد سل تيك SLTK-12", 
        en: "Siltek Hair Waver SLTK-12" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 29.44,
      originalPriceUSD: 46.00,
      discountPercentage: 36,
      stock: 8,
      badge: { ar: "وفر 36%", en: "36% OFF" },
      rating: 5.0,
      reviewsCount: 142,
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "مكواة تجعيد وتمويج الشعر الثلاثية الأسطوانات بتورمالين السيراميك لحماية ألياف الشعر من الحرارة العالية ومنحه تمويجات شاطئية عريضة ولامعة في ثوانٍ معدودة.",
          en: "Triple barrel tourmaline ceramic waver engineered to protect hair strands from thermal damage while crafting lustrous, natural beach waves in seconds."
        },
        usage: {
          ar: "قسمي الشعر إلى خصلات متساوية، ثم اضغطي الجهاز على الخصلة لمدة 5 إلى 8 ثوانٍ من الجذور حتى الأطراف.",
          en: "Divide hair into even sections, gently clamp down for 5-8 seconds from roots to ends for bouncy textured waves."
        },
        ingredientsOrSpecs: {
          ar: "أسطوانات ثلاثية سيراميك 25مم | تحكم بالحرارة حتى 220°C | سلك دوار 360 درجة | ضمان سنتين شامل معتمد.",
          en: "25mm Triple Ceramic Barrels | Temp up to 220°C | 360° Swivel Cord | Full 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 5/5. 'الجهاز يجنن وسهل جداً ويعطي ويفي طبيعي وثابت ليومين!'",
          en: "5/5 Stars. 'Incredible wave texture that stays in place all day without crunchiness.'"
        }
      }
    },
    {
      id: "hd-02",
      name: { 
        ar: "مموج شيقلام بيتش بيب 25مم", 
        en: "Sheglam Beach Waver 25mm" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 22.55,
      originalPriceUSD: 32.22,
      discountPercentage: 30,
      stock: 2,
      badge: { ar: "وفر 30%", en: "30% OFF" },
      rating: 4.9,
      reviewsCount: 98,
      images: [
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "جهاز تمويج فوري وردي بتصميم مريح وعصري، يعتمد تقنية التسخين السريع PTC لتمويجات حيوية بدون تجعد وبحماية فائقة لترطيب الشعر.",
          en: "Signature blush pink deep waver featuring PTC rapid heating technology for soft, frizz-free waves with maximum moisture retention."
        },
        usage: {
          ar: "يستخدم على شعر جاف تماماً، اختاري درجة الحرارة المناسبة لنوع شعركِ واضغطي بلطف على طول الخصلة.",
          en: "Use on completely dry hair. Select your ideal heat level and clamp down gently along hair sections."
        },
        ingredientsOrSpecs: {
          ar: "قطر الأسطوانة 25مم | لوحات سيراميك زيت الأرجان | إيقاف تلقائي بعد 60 دقيقة | ضمان سنتين شامل معتمد.",
          en: "25mm Barrel | Argan Oil-Infused Ceramic | 60-min Auto Shutoff | 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 4.9/5. 'لونه وردي كيوت وخفيف باليد ويسوي الشعر بسرعة البرق.'",
          en: "4.9/5 Stars. 'Lightweight, ergonomic and styles thick hair effortlessly fast.'"
        }
      }
    },
    {
      id: "hd-03",
      name: { 
        ar: "كيرلي شيقلام الفوري 32مم", 
        en: "Sheglam Auto Curler 32mm" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 25.97,
      originalPriceUSD: 37.11,
      discountPercentage: 30,
      stock: 6,
      badge: { ar: "وفر 30%", en: "30% OFF" },
      rating: 5.0,
      reviewsCount: 115,
      images: [
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "مكواة التجعيد الأوتوماتيكية الذكية كيوبيدز تشارم مع حجرة حماية عازلة للحرارة بنسبة 100% لمنع ملامسة الجلد، وتجعيد آلي بلمسة زر واحدة.",
          en: "Smart automatic rotating curling wand featuring full anti-scald thermal shielding and one-touch bi-directional rotation for salon bouncy curls."
        },
        usage: {
          ar: "ضعي خصلة رفيعة في الفتحة المخصصة واضغطي زر الدوران، سينتظر الجهاز التوقيت المناسب ويصدر نغمة تنبيه عند اكتمال اللفة.",
          en: "Insert a thin section of hair into the chamber, press rotation button, and release when the smart timer beeps."
        },
        ingredientsOrSpecs: {
          ar: "أسطوانة 32مم كبرى | دوران مزدوج يمين ويسار | حماية من التشابك الذكي | ضمان سنتين شامل معتمد.",
          en: "32mm Large Barrel | Dual Direction Rotation | Anti-Tangle Sensor | 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 5/5. 'أفضل اختراع للبنات اللي ما يعرفوا يلفوا شعرهم، بدون أي حروق!'",
          en: "5/5 Stars. 'Foolproof curls with zero burns. Complete game changer for quick mornings.'"
        }
      }
    },
    {
      id: "hd-04",
      name: { 
        ar: "مصفف سل تيك 6 في 1 SLTK-10", 
        en: "Siltek 6-in-1 Air Brush" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 63.78,
      originalPriceUSD: 99.66,
      discountPercentage: 36,
      stock: 3,
      badge: { ar: "وفر 36%", en: "36% OFF" },
      rating: 5.0,
      reviewsCount: 189,
      images: [
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "المصفف الهوائي الاحترافي المتكامل بست رؤوس قابلة للتبديل (تجفيف سريع، تكثيف، تمليس، لف هوائي بكواندا، وفرشاة مستديرة) بقوة 1400 واط.",
          en: "The all-in-one 6-in-1 hot air styling system powered by high-speed airflow (Coanda effect curlers, volumizer brush, oval smoother, and concentrated dryer)."
        },
        usage: {
          ar: "ركبي الرأس المناسب على المقبض الذكي، واستخدمي تدفق الهواء البارد أو الساخن لتصفيف وتثبيت الشعر في خطوة واحدة.",
          en: "Snap the desired attachment onto the ergonomic handle and style while drying with adjustable heat and cold shot lock."
        },
        ingredientsOrSpecs: {
          ar: "محرك رقمي عالي السرعة 110,000 دورة/دقيقة | 6 رؤوس مغناطيسية | تقنية الأيونات السالبة | ضمان سنتين شامل معتمد.",
          en: "110,000 RPM Digital Motor | 6 Interchangeable Attachments | Negative Ion Care | 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 5/5. 'بديل مذهل وفخم جداً للعلامات الغالية، يجفف ويسرح في 10 دقائق فقط.'",
          en: "5/5 Stars. 'Super salon blowout finish without burning hair. The volume brush is magical.'"
        }
      }
    },
    {
      id: "hd-05",
      name: { 
        ar: "مكواة فرد كلارا بالأيونات", 
        en: "Clara Pro Ionic Flat Iron" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 51.00,
      originalPriceUSD: 68.00,
      discountPercentage: 25,
      stock: 7,
      badge: { ar: "وفر 25%", en: "25% OFF" },
      rating: 4.95,
      reviewsCount: 84,
      images: [
        "https://images.unsplash.com/photo-1522337094346-290f26a0b58a?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "مكواة تمليس شعر انسيابية بالصفائح العريضة المطلية بالسيراميك التيتانيوم والأيونات السالبة، تمنحك شعراً حريرياً أملس من تمريرة واحدة.",
          en: "Precision titanium ceramic straightener with floating plates and continuous negative ion stream for ultra-glossy sleek finish in one stroke."
        },
        usage: {
          ar: "مرري المكواة بسلاسة على خصلة رفيعة بسرعة معتدلة من الجذور نحو الأطراف للحصول على شعر ناعم كالحرير.",
          en: "Glide gently down dry strands at a steady pace for salon-level mirror shine."
        },
        ingredientsOrSpecs: {
          ar: "صفائح تيتانيوم عائمة 1.25 إنش | تسخين سريع خلال 15 ثانية | حرارة تصل 230°C | ضمان سنتين شامل معتمد.",
          en: "1.25' Floating Titanium Plates | 15s Rapid Heat | Up to 230°C | 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 4.95/5. 'تخلي الشعر ناعم كأنه معالج بالبروتين وتبقى النتيجة ثابتة حتى مع الرطوبة.'",
          en: "4.95/5 Stars. 'Keeps frizzy hair ultra flat and sleek even in humid weather.'"
        }
      }
    },
    {
      id: "hd-06",
      name: { 
        ar: "مجفف أوكيما الذكي الهادئ", 
        en: "Okema Quiet Smart Dryer" 
      },
      category: { ar: "أجهزة الشعر", en: "Hair Devices" },
      basePriceUSD: 61.20,
      originalPriceUSD: 85.00,
      discountPercentage: 28,
      stock: 5,
      badge: { ar: "وفر 28%", en: "28% OFF" },
      rating: 5.0,
      reviewsCount: 76,
      images: [
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
      ],
      tabs: {
        description: {
          ar: "مجفف شعر رقمي خفيف الوزن بمحرك ذكي بدون فرش، يوفر تدفق هواء فائق السرعة مع خفض الضوضاء وحماية حرارية ذكية تمنع جفاف الأطراف.",
          en: "Lightweight smart brushless hair dryer generating hurricane airflow with whisper-quiet acoustics and microchip temperature regulation."
        },
        usage: {
          ar: "استخدمي فوهة التكثيف أو موزع الهواء الكيرلي مع التحكم بسرعات الهواء الثلاث لتجفيف صحي وسريع.",
          en: "Attach diffuser or styling nozzle to dry curly or straight styles efficiently."
        },
        ingredientsOrSpecs: {
          ar: "وزن خفيف 380 غرام فقط | 3 درجات حرارة + زر هواء بارد | فوهة مغناطيسية | ضمان سنتين شامل معتمد.",
          en: "Ultra-Lightweight 380g | 3 Speeds & Heat Settings + Cool Shot | Magnetic Nozzle | 2-Year Certified Warranty."
        },
        reviews: {
          ar: "تقييم 5/5. 'صوته واطي جداً ومريح لليد ويجفف شعري الطويل في 7 دقائق فقط.'",
          en: "5/5 Stars. 'Incredibly quiet yet powerful. Dries thick hair in under 8 minutes.'"
        }
      }
    },
    ...additionalSkincareProducts,
    ...additionalHairDevices,
    ...additionalGiftBundles
  ]
};
