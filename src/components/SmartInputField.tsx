import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, EyeOff, Lock, Phone, Sparkles, Check, AlertCircle, 
  ShieldCheck, CheckCircle2, ChevronDown 
} from 'lucide-react';

// ==========================================
// 1. SMART PASSWORD / PIN WITH TRANSIENT MASKING
// ==========================================
interface SmartPasswordInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  lang: 'ar' | 'en';
  showStrengthMeter?: boolean;
  helperText?: string;
  autoComplete?: string;
}

export const SmartPasswordInput: React.FC<SmartPasswordInputProps> = ({
  id = 'smart-password',
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  lang,
  showStrengthMeter = false,
  helperText,
  autoComplete = 'current-password',
}) => {
  const isRtl = lang === 'ar';
  
  // State
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [transientRevealIndex, setTransientRevealIndex] = useState<number | null>(null);
  const [isSmartPeekActive, setIsSmartPeekActive] = useState(true);
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Timer ref to clear transient reveal
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle keystroke and smart character reveal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    const prevVal = value;

    // Detect if a character was added at cursor position
    if (nextVal.length > prevVal.length && isSmartPeekActive && !isFullyRevealed) {
      // Character added
      const addedIndex = (inputRef.current?.selectionStart ?? nextVal.length) - 1;
      const validIndex = addedIndex >= 0 && addedIndex < nextVal.length ? addedIndex : nextVal.length - 1;
      
      setTransientRevealIndex(validIndex);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      // Auto-hide the revealed character after 950ms
      timerRef.current = setTimeout(() => {
        setTransientRevealIndex(null);
      }, 950);
    } else {
      // If deleted or replaced
      setTransientRevealIndex(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    onChange(nextVal);
  };

  // Check Caps Lock on keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setIsCapsOn(e.getModifierState('CapsLock'));
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: lang === 'ar' ? 'فارغ' : 'Empty', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: lang === 'ar' ? 'ضعيفة' : 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: lang === 'ar' ? 'متوسطة' : 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: lang === 'ar' ? 'جيدة وقوية' : 'Strong', color: 'bg-emerald-500' };
      case 4:
      default:
        return { score: 4, label: lang === 'ar' ? 'ممتازة وفائقة الأمان' : 'Very Strong', color: 'bg-purple-600' };
    }
  };

  const strength = showStrengthMeter ? getPasswordStrength(value) : null;

  return (
    <div className="space-y-1.5 text-start w-full">
      {/* Label & Smart Peek Status Indicator */}
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        {/* Smart Peek Mode Badge / Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsSmartPeekActive(!isSmartPeekActive);
            setTransientRevealIndex(null);
          }}
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all border ${
            isSmartPeekActive 
              ? 'bg-purple-50 text-[#5A3E7A] border-purple-200/80 hover:bg-purple-100' 
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
          title={
            lang === 'ar' 
              ? (isSmartPeekActive ? 'ميزة الإظهار اللحظي الذكي مفعلة (يُظهر الرقم لثانية ثم يُخفيه للأمان)' : 'انقر لتفعيل الإظهار اللحظي لآخر رقم')
              : (isSmartPeekActive ? 'Smart Peek Active (Shows typed digit for 1s then hides securely)' : 'Click to enable smart peek')
          }
        >
          <Sparkles className={`w-3 h-3 ${isSmartPeekActive ? 'text-[#5A3E7A]' : 'text-slate-400'}`} />
          <span>{lang === 'ar' ? (isSmartPeekActive ? 'إظهار ذكي نشط' : 'إظهار ذكي متوقف') : (isSmartPeekActive ? 'Smart Peek On' : 'Smart Peek Off')}</span>
        </button>
      </div>

      {/* Input Outer Container */}
      <div className="relative flex items-center">
        {/* Left Security Icon */}
        <div className="absolute start-3.5 pointer-events-none text-slate-400 z-10">
          <Lock className="w-4 h-4" />
        </div>

        {/* Real Transparent Input for Native Typing, Selection, Autofill */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTransientRevealIndex(null);
          }}
          autoComplete={autoComplete}
          placeholder=""
          required={required}
          className={`w-full ps-10 pe-20 py-3 bg-slate-50 border rounded-2xl text-sm font-mono tracking-wider transition-all min-h-[48px] text-transparent caret-[#5A3E7A] selection:bg-purple-200 z-10 ${
            isFocused 
              ? 'border-[#5A3E7A] ring-2 ring-[#5A3E7A]/20 bg-white' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />

        {/* Visual Display Layer (Mirrored Text with Smart Transient Masking) */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 ps-10 pe-20 flex items-center pointer-events-none z-0 overflow-hidden select-none font-mono text-sm tracking-wider"
        >
          {value.length === 0 ? (
            <span className="text-slate-400 font-sans tracking-normal text-xs sm:text-sm">
              {placeholder}
            </span>
          ) : (
            <div className="flex items-center gap-0.5 truncate">
              {value.split('').map((char, index) => {
                const isCharRevealed = isFullyRevealed || index === transientRevealIndex;
                const isJustTyped = index === transientRevealIndex;

                return (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center transition-all ${
                      isJustTyped 
                        ? 'text-[#5A3E7A] font-black scale-125 bg-purple-100/80 px-1 rounded-md animate-in zoom-in-75 duration-150' 
                        : isCharRevealed 
                          ? 'text-slate-900 font-bold' 
                          : 'text-slate-500 font-black text-xs leading-none'
                    }`}
                  >
                    {isCharRevealed ? char : '●'}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Action Icons: Eye Toggle & Digit Counter */}
        <div className="absolute end-2.5 flex items-center gap-1 z-20">
          {/* Digit Counter when typing */}
          {value.length > 0 && (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded-full font-mono">
              {value.length}
            </span>
          )}

          {/* Full Eye Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsFullyRevealed(!isFullyRevealed);
              setTransientRevealIndex(null);
            }}
            className="p-1.5 text-slate-500 hover:text-[#5A3E7A] hover:bg-purple-50 rounded-xl transition-colors"
            title={lang === 'ar' ? (isFullyRevealed ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور بالكامل') : (isFullyRevealed ? 'Hide Password' : 'Show Password')}
            aria-label={isFullyRevealed ? 'Hide password' : 'Show password'}
          >
            {isFullyRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Caps Lock Alert */}
      {isCapsOn && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'ar' ? 'تنبيه: زر الحروف الكبيرة (Caps Lock) مفعّل' : 'Warning: Caps Lock is on'}</span>
        </div>
      )}

      {/* Password Strength Meter */}
      {showStrengthMeter && value.length > 0 && strength && (
        <div className="space-y-1 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">
              {lang === 'ar' ? 'قوة كلمة المرور:' : 'Password Strength:'}
            </span>
            <span className="font-bold text-slate-700">{strength.label}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  step <= strength.score ? strength.color : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          {/* Rules hint */}
          <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
            <span className={value.length >= 8 ? 'text-emerald-600 font-bold' : ''}>
              ✓ {lang === 'ar' ? '8 خانات على الأقل' : '8+ characters'}
            </span>
            <span className={/[0-9]/.test(value) ? 'text-emerald-600 font-bold' : ''}>
              ✓ {lang === 'ar' ? 'أرقام' : 'Numbers'}
            </span>
            <span className={/[a-zA-Z]/.test(value) ? 'text-emerald-600 font-bold' : ''}>
              ✓ {lang === 'ar' ? 'حروف' : 'Letters'}
            </span>
          </div>
        </div>
      )}

      {/* Helper text if provided */}
      {helperText && !showStrengthMeter && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};


