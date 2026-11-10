import type { Product } from './siteConfig';

export interface HairDeviceProduct extends Product {
  subCategory?: 'waving' | 'straightener' | 'dryer';
}

export const additionalHairDevices: HairDeviceProduct[] = [
  // 1. WAVING & CURLING (تجعيد وتمويج)
  {
    id: "hd-07",
    subCategory: 'waving',
    name: { ar: "مكواة التمويج الحلزونية الذكية سيراميك 32مم", en: "Smart Spiral Ceramic Curling Iron - 32mm" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 24.5,
    originalPriceUSD: 35.0,
    discountPercentage: 30,
    stock: 7,
    badge: { ar: "ويفي طبيعي 🌊", en: "Natural Wave 🌊" },
    rating: 4.9,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة تمويج أسطوانية عريضة 32مم مطلية بالسيراميك والتورمالين، تمنحك خصلات ويفي ناعمة وعريضة كإطلالات الصالونات دون تجعد.",
        en: "32mm wide ceramic barrel curling iron generating soft, cascading Hollywood waves with glossy frizz-free finish."
      },
      usage: {
        ar: "تلف الخصلة حول الأسطوانة لمدة 6 إلى 8 ثوانٍ ثم تفلت برفق وتترك لتبرد قبل تمشيطها بأصابع اليد.",
        en: "Wrap strand around barrel for 6-8 seconds, release gently, and allow to cool before finger-combing."
      },
      ingredientsOrSpecs: {
        ar: "قطر 32مم | تسخين سريع PTC خلال 30 ثانية | حرارة تصل 210°C | سلك دوار 360° | ضمان سنتين شامل معتمد.",
        en: "32mm Barrel | 30s Rapid PTC Heating | Max 210°C | 360° Swivel Cable | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'حجم الويفي يجنن وثابت لليوم الثاني بدون ما يتفكك الشعر!'",
        en: "4.9/5 Stars: 'Gorgeous voluminous waves that held their bounce into day two!'"
      }
    }
  },
  {
    id: "hd-08",
    subCategory: 'waving',
    name: { ar: "جهاز كيرلي أوتوماتيكي دوار بالأشعة تحت الحمراء", en: "Auto-Rotating Infrared Hair Curler" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 36.0,
    originalPriceUSD: 48.0,
    discountPercentage: 25,
    stock: 5,
    badge: { ar: "لف ذاتي ذكي 🔄", en: "Auto-Rotate 🔄" },
    rating: 5.0,
    reviewsCount: 145,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "جهاز تجعيد ذاتي يسحب خصلة الشعر ويلفها بضغطة زر واحدة داخل غرفة سيراميك معزولة تماماً تمنع حروق اليد والوجه وتوزع حرارة الأشعة تحت الحمراء.",
        en: "One-touch automated spinning curler drawing hair gently into a heat-shielded infrared ceramic chamber."
      },
      usage: {
        ar: "ضعي خصلة بعرض 2 سم في الفتحة واضغطي زر الدوران، انتظري صفير التنبيه ثم اسحبي الجهاز برفق لأسفل.",
        en: "Place a 2cm strand in chamber, press rotation button, wait for beep timer, and glide downward."
      },
      ingredientsOrSpecs: {
        ar: "دوران ثنائي الاتجاه (يمين/يسار) | مؤقت ذكي 8-12 ثانية | 4 مستويات حرارة | عازل حراري آمن 100% | ضمان سنتين.",
        en: "Bi-directional Rotation | Smart 8-12s Timer | 4 Heat Settings | 100% Burn-Proof Guard | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'أسهل جهاز كيرلي بالتاريخ، سويت شعري كامل في 10 دقائق وبدون أي خوف من الحروق.'",
        en: "5/5 Stars: 'Easiest curler ever. Styled full thick hair in 10 minutes with zero burn anxiety.'"
      }
    }
  },
  {
    id: "hd-09",
    subCategory: 'waving',
    name: { ar: "مكواة تمويج عريضة بأسطوانات التورمالين الرباعية", en: "Quad-Barrel Deep Mermaid Waver" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 28.0,
    originalPriceUSD: 40.0,
    discountPercentage: 30,
    stock: 9,
    badge: { ar: "ويفي عميق 🧜‍♀️", en: "Deep Mermaid 🧜‍♀️" },
    rating: 4.8,
    reviewsCount: 88,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة تمويج ميرميد بأربعة قضبان حرارية عريضة تضغط مساحات واسعة من الشعر في ضغطة واحدة، وتمنحك كيرلي الشاطئ الإنسيابي بلمعان فائق.",
        en: "Deep 4-barrel mermaid wave styler clamping wide sections simultaneously for rapid beachy textures."
      },
      usage: {
        ar: "اضغطي الألواح على الشعر لمدة 5 ثوانٍ ثم انقليها للأسفل حتى نهاية الخصلة.",
        en: "Clamp for 5 seconds on section, open and overlap slightly downward towards the tips."
      },
      ingredientsOrSpecs: {
        ar: "ألواح تورمالين سيراميك رباعية | شاشة ديجيتال LCD | حرارة 160°C - 230°C | إغلاق تلقائي بعد 60 دقيقة | ضمان سنتين.",
        en: "Quad Tourmaline Ceramic Plates | Digital LCD | 160°C - 230°C | 60-min Auto Shut-off | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'تختصر نصف وقت التصفيف لأن مساحة الألواح عريضة جداً وتموج الشعر بسرعة.'",
        en: "4.8/5 Stars: 'Cuts styling time in half due to the wide clamping surface. Super fast!'"
      }
    }
  },
  {
    id: "hd-10",
    subCategory: 'waving',
    name: { ar: "جهاز لف الشعر اللاسلكي الذكي بتقنية الأيونات", en: "Cordless Smart Ionic Portable Auto-Curler" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 32.5,
    originalPriceUSD: 45.0,
    discountPercentage: 28,
    stock: 6,
    badge: { ar: "لاسلكي وقابل للشحن 🔋", en: "Rechargeable 🔋" },
    rating: 4.9,
    reviewsCount: 130,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "جهاز كيرلي محمول يعمل ببطارية ليثيوم قابلة للشحن عبر USB-C، مثالي للشنطة والسفر وتعديل التسريحة في أي مكان بدون قيود الأسلاك.",
        en: "Wireless rechargeable curling wand powered by high-capacity battery and USB-C fast charging."
      },
      usage: {
        ar: "يشحن الجهاز بالكامل، ثم تختارين درجة الحرارة واتجاه اللف، وتدخلين خصلة الشعر ليلتف تلقائياً.",
        en: "Charge fully, set desired temperature and curl direction, insert strand for automated salon curl."
      },
      ingredientsOrSpecs: {
        ar: "بطارية ليثيوم 5200mAh تدوم 60 دقيقة | منفذ شحن Type-C | شاشة عرض OLED | وزن خفيف 370 غرام | ضمان سنتين.",
        en: "5200mAh Lithium Cell (60 min runtime) | USB-C Port | OLED Display | 370g Weight | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'أنقذني في حفلة زفاف! عدلت تسريحتي في السيارة بكل سهولة وبدون سلك كهرباء.'",
        en: "4.9/5 Stars: 'A lifesaver at events! Restyled my hair in the car effortlessly without cords.'"
      }
    }
  },
  {
    id: "hd-11",
    subCategory: 'waving',
    name: { ar: "مكواة ويفي شاطئي عميق 3 أسطوانات بشاشة LED", en: "Triple-Barrel LED Deep Beach Waver - 28mm" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 26.0,
    originalPriceUSD: 38.0,
    discountPercentage: 31,
    stock: 11,
    badge: { ar: "الأكثر طلباً ⭐", en: "Trending ⭐" },
    rating: 4.9,
    reviewsCount: 167,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة ويفي شاطئي احترافية مقاس 28مم مزودة بشاشة تحكم LED رقمية وطبقة سيراميك زيت الأرغان لمنع تقصف الأطراف وجفافها.",
        en: "28mm deep beach waver infused with argan oil ceramic coating and precision LED temperature regulator."
      },
      usage: {
        ar: "قسمي الشعر خصلات متساوية، ثبتي المكواة 6 ثوانٍ على كل جزء من أعلى لأسفل.",
        en: "Work in horizontal sections, clamping for 6 seconds down each hair length."
      },
      ingredientsOrSpecs: {
        ar: "3 أسطوانات 28مم سيراميك أرغان | شاشة LED دقيقة | تسخين سريع 20 ثانية | مقبض مريح مضاد للانزلاق | ضمان سنتين.",
        en: "Argan-Ceramic 28mm Barrels | LED Readout | 20s Flash Heat | Anti-Slip Grip | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'المكواة خفيفة على اليد والحرارة تتوزع بانتظام على كامل الخصلة بدون ما تحرق الشعر.'",
        en: "4.9/5 Stars: 'Very lightweight in hand and heat distributes evenly without scorching strands.'"
      }
    }
  },
  {
    id: "hd-12",
    subCategory: 'waving',
    name: { ar: "جهاز فير تمويج الشعر السيراميكي المخروطي 19-32مم", en: "Conical Ceramic Wand Styler (19-32mm)" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 21.0,
    originalPriceUSD: 30.0,
    discountPercentage: 30,
    stock: 8,
    badge: { ar: "كيرلي متدرج ✨", en: "Tapered Wand ✨" },
    rating: 4.8,
    reviewsCount: 94,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فير مخروطي يمنحك تجعيدات طبيعية تبدأ عريضة من الجذور وتضيق عند الأطراف لحركة طبيعية وكثافة جذابة تدوم طويلاً.",
        en: "Tapered conical curling wand creating natural graduated ringlets that taper toward ends."
      },
      usage: {
        ar: "ارتدي القفاز العازل الحراري، ولفي الخصلة حول العصا المخروطية من القاعدة للأعلى لمدة 6 ثوانٍ.",
        en: "Wear included thermal glove, wind section from base to tip for 6 seconds, release smoothly."
      },
      ingredientsOrSpecs: {
        ar: "مخروط متدرج 19 إلى 32مم | قفاز حراري مرفق مجاناً | طرف بارد عازل | حرارة حتى 220°C | ضمان سنتين.",
        en: "19-32mm Tapered Barrel | Free Heat Glove | Cool Safety Tip | Up to 220°C | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'الكيرلي شكله طبيعي جداً مثل شعر البلوقرز ويثبت يومين كاملين.'",
        en: "4.8/5 Stars: 'Super natural beach ringlets that look effortless and last 48 hours.'"
      }
    }
  },
  {
    id: "hd-13",
    subCategory: 'waving',
    name: { ar: "مكواة كيرلي هوليوودي احترافية مع قفاز حراري", en: "Hollywood Glamour Large Curling Wand - 38mm" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 27.5,
    originalPriceUSD: 38.0,
    discountPercentage: 27,
    stock: 6,
    badge: { ar: "تمويج هوليوودي 🌟", en: "Hollywood Waves 🌟" },
    rating: 5.0,
    reviewsCount: 118,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "أسطوانة تيتانيوم ضخمة 38مم مصممة خصيصاً للتسريحات الكلاسيكية الفاخرة، والتمويجات العريضة المفرودة لمناسبات السهرة والزواجات.",
        en: "Extra-large 38mm titanium barrel engineered for red-carpet voluminous glamour waves and sleek bounce."
      },
      usage: {
        ar: "لفي خصلات عريضة باتجاه واحد للحصول على تسريحة ويفي هوليوودي متصلة ومتناسقة.",
        en: "Wrap wide sections in a uniform direction to achieve seamless, continuous red-carpet waves."
      },
      ingredientsOrSpecs: {
        ar: "أسطوانة تيتانيوم مصقولة 38مم | توزيع حراري متوازن MCH | 5 درجات حرارة | سلك احترافي 2.5 متر | ضمان سنتين.",
        en: "38mm Mirror Titanium | MCH Balanced Heat | 5 Heat Modes | 2.5m Pro Swivel Cord | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'المقاس المثالي للشعر الطويل! يعطي فوليوم وفخامة غير طبيعية بدون تشابك.'",
        en: "5/5 Stars: 'The perfect size for long hair. Imparts incredible volume and red carpet elegance.'"
      }
    }
  },
  {
    id: "hd-14",
    subCategory: 'waving',
    name: { ar: "جهاز تمويج دقيق للشعر القصير والمتوسط 16مم", en: "Precision Slim Curling Wand (16mm)" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 19.5,
    originalPriceUSD: 28.0,
    discountPercentage: 30,
    stock: 10,
    badge: { ar: "كيرلي دقيق 🌿", en: "Tight Curls 🌿" },
    rating: 4.8,
    reviewsCount: 79,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فير رفيع 16مم مصمم بدقة لتمويج وتجعيد خصلات الشعر القصير، القصات الفرنسية، وتحديد الشعر الإفريقي والكيرلي الطبيعي.",
        en: "Ultra-slim 16mm barrel curler sculpted for short bobs, defining coils, and tight springy curls."
      },
      usage: {
        ar: "لفي خصلات صغيرة حول العصا الدقيقة لمدة 4 ثوانٍ للحصول على كيرلي متماسك ومحدد.",
        en: "Wrap slender sections for 4 seconds for maximum spring and definition."
      },
      ingredientsOrSpecs: {
        ar: "عصا سيراميك رفيعة 16مم | وزن خفيف مريح | حرارة سريعة حتى 200°C | عازل طرفي بارد | ضمان سنتين.",
        en: "16mm Ultra-Slim Ceramic | Ergonomic Balance | Flash 200°C Heat | Cool Safety Tip | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'شعري قصير كاريه وكان صعب ألاقيله فير يناسبه، هذا الجهاز جاء بالملي!'",
        en: "4.8/5 Stars: 'My bob haircut was hard to style with bulky irons; this slim wand is flawless!'"
      }
    }
  },
  {
    id: "hd-15",
    subCategory: 'waving',
    name: { ar: "مكواة ريترو ويفي كلاسيك لحفلات السهرة", en: "Classic Vintage Deep Finger Waver" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 25.5,
    originalPriceUSD: 36.0,
    discountPercentage: 29,
    stock: 7,
    badge: { ar: "ريترو كلاسيك 💃", en: "Vintage Glam 💃" },
    rating: 4.9,
    reviewsCount: 92,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة التمويج العميقة لتسريحات الريترو الفينتاج، تمنح الشعر تموجات هندسية ثابتة ولامعة تعيد سحر التسريحات الكلاسيكية.",
        en: "Vintage deep finger wave iron embossing sharp, structured classic waves with mirror sheen."
      },
      usage: {
        ar: "ثبتي المكواة على الشعر الممشط بزاوية أفقية واضغطي لمدة 6 ثوانٍ مع تكرار النزول تدريجياً.",
        en: "Clamp horizontally on smoothed hair for 6 seconds, stepping progressively down."
      },
      ingredientsOrSpecs: {
        ar: "حواف تمويج هندسية عميقة | صفائح سيراميك أكسيد التيتانيوم | حرارة حتى 220°C | ضمان سنتين شامل معتمد.",
        en: "Deep Geometric Contours | Titanium Oxide Ceramic Plates | Temp up to 220°C | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تسريحة الريترو طلعت خرافية وثابتة في زواج أختي الكل سألني عنها.'",
        en: "4.9/5 Stars: 'Turned out magnificent for my sister’s wedding. Everyone complimented my hair!'"
      }
    }
  },
  {
    id: "hd-16",
    subCategory: 'waving',
    name: { ar: "جهاز تجعيد أوتوماتيكي بحجرة سيراميك عازلة للحرارة", en: "Burn-Proof Smart Auto Hair Curler Chamber" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 34.0,
    originalPriceUSD: 46.0,
    discountPercentage: 26,
    stock: 8,
    badge: { ar: "حماية 100% ضد الحرق 🛡️", en: "100% Safe 🛡️" },
    rating: 5.0,
    reviewsCount: 154,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "غرفة تجعيد سيراميكية مغلقة بالكامل لا تلامس أصابع اليد أو الأذن أبداً، تلف الشعر أوتوماتيكياً وتصدر صوت تنبيه عند اكتمال الكيرلي.",
        en: "Fully enclosed heat-isolated curling chamber safeguarding skin while automatically winding flawless curls."
      },
      usage: {
        ar: "أدخلي الخصلة في مجرى الجهاز، اضغطي الزر حتى يتوقف الجهاز عن اللف، ثم اسحبيه بعد الرنين.",
        en: "Slot hair strand into funnel, hold curl button until rotation stops, release upon tone."
      },
      ingredientsOrSpecs: {
        ar: "عزل حراري مزدوج | تحكم بـ 3 اتجاهات تجعيد | 6 درجات حرارة من 150°C إلى 200°C | ضمان سنتين شامل معتمد.",
        en: "Double Thermal Insulation | 3 Curl Directions | 6 Temp Steps (150-200°C) | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'كنت دائماً أخاف من الفير وأحرق أصابعي، هذا الجهاز حلي مشكلتي نهائياً!'",
        en: "5/5 Stars: 'I was always terrified of curling irons burning my skin. This completely solved it!'"
      }
    }
  },

  // 2. STRAIGHTENING & SMOOTHING (تمليس وفرد وتنعيم)
  {
    id: "hd-17",
    subCategory: 'straightener',
    name: { ar: "مكواة تمليس الشعر الكورية بالألواح التيتانيوم العريضة", en: "Korean Wide Titanium Hair Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 29.5,
    originalPriceUSD: 42.0,
    discountPercentage: 30,
    stock: 12,
    badge: { ar: "تيتانيوم احترافي ⚡", en: "Pro Titanium ⚡" },
    rating: 4.9,
    reviewsCount: 180,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة تمليس احترافية بألواح تيتانيوم كورية فائقة النعومة مقاس 45مم، تفرد الشعر الكثيف والمجعد من سحبة واحدة وتتركه مفروداً كالحرير.",
        en: "45mm extra-wide Korean titanium flat iron gliding effortlessly through coarse hair in a single pass."
      },
      usage: {
        ar: "مرري المكواة بسلاسة من الجذور إلى الأطراف بسرعة متوسطة دون توقف متكرر في نفس النقطة.",
        en: "Glide continuously from root to tip at steady pace for silky-smooth finish in one stroke."
      },
      ingredientsOrSpecs: {
        ar: "ألواح تيتانيوم مصقولة 45مم | تسخين سريع MCH خلال 15 ثانية | حرارة تصل 235°C | سلك دوار 360° | ضمان سنتين.",
        en: "45mm Mirror Titanium | 15s MCH Flash Heat | Up to 235°C | 360° Swivel Cable | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'سحبة واحدة تكفي بدون تكرار! مريحة جداً للشعر الثقيل والخشن.'",
        en: "4.9/5 Stars: 'One pass is all it takes! Incredible glide through thick, stubborn hair.'"
      }
    }
  },
  {
    id: "hd-18",
    subCategory: 'straightener',
    name: { ar: "فرشاة الفرد والتمليس الحرارية الأيونية مع أسنان السيراميك", en: "Ionic Ceramic Heated Straightening Brush" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 23.0,
    originalPriceUSD: 32.0,
    discountPercentage: 28,
    stock: 14,
    badge: { ar: "فرد وتمشيط سريع ⏱️", en: "Quick Brush ⏱️" },
    rating: 4.8,
    reviewsCount: 162,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فرشاة حرارية تدمج قوة المكواة مع سهولة التمشيط اليومي. تفرد الشعر بلطف وتحافظ على حجمه الطبيعي دون أن تجعله لاصقاً بالرأس.",
        en: "Heated detangling paddle brush combining ceramic heat with ionic generators for natural straight volume."
      },
      usage: {
        ar: "مشطي الشعر المغسول والمجفف ببطء من الداخل للخارج لتمليس طبيعي فوري في 5 دقائق.",
        en: "Slowly brush through dry hair from root to tip, holding hair ends taut for best tension."
      },
      ingredientsOrSpecs: {
        ar: "أسنان سيراميك ثلاثية الأبعاد مضادة للحروق | مولد أيونات سالبة | 5 مستويات حرارة (130°C-200°C) | ضمان سنتين.",
        en: "3D Anti-Scald Ceramic Bristles | Built-in Ion Emitter | 5 Heat Settings (130-200°C) | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'تختصر تجهيز الصباح للدوام في 5 دقائق، تعطي مظهر شعر صحي ومفرود بدون بهتان.'",
        en: "4.8/5 Stars: 'Cuts my morning routine to 5 minutes, leaves hair looking naturally sleek with great body.'"
      }
    }
  },
  {
    id: "hd-19",
    subCategory: 'straightener',
    name: { ar: "مكواة فرد الشعر بالبخار المعالج وزيت الأرغان", en: "Argan Steam Infusion Hair Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 33.5,
    originalPriceUSD: 48.0,
    discountPercentage: 30,
    stock: 6,
    badge: { ar: "فرد بالبخار المرطب 💨", en: "Steam Infusion 💨" },
    rating: 4.9,
    reviewsCount: 139,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "تقنية البخار الدقيق المعالج التي تضخ الرطوبة العميقة إلى خصلات الشعر أثناء الفرد، لتمنع التقصف وتحافظ على لمعان الشعر المصبوغ والتالف.",
        en: "Ultrasonic vapor flat iron infusing nano-steam droplets into strands during styling to lock moisture."
      },
      usage: {
        ar: "يملأ الخزان المدمج بالماء المقطر أو سيروم الأرغان المرفق، ثم تمرر المكواة مع تدفق البخار المستمر.",
        en: "Fill tank with distilled water or argan essence, glide slowly as conditioned steam releases."
      },
      ingredientsOrSpecs: {
        ar: "خزان بخار مدمج | ألواح سيراميك تورمالين عائمة | تحكم في تدفق البخار | حرارة تصل 230°C | ضمان سنتين.",
        en: "Integrated Vapor Tank | Floating Tourmaline Plates | Steam Flow Control | Max 230°C | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'شعري مصبوغ وكان ينحرق من المكواة العادية، البخار خلاه رطب وناعم ويلمع.'",
        en: "4.9/5 Stars: 'My color-treated hair used to dry out with regular flat irons; steam keeps it soft and gleaming.'"
      }
    }
  },
  {
    id: "hd-20",
    subCategory: 'straightener',
    name: { ar: "ملمس الشعر النانوي بالأيونات السالبة ضد التطاير", en: "Nano-Titanium Anti-Frizz Ionic Flat Iron" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 27.0,
    originalPriceUSD: 38.0,
    discountPercentage: 29,
    stock: 11,
    badge: { ar: "ضد التطاير 🌿", en: "Anti-Frizz 🌿" },
    rating: 4.8,
    reviewsCount: 125,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة متقدمة تطلق 10 ملايين أيون سالب في الثانية لغلق مسام الشعرة ومنع الكهرباء الساكنة والتطاير الناتج عن رطوبة الجو.",
        en: "High-density negative ion emitter sealing hair cuticles against atmospheric humidity and static flyaways."
      },
      usage: {
        ar: "استخدميها على شعر جاف تماماً للحصول على فرد فائق النعومة بمظهر زجاجي لامع.",
        en: "Apply to dry hair for instant mirror-like sleekness that repels ambient moisture."
      },
      ingredientsOrSpecs: {
        ar: "مولد أيونات نانوية مكثف | صفائح تيتانيوم عائمة 1 بوصة | شاشة رقمية دقيقة | سلك بطول 2.5 متر | ضمان سنتين.",
        en: "Nano-Ion Generator | 1-inch Floating Titanium | Precision Digital Display | 2.5m Cable | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'تثبت الشعر مفرود حتى في رطوبة الصيف بدون ما ينفش!'",
        en: "4.8/5 Stars: 'Keeps hair sleek even in humid summer weather without puffing up!'"
      }
    }
  },
  {
    id: "hd-21",
    subCategory: 'straightener',
    name: { ar: "مكواة فرد الشعر الذكية بمستشعر الحرارة الديناميكي", en: "Smart Dynamic Heat Sensor Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 35.0,
    originalPriceUSD: 48.0,
    discountPercentage: 27,
    stock: 5,
    badge: { ar: "مستشعر ذكي 🧠", en: "Smart Sensor 🧠" },
    rating: 5.0,
    reviewsCount: 168,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "تقنية ميكروبروسيسور تقرأ رطوبة وسمك الشعر 250 مرة في الثانية وتعدل الحرارة تلقائياً لتجنب الحروق والتلف الحراري بنسبة 70%.",
        en: "Microchip technology scanning hair thickness 250 times per second, dynamically tuning thermal output."
      },
      usage: {
        ar: "شغلي الوضع الذكي التلقائي ومرري المكواة، وسيتكفل الجهاز بضبط درجة الحرارة الأنسب لشعرك.",
        en: "Activate smart mode and glide; the device automatically regulates heat to your unique hair profile."
      },
      ingredientsOrSpecs: {
        ar: "مستشعر حراري ذكي متواصل | ألواح سيراميك معالجة بالحرير | إغلاق ذاتي ذكي | تحكم لمسي | ضمان سنتين شامل معتمد.",
        en: "Dynamic Sensor Chip | Silk-Infused Ceramic | Auto Smart Shutoff | Touch Control | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'أذكى مكواة استخدمتها بحياتي، ما فيها أي ريحة حرق شعر أبداً وتعطي لمعة حريرية.'",
        en: "5/5 Stars: 'Smartest flat iron ever. Zero burnt hair smell and provides ultra-luxurious shine.'"
      }
    }
  },
  {
    id: "hd-22",
    subCategory: 'straightener',
    name: { ar: "مشط التمليس الحراري المزدوج السريع", en: "Double-Sided Heated Comb Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 20.5,
    originalPriceUSD: 29.0,
    discountPercentage: 29,
    stock: 13,
    badge: { ar: "فرد الجذور ⚡", en: "Root Precision ⚡" },
    rating: 4.8,
    reviewsCount: 110,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مشط حراري بأسنان سيراميكية دقيقة تصل لأقرب نقطة من جذور الشعر دون لمس فروة الرأس، مثالي لفرد منابت الشعر والبيبي هير.",
        en: "Fine-toothed heated ceramic comb reaching close to hair roots safely, mastering edges and baby hairs."
      },
      usage: {
        ar: "مرري المشط ببطء من منبت الشعر للخارج مع شد الخصلة لضبط حواف الشعر ومقدمة الرأس.",
        en: "Slowly comb from hairline outwards while maintaining gentle tension for sleek edges."
      },
      ingredientsOrSpecs: {
        ar: "أسنان سيراميك نحيفة عالية الكثافة | واقي حماية فروة الرأس | حرارة سريعة حتى 210°C | وزن مدمج | ضمان سنتين.",
        en: "High-Density Ceramic Teeth | Scalp Heat Guard | Rapid 210°C Heat | Lightweight | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ممتاز لبيبي هير ومنابت الشعر اللي المكواة العريضة ما تقدر توصل لها.'",
        en: "4.8/5 Stars: 'Excellent for baby hairs and hairline edges that standard flat irons cannot reach.'"
      }
    }
  },
  {
    id: "hd-23",
    subCategory: 'straightener',
    name: { ar: "مكواة تمليس صغيرة للسفر والشنطة مع قفل أمان", en: "Mini Compact Travel Flat Iron with Safety Lock" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 16.5,
    originalPriceUSD: 24.0,
    discountPercentage: 31,
    stock: 18,
    badge: { ar: "حجم ميني للسفر ✈️", en: "Travel Mini ✈️" },
    rating: 4.8,
    reviewsCount: 140,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة ميني خفيفة الوزن بطول 18 سم فقط، تدخل بسهولة في حقيبة اليد أو حقيبة السفر وتعمل بجهد كهربائي عالمي مزدوج (110V-240V).",
        en: "Ultra-compact 18cm mini straightener fitting neatly into handbags, featuring dual-voltage travel support."
      },
      usage: {
        ar: "تفتح قفل الأمان وتستخدم لفرد الغرة والخصلات السريعة وتعديل الشعر أثناء السفر والرحلات.",
        en: "Unlock safety switch, use for bangs, quick touch-ups, and on-the-go travel styling."
      },
      ingredientsOrSpecs: {
        ar: "طول 18 سم فقط | جهد مزدوج عالمي (110V - 240V) | ألواح تورمالين 0.7 بوصة | جراب حراري مرفق | ضمان سنتين.",
        en: "18cm Compact Length | Dual Voltage (110-240V) | 0.7-inch Tourmaline | Heat Pouch | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'رفيقتي الدائمة بالسفر، صغيرة جداً وحرارتها ممتازة تفرد الشعر بسرعة.'",
        en: "4.8/5 Stars: 'My go-to travel companion. Fits in my purse and heats up remarkably well.'"
      }
    }
  },
  {
    id: "hd-24",
    subCategory: 'straightener',
    name: { ar: "مكواة فرد ألترا سليم للشعر الحريري والمتقصف", en: "Ultra-Slim Silk Keratin Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 28.0,
    originalPriceUSD: 39.0,
    discountPercentage: 28,
    stock: 9,
    badge: { ar: "حماية الكيراتين 🌿", en: "Keratin Shield 🌿" },
    rating: 4.9,
    reviewsCount: 115,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "تصميم انسيابي نحيف بألواح مطلية بمستخلص زيت الكيراتين والحرير، يمنع شد الشعر وتقصفه ويمنحك إطلالة شعر ناعم ومنسدل وطبيعي.",
        en: "Streamlined ultra-slim chassis with keratin-infused floating plates eliminating hair snagging."
      },
      usage: {
        ar: "مرري المكواة بنعومة على خصلات صغيرة، وتتيح لك حوافها المنحنية لف أطراف الشعر للداخل أو الخارج.",
        en: "Glide smoothly down thin sections; contoured curved edges allow flicking ends in or out."
      },
      ingredientsOrSpecs: {
        ar: "ألواح كيراتين عائمة مضادة للشد | حواف خارجية منحنية 2 في 1 | حرارة حتى 225°C | شاشة ديجيتال | ضمان سنتين.",
        en: "Keratin Anti-Snag Plates | Curved 2-in-1 Edges | Up to 225°C | Digital Screen | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تنزلق على الشعر زي الزبدة بدون ما تسحب ولا شعرة واحدة!'",
        en: "4.9/5 Stars: 'Glides like silk through strands without snagging a single hair!'"
      }
    }
  },
  {
    id: "hd-25",
    subCategory: 'straightener',
    name: { ar: "جهاز فرد وتنعيم الجذور الدقيق مع ألواح سيراميك رفيعة", en: "Precision Root Styler with Micro-Plates" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 22.0,
    originalPriceUSD: 30.0,
    discountPercentage: 27,
    stock: 8,
    badge: { ar: "دقة متناهية 🎯", en: "Root Precision 🎯" },
    rating: 4.8,
    reviewsCount: 96,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "ألواح سيراميك نحيفة للغاية بسماكة نصف بوصة (0.5 inch)، مخصصة لفرد وتنعيم الجذور المتموجة والشعر القصير والغرة بدقة فائقة.",
        en: "Half-inch micro-ceramic plates tailored for targeting stubborn kinky roots, bangs, and precise edge work."
      },
      usage: {
        ar: "ثبتي المكواة بالقرب من جذر الخصلة واسحبي للخارج بلطف للحصول على استقامة تامة من المنبت.",
        en: "Position adjacent to root base and glide outward for total root-to-tip straightness."
      },
      ingredientsOrSpecs: {
        ar: "ألواح دقيقة 0.5 بوصة | هيكل عازل لحرارة الأطراف | تحكم حراري متعدد | ضمان سنتين شامل معتمد.",
        en: "0.5-inch Micro Plates | Heat-Shielded Tip Housing | Multi-Temp Control | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'حلت لي عقدة الجذور الكيرلي تحت الحجاب، خفيفة ودقيقة جداً.'",
        en: "4.8/5 Stars: 'Completely straightened my curly roots around the hairline. Light and precise.'"
      }
    }
  },
  {
    id: "hd-26",
    subCategory: 'straightener',
    name: { ar: "مكواة تمليس بالأشعة تحت الحمراء العميقة لحبس الرطوبة", en: "Far-Infrared Moisture-Lock Straightener" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 31.0,
    originalPriceUSD: 44.0,
    discountPercentage: 30,
    stock: 7,
    badge: { ar: "أشعة تحت الحمراء 🔴", en: "Far-Infrared 🔴" },
    rating: 4.9,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "شعاع ضوئي بالأشعة تحت الحمراء البعيدة يخترق عمق لب الشعرة لتسخينها من الداخل إلى الخارج، مما يحمي الغلاف الخارجي ويقفل الرطوبة بنسبة 85%.",
        en: "Deep infrared beam penetrating the hair cortex to heat from within, safeguarding cuticles and locking hydration."
      },
      usage: {
        ar: "مرري المكواة ببطء، ويظهر ضوء الأشعة الحمراء أثناء العمل لحماية الشعر من الجفاف.",
        en: "Glide gently; the active red spectrum beam indicates deep infrared cuticle preservation."
      },
      ingredientsOrSpecs: {
        ar: "شريط أشعة تحت الحمراء Far-Infrared مدمج | ألواح سيراميك تورمالين | حرارة حتى 230°C | سلك 2.5م | ضمان سنتين.",
        en: "Built-in Far-Infrared Light Strip | Tourmaline Ceramic | Max 230°C | 2.5m Cable | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تلاحظين الفرق في ملمس الشعر على طول، الشعر يظل طري ورطب وما يصير يابس بعد الفرد.'",
        en: "4.9/5 Stars: 'Immediate difference in texture; hair stays soft and conditioned without that straw-like feel.'"
      }
    }
  },

  // 3. DRYERS, BLOWOUTS & MULTI-STYLERS (مجففات، استشوارات ومصففات متعددة الرؤوس)
  {
    id: "hd-27",
    subCategory: 'dryer',
    name: { ar: "مجفف الشعر الأيوني عالي السرعة بمحرك نفاث 110,000 RPM", en: "Ultra-High-Speed 110,000 RPM Jet Hair Dryer" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 39.5,
    originalPriceUSD: 55.0,
    discountPercentage: 28,
    stock: 9,
    badge: { ar: "محرك نفاث صامت 🌪️", en: "Jet Motor 🌪️" },
    rating: 5.0,
    reviewsCount: 210,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مجفف شعر رقمي ثوري بمحرك بدون فرش يولد تدفق هواء إعصاري فائق السرعة، يجفف الشعر الكثيف في 5 دقائق مع خفض الضجيج إلى أقل من 59 ديسيبل.",
        en: "Brushless 110,000 RPM motor generating hurricane air velocity, drying dense hair in under 5 minutes at sub-59dB noise."
      },
      usage: {
        ar: "اختاري سرعة الهواء ودرجة الحرارة من الأزرار الخلفية، وركبي الفوهة المغناطيسية لتوجيه الهواء بدقة.",
        en: "Select air speed and thermal profile, attach magnetic nozzle to direct high-velocity stream."
      },
      ingredientsOrSpecs: {
        ar: "محرك 110,000 دورة/دقيقة | وزن خفيف 390 غرام | فوهة مغناطيسية 360° | حماية ذكية من الحرارة المفرطة | ضمان سنتين شامل.",
        en: "110k RPM Brushless Motor | 390g Weight | 360° Magnetic Concentrator | Thermal Microchip Guard | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'بديل مثالي لمجفف دايسون وسعره كسر السوق، خفيف في اليد ويجفف شعري الطويل في رمشة عين!'",
        en: "5/5 Stars: 'Incredible alternative to high-end Dyson dryers at a fraction of the cost. Dries my long hair in minutes!'"
      }
    }
  },
  {
    id: "hd-28",
    subCategory: 'dryer',
    name: { ar: "مصفف واستشوار الشعر الهوائي 7 في 1 مع رؤوس التمويج الهوائي", en: "7-in-1 Multi-Styler Air Wrap Styler" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 44.0,
    originalPriceUSD: 62.0,
    discountPercentage: 29,
    stock: 7,
    badge: { ar: "بكج 7 في 1 متكامل 🎁", en: "7-in-1 Kit 🎁" },
    rating: 5.0,
    reviewsCount: 245,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "حقيبة تصفيف ملكية متكاملة تحتوي على 7 ملحقات قابلة للتبديل: أسطوانات التمويج بتأثير كواندا الهوائي، فرشاة تمليس، فرشاة دائرية، ورأس تجفيف سريع.",
        en: "Complete styling arsenal with 7 interchangeable attachments utilizing aerodynamic Coanda airflow to curl and smooth."
      },
      usage: {
        ar: "بدلي الرؤوس بضغطة زر واحدة لاختيار التجفيف أو التمويج التلقائي أو الفرد السلس على شعر رطب بنسبة 80%.",
        en: "Swap magnetic heads at a click; style on 80% dry hair for effortless air curling and blowouts."
      },
      ingredientsOrSpecs: {
        ar: "7 رؤوس احترافية شاملة | تقنية كواندا الهوائية | 3 سرعات و3 درجات حرارة + هواء بارد | حقيبة تخزين فاخرة | ضمان سنتين.",
        en: "7 Pro Attachments | Coanda Airflow Effect | 3 Speeds & Heats + Cool Shot | Luxury Storage Case | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'استغنيت عن الصالونات تماماً! البوكس فيه كل ما تحتاجه أي بنت للتسريح والتجفيف والويفي.'",
        en: "5/5 Stars: 'Never stepping into a hair salon again! Everything needed for drying, curling, and straightening in one box.'"
      }
    }
  },
  {
    id: "hd-29",
    subCategory: 'dryer',
    name: { ar: "فرشاة الاستشوار الحرارية الدائرية لتكثيف الجذور (Blowout)", en: "Volumizing Salon Oval Blowout Hot Air Brush" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 24.0,
    originalPriceUSD: 34.0,
    discountPercentage: 29,
    stock: 15,
    badge: { ar: "فوليوم صالونات 💫", en: "Salon Volume 💫" },
    rating: 4.9,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فرشاة بيضاوية بتدفق هواء 360 درجة ترفع الجذور وتمنح الشعر كثافة مذهلة ولمعاناً ناعماً في جلسة واحدة تجمع بين التجفيف والتصفيف.",
        en: "Oval barrel blowout hot air brush lifting roots and sculpting bouncy ends with 360° airflow."
      },
      usage: {
        ar: "ضعي الفرشاة تحت جذور الشعر ولفيها بلطف للخارج أثناء السحب لأسفل لتوليد فوليوم كثيف.",
        en: "Position under hair roots, rotate outward while gliding toward tips for maximum root lift."
      },
      ingredientsOrSpecs: {
        ar: "تصميم بيضاوي بقطر 75مم | شعيرات نايلون ومختلطة لفك التشابك | تدفق هواء أيوني | 3 مستويات تشغيل | ضمان سنتين.",
        en: "75mm Oval Contour | Mixed Anti-Tangle Bristles | Ionic Stream | 3 Thermal Settings | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تعطي استشوار الصالون بالضبط وكثافة الجذور تدوم يومين كاملين.'",
        en: "4.9/5 Stars: 'Gives the exact salon blowout bounce and root volume stays full for two whole days.'"
      }
    }
  },
  {
    id: "hd-30",
    subCategory: 'dryer',
    name: { ar: "مجفف شعر خفيف الوزن بمستشعر حماية الكيراتين", en: "Featherlight Keratin-Protect Hair Dryer" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 26.5,
    originalPriceUSD: 37.0,
    discountPercentage: 28,
    stock: 12,
    badge: { ar: "خفيف وعملي 🪶", en: "Lightweight 🪶" },
    rating: 4.8,
    reviewsCount: 142,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "سشوار وزنه 340 غرام فقط، مريح جداً للأيدي والرسغ أثناء التجفيف، مزود بشبكة مطلية بالكيراتين لتغذية الشعر وحمايته من التلف.",
        en: "Ultra-light 340g ergonomic hair dryer with keratin-infused ceramic grille preventing moisture loss."
      },
      usage: {
        ar: "استخدمي الحرارة الدافئة للتجفيف السريع، ثم اضغطي زر الهواء البارد لتثبيت التسريحة وإعطاء اللمعان.",
        en: "Use warm heat for fast drying, then trigger cool shot button to lock shine and set style."
      },
      ingredientsOrSpecs: {
        ar: "وزن خفيف 340 غرام | شبكة سيراميك كيراتين | زر هواء بارد فوري | سلك بطول 2 متر | ضمان سنتين شامل معتمد.",
        en: "340g Ergonomic Weight | Keratin Ceramic Grille | Instant Cool Shot | 2m Cable | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'يده خفيفة جداً وما تتعب اليد حتى لو كان شعرك طويل وغزير.'",
        en: "4.8/5 Stars: 'So light that your arms never tire out even when drying very thick, long hair.'"
      }
    }
  },
  {
    id: "hd-31",
    subCategory: 'dryer',
    name: { ar: "استشوار هوائي ساخن بمحرك توربو احترافي 2200 واط", en: "Pro Turbo AC 2200W Salon Hair Dryer" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 28.5,
    originalPriceUSD: 40.0,
    discountPercentage: 28,
    stock: 10,
    badge: { ar: "قوة توربو 2200W ⚡", en: "2200W Turbo ⚡" },
    rating: 4.9,
    reviewsCount: 173,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مجفف صالونات احترافي بمحرك AC إيطالي عالي التحمل بقوة 2200 واط، يتحمل الاستخدام المكثف ويجفف أصعب أنواع الشعر في دقائق.",
        en: "Heavy-duty Italian-style 2200W salon AC motor built for intensive endurance and ultra-fast drying."
      },
      usage: {
        ar: "ركبي فوهة التركيز الضيقة لتصفيف خصلة بخصلة مع الفرشاة الدائرية لاستشوار انسيابي ناعم.",
        en: "Attach slim concentrator nozzle to style section by section alongside a round brush."
      },
      ingredientsOrSpecs: {
        ar: "محرك AC طويل الأجل 2200W | 2 فوهة تركيز مرفقة | فلتر خلفي قابل للفك والتنظيف | ضمان سنتين شامل معتمد.",
        en: "2200W Long-Life AC Motor | 2 Concentrator Nozzles | Removable Rear Filter | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'هواءه قوي جداً كأنك في أحسن صالون تجميل، وماتوره أصلي يتحمل الحرارة.'",
        en: "4.9/5 Stars: 'Powerful airflow like a top salon. Motor handles continuous heavy heat effortlessly.'"
      }
    }
  },
  {
    id: "hd-32",
    subCategory: 'dryer',
    name: { ar: "مصفف تجفيف بيضاوي كبير الحجم للشعر الطويل والكثيف", en: "Max-Volume XL Oval Hot Air Styler" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 25.5,
    originalPriceUSD: 36.0,
    discountPercentage: 29,
    stock: 8,
    badge: { ar: "للشعر الكثيف 🦁", en: "For Thick Hair 🦁" },
    rating: 4.9,
    reviewsCount: 156,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "رأس تصفيف عريض إكسترا لارج مصمم للشعر الطويل والسميك، يجمع كميات أكبر من الخصلات ويفردها ويجففها بنصف الوقت المعتاد.",
        en: "Extra-large oval barrel engineered to master long, coarse hair with wider coverage and fewer passes."
      },
      usage: {
        ar: "قسمي الشعر إلى 4 أقسام رئيسية، واسحبي الفرشاة من الجذور للأطراف بحركات بطيئة وثابتة.",
        en: "Separate hair into 4 large quadrants, gliding brush steadily through each section."
      },
      ingredientsOrSpecs: {
        ar: "أسطوانة XL سيراميك 85مم | شعيرات خنزير برية ونايلون ناعم | تقنية توزيع الهواء المتوازن | ضمان سنتين.",
        en: "85mm XL Ceramic Barrel | Boar & Nylon Bristle Blend | Balanced Air Manifold | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'شعري طويل لتحت الظهر وكان ياخذ ساعة استشوار، مع هذه الفرشاة صار ياخذ 20 دقيقة بس!'",
        en: "4.9/5 Stars: 'My hair reaches my lower back and took an hour to dry; now it is done in 20 minutes!'"
      }
    }
  },
  {
    id: "hd-33",
    subCategory: 'dryer',
    name: { ar: "مجفف شعر مدمج قابل للطي مع موزع هواء (دفيوزر) للشعر الكيرلي", en: "Foldable Travel Dryer with Deep Curls Diffuser" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 21.5,
    originalPriceUSD: 30.0,
    discountPercentage: 28,
    stock: 14,
    badge: { ar: "دفيوزر كيرلي 🌀", en: "Curl Diffuser 🌀" },
    rating: 4.8,
    reviewsCount: 129,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "سشوار قابل للطي بمقبض مريح وموزع هواء كروي عميق (دفيوزر)، يحافظ على تمويجات الشعر الكيرلي الطبيعية ويمنع تطايرها.",
        en: "Collapsible travel hair dryer packaged with deep-bowl diffuser to nurture natural curls and bounce."
      },
      usage: {
        ar: "ركبي موزع الهواء وضعي خصلات الكيرلي داخل الوعاء مع توجيه الهواء الدافئ لأعلى نحو فروة الرأس.",
        en: "Attach diffuser cup, scoop curls upwards toward scalp on low speed to dry naturally."
      },
      ingredientsOrSpecs: {
        ar: "مقبض قابل للطي بزاوية 90° | موزع هواء دفيوزر عميق مشمول | جهد مزدوج 110-240V | ضمان سنتين شامل معتمد.",
        en: "90° Foldable Handle | Deep Diffuser Bowl Included | Dual Voltage 110-240V | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'الدفيوزر تبعه ممتاز للكيرلي جيرل، يحافظ على رسمة الكيرلي بدون أي نفشة.'",
        en: "4.8/5 Stars: 'Ideal for Curly Girl routine. Keeps the curl pattern intact with zero frizz.'"
      }
    }
  },
  {
    id: "hd-34",
    subCategory: 'dryer',
    name: { ar: "استشوار شعر أيوني فائق الهدوء مع 4 درجات حرارة ذكية", en: "Whisper-Quiet Ionic Smart Sensor Hair Dryer" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 34.5,
    originalPriceUSD: 48.0,
    discountPercentage: 28,
    stock: 6,
    badge: { ar: "هادئ بدون ضجيج 🤫", en: "Quiet Flow 🤫" },
    rating: 4.9,
    reviewsCount: 164,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "نظام كتم صوت صوتي يقلل ضوضاء المجفف بنسبة 60% مع تدفق هواء ناعم وغني بالأيونات يحبس لمعان الشعر ويحمي الأذن.",
        en: "Acoustic damping system cutting sound output by 60% while showering hair in a lustrous ionic airstream."
      },
      usage: {
        ar: "مثالي للتجفيف في الصباح الباكر أو بجانب الأطفال دون إزعاج، مع التبديل السلس بين درجات الحرارة الأربع.",
        en: "Ideal for early mornings or styling near sleeping children without harsh noise."
      },
      ingredientsOrSpecs: {
        ar: "مستوى ضجيج منخفض 56 ديسيبل | 4 خيارات حرارة بحلقة ضوئية ملونة | مولد 20 مليون أيون | ضمان سنتين.",
        en: "Ultra-Quiet 56dB | 4 Ring-Lit Temp Settings | 20M Ion Generator | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'صوته واطي جداً ومريح للأذن، وبنفس الوقت هواءه حار وسريع وينجز في دقائق.'",
        en: "4.9/5 Stars: 'Whisper quiet yet powerfully warm. Finished my hair in minutes without hurting ears.'"
      }
    }
  },
  {
    id: "hd-35",
    subCategory: 'dryer',
    name: { ar: "جهاز تصفيف وتجفيف بالهواء الدوار التلقائي 360 درجة", en: "360° Auto-Rotating Hot Air Styling Brush" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 31.0,
    originalPriceUSD: 44.0,
    discountPercentage: 29,
    stock: 8,
    badge: { ar: "دوران هوائي 360° 🔄", en: "Auto-Spin 🔄" },
    rating: 4.9,
    reviewsCount: 182,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فرشاة استشوار دوارة تدور في الاتجاهين بضغطة زر لتلف أطراف الشعر إلى الداخل أو الخارج وتعطيك تموجات صالون طبيعية بأقل مجهود.",
        en: "Dual-direction motorized spinning brush wrapping hair ends in or out with motorized ease."
      },
      usage: {
        ar: "اضغطي زر الدوران لليمين أو اليسار أثناء النزول على الخصلة لتلتف تلقائياً وتمنحك حركة صالونات انسيابية.",
        en: "Press rotation switch to spin brush barrel while moving down the strand for dynamic bounce."
      },
      ingredientsOrSpecs: {
        ar: "محرك دوران ثنائي الاتجاه | فرشتان قابلتان للتبديل (40مم و50مم) | أسطوانة سيراميك تورمالين | ضمان سنتين.",
        en: "Bi-Directional Spin Motor | 2 Interchangeable Brushes (40mm & 50mm) | Tourmaline Barrel | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تغنيك عن لف اليد المتعب، تلف أطراف الشعر بطريقة ناعمة جداً ومرتبة.'",
        en: "4.9/5 Stars: 'Saves your wrists from tired twisting. Flips the ends outward or inward like a pro.'"
      }
    }
  },
  {
    id: "hd-36",
    subCategory: 'dryer',
    name: { ar: "فرشاة تجفيف وفرد حراري بيضاوية بشعيرات طبيعية لمنع التشابك", en: "Boar Bristle Anti-Knot Hot Air Straightening Brush" },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 23.5,
    originalPriceUSD: 33.0,
    discountPercentage: 28,
    stock: 16,
    badge: { ar: "شعيرات طبيعية 🌿", en: "Natural Bristles 🌿" },
    rating: 4.8,
    reviewsCount: 147,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "فرشاة هوائية مدمجة بشعيرات طبيعية تفك التشابك الصعب برفق دون تقطيع، وتنشر الزيوت الطبيعية على طول الشعرة لترطيب فائق ولمعان صحي.",
        en: "Natural bristle blend gently untangling knots, distributing sebum down the strand for high shine."
      },
      usage: {
        ar: "مرري الفرشاة على الشعر المغسول الرطب، وتعمل على سحب الرطوبة الزائدة وفرد الشعر بحركة واحدة.",
        en: "Brush through damp towel-dried hair to extract dampness while polishing strands smooth."
      },
      ingredientsOrSpecs: {
        ar: "شعيرات طبيعية ناعمة مانعة للتشابك | فتحات تهوية متطورة | مقبض انسيابي رفيع | سلك دوار 360° | ضمان سنتين.",
        en: "Anti-Knot Soft Bristles | Advanced Venting Architecture | Ergonomic Slim Handle | 360° Cord | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ممتازة للشعر المعقد والمتشابك، ما تسحب ولا تقطع الشعر أبد وتتركه يلمع.'",
        en: "4.8/5 Stars: 'Excellent for tangled, knotty hair. Never pulls or breaks strands, leaves high sheen.'"
      }
    }
  }
];
