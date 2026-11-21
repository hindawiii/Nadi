import type { PresetNiche } from '../siteTypes';

export const fashionPreset: PresetNiche = {
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
      icon: "Award",
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
};
