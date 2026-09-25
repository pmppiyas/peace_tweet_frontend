import { toBanglaNumber } from './bangla-number';

export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
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
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${toBanglaNumber(day)} ${month}, ${toBanglaNumber(year)}`;
  } catch {
    return String(dateString);
  }
}
