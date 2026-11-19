import type { Product } from './siteConfig';

export const additionalSkincareProducts: Product[] = [
  {
    id: "sb-05",
    name: { ar: "غسول الشاي الأخضر الرغوي المنقي", en: "Purifying Green Tea Foaming Cleanser" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.5,
    originalPriceUSD: 5.8,
    discountPercentage: 22,
    stock: 14,
    badge: { ar: "الأكثر مبيعاً 🌿", en: "Best Seller 🌿" },
    rating: 4.9,
    reviewsCount: 184,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "رغوة تنظيف لطيفة بخلاصة الشاي الأخضر العضوي والأحماض الأمينية، تنقي المسام بعمق دون تجريد البشرة من زيوتها الطبيعية.",
        en: "Gentle purifying cleansing foam infused with organic green tea and amino acids, deep cleansing pores without barrier disruption."
      },
      usage: {
        ar: "توضع ضخة واحدة على يد مبللة ويدلك الوجه بحركات دائرية لمدة دقيقة ثم يشطف بالماء الفاتر.",
        en: "Pump one dispense onto wet hands, massage face gently for 60 seconds, then rinse with lukewarm water."
      },
      ingredientsOrSpecs: {
        ar: "مستخلص الشاي الأخضر العضوي، مستخلص زهرة البابونج، غليسيرين نباتي، فيتامين B5.",
        en: "Organic Green Tea Extract, Chamomile Flower Extract, Botanical Glycerin, Provitamin B5."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'خفيف جداً على البشرة الحساسة ولا يسبب أي شد أو جفاف بعد الغسيل.'",
        en: "4.9/5 Stars: 'Very gentle on sensitive skin with zero tightness or dryness after cleansing.'"
      }
    }
  },
  {
    id: "sb-06",
    name: { ar: "تونر ماء الورد والنياسيناميد المنعش", en: "Balancing Rose Water & Niacinamide Toner" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.8,
    originalPriceUSD: 6.0,
    discountPercentage: 20,
    stock: 9,
    badge: { ar: "إشراقة فورية 🌸", en: "Instant Glow 🌸" },
    rating: 4.8,
    reviewsCount: 142,
    images: [
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تونر مهدئ بماء الورد الجبلي مع 5% نياسيناميد لتضييق المسام، توحيد لون البشرة واستعادة توازن الحموضة الطبيعي.",
        en: "Calming botanical toner blending mountain rose water with 5% niacinamide to refine pore texture and restore pH harmony."
      },
      usage: {
        ar: "يرش مباشرة على الوجه بعد الغسيل أو يوزع بقطعة قطنية ناعمة صباحاً ومساءً.",
        en: "Mist directly onto clean skin or pat gently with a soft cotton pad day and night."
      },
      ingredientsOrSpecs: {
        ar: "ماء ورد مقطر نقي 100%، نياسيناميد (فيتامين B3)، مستخلص الصبار، آلانتوين مهدئ.",
        en: "Pure Distilled Rose Hydrosol, Niacinamide (Vitamin B3), Aloe Vera Juice, Soothing Allantoin."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'انتعاش خرافي ورائحته طبيعية تفتح النفس، والمسام صغرت بشكل ملحوظ.'",
        en: "4.8/5 Stars: 'Incredible hydration refresh, natural rose aroma, and visibly smaller pores.'"
      }
    }
  },
  {
    id: "sb-07",
    name: { ar: "سيروم النياسيناميد 10% والزنك المنقي", en: "Niacinamide 10% + Zinc 1% Blemish Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.2,
    originalPriceUSD: 6.8,
    discountPercentage: 23,
    stock: 12,
    badge: { ar: "تنقية المسام 💧", en: "Pore Refining 💧" },
    rating: 4.9,
    reviewsCount: 215,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تركيبة علمية عالية التركيز تقلل من مظهر شوائب البشرة والزيوت الزائدة وتنقي المسام الواسعة مع ترطيب خفيف غير دهني.",
        en: "High-strength blemish formula targeting oil excess, pore congestion, and uneven skin tone."
      },
      usage: {
        ar: "توضع قطرتان إلى ثلاث قطرات على الوجه بالكامل صباحاً ومساءً قبل الكريمات الثقيلة.",
        en: "Apply 2-3 drops across entire face morning and evening prior to heavier creams."
      },
      ingredientsOrSpecs: {
        ar: "نياسيناميد 10%، زنك PCA 1%، حمض الهيالورونيك، خلاصة بذور التمر الهندي.",
        en: "Niacinamide (10%), Zinc PCA (1%), Sodium Hyaluronate, Tamarind Seed Extract."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'الدهون في منطقة T خفت من أول 5 أيام واختفت الحبوب الصغيرة تحت الجلد.'",
        en: "4.9/5 Stars: 'T-zone oiliness reduced in just 5 days and micro-bumps disappeared completely.'"
      }
    }
  },
  {
    id: "sb-08",
    name: { ar: "واقي شمس مائي نباتي خفيف SPF 50+", en: "Invisible Aqua Sunscreen SPF 50+ PA++++" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.0,
    originalPriceUSD: 7.5,
    discountPercentage: 20,
    stock: 16,
    badge: { ar: "حماية فائقة ☀️", en: "Broad Spectrum ☀️" },
    rating: 5.0,
    reviewsCount: 260,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "واقي شمس واسع النطاق بقوام مائي خفيف يمتص خلال ثوانٍ، لا يترك أي أثر أبيض ولا يلمع على البشرة، ومثالي تحت المكياج.",
        en: "Ultra-lightweight invisible water-based sunscreen offering broad-spectrum SPF 50+ shield with zero white cast."
      },
      usage: {
        ar: "يوزع بسخاء على الوجه والرقبة قبل التعرض للشمس بـ 15 دقيقة، ويعاد تطبيقه كل ساعتين عند التعرض المباشر.",
        en: "Apply generously to face and neck 15 minutes before sun exposure, reapply every 2 hours."
      },
      ingredientsOrSpecs: {
        ar: "فلاتر حماية ضوئية عضوية، مستخلص السنتيلا الكورية، حمض الهيالورونيك، مستخلص الشاي الأخضر.",
        en: "Organic UV Filters, Centella Asiatica, Triple Hyaluronic Complex, Green Tea Extract."
      },
      reviews: {
        ar: "تقييم 5/5: 'أفضل واقي شمس جربته في السودان! خفيف جداً ولا يعرق أو يدبق أبداً.'",
        en: "5/5 Stars: 'Hands down the best sunscreen! Zero white cast, breathable in hot climates.'"
      }
    }
  },
  {
    id: "sb-09",
    name: { ar: "سيروم الكافيين 5% وشاي الماتشا لمحيط العين", en: "Caffeine 5% + Matcha Eye Awakening Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.9,
    originalPriceUSD: 6.2,
    discountPercentage: 21,
    stock: 8,
    badge: { ar: "مضاد للهالات 👁️", en: "Anti-Fatigue 👁️" },
    rating: 4.8,
    reviewsCount: 167,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "سيروم عالي النقاء يستهدف انتفاخات ما تحت العين والهالات السوداء عبر تحفيز الدورة الدموية الدقيقة بمستخلص الكافيين وشاي الماتشا الأخضر.",
        en: "Targeted eye serum concentrating botanical caffeine and matcha polyphenols to drain puffiness and brighten dark circles."
      },
      usage: {
        ar: "توضع قطرة واحدة على طرف الإصبع وتطبطب بلطف حول عظمة محيط العين صباحاً ومساءً.",
        en: "Dab a single drop with ring finger gently along orbital bone morning and evening."
      },
      ingredientsOrSpecs: {
        ar: "كافيين نقي 5%، مستخلص أوراق الماتشا اليابانية، ببتيدات تحفيز الكولاجين، خلاصة الخيار.",
        en: "Pure Caffeine (5%), Japanese Matcha Extract, Matrixyl Peptides, Cucumber Hydrosol."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'يخفف انتفاخ الصباح في ربع ساعة، والهالات بدأت تتلاشى تدريجياً.'",
        en: "4.8/5 Stars: 'Wakes up tired eyes in 15 minutes and noticeably reduces dark pigmentation.'"
      }
    }
  },
  {
    id: "sb-10",
    name: { ar: "كريم الريتينول النباتي (باكوتشيول) الليلي", en: "Bakuchiol & Botanical Retinol Night Elixir" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 7.2,
    originalPriceUSD: 9.0,
    discountPercentage: 20,
    stock: 6,
    badge: { ar: "تجديد ليلي 🌙", en: "Night Renewal 🌙" },
    rating: 4.9,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "بديل طبيعي آمن للريتينول مستخلص من نبتة الباكوتشيول، يجدد خلايا البشرة ويحفز الكولاجين دون تهيج أو احمرار، مناسب للبشرة الحساسة.",
        en: "Natural phyto-retinol powered by clinical Bakuchiol, accelerating cellular turnover without irritation or peeling."
      },
      usage: {
        ar: "يوزع على الوجه والرقبة ليلاً قبل النوم بعد السيروم، ويفضل استخدام واقي شمس في الصباح التالي.",
        en: "Apply nightly to cleansed face and neck following serums; always use SPF next morning."
      },
      ingredientsOrSpecs: {
        ar: "مستخلص الباكوتشيول النقي 2%، سيراميدات ثلاثية، زيت ثمر الورد العضوي، سكوالين نباتي.",
        en: "Bakuchiol Pure Extract (2%), Multi-Ceramides, Organic Rosehip Oil, Botanical Squalane."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'بشرتي صارت مشدودة وناعمة كالحرير بدون أي تقشير مزعج أو حساسية.'",
        en: "4.9/5 Stars: 'Firm, velvety-smooth skin without any irritation or flaking.'"
      }
    }
  },
  {
    id: "sb-11",
    name: { ar: "مقشر أحماض الفواكه AHA + BHA المعالج", en: "AHA 30% + BHA 2% Peeling Solution" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.5,
    originalPriceUSD: 7.0,
    discountPercentage: 21,
    stock: 10,
    badge: { ar: "تقشير ناعم 🧪", en: "Gentle Peel 🧪" },
    rating: 4.8,
    reviewsCount: 173,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "محلول تقشير أسبوعي يزيل خلايا الجلد الميتة وينظف المسام العميقة لإعادة النضارة وتنعيم ملمس البشرة الخشنة.",
        en: "Weekly exfoliating facial treatment refining skin surface texture and clarifying clogged pores."
      },
      usage: {
        ar: "يستخدم مرة واحدة أسبوعياً مساءً على بشرة جافة ونظيفة تماماً. يترك لمدة 8 إلى 10 دقائق فقط ثم يشطف بماء فاتر.",
        en: "Use once weekly at night on completely dry skin. Leave on for 8-10 minutes max, rinse thoroughly."
      },
      ingredientsOrSpecs: {
        ar: "حمض الجليكوليك، حمض اللاكتيك، حمض الساليسيليك، مستخلص الفلفل التيسماني المهدئ.",
        en: "Glycolic Acid, Lactic Acid, Salicylic Acid, Tasmanian Pepperberry Extract."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'يعطي نضارة تشبه نتائج تنظيف البشرة في العيادات مع التزام تعليمات الدقائق العشر.'",
        en: "4.8/5 Stars: 'Delivers a professional spa-level glow when followed precisely.'"
      }
    }
  },
  {
    id: "sb-12",
    name: { ar: "زيت بذور ثمر الورد النقي المعصور على البارد", en: "Cold-Pressed 100% Organic Rosehip Seed Oil" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.8,
    originalPriceUSD: 7.2,
    discountPercentage: 19,
    stock: 11,
    badge: { ar: "عضوي 100% 🌿", en: "100% Organic 🌿" },
    rating: 4.9,
    reviewsCount: 156,
    images: [
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "زيت نقي غني بأحماض أوميغا 3 و6 وفيتامين A الطبيعي. يرطب بعمق، يرمم الندبات، ويحمي حاجز البشرة من الجفاف الشديد.",
        en: "Pure cold-pressed virgin seed oil rich in provitamin A and essential omegas, revitalizing skin barrier integrity."
      },
      usage: {
        ar: "توضع قطرتان وتدفأ في راحتي اليدين ثم تطبطب على الوجه كآخر خطوة في الروتين الليلي.",
        en: "Warm 2-3 drops between palms and gently press onto face as the final step of nighttime care."
      },
      ingredientsOrSpecs: {
        ar: "زيت بذور ثمر الورد العضوي النقي 100% غير مكرر ومعصور على البارد.",
        en: "100% Pure Virgin Cold-Pressed Rosa Canina Seed Oil."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'خفيف ويمتصه الجلد بسرعة، خفف آثار الحبوب القديمة وجعل بشرتي ندية.'",
        en: "4.9/5 Stars: 'Lightweight, absorbs wonderfully and faded my stubborn post-blemish spots.'"
      }
    }
  },
  {
    id: "sb-13",
    name: { ar: "قناع الطين الوردي الأسترالي المنقي للسموم", en: "Australian Pink Clay Pore-Refining Mask" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.5,
    originalPriceUSD: 8.5,
    discountPercentage: 23,
    stock: 7,
    badge: { ar: "تنقية عميقة 🌸", en: "Deep Detox 🌸" },
    rating: 4.9,
    reviewsCount: 138,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "قناع طيني مخملي يسحب الشوائب والسموم والدهون العميقة من المسام، مع تغذية البشرة بمستخلصات الصبار والرمان لنعومة فورية.",
        en: "Velvety detox clay drawing out impurities, balancing sebum, and infusing minerals for smooth luminosity."
      },
      usage: {
        ar: "يوزع بالتساوي على الوجه بالفرشاة المرفقة ويترك 10 دقائق حتى يجف قليلاً ثم يشطف بالماء الفاتر.",
        en: "Evenly apply with brush, leave for 10 minutes until touch-dry, and rinse with warm water."
      },
      ingredientsOrSpecs: {
        ar: "طين وردي طبيعي، خلاصة الرمان، مسحوق الألوفيرا، عسل مانوكا مهدئ.",
        en: "Pure Australian Pink Kaolin Clay, Pomegranate Seed Extract, Organic Aloe Vera, Manuka Honey."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'ينظف المسام من قلب ولا يسبب جفاف زي باقي أنواع الطين، ملمسه زبدة.'",
        en: "4.9/5 Stars: 'Cleans deeply without stripping moisture like traditional clays. Pure butter texture.'"
      }
    }
  },
  {
    id: "sb-14",
    name: { ar: "سيروم السنتيلا والببتيدات المهدئ للبشرة الحساسة", en: "Centella & Multi-Peptide Barrier Calming Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.6,
    originalPriceUSD: 7.0,
    discountPercentage: 20,
    stock: 13,
    badge: { ar: "مهدئ ومضاد للتهيج 🌿", en: "Calming Relief 🌿" },
    rating: 4.9,
    reviewsCount: 162,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "إكسير ملطف بتركيز 75% من مستخلص عشبة السنتيلا الآسيوية، يهدئ الاحمرار الفوري ويسرع التئام حاجز البشرة المتضرر.",
        en: "Soothing rescue serum with 75% Cica extract and copper peptides, easing acute sensitivity and barrier stress."
      },
      usage: {
        ar: "توضع قطرات سخية على البشرة المتهيجة أو بعد جلسات التقشير والليزر صباحاً ومساءً.",
        en: "Dispense generously over sensitized skin or post-treatment morning and evening."
      },
      ingredientsOrSpecs: {
        ar: "مستخلص سنتيلا آسياتيكا 75%، مادتكاسوسايد، ببتيدات النحاس، بانثينول B5.",
        en: "Centella Asiatica (75%), Madecassoside, Copper Tripeptide-1, Panthenol (B5)."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'أنقذ بشرتي من تحسس شمس الصيف وأزال الاحمرار خلال يومين فقط.'",
        en: "4.9/5 Stars: 'Rescued my skin from heat allergy and calmed redness in 48 hours.'"
      }
    }
  },
  {
    id: "sb-15",
    name: { ar: "جل الصبار العضوي 99% المهدئ والمرطب", en: "Pure 99% Soothing Organic Aloe Vera Gel" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 3.8,
    originalPriceUSD: 4.8,
    discountPercentage: 20,
    stock: 22,
    badge: { ar: "ترطيب بارد 🧊", en: "Cooling Hydration 🧊" },
    rating: 4.9,
    reviewsCount: 310,
    images: [
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "جل صبار نقي 99% معصور من أوراق الصبار الطازجة، يمنح برودة فورية ويرطب الوجه والجسم ويهدئ حروق الشمس والجفاف.",
        en: "Ultra-pure 99% organic aloe vera leaf gel providing instantaneous soothing hydration for face and body."
      },
      usage: {
        ar: "يوزع على البشرة كلما دعت الحاجة للترطيب أو بعد التعرض للشمس وإزالة الشعر.",
        en: "Apply liberally whenever soothing hydration is needed, post-sun, or after waxing."
      },
      ingredientsOrSpecs: {
        ar: "عصير صبار عضوي معتمد 99%، فيتامين C، مستخلص النعناع المبرد، غليسيرين نباتي.",
        en: "Certified Organic Aloe Barbadensis Leaf Juice (99%), Vitamin C, Cooling Spearmint, Vegetable Glycerin."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'المنتج المنقذ في الصيف! منعش جداً في الثلاجة وترطيبه سريع الامتصاص.'",
        en: "4.9/5 Stars: 'Essential summer rescue! Kept in the fridge, it is pure heaven on the skin.'"
      }
    }
  },
  {
    id: "sb-16",
    name: { ar: "كريم السيراميدات المرمم لحاجز البشرة", en: "Advanced Multi-Ceramide Barrier Defense Cream" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.8,
    originalPriceUSD: 8.5,
    discountPercentage: 20,
    stock: 11,
    badge: { ar: "ترميم الحاجز 🛡️", en: "Barrier Defense 🛡️" },
    rating: 4.9,
    reviewsCount: 177,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "كريم غني بالسيراميدات الحيوية 1 و3 و6-II، يعيد بناء درع الحماية للبشرة الجافة والتالفة ويقفل الرطوبة لمدة 48 ساعة متواصلة.",
        en: "Fortifying barrier balm blending essential ceramides (1, 3, 6-II) to seal hydration and block moisture evaporation."
      },
      usage: {
        ar: "يدلك على الوجه والرقبة صباحاً ومساءً كخطوة ترطيب ختامية تدعم راحة البشرة.",
        en: "Warm a dime-sized amount and smooth onto face and neck as a final comforting seal."
      },
      ingredientsOrSpecs: {
        ar: "سيراميدات نباتية ثلاثية، كوليسترول طبيعي، أحماض دهنية حرة، زبدة الشيا النقية.",
        en: "Triple Plant Ceramides, Bio-Identical Cholesterol, Free Fatty Acids, Raw Shea Butter."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'عالج التقشير والحرقة في يومين فقط، قوام غني بدون ما يسد المسام.'",
        en: "4.9/5 Stars: 'Healed my barrier peeling in 48 hours without feeling heavy or pore-clogging.'"
      }
    }
  },
  {
    id: "sb-17",
    name: { ar: "سيروم حمض الساليسيليك 2% لمكافحة الرؤوس السوداء", en: "Salicylic Acid 2% BHA Pore Clarifier" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.8,
    originalPriceUSD: 6.0,
    discountPercentage: 20,
    stock: 14,
    badge: { ar: "مضاد للرؤوس السوداء ⚡", en: "Pore Clearing ⚡" },
    rating: 4.8,
    reviewsCount: 149,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "سيروم تغلغل زيتي يذيب الدهون المتراكمة داخل المسام ويزيل الرؤوس السوداء والبيضاء ويمنع ظهور البثور الجديدة.",
        en: "Lipophilic BHA serum exfoliating deep within pore linings to dissolve sebum and clarify blackheads."
      },
      usage: {
        ar: "توضع قطرات على مناطق الرؤوس السوداء (الأنف والذقن والجبين) 2-3 مرات أسبوعياً ليلاً.",
        en: "Target blackhead-prone areas (nose, chin, forehead) 2-3 nights weekly."
      },
      ingredientsOrSpecs: {
        ar: "حمض الساليسيليك النقي 2%، خلاصة لحاء الصفصاف الأبيض، خلاصة شجرة الشاي الأسترالية.",
        en: "Salicylic Acid (2%), White Willow Bark Extract, Tea Tree Leaf Hydrosol."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'الرؤوس السوداء على أنفي اختفت بنسبة 80% في أول أسبوعين.'",
        en: "4.8/5 Stars: 'Blackheads on my nose faded by 80% within two weeks of regular use.'"
      }
    }
  },
  {
    id: "sb-18",
    name: { ar: "ماء ميسيلار بماء الزهر وفيتامين E لإزالة المكياج", en: "Gentle Blossom Micellar Cleansing Water" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.2,
    originalPriceUSD: 5.5,
    discountPercentage: 23,
    stock: 19,
    badge: { ar: "إزالة لطيفة 🌸", en: "Gentle Cleanse 🌸" },
    rating: 4.8,
    reviewsCount: 189,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "محلول ميسيلار فائق النقاء يزيل المكياج المقاوم للماء والشوائب بلمسة واحدة دون فرك، ويترك البشرة رطبة ومنتعشة.",
        en: "Pure micellar fluid magnetizing stubborn waterproof makeup and pollution with zero friction or sting."
      },
      usage: {
        ar: "تبلل قطنة نظيفة وتمسح بها العينان والوجه والشفاه بلطف دون الحاجة للفرك الشديد.",
        en: "Soak a cotton pad and gently sweep across eyes, face, and lips without harsh rubbing."
      },
      ingredientsOrSpecs: {
        ar: "ماء زهر البرتقال العضوي، جزيئات ميسيلار نشطة، فيتامين E، خلاصة الخيار المنعش.",
        en: "Organic Neroli Water, Active Micelles, Vitamin E, Refreshing Cucumber Distillate."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ما يسبب أي حرقة في العين ويشيل الماسكارا ضد الماء بسهولة تامة.'",
        en: "4.8/5 Stars: 'Never stings the eyes and dissolves waterproof mascara effortlessly.'"
      }
    }
  },
  {
    id: "sb-19",
    name: { ar: "سيروم الكولاجين البحري ثلاثي الفعالية", en: "Marine Collagen & Tri-Peptide Plumping Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.4,
    originalPriceUSD: 8.0,
    discountPercentage: 20,
    stock: 8,
    badge: { ar: "امتلاء ونضارة 🌊", en: "Plumping Youth 🌊" },
    rating: 4.9,
    reviewsCount: 165,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "سيروم شد متقدم غني بالكولاجين البحري المتحلل وببتيدات الامتلاء، يملأ الخطوط الدقيقة ويعزز مرونة البشرة وحيويتها.",
        en: "Youth plumping serum infusing hydrolysed marine peptides to firm contours and restore youthful bounce."
      },
      usage: {
        ar: "توضع 4 قطرات على الوجه والرقبة مع التدليك لأعلى لتحفيز الشد صباحاً ومساءً.",
        en: "Smooth 4 drops across face and neck with upward sculpting motions morning and evening."
      },
      ingredientsOrSpecs: {
        ar: "كولاجين بحري متحلل، ببتيد ماتريكسيل 3000، حمض الهيالورونيك، خلاصة الطحالب الحمراء.",
        en: "Hydrolysed Marine Collagen, Matrixyl 3000 Peptides, Multi-Hyaluronic Acid, Red Algae Extract."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'يعطي امتلاء ونضارة فورية كأنك مسوية فيلر خفيف للوجه، رائع قبل المناسبات.'",
        en: "4.9/5 Stars: 'Delivers immediate plump hydration as if you had a fresh glow facial.'"
      }
    }
  },
  {
    id: "sb-20",
    name: { ar: "مرطب الشفاه المعالج بزيوت التوت وشمع العسل", en: "Berry Glow Peptide Lip Recovery Balm" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 2.8,
    originalPriceUSD: 3.8,
    discountPercentage: 26,
    stock: 25,
    badge: { ar: "ترطيب وردي 🍓", en: "Berry Tint 🍓" },
    rating: 4.9,
    reviewsCount: 320,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "بلسم علاجي غني بزبدة الشيا وببتيدات الامتلاء وخلاصة التوت البري، يعالج تشققات الشفاه ويمنحها لمعاناً وردياً طبيعياً يدوم لساعات.",
        en: "Nourishing peptide butter treatment reversing chapped lips with sheer natural berry radiance."
      },
      usage: {
        ar: "يطبق على الشفاه على مدار اليوم وقبل النوم كقناع ليلي لترميم عميق.",
        en: "Apply liberally throughout the day or swipe before sleep as an overnight lip sleep mask."
      },
      ingredientsOrSpecs: {
        ar: "شمع العسل النقي، زبدة الشيا، زيت بذور التوت البري، ببتيدات الامتلاء، فيتامين E.",
        en: "Pure Beeswax, Organic Shea Butter, Cranberry Seed Oil, Volumizing Peptides, Vitamin E."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تخلصت من جفاف الشفاه تماماً ولمعته طبيعية وأنيقة بدون دبق.'",
        en: "4.9/5 Stars: 'Eliminated lip chapping completely. Beautiful dewy sheen with zero stickiness.'"
      }
    }
  },
  {
    id: "sb-21",
    name: { ar: "سيروم حمض الأزيليك 10% لتوحيد التصبغات والتفتيح", en: "Azelaic Acid 10% Brightening Clarifier" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.4,
    originalPriceUSD: 6.8,
    discountPercentage: 20,
    stock: 12,
    badge: { ar: "علاج التصبغات 🎯", en: "Dark Spot Corrector 🎯" },
    rating: 4.8,
    reviewsCount: 141,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تركيبة طبية تفتت بقع الكلف والتصبغات العنيدة وتهدئ الوردية وتصفي ملمس البشرة لتوحيد لون طبيعي متألق.",
        en: "Targeted azelaic acid gel-cream visibly fading post-inflammatory dark marks and calming redness."
      },
      usage: {
        ar: "توضع كمية صغيرة بحجم حبة البازلاء على مناطق التصبغات أو الوجه بالكامل مساءً.",
        en: "Apply a pea-sized amount over areas of concern or full face in the evening."
      },
      ingredientsOrSpecs: {
        ar: "حمض الأزيليك النقي 10%، خلاصة العرقسوس المفتحة، مستخلص أوراق الزيتون، نياسيناميد.",
        en: "Pure Azelaic Acid (10%), Licorice Root Brightening Extract, Olive Leaf Extract, Niacinamide."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'سحري لآثار الحبوب القديمة واحمرار الخدود، لطيف جداً وما يحرق.'",
        en: "4.8/5 Stars: 'Magical for post-breakout dark marks and cheek redness. Remarkably gentle.'"
      }
    }
  },
  {
    id: "sb-22",
    name: { ar: "بخاخ الرذاذ المرطب بحمض الهيالورونيك والصبار", en: "Hydrating Facial Mist with Hyaluronic & Aloe" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 3.9,
    originalPriceUSD: 5.0,
    discountPercentage: 22,
    stock: 18,
    badge: { ar: "انتعاش الندى 💧", en: "Dewy Mist 💧" },
    rating: 4.8,
    reviewsCount: 169,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "رذاذ دقيق فائق الانتعاش يمنح البشرة دفقة فورية من الترطيب في أي وقت ومكان، يثبت المكياج ويقاوم جفاف التكييف.",
        en: "Micro-fine facial cloud mist recharging skin with dewy moisture, locking makeup and reviving tired skin."
      },
      usage: {
        ar: "يرش من مسافة 20 سم على الوجه مع إغماض العينين، في أي وقت خلال اليوم.",
        en: "Hold 20cm away from face with eyes closed, spritz whenever instant hydration is needed."
      },
      ingredientsOrSpecs: {
        ar: "مياه نبع جبلية نقية، حمض هيالورونيك منخفض الوزن الجزيئي، ماء الصبار، جلسرين نباتي.",
        en: "Pure Mountain Spring Water, Low Molecular Hyaluronic Acid, Aloe Hydrosol, Plant Glycerin."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ملازم لي بالشنطة والسيارة، يبرد الوجه ويخليه مشرق طول اليوم.'",
        en: "4.8/5 Stars: 'Always in my bag! Instantly revives my makeup and cools skin in the heat.'"
      }
    }
  },
  {
    id: "sb-23",
    name: { ar: "مقشر القهوة العربية وزيت اللوز للجسم والوجه", en: "Arabian Coffee & Sweet Almond Smoothing Polish" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.9,
    originalPriceUSD: 6.5,
    discountPercentage: 25,
    stock: 15,
    badge: { ar: "تنعيم فاخر ☕", en: "Coffee Polish ☕" },
    rating: 4.9,
    reviewsCount: 204,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "مقشر طبيعي فاخر بحبيبات البن العربي المحمصة وزيت اللوز الحلو، ينشط الدورة الدموية، يزيل الجلد الميت ويمنح نعومة الحرير.",
        en: "Artisanal body polish blending roasted arabica grounds and sweet almond oil for silky-smooth skin."
      },
      usage: {
        ar: "يدلك بحركات دائرية على بشرة رطبة أثناء الاستحمام لمدة دقيقتين ثم يشطف جيداً بالماء.",
        en: "Buff in circular motions over damp skin during shower for 2 minutes, rinse clean."
      },
      ingredientsOrSpecs: {
        ar: "حبيبات بن أرابيكا طبيعية، زيت اللوز الحلو النقي، سكر قصب عضوي، فيتامين E.",
        en: "Roasted Arabica Coffee Grounds, Sweet Almond Oil, Organic Cane Sugar, Vitamin E."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'رائحة القهوة تفتح النفس والنعومة تدوم يومين بدون حتى ما تحطي لوشن.'",
        en: "4.9/5 Stars: 'Divine roasted coffee scent, leaves skin extraordinarily soft and nourished.'"
      }
    }
  },
  {
    id: "sb-24",
    name: { ar: "قناع النوم الليلي باللافندر والبابونج لتهدئة البشرة", en: "Lavender & Chamomile Sleep Recovery Mask" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.9,
    originalPriceUSD: 7.5,
    discountPercentage: 21,
    stock: 8,
    badge: { ar: "ترميم ليلي 🌙", en: "Sleep Recovery 🌙" },
    rating: 4.9,
    reviewsCount: 153,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "قناع ليلي مغذٍ يعمل طوال ساعات النوم على ترميم الإجهاد وترطيب البشرة بعمق لتستيقظي ببشرة ندية، مسترخية ومشرقة.",
        en: "Overnight recovery sleeping pack infusing botanical lavender and chamomile to wake up with rested glow."
      },
      usage: {
        ar: "يوزع كآخر خطوة قبل النوم ويترك طوال الليل دون غسيل، ويشطف بالماء الفاتر صباحاً.",
        en: "Smooth generous layer onto skin before bed. Leave overnight, rinse in the morning."
      },
      ingredientsOrSpecs: {
        ar: "زيت اللافندر الفرنسي العضوي، مستخلص زهرة البابونج، هيدروسول الورد، حمض الهيالورونيك.",
        en: "French Lavender Essential Oil, Chamomile Flower Extract, Rose Hydrosol, Multi-Weight Hyaluronic Acid."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تصحين ووجهك مرتاح ومروي كأنك نايمة 10 ساعات، ورائحة اللافندر تساعد على الاسترخاء.'",
        en: "4.9/5 Stars: 'Wake up looking like you had 10 hours of beauty sleep. Heavenly calming aroma.'"
      }
    }
  },
  {
    id: "sb-25",
    name: { ar: "سيروم الأربوتين 2% وخلاصة التوت البري للتفتيح", en: "Alpha Arbutin 2% + Berry Radiance Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.3,
    originalPriceUSD: 6.9,
    discountPercentage: 23,
    stock: 14,
    badge: { ar: "تفتيح وتوحيد ☀️", en: "Brightening ☀️" },
    rating: 4.8,
    reviewsCount: 168,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تركيبة آمنة وفعالة تثبط إنتاج صبغة الميلانين الزائدة، تفتح التصبغات وآثار الشمس وتمنح البشرة صفاءً متجانساً.",
        en: "Targeted alpha arbutin serum curbing excess melanin to brighten sun spots and even skin tone."
      },
      usage: {
        ar: "توضع بضع قطرات على الوجه صباحاً ومساءً متبوعة بواقي شمس خلال النهار.",
        en: "Apply few drops morning and evening before creams; always apply sun protection."
      },
      ingredientsOrSpecs: {
        ar: "ألفا أربوتين نقي 2%، خلاصة التوت البري، حمض الهيالورونيك، فيتامين B5.",
        en: "Alpha Arbutin (2%), Bearberry Extract, Pure Hyaluronic Acid, Provitamin B5."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'وحد لون جبهتي وخدودي بدون ما يتحسس وجهي، نتائج واضحة في 3 أسابيع.'",
        en: "4.8/5 Stars: 'Evened my forehead and cheeks without irritation. Visible results in 3 weeks.'"
      }
    }
  },
  {
    id: "sb-26",
    name: { ar: "سيروم الببتيدات المتعددة لشد الرقبة والفك", en: "Multi-Peptide Sculpting Neck & Jawline Serum" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.6,
    originalPriceUSD: 8.5,
    discountPercentage: 22,
    stock: 7,
    badge: { ar: "شد ونحت 💎", en: "Sculpt & Firm 💎" },
    rating: 4.9,
    reviewsCount: 122,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "سيروم مشدود بتركيز عالي من ببتيدات النحاس وببتيدات الإيلاستين، مصمم خصيصاً لشد ترهلات الرقبة ومنطقة الفك وإبراز ملامح الوجه.",
        en: "Advanced sculpting peptide complex tailored to lift and tighten delicate neck and jawline skin."
      },
      usage: {
        ar: "يدلك بحركات سحب صاعدة من أسفل الرقبة إلى عظمة الفك مرتين يومياً.",
        en: "Massage with firm upward sweeps from base of neck towards jawline twice daily."
      },
      ingredientsOrSpecs: {
        ar: "مجمع ببتيدات سداسية، ببتيدات النحاس، كولاجين نباتي، سكوالين الزيتون.",
        en: "Hexapeptide Complex, Copper Peptides, Vegan Collagen, Olive Squalane."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'خطوط الرقبة خفت بشكل لا يصدق، والشد واضح جداً عند التصوير.'",
        en: "4.9/5 Stars: 'Neck horizontal lines visibly softened and jawline looks lifted in photos.'"
      }
    }
  },
  {
    id: "sb-27",
    name: { ar: "كريم الترطيب الهلامي بالبطيخ وحمض البولي جلوتاميك", en: "Watermelon Glow Polyglutamic Dew Cream" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.7,
    originalPriceUSD: 7.2,
    discountPercentage: 21,
    stock: 16,
    badge: { ar: "انتعاش مائي 🍉", en: "Water Gel 🍉" },
    rating: 4.9,
    reviewsCount: 191,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "جل ترطيب وردي منعش بخلاصة البطيخ وحمض البولي جلوتاميك الذي يحبس الرطوبة 4 أضعاف الهيالورونيك، يعطي لمعة زجاجية صحية.",
        en: "Oil-free pink water-gel quenching thirsty skin with watermelon botanicals and moisture-locking polyglutamic acid."
      },
      usage: {
        ar: "توضع كمية بحجم العملة المعدنية وتوزع بالتساوي على الوجه بعد السيروم.",
        en: "Smooth a dime-sized dollop across face following serums for a burst of hydration."
      },
      ingredientsOrSpecs: {
        ar: "مستخلص البطيخ الطبيعي، حمض البولي جلوتاميك، صوديوم هيالورونات، مستخلص التفاح.",
        en: "Watermelon Fruit Extract, Polyglutamic Acid, Sodium Hyaluronate, Apple Fruit Bio-Extract."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'قوامه هلامي خفيف جداً ويعطي لمعة زجاجية كورية بدون أي ملمس زيتي.'",
        en: "4.9/5 Stars: 'Light jelly texture delivering Korean glass skin glow with zero greasiness.'"
      }
    }
  },
  {
    id: "sb-28",
    name: { ar: "زيت التطهير المزدوج بالياسمين وزيت الجوجوبا", en: "Jasmine & Jojoba Pure Cleansing Oil" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.1,
    originalPriceUSD: 6.5,
    discountPercentage: 22,
    stock: 11,
    badge: { ar: "تنظيف مزدوج 🌿", en: "Double Cleanse 🌿" },
    rating: 4.8,
    reviewsCount: 134,
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "الخطوة الأولى المثالية للتنظيف المزدوج. يذيب المكياج الثقيل والواقي الشمسي والدهون المتأكسدة في ثوانٍ ويتحول لحليب خفيف عند ملامسة الماء.",
        en: "Silky emulsifying cleansing oil dissolving heavy makeup and SPF, rinsing away as a milky veil."
      },
      usage: {
        ar: "يدلك على وجه جاف تماماً لمدة دقيقة، ثم يبلل بالماء ليتحول إلى حليب رغوي ويشطف.",
        en: "Massage 2 pumps onto dry skin for 60 seconds, emulsify with warm water, and rinse cleanly."
      },
      ingredientsOrSpecs: {
        ar: "زيت الجوجوبا العضوي، زيت اللوز الحلو، زيت زهرة الياسمين، فيتامين E الطبيعي.",
        en: "Organic Jojoba Seed Oil, Sweet Almond Oil, Jasmine Blossom Absolute, Natural Tocopherol."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ما يترك أي طبقة دهنية ويذيب أقوى مكياج مقاوم للماء في ثوانٍ.'",
        en: "4.8/5 Stars: 'Rinses completely clean without residue, melts stubborn waterproof layers in seconds.'"
      }
    }
  },
  {
    id: "sb-29",
    name: { ar: "سيروم فيتامين E والسكوالين لحماية حاجز البشرة", en: "Botanical Squalane + Vitamin E Barrier Drop" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.7,
    originalPriceUSD: 6.0,
    discountPercentage: 22,
    stock: 17,
    badge: { ar: "تغذية نقية 💧", en: "Pure Moisture 💧" },
    rating: 4.9,
    reviewsCount: 147,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "زيت خفيف مستخلص 100% من قصب السكر وقريب جداً من زيوت البشرة الطبيعية، يحبس الرطوبة ويمنح نعومة فورية دون سد المسام.",
        en: "100% plant-derived sugarcane squalane infused with natural vitamin E for weightless barrier replenishment."
      },
      usage: {
        ar: "توضع قطرتان على الوجه أو تخلط مع كريم الترطيب المفضل لديك لتعزيز التغذية.",
        en: "Press 2 drops onto face or blend with your moisturizer to seal intensive hydration."
      },
      ingredientsOrSpecs: {
        ar: "سكوالين نقي 100% مشتق من قصب السكر، توكوفيرول (فيتامين E طبيعي).",
        en: "100% Plant-Derived Sugarcane Squalane, Tocopherol (Natural Vitamin E)."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'أخف زيت بالعالم! لا يزيت ولا يسبب حبوب ويخلي البشرة ناعمة زي الحرير.'",
        en: "4.9/5 Stars: 'Lightest oil in the world! Non-comedogenic and leaves skin velvety soft.'"
      }
    }
  },
  {
    id: "sb-30",
    name: { ar: "لصقات الهيدروجيل الذهبية لمحيط العين بالكولاجين", en: "24K Gold & Marine Collagen Eye Hydrogels (60 Patches)" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 6.2,
    originalPriceUSD: 8.0,
    discountPercentage: 23,
    stock: 13,
    badge: { ar: "عناية ذهبية", en: "24K Gold" },
    rating: 5.0,
    reviewsCount: 230,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "عبوة تحتوي على 60 لصقة هيدروجيل غنية بذرات الذهب عيار 24 والكولاجين البحري، تبرد وتشد منطقة تحت العين وتزيل علامات السهر والإرهاق.",
        en: "Luxury jar of 60 soothing hydrogel eye patches enriched with 24K gold nano-particles and marine collagen."
      },
      usage: {
        ar: "توضع اللصقة تحت العين بالملعقة المرفقة وتترك 15-20 دقيقة ثم تزال وتطبطب السوائل المتبقية.",
        en: "Position patches under eyes using spatula. Leave for 15-20 minutes, then discard and pat residue."
      },
      ingredientsOrSpecs: {
        ar: "ذهب عيار 24 نقي، كولاجين بحري متحلل، نياسيناميد، خلاصة الألوفيرا، ألانتوين.",
        en: "24K Colloidal Gold, Hydrolysed Marine Collagen, Niacinamide, Aloe Barbadensis, Allantoin."
      },
      reviews: {
        ar: "تقييم 5/5: 'تزيل التعب والانتفاخ تماماً قبل المكياج أو المناسبات، شعورها بارد وفاخر.'",
        en: "5/5 Stars: 'Instant de-puffing magic before events. Feels delightfully cooling and luxurious.'"
      }
    }
  },
  {
    id: "sb-31",
    name: { ar: "تونر الجليكوليك 7% المقشر والمفتح للبشرة", en: "Glycolic Acid 7% Toning Radiance Solution" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.5,
    originalPriceUSD: 7.0,
    discountPercentage: 21,
    stock: 10,
    badge: { ar: "تجديد وتنعيم", en: "Glow Exfoliator" },
    rating: 4.8,
    reviewsCount: 176,
    images: [
      "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تونر تقشير لطيف بأحماض الفواكه يعمل على تسريع تجديد خلايا الجلد السطحية، تنعيم الخشونة وتفتيح البهتان.",
        en: "AHA exfoliating toner formulated with 7% glycolic acid to gently dissolve dull outer layers and restore clarity."
      },
      usage: {
        ar: "يمسح على الوجه والرقبة مساءً بقطعة قطن نظيفة 3 مرات أسبوعياً. تجنبي منطقة محيط العين.",
        en: "Sweep onto clean face and neck 3 evenings per week with a cotton round. Avoid eye contours."
      },
      ingredientsOrSpecs: {
        ar: "حمض الجليكوليك 7%، ماء زهر الذرة، مستخلص الصبار، خلاصة جذور الجنسنج الكوري.",
        en: "Glycolic Acid (7%), Cornflower Water, Aloe Hydrosol, Panax Ginseng Root Extract."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'صحيح البشرة صارت أنعم وتلمع من أول أسبوعين، خفف ملمس الحبوب الخشنة.'",
        en: "4.8/5 Stars: 'Skin became remarkably smooth and luminous within 2 weeks. Rough texture vanished.'"
      }
    }
  },
  {
    id: "sb-32",
    name: { ar: "سيروم الهيالورونيك متعدد الأوزان الجزيئية", en: "Multi-Molecular Hyaluronic 2% + B5 Complex" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.2,
    originalPriceUSD: 6.5,
    discountPercentage: 20,
    stock: 14,
    badge: { ar: "ترطيب 5 طبقات 💧", en: "5D Hydration 💧" },
    rating: 4.9,
    reviewsCount: 218,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "مركب هيدروجيل متطور يدمج 5 أوزان مختلفة من حمض الهيالورونيك ليتغلغل في كافة طبقات البشرة من السطح حتى الأعماق.",
        en: "5-layer hydration serum combining multi-weight hyaluronic acid molecules with Provitamin B5."
      },
      usage: {
        ar: "توضع 3 قطرات على بشرة مبللة قليلاً بعد الغسيل ثم يقفل فورا بكريم الترطيب.",
        en: "Apply 3 drops to slightly damp skin directly after cleansing, then seal with moisturizer."
      },
      ingredientsOrSpecs: {
        ar: "حمض الهيالورونيك الخماسي، بانثينول (فيتامين B5)، ماء الصبار النقي، خلاصة البابونج.",
        en: "5-Molecular Hyaluronic Complex, Panthenol (Provitamin B5), Aloe Hydrosol, Chamomile Extract."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'سر البشرة الزجاجية! يروي البشرة العطشانة ويخليها ممتلئة ومرنة.'",
        en: "4.9/5 Stars: 'The secret to dewy glass skin! Quenches thirsty skin and restores youthful bounce.'"
      }
    }
  },
  {
    id: "sb-33",
    name: { ar: "ماسك ورقي بخلاصة شجرة الشاي وسنتيلا المهدئة (بكج 5 ماسكات)", en: "Tea Tree & Cica Calming Sheet Mask (Pack of 5)" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 4.5,
    originalPriceUSD: 6.0,
    discountPercentage: 25,
    stock: 20,
    badge: { ar: "بكج 5 ماسكات 🌿", en: "5-Pack Sheets 🌿" },
    rating: 4.9,
    reviewsCount: 195,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "مجموعة من 5 ماسكات قطنية مشبعة بإيسنس شجرة الشاي والسنتيلا، تهدئ الحبوب الملتهبة وتبرد الوجه على الفور.",
        en: "Pack of 5 microfiber biodegradable sheet masks drenched in purifying tea tree and soothing centella."
      },
      usage: {
        ar: "يوضع الماسك على الوجه لمدة 15-20 دقيقة، ثم ينزع وتدلك بقايا السيروم برفق حتى الامتصاص.",
        en: "Adhere mask comfortably on face for 15-20 minutes, discard and pat excess essence into skin."
      },
      ingredientsOrSpecs: {
        ar: "خلاصة شجرة الشاي العضوية، مستخلص السنتيلا الكورية، ماء أوراق شجرة الشاي، ألانتوين.",
        en: "Organic Tea Tree Extract, Centella Asiatica, Melaleuca Leaf Water, Soothing Allantoin."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'يهدئ حمار الحبوب الملتهبة في نص ساعة وبارد جداً على الوجه.'",
        en: "4.9/5 Stars: 'Cools inflamed blemishes in 30 minutes, incredibly refreshing on warm days.'"
      }
    }
  },
  {
    id: "sb-34",
    name: { ar: "زيت الأرغان المغربي العضوي النقي 100% للوجه والشعر", en: "100% Pure Organic Moroccan Argan Oil" },
    category: { ar: "العناية بالبشرة (Skincare)", en: "Skincare" },
    basePriceUSD: 5.9,
    originalPriceUSD: 7.5,
    discountPercentage: 21,
    stock: 12,
    badge: { ar: "ذهب سائل 🌿", en: "Liquid Gold 🌿" },
    rating: 5.0,
    reviewsCount: 280,
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "زيت أرغان مغربي أصلي معصور على البارد، معروف بـ 'الذهب السائل'. غني بالأحماض الدهنية وفيتامين E لترطيب البشرة الجافة وتغذية أطراف الشعر.",
        en: "100% certified organic cold-pressed Moroccan Argan Oil nourishing dry skin barrier and damaged hair ends."
      },
      usage: {
        ar: "توضع قطرات على الوجه والرقبة ليلاً، أو تدلك به أطراف الشعر المتقصفة بعد الاستحمام.",
        en: "Smooth a few drops onto face and neck at night, or work through damp hair split ends."
      },
      ingredientsOrSpecs: {
        ar: "زيت حبوب الأرغان المغربية النقي 100% العضوي والمعصور على البارد.",
        en: "100% Pure Virgin Cold-Pressed Argania Spinosa Kernel Oil."
      },
      reviews: {
        ar: "تقييم 5/5: 'أصلي ورائحته طبيعية خفيفة، بشرتي صارت زبدة وأطراف شعري تحسنت بشكل ملحوظ.'",
        en: "5/5 Stars: 'Authentic gentle nut aroma, leaves skin silky soft and revived my split ends.'"
      }
    }
  }
];
