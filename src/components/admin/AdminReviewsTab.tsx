import React, { useState } from 'react';
import {
  BadgeCheck,
  Check,
  Clock,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { siteConfig } from '../../data/siteConfig';
import { updateReviewStatusInCloud, deleteReviewFromCloud } from '../../services/reviewService';
import { AdminConfirmConfig } from './AdminProductsTab';

interface AdminReviewsTabProps {
  onRequestConfirm: (config: AdminConfirmConfig) => void;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({ onRequestConfirm }) => {
  const { lang, dynamicConfig, setDynamicConfig, activePresetId, showToast } = useCommerce();

  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRevName, setNewRevName] = useState('');
  const [newRevCity, setNewRevCity] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState('');
  const [newRevAvatar, setNewRevAvatar] = useState('');
  const [newRevProduct, setNewRevProduct] = useState('');

  const activePreset = dynamicConfig.presets[activePresetId];
  const allTestimonialsList =
    activePreset.testimonials && activePreset.testimonials.length > 0
      ? activePreset.testimonials
      : siteConfig.presets.cosmetics.testimonials || [];

  const pendingReviewsCount = allTestimonialsList.filter((t: any) => t.status === 'pending').length;
  const approvedReviewsCount = allTestimonialsList.filter((t: any) => t.status === 'approved' || !t.status).length;
  const rejectedReviewsCount = allTestimonialsList.filter((t: any) => t.status === 'rejected').length;

  const filteredReviews = allTestimonialsList.filter((t: any) => {
    const status = t.status || 'approved';
    const matchesFilter = reviewFilter === 'all' || status === reviewFilter;
    const q = reviewSearchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const nameMatch = (t.name?.ar || '').toLowerCase().includes(q) || (t.name?.en || '').toLowerCase().includes(q);
    const cityMatch = (t.city?.ar || '').toLowerCase().includes(q) || (t.city?.en || '').toLowerCase().includes(q);
    const commentMatch =
      (t.comment?.ar || '').toLowerCase().includes(q) || (t.comment?.en || '').toLowerCase().includes(q);
    return matchesFilter && (nameMatch || cityMatch || commentMatch);
  });

  const handleApproveReview = (reviewId: string | number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const targetPreset = clone.presets[activePresetId];
      if (!Array.isArray(targetPreset.testimonials)) {
        targetPreset.testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      const item = targetPreset.testimonials.find((t: any) => String(t.id) === String(reviewId));
      if (item) item.status = 'approved';
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
    if (typeof reviewId === 'string' && reviewId.startsWith('REV-')) {
      updateReviewStatusInCloud(reviewId, 'approved').catch(() => {});
    }
    showToast(lang === 'ar' ? 'تم اعتماد التقييم ونشره في واجهة المتجر بنجاح ✓' : 'Review approved and published to storefront ✓');
  };

  const handleRejectReview = (reviewId: string | number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const targetPreset = clone.presets[activePresetId];
      if (!Array.isArray(targetPreset.testimonials)) {
        targetPreset.testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      const item = targetPreset.testimonials.find((t: any) => String(t.id) === String(reviewId));
      if (item) item.status = 'rejected';
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
    if (typeof reviewId === 'string' && reviewId.startsWith('REV-')) {
      updateReviewStatusInCloud(reviewId, 'rejected').catch(() => {});
    }
    showToast(lang === 'ar' ? 'تم إخفاء التقييم من واجهة المتجر' : 'Review hidden from storefront');
  };

  const handleDeleteReview = (reviewId: string | number) => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'حذف التقييم نهائياً' : 'Delete Review Permanently',
      message:
        lang === 'ar'
          ? 'هل أنتِ متأكدة من حذف هذا التقييم نهائياً؟ لا يمكن التراجع عن هذه الخطوة.'
          : 'Are you sure you want to permanently delete this review? This action cannot be undone.',
      confirmLabel: lang === 'ar' ? 'حذف نهائي' : 'Delete Forever',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          const targetPreset = clone.presets[activePresetId];
          if (!Array.isArray(targetPreset.testimonials)) {
            targetPreset.testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
          }
          targetPreset.testimonials = targetPreset.testimonials.filter((t: any) => String(t.id) !== String(reviewId));
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        if (typeof reviewId === 'string' && reviewId.startsWith('REV-')) {
          deleteReviewFromCloud(reviewId).catch(() => {});
        }
        showToast(lang === 'ar' ? 'تم حذف التقييم نهائياً' : 'Review permanently deleted');
      },
    });
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevName.trim() || !newRevComment.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم العميلة ونص التجربة' : 'Please provide name and review text');
      return;
    }
    const newId = Date.now();
    const newReview = {
      id: newId,
      name: { ar: newRevName.trim(), en: newRevName.trim() },
      city: {
        ar: newRevCity.trim() || (lang === 'ar' ? 'الرياض' : 'Riyadh'),
        en: newRevCity.trim() || 'Riyadh',
      },
      avatar:
        newRevAvatar.trim() ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      purchasedProduct: {
        ar: newRevProduct.trim() || (lang === 'ar' ? 'مشتريات معتمدة من المتجر' : 'Verified Store Order'),
        en: newRevProduct.trim() || 'Verified Store Order',
        id: 'manual',
      },
      date: { ar: 'الآن (مضاف من الإدارة)', en: 'Just now' },
      comment: { ar: newRevComment.trim(), en: newRevComment.trim() },
      badge: { ar: 'مشتري حقيقي موثق ✓', en: 'Verified Real Buyer ✓' },
      rating: newRevRating || 5,
      status: 'approved' as const,
    };

    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const targetPreset = clone.presets[activePresetId];
      if (!Array.isArray(targetPreset.testimonials)) {
        targetPreset.testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      targetPreset.testimonials.unshift(newReview);
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });

    setIsAddingReview(false);
    setNewRevName('');
    setNewRevCity('');
    setNewRevComment('');
    setNewRevAvatar('');
    setNewRevProduct('');
    setNewRevRating(5);
    showToast(lang === 'ar' ? 'تمت إضافة التقييم ونشره في المتجر بنجاح ✓' : 'Review added and published to store ✓');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Header with Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-amber-500" />
              <span>{lang === 'ar' ? 'إدارة تقييمات وآراء العملاء (Customer Reviews)' : 'Verified Customer Reviews Management'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'مراجعة واعتماد التقييمات الواردة من عميلات المتجر، نشرها بالواجهة أو إخفاؤها وحذفها، وإضافة تقييمات جديدة موثقة.'
                : 'Review incoming customer submissions, publish or unpublish them on the storefront, and manage testimonials.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingReview(true)}
              className="h-11 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? '+ إضافة تقييم يدوي' : '+ Add Testimonial'}</span>
            </button>
          </div>
        </div>

        {/* Status KPI Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setReviewFilter('all')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              reviewFilter === 'all'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-[11px] font-bold text-slate-500 block">{lang === 'ar' ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
            <span className="text-lg font-black text-slate-900">{allTestimonialsList.length}</span>
          </div>

          <div
            onClick={() => setReviewFilter('pending')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              reviewFilter === 'pending'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">{lang === 'ar' ? 'بانتظار المراجعة' : 'Pending Approval'}</span>
              {pendingReviewsCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
            </div>
            <span className="text-lg font-black text-amber-900">{pendingReviewsCount}</span>
          </div>

          <div
            onClick={() => setReviewFilter('approved')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              reviewFilter === 'approved'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-[11px] font-bold text-emerald-800 block">{lang === 'ar' ? 'معتمدة ومنشورة' : 'Published on Store'}</span>
            <span className="text-lg font-black text-emerald-900">{approvedReviewsCount}</span>
          </div>

          <div
            onClick={() => setReviewFilter('rejected')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              reviewFilter === 'rejected'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-[11px] font-bold text-rose-800 block">{lang === 'ar' ? 'مخفية / مرفوضة' : 'Hidden / Rejected'}</span>
            <span className="text-lg font-black text-rose-900">{rejectedReviewsCount}</span>
          </div>
        </div>

        {/* Add New Review Form Drawer */}
        {isAddingReview && (
          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-amber-500/40 shadow-lg space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ar' ? 'إضافة رأي وتجربة عميلة جديدة' : 'Add New Customer Testimonial'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingReview(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'اسم العميلة *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newRevName}
                    onChange={(e) => setNewRevName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: سارة محمد' : 'e.g. Sarah M.'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'المدينة / الدولة:' : 'City / Country:'}
                  </label>
                  <input
                    type="text"
                    value={newRevCity}
                    onChange={(e) => setNewRevCity(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: أم درمان / الرياض' : 'e.g. Omdurman / Riyadh'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    {lang === 'ar' ? 'مستوى التقييم الرقمي (1-5):' : 'Quality Score (1-5):'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const active = score === newRevRating;
                      return (
                        <button
                          type="button"
                          key={score}
                          onClick={() => setNewRevRating(score)}
                          className={`min-w-[38px] h-9 px-2.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer border ${
                            active
                              ? 'bg-purple-900 text-amber-300 border-purple-800 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {score}
                        </button>
                      );
                    })}
                    <span className="ms-2 inline-flex items-center gap-1 text-xs font-black text-purple-900 font-mono">
                      <BadgeCheck className="w-4 h-4 text-amber-600" />
                      <span>{newRevRating}.0 / 5</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'المنتج المقتنى أو الوصف:' : 'Purchased Product tag:'}
                  </label>
                  <input
                    type="text"
                    value={newRevProduct}
                    onChange={(e) => setNewRevProduct(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: سيروم فيتامين سي النقي' : 'e.g. Vitamin C Radiance Serum'}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'رابط صورة الأفاتار (اختياري):' : 'Avatar Photo URL (Optional):'}
                </label>
                <input
                  type="url"
                  value={newRevAvatar}
                  onChange={(e) => setNewRevAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'نص التجربة والرأي *' : 'Review Comment *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newRevComment}
                  onChange={(e) => setNewRevComment(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب تجربة العميلة وانطباعها الصادق عن المنتجات...' : 'Customer feedback...'}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingReview(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-sm active:scale-95"
                >
                  {lang === 'ar' ? 'نشر التقييم بالمتجر فوراً' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={reviewSearchQuery}
              onChange={(e) => setReviewSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالاسم، المدينة، أو التعليق...' : 'Search by name, city, or comment...'}
              className="w-full h-10 ps-9 pe-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            {reviewSearchQuery && (
              <button
                type="button"
                onClick={() => setReviewSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto max-w-full">
            <span className="text-[11px] font-bold text-slate-400 me-1">{lang === 'ar' ? 'الحالة:' : 'Filter:'}</span>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setReviewFilter(filterKey)}
                className={`h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  reviewFilter === filterKey
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterKey === 'all' && (lang === 'ar' ? 'الكل' : 'All')}
                {filterKey === 'pending' &&
                  (lang === 'ar' ? `قيد المراجعة (${pendingReviewsCount})` : `Pending (${pendingReviewsCount})`)}
                {filterKey === 'approved' &&
                  (lang === 'ar' ? `المعتمدة (${approvedReviewsCount})` : `Approved (${approvedReviewsCount})`)}
                {filterKey === 'rejected' &&
                  (lang === 'ar' ? `المخفية (${rejectedReviewsCount})` : `Hidden (${rejectedReviewsCount})`)}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">
              {lang === 'ar' ? 'لا توجد تقييمات مطابقة لهذا البحث أو التصفية' : 'No matching reviews found'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'يمكنك تغيير التصفية أو إضافة تقييم جديد يدوي.' : 'Change your filter or add a new testimonial.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((rev: any) => {
              const status = rev.status || 'approved';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={rev.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-400/40'
                      : isRejected
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            rev.avatar ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={rev.name?.ar || 'Avatar'}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-black text-slate-900 leading-snug">
                            {rev.name?.[lang] || rev.name?.ar}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {rev.city?.[lang] || rev.city?.ar || (lang === 'ar' ? 'الخرطوم' : 'Khartoum')}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'قيد المراجعة' : 'Pending'}</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'منشور بالمتجر' : 'Published'}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            <span>{lang === 'ar' ? 'مخفي' : 'Hidden'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200/80 font-mono font-bold text-[11px]">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{Number(rev.rating || 5).toFixed(1)} / 5</span>
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {rev.purchasedProduct?.[lang] || rev.purchasedProduct?.ar || rev.date?.[lang] || rev.date?.ar}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed font-sans italic">
                      "{rev.comment?.[lang] || rev.comment?.ar}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex-1 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                          title={lang === 'ar' ? 'اعتماد ونشر في المتجر' : 'Approve and Publish'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'نشر بالمتجر' : 'Publish'}</span>
                        </button>
                      )}

                      {isApproved && (
                        <button
                          type="button"
                          onClick={() => handleRejectReview(rev.id)}
                          className="flex-1 h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          title={lang === 'ar' ? 'إخفاء من المتجر' : 'Hide from Store'}
                        >
                          <span>{lang === 'ar' ? 'إخفاء مؤقت' : 'Hide'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="h-9 px-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                      title={lang === 'ar' ? 'حذف نهائي' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
