import React from 'react';
import { Award, BadgeCheck, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react';
import { FieldResetBtn } from './FieldResetBtn';

interface CustomizerTrustCornersProps {
  lang: 'ar' | 'en';
  activePreset: any;
  preset: any;
  testimonialsList: any[];
  updateField: (path: string, value: any) => void;
  updateTestimonial: (idx: number, field: string, val: any) => void;
  isFieldModified: (path: string) => boolean;
  resetFieldToDefault: (path: string, descAr: string, descEn: string) => void;
}

export const CustomizerTrustCorners: React.FC<CustomizerTrustCornersProps> = ({
  lang,
  activePreset,
  preset,
  testimonialsList,
  updateField,
  updateTestimonial,
  isFieldModified,
  resetFieldToDefault,
}) => {
  const renderReset = (path: string, descAr: string, descEn: string) => (
    <FieldResetBtn
      lang={lang}
      path={path}
      descAr={descAr}
      descEn={descEn}
      isFieldModified={isFieldModified}
      resetFieldToDefault={resetFieldToDefault}
    />
  );

  return (
    <>
      {/* CORNER 11: CUSTOMER TESTIMONIALS */}
      <div id="corner-11" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              11
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'الركن الحادي عشر: آراء وتقييمات العملاء الموثقة' : 'Corner 11: Customer Testimonials'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'تجارب وآراء العميلات، الأسماء، المدن، وصور الأفاتار' : 'Customer reviews, star ratings, verified badges, and testimonials'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'سلايدر آراء العملاء' : 'Reviews Section'}</span>
            </span>
            {renderReset('testimonials', 'آراء العملاء', 'Testimonials')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonialsList.map((t, tIdx) => (
            <div key={t.id || tIdx} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'رابط الأفاتار:' : 'Avatar URL:'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={t.avatar || ''}
                    onChange={(e) => updateTestimonial(tIdx, 'avatar', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-[11px] font-mono"
                  />
                  {t.avatar && (
                    <img src={t.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'الاسم:' : 'Name:'}</label>
                  <input
                    type="text"
                    value={t.name?.ar || ''}
                    onChange={(e) => updateTestimonial(tIdx, 'name.ar', e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                  <input
                    type="text"
                    value={t.city?.ar || ''}
                    onChange={(e) => updateTestimonial(tIdx, 'city.ar', e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'نص التقييم:' : 'Review Text:'}</label>
                <textarea
                  rows={3}
                  value={t.comment?.ar || ''}
                  onChange={(e) => updateTestimonial(tIdx, 'comment.ar', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORNER 12: STORE VALUE PROPS & TRUST SHIELD */}
      <div id="corner-12" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              12
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الثاني عشر: شريط مزايا المتجر وشارات الأمان' : 'Corner 12: Store Value Props'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'مزايا الضمان الذهبي، التوصيل السريع، والأصالة النباتية 100%' : 'Trust badges, certified warranty, fast delivery, and purity guarantees'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'ar' ? 'أعلى تذييل المتجر' : 'Above Store Footer'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'ضمان سنتين شامل معتمد' : 'Certified 2-Year Warranty'}</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              {lang === 'ar' ? 'يظهر تلقائياً على كافة كروت أجهزة الشعر والجمال لتعزيز قرار الشراء.' : 'Displays on hair styling hardware devices.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
              <Award className="w-4 h-4 text-purple-600" />
              <span>{lang === 'ar' ? 'نقاء نباتي أصلي 100%' : '100% Pure Botanical'}</span>
            </div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              {lang === 'ar' ? 'يظهر تلقائياً على كافة كروت سيرومات ومنتجات العناية بالبشرة.' : 'Displays on botanical skincare products.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'شحن فوري ومتابعة واتساب' : 'Instant Delivery Hotline'}</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              {lang === 'ar' ? 'ربط فوري بأرقام التوصيل والشحن مع رسائل تأكيد آلية.' : 'Instant delivery updates and WhatsApp alerts.'}
            </p>
          </div>
        </div>
      </div>

      {/* CORNER 13: FOOTER & CONTACT INFORMATION */}
      <div id="corner-13" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              13
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الثالث عشر: تذييل المتجر وروابط التواصل (Footer & WhatsApp)' : 'Corner 13: Footer & Contact Info'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'رقم الواتساب الرسمي، الهاتف، البريد، العنوان، نبذة من نحن، وروابط السوشيال ميديا' : 'WhatsApp hotline, phone, email, address, about story, and social links'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'ar' ? 'قاع المتجر (التذييل)' : 'Bottom Footer'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'رقم الواتساب الرسمي (بدون + أو مسافات):' : 'Official WhatsApp Hotline:'}
              </label>
              {renderReset('contactInfo.whatsapp', 'رقم الواتساب', 'WhatsApp Hotline')}
            </div>
            <input
              type="text"
              value={activePreset.contactInfo?.whatsapp || ''}
              onChange={(e) => updateField('contactInfo.whatsapp', e.target.value)}
              placeholder="249900776688"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'رقم الهاتف المباشر:' : 'Phone Number:'}
              </label>
              {renderReset('contactInfo.phone', 'رقم الهاتف', 'Phone Number')}
            </div>
            <input
              type="text"
              value={activePreset.contactInfo?.phone || ''}
              onChange={(e) => updateField('contactInfo.phone', e.target.value)}
              placeholder="+249 900 77 66 88"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'البريد الإلكتروني للدعم:' : 'Support Email:'}
              </label>
              {renderReset('contactInfo.email', 'البريد الإلكتروني', 'Support Email')}
            </div>
            <input
              type="email"
              value={activePreset.contactInfo?.email || ''}
              onChange={(e) => updateField('contactInfo.email', e.target.value)}
              placeholder="care@nadi.sd"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'عنوان المعرض أو المقر:' : 'Store Physical Address:'}
              </label>
              {renderReset('contactInfo.address.ar', 'عنوان المتجر', 'Address (AR)')}
            </div>
            <input
              type="text"
              value={activePreset.contactInfo?.address?.ar || ''}
              onChange={(e) => updateField('contactInfo.address.ar', e.target.value)}
              placeholder="الخرطوم - الرياض، تقاطع شارع المشتل مع الجزار"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* About Story */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 block">
              {lang === 'ar' ? 'نبذة من نحن في تذييل المتجر (About Story):' : 'About Store Story (Footer):'}
            </label>
            {renderReset('aboutStory.body.ar', 'نبذة المتجر', 'About Story')}
          </div>
          <textarea
            rows={3}
            value={preset.aboutStory?.body?.ar || ''}
            onChange={(e) => updateField('aboutStory.body.ar', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-none"
          />
        </div>

        {/* Social Links */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="text-xs font-bold text-slate-800 block">
            {lang === 'ar' ? 'روابط شبكات التواصل الاجتماعي (Social Links):' : 'Social Media Accounts:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Instagram:</label>
              <input
                type="text"
                value={preset.socialLinks?.instagram || ''}
                onChange={(e) => updateField('socialLinks.instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">TikTok:</label>
              <input
                type="text"
                value={preset.socialLinks?.tiktok || ''}
                onChange={(e) => updateField('socialLinks.tiktok', e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Twitter / X:</label>
              <input
                type="text"
                value={preset.socialLinks?.twitter || ''}
                onChange={(e) => updateField('socialLinks.twitter', e.target.value)}
                placeholder="https://x.com/..."
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
