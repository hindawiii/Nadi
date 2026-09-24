import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, lang, addReview, showToast } = useCommerce();
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسمكِ ورأيكِ بالمنتجات' : 'Please provide your name and review');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addReview({
        name,
        city: city || (lang === 'ar' ? 'أم درمان، السودان' : 'Omdurman, Sudan'),
        comment,
        rating
      });
      setIsSubmitting(false);
      setIsReviewModalOpen(false);
      setName('');
      setCity('');
      setComment('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-4 end-4 w-11 h-11 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100/70 hover:bg-slate-200/80 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-6 px-10 sm:px-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'ar' ? 'تجربة عميلة حقيقية' : 'Verified Experience'}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {lang === 'ar' ? 'شاركينا تجربتكِ مع So Beauty' : 'Share Your Glow Journey'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'رأيكِ يلهم آلاف النساء في اختيار روتين العناية الطبيعي المناسب' : 'Your honest feedback inspires thousands of women worldwide'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <span className="text-xs font-bold text-slate-600">
              {lang === 'ar' ? 'تقييمكِ الإجمالي:' : 'Overall Rating:'}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'الاسم الكريم' : 'Your Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: سارة محمد' : 'e.g., Sarah M.'}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-800"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'المدينة / المنطقة' : 'City / Region'}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: أم درمان، الخرطوم، الرياض...' : 'e.g. Omdurman, Riyadh...'}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-800"
            />
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'رأيكِ الصادق والنتائج التي لمستها' : 'Your Review & Results'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتبي هنا كيف أثرت المنتجات على ترطيب ونضارة بشرتك...' : 'Tell us how our products refreshed and nourished your skin...'}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-800 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? (lang === 'ar' ? 'جاري النشر...' : 'Publishing...') : (lang === 'ar' ? 'نشر التقييم الموثق' : 'Post Verified Review')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
