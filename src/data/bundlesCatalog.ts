import type { Product } from './siteConfig';

export const additionalGiftBundles: Product[] = [
  {
    id: "bundle-01",
    name: { ar: "بوكس العروس الملكي للعناية الفائقة بالنضارة", en: "Royal Bridal Glow & Radiance Luxury Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 24.5,
    originalPriceUSD: 36.0,
    discountPercentage: 32,
    stock: 7,
    badge: { ar: "وفر 32% + هدية 🎁", en: "Save 32% + Gift 🎁" },
    rating: 5.0,
    reviewsCount: 184,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    bundle: {
      title: { ar: "محتويات بوكس العروس الملكي", en: "Royal Bridal Box Contents" },
      discount: 32,
      items: [
        {
          id: "sb-01",
          name: { ar: "مرطب الهيالورونيك المكثف", en: "Intense Hyaluronic Moisturizer" },
          priceUSD: 5.0,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "sb-02",
          name: { ar: "سيروم فيتامين سي النقي", en: "Pure Vitamin C Serum" },
          priceUSD: 5.8,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "sb-30",
          name: { ar: "لصقات الهيدروجيل الذهبية 24K", en: "24K Gold Eye Hydrogels" },
          priceUSD: 6.2,
          image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80"
        }
      ]
    },
    tabs: {
      description: {
        ar: "صندوق العناية الفاخر المخصص للعروس والمناسبات الخاصة، يجمع خماسي النضارة والترطيب العميق مع حقيبة مخملية وردية فاخرة مجانية وشحن سريع مجاني.",
        en: "Exclusive bridal ritual chest combining intense hyaluronic hydration, active vitamin C glow, and 24K gold hydrogel eye masks with a complimentary velvet keepsake bag."
      },
      usage: {
        ar: "يستخدم كبرنامج مكثف لمدة 3 أسابيع قبل المناسبة: الغسول ثم السيروم صباحاً ومساءً ولصقات الذهب مرتين أسبوعياً.",
        en: "Follow the 3-week pre-event ritual: cleanser, morning C serum, evening hyaluronic barrier cream, and gold hydrogels twice weekly."
      },
      ingredientsOrSpecs: {
        ar: "بوكس مخملي فاخر | 5 منتجات أصلية بالحجم الكامل | حقيبة قطنية ناعمة هدية | بطاقة تهنئة مخصصة بالاسم.",
        en: "Luxury Velvet Box | 5 Full-Size Certified Essentials | Complimentary Velvet Bag | Custom Gift Card."
      },
      reviews: {
        ar: "تقييم 5/5: 'أجمل هدية أهديتها لنفسي قبل زواجي، نضارة فورية وتغليف يفتح النفس!'",
        en: "5/5 Stars: 'The most sublime bridal gift! Instant radiance and breathtaking luxury packaging.'"
      }
    }
  },
  {
    id: "bundle-02",
    name: { ar: "مجموعة التفتيح وتوحيد لون البشرة المكثفة", en: "Intense Even Tone & Dark Spot Correction Set" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 18.5,
    originalPriceUSD: 26.0,
    discountPercentage: 29,
    stock: 9,
    badge: { ar: "الأكثر مبيعاً ☀️", en: "Best Seller ☀️" },
    rating: 4.9,
    reviewsCount: 162,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الفعالية الطبية لتفتيح آثار الحبوب والكلف: سيروم فيتامين C، سيروم النياسيناميد 10%، وتونر الجليكوليك المقشر بخصم 29%.",
        en: "Clinical triple radiance regimen synergizing pure vitamin C, niacinamide 10%, and glycolic solution to erase stubborn hyperpigmentation."
      },
      usage: {
        ar: "النياسيناميد وفيتامين C صباحاً مع واقي الشمس، وتونر الجليكوليك مساءً 3 مرات أسبوعياً.",
        en: "Apply niacinamide and C serum in mornings followed by SPF; use glycolic toner 3 nights weekly."
      },
      ingredientsOrSpecs: {
        ar: "فيتامين C نقي 15%، نياسيناميد 10% وزينك 1%، حمض الجليكوليك 7%، ماء الورد الجبلي.",
        en: "Pure Vitamin C 15%, Niacinamide 10% + Zinc 1%, Glycolic Acid 7%, Mountain Rose Water."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تصبغات الشمس اللي كانت في خدي تلاشت بنسبة 80% في أول شهر.'",
        en: "4.9/5 Stars: 'Stubborn sunspots faded by 80% within the first month. Incredible value!'"
      }
    }
  },
  {
    id: "bundle-03",
    name: { ar: "روتين الزجاج الكوري للنضارة الفائقة (Glass Skin)", en: "Korean Glass Skin Dewy Regimen Bundle" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 21.0,
    originalPriceUSD: 30.0,
    discountPercentage: 30,
    stock: 11,
    badge: { ar: "نضارة زجاجية 💎", en: "Glass Skin 💎" },
    rating: 5.0,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "سر البشرة الصافية اللامعة كالمرآة: سيروم الهيالورونيك خماسي الأبعاد + كريم البطيخ الهلامي + بخاخ رذاذ الندى المنعش.",
        en: "The ultimate 3-step Korean Glass Skin ritual: 5D Hyaluronic Serum, Watermelon Dew Jelly, and Aqua Cloud Mist."
      },
      usage: {
        ar: "طبقي السيروم على بشرة ندية، ثم ادهني الكريم الهلامي، ورشي رذاذ الوجه كلمسة ختامية تعكس الضوء.",
        en: "Layer serum over damp skin, seal with dew jelly, and spritz mist for an illuminated finish."
      },
      ingredientsOrSpecs: {
        ar: "حمض البولي جلوتاميك، 5 أوزان جزيئية من الهيالورونيك، مستخلص البطيخ والورد، صبار عضوي.",
        en: "Polyglutamic Acid, 5-Molecular Hyaluronic, Watermelon Extract, Aloe Hydrosol."
      },
      reviews: {
        ar: "تقييم 5/5: 'البشرة تلمع بدون أي ملمس دهني، كأنك مسوية تنظيف عميق يومياً!'",
        en: "5/5 Stars: 'Gleaming dewy complexion with zero oiliness. Feels like a fresh spa facial every day.'"
      }
    }
  },
  {
    id: "bundle-04",
    name: { ar: "بوكس الاسترخاء والترميم الليلي باللافندر والبابونج", en: "Lavender Night Restoration & Sleep Gift Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 19.8,
    originalPriceUSD: 28.0,
    discountPercentage: 29,
    stock: 8,
    badge: { ar: "ترميم ليلي 🌙", en: "Night Repair 🌙" },
    rating: 4.9,
    reviewsCount: 145,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "مجموعة العناية الليلية المهدئة التي ترمم حاجز البشرة أثناء النوم وتريح الحواس برائحة اللافندر الفرنسي العضوي.",
        en: "Overnight barrier restoration bundle infusing French lavender night balm, bakuchiol elixir, and soothing floral hydrosol."
      },
      usage: {
        ar: "وزعي بضع قطرات من إكسير الباكوتشيول ثم ضعي قناع النوم باللافندر ودلكي بلطف قبل النوم مباشرة.",
        en: "Apply bakuchiol elixir followed by generous layer of lavender sleep mask before bedtime."
      },
      ingredientsOrSpecs: {
        ar: "زيت اللافندر الفرنسي، باكوتشيول نباتي 2%، سيراميدات، زبدة شيا، كيس وسادة حريري هدية.",
        en: "French Lavender Oil, 2% Bakuchiol, Triple Ceramides, Free Silk Sleep Eye Mask."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'تصحين ووجهك مرتاح ومروي، ورائحة اللافندر تنومك براحة تامة.'",
        en: "4.9/5 Stars: 'Wake up with plump, rested skin. The soothing aroma lulls you into deep sleep.'"
      }
    }
  },
  {
    id: "bundle-05",
    name: { ar: "طقم صالون التصفيف المتكامل (مجفف نفاث + مكواة تيتانيوم)", en: "Pro Salon Hair Duo (Jet Dryer + Titanium Iron)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 59.0,
    originalPriceUSD: 85.0,
    discountPercentage: 30,
    stock: 5,
    badge: { ar: "وفر 30% + ضمان سنتين 🛡️", en: "Save 30% + 2Yr Warranty 🛡️" },
    rating: 5.0,
    reviewsCount: 220,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "البكج الأقوى لتصفيف الشعر: مجفف الشعر النفاث عالي السرعة 110,000 RPM مع مكواة التمليس الكورية بالتيتانيوم العريض، وضمان سنتين شامل معتمد.",
        en: "Ultimate pro styling combo pairing the 110k RPM brushless jet dryer with Korean wide titanium flat iron. Full 2-year warranty."
      },
      usage: {
        ar: "جففي الشعر في 5 دقائق بالمجفف النفاث ثم املسي الخصلات بسحبة واحدة ناعمة بالمكواة التيتانيوم.",
        en: "Dry thick hair in 5 mins with high-velocity airflow, then glide titanium plates for silk sleekness."
      },
      ingredientsOrSpecs: {
        ar: "محرك نفاث بدون فرش 110,000 RPM | صفائح تيتانيوم 45مم | فوهات مغناطيسية | حقيبة جلدية فاخرة مشمولة.",
        en: "110k RPM Brushless Motor | 45mm Titanium Plates | Magnetic Attachments | Pro Storage Bag."
      },
      reviews: {
        ar: "تقييم 5/5: 'البكج يسوى كل مليم! جودة الصالونات الفخمة عندك بالبيت، استغنيت عن الصالون نهائياً.'",
        en: "5/5 Stars: 'Worth every penny! True luxury salon performance right at home.'"
      }
    }
  },
  {
    id: "bundle-06",
    name: { ar: "مجموعة تنقية المسام ومكافحة الدهون والرؤوس السوداء", en: "Blemish, Blackhead & Pore Clarifying Tri-Set" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 14.8,
    originalPriceUSD: 21.0,
    discountPercentage: 29,
    stock: 12,
    badge: { ar: "تنقية المسام 🌿", en: "Pore Clearing 🌿" },
    rating: 4.8,
    reviewsCount: 139,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "روتين متكامل لتنظيف البشرة الدهنية والمختلطة: غسول الشاي الأخضر الرغوي + سيروم الساليسيليك BHA 2% + قناع الطين الوردي الأسترالي.",
        en: "Complete clarifying solution: Green Tea Foaming Cleanser, Salicylic BHA 2% drops, and Australian Pink Detox Clay."
      },
      usage: {
        ar: "اغسلي بالغسول يومياً، وضعي الساليسيليك على منطقة T ليلاً، وطبقي قناع الطين مرة أسبوعياً.",
        en: "Cleanse daily, apply BHA to T-zone at night, and indulge in clay mask once weekly."
      },
      ingredientsOrSpecs: {
        ar: "شاي أخضر عضوي، حمض ساليسيليك 2%، طين وردي أسترالي، زنك PCA، صبار مهدئ.",
        en: "Organic Green Tea, 2% Salicylic Acid, Australian Kaolin Clay, Zinc PCA, Aloe Vera."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'الرؤوس السوداء على الأنف والذقن اختفت، والدهون متوازنة طوال النهار.'",
        en: "4.8/5 Stars: 'Blackheads vanished and oiliness is kept perfectly in check all day.'"
      }
    }
  },
  {
    id: "bundle-07",
    name: { ar: "بوكس الويفي الشاطئي الاحترافي (مكواة 3 أسطوانات + سيروم حماية)", en: "Beach Wave Glamour Set (Triple Waver + Heat Serum)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 32.0,
    originalPriceUSD: 46.0,
    discountPercentage: 30,
    stock: 8,
    badge: { ar: "ويفي فوري 🌊", en: "Instant Waver 🌊" },
    rating: 4.9,
    reviewsCount: 167,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "طقم تمويج الشعر السريع: مكواة ويفي ثلاثية الأسطوانات تورمالين مقاس 28مم مع زيت الأرغان المغربي النقي لحماية ألياف الشعر وإضفاء لمعان جذاب.",
        en: "Triple 28mm tourmaline ceramic waver packaged with pure Moroccan argan elixir for heat defense and high shine."
      },
      usage: {
        ar: "وزعي قطرتين من زيت الأرغان على أطراف الشعر، ثم اضغطي المكواة لمدة 6 ثوانٍ على كل خصلة.",
        en: "Smooth 2 drops of argan oil on mid-lengths, clamp waver for 6 seconds per section."
      },
      ingredientsOrSpecs: {
        ar: "مكواة ثلاثية 28مم مع شاشة LED | زيت أرغان عضوي 50مل معصور على البارد | قفاز حراري | ضمان سنتين.",
        en: "28mm Triple Waver with LED | 50ml Cold-Pressed Argan Oil | Heat Glove | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'الويفي يطلع متناسق وعريض وثابت يومين كاملين بدون أي تطاير.'",
        en: "4.9/5 Stars: 'Consistent, defined waves that stay locked in for 2 days without crunch.'"
      }
    }
  },
  {
    id: "bundle-08",
    name: { ar: "مجموعة العناية الفائقة بمحيط العين والشفاه", en: "Total Eye & Lip Rejuvenation Duo Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 11.5,
    originalPriceUSD: 17.0,
    discountPercentage: 32,
    stock: 15,
    badge: { ar: "عناية دقيقة 👁️", en: "Eye & Lip 👁️" },
    rating: 4.9,
    reviewsCount: 178,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثنائي العناية الأكثر مبيعاً: سيروم الكافيين 5% وشاي الماتشا لمحيط العين مع بلسم الشفاه المعالج بزيوت التوت وببتيدات الامتلاء الوردية.",
        en: "Bestselling delicate zones duo: Caffeine 5% Eye Awakening Serum paired with Berry Peptide Recovery Lip Balm."
      },
      usage: {
        ar: "طبطبي سيروم العين صباحاً ومساءً، وادهني بلسم الشفاه على مدار اليوم كترطيب وردي جذاب.",
        en: "Dab eye serum around orbital bone, apply peptide berry balm liberally on lips."
      },
      ingredientsOrSpecs: {
        ar: "كافيين 5% نقي، ماتشا يابانية، ببتيدات امتلاء الشفاه، شمع عسل طبيعي، فيتامين E.",
        en: "5% Caffeine, Japanese Matcha, Volumizing Peptides, Pure Beeswax, Vitamin E."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'انتفاخات الصباح اختفت والشفاه صارت رطبة ووردية بشكل طبيعي.'",
        en: "4.9/5 Stars: 'Morning eye puffiness gone and lips look naturally juicy and plump.'"
      }
    }
  },
  {
    id: "bundle-09",
    name: { ar: "طقم الاستشوار والتكثيف البيضاوي (فرشاة بلو آوت + مقشر القهوة)", en: "Luxury Body & Hair Blowout Pamper Set" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 27.0,
    originalPriceUSD: 39.0,
    discountPercentage: 30,
    stock: 9,
    badge: { ar: "تدليل كامل ☕", en: "Pamper Duo ☕" },
    rating: 4.8,
    reviewsCount: 141,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "طقم الدلال المنزلي: فرشاة الاستشوار الحرارية لتكثيف الجذور مع مقشر القهوة العربية وزيت اللوز لنعومة الجسم والاسترخاء التام.",
        en: "Self-care bundle uniting the salon oval blowout air brush with arabian coffee sweet almond body polish."
      },
      usage: {
        ar: "استخدمي مقشر القهوة أثناء الشاور، ثم جففي وسرحي شعرك بالفرشاة البيضاوية لإطلالة صالون مكتملة.",
        en: "Exfoliate with coffee polish in shower, then style damp hair with oval blowout brush."
      },
      ingredientsOrSpecs: {
        ar: "فرشاة استشوار 75مم أيونية | مقشر بن عربي وزيت لوز 250جم | سلك 360° | ضمان سنتين شامل.",
        en: "75mm Ionic Oval Styler | 250g Arabica Almond Polish | 360° Cord | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'ريحة القهوة ونعومة الجسم تجنن، والشعر يطلع فيه فوليوم يفتح النفس.'",
        en: "4.8/5 Stars: 'Coffee aroma is divine and the hair brush gives salon-grade bouncy roots.'"
      }
    }
  },
  {
    id: "bundle-10",
    name: { ar: "بوكس العناية بحاجز البشرة التالف والحساسة (Cica & Ceramides)", en: "Emergency Barrier Rescue & Cica Soothing Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 16.5,
    originalPriceUSD: 23.5,
    discountPercentage: 30,
    stock: 14,
    badge: { ar: "علاج الحساسية 🛡️", en: "Barrier Rescue 🛡️" },
    rating: 5.0,
    reviewsCount: 205,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "طقم الإنقاذ المعتمد للبشرة المتهيجة أو المتضررة من التقشير والشمس: سيروم السنتيلا 75% + كريم السيراميدات الثلاثية المرمم + جل الصبار العضوي 99%.",
        en: "Triple dermatologist-curated barrier rescue: Centella 75% serum, Multi-Ceramide defense cream, and 99% organic soothing aloe."
      },
      usage: {
        ar: "ضعي جل الصبار لتبريد الوجه، يليه سيروم السنتيلا لتهدئة الاحمرار، ثم اقفلي الرطوبة بكريم السيراميدات.",
        en: "Cool skin with aloe gel, soothe redness with cica serum, and lock barrier with ceramides."
      },
      ingredientsOrSpecs: {
        ar: "سنتيلا آسياتيكا 75%، سيراميدات نباتية 1، 3، 6-II، عصير صبار عضوي 99%، بانثينول B5.",
        en: "75% Centella Asiatica, Plant Ceramides (1, 3, 6-II), 99% Organic Aloe, Provitamin B5."
      },
      reviews: {
        ar: "تقييم 5/5: 'أنقذ وجهي بعد جلسة ليزر قاسية، الاحمرار والحكة اختفت خلال 24 ساعة فقط!'",
        en: "5/5 Stars: 'Rescued my skin after an intense laser peel. Stinging stopped in 24 hours.'"
      }
    }
  },
  {
    id: "bundle-11",
    name: { ar: "مجموعة مكافحة علامات التقدم والشد بالكولاجين البحري", en: "Marine Collagen & Multi-Peptide Youth Elixir Set" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 19.5,
    originalPriceUSD: 28.0,
    discountPercentage: 30,
    stock: 8,
    badge: { ar: "شد وامتلاء 🌊", en: "Youth Lift 🌊" },
    rating: 4.9,
    reviewsCount: 153,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثنائي الشباب المتطور: سيروم الكولاجين البحري المتحلل وببتيدات الامتلاء مع سيروم شد ونحت الرقبة والفك بتركيز ببتيدات النحاس.",
        en: "Advanced youth duo pairing Marine Hydrolysed Collagen Serum with Multi-Peptide Sculpting Neck & Jawline drops."
      },
      usage: {
        ar: "دلكي الوجه بالكولاجين والرقبة بسيروم النحت بحركات صاعدة مرتين يومياً صباحاً ومساءً.",
        en: "Smooth collagen over face and sculpting serum along jawline with firm upward strokes."
      },
      ingredientsOrSpecs: {
        ar: "كولاجين بحري متحلل، ببتيدات ماتريكسيل 3000، ببتيدات النحاس، حمض الهيالورونيك.",
        en: "Marine Collagen Peptides, Matrixyl 3000, Copper Tripeptides, Multi-Hyaluronic."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'الخطوط التعبيرية حول الفم والرقبة مشدودة وناعمة، والوجه ممتلئ بحيوية.'",
        en: "4.9/5 Stars: 'Smile lines and neck horizontal creases look remarkably smoothed and bouncy.'"
      }
    }
  },
  {
    id: "bundle-12",
    name: { ar: "طقم أجهزة التمويج المزدوج (كيرلي حلزوني + فير مخروطي)", en: "Dual Waver Pro Set (Spiral Iron + Tapered Wand)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 39.0,
    originalPriceUSD: 56.0,
    discountPercentage: 30,
    stock: 6,
    badge: { ar: "جهازين في بوكس واحد 🎁", en: "2 Irons in 1 Box 🎁" },
    rating: 5.0,
    reviewsCount: 169,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "بوكس التمويج الشامل: مكواة التمويج الحلزونية 32مم للتسريحات العريضة + الفير المخروطي 19-32مم للكيرلي المتدرج الطبيعي، مع قفاز حراري وضمان سنتين.",
        en: "Ultimate curl variety bundle combining 32mm spiral iron with 19-32mm tapered conical wand and pro thermal glove."
      },
      usage: {
        ar: "اختاري الأسطوانة الحلزونية للويفي اليومي الواسع، أو الفير المخروطي للكيرلي المتماسك للمناسبات.",
        en: "Select 32mm spiral for effortless casual waves, or tapered wand for defined occasion ringlets."
      },
      ingredientsOrSpecs: {
        ar: "جهازان كاملان | أسطوانات سيراميك تورمالين | قفاز حراري عازل | حرارة حتى 220°C | ضمان سنتين.",
        en: "Two Full Devices | Tourmaline Ceramic Barrels | Insulated Heat Glove | Max 220°C | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'أفضل استثمار لشعري! أغير ستايل الويفي وقت ما أحب بدون ما اشتري أجهزة ثانية.'",
        en: "5/5 Stars: 'Best hair styling investment! Switch between beachy and formal curls with ease.'"
      }
    }
  },
  {
    id: "bundle-13",
    name: { ar: "بوكس الترطيب المضاعف (مرطب الهيالورونيك + زيت بذور ثمر الورد)", en: "Double Hydration & Barrier Lock Power Pair" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 9.8,
    originalPriceUSD: 14.0,
    discountPercentage: 30,
    stock: 18,
    badge: { ar: "ترطيب مضاعف 💧", en: "Double Moisture 💧" },
    rating: 4.9,
    reviewsCount: 215,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "الثنائي النباتي الأكثر كفاءة لحبس الرطوبة: مرطب الهيالورونيك المكثف كقاعدة مائية مروية متبوعاً بقطرات زيت ثمر الورد العضوي لقفل الرطوبة 24 ساعة.",
        en: "Synergistic botanical moisture lock: Hyaluronic Moisturizer hydration base sealed with pure cold-pressed rosehip seed oil."
      },
      usage: {
        ar: "ادهني الكريم المرطب أولاً ثم دفئي قطرتين من زيت ثمر الورد وطبطبي بهما فوق الكريم ليلاً.",
        en: "Apply hyaluronic cream onto face, warm 2 drops of rosehip oil between palms and pat over top."
      },
      ingredientsOrSpecs: {
        ar: "حمض الهيالورونيك الثلاثي، خلاصة اللافندر، زيت بذور ثمر الورد المعصور على البارد 100%.",
        en: "Triple Hyaluronic Complex, Lavender Blossom Water, 100% Virgin Rosehip Seed Oil."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'وجهي كان جاف جداً ويتقشر، هذا الثنائي أعاد له المرونة والنضارة من أول يومين.'",
        en: "4.9/5 Stars: 'Cured my dry, flaky patches within two days. Skin feels plump and velvety.'"
      }
    }
  },
  {
    id: "bundle-14",
    name: { ar: "مجموعة التجديد والتقشير الأسبوعي (محلول AHA/BHA + سيروم السنتيلا)", en: "Weekly Facial Peel & Cica Calming Recovery Duo" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 10.2,
    originalPriceUSD: 14.5,
    discountPercentage: 30,
    stock: 11,
    badge: { ar: "تقشير وترميم 🧪", en: "Peel & Repair 🧪" },
    rating: 4.8,
    reviewsCount: 164,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "برنامج العيادة المنزلي الأسبوعي: محلول تقشير أحماض الفواكه AHA 30% + BHA 2% متبوعاً بسيروم السنتيلا المهدئ الفوري لمنع أي تهيج أو احمرار.",
        en: "Professional home clinical peel pair: AHA 30% + BHA 2% exfoliant countered by pure 75% Centella calming rescue."
      },
      usage: {
        ar: "يوضع محلول التقشير لـ 10 دقائق فقط مساءً ثم يشطف بماء فاتر وتوضع قطرات سخية من سيروم السنتيلا.",
        en: "Apply peel solution for 10 minutes max, rinse cleanly with warm water, and flood skin with cica serum."
      },
      ingredientsOrSpecs: {
        ar: "حمض جليكوليك ولاكتيك وساليسيليك، فلفل تيسماني مهدئ، سنتيلا آسياتيكا 75%، ببتيدات النحاس.",
        en: "Glycolic, Lactic, Salicylic Acid Blend, Tasmanian Pepperberry, 75% Cica, Copper Peptides."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'أحسن كومبو للتقشير! يعطيك نضارة الصالونات وبنفس الوقت السنتيلا تمنع الاحمرار تماماً.'",
        en: "4.8/5 Stars: 'Best peeling combo ever. Spa glow with zero post-peel redness thanks to cica.'"
      }
    }
  },
  {
    id: "bundle-15",
    name: { ar: "بوكس العناية الصيفية الشاملة (واقي شمس مائي SPF50 + جل الصبار 99% + رذاذ الوجه)", en: "Ultimate Sun & Heat Defense Summer Trousseau" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 12.5,
    originalPriceUSD: 18.0,
    discountPercentage: 31,
    stock: 20,
    badge: { ar: "انتعاش الصيف ☀️", en: "Summer Care ☀️" },
    rating: 5.0,
    reviewsCount: 240,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الحماية والبرودة لمواجهة حرارة وشمس الصيف: واقي شمس مائي خفيف SPF 50+ بدون لمعة أو أثر أبيض + جل صبار عضوي 99% مبرد + رذاذ حمض الهيالورونيك.",
        en: "Triple heatwave protection: Aqua SPF 50+ Invisible Sunscreen, 99% Cooling Organic Aloe Gel, and Hyaluronic Dew Mist."
      },
      usage: {
        ar: "ضعي واقي الشمس صباحاً قبل الخروج، وجل الصبار بعد العودة للشمس، ورذاذ الوجه في أي وقت أثناء اليوم.",
        en: "Apply sunscreen in mornings, soothe skin with aloe post-sun, and spritz mist whenever refreshed."
      },
      ingredientsOrSpecs: {
        ar: "حماية واسعة SPF 50+ PA++++، صبار عضوي نقي 99%، حمض هيالورونيك منخفض الوزن، مستخلص شاي أخضر.",
        en: "SPF 50+ PA++++ Broad Protection, 99% Organic Aloe, Low-Molecular Hyaluronic, Green Tea."
      },
      reviews: {
        ar: "تقييم 5/5: 'البكج المنقذ في حرارة السودان والخليج! واقي الشمس خفيف وما يعرق والرذاذ بارد ومنعش.'",
        en: "5/5 Stars: 'Absolute lifesaver in hot weather! The sunscreen is breathable and mist feels heavenly.'"
      }
    }
  },
  {
    id: "bundle-16",
    name: { ar: "بوكس الديتوكس الوردي الملكي لتنقية المسام وتنعيم البشرة", en: "Pink Detox Kaolin Clay & Cleansing Royal Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 13.9,
    originalPriceUSD: 19.5,
    discountPercentage: 29,
    stock: 9,
    badge: { ar: "ديتوكس ونقاء 🌸", en: "Pink Detox 🌸" },
    rating: 4.9,
    reviewsCount: 154,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "صندوق التنقية الوردي: قناع الطين الوردي الأسترالي لسحب السموم مع ماء ميسيلار بماء الزهر لإزالة المكياج بلطف وفرشاة تطبيق فاخرة هدية.",
        en: "Pink detox bundle pairing Australian pink kaolin clay mask with neroli blossom micellar water and custom applicator brush."
      },
      usage: {
        ar: "امسحي المكياج بماء الميسيلار، ثم طبقي قناع الطين 10 دقائق واشطفيه لنقاء مسام استثنائي.",
        en: "Sweep micellar water over face, smooth clay mask for 10 minutes, and rinse for clarified pores."
      },
      ingredientsOrSpecs: {
        ar: "طين وردي أسترالي، ماء زهر البرتقال العضوي، خلاصة الصبار، فيتامين E، فرشاة تطبيق سيليكون.",
        en: "Australian Pink Clay, Organic Neroli Hydrosol, Aloe Leaf, Vitamin E, Silicone Applicator."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'ينظف المسام من قلب وريحته ورد طبيعي تفتح النفس.'",
        en: "4.9/5 Stars: 'Deeply unclogs pores and leaves a heavenly natural rose scent.'"
      }
    }
  },
  {
    id: "bundle-17",
    name: { ar: "مجموعة التفتيح المتقدم بالأربوتين والأزيليك للكلف العنيد", en: "Advanced Melanin-Block Brightening Duo (Arbutin + Azelaic)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 10.5,
    originalPriceUSD: 15.0,
    discountPercentage: 30,
    stock: 14,
    badge: { ar: "علاج الكلف 🎯", en: "Melanin Block 🎯" },
    rating: 4.8,
    reviewsCount: 168,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "التركيبة الطبية المزدوجة لاستهداف فرط التصبغ: سيروم ألفا أربوتين 2% المثبط للميلانين مع حمض الأزيليك 10% المعالج لآثار الكلف والنمش.",
        en: "Clinical dark mark correcting pair blending Alpha Arbutin 2% with Azelaic Acid 10% to curb stubborn discoloration."
      },
      usage: {
        ar: "يوضع الأربوتين صباحاً يليه واقي الشمس، والأزيليك مساءً على التصبغات أو الوجه كاملاً.",
        en: "Layer arbutin in mornings under sunscreen, apply azelaic in evenings on targeted spots."
      },
      ingredientsOrSpecs: {
        ar: "ألفا أربوتين نقي 2%، حمض أزيليك نقي 10%، خلاصة التوت البري، خلاصة العرقسوس.",
        en: "Alpha Arbutin 2%, Azelaic Acid 10%, Bearberry Bio-Extract, Licorice Root."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'أفضل علاج لتصبغات الحمل والكلف بدون ما يقشر أو يهيج البشرة.'",
        en: "4.8/5 Stars: 'Safest and most effective melasma fading pair. Zero burning or flaking.'"
      }
    }
  },
  {
    id: "bundle-18",
    name: { ar: "بكج العناية بالشفاه والمكياج النظيف (بلسم توت + ماء ميسيلار + رذاذ ندى)", en: "Clean Glam & Lip Revival Trio Pack" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 9.9,
    originalPriceUSD: 14.5,
    discountPercentage: 32,
    stock: 22,
    badge: { ar: "إشراقة يومية 🍓", en: "Daily Glow 🍓" },
    rating: 4.9,
    reviewsCount: 210,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الشنطة اليومي المفضل لدى العميلات: بلسم التوت الوردي ببتيد الشفاه + ماء ميسيلار بماء الزهر + رذاذ تثبيت وترطيب الوجه المنعش.",
        en: "Everyday essentials trio: Berry Glow Lip Butter, Blossom Micellar Water, and Aqua Cloud Mist."
      },
      usage: {
        ar: "رشي الرذاذ لتثبيت مظهر البشرة الطبيعي وادهني مرطب الشفاه، واستخدمي الميسيلار في المساء لإزالة لطيفة.",
        en: "Mist to refresh makeup and hydrate lips; wipe away clean at end of day with micellar."
      },
      ingredientsOrSpecs: {
        ar: "ببتيدات الشفاه، شمع عسل، ماء زهر البرتقال، حمض الهيالورونيك، خلاصة الخيار.",
        en: "Volumizing Lip Peptides, Beeswax, Neroli Water, Hyaluronic Acid, Cucumber Hydrosol."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'ما استغنى عنهم بالشنطة للجامعة والدوام، حجم وتوفير وترطيب يجنن.'",
        en: "4.9/5 Stars: 'Never leave home without these. Essential for university and daily work bags.'"
      }
    }
  },
  {
    id: "bundle-19",
    name: { ar: "بوكس الترميم بالسيراميدات وزيت الأرغان المغربي النقي", en: "Ceramide Barrier & Pure Argan Gold Restoration Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 12.0,
    originalPriceUSD: 17.0,
    discountPercentage: 29,
    stock: 12,
    badge: { ar: "تغذية عميقة 🛡️", en: "Deep Nourish 🛡️" },
    rating: 5.0,
    reviewsCount: 175,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "طقم الترميم الفائق للبشرة والشعر شديدي الجفاف: كريم السيراميدات النباتية الثلاثية مع زجاجة زيت الأرغان المغربي المعصور على البارد 100%.",
        en: "Intense barrier recovery duo: Multi-Ceramide Defense Cream matched with 100% pure Moroccan Argan liquid gold."
      },
      usage: {
        ar: "استخدمي كريم السيراميد للوجه، ودلكي بضع قطرات من زيت الأرغان على أطراف الشعر والرقبة.",
        en: "Apply ceramide cream to face; massage golden argan drops through split ends and neckline."
      },
      ingredientsOrSpecs: {
        ar: "سيراميدات 1 و3 و6-II، زبدة شيا، زيت أرغان نقي 100% معصور على البارد من المغرب.",
        en: "Triple Ceramides, Raw Shea, 100% Virgin Cold-Pressed Moroccan Argania Oil."
      },
      reviews: {
        ar: "تقييم 5/5: 'عالج جفاف شعري وأعاد نضارة وجهي، ريحة الأرغان أصلية ومضمونة.'",
        en: "5/5 Stars: 'Completely transformed dry hair ends and restored skin supple radiance.'"
      }
    }
  },
  {
    id: "bundle-20",
    name: { ar: "طقم التصفيف الهوائي 7 في 1 الملكي مع حقيبة تخزين فاخرة", en: "Royal 7-in-1 AirWrap Multi-Styler Prestige Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 49.0,
    originalPriceUSD: 70.0,
    discountPercentage: 30,
    stock: 6,
    badge: { ar: "بكج 7 في 1 الشامل", en: "7-in-1 Kit" },
    rating: 5.0,
    reviewsCount: 260,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "الحقيبة الملكية الكاملة: جهاز التصفيف الهوائي مع 7 رؤوس لتجفيف الشعر وتمويجه أوتوماتيكياً بتأثير كواندا الهوائي، مع حقيبة جلدية مقاومة للحرارة.",
        en: "Complete air-styling salon wardrobe featuring 7 modular heads harnessing aerodynamic Coanda curl and dry power."
      },
      usage: {
        ar: "ركبي رأس التمويج أو التمليس أو التجفيف بضغطة زر واحدة، واستمتعي بتصفيف صحي خالي من أضرار الحرارة المفرطة.",
        en: "Snap on desired styling head for heat-regulated air curling, smoothing, or rapid drying."
      },
      ingredientsOrSpecs: {
        ar: "7 رؤوس احترافية شاملة | تقنية كواندا الهوائية | حقيبة جلدية مبطنة فاخرة | ضمان سنتين شامل معتمد.",
        en: "7 Interchangeable Attachments | Aerodynamic Coanda Effect | Pro Leather Storage Box | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 5/5: 'يغنيك عن كل مصففات الشعر الموجودة بالسوق، جودة أصلية وفخامة تامة.'",
        en: "5/5 Stars: 'Replaces every styling tool in your closet. Pure luxury performance!'"
      }
    }
  },
  {
    id: "bundle-21",
    name: { ar: "بكج الشاي الأخضر والسنتيلا المهدئ للحبوب والاحمرار (مع 5 ماسكات ورقية)", en: "Green Tea & Cica Anti-Acne Reset Kit (with 5 Sheet Masks)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 12.8,
    originalPriceUSD: 18.5,
    discountPercentage: 31,
    stock: 16,
    badge: { ar: "تهدئة الحبوب 🌿", en: "Blemish Reset 🌿" },
    rating: 4.9,
    reviewsCount: 192,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "برنامج التهدئة السريعة للبشرة المعرضة للحبوب: غسول الشاي الأخضر الرغوي + سيروم السنتيلا والببتيدات + بكج من 5 ماسكات ورقية بشجرة الشاي.",
        en: "Calming acne reset kit: Green Tea Foaming Wash, Centella Calming Drops, and 5 Tea Tree Infused Sheet Masks."
      },
      usage: {
        ar: "اغسلي بالغسول يومياً، وطبقي السيروم صباحاً ومساءً، واستخدمي ماسكاً ورقياً بارداً مرتين أسبوعياً.",
        en: "Cleanse daily, apply cica drops day and night, use chilled sheet mask twice weekly."
      },
      ingredientsOrSpecs: {
        ar: "مستخلص الشاي الأخضر، سنتيلا آسياتيكا 75%، زيت شجرة الشاي العضوي، بانثينول B5.",
        en: "Green Tea Bio-Extract, 75% Centella, Organic Tea Tree, Provitamin B5."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'الحبوب الملتهبة خفت وانتفاخها نزل من أول ليلة مع الماسك والسيروم.'",
        en: "4.9/5 Stars: 'Inflamed acne redness calmed overnight using the sheet mask and cica serum.'"
      }
    }
  },
  {
    id: "bundle-22",
    name: { ar: "مجموعة الزيوت العضوية الثلاثية النقية (ثمر الورد + أرغان + سكوالين)", en: "Pure Botanical Oil Trio (Rosehip + Argan + Squalane)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 14.5,
    originalPriceUSD: 21.0,
    discountPercentage: 31,
    stock: 13,
    badge: { ar: "زيوت نقية 100% 🌿", en: "Pure Oils 🌿" },
    rating: 5.0,
    reviewsCount: 228,
    images: [
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الزيوت الطبيعية الأغنى عالمياً: زيت بذور ثمر الورد لتجديد الندبات، زيت الأرغان المغربي لتغذية الشعر والوجه، وسكوالين قصب السكر الخفيف لحبس الرطوبة.",
        en: "The holy trinity of virgin botanical oils: Cold-pressed Rosehip Seed, Moroccan Argan, and Plant Squalane."
      },
      usage: {
        ar: "استخدمي السكوالين نهاراً، وزيت ثمر الورد ليلاً، وزيت الأرغان لأطراف الشعر والجفاف الشديد.",
        en: "Use weightless squalane by day, rosehip by night, and argan for hair ends and body dry spots."
      },
      ingredientsOrSpecs: {
        ar: "3 زجاجات زجاجية معتمة بقطارة | زيوت نقية 100% معصورة على البارد خالية من الإضافات والعطور الصناعية.",
        en: "3 Amber Dropper Bottles | 100% Virgin Cold-Pressed Unrefined Botanical Oils."
      },
      reviews: {
        ar: "تقييم 5/5: 'أنقى زيوت استخدمتها بحياتي! ما تطلع حبوب وامتصاصها فوري ونعومتها لا توصف.'",
        en: "5/5 Stars: 'Purest botanical oils! Non-comedogenic, instant absorption, and silk soft skin.'"
      }
    }
  },
  {
    id: "bundle-23",
    name: { ar: "بوكس النضارة السريعة قبل المناسبات (لصقات ذهب + فيتامين C + بخاخ ندى)", en: "Pre-Event Instant Radiance Glow Box" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 13.5,
    originalPriceUSD: 19.5,
    discountPercentage: 31,
    stock: 10,
    badge: { ar: "إشراقة المناسبات", en: "Party Glow" },
    rating: 4.9,
    reviewsCount: 184,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "طقم الإشراقة الفورية قبل الحفلات والمناسبات: 60 لصقة هيدروجيل بالذهب عيار 24 تحت العين + سيروم فيتامين C النقي + رذاذ الوجه المنعش.",
        en: "Instant party glow solution: 60x 24K Gold Hydrogel eye patches, Pure Vitamin C serum, and Dew Cloud Mist."
      },
      usage: {
        ar: "ضعي لصقات الذهب 15 دقيقة قبل المكياج، تليها قطرات فيتامين C، ورذاذ الوجه لتثبيت إطلالة زجاجية ندية.",
        en: "Apply gold eye hydrogels for 15 mins before makeup, smooth C serum, and spritz mist to lock glow."
      },
      ingredientsOrSpecs: {
        ar: "ذهب 24K، فيتامين C نقي 15%، كولاجين بحري، مياه نبع جبلية، حمض هيالورونيك.",
        en: "24K Colloidal Gold, Pure 15% Vitamin C, Marine Collagen, Mountain Spring Water, Hyaluronic."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'المكياج يطلع نظيف وما يخطط تحت العين أبداً بعد هذا البكج، سر كل مناسباتي!'",
        en: "4.9/5 Stars: 'Concealer never creases under eyes after this routine. My pre-event secret weapon!'"
      }
    }
  },
  {
    id: "bundle-24",
    name: { ar: "طقم التمليس الأيوني وفرد الجذور (فرشاة حرارية + مشط دقيق للجذور)", en: "Root-to-Tip Sleek Straightening Pro Kit" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 36.0,
    originalPriceUSD: 51.0,
    discountPercentage: 29,
    stock: 8,
    badge: { ar: "فرد الجذور والأطراف ⚡", en: "Root & Tip ⚡" },
    rating: 4.8,
    reviewsCount: 136,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "البكج المزدوج للتمليس المتكامل: فرشاة الفرد والتمليس الحرارية الأيونية لفرد خصلات الشعر كاملة في 5 دقائق مع مشط تمليس الجذور والبيبي هير الدقيق.",
        en: "Root-to-tip styling set pairing the heated ionic ceramic paddle brush with the fine-toothed root edge comb."
      },
      usage: {
        ar: "استخدمي المشط الدقيق لتمليس منابت الشعر ومقدمة الرأس، ثم مشطي كامل الشعر بالفرشاة الأيونية.",
        en: "Smooth hairline baby hairs with precision comb, then glide ionic brush through lengths."
      },
      ingredientsOrSpecs: {
        ar: "فرشاة أيونية 3D + مشط دقيق للجذور | أسنان سيراميك مضادة للحروق | حرارة حتى 210°C | ضمان سنتين.",
        en: "Ionic 3D Brush + Root Precision Comb | Anti-Scald Ceramic Teeth | Up to 210°C | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.8/5: 'الجذور المتموجة اللي تحت الطرحة صارت مفرودة بسهولة وبدون أي مجهود.'",
        en: "4.8/5 Stars: 'Wavy roots stay sleek effortlessly. Incredible time-saver in the mornings.'"
      }
    }
  },
  {
    id: "bundle-25",
    name: { ar: "بكج الروتين الصباحي المتكامل (غسول شاي أخضر + تونر ماء ورد + واقي شمس SPF50)", en: "Essential Morning Cleanse & Shield Routine" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 13.0,
    originalPriceUSD: 18.5,
    discountPercentage: 30,
    stock: 19,
    badge: { ar: "روتين صباحي ☀️", en: "Morning Routine ☀️" },
    rating: 4.9,
    reviewsCount: 245,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "الثلاثي الصباحي المعتمد طبياً: غسول الشاي الأخضر الرغوي، تونر ماء الورد والنياسيناميد المنعش، وواقي الشمس المائي الخفيف SPF 50+.",
        en: "The essential daily morning trio: Green Tea Foaming Wash, Rose Niacinamide Toner, and Aqua SPF 50+ Sunscreen."
      },
      usage: {
        ar: "اغسلي وجهك، رشي التونر المنعش، واختمي بطبقة واقي الشمس المائي قبل الخروج بـ 15 دقيقة.",
        en: "Wash with gentle foam, mist rose toner, and seal with broad-spectrum aqua sunscreen."
      },
      ingredientsOrSpecs: {
        ar: "شاي أخضر عضوي، ماء ورد مقطر، نياسيناميد 5%، فلاتر حماية ضوئية SPF 50+، مستخلص سنتيلا.",
        en: "Organic Green Tea, Distilled Rose Hydrosol, 5% Niacinamide, SPF 50+ UV Filters, Cica."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'روتين صباحي متكامل وخفيف على البشرة، ما يسبب أي ثقل أو لمعة دهنية.'",
        en: "4.9/5 Stars: 'Perfect morning trio! Weightless on skin with zero midday greasiness.'"
      }
    }
  },
  {
    id: "bundle-26",
    name: { ar: "بكج الروتين المسائي للترميم المكثف (زيت تطهير + باكوتشيول + كريم لافندر)", en: "Intense Night Repair & Double-Cleanse Trilogy" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 15.5,
    originalPriceUSD: 22.0,
    discountPercentage: 30,
    stock: 11,
    badge: { ar: "روتين مسائي 🌙", en: "Night Routine 🌙" },
    rating: 5.0,
    reviewsCount: 188,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الترميم الليلي المضاد للأكسدة: زيت التطهير المزدوج بالياسمين والجوجوبا لإذابة المكياج، يليه إكسير الباكوتشيول النباتي، وكريم اللافندر الليلي.",
        en: "Complete PM restorative ritual: Jasmine Jojoba Cleansing Oil, Phyto-Bakuchiol Night Elixir, and Lavender Repair Cream."
      },
      usage: {
        ar: "أزيلي المكياج بزيت التطهير، ضعي قطرات الباكوتشيول، ثم دلكي كريم اللافندر الليلي قبل النوم.",
        en: "Melt makeup with cleansing oil, apply bakuchiol drops, and massage calming lavender night cream."
      },
      ingredientsOrSpecs: {
        ar: "زيت جوجوبا وياسمين، باكوتشيول نقي 2%، زيت لافندر فرنسي، سيراميدات، زبدة شيا.",
        en: "Jojoba & Jasmine Oil, 2% Pure Bakuchiol, French Lavender, Ceramides, Raw Shea."
      },
      reviews: {
        ar: "تقييم 5/5: 'تنامين وانتي مرتاحة وتصحين بشرتك نضرة وصافية كأنك مسوية جلسة عناية مكثفة.'",
        en: "5/5 Stars: 'Sleep deeply and wake up with luminous supple skin like after a luxury facial.'"
      }
    }
  },
  {
    id: "bundle-27",
    name: { ar: "بوكس السبا المنزلي الفاخر (مقشر قهوة + زيت لوز + قناع طين وردي)", en: "Luxury Home Spa & Body Pamper Sanctuary Chest" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 14.0,
    originalPriceUSD: 20.0,
    discountPercentage: 30,
    stock: 14,
    badge: { ar: "سبا منزلي 🧖‍♀️", en: "Home Spa 🧖‍♀️" },
    rating: 4.9,
    reviewsCount: 165,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "تجربة السبا الملكي في منزلك: مقشر القهوة العربية وزيت اللوز الحلو للجسم + قناع الطين الوردي الأسترالي للوجه + ليفة تقشير طبيعية هدية.",
        en: "Home sanctuary pampering set: Arabian Coffee Body Polish, Australian Pink Detox Clay, and complimentary natural loofah."
      },
      usage: {
        ar: "دللي جسمك بمقشر القهوة أثناء الاستحمام، وطبقي قناع الطين على الوجه للاسترخاء وإزالة الإجهاد.",
        en: "Exfoliate body with coffee scrub in shower, apply pink clay to face to melt weekly stress."
      },
      ingredientsOrSpecs: {
        ar: "بن أرابيكا محمص، زيت لوز حلو، طين وردي أسترالي، عسل مانوكا، ليفة طبيعية مجانية.",
        en: "Roasted Arabica, Sweet Almond Oil, Australian Kaolin, Manuka Honey, Loofah Included."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'النعومة والريحة خياااال! كأنك طالعة من أرقى سبا في العالم.'",
        en: "4.9/5 Stars: 'Divine texture and aroma. Feels like stepping out of a world-class 5-star spa.'"
      }
    }
  },
  {
    id: "bundle-28",
    name: { ar: "طقم الكيرلي اللاسلكي المحمول للسفر (جهاز USB-C + زيت أرغان نقي للشنطة)", en: "Cordless Jet-Setter Hair Curling & Shine Travel Pack" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 35.0,
    originalPriceUSD: 50.0,
    discountPercentage: 30,
    stock: 7,
    badge: { ar: "طقم السفر والشنطة ✈️", en: "Travel Kit ✈️" },
    rating: 4.9,
    reviewsCount: 148,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثنائي السفر المثالي: جهاز تجعيد الشعر الذكي اللاسلكي القابل للشحن USB-C مع زيت الأرغان المغربي النقي بحجم السفر، وجراب مخملي لحفظ الجهاز.",
        en: "On-the-go styling set pairing the cordless rechargeable auto-curler with travel-sized pure Moroccan argan oil."
      },
      usage: {
        ar: "اشحني الجهاز واستخدميه لتجعيد الشعر في السيارة أو الفندق في دقائق، وضعي قطرة أرغان للمعان الحريري.",
        en: "Style hair anywhere with cordless ease; finish with a drop of argan oil for high-shine hold."
      },
      ingredientsOrSpecs: {
        ar: "جهاز كيرلي بطارية 5200mAh | منفذ USB-C | زيت أرغان 30مل معصور على البارد | جراب حراري | ضمان سنتين.",
        en: "5200mAh Auto Curler | USB-C Port | 30ml Virgin Argan Oil | Velvet Heat Pouch | 2-Year Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'الجهاز أنقذني في كل سفراتي ومناسباتي، كيرلي في أي مكان بدون فيش كهرباء!'",
        en: "4.9/5 Stars: 'Lifesaver for trips and weddings. Curl your hair anywhere without searching for wall plugs!'"
      }
    }
  },
  {
    id: "bundle-29",
    name: { ar: "بكج مضادات الأكسدة والنضارة الثلاثية (فيتامين C + نياسيناميد + كافيين للعين)", en: "Triple Anti-Oxidant & Eye Awakening Powerhouse" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 13.8,
    originalPriceUSD: 19.8,
    discountPercentage: 30,
    stock: 15,
    badge: { ar: "ثلاثي النضارة ⚡", en: "Anti-Oxidant Trio ⚡" },
    rating: 4.9,
    reviewsCount: 224,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "ثلاثي الفعالية الصباحية المعتمدة لمحاربة بهتان البشرة والإرهاق: سيروم فيتامين C النقي 15%، سيروم النياسيناميد 10% والزنك، وسيروم الكافيين 5% لمحيط العين.",
        en: "Morning brightening powerhouse: Pure Vitamin C 15%, Niacinamide 10% + Zinc, and Caffeine 5% Eye Awakening Drops."
      },
      usage: {
        ar: "وزعي الكافيين حول العينين، ثم امزجي قطرات النياسيناميد وفيتامين C على الوجه لتوحيد اللون والنضارة.",
        en: "Dab caffeine serum around orbital eye bone, follow with niacinamide and C drops across face."
      },
      ingredientsOrSpecs: {
        ar: "فيتامين C 15%، نياسيناميد 10%، زنك PCA 1%، كافيين 5%، شاي ماتشا ياباني.",
        en: "15% Vitamin C, 10% Niacinamide, 1% Zinc PCA, 5% Pure Caffeine, Japanese Matcha."
      },
      reviews: {
        ar: "تقييم 4.9/5: 'هذا البكج غير مظهر بشرتي 180 درجة، البهتان والهالات اختفوا وصار وجهي منور!'",
        en: "4.9/5 Stars: 'Completely transformed my dull complexion. Tired eye circles faded and my skin glows!'"
      }
    }
  },
  {
    id: "bundle-30",
    name: { ar: "البوكس الماسي الملكي الشامل (NADI Grand Diamond Heritage Chest)", en: "NADI Grand Diamond Heritage Royal Chest (6 Full Essentials)" },
    category: { ar: "البكجات والعروض", en: "Gift Sets" },
    basePriceUSD: 39.0,
    originalPriceUSD: 60.0,
    discountPercentage: 35,
    stock: 5,
    badge: { ar: "وفّري 35% + شحن مجاني 💎", en: "Save 35% + Free Express 💎" },
    rating: 5.0,
    reviewsCount: 310,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    tabs: {
      description: {
        ar: "الصندوق الماسي الفاخر الأكثر تميزاً في متجر نَدِي: يجمع 6 منتجات بالحجم الكامل من كبار المنتجات مبيعاً (مرطب الهيالورونيك، فيتامين C، غسول الشاي الأخضر، لصقات الذهب 24K، واقي شمس SPF50، وزيت الأرغان) مع حقيبة مخملية مطرزة وشحن مجاني مدى الحياة.",
        en: "The crown jewel of NADI: 6 full-sized icons in a bespoke velvet-lined vanity chest with complimentary express shipping and gift packaging."
      },
      usage: {
        ar: "روتين متكامل فاخر يغطي كافة احتياجات العناية الصباحية والمسائية والأسبوعية لمدة 3 أشهر كاملة.",
        en: "Complete 3-month comprehensive skincare ritual covering all morning, evening, and weekly treatment needs."
      },
      ingredientsOrSpecs: {
        ar: "صندوق خشبي مخملي فاخر | 6 منتجات كاملة أصلية 100% | حقيبة تجميل مخملية مطرزة | بطاقة إهداء مخصصة بالاسم.",
        en: "Luxury Velvet Keepsake Chest | 6 Full-Size Products | Embroidered Cosmetic Pouch | Personalized Card."
      },
      reviews: {
        ar: "تقييم 5/5: 'قمة الفخامة والروعة! وصلني بتغليف هدايا ملكي، وكل منتج أحسن من الثاني!'",
        en: "5/5 Stars: 'Absolute pinnacle of luxury! Arrived in magnificent royal packaging. Every product is perfection!'"
      }
    }
  }
];