// ==========================================
// 2. SMART SEGMENTED PIN / OTP DIGIT INPUT
// ==========================================
interface SmartPinOtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  lang: 'ar' | 'en';
  onComplete?: (code: string) => void;
}

export const SmartPinOtpInput: React.FC<SmartPinOtpInputProps> = ({
  length = 4,
  value,
  onChange,
  lang,
  onComplete,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [revealedDigits, setRevealedDigits] = useState<boolean[]>(Array(length).fill(false));
  const [isMaskingEnabled, setIsMaskingEnabled] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRefs = useRef<(NodeJS.Timeout | null)[]>([]);

  // Sync internal digits with incoming value
  useEffect(() => {
    const valDigits = value.split('').slice(0, length);
    const newDigits = Array(length).fill('');
    valDigits.forEach((d, idx) => {
      newDigits[idx] = d;
    });
    setDigits(newDigits);
  }, [value, length]);

  // Handle single digit input
  const handleDigitChange = (index: number, char: string) => {
    // Only accept numeric digit
    const cleanDigit = char.replace(/[^0-9]/g, '').slice(-1);
    
    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    setDigits(newDigits);

    const combinedValue = newDigits.join('');
    onChange(combinedValue);

    if (cleanDigit) {
      // Temporarily reveal this digit
      const newRevealed = [...revealedDigits];
      newRevealed[index] = true;
      setRevealedDigits(newRevealed);

      // Auto-hide after 1 second if masking is enabled
      if (isMaskingEnabled) {
        if (timerRefs.current[index]) clearTimeout(timerRefs.current[index]!);
        timerRefs.current[index] = setTimeout(() => {
          setRevealedDigits(prev => {
            const next = [...prev];
            next[index] = false;
            return next;
          });
        }, 1100);
      }

      // Auto-focus next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (newDigits.every(d => d !== '') && onComplete) {
        onComplete(combinedValue);
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle full paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (!pasted) return;

    const newDigits = Array(length).fill('');
    pasted.split('').forEach((c, idx) => {
      newDigits[idx] = c;
    });
    setDigits(newDigits);
    onChange(pasted);

    // Briefly reveal pasted digits
    setRevealedDigits(Array(length).fill(true));
    if (isMaskingEnabled) {
      setTimeout(() => {
        setRevealedDigits(Array(length).fill(false));
      }, 1200);
    }

    // Focus last filled or next empty
    const nextEmpty = newDigits.findIndex(d => d === '');
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
      if (onComplete) onComplete(pasted);
    }
  };

  const toggleAllMasking = () => {
    const nextState = !isMaskingEnabled;
    setIsMaskingEnabled(nextState);
    if (!nextState) {
      // Reveal all
      setRevealedDigits(Array(length).fill(true));
    } else {
      // Hide all
      setRevealedDigits(Array(length).fill(false));
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Header with smart reveal toggle */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">
          {lang === 'ar' ? `أدخل رمز التحقق (${length} أرقام)` : `Enter ${length}-Digit Code`}
        </span>
        <button
          type="button"
          onClick={toggleAllMasking}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5A3E7A] hover:underline"
        >
          {isMaskingEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{lang === 'ar' ? (isMaskingEnabled ? 'إظهار الأرقام' : 'إخفاء الأرقام') : (isMaskingEnabled ? 'Show Digits' : 'Mask Digits')}</span>
        </button>
      </div>

      {/* Distinct Digit Cards */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 dir-ltr" dir="ltr">
        {Array.from({ length }).map((_, index) => {
          const digit = digits[index] || '';
          const isRevealed = !isMaskingEnabled || revealedDigits[index];

          return (
            <div key={index} className="relative w-12 sm:w-14 h-14 sm:h-16">
              <input
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-full h-full text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all min-h-[48px] bg-slate-50 focus:bg-white text-transparent caret-transparent focus:outline-none ${
                  digit 
                    ? 'border-[#5A3E7A] bg-purple-50/40 ring-2 ring-[#5A3E7A]/20' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              />

              {/* Visual Display Layer for each digit cell */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-mono"
              >
                {digit ? (
                  <span className={`text-xl sm:text-2xl font-black transition-all ${
                    isRevealed 
                      ? 'text-[#5A3E7A] scale-100' 
                      : 'text-slate-600 scale-90'
                  }`}>
                    {isRevealed ? digit : '●'}
                  </span>
                ) : (
                  <span className="w-2.5 h-0.5 bg-slate-300 rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-center text-[11px] text-slate-400">
        {lang === 'ar' ? 'يتم إظهار الرقم المدخل لحظياً لتأكيده ثم تشفيره تلقائياً' : 'Entered digits are momentarily shown then securely masked'}
      </p>
    </div>
  );
};


// ==========================================
// 3. SMART PHONE NUMBER INPUT WITH AUTO-FORMATTING
// ==========================================
interface SmartPhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  lang: 'ar' | 'en';
  label?: string;
  required?: boolean;
}

const COUNTRIES = [
  { code: '+966', nameAr: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', digits: 9, placeholder: '50 123 4567' },
  { code: '+971', nameAr: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', digits: 9, placeholder: '50 123 4567' },
  { code: '+965', nameAr: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', digits: 8, placeholder: '50 123 456' },
  { code: '+974', nameAr: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', digits: 8, placeholder: '50 123 456' },
  { code: '+968', nameAr: 'عُمان', nameEn: 'Oman', flag: '🇴🇲', digits: 8, placeholder: '91 234 567' },
  { code: '+973', nameAr: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', digits: 8, placeholder: '36 123 456' },
  { code: '+20',  nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', digits: 10, placeholder: '10 1234 5678' },
  { code: '+962', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', digits: 9, placeholder: '79 123 4567' },
];

export const SmartPhoneInput: React.FC<SmartPhoneInputProps> = ({
  value,
  onChange,
  lang,
  label,
  required = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format raw digits with smart grouping: e.g. "50 123 4567"
  const formatPhoneNumber = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, selectedCountry.digits);
    if (digitsOnly.length <= 2) return digitsOnly;
    if (digitsOnly.length <= 5) return `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2)}`;
    return `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 5)} ${digitsOnly.slice(5)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  const digitsCount = value.replace(/\D/g, '').length;
  const isComplete = digitsCount === selectedCountry.digits;

  return (
    <div className="space-y-1.5 text-start w-full" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 block">
          {label || (lang === 'ar' ? 'رقم الهاتف للتوصيل والإشعارات' : 'Phone Number')}
          {required && <span className="text-rose-500 ms-1">*</span>}
        </label>
        {value.length > 0 && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono ${
            isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {digitsCount} / {selectedCountry.digits} {lang === 'ar' ? 'أرقام' : 'digits'}
          </span>
        )}
      </div>

      <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#5A3E7A] focus-within:ring-2 focus-within:ring-[#5A3E7A]/20 focus-within:bg-white rounded-2xl transition-all min-h-[48px] overflow-hidden">
        {/* Country Selector Trigger */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-full px-3 flex items-center gap-1.5 bg-slate-100/80 hover:bg-slate-200/80 border-e border-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0 min-h-[48px]"
          title={lang === 'ar' ? selectedCountry.nameAr : selectedCountry.nameEn}
        >
          <span className="text-base">{selectedCountry.flag}</span>
          <span className="font-mono text-xs">{selectedCountry.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Formatted Number Input */}
        <div className="relative flex-1 flex items-center">
          <input
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={handleInputChange}
            placeholder={selectedCountry.placeholder}
            required={required}
            className="w-full px-3.5 py-3 bg-transparent text-sm font-mono tracking-wider text-slate-900 focus:outline-none min-h-[48px]"
          />
        </div>

        {/* Valid Icon */}
        {isComplete && (
          <div className="pe-3 text-emerald-500 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}

        {/* Country Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full start-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 duration-150">
            {COUNTRIES.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsDropdownOpen(false);
                  onChange(formatPhoneNumber(value));
                }}
                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                  selectedCountry.code === country.code 
                    ? 'bg-purple-50 text-[#5A3E7A] font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{country.flag}</span>
                  <span>{lang === 'ar' ? country.nameAr : country.nameEn}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{country.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
