import { toBanglaNumber } from './bangla-number';
import { useLanguageStore } from '@/stores/languageStore';

export function formatDate(dateString: string | Date, locale?: string): string {
  try {
    const activeLocale =
      locale ||
      (typeof window !== 'undefined'
        ? useLanguageStore.getState().locale
        : 'en');

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);

    const day = date.getDate();
    const year = date.getFullYear();

    if (activeLocale === 'bn') {
      const bnMonthNames = [
        'জানুয়ারি',
        'ফেব্রুয়ারি',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর',
      ];
      const month = bnMonthNames[date.getMonth()];
      return `${toBanglaNumber(day)} ${month}, ${toBanglaNumber(year)}`;
    }

    if (activeLocale === 'ar') {
      const arMonthNames = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ];
      const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      const toArabicDigits = (n: number) =>
        String(n).replace(/[0-9]/g, (w) => arDigits[+w]);
      return `${toArabicDigits(day)} ${arMonthNames[date.getMonth()]}، ${toArabicDigits(year)}`;
    }

    // Default to English
    const enMonthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = enMonthNames[date.getMonth()];
    return `${day} ${month}, ${year}`;
  } catch {
    return String(dateString);
  }
}
