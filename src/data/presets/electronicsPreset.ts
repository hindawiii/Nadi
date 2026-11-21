import type { PresetNiche } from '../siteTypes';

export const electronicsPreset: PresetNiche = {
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
      icon: "Award",
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
};
