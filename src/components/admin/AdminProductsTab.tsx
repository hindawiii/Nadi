import React, { useRef, useState } from 'react';
import {
  Check,
  CheckCircle,
  Image as ImageIcon,
  Plus,
  Search,
  ShoppingBag,
  Sliders,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../data/siteConfig';
import { uploadStoreMedia, MediaFolder } from '../../services/storageService';

export interface AdminConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'danger' | 'warning';
  onConfirm: () => void;
}

interface AdminProductsTabProps {
  onRequestConfirm: (config: AdminConfirmConfig) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({ onRequestConfirm }) => {
  const { lang, dynamicConfig, setDynamicConfig, activePresetId, showToast } = useCommerce();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCatAr, setNewProdCatAr] = useState('');
  const [newProdCatEn, setNewProdCatEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(10);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number | ''>('');
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('جديد');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTargetProductIdForGallery, setActiveTargetProductIdForGallery] = useState<string | null>(null);
  const [urlModalProductId, setUrlModalProductId] = useState<string | null>(null);
  const [urlModalInput, setUrlModalInput] = useState('');

  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products || [];
  const allCategories = Array.from(new Set(products.map((p) => p.category[lang]))).filter(Boolean);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category[lang] === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name[lang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category[lang]?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const uploadAsset = async (file: File, folder: MediaFolder): Promise<string> => {
    const result = await uploadStoreMedia(file, folder, lang, { maxDimension: 1200, quality: 0.82 });
    return result.url;
  };

  const handleStockChange = (productId: string, newStock: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) target.stock = Math.max(0, newStock);
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Local cache write is best-effort
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث كمية المخزون' : 'Inventory updated');
  };

