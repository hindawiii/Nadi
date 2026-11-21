import type { ImportableTemplate } from './siteTypes';

export const curatedImportableTemplates: ImportableTemplate[] = [
  {
    id: 'royal-perfumes',
    name: { ar: 'قالب عطور ومسك ملكي (Misk & Royal Oud)', en: 'Royal Oud & Haute Parfumerie' },
    nicheLabel: { ar: 'عطور ومسك شرقي', en: 'Haute Perfumery & Oud' },
    badge: { ar: 'قالب جاهز للاستيراد', en: 'Ready Template' },
    description: {
      ar: 'قالب فاخر مخصص لدور العطور الشرقية والفرنسية، مع بنرات دهن العود، والمسك الأبيض، وبكجات الهدايا الملكية.',
      en: 'Pre-configured bespoke template for Arabian Oud and luxury perfumes with gift set showcases.'
    },
    previewImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    paletteId: 'blush-cashmere',
    typographyId: 'royal-luxury',
    presetData: {
      id: 'cosmetics',
      nicheLabel: { ar: 'عطور ومسك ملكي', en: 'Royal Perfumes & Oud' },
      storeName: { ar: 'مِسك ونَفَحَات', en: 'Misk & Notes' },
      storeLogo: '',
      storeSlogan: { ar: 'نَفَحَات ملكية تأسر الحواس.', en: 'Royal olfactory whispers of heritage.' },
      topAnnouncement: {
        ar: 'عرض الموسم: احصل على تولة مسك غزال أصلية مجاناً عند طلب بوكس النخبة الملكي. تسوق الآن',
        en: 'Season Special: Complimentary pure deer musk with every Elite Collection gift box. Shop Now'
      },
      heroTitle: { ar: 'أصالة العود وسحر النَفَحَات الملكية', en: 'The Pure Aura of Royal Arabian Oud' },
      heroSubtitle: {
        ar: 'مستخلصات نادرة من أجود خشب العود الكمبودي والمسك الأبيض والورد الطائفي الفاخر لثبات يدوم لأيام.',
        en: 'Rare distillations of Cambodi agarwood, royal white musk, and Taif roses for enduring nobility.'
      },
      heroCtaPrimary: { ar: 'اكتشف مجموعة النخبة', en: 'Explore Elite Collection' },
      heroCtaSecondary: { ar: 'عينات التجربة', en: 'Order Discovery Kit' },
      heroImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      theme: {
        primaryBg: 'bg-[#831843]',
        primaryText: 'text-[#831843]',
        primaryHover: 'hover:bg-[#701A75]',
        accentColor: '#CA8A04',
        badgeBg: 'bg-amber-600',
        heroGradient: 'from-rose-50 via-pink-50/20 to-white'
      },
      valueProps: [
        {
          icon: 'Award',
          title: { ar: 'ثبات يدوم 72 ساعة', en: '72-Hour Longevity' },
          desc: { ar: 'تركيز زيتي عالي Pure Extrait de Parfum.', en: 'Concentrated pure perfume oil extracts.' }
        },
        {
          icon: 'Truck',
          title: { ar: 'شحن ملكي مبرد', en: 'Climate-Controlled Delivery' },
          desc: { ar: 'تغليف مخملي عازل للحرارة والضوء.', en: 'Velvet insulated gift packaging.' }
        },
        {
          icon: 'ShieldCheck',
          title: { ar: 'أصالة معتمدة 100%', en: 'Certified Authenticity' },
          desc: { ar: 'شهادة ضمان النقاء والتقطير الطبيعي.', en: 'Guaranteed pure natural distillation certificate.' }
        },
        {
          icon: 'CreditCard',
          title: { ar: 'دفع مرن عند المعاينة', en: 'Inspect Before Pay' },
          desc: { ar: 'حق تجربة العينة المرفقة قبل الاستلام.', en: 'Complimentary tester vial included with free returns.' }
        }
      ],
      contactInfo: {
        address: { ar: 'طريق الملك فهد، برج العطور الملكية، الرياض', en: 'King Fahd Road, Royal Perfume Tower, Riyadh' },
        phone: '+966 50 123 4567',
        email: 'concierge@misk-notes.com',
        whatsapp: '966501234567'
      },
      aboutStory: {
        title: { ar: 'قصة شغف بالتقطير اليدوي العريق', en: 'Our Heritage of Artisanal Distillation' },
        body: {
          ar: 'من غابات كمبوديا العتيقة إلى مزارع الورد الطائفي، نختار كل قطرة بعناية فائقة لنقدم لك عطراً يمثل بصمتك الخاصة ويبقى خالداً في الذاكرة.',
          en: 'From age-old Cambodian forests to blooming rose valleys, we distill every essence with exacting passion.'
        },
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
      },
      products: [
        {
          id: 'oud-01',
          name: { ar: 'عطر عود كمبودي معتق ملكي (Royal Aged Cambodi)', en: 'Royal Aged Cambodi Pure Extrait' },
          category: { ar: 'عطور العود الملكي', en: 'Royal Oud' },
          basePriceUSD: 145.0,
          originalPriceUSD: 195.0,
          discountPercentage: 25,
          stock: 6,
          badge: { ar: 'معتق 15 سنة', en: 'Aged 15 Years' },
          rating: 4.96,
          reviewsCount: 142,
          images: [
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
          ],
          tabs: {
            description: {
              ar: 'توليفة ساحرة تجمع بين فخامة العود الكمبودي المعتق ولمسات من دهن العنبر والزعفران الكشميري الأصيل.',
              en: 'A mesmerizing symphony blending 15-year aged Cambodi oud with warm amber and saffron.'
            },
            usage: {
              ar: 'رشة واحدة على أماكن النبض أو التبخير مع البخور تمنحك حضوراً آسراً يدوم لأيام.',
              en: 'Spray gently on pulse points or layer with incense for unforgettable presence.'
            },
            ingredientsOrSpecs: {
              ar: 'خشب العود الكمبودي الطبيعي، دهن العنبر الرمادي، زعفران كشميري، فانيليا مدغشقر.',
              en: 'Natural Cambodi Agarwood, Ambergris, Kashmiri Saffron, Bourbon Vanilla.'
            },
            reviews: {
              ar: 'أفخم عطر اقتنيته في حياتي، الثبات والفوحان لا يُقارن بأي متجر آخر!',
              en: 'The most regal scent I have ever encountered. Remarkable sillage.'
            }
          }
        },
        {
          id: 'oud-02',
          name: { ar: 'مسك الحرير والورد الأبيض (Silk White Musk)', en: 'Silk White Musk & Snow Lotus' },
          category: { ar: 'المسك الفاخر', en: 'Pure Musk' },
          basePriceUSD: 78.0,
          originalPriceUSD: 98.0,
          discountPercentage: 20,
          stock: 12,
          badge: { ar: 'الأكثر طلباً', en: 'Best Seller' },
          rating: 4.92,
          reviewsCount: 210,
          images: [
            'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
          ],
          tabs: {
            description: {
              ar: 'نقاء المسك الأبيض الناعم مع نوتات زنبق الوادي والورد الأبيض البودري لشعور منعش ومخملي بعد الاستحمام.',
              en: 'Ultra-pure white musk paired with lily of the valley and velvety powdery accords.'
            },
            usage: {
              ar: 'مثالي للاستخدام اليومي المباشر على البشرة الرطبة والشعر.',
              en: 'Ideal for daily post-shower application on warm skin.'
            },
            ingredientsOrSpecs: {
              ar: 'مسك أبيض مقطر، زنبق الوادي، بتلات الورد الطائفي الأبيض، أخشاب الأرز.',
              en: 'Distilled White Musk, White Rose Petals, Cedarwood, Lily of the Valley.'
            },
            reviews: {
              ar: 'رائحة نظافة ونعومة تدوم في الملابس حتى بعد الغسيل. خيالي!',
              en: 'Incredible clean powder scent that lingers gently all day long.'
            }
          }
        }
      ]
    }
  },
  {
    id: 'fine-jewelry',
    name: { ar: 'قالب مجوهرات وألماس رفيع (Lumière Fine Jewelry)', en: 'Lumière Haute Joaillerie' },
    nicheLabel: { ar: 'مجوهرات وألماس', en: 'Diamonds & High Jewelry' },
    badge: { ar: 'قالب جاهز للاستيراد', en: 'Ready Template' },
    description: {
      ar: 'قالب صُمم للمجوهرات الراقية، وخواتم السوليتير، وعقود الذهب عيار 18 مع شهادات نقاء الألماس GIA.',
      en: 'Haute Joaillerie template featuring diamond grading certificates and bespoke gold creations.'
    },
    previewImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    paletteId: 'emerald-velvet',
    typographyId: 'royal-luxury',
    presetData: {
      id: 'fashion',
      nicheLabel: { ar: 'مجوهرات وألماس رفيع', en: 'Fine Jewelry & Diamonds' },
      storeName: { ar: 'لـُـومـْيـِيـر', en: 'Lumière Joaillerie' },
      storeLogo: '',
      storeSlogan: { ar: 'بريق الألماس الخالد، صِيغ بحرفية الأجيال.', en: 'Timeless diamond brilliance, crafted for eternity.' },
      topAnnouncement: {
        ar: 'خدمة التصميم الخاص متاحة الآن: فصّلي خاتم أحلامك بحجر الماس معتمد بشهادة GIA الدولية. احجزي موعدك',
        en: 'Bespoke Atelier Open: Design your custom solitaire with certified GIA diamonds. Book Consultation'
      },
      heroTitle: { ar: 'بريق الألماس النقي وذهب عيار 18', en: 'Peerless Solitaires & 18K Solid Gold' },
      heroSubtitle: {
        ar: 'مجموعة لوميير الحصرية من خواتم الخطوبة، والأساور الماسية، والتصاميم اليدوية التي تروي قصة حب لا تنتهي.',
        en: 'Discover handcrafted engagement rings, diamond tennis bracelets, and bespoke heirlooms.'
      },
      heroCtaPrimary: { ar: 'تصفح أطقم الألماس', en: 'View High Jewelry' },
      heroCtaSecondary: { ar: 'شهادات الضمان', en: 'Diamond Guide' },
      heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      theme: {
        primaryBg: 'bg-[#0F4C3A]',
        primaryText: 'text-[#0F4C3A]',
        primaryHover: 'hover:bg-[#0A3528]',
        accentColor: '#D97706',
        badgeBg: 'bg-amber-600',
        heroGradient: 'from-emerald-50 via-teal-50/20 to-white'
      },
      valueProps: [
        {
          icon: 'ShieldCheck',
          title: { ar: 'شهادة GIA معتمدة', en: 'GIA Certified Gemstones' },
          desc: { ar: 'رقم ليزري محفور وشهادة نقاء رسمية.', en: 'Laser-inscribed authenticity seal.' }
        },
        {
          icon: 'Award',
          title: { ar: 'ذهب عيار 18 نقي', en: '18K Solid Gold' },
          desc: { ar: 'مختوم وموثق بموازين الدمغة الدولية.', en: 'Officially hallmarked fine gold alloys.' }
        },
        {
          icon: 'Truck',
          title: { ar: 'توصيل مصفح ومؤمّن', en: 'Armored & Insured Transit' },
          desc: { ar: 'تأمين كامل بنسبة 100% حتى باب دارك.', en: 'Full valuation transit insurance coverage.' }
        },
        {
          icon: 'CreditCard',
          title: { ar: 'صيانة وتلميع مدى الحياة', en: 'Lifetime Care & Cleaning' },
          desc: { ar: 'خدمة فحص وتلميع مجانية في كافة فروعنا.', en: 'Complimentary annual inspection & ultrasonic cleaning.' }
        }
      ],
      contactInfo: {
        address: { ar: 'حي العليا، بوليفارد المجوهرات، الرياض', en: 'Olaya District, Jewelry Boulevard, Riyadh' },
        phone: '+966 11 998 7766',
        email: 'atelier@lumiere-jewelry.com',
        whatsapp: '966119987766'
      },
      aboutStory: {
        title: { ar: 'ثلاثة أجيال من صياغة البريق النادر', en: 'Three Generations of Diamond Mastery' },
        body: {
          ar: 'ننتقي أحجار الألماس بدقة مجهرية وفق أعلى معايير النقاء والقطع اللامع، لتتحول كل قطعة إلى إرث عائلي يتوارثه الأحفاد.',
          en: 'Our master jewelers hand-select each gem for fire, clarity, and symmetry, fashioning enduring heirlooms.'
        },
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
      },
      products: [
        {
          id: 'jewel-01',
          name: { ar: 'خاتم سوليتير ماسي قطع بريليانت 1.5 قيراط (Eternal Solitaire)', en: 'Eternal Solitaire Diamond Ring 1.5ct' },
          category: { ar: 'خواتم سوليتير', en: 'Solitaire Rings' },
          basePriceUSD: 2400.0,
          originalPriceUSD: 2900.0,
          discountPercentage: 17,
          stock: 3,
          badge: { ar: 'GIA VVS1', en: 'GIA Certified' },
          rating: 4.98,
          reviewsCount: 88,
          images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
          ],
          tabs: {
            description: {
              ar: 'حجر ألماس طبيعي نقي 1.5 قيراط مثبت بـ 6 مخالب من البلاتين النقي على حلقة من الذهب الأبيض عيار 18.',
              en: 'Pure 1.5ct round brilliant diamond cradled in 6 platinum prongs atop an 18K solid white gold band.'
            },
            usage: {
              ar: 'يأتي داخل علبة خشب الجوز المضيئة مع شهادة GIA الرقمية وبطاقة ضمان الألماس.',
              en: 'Packaged in illuminated walnut gift presentation box with original GIA certificate.'
            },
            ingredientsOrSpecs: {
              ar: 'نقاء الماس: VVS1، اللون: D (عديم اللون تماماً)، القطع: ممتاز Excellent، وزن الذهب: 4.2 جرام.',
              en: 'Clarity: VVS1, Color: D (Colorless), Cut: Excellent, Gold: 18K White Gold 4.2g.'
            },
            reviews: {
              ar: 'الخاتم فاق كل التوقعات! لمعان الحجر في الضوء ساحر والشهادة معتمدة ورسمية.',
              en: 'Spectacular scintillation and fire. The GIA certificate arrived in pristine condition.'
            }
          }
        }
      ]
    }
  },
  {
    id: 'artisan-roastery',
    name: { ar: 'قالب محمصة وقهوة مختصة (Origin Specialty Coffee)', en: 'Origin Artisanal Roastery' },
    nicheLabel: { ar: 'قهوة مختصة ومحامص', en: 'Specialty Coffee & Roastery' },
    badge: { ar: 'قالب جاهز للاستيراد', en: 'Ready Template' },
    description: {
      ar: 'قالب للمحامص ومحبي القهوة المختصة، يعرض درجات التحميص، درجات التذوق (Cupping Score)، ومعدات الباريستا الاحترافية.',
      en: 'Curated specialty coffee roastery template featuring single-origin beans and cupping scores.'
    },
    previewImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    paletteId: 'terracotta-amber',
    typographyId: 'modern-clean',
    presetData: {
      id: 'electronics',
      nicheLabel: { ar: 'قهوة مختصة ومحامص', en: 'Specialty Roastery' },
      storeName: { ar: 'أُورِيـجـِـن للقهوة', en: 'Origin Coffee Co.' },
      storeLogo: '',
      storeSlogan: { ar: 'محاصيل نادرة، تُحمّص بشغف وتُروى بنقاء.', en: 'Rare single-origin harvests roasted to absolute perfection.' },
      topAnnouncement: {
        ar: 'محصول إثيوبيا قوجي اللاهوائي الجديد وصل للتو! شحن مجاني لكافة طلبات البوكسات الثلاثية. اطلبه الآن',
        en: 'New Crop Alert: Ethiopian Guji Anaerobic just arrived. Free shipping on all Tasting Trios. Order Now'
      },
      heroTitle: { ar: 'مذاق القهوة المختصة في أنقى صورها', en: 'Artisanal Single-Origin Coffee' },
      heroSubtitle: {
        ar: 'حبوب بن مختارة من مزارع البن على ارتفاع 2200 متر، محمصة أسبوعياً لضمان قمة النكهة وعطر التذوق.',
        en: 'Micro-lots from 2,200m elevations, small-batch roasted weekly for peak aromatic vibrancy.'
      },
      heroCtaPrimary: { ar: 'تصفح محاصيل الأسبوع', en: 'Explore Fresh Roasts' },
      heroCtaSecondary: { ar: 'أدوات التحضير', en: 'Brewing Gear' },
      heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      theme: {
        primaryBg: 'bg-[#9A3412]',
        primaryText: 'text-[#9A3412]',
        primaryHover: 'hover:bg-[#7C2D12]',
        accentColor: '#0D9488',
        badgeBg: 'bg-teal-600',
        heroGradient: 'from-amber-50 via-orange-50/20 to-white'
      },
      valueProps: [
        {
          icon: 'Award',
          title: { ar: 'تحميص طازج أسبوعي', en: 'Weekly Fresh Roast' },
          desc: { ar: 'يصلك تاريخ التحميص مطبوعاً على كل كيس.', en: 'Exact roast date stamped on every valve pouch.' }
        },
        {
          icon: 'ShieldCheck',
          title: { ar: 'تقييم كبينج +87', en: 'SCA Cupping Score 87+' },
          desc: { ar: 'محاصيل مصنفة حسب جمعية القهوة المختصة.', en: 'Officially certified Specialty Coffee Association lots.' }
        },
        {
          icon: 'Truck',
          title: { ar: 'توصيل سريع خلال 24-48 ساعة', en: 'Fast Express Delivery' },
          desc: { ar: 'شحن فوري للحفاظ على طزاجة المحصول.', en: 'Rapid dispatch protecting delicate aromatics.' }
        },
        {
          icon: 'CreditCard',
          title: { ar: 'خيارات طحن مخصصة', en: 'Custom Grind Options' },
          desc: { ar: 'حبوب كاملة، أو طحن للإسبريسو والفلتر مجاناً.', en: 'Whole bean or precision ground for your brewer.' }
        }
      ],
      contactInfo: {
        address: { ar: 'حي النخيل، المحمصة الرئيسية، الرياض', en: 'Al-Nakheel, Main Roastery, Riyadh' },
        phone: '+966 11 445 5667',
        email: 'hello@origincoffee.sa',
        whatsapp: '966114455667'
      },
      aboutStory: {
        title: { ar: 'رحلة البحث عن أعظم كرزة بن', en: 'Our Pilgrimage for Extraordinary Beans' },
        body: {
          ar: 'نسافر مباشرة للمزارعين في كولومبيا وإثيوبيا وغواتيمالا لندعم التجارة العادلة ونجلب لك تجارب تذوق استثنائية لم تعهدها من قبل.',
          en: 'Direct-trade partnerships with farmers in Yirgacheffe and Huila ensuring ethical prosperity and unmatched cup profiles.'
        },
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'
      },
      products: [
        {
          id: 'coffee-01',
          name: { ar: 'إثيوبيا قوجي معالجة لاهوائية (Ethiopia Guji Anaerobic)', en: 'Ethiopia Guji Anaerobic Micro-Lot' },
          category: { ar: 'محاصيل الفلتر المقطرة', en: 'Filter Roast' },
          basePriceUSD: 22.0,
          originalPriceUSD: 28.0,
          discountPercentage: 21,
          stock: 18,
          badge: { ar: 'كبينج 89.5', en: 'Score 89.5' },
          rating: 4.95,
          reviewsCount: 165,
          images: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'
          ],
          tabs: {
            description: {
              ar: 'إيحاءات غنية من التوت الأزرق، الياسمين البري، ولمسة من حلاوة العسل الأسود بقوام مخملي حريري.',
              en: 'Bursting with wild blueberry, jasmine florals, and black honey with a velvety lingering finish.'
            },
            usage: {
              ar: 'مثالية لأدوات التقطير اليدوي مثل V60 وكيمكس مع حرارة ماء 92 مئوية.',
              en: 'Best brewed with V60 or Chemex using 92°C filtered water.'
            },
            ingredientsOrSpecs: {
              ar: 'المنطقة: قوجي، الارتفاع: 2150 متر، السلالة: إيرلوم Heirloom، المعالجة: لاهوائية متقدمة 72 ساعة.',
              en: 'Region: Guji, Altitude: 2,150m, Varietal: Heirloom, Process: 72h Anaerobic Fermentation.'
            },
            reviews: {
              ar: 'نكهة التوت واضحة جداً ونظيفة بدون أي مرارة مزعجة، أفضل محصول جربته هذا الشهر!',
              en: 'Incredible clarity of flavor with explosive blueberry notes. Absolutely stellar.'
            }
          }
        }
      ]
    }
  }
];
