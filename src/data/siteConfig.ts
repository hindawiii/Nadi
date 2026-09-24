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
  symbol: string;
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
  heroTitle: { ar: string; en: string };
  heroSubtitle: { ar: string; en: string };
  heroCtaPrimary: { ar: string; en: string };
  heroCtaSecondary: { ar: string; en: string };
  heroImage: string;
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
  };
  aboutStory: {
    title: { ar: string; en: string };
    body: { ar: string; en: string };
    image: string;
  };
  products: Product[];
}

export interface SiteConfig {
  security: {
    adminPin: string;
    developerPin: string;
    isDeveloperModeLocked: boolean;
  };
  currencies: Record<string, CurrencyConfig>;
  presets: Record<'cosmetics' | 'fashion' | 'eyewear' | 'electronics', PresetNiche>;
}

export const siteConfig: SiteConfig = {
  security: {
    adminPin: "2026",
    developerPin: "998877",
    isDeveloperModeLocked: false,
  },
  
  currencies: {
    SAR: { symbol: "ر.س", name: "SAR", rate: 3.75, country: "🇸🇦" },
    SDG: { symbol: "ج.س", name: "SDG", rate: 600.0, country: "🇸🇩" },
    USD: { symbol: "$", name: "USD", rate: 1.0, country: "🇺🇸" },
    EUR: { symbol: "€", name: "EUR", rate: 0.92, country: "🇪🇺" },
    GBP: { symbol: "£", name: "GBP", rate: 0.79, country: "🇬🇧" },
    AED: { symbol: "د.إ", name: "AED", rate: 3.67, country: "🇦🇪" },
    EGP: { symbol: "ج.م", name: "EGP", rate: 48.20, country: "🇪🇬" },
    KWD: { symbol: "د.ك", name: "KWD", rate: 0.31, country: "🇰🇼" },
    USDT: { symbol: "₮", name: "USDT", rate: 1.0, country: "🌐", isCrypto: true },
    BTC: { symbol: "₿", name: "BTC", rate: 0.000015, country: "🌐", isCrypto: true },
    ETH: { symbol: "Ξ", name: "ETH", rate: 0.00029, country: "🌐", isCrypto: true },
  },

  presets: {
    cosmetics: {
      id: "cosmetics",
      nicheLabel: { ar: "تجميل وعناية بالبشرة (نَـــــدِي - NADI)", en: "Cosmetics & Skincare (NADI)" },
      storeName: { ar: "نَـــــدِي", en: "NADI" },
      storeLogo: "",
      storeSlogan: { ar: "إشراقة طبيعية، تليق بك.", en: "Natural radiance, made for you." },
      topAnnouncement: {
        ar: "عناية طبيعية متكاملة بكل تفاصيل بشرتك. من الترطيب إلى النضارة، اكتشفي ما يلائمك بعناية مع نَـــــدِي. تسوّقي الآن",
        en: "Complete natural care for your skin. From hydration to radiance, discover the best for you with NADI. Shop Now"
      },
      heroTitle: { ar: "جمالكِ الطبيعي يبدأ من هنا", en: "Your Natural Beauty Starts Here" },
      heroSubtitle: {
        ar: "اكتشفي مجموعة نَـــــدِي (NADI) من منتجات العناية الطبيعية بالبشرة – نقاء نباتي وإشراقة تدوم وطاقة متجددة.",
        en: "Discover the NADI collection of natural botanical skincare – pure radiance, deep nourishment, and lasting glow."
      },
      heroCtaPrimary: { ar: "تسوّق الآن", en: "Shop Now" },
      heroCtaSecondary: { ar: "شاهد العروض", en: "View Offers" },
      heroImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
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
          icon: "Sparkles",
          title: { ar: "نتائج فعّالة", en: "Effective Results" },
          desc: { ar: "منتجات مصنوعة بعناية لأفضل النتائج المستدامة.", en: "Crafted with botanical care for visible results." },
        },
        {
          icon: "Truck",
          title: { ar: "شحن سريع", en: "Fast Delivery" },
          desc: { ar: "توصيل طلبك في أسرع وقت وبحرص فائق.", en: "Quick and delicate handling of your orders." },
        },
        {
          icon: "ShieldCheck",
          title: { ar: "أصلية 100%", en: "100% Authentic" },
          desc: { ar: "نضمن جودة وأصالة كل عبوة ومستحضر.", en: "Guaranteed authentic pure natural ingredients." },
        },
        {
          icon: "CreditCard",
          title: { ar: "دفع آمن ومريح", en: "Secure Payment" },
          desc: { ar: "ادفع عند الاستلام أو بأمان عبر الإنترنت.", en: "Cash on delivery or seamless online checkout." },
        },
      ],
      contactInfo: {
        address: { ar: "أم درمان – شارع الوادي، السودان", en: "Omdurman - Al Wadi Street, Sudan" },
        phone: "+249900776688",
        email: "nadi.skincare@gmail.com",
        whatsapp: "249900776688",
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
            "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
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
            "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80",
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
          name: { ar: "مجموعة Natural Bloom الكاملة (بوكس التوفير)", en: "Natural Bloom Complete Box" },
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
        }
      ]
    },

    fashion: {
      id: "fashion",
      nicheLabel: { ar: "ملابس وأزياء عصرية (Elegance)", en: "Modern Apparel & Fashion (Elegance)" },
      storeName: { ar: "إيليجانس للأزياء", en: "Elegance Fashion" },
      storeLogo: "",
      storeSlogan: { ar: "أرقى صيحات الموضة والإطلالات الفاخرة", en: "High Fashion Trends & Luxury Aesthetics" },
      topAnnouncement: {
        ar: "تألقي مع تشكيلة خريف وشتاء 2026 – شحن مجاني لكافة الطلبات فوق 200 ر.س!",
        en: "Elevate your wardrobe with Autumn/Winter 2026 – Free express delivery on orders over $50!"
      },
      heroTitle: { ar: "فخامة الحضور، وبساطة التفاصيل", en: "Pure Elegance, Defined in Every Stitch" },
      heroSubtitle: {
        ar: "تصاميم حصرية مختارة بعناية من كبرى دور الأزياء العالمية، مع أقمشة صوفية وحريرية طبيعية تدوم طويلاً.",
        en: "Curated luxury silhouettes crafted from Italian wool and sustainable silks. Designed for bold, effortless style."
      },
      heroCtaPrimary: { ar: "تصفح الكتالوج", en: "Explore Lookbook" },
      heroCtaSecondary: { ar: "العروض الحصرية", en: "Exclusive Deals" },
      heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      theme: {
        primaryBg: "bg-neutral-900",
        primaryText: "text-neutral-900",
        primaryHover: "hover:bg-neutral-800",
        accentColor: "#171717",
        badgeBg: "bg-amber-600",
        heroGradient: "from-stone-100 via-neutral-50 to-white",
      },
      valueProps: [
        {
          icon: "Sparkles",
          title: { ar: "خامات إيطالية نقية", en: "Italian Fabrics" },
          desc: { ar: "أقمشة مستوردة ومصنوعة بأعلى مقاييس الحياكة العالمية.", en: "Mastercrafted from premium virgin wool and silks." },
        },
        {
          icon: "Truck",
          title: { ar: "شحن وتوصيل للمنزل", en: "Doorstep Delivery" },
          desc: { ar: "توصيل سريع مع إمكانية القياس والتأكد قبل الاستلام.", en: "Express shipping with hassle-free sizing check." },
        },
        {
          icon: "ShieldCheck",
          title: { ar: "استبدال مجاني خلال 14 يوماً", en: "14-Day Free Exchange" },
          desc: { ar: "راحة تامة في استبدال المقاس أو الموديل مجاناً.", en: "Peace of mind with seamless instant exchanges." },
        },
        {
          icon: "CreditCard",
          title: { ar: "تقسيط ومرونة الدفع", en: "Flexible Payments" },
          desc: { ar: "خيارات دفع متنوعة وتقسيط بدون فوائد.", en: "Buy now, pay later with zero added interest." },
        },
      ],
      contactInfo: {
        address: { ar: "الرياض – بوليفارد رياض سيتي، المملكة العربية السعودية", en: "Riyadh - Boulevard City, Saudi Arabia" },
        phone: "+966500112233",
        email: "concierge@elegancefashion.com",
        whatsapp: "966500112233",
      },
      aboutStory: {
        title: { ar: "فلسفة إيليجانس للأزياء", en: "The Elegance Philosophy" },
        body: {
          ar: "انطلقت علامة إيليجانس لتعيد تعريف الملابس الفاخرة اليومية. نؤمن بأن الأناقة لا تحتاج إلى تكلف، بل تنبع من القصة المتقنة، والقصات الهندسية المريحة، والاهتمام الدقيق بأدق التفاصيل.",
          en: "Elegance was founded to redefine modern luxury wear. We believe true sophistication lies in clean tailoring, ergonomic cuts, and uncompromising textile purity."
        },
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
      },
      products: [
        {
          id: "fa-01",
          name: { ar: "سترة صوفية شتوية فاخرة (Overcoat)", en: "Luxury Italian Wool Overcoat" },
          category: { ar: "المعاطف والسترات", en: "Outerwear" },
          basePriceUSD: 85.0,
          originalPriceUSD: 100.0,
          discountPercentage: 15,
          stock: 3,
          badge: { ar: "جديد 2026", en: "New 2026" },
          rating: 4.9,
          reviewsCount: 76,
          images: [
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
          ],
          bundle: {
            title: { ar: "إطلالة شتوية متكاملة (Shop The Look)", en: "Complete Winter Look" },
            discount: 15,
            items: [
              {
                id: "fa-b1",
                name: { ar: "وشاح كشمير نقي بيج", en: "Pure Cashmere Scarf" },
                priceUSD: 25.0,
                image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80",
              },
              {
                id: "fa-b2",
                name: { ar: "قفازات جلد طبيعي مبطنة", en: "Lined Leather Gloves" },
                priceUSD: 18.0,
                image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80",
              }
            ]
          },
          tabs: {
            description: {
              ar: "معطف صوف إيطالي بقصة مستقيمة ومبطن بالحرير. يوفر دفئاً استثنائياً مع مظهر رسمي وكاجوال في آن واحد.",
              en: "Tailored virgin Italian wool overcoat with silk lining. Delivers remarkable warmth and timeless silhouette."
            },
            usage: {
              ar: "تنظيف جاف فقط للحفاظ على نعومة الصوف وتماسكه.",
              en: "Dry clean only to maintain pristine fabric structure and handfeel."
            },
            ingredientsOrSpecs: {
              ar: "90% صوف عذري خالص، 10% كشمير، بطانة حرير 100%.",
              en: "90% Virgin Wool, 10% Cashmere, 100% Silk Lining."
            },
            reviews: {
              ar: "خامة فوق الوصف وتفصيل فخم جداً. تستاهل كل ريال.",
              en: "Spectacular craftsmanship and premium drape. Exceeded expectations."
            }
          }
        },
        {
          id: "fa-02",
          name: { ar: "فستان سهرة حريري ميدي", en: "Silk Midi Evening Dress" },
          category: { ar: "الفساتين", en: "Dresses" },
          basePriceUSD: 65.0,
          originalPriceUSD: 80.0,
          discountPercentage: 18,
          stock: 5,
          badge: { ar: "إصدار محدود", en: "Limited Edition" },
          rating: 4.85,
          reviewsCount: 52,
          images: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
          ],
          tabs: {
            description: {
              ar: "فستان حرير منسدل بانسيابية مع حزام خصر رقيق يبرز جمال القوام في المناسبات الخاصة.",
              en: "Flowing silk dress with delicate contour waist tie, creating an effortless evening silhouette."
            },
            usage: {
              ar: "غسيل يدوي بماء بارد أو تنظيف جاف.",
              en: "Hand wash cold or gentle dry clean."
            },
            ingredientsOrSpecs: {
              ar: "حرير التوت الطبيعي 100%.",
              en: "100% Mulberry Silk."
            },
            reviews: {
              ar: "قصّة مريحة وأنيقة في اللبس وخامة باردة وناعمة.",
              en: "Flattering drape and ultra-breathable luxury handfeel."
            }
          }
        }
      ]
    },

    eyewear: {
      id: "eyewear",
      nicheLabel: { ar: "نظارات وبصريات ذكية (Vision)", en: "Smart & Luxury Eyewear (Vision)" },
      storeName: { ar: "رؤية للبصريات", en: "Vision Eyewear" },
      storeLogo: "",
      storeSlogan: { ar: "إطلالة فريدة وعدسات فائقة الدقة", en: "Precision Optics & Bespoke Frames" },
      topAnnouncement: {
        ar: "جرّب نظارتك الآن مباشرة عبر الكاميرا والواقع المعزز (AR Try-On)! شحن مجاني وفحص نظر منزلي.",
        en: "Experience our virtual AR Try-On directly on your camera! Free shipping and home try-on kits."
      },
      heroTitle: { ar: "رؤية فائقة، بتصميم يلهم حضورك", en: "Crystal Vision, Mastercrafted Frames" },
      heroSubtitle: {
        ar: "نظارات شمسية وطبية مصنوعة من التيتانيوم خفيف الوزن، مع عدسات استقطاب متقدمة وحماية UV400 كاملة.",
        en: "Aerospace-grade titanium frames with ultra-definition polarized optics and 100% UV400 sun shielding."
      },
      heroCtaPrimary: { ar: "تجربة الواقع المعزز (AR)", en: "Virtual AR Try-On" },
      heroCtaSecondary: { ar: "تصفح التشكيلة", en: "Shop Frames" },
      heroImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      theme: {
        primaryBg: "bg-slate-900",
        primaryText: "text-slate-900",
        primaryHover: "hover:bg-slate-800",
        accentColor: "#0f172a",
        badgeBg: "bg-cyan-600",
        heroGradient: "from-sky-50 via-slate-50 to-white",
      },
      valueProps: [
        {
          icon: "Sparkles",
          title: { ar: "محاكي الواقع المعزز (AR)", en: "AR Camera Try-On" },
          desc: { ar: "شاهدي كيف تبدو النظارة على وجهك مباشرة بكاميرا الجوال.", en: "Live virtual mirror right through your browser." },
        },
        {
          icon: "ShieldCheck",
          title: { ar: "حماية 100% UV400", en: "100% UV400 Shield" },
          desc: { ar: "عدسات مستقطبة تحمي عينيك من الأشعة الضارة وانعكاسات الطرق.", en: "Polarized glare reduction for vivid clarity." },
        },
        {
          icon: "Truck",
          title: { ar: "شحن آمن في علبة مصفحة", en: "Armored Case Shipping" },
          desc: { ar: "تصلك في حافظة جلدية صلبة ومنديل ميكروفايبر عالي النقاء.", en: "Delivered in premium hardshell cases." },
        },
        {
          icon: "CreditCard",
          title: { ar: "ضمان لمدة سنتين", en: "2-Year Warranty" },
          desc: { ar: "ضمان شامل ضد عيوب الصناعة والخدوش العرضية.", en: "Full coverage warranty on frames and lenses." },
        },
      ],
      contactInfo: {
        address: { ar: "دبي – سيتي ووك، الإمارات العربية المتحدة", en: "Dubai - City Walk, United Arab Emirates" },
        phone: "+971400223344",
        email: "support@vision-eyewear.com",
        whatsapp: "971400223344",
      },
      aboutStory: {
        title: { ar: "قصة رؤية للبصريات", en: "The Vision Heritage" },
        body: {
          ar: "تأسست رؤية لتجمع بين دقة البصريات الطبية وجماليات النظارات الفاخرة. نستخدم سبائك التيتانيوم والأسيتات الإيطالي لنوفر إطارات خفيفة لدرجة أنك تكاد لا تشعر بها على وجهك.",
          en: "Vision Eyewear was founded to marry optical precision with haute-couture aesthetics. Utilizing Japanese titanium and Italian Mazzucchelli acetate."
        },
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80",
      },
      products: [
        {
          id: "ey-01",
          name: { ar: "نظارة شمسية كلاسيك Aviator تيتانيوم", en: "Classic Titanium Aviator Sunglasses" },
          category: { ar: "نظارات شمسية", en: "Sunglasses" },
          basePriceUSD: 50.0,
          originalPriceUSD: 60.0,
          discountPercentage: 16,
          stock: 5,
          hasAR: true,
          badge: { ar: "ميزة AR مفعّلة 📷", en: "AR Try-On 📷" },
          rating: 4.92,
          reviewsCount: 110,
          images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
          ],
          bundle: {
            title: { ar: "طقم حماية العدسات الكامل", en: "Lens Care Kit Bundle" },
            discount: 15,
            items: [
              {
                id: "ey-b1",
                name: { ar: "بخاخ تنظيف العدسات النانوي ومنديل", en: "Nano Lens Cleaner Spray" },
                priceUSD: 10.0,
                image: "https://images.unsplash.com/photo-1582142839970-2b93cbacbe6b?auto=format&fit=crop&w=400&q=80",
              }
            ]
          },
          tabs: {
            description: {
              ar: "تصميم طيارين أسطوري خفيف الوزن بوزن 18 جرام فقط. عدسات استقطاب خضراء داكنة تمتص 99% من الوهج.",
              en: "Legendary aviator silhouette weighing only 18 grams. Polarized bottle-green lenses neutralizing harsh glare."
            },
            usage: {
              ar: "احفظها في العلبة المرفقة ونظفها بالمنديل المخصص دون استخدام مواد كيميائية حادة.",
              en: "Store inside the protective shell and wipe with the microfiber cloth."
            },
            ingredientsOrSpecs: {
              ar: "عرض العدسة: 58 ملم | جسر الأنف: 14 ملم | طول الذراع: 140 ملم | خامة: تيتانيوم ياباني خالص.",
              en: "Lens: 58mm | Bridge: 14mm | Temple: 140mm | Material: Pure Japanese Titanium."
            },
            reviews: {
              ar: "خفيفة لدرجة تنسى إنك لابسها والعدسات مريحة جداً للشمس والقيادة.",
              en: "Incredibly light, no pressure on the nose bridge. Perfect for driving under bright sunlight."
            }
          }
        },
        {
          id: "ey-02",
          name: { ar: "إطار أسيتات مستطيل أسود كلاسيكي", en: "Black Acetate Rectangular Frames" },
          category: { ar: "إطارات طبية وشمسية", en: "Optical Frames" },
          basePriceUSD: 42.0,
          originalPriceUSD: 50.0,
          discountPercentage: 15,
          stock: 7,
          hasAR: true,
          badge: { ar: "ميزة AR مفعّلة 📷", en: "AR Try-On 📷" },
          rating: 4.8,
          reviewsCount: 65,
          images: [
            "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
          ],
          tabs: {
            description: {
              ar: "إطار أسود فخم مصنوع يدوياً من الأسيتات الإيطالي. مناسب لتركيب العدسات الطبية أو عدسات الحماية من الشاشات الزرقاء.",
              en: "Handcrafted Italian acetate frame designed for prescription lenses or blue-light blocking filters."
            },
            usage: {
              ar: "يمكن تقديم مقاس النظر وسنقوم بتركيب العدسات خلال 48 ساعة.",
              en: "Upload your prescription for custom laboratory fitting within 48 hours."
            },
            ingredientsOrSpecs: {
              ar: "عرض العدسة: 54 ملم | جسر الأنف: 18 ملم | مفصلات فولاذية خماسية.",
              en: "Lens: 54mm | Bridge: 18mm | 5-barrel German steel hinges."
            },
            reviews: {
              ar: "فخامة عالية ولمعان أسود راقي جداً.",
              en: "Solid luxury feel with timeless architectural polish."
            }
          }
        }
      ]
    },

    electronics: {
      id: "electronics",
      nicheLabel: { ar: "أجهزة ذكية وإلكترونيات (TechZone)", en: "Smart Gadgets & Electronics (TechZone)" },
      storeName: { ar: "تيك زون للإلكترونيات", en: "TechZone Gadgets" },
      storeLogo: "",
      storeSlogan: { ar: "عالم الحلول الذكية والتقنيات المستقبلية", en: "Next-Gen Hardware & Smart Lifestyle" },
      topAnnouncement: {
        ar: "أقوى عروض الأجهزة الذكية لعام 2026 – ضمان معتمد لسنتين واستبدال فوري عند وجود أي عطل مصنعي!",
        en: "Unbeatable 2026 Tech Deals – 2-Year Official Warranty with Instant Replacements!"
      },
      heroTitle: { ar: "الذكاء بين يديك، بقوة المستقبل", en: "Next-Generation Intelligence in Your Hands" },
      heroSubtitle: {
        ar: "ساعات ذكية، سماعات عازلة للضوضاء، وشواحن فائقة السرعة بمعايير الجودة العالمية وأحدث معالجات 2026.",
        en: "Smartwatches, active noise-cancelling audio, and gallium-nitride ultra chargers engineered for top performance."
      },
      heroCtaPrimary: { ar: "استكشف الأجهزة", en: "Discover Gadgets" },
      heroCtaSecondary: { ar: "المواصفات الفنية", en: "Tech Specs" },
      heroImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
      theme: {
        primaryBg: "bg-blue-600",
        primaryText: "text-blue-600",
        primaryHover: "hover:bg-blue-500",
        accentColor: "#2563eb",
        badgeBg: "bg-blue-600",
        heroGradient: "from-blue-50 via-slate-50 to-white",
      },
      valueProps: [
        {
          icon: "Sparkles",
          title: { ar: "أحدث معالجات 2026", en: "2026 Chipsets" },
          desc: { ar: "استجابة فائقة السرعة وتوافق سلس مع كافة أنظمة Android و iOS.", en: "Blazing responsiveness with cross-platform pairing." },
        },
        {
          icon: "ShieldCheck",
          title: { ar: "ضمان سنتين شامل", en: "2-Year Full Warranty" },
          desc: { ar: "استبدال فوري بدون تأخير عند أي مشكلة مصنعية.", en: "Instant replacement guarantee for complete confidence." },
        },
        {
          icon: "Truck",
          title: { ar: "شحن سريع وتغليف آمن", en: "Express Insured Delivery" },
          desc: { ar: "تغليف محمي ضد الصدمات وشحن سريع خلال 24-48 ساعة.", en: "Shockproof packaging delivered to your door in 48 hours." },
        },
        {
          icon: "CreditCard",
          title: { ar: "دفع آمن أو عند الاستلام", en: "Secure Checkout" },
          desc: { ar: "خيارات دفع رقمية متعددة ودعم العملات المشفرة والدفع عند الاستلام.", en: "Supports crypto, local currencies, and cash on delivery." },
        },
      ],
      contactInfo: {
        address: { ar: "الكويت – مجمع الأفنيوز، الكويت", en: "Kuwait City - The Avenues, Kuwait" },
        phone: "+96522003344",
        email: "tech@techzone-gadgets.com",
        whatsapp: "96522003344",
      },
      aboutStory: {
        title: { ar: "من نحن في تيك زون", en: "About TechZone" },
        body: {
          ar: "تأسست تيك زون لتكون المرجع الأول لعشاق التقنية والأجهزة الذكية المتطورة. نوفر منتجات مختبرة بدقة تلبي أعلى معايير الأداء والاعتمادية.",
          en: "TechZone is dedicated to delivering certified cutting-edge consumer electronics tested for high endurance and seamless daily productivity."
        },
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      },
      products: [
        {
          id: "el-01",
          name: { ar: "ساعة ذكية برو بمستشعر صحي متطور (Ultra)", en: "Smart Watch Pro Ultra (Health Matrix)" },
          category: { ar: "الساعات الذكية", en: "Wearables" },
          basePriceUSD: 120.0,
          originalPriceUSD: 160.0,
          discountPercentage: 25,
          stock: 0, // Zero stock to test Smart Zero-Stock Override & WhatsApp Pre-order!
          badge: { ar: "نفد من المخزون مؤقتاً", en: "Sold Out - Pre-Order" },
          rating: 4.95,
          reviewsCount: 230,
          isTechSpecs: true,
          techSpecs: [
            { label: { ar: "عمر البطارية", en: "Battery Life" }, value: { ar: "تدوم حتى 7 أيام بالاستخدام المكثف", en: "Up to 7 days continuous heavy use" } },
            { label: { ar: "نوع الشاشة", en: "Display Type" }, value: { ar: "شاشة AMOLED قياس 1.78 بوصة بدقة 448x368", en: "1.78\" Ultra Retina AMOLED (1000 nits peak)" } },
            { label: { ar: "المستشعرات الصحية", en: "Health Sensors" }, value: { ar: "تخطيط نبضات القلب ECG، قياس SpO2، تتبع النوم العميق", en: "Optical Heart Rate, SpO2, Sleep Stages, Stress Monitoring" } },
            { label: { ar: "مقاومة الماء", en: "Water Resistance" }, value: { ar: "معيار IP68 حتى عمق 50 متراً (5ATM)", en: "IP68 & 5ATM Swimming Certified" } },
            { label: { ar: "الاتصال والتوافق", en: "Connectivity" }, value: { ar: "Bluetooth 5.3، يدعم المكالمات عبر الساعة، Android و iOS", en: "Bluetooth 5.3, Built-in Mic & Speaker for Calls" } },
          ],
          images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
          ],
          bundle: {
            title: { ar: "حزمة الشحن والحماية الرياضية", en: "Power & Sports Armor Bundle" },
            discount: 15,
            items: [
              {
                id: "el-b1",
                name: { ar: "قاعدة شحن لاسلكي مغناطيسية", en: "Magnetic Wireless Dock" },
                priceUSD: 20.0,
                image: "https://images.unsplash.com/photo-1622445262464-84b14e3b1c67?auto=format&fit=crop&w=400&q=80",
              }
            ]
          },
          tabs: {
            description: {
              ar: "الساعة الذكية المتكاملة لمتابعة الرياضة والصحة والاتصالات. هيكل من الألمنيوم الفضائي وشاشة أموليد فائقة السطوع تحت أشعة الشمس.",
              en: "The definitive health and athletic smartwatch featuring aerospace aluminum build and always-on 1000-nit AMOLED screen."
            },
            usage: {
              ar: "تتزامن تلقائياً عبر تطبيق TechZone Health وتدعم التنبيهات وإجراء المكالمات الهاتفية بوضوح تام.",
              en: "Syncs with iOS and Android via the companion app with full notification and cellular call answering support."
            },
            ingredientsOrSpecs: {
              ar: "معالج ثنائي النواة عالي الكفاءة، بطارية ليثيوم 420mAh، وزن 38 جرام.",
              en: "Dual-core energy efficient processor, 420mAh cell, 38g net weight."
            },
            reviews: {
              ar: "أفضل ساعة جربتها، دقيقة جداً في حساب نبضات القلب والبطارية تقعد أسبوع بدون شحن!",
              en: "Incredible battery endurance and spot-on sensor readings. Easily rivals flagship models."
            }
          }
        },
        {
          id: "el-02",
          name: { ar: "سماعات رأس لاسلكية عازلة للضوضاء ANC", en: "Pro Active Noise Cancelling Headphones" },
          category: { ar: "الصوتيات والموسيقى", en: "Audio" },
          basePriceUSD: 95.0,
          originalPriceUSD: 125.0,
          discountPercentage: 24,
          stock: 4,
          badge: { ar: "عزل هجين 40dB", en: "Hybrid ANC" },
          rating: 4.88,
          reviewsCount: 180,
          isTechSpecs: true,
          techSpecs: [
            { label: { ar: "تقنية العزل", en: "Noise Cancellation" }, value: { ar: "عزل ضوضاء هجين نشط يصل إلى 40 ديسيبل", en: "Active Hybrid ANC up to -40dB with Transparency Mode" } },
            { label: { ar: "البطارية", en: "Battery Life" }, value: { ar: "50 ساعة تشغيل متواصل (40 ساعة مع تشغيل ANC)", en: "50 hours playback (40 hours with ANC activated)" } },
            { label: { ar: "المحركات الصوتية", en: "Audio Drivers" }, value: { ar: "مشغلات تيتانيوم 40 ملم بصوت نقي Hi-Res", en: "40mm custom titanium dynamic diaphragms, Hi-Res Audio" } },
          ],
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
          ],
          tabs: {
            description: {
              ar: "استمتع بعزلة موسيقية تامة ونقاء صوت استوديو استثنائي مع وسائد أذن ميموري فوم مريحة للاستخدام الطويل.",
              en: "Pure acoustic isolation with custom 40mm titanium drivers and breathable memory foam earcups."
            },
            usage: {
              ar: "تدعم التوصيل بجهازين في وقت واحد مع شحن سريع يمنح 5 ساعات تشغيل بشحن 10 دقائق فقط.",
              en: "Multipoint Bluetooth connection and ultra-fast charge (10 mins equals 5 hours playback)."
            },
            ingredientsOrSpecs: {
              ar: "وزن 245 جرام، ميكروفونات رباعية بتقنية الذكاء الاصطناعي لتنقية المكالمات.",
              en: "245 grams, quad ENC microphones with AI voice isolation."
            },
            reviews: {
              ar: "عزل الضوضاء جبار في الطيارة والمكتب، والبيس متوازن ومريح جداً للأذن.",
              en: "Stunning active noise cancellation during flights and office hours. Balanced punchy bass."
            }
          }
        }
      ]
    }
  }
};
