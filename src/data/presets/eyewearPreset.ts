import type { PresetNiche } from '../siteTypes';

export const eyewearPreset: PresetNiche = {
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
      icon: "Award",
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
      badge: { ar: "ميزة AR مفعّلة", en: "AR Try-On" },
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
      badge: { ar: "ميزة AR مفعّلة", en: "AR Try-On" },
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
};
