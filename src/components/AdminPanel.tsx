import React, { useState, useRef } from 'react';
import { 
  Lock, KeyRound, CheckCircle, Package, DollarSign, 
  TrendingUp, AlertTriangle, ArrowLeft, ArrowRight, 
  LogOut, Edit, RefreshCw, Image as ImageIcon, Sparkles, Check,
  Sliders, FileText, ShoppingBag, Plus, Trash2, Layers,
  Phone, Mail, MapPin, Eye, ExternalLink, MessageCircle,
  Upload, Wand2, X, Search, Filter, CheckCircle2, Clock, Truck,
  Tag, ArrowUpRight, ShieldCheck, CheckCheck, Droplets, Star
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product, siteConfig } from '../data/siteConfig';
import { SmartAuthPortal } from './common/SmartAuthPortal';
import { hairStylingDevices } from './HairDevicesSpotlight';

export const AdminPanel: React.FC = () => {
  const { 
    lang, isAdminAuthenticated, loginAdmin, logoutAdmin, 
    orders, updateOrderStatus, dynamicConfig, setDynamicConfig, 
    activePresetId, navigateTo, showToast, convertPrice
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Tabs: 'orders' | 'products' | 'devices' | 'banners' | 'content' | 'branding'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'devices' | 'banners' | 'content' | 'branding'>('orders');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'received' | 'processing' | 'dispatched' | 'delivered'>('all');

  // New product form modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCatAr, setNewProdCatAr] = useState('');
  const [newProdCatEn, setNewProdCatEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(10);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('جديد 🌟');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Hidden file inputs for direct device upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const trioBannerFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrioBannerIdx, setActiveTrioBannerIdx] = useState<number | null>(null);
  const promo1FileInputRef = useRef<HTMLInputElement>(null);
  const promo2FileInputRef = useRef<HTMLInputElement>(null);
  const beforeImgFileInputRef = useRef<HTMLInputElement>(null);
  const afterImgFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTargetProductIdForGallery, setActiveTargetProductIdForGallery] = useState<string | null>(null);

  // If not authenticated, display Smart Full-Screen Auth Portal (Default PIN: 2026)
  if (!isAdminAuthenticated) {
    return (
      <SmartAuthPortal
        portalType="admin"
        pinLength={4}
        defaultPin="2026"
        title={{
          ar: 'بوابة التاجر وإدارة المتجر (/admin)',
          en: 'Merchant Portal & Store Command (/admin)'
        }}
        subtitle={{
          ar: 'إدارة شاملة للمنتجات والمخزون والطلبات والأسعار والعلامة التجارية',
          en: 'Full management of products, inventory, orders, pricing, and brand identity'
        }}
        roleBadge={{
          ar: 'صلاحيات المدير الإداري (Store Admin)',
          en: 'Store Administrator Access'
        }}
        accent="purple"
        onAuthenticate={(pin, rememberLogin, rememberPin) => loginAdmin(pin, rememberLogin, rememberPin)}
        onReturnToStore={() => navigateTo('store')}
        savedAuthKey="luxe_admin_auth_saved"
        savedPinKey="luxe_admin_saved_pin"
      />
    );
  }

  // Active preset in current view
  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products || [];

  // Update helper for active preset fields
  const updateField = (path: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = clone.presets[activePresetId];
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
  };

  // Stock and Price controls
  const handleStockChange = (productId: string, newStock: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.stock = Math.max(0, newStock);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث كمية المخزون' : 'Inventory updated');
  };

  const handlePriceChange = (productId: string, newUSD: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.basePriceUSD = Math.max(0.5, newUSD);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث السعر الأساسي' : 'Base price updated');
  };

  // Image File Reader helper to convert uploaded File to Data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size (limit to 4MB for high resolution and fast browser persistence)
      if (file.size > 4 * 1024 * 1024) {
        reject(new Error(lang === 'ar' ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت' : 'Image is too large. Please select a file under 4MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Handle direct file upload for new product primary image
  const handlePrimaryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const dataUrl = await readFileAsDataURL(file);
      setNewProdImage(dataUrl);
      showToast(lang === 'ar' ? 'تم رفع ومعاينة صورة المنتج بنجاح!' : 'Product image uploaded successfully!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      setIsUploadingImage(false);
      // Reset input value so same file can be re-selected if desired
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for gallery of an existing product
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTargetProductIdForGallery) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      setDynamicConfig(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        const target = clone.presets[activePresetId].products.find((p: any) => p.id === activeTargetProductIdForGallery);
        if (target) {
          if (!target.images) target.images = [];
          target.images.push(dataUrl);
        }
        try {
          localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
        } catch (err) {}
        return clone;
      });
      showToast(lang === 'ar' ? 'تم رفع الصورة وإضافتها لمعرض المنتج!' : 'Image uploaded to product gallery!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      setActiveTargetProductIdForGallery(null);
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for Logo
  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('storeLogo', dataUrl);
      showToast(lang === 'ar' ? 'تم رفع وتطبيق شعار المتجر بنجاح!' : 'Store logo uploaded successfully!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for Hero Main Image
  const handleHeroFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('heroImage', dataUrl);
      showToast(lang === 'ar' ? 'تم رفع وتطبيق صورة الهيرو الرئيسية بنجاح!' : 'Hero image uploaded successfully!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Helper for Trio Banners update
  const updateTrioBanner = (index: number, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].trioBanners) {
        clone.presets[activePresetId].trioBanners = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.trioBanners || []));
      }
      const banner = clone.presets[activePresetId].trioBanners[index];
      if (banner) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!banner[f]) banner[f] = {};
          banner[f][sub] = value;
        } else {
          banner[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (err) {}
      return clone;
    });
  };

  // Handle direct file upload for Trio Banners
  const handleTrioBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeTrioBannerIdx === null) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateTrioBanner(activeTrioBannerIdx, 'image', dataUrl);
      showToast(lang === 'ar' ? 'تم تحديث صورة كرت التشكيلة بنجاح!' : 'Brand banner image updated!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      setActiveTrioBannerIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for Promo Image 1
  const handlePromo1FileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('promoBanner.image1', dataUrl);
      showToast(lang === 'ar' ? 'تم تحديث صورة البوكس الأولى!' : 'Promo image 1 updated!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for Promo Image 2
  const handlePromo2FileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('promoBanner.image2', dataUrl);
      showToast(lang === 'ar' ? 'تم تحديث صورة البوكس الثانية!' : 'Promo image 2 updated!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for Before Image
  const handleBeforeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('beforeAfterMedia.beforeImage', dataUrl);
      showToast(lang === 'ar' ? 'تم تحديث صورة (قبل) بنجاح!' : 'Before image updated!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Handle direct file upload for After Image
  const handleAfterFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField('beforeAfterMedia.afterImage', dataUrl);
      showToast(lang === 'ar' ? 'تم تحديث صورة (بعد) بنجاح!' : 'After image updated!');
    } catch (err: any) {
      showToast(lang === 'ar' ? 'تعذر قراءة ملف الصورة، يرجى المحاولة مرة أخرى' : (err.message || 'Error reading image file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Helper for Skin Diagnosis cards update
  const updateSkinDiagnosisCard = (cardId: string, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].skinDiagnosisCards) {
        clone.presets[activePresetId].skinDiagnosisCards = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.skinDiagnosisCards || []));
      }
      const card = clone.presets[activePresetId].skinDiagnosisCards.find((c: any) => c.id === cardId);
      if (card) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!card[f]) card[f] = {};
          card[f][sub] = value;
        } else {
          card[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (err) {}
      return clone;
    });
  };

  // Helper for Testimonials update
  const updateTestimonialItem = (testId: number, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].testimonials) {
        clone.presets[activePresetId].testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      const item = clone.presets[activePresetId].testimonials.find((t: any) => t.id === testId);
      if (item) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!item[f]) item[f] = {};
          item[f][sub] = value;
        } else {
          item[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (err) {}
      return clone;
    });
  };

  // Smart Product Auto-Complete AI Generator
  const handleSmartAutoFill = () => {
    if (!newProdNameAr.trim() && !newProdNameEn.trim()) {
      showToast(lang === 'ar' ? 'اكتب اسم المنتج أو كلمتين عنه أولاً لتوليد البيانات الذكية!' : 'Enter a product name first to generate smart details!');
      return;
    }

    const inputName = newProdNameAr.trim() || newProdNameEn.trim();
    const lower = inputName.toLowerCase();

    let suggestedCatAr = 'العناية بالبشرة';
    let suggestedCatEn = 'Skincare';
    let suggestedNameEn = 'Botanical Luxury Formulation';
    let suggestedPrice = 24.5;
    let suggestedBadge = 'الأكثر طلباً 🔥';
    let sampleImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';

    if (lower.includes('سيروم') || lower.includes('serum') || lower.includes('فيتامين') || lower.includes('نضارة')) {
      suggestedCatAr = 'سيرومات النضارة';
      suggestedCatEn = 'Radiance Serums';
      suggestedNameEn = 'Intensive Glow Vitamin Serum';
      suggestedPrice = 28.0;
      suggestedBadge = 'طبيعي 100% 🌿';
      sampleImage = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('كريم') || lower.includes('cream') || lower.includes('ترطيب') || lower.includes('مرطب')) {
      suggestedCatAr = 'كريمات الترطيب الفاخرة';
      suggestedCatEn = 'Hydration Creams';
      suggestedNameEn = '24H Deep Velvet Moisture Cream';
      suggestedPrice = 22.0;
      suggestedBadge = 'ترطيب عميق 💧';
      sampleImage = 'https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('شعر') || lower.includes('hair') || lower.includes('زيت') || lower.includes('استشوار') || lower.includes('كلارا') || lower.includes('أوكيما')) {
      suggestedCatAr = 'أجهزة وعناية الشعر';
      suggestedCatEn = 'Hair Styling & Care';
      suggestedNameEn = 'Salon Pro Thermal Styler';
      suggestedPrice = 45.0;
      suggestedBadge = 'ضمان سنتين ⚡';
      sampleImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('غسول') || lower.includes('منظف') || lower.includes('cleanser')) {
      suggestedCatAr = 'غسول ومنظفات البشرة';
      suggestedCatEn = 'Gentle Cleansers';
      suggestedNameEn = 'Purifying Botanical Gel Cleanser';
      suggestedPrice = 16.5;
      suggestedBadge = 'رغوة ناعمة ✨';
      sampleImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
    } else if (lower.includes('عطر') || lower.includes('perfume') || lower.includes('مسك') || lower.includes('عود')) {
      suggestedCatAr = 'العطور والروائح الملكية';
      suggestedCatEn = 'Royal Perfumes & Mists';
      suggestedNameEn = 'Royal Amber & Floral Mist';
      suggestedPrice = 39.0;
      suggestedBadge = 'ثبات عالي 🌸';
      sampleImage = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
    }

    if (!newProdCatAr) setNewProdCatAr(suggestedCatAr);
    if (!newProdCatEn) setNewProdCatEn(suggestedCatEn);
    if (!newProdNameEn) setNewProdNameEn(suggestedNameEn);
    if (newProdPrice === 10) setNewProdPrice(suggestedPrice);
    if (newProdBadge === 'جديد 🌟') setNewProdBadge(suggestedBadge);
    if (!newProdImage) setNewProdImage(sampleImage);

    showToast(lang === 'ar' ? '✨ تم ملء بيانات المنتج وتنسيقها واقتراح الصورة والأسعار بذكاء!' : '✨ Smart AI auto-completed product details & imagery!');
  };

  // Add Product to Store
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم المنتج بالعربية' : 'Please provide product name');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: {
        ar: newProdNameAr.trim(),
        en: newProdNameEn.trim() || newProdNameAr.trim()
      },
      category: {
        ar: newProdCatAr.trim() || 'العناية بالبشرة',
        en: newProdCatEn.trim() || 'Skincare'
      },
      basePriceUSD: Number(newProdPrice) || 10,
      stock: Number(newProdStock) || 10,
      badge: {
        ar: newProdBadge || 'جديد 🌟',
        en: 'New 🌟'
      },
      rating: 5.0,
      reviewsCount: 1,
      images: [
        newProdImage.trim() || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
      ],
      tabs: {
        description: {
          ar: `منتج عالي الجودة يقدم أفضل نتائج العناية والجمال لبشرتك بمكونات نقية وفعالة.`,
          en: `Premium formulation engineered for maximum visible radiance and skin nourishment.`
        },
        usage: {
          ar: 'يوضع بلطف على بشرة نظيفة ويدلك حتى الامتصاص التام.',
          en: 'Apply gently to clean skin and massage until fully absorbed.'
        },
        ingredientsOrSpecs: {
          ar: 'خلاصات طبيعية نباتية 100%، فيتامينات مغذية.',
          en: '100% pure botanical extracts and nourishing vitamins.'
        },
        reviews: {
          ar: 'تقييمات ممتازة من عميلات المتجر المعتمدات.',
          en: 'Highly rated by verified customers.'
        }
      }
    };

    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].products = [newProd, ...(clone.presets[activePresetId].products || [])];
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });

    setIsAddingProduct(false);
    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdImage('');
    showToast(lang === 'ar' ? 'تمت إضافة المنتج الجديد بنجاح!' : 'New product added successfully!');
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      setDynamicConfig(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone.presets[activePresetId].products = (clone.presets[activePresetId].products || []).filter((p: any) => p.id !== productId);
        try {
          localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
        } catch (e) {}
        return clone;
      });
      showToast(lang === 'ar' ? 'تم حذف المنتج من المتجر' : 'Product removed');
    }
  };

  // Add/Remove Image for a Product
  const handleAddProductImage = (productId: string) => {
    const url = prompt(lang === 'ar' ? 'أدخل رابط الصورة الإضافية للمنتج (URL):' : 'Enter additional product image URL:');
    if (!url || !url.trim()) return;

    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        if (!target.images) target.images = [];
        target.images.push(url.trim());
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تمت إضافة الصورة بنجاح' : 'Image added');
  };

  const handleRemoveProductImage = (productId: string, imgIdx: number) => {
    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target && target.images && target.images.length > 1) {
        target.images.splice(imgIdx, 1);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم حذف الصورة' : 'Image removed');
  };

  // Computed KPIs & Helpers
  const totalRevenueUSD = orders.reduce((sum, o) => {
    if (typeof o.totalUSD === 'number' && !isNaN(o.totalUSD)) {
      return sum + o.totalUSD;
    }
    // Fallback: estimate from totalFormatted if legacy order
    const num = parseFloat(o.totalFormatted?.replace(/[^0-9.]/g, '') || '0') || 0;
    const rate = siteConfig.currencies[o.currency]?.rate || 1;
    return sum + (num / rate);
  }, 0);
  const totalRevenueDisplay = convertPrice(totalRevenueUSD).text;
  const lowStockProducts = products.filter(p => p.stock <= 3);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Categories list for filtering
  const allCategories = Array.from(new Set(products.map(p => p.category[lang]))).filter(Boolean);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category[lang] === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.name[lang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category[lang]?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearchQuery.trim() ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // WhatsApp quick contact generator
  const getCustomerWhatsAppUrl = (phone: string, customerName: string, orderId: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const storeNameText = activePreset.storeName[lang];
    const msg = lang === 'ar' 
      ? `مرحباً ${customerName}، نتواصل معكِ من متجر ${storeNameText} بخصوص طلبك رقم (${orderId}). يرجى تأكيد استلام تفاصيل الشحن. شكراً لثقتكِ بنا!`
      : `Hello ${customerName}, this is ${storeNameText} regarding your order (${orderId}). Please confirm your delivery details. Thank you for shopping with us!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Trio banners list with safe fallback
  const trioBannersList = (activePreset.trioBanners && activePreset.trioBanners.length > 0)
    ? activePreset.trioBanners
    : (siteConfig.presets.cosmetics.trioBanners || []);

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-10 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Top Header & Navigation Command Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم المتجر وإدارة العمليات' : 'Store Merchant Operations'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                {activePreset.nicheLabel?.[lang] || activePresetId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activePreset.storeName[lang]}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {lang === 'ar' 
                ? 'إدارة فورية شاملة للمنتجات، المخزون، الطلبات، البنرات التسويقية، وهوية المتجر مع حفظ تلقائي وحماية استقرار البيانات.' 
                : 'Full-spectrum control of products, inventory, orders, marketing visuals, and brand assets.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('store')}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>{lang === 'ar' ? 'معاينة المتجر' : 'View Storefront'}</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{lang === 'ar' ? 'قفل الخروج' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {totalRevenueDisplay}
            </p>
            <span className="text-[11px] text-emerald-600 font-bold block">
              {lang === 'ar' ? `محسوبة من ${orders.length} طلب` : `From ${orders.length} orders`}
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 cursor-pointer hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'الطلبات الواردة' : 'Incoming Orders'}</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{orders.length}</p>
            <span className="text-[11px] text-purple-600 font-bold block">
              {lang === 'ar' ? 'عرض السجل وإدارته ←' : 'View order log ←'}
            </span>
          </div>

          <div 
            onClick={() => {
              setActiveTab('products');
              setSearchQuery('');
            }}
            className={`bg-white p-5 rounded-3xl border shadow-xs space-y-2 cursor-pointer transition-colors ${
              lowStockProducts.length > 0 ? 'border-amber-300 hover:border-amber-400' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'مخزون منخفض' : 'Low Stock Alert'}</span>
              <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{lowStockProducts.length}</p>
            <span className={`text-[11px] font-bold block ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
              {lowStockProducts.length > 0 ? (lang === 'ar' ? 'منتجات تحتاج تزويد' : 'Needs restock') : (lang === 'ar' ? 'المخزون ممتاز' : 'Healthy inventory')}
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('products')}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'منتجات المتجر' : 'Active Catalog'}</span>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
            <span className="text-[11px] text-slate-500 font-bold block">
              {lang === 'ar' ? 'منتج مفعل بالواجهة' : 'Visible in storefront'}
            </span>
          </div>
        </div>

        {/* Tab Switcher - Luxe Pro Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-300/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600" />
            <span>{lang === 'ar' ? 'الطلبات' : 'Orders'}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'المنتجات والمخزون' : 'Products & Stock'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'devices' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{lang === 'ar' ? 'ماركات وتشكيلات الأجهزة' : 'Brand Collections'}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
              {trioBannersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'banners' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-rose-500" />
            <span>{lang === 'ar' ? 'العروض وقبل/بعد' : 'Promos & Visuals'}</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'content' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ar' ? 'الأشرطة المتحركة' : 'Tickers & Texts'}</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'branding' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>{lang === 'ar' ? 'الهوية والشعار' : 'Branding & Info'}</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & INCOMING SALES                           */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header & Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span>{lang === 'ar' ? 'سجل الطلبات وإدارة الشحن' : 'Customer Orders & Fulfillment'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'ar' 
                      ? 'متابعة الطلبات، تحديث حالة التسليم، والتواصل الفوري مع العميلات عبر الواتساب بنقرة واحدة.' 
                      : 'Track orders, update fulfillment status, and reach out to customers directly via WhatsApp.'}
                  </p>
                </div>

                {/* Search in Orders */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث برقم الطلب، الاسم، أو الهاتف...' : 'Search ID, name, or phone...'}
                    className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  {orderSearchQuery && (
                    <button 
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                {[
                  { id: 'all', label: { ar: 'كافة الطلبات', en: 'All Orders' }, count: orders.length },
                  { id: 'received', label: { ar: 'جديد (مستلم)', en: 'Received' }, count: orders.filter(o => o.status === 'received').length },
                  { id: 'processing', label: { ar: 'قيد التجهيز', en: 'Processing' }, count: orders.filter(o => o.status === 'processing').length },
                  { id: 'dispatched', label: { ar: 'مع المندوب', en: 'Dispatched' }, count: orders.filter(o => o.status === 'dispatched').length },
                  { id: 'delivered', label: { ar: 'تم التوصيل', en: 'Delivered' }, count: orders.filter(o => o.status === 'delivered').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id as any)}
                    className={`h-9 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      orderStatusFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{tab.label[lang]}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      orderStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {lang === 'ar' ? 'لا توجد طلبات تطابق هذا البحث' : 'No orders found'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {lang === 'ar' 
                      ? 'يمكنك تجربة تغيير خيارات التصفية أو إدخال عبارة بحث أخرى.' 
                      : 'Try adjusting your status filter or clearing search keywords.'}
                  </p>
                  {(orderSearchQuery || orderStatusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setOrderSearchQuery('');
                        setOrderStatusFilter('all');
                      }}
                      className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
                    >
                      {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filters'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((o) => (
                    <div 
                      key={o.id} 
                      className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                            #{o.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{o.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {o.date}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="font-mono font-medium" dir="ltr">{o.phone}</span>
                          <span className="text-slate-300">•</span>
                          <span>{lang === 'ar' ? `${o.items?.length || 1} منتجات` : `${o.items?.length || 1} items`}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-black text-slate-900 text-sm">{o.totalFormatted}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* WhatsApp Direct Action Button */}
                        <a
                          href={getCustomerWhatsAppUrl(o.phone, o.customerName, o.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title={lang === 'ar' ? 'مراسلة العميلة عبر واتساب' : 'Chat via WhatsApp'}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                        </a>

                        {/* Status Selector */}
                        <select
                          value={o.status}
                          onChange={(e) => {
                            updateOrderStatus(o.id, e.target.value as any);
                            showToast(lang === 'ar' ? `تم تحديث حالة الطلب #${o.id}` : `Order #${o.id} status updated`);
                          }}
                          className={`h-10 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            o.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : o.status === 'dispatched'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : o.status === 'processing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-purple-50 text-purple-800 border-purple-300'
                          }`}
                        >
                          <option value="received">{lang === 'ar' ? 'جديد (مستلم)' : 'Received'}</option>
                          <option value="processing">{lang === 'ar' ? 'جاري التجهيز' : 'Processing'}</option>
                          <option value="dispatched">{lang === 'ar' ? 'مع المندوب' : 'Dispatched'}</option>
                          <option value="delivered">{lang === 'ar' ? 'تم التوصيل ✅' : 'Delivered ✅'}</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TEXTS, TICKERS & PROMO BANNER                     */}
        {/* ======================================================== */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'تعديل نصوص المتجر والشريطين المتحركين' : 'Store Texts & Animated Tickers'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar' 
                  ? 'يمكنك هنا تغيير نصوص الشريط العلوي المتحرك، نصوص الشريط اللانهائي للبراند، ونصوص واجهة الهيرو والبنرات الترويجية.' 
                  : 'Customize top announcement ticker slides, brand infinite marquee, hero texts, and campaign banner.'}
              </p>
            </div>

            {/* 1. TOP ANNOUNCEMENT SLIDES */}
            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5A3E7A]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {lang === 'ar' ? '1. شرائح الشريط الإعلاني العلوي المتحرك' : '1. Top Announcement Ticker Slides'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentSlides = activePreset.announcementSlides || [];
                    const newSlides = [...currentSlides, { ar: 'نص إعلاني جديد هنا ✨', en: 'New announcement text here ✨' }];
                    updateField('announcementSlides', newSlides);
                    showToast(lang === 'ar' ? 'تمت إضافة شريحة إعلانية جديدة' : 'Slide added');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#5A3E7A] text-white text-xs font-bold hover:bg-[#483162] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {(activePreset.announcementSlides || [
                  { ar: "تسوقي بذكاء: احفظي في المفضلة ❤️ • قارني المواصفات ⚖️ • اطلبي فـوراً عبر السلة أو واتساب 💬", en: "Smart Shopping: Save to Wishlist ❤️ • Compare Specs ⚖️ • Order via Cart or WhatsApp 💬" }
                ]).map((slide, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900">
                        {lang === 'ar' ? `الشريحة الإعلانية (${idx + 1}):` : `Slide (${idx + 1}):`}
                      </span>
                      {(activePreset.announcementSlides || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides.splice(idx, 1);
                            updateField('announcementSlides', currentSlides);
                            showToast(lang === 'ar' ? 'تم حذف الشريحة' : 'Slide removed');
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص بالعربية:' : 'Arabic Text:'}
                        </label>
                        <input
                          type="text"
                          value={slide.ar}
                          onChange={(e) => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides[idx] = { ...currentSlides[idx], ar: e.target.value };
                            updateField('announcementSlides', currentSlides);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5A3E7A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص بالإنجليزية:' : 'English Text:'}
                        </label>
                        <input
                          type="text"
                          value={slide.en}
                          onChange={(e) => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides[idx] = { ...currentSlides[idx], en: e.target.value };
                            updateField('announcementSlides', currentSlides);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5A3E7A]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. INFINITE BRAND TICKER (BOTTOM TICKER) */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {lang === 'ar' ? '2. نصوص الشريط السفلي اللانهائي (Brand Ticker)' : '2. Infinite Brand Marquee Ticker'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentItems = activePreset.brandTickerItems || [];
                    const newItems = [
                      ...currentItems,
                      {
                        brandAr: activePreset.storeName.ar,
                        brandEn: activePreset.storeName.en,
                        sloganAr: 'عناية فائقة ونقاء 100%',
                        sloganEn: 'Pure Botanical Care',
                        tagAr: 'نتائج مثبتة',
                        tagEn: 'Visible Results'
                      }
                    ];
                    updateField('brandTickerItems', newItems);
                    showToast(lang === 'ar' ? 'تمت إضافة جملة للشريط اللانهائي' : 'Ticker item added');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة نص' : 'Add Item'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {(activePreset.brandTickerItems || [
                  {
                    brandAr: "نَـــــدِي",
                    brandEn: "NADI",
                    sloganAr: "إشراقة طبيعية، تليق بك.",
                    sloganEn: "Natural radiance, made for you.",
                    tagAr: "جمال ونقاء نباتي",
                    tagEn: "Pure Botanical Radiance"
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">
                        {lang === 'ar' ? `الجملة (${idx + 1}):` : `Item (${idx + 1}):`}
                      </span>
                      {(activePreset.brandTickerItems || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentItems = [...(activePreset.brandTickerItems || [])];
                            currentItems.splice(idx, 1);
                            updateField('brandTickerItems', currentItems);
                            showToast(lang === 'ar' ? 'تم حذف العنصر' : 'Item removed');
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'اسم المتجر في الشريط:' : 'Store Name:'}
                        </label>
                        <input
                          type="text"
                          value={item.brandAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], brandAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص / العبارة (عربي):' : 'Slogan (Arabic):'}
                        </label>
                        <input
                          type="text"
                          value={item.sloganAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], sloganAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'الشارة المميزة (Badge):' : 'Badge Tag:'}
                        </label>
                        <input
                          type="text"
                          value={item.tagAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], tagAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HERO SECTION TEXTS & IMAGERY */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {lang === 'ar' ? '3. واجهة الهيرو الرئيسية (Hero Section)' : '3. Main Hero Section'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'العنوان الرئيسي (Hero Title بالعربية):' : 'Hero Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.heroTitle?.ar || ''}
                    onChange={(e) => updateField('heroTitle.ar', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'العنوان الرئيسي (Hero Title بالإنجليزية):' : 'Hero Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.heroTitle?.en || ''}
                    onChange={(e) => updateField('heroTitle.en', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'الوصف الترحيبي (Subtitle بالعربية):' : 'Hero Subtitle (Arabic):'}
                  </label>
                  <textarea
                    rows={2}
                    value={activePreset.heroSubtitle?.ar || ''}
                    onChange={(e) => updateField('heroSubtitle.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {lang === 'ar' ? 'صورة واجهة الهيرو الكبيرة (رفع مباشر أو رابط):' : 'Hero Main Image (Upload or URL):'}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'ar' ? 'JPG, PNG, WEBP حتى 4MB' : 'JPG, PNG, WEBP up to 4MB'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload File'}</span>
                    </button>

                    <input
                      type="url"
                      value={activePreset.heroImage || ''}
                      onChange={(e) => updateField('heroImage', e.target.value)}
                      placeholder="https://... or data:image/..."
                      className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    />

                    {activePreset.heroImage && (
                      <img src={activePreset.heroImage} alt="Hero Preview" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRODUCTS & FULL IMAGE MANAGEMENT                  */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>{lang === 'ar' ? 'إدارة المنتجات، الصور، والمخزون' : 'Products, Gallery & Stock'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'ar' ? 'إضافة منتجات، تعديل الأسعار، ضبط المخزون، ورفع صور متعددة لكل منتج.' : 'Add items, tweak prices, adjust stock, and manage product photo galleries.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Product Search */}
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
                  onClick={() => setSelectedCategory('all')}
                  className={`h-9 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <span>{lang === 'ar' ? 'كافة المنتجات' : 'All Catalog'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {products.length}
                  </span>
                </button>

                {allCategories.map((cat) => {
                  const count = products.filter(p => p.category[lang] === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`h-9 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
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
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'توليد البيانات بذكاء (AI Auto-Fill)' : 'Smart Auto-Fill'}</span>
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
                        {lang === 'ar' ? 'السعر الأساسي بالدولار ($ USD):' : 'Base Price ($ USD):'}
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
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {lang === 'ar' ? 'كمية المخزون الأولي:' : 'Initial Stock:'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
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
                        placeholder="جديد 🌟 / الأكثر طلباً 🔥"
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
                        {/* Direct Upload Button */}
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePrimaryFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'رفع صورة من جهازك / هاتفك' : 'Upload from Device'}</span>
                        </button>

                        <span className="text-xs text-slate-400 font-bold">{lang === 'ar' ? 'أو ضع رابط:' : 'or paste URL:'}</span>

                        {/* URL Input */}
                        <input
                          type="url"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          placeholder="https://images.unsplash.com/... or data:image/..."
                          className="flex-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Live Image Preview */}
                      {newProdImage && (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            <img src={newProdImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1 text-emerald-600">
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
                        {lang === 'ar' ? 'حفظ وإضافة المنتج للمتجر فوراً ✨' : 'Publish Product to Store ✨'}
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
                          {/* Product Header */}
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
                                    {lang === 'ar' ? 'متبقي قليل ⚠️' : 'Low Stock ⚠️'}
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
                                <div key={imgIdx} className="relative group w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
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
                              {/* Direct Gallery Upload Trigger */}
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

                              {/* URL Gallery Add Trigger */}
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

                          {/* Stock & Price Controls with 44px touch targets */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 block">
                                {lang === 'ar' ? 'المخزون المتوفر:' : 'Available Stock:'}
                              </label>
                              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs h-11">
                                <button
                                  onClick={() => handleStockChange(p.id, p.stock - 1)}
                                  className="w-10 h-full text-slate-700 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  -
                                </button>
                                <span className={`flex-1 font-mono font-bold text-center ${p.stock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => handleStockChange(p.id, p.stock + 1)}
                                  className="w-10 h-full text-slate-700 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-500 block">
                                {lang === 'ar' ? 'السعر ($ USD):' : 'Price ($ USD):'}
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.5"
                                  value={p.basePriceUSD}
                                  onChange={(e) => handlePriceChange(p.id, parseFloat(e.target.value) || 1)}
                                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BRAND COLLECTIONS & SPOTLIGHT (DEVICES)           */}
        {/* ======================================================== */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{lang === 'ar' ? 'تشكيلات وماركات أجهزة الشعر (Trio Banners)' : 'Brand Collections & Device Trio'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ar' 
                    ? 'تخصيص بطاقات الماركات الثلاث في أعلى قسم أجهزة الشعر، الصور، العناوين، والتصنيف المستهدف.' 
                    : 'Customize the 3 brand spotlight cards at the top of hair styling devices section.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trioBannersList.map((banner, bIdx) => (
                  <div key={banner.id || bIdx} className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                    {/* Live Card Preview */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${banner.bgGradient || 'from-purple-100 to-pink-100'} border border-slate-200/60 relative overflow-hidden min-h-[140px] flex flex-col justify-between`}>
                      <div className="flex items-center justify-between z-10">
                        <span className="font-serif font-black tracking-widest text-slate-900 text-sm uppercase">
                          {banner.brand}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-slate-800 border border-black/10">
                          {lang === 'ar' ? 'معاينة حية' : 'Live Card'}
                        </span>
                      </div>

                      <div className="z-10 max-w-[65%] space-y-0.5 pt-4 text-start">
                        <h4 className="font-black text-xs sm:text-sm text-slate-950 leading-snug truncate">
                          {banner.title?.[lang] || banner.brand}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-700 truncate">
                          {banner.subtitle?.[lang] || ''}
                        </p>
                      </div>

                      {banner.image && (
                        <div className="absolute inset-y-0 end-0 w-1/2 overflow-hidden opacity-90">
                          <img src={banner.image} alt={banner.brand} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          {lang === 'ar' ? 'اسم الماركة (Brand Name):' : 'Brand Name:'}
                        </label>
                        <input
                          type="text"
                          value={banner.brand}
                          onChange={(e) => updateTrioBanner(bIdx, 'brand', e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {lang === 'ar' ? 'العنوان (عربي):' : 'Title (AR):'}
                          </label>
                          <input
                            type="text"
                            value={banner.title?.ar || ''}
                            onChange={(e) => updateTrioBanner(bIdx, 'title.ar', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {lang === 'ar' ? 'العنوان (EN):' : 'Title (EN):'}
                          </label>
                          <input
                            type="text"
                            value={banner.title?.en || ''}
                            onChange={(e) => updateTrioBanner(bIdx, 'title.en', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {lang === 'ar' ? 'الوصف (عربي):' : 'Subtitle (AR):'}
                          </label>
                          <input
                            type="text"
                            value={banner.subtitle?.ar || ''}
                            onChange={(e) => updateTrioBanner(bIdx, 'subtitle.ar', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            {lang === 'ar' ? 'الوصف (EN):' : 'Subtitle (EN):'}
                          </label>
                          <input
                            type="text"
                            value={banner.subtitle?.en || ''}
                            onChange={(e) => updateTrioBanner(bIdx, 'subtitle.en', e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          {lang === 'ar' ? 'التصنيف المستهدف بالنقر:' : 'Target Tab Filter:'}
                        </label>
                        <select
                          value={banner.targetTab || 'all'}
                          onChange={(e) => updateTrioBanner(bIdx, 'targetTab', e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                        >
                          <option value="all">{lang === 'ar' ? 'كافة الأجهزة (All)' : 'All Devices'}</option>
                          <option value="waving">{lang === 'ar' ? 'أجهزة التمويج (Waving)' : 'Waving Tech'}</option>
                          <option value="straightener">{lang === 'ar' ? 'مكاوي التمليس (Straighteners)' : 'Straighteners'}</option>
                          <option value="dryer">{lang === 'ar' ? 'الاستشوار والمجففات (Dryers)' : 'Dryers'}</option>
                        </select>
                      </div>

                      {/* Image Upload for Banner */}
                      <div className="pt-2 border-t border-slate-200/80 space-y-2">
                        <label className="text-[11px] font-bold text-slate-600 block">
                          {lang === 'ar' ? 'صورة جهاز الماركة:' : 'Brand Device Photo:'}
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTrioBannerIdx(bIdx);
                              trioBannerFileInputRef.current?.click();
                            }}
                            className="h-10 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'رفع ملف' : 'Upload'}</span>
                          </button>
                          <input
                            type="url"
                            value={banner.image || ''}
                            onChange={(e) => updateTrioBanner(bIdx, 'image', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PROMOTIONS & VISUALS                              */}
        {/* ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-500" />
                  <span>{lang === 'ar' ? 'البنرات الترويجية والوسائط البصرية' : 'Campaign Banners & Visual Proof'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ar' 
                    ? 'تعديل صورة الهيرو الرئيسية، بنرات الحملات الترويجية المزدوجة، وصور مقارنة قبل وبعد.' 
                    : 'Manage hero banner image, dual promo campaign boxes, and before/after proof media.'}
                </p>
              </div>

              {/* 1. Hero Main Image */}
              <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4">
                <h3 className="text-sm font-black text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? '1. صورة واجهة الهيرو الكبيرة' : '1. Hero Main Visual Banner'}</span>
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="w-full sm:w-auto h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload from Device'}</span>
                  </button>
                  <input
                    type="url"
                    value={activePreset.heroImage || ''}
                    onChange={(e) => updateField('heroImage', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  {activePreset.heroImage && (
                    <img src={activePreset.heroImage} alt="Hero" className="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                  )}
                </div>
              </div>

              {/* 2. Dual Promotional Banner */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-black text-slate-900">
                  {lang === 'ar' ? '2. بنر الحملات الترويجية المزدوج (Dual Campaign)' : '2. Dual Campaign Banner'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-purple-800 block">{lang === 'ar' ? 'الصورة الأولى (بوكس 1)' : 'Promo Box 1'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => promo1FileInputRef.current?.click()}
                        className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                      </button>
                      <input
                        type="url"
                        value={activePreset.promoBanner?.image1 || ''}
                        onChange={(e) => updateField('promoBanner.image1', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-rose-800 block">{lang === 'ar' ? 'الصورة الثانية (بوكس 2)' : 'Promo Box 2'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => promo2FileInputRef.current?.click()}
                        className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                      </button>
                      <input
                        type="url"
                        value={activePreset.promoBanner?.image2 || ''}
                        onChange={(e) => updateField('promoBanner.image2', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Before & After Media Proof */}
              <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-200/60 space-y-4">
                <h3 className="text-sm font-black text-amber-950">
                  {lang === 'ar' ? '3. صور تجربة ونتائج (قبل وبعد - Before & After)' : '3. Before & After Proof Showcase'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">{lang === 'ar' ? 'صورة (قبل):' : 'Before Photo:'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => beforeImgFileInputRef.current?.click()}
                        className="h-10 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                      </button>
                      <input
                        type="url"
                        value={activePreset.beforeAfterMedia?.beforeImage || ''}
                        onChange={(e) => updateField('beforeAfterMedia.beforeImage', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">{lang === 'ar' ? 'صورة (بعد):' : 'After Photo:'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => afterImgFileInputRef.current?.click()}
                        className="h-10 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                      </button>
                      <input
                        type="url"
                        value={activePreset.beforeAfterMedia?.afterImage || ''}
                        onChange={(e) => updateField('beforeAfterMedia.afterImage', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Smart Skin Routine Diagnosis Cards */}
              <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'ar' ? '4. كروت تشخيص روتين البشرة الذكي (Skin Diagnosis)' : '4. Skin Diagnosis Cards'}</span>
                  </h3>
                  <span className="text-[11px] text-blue-700 font-bold bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    {lang === 'ar' ? '٤ بطاقات تفاعلية' : '4 Cards'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activePreset.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || []).map((card) => (
                    <div key={card.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{card.title[lang] || card.title.ar}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{card.id}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'رابط صورة الكرت:' : 'Card Image URL:'}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={card.image || ''}
                            onChange={(e) => updateSkinDiagnosisCard(card.id, 'image', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                          />
                          {card.image && (
                            <img src={card.image} alt="Card" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'العنوان:' : 'Title:'}</label>
                          <input
                            type="text"
                            value={card.title.ar}
                            onChange={(e) => updateSkinDiagnosisCard(card.id, 'title.ar', e.target.value)}
                            className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'المكوّن الفعّال:' : 'Ingredient:'}</label>
                          <input
                            type="text"
                            value={card.ingredient.ar}
                            onChange={(e) => updateSkinDiagnosisCard(card.id, 'ingredient.ar', e.target.value)}
                            className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'الشارة الترويجية:' : 'Badge:'}</label>
                        <input
                          type="text"
                          value={card.badge.ar}
                          onChange={(e) => updateSkinDiagnosisCard(card.id, 'badge.ar', e.target.value)}
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Verified Buyer Testimonials */}
              <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{lang === 'ar' ? '5. شهادات وتقييمات العميلات الحقيقية (Verified Testimonials)' : '5. Customer Testimonials'}</span>
                  </h3>
                  <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    {lang === 'ar' ? 'سلايدر التقييمات' : 'Reviews Carousel'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(activePreset.testimonials || siteConfig.presets.cosmetics.testimonials || []).map((t) => (
                    <div key={t.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'صورة الأفاتار:' : 'Avatar URL:'}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={t.avatar || ''}
                              onChange={(e) => updateTestimonialItem(t.id, 'avatar', e.target.value)}
                              placeholder="https://..."
                              className="flex-1 h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono"
                            />
                            {t.avatar && (
                              <img src={t.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'الاسم:' : 'Name:'}</label>
                            <input
                              type="text"
                              value={t.name.ar}
                              onChange={(e) => updateTestimonialItem(t.id, 'name.ar', e.target.value)}
                              className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                            <input
                              type="text"
                              value={t.city.ar}
                              onChange={(e) => updateTestimonialItem(t.id, 'city.ar', e.target.value)}
                              className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{lang === 'ar' ? 'نص التجربة:' : 'Review Text:'}</label>
                          <textarea
                            rows={3}
                            value={t.comment.ar}
                            onChange={(e) => updateTestimonialItem(t.id, 'comment.ar', e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'إعدادات هوية المتجر وبيانات التذييل (Footer)' : 'Brand Identity & Footer Information'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar' ? 'تعديل اسم المتجر، شعار المتجر، أرقام الواتساب والتواصل، وعنوان المتجر ونبذة من نحن في أسفل الصفحة.' : 'Manage store names, logo, WhatsApp hotline, address, and about story.'}
              </p>
            </div>

            {/* Store Name & Slogan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'اسم المتجر بالعربية:' : 'Store Name (Arabic):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeName.ar}
                  onChange={(e) => updateField('storeName.ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'اسم المتجر بالإنجليزية:' : 'Store Name (English):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeName.en}
                  onChange={(e) => updateField('storeName.en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالعربية):' : 'Slogan (Arabic):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeSlogan.ar}
                  onChange={(e) => updateField('storeSlogan.ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالإنجليزية):' : 'Slogan (English):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeSlogan.en}
                  onChange={(e) => updateField('storeSlogan.en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Logo Image URL & Direct Upload */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  {lang === 'ar' ? 'شعار المتجر (رفع مباشر أو رابط URL):' : 'Store Logo (Upload or URL):'}
                </label>
                {activePreset.storeLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      updateField('storeLogo', '');
                      showToast(lang === 'ar' ? 'تم مسح الشعار والاعتماد على الاسم النصي' : 'Reverted to text logo');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    {lang === 'ar' ? 'مسح الشعار والعودة للاسم النصي' : 'Clear & Revert to Pure Text'}
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع الشعار من جهازك' : 'Upload Logo File'}</span>
                </button>

                <input
                  type="url"
                  placeholder="https://... (Leave blank for text-only luxury mode)"
                  value={activePreset.storeLogo || ''}
                  onChange={(e) => updateField('storeLogo', e.target.value)}
                  className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />

                {activePreset.storeLogo && (
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 shadow-sm">
                    <img src={activePreset.storeLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                {lang === 'ar'
                  ? 'إذا تركت الحقل فارغاً، يظهر الاسم النصي المتناسق. وإذا قمت برفع أو لصق صورة، ستعرض كشعار المتجر الرسمي فوراً.'
                  : 'Leaving blank shows clean geometric text typography. Uploading an image displays it as official brand logo.'}
              </p>
            </div>

            {/* Contact & Footer Information */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {lang === 'ar' ? 'بيانات التواصل والتذييل (Contact Info & Footer)' : 'Contact Information & Footer'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'رقم الواتساب الرسمي (بدون + وبدون أصفار):' : 'WhatsApp Number:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.whatsapp}
                    onChange={(e) => updateField('contactInfo.whatsapp', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'رقم الهاتف المباشر:' : 'Direct Phone:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.phone}
                    onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني للعملاء:' : 'Customer Email:'}
                  </label>
                  <input
                    type="email"
                    value={activePreset.contactInfo.email}
                    onChange={(e) => updateField('contactInfo.email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'عنوان المتجر أو المستودع:' : 'Store Address:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.address.ar}
                    onChange={(e) => updateField('contactInfo.address.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'نبذة عن المتجر في الفوتر (About Snippet):' : 'Footer About Snippet:'}
                  </label>
                  <textarea
                    rows={2}
                    value={activePreset.footerAbout?.description?.ar || ''}
                    onChange={(e) => updateField('footerAbout.description.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Hidden Global Gallery File Input for Direct Product Upload */}
      <input 
        type="file"
        ref={galleryFileInputRef}
        onChange={handleGalleryFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Store Logo Upload */}
      <input 
        type="file"
        ref={logoFileInputRef}
        onChange={handleLogoFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Hero Main Image Upload */}
      <input 
        type="file"
        ref={heroFileInputRef}
        onChange={handleHeroFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Trio Banners */}
      <input 
        type="file"
        ref={trioBannerFileInputRef}
        onChange={handleTrioBannerFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Promo Image 1 */}
      <input 
        type="file"
        ref={promo1FileInputRef}
        onChange={handlePromo1FileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Promo Image 2 */}
      <input 
        type="file"
        ref={promo2FileInputRef}
        onChange={handlePromo2FileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Before Image */}
      <input 
        type="file"
        ref={beforeImgFileInputRef}
        onChange={handleBeforeFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for After Image */}
      <input 
        type="file"
        ref={afterImgFileInputRef}
        onChange={handleAfterFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