  const handlePriceChange = (productId: string, newUSD: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) target.basePriceUSD = Math.max(0.5, newUSD);
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Local cache write is best-effort
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث السعر الأساسي' : 'Base price updated');
  };

  const handleOriginalPriceChange = (productId: string, newOrigUSD: number | undefined) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        if (newOrigUSD === undefined || isNaN(newOrigUSD) || newOrigUSD <= 0) {
          delete target.originalPriceUSD;
        } else {
          target.originalPriceUSD = newOrigUSD;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Local cache write is best-effort
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث السعر المشطوب ونسبة الخصم' : 'Slashed price & discount updated');
  };

  const handlePrimaryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const uploadedUrl = await uploadAsset(file, 'products');
      setNewProdImage(uploadedUrl);
      showToast(lang === 'ar' ? 'تم ضغط ورفع صورة المنتج بنجاح!' : 'Product image compressed & uploaded successfully!');
    } catch (err: any) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفع ملف الصورة، يرجى المحاولة مرة أخرى' : 'Error uploading image file'));
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTargetProductIdForGallery) return;
    try {
      const uploadedUrl = await uploadAsset(file, 'gallery');
      setDynamicConfig((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        const target = clone.presets[activePresetId].products.find(
          (p: any) => p.id === activeTargetProductIdForGallery
        );
        if (target) {
          if (!target.images) target.images = [];
          target.images.push(uploadedUrl);
        }
        try {
          localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        } catch {
          // Best-effort cache
        }
        return clone;
      });
      showToast(lang === 'ar' ? 'تم ضغط ورفع الصورة لمعرض المنتج!' : 'Image compressed & uploaded to gallery!');
    } catch (err: any) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفع ملف الصورة، يرجى المحاولة مرة أخرى' : 'Error uploading image file'));
    } finally {
      setActiveTargetProductIdForGallery(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSmartAutoFill = () => {
    if (!newProdNameAr.trim() && !newProdNameEn.trim()) {
      showToast(
        lang === 'ar'
          ? 'اكتب اسم المنتج أو كلمتين عنه أولاً لتوليد البيانات الذكية!'
          : 'Enter a product name first to generate smart details!'
      );
      return;
    }

    const inputName = newProdNameAr.trim() || newProdNameEn.trim();
    const lower = inputName.toLowerCase();

    let suggestedCatAr = 'العناية بالبشرة';
    let suggestedCatEn = 'Skincare';
    let suggestedNameEn = 'Botanical Luxury Formulation';
    let suggestedPrice = 24.5;
    let suggestedOriginalPrice = 34.0;
    let suggestedBadge = 'الأكثر طلباً';
    let sampleImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';

    if (lower.includes('سيروم') || lower.includes('serum') || lower.includes('فيتامين') || lower.includes('نضارة')) {
      suggestedCatAr = 'سيرومات النضارة';
      suggestedCatEn = 'Radiance Serums';
      suggestedNameEn = 'Intensive Glow Vitamin Serum';
      suggestedPrice = 28.0;
      suggestedOriginalPrice = 38.0;
      suggestedBadge = 'طبيعي 100%';
      sampleImage = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('كريم') || lower.includes('cream') || lower.includes('ترطيب') || lower.includes('مرطب')) {
      suggestedCatAr = 'كريمات الترطيب الفاخرة';
      suggestedCatEn = 'Hydration Creams';
      suggestedNameEn = '24H Deep Velvet Moisture Cream';
      suggestedPrice = 22.0;
      suggestedOriginalPrice = 30.0;
      suggestedBadge = 'ترطيب عميق';
      sampleImage = 'https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80';
    } else if (
      lower.includes('شعر') ||
      lower.includes('hair') ||
      lower.includes('زيت') ||
      lower.includes('استشوار') ||
      lower.includes('كلارا') ||
      lower.includes('أوكيما')
    ) {
      suggestedCatAr = 'أجهزة وعناية الشعر';
      suggestedCatEn = 'Hair Styling & Care';
      suggestedNameEn = 'Salon Pro Thermal Styler';
      suggestedPrice = 45.0;
      suggestedOriginalPrice = 65.0;
      suggestedBadge = 'ضمان سنتين';
      sampleImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('غسول') || lower.includes('منظف') || lower.includes('cleanser')) {
      suggestedCatAr = 'غسول ومنظفات البشرة';
      suggestedCatEn = 'Gentle Cleansers';
      suggestedNameEn = 'Purifying Botanical Gel Cleanser';
      suggestedPrice = 16.5;
      suggestedOriginalPrice = 22.0;
      suggestedBadge = 'رغوة ناعمة';
      sampleImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('عطر') || lower.includes('perfume') || lower.includes('مسك') || lower.includes('عود')) {
      suggestedCatAr = 'العطور والروائح الملكية';
      suggestedCatEn = 'Royal Perfumes & Mists';
      suggestedNameEn = 'Royal Amber & Floral Mist';
      suggestedPrice = 39.0;
      suggestedOriginalPrice = 52.0;
      suggestedBadge = 'ثبات عالي';
      sampleImage = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
    }

    if (!newProdCatAr) setNewProdCatAr(suggestedCatAr);
    if (!newProdCatEn) setNewProdCatEn(suggestedCatEn);
    if (!newProdNameEn) setNewProdNameEn(suggestedNameEn);
    if (newProdPrice === 10) setNewProdPrice(suggestedPrice);
    if (newProdOriginalPrice === '' || newProdOriginalPrice === 0) setNewProdOriginalPrice(suggestedOriginalPrice);
    if (newProdBadge === 'جديد' || newProdBadge === 'عرض مميز') setNewProdBadge(suggestedBadge);
    if (!newProdImage) setNewProdImage(sampleImage);

    showToast(
      lang === 'ar'
        ? 'تم ملء بيانات المنتج وتنسيقها واقتراح الصورة والأسعار بذكاء!'
        : 'Smart AI auto-completed product details & imagery!'
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم المنتج بالعربية' : 'Please provide product name');
      return;
    }

    const parsedOrig =
      typeof newProdOriginalPrice === 'number' && !isNaN(newProdOriginalPrice) && newProdOriginalPrice > Number(newProdPrice)
        ? Number(newProdOriginalPrice)
        : undefined;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: {
        ar: newProdNameAr.trim(),
        en: newProdNameEn.trim() || newProdNameAr.trim(),
      },
      category: {
        ar: newProdCatAr.trim() || 'العناية بالبشرة',
        en: newProdCatEn.trim() || 'Skincare',
      },
      basePriceUSD: Number(newProdPrice) || 10,
      originalPriceUSD: parsedOrig,
      stock: Number(newProdStock) || 10,
      badge: {
        ar: newProdBadge || 'جديد',
        en: 'New',
      },
      rating: 5.0,
      reviewsCount: 1,
      images: [
        newProdImage.trim() ||
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      ],
      tabs: {
        description: {
          ar: 'منتج عالي الجودة يقدم أفضل نتائج العناية والجمال لبشرتك بمكونات نقية وفعالة.',
          en: 'Premium formulation engineered for maximum visible radiance and skin nourishment.',
        },
        usage: {
          ar: 'يوضع بلطف على بشرة نظيفة ويدلك حتى الامتصاص التام.',
          en: 'Apply gently to clean skin and massage until fully absorbed.',
        },
        ingredientsOrSpecs: {
          ar: 'خلاصات طبيعية نباتية 100%، فيتامينات مغذية.',
          en: '100% pure botanical extracts and nourishing vitamins.',
        },
        reviews: {
          ar: 'تقييمات ممتازة من عميلات المتجر المعتمدات.',
          en: 'Highly rated by verified customers.',
        },
      },
    };

    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].products = [newProd, ...(clone.presets[activePresetId].products || [])];
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });

    setIsAddingProduct(false);
    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdCatAr('');
    setNewProdCatEn('');
    setNewProdPrice(10);
    setNewProdOriginalPrice('');
    setNewProdStock(15);
    setNewProdImage('');
    setNewProdBadge('جديد');
    showToast(lang === 'ar' ? 'تمت إضافة المنتج الجديد بنجاح!' : 'New product added successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'حذف المنتج من الكتالوج' : 'Delete Product',
      message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟' : 'Are you sure you want to delete this product?',
      confirmLabel: lang === 'ar' ? 'حذف المنتج' : 'Delete Product',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          clone.presets[activePresetId].products = (clone.presets[activePresetId].products || []).filter(
            (p: any) => p.id !== productId
          );
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        showToast(lang === 'ar' ? 'تم حذف المنتج من المتجر' : 'Product removed');
      },
    });
  };

  const handleAddProductImage = (productId: string) => {
    setUrlModalProductId(productId);
    setUrlModalInput('');
  };

  const submitAddProductImageUrl = () => {
    if (!urlModalProductId || !urlModalInput.trim()) return;
    const url = urlModalInput.trim();
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === urlModalProductId);
      if (target) {
        if (!target.images) target.images = [];
        target.images.push(url);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تمت إضافة الصورة بنجاح للمنتج' : 'Product image added successfully');
    setUrlModalProductId(null);
    setUrlModalInput('');
  };

  const handleRemoveProductImage = (productId: string, imgIdx: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target && target.images && target.images.length > 1) {
        target.images.splice(imgIdx, 1);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم حذف الصورة' : 'Image removed');
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={galleryFileInputRef}
        onChange={handleGalleryFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'ar' ? 'إدارة المنتجات، الصور، والمخزون' : 'Products, Gallery & Stock'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar'
                ? 'إضافة منتجات، تعديل الأسعار، ضبط المخزون، ورفع صور متعددة لكل منتج.'
                : 'Add items, tweak prices, adjust stock, and manage product photo galleries.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث بالاسم أو التصنيف...' : 'Search by title or category...'}
                className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAddingProduct(true)}
              className="h-11 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`h-9 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            <span>{lang === 'ar' ? 'كافة المنتجات' : 'All Catalog'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {products.length}
            </span>
          </button>

          {allCategories.map((cat) => {
            const count = products.filter((p) => p.category[lang] === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Product Modal Drawer */}
        {isAddingProduct && (
          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-emerald-500/40 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'إضافة منتج جديد للمتجر' : 'Add New Storefront Product'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar'
                    ? 'يمكنك كتابة اسم المنتج واستخدام التوليد الذكي لملء البيانات، ورفع الصورة مباشرة من هاتفك أو جهازك.'
                    : 'Enter product name, use Smart Auto-Fill for instant details, and upload image directly from your device.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSmartAutoFill}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
                  title={lang === 'ar' ? 'توليد تلقائي للوصف، التصنيف، السعر، واقتراح صورة احترافية' : 'Auto-generate category, price, description and photo'}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تعبئة البيانات تلقائياً' : 'Auto-Fill Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title={lang === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: سيروم فيتامين سي فائق النضارة' : 'e.g. Pure Vitamin C Radiant Serum'}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'اسم المنتج بالإنجليزية:' : 'Product Name (English):'}
                </label>
                <input
                  type="text"
                  value={newProdNameEn}
                  onChange={(e) => setNewProdNameEn(e.target.value)}
                  placeholder="e.g. Ultra Radiant Vitamin C Serum"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'التصنيف (عربي):' : 'Category (Arabic):'}
                </label>
                <input
                  type="text"
                  value={newProdCatAr}
                  onChange={(e) => setNewProdCatAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'سيرومات النضارة / العناية بالبشرة' : 'Skincare'}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'التصنيف (إنجليزي):' : 'Category (English):'}
                </label>
                <input
                  type="text"
                  value={newProdCatEn}
                  onChange={(e) => setNewProdCatEn(e.target.value)}
                  placeholder="Radiance Serums / Skincare"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'السعر الفعلي بالدولار ($ USD) *:' : 'Current Price ($ USD) *:'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'السعر المشطوب قبل الخصم ($ USD):' : 'Original Price (Strikethrough $):'}</span>
                  <span className="text-[10px] text-amber-600 font-normal">
                    {lang === 'ar' ? '(اختياري لإظهار خصم وتوفير)' : '(Optional)'}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder={lang === 'ar' ? 'مثال: 35 (لإظهار خط الشطب ونسبة الخصم)' : 'e.g. 35'}
                  value={newProdOriginalPrice}
                  onChange={(e) => setNewProdOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 placeholder:font-normal"
                />
                {typeof newProdOriginalPrice === 'number' && newProdOriginalPrice > newProdPrice && (
                  <div className="mt-1 text-[10px] font-black text-emerald-700 flex items-center gap-1">
                    <span>
                      {lang === 'ar'
                        ? `سيظهر للعميل بخصم ${Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)}% وتوفير $${(newProdOriginalPrice - newProdPrice).toFixed(1)}`
                        : `Calculated: ${Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)}% OFF (Save $${(newProdOriginalPrice - newProdPrice).toFixed(1)})`}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'كمية المخزون الأولي:' : 'Initial Stock:'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'شارة الخصم أو التميز:' : 'Badge Text:'}
                </label>
                <input
                  type="text"
                  value={newProdBadge}
                  onChange={(e) => setNewProdBadge(e.target.value)}
                  placeholder="جديد / الأكثر طلباً"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dual Image Input: Direct File Upload or Image URL */}
              <div className="md:col-span-2 p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'صورة المنتج الأساسية (رفع مباشر أو رابط):' : 'Primary Product Image (Upload or URL):'}</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'تدعم: JPG, PNG, WEBP حتى 4MB' : 'Supports JPG, PNG, WEBP up to 4MB'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePrimaryFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {isUploadingImage
                        ? lang === 'ar'
                          ? 'جاري الرفع...'
                          : 'Uploading...'
                        : lang === 'ar'
                          ? 'رفع صورة من جهازك / هاتفك'
                          : 'Upload from Device'}
                    </span>
                  </button>

                  <span className="text-xs text-slate-400 font-bold">
                    {lang === 'ar' ? 'أو ضع رابط:' : 'or paste URL:'}
                  </span>

                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or data:image/..."
                    className="flex-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {newProdImage && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                      <img src={newProdImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'تم تجهيز الصورة بنجاح وتعمل في المعاينة الحية' : 'Image ready and active in preview'}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                        {newProdImage.startsWith('data:') ? 'Image uploaded from your local file system' : newProdImage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewProdImage('')}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      {lang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  {lang === 'ar' ? 'حفظ وإضافة المنتج للمتجر فوراً' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List & Media Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'ar' ? 'لا توجد منتجات تطابق هذا البحث' : 'No products found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'ar'
                ? 'جربي البحث باسم آخر أو إزالة التصفية لعرض كافة المنتجات.'
                : 'Try searching with different terms or reset your category filter.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                {lang === 'ar' ? 'عرض كافة المنتجات' : 'View all products'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stock === 0;
              const isLowStock = p.stock > 0 && p.stock <= 3;
              return (
                <div
                  key={p.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {p.category[lang]}
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              {lang === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {lang === 'ar' ? 'متبقي قليل' : 'Low Stock'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              {lang === 'ar' ? 'متوفر' : 'In Stock'}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 truncate mt-1.5" title={p.name[lang]}>
                          {p.name[lang]}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title={lang === 'ar' ? 'حذف المنتج' : 'Delete Product'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Gallery Management */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 block">
                        {lang === 'ar' ? `معرض الصور (${p.images?.length || 0} صور):` : `Gallery (${p.images?.length || 0} photos):`}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(p.images || []).map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative group w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
                          >
                            <img src={imgUrl} alt={`Product ${imgIdx}`} className="w-full h-full object-cover" />
                            {(p.images?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(p.id, imgIdx)}
                                className="absolute inset-0 bg-rose-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                              >
                                {lang === 'ar' ? 'حذف' : 'Del'}
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTargetProductIdForGallery(p.id);
                            galleryFileInputRef.current?.click();
                          }}
                          className="w-14 h-14 rounded-2xl border border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
                          title={lang === 'ar' ? 'رفع صورة من جهازك لهذا المنتج' : 'Upload photo from device'}
                        >
                          <Upload className="w-3.5 h-3.5 mb-0.5" />
                          <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddProductImage(p.id)}
                          className="w-14 h-14 rounded-2xl border border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/60 hover:bg-purple-50 text-purple-700 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
                          title={lang === 'ar' ? 'إضافة صورة للمنتج عبر رابط URL' : 'Add photo via URL'}
                        >
                          <Plus className="w-3.5 h-3.5 mb-0.5" />
                          <span>{lang === 'ar' ? 'رابط' : 'URL'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Stock & Dual Price Controls */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 block">
                            {lang === 'ar' ? 'المخزون المتوفر:' : 'Available Stock:'}
                          </label>
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs h-11">
                            <button
                              type="button"
                              onClick={() => handleStockChange(p.id, p.stock - 1)}
                              className="w-10 h-full text-slate-700 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className={`flex-1 font-mono font-bold text-center ${p.stock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                              {p.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStockChange(p.id, p.stock + 1)}
                              className="w-10 h-full text-slate-700 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            {lang === 'ar' ? 'السعر الحالي ($):' : 'Current Price ($):'}
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            value={p.basePriceUSD}
                            onChange={(e) => handlePriceChange(p.id, parseFloat(e.target.value) || 1)}
                            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <span>{lang === 'ar' ? 'السعر المشطوب قبل الخصم ($):' : 'Slashed Price ($):'}</span>
                          </label>
                          {p.originalPriceUSD && p.originalPriceUSD > p.basePriceUSD && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">
                              {lang === 'ar'
                                ? `خصم ${Math.round(((p.originalPriceUSD - p.basePriceUSD) / p.originalPriceUSD) * 100)}%`
                                : `-${Math.round(((p.originalPriceUSD - p.basePriceUSD) / p.originalPriceUSD) * 100)}% OFF`}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder={lang === 'ar' ? 'مثال: 35 (فارغ = بدون خصم)' : 'e.g. 35'}
                            value={p.originalPriceUSD ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                              handleOriginalPriceChange(p.id, val);
                            }}
                            className="w-full h-10 px-3 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 placeholder:font-normal"
                          />
                          {p.originalPriceUSD && (
                            <button
                              type="button"
                              onClick={() => handleOriginalPriceChange(p.id, undefined)}
                              className="h-10 px-2.5 rounded-xl border border-amber-300 bg-white hover:bg-rose-50 text-amber-800 hover:text-rose-600 text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                              title={lang === 'ar' ? 'إلغاء الخصم والشطب' : 'Clear discount'}
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Clear'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accessible Non-Blocking Modal for Adding Product Image via URL */}
      {urlModalProductId && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setUrlModalProductId(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-purple-200 space-y-4 text-start animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {lang === 'ar' ? 'إضافة صورة للمنتج عبر رابط (URL)' : 'Add Product Image via URL'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'أدخلي رابط الصورة المباشر لإضافتها لمعرض صور المنتج' : 'Enter direct image URL to add to product gallery'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUrlModalProductId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'ar' ? 'رابط الصورة المباشر:' : 'Direct Image URL:'}
              </label>
              <input
                type="url"
                value={urlModalInput}
                onChange={(e) => setUrlModalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitAddProductImageUrl();
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-xs sm:text-sm text-slate-900 outline-none transition-all dir-ltr"
                autoFocus
              />
              <p className="text-[10px] text-slate-400">
                {lang === 'ar' ? 'يدعم روابط Unsplash أو Cloudinary أو أي رابط صورة عام ومباشر.' : 'Supports Unsplash, Cloudinary, or any public image URL.'}
              </p>
            </div>

            {urlModalInput.trim() && (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={urlModalInput.trim()}
                  alt="preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=120&q=80';
                  }}
                />
                <div className="truncate text-xs">
                  <span className="font-bold text-slate-800 block truncate">{lang === 'ar' ? 'معاينة الرابط' : 'URL Preview'}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">{lang === 'ar' ? 'جاهزة للإضافة للمعرض' : 'Ready to add to gallery'}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={submitAddProductImageUrl}
                disabled={!urlModalInput.trim()}
                className="flex-1 h-11 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ وإضافة للمعرض' : 'Add Image'}</span>
              </button>
              <button
                type="button"
                onClick={() => setUrlModalProductId(null)}
                className="px-4 h-11 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
