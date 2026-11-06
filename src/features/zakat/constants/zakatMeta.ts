/**
 * Zakat Metadata & Suggestion Keywords (Frontend)
 * Used for in-app search suggestions, keyword matching, and SEO metadata.
 */

export const ZAKAT_META = {
  titleEn: 'Zakat Calculator - Accurate & Shariah-Compliant | PeaceTweet',
  titleBn: 'যাকাত ক্যালকুলেটর - সহজে নির্ভুল যাকাত হিসাব করুন | PeaceTweet',
  descriptionEn:
    'Calculate your obligatory Zakat easily with current Bangladesh gold & silver nisab rates, bank savings, business stock, investments, and deductible debts. 100% Shariah compliant.',
  descriptionBn:
    'বাংলাদেশের বর্তমান বাজার দর (সোনা ও রুপার নিসাব), নগদ টাকা, ব্যাংক ব্যালেন্স, ডিপিএস, এফডিআর, ব্যবসায়ী স্টক ও বাদযোগ্য ঋণ হিসাব করে সঠিক যাকাত নির্ধারণ করুন। শতভাগ শরীয়াহ সম্মত ও নিরাপদ যাকাত ক্যালকুলেটর।',
  route: '/zakat',
  badgeEn: 'Recommended Tool',
  badgeBn: 'প্রস্তাবিত টুল',
};

/**
 * Comprehensive list of Zakat-related search keywords in Bengali, English, and Banglish
 */
export const ZAKAT_KEYWORDS: readonly string[] = [
  // Primary Terms
  'zakat',
  'zakah',
  'jakat',
  'zakaat',
  'jakath',
  'zakath',
  'যাকাত',
  'জাকাত',
  'যাকাতুল মাল',
  'যাকাতুল ফিতর',
  'জাকাতুল ফিতর',

  // Calculator & Calculation
  'zakat calculator',
  'jakat calculator',
  'zakat calculation',
  'calculator',
  'calc',
  'ক্যালকুলেটর',
  'হিসাব',
  'গণনা',
  'hisab',
  'hishab',
  'zakat hisab',
  'jakat hisab',
  'হিসেব',

  // Nisab
  'nisab',
  'nesab',
  'নিসাব',
  'নেসাব',
  'নিসাবের হিসাব',
  'nisab threshold',
  'nisab rate',

  // Gold & Silver / Precious Metals
  'gold',
  'gold zakat',
  'silver',
  'silver zakat',
  'সোনা',
  'সোনার যাকাত',
  'স্বর্ণ',
  'স্বর্ণের যাকাত',
  'রূপা',
  'রুপা',
  'রুপার যাকাত',
  'রূপার যাকাত',
  'ভরি',
  'vori',
  'bhori',
  'তোলা',
  'tola',
  'গ্রাম',
  'gram',
  '২২ ক্যারেট',
  '২১ ক্যারেট',
  '22k',
  '21k',
  '24k',
  '52.5 vori',
  '7.5 vori',
  '৭.৫ ভরি',
  '৫২.৫ ভরি',

  // Cash, Savings, Bank
  'cash',
  'money',
  'bank',
  'bank balance',
  'savings',
  'taka',
  'টাকা',
  'নগদ',
  'নগদ টাকা',
  'ক্যাশ',
  'ব্যাংক',
  'ব্যাংক ব্যালেন্স',
  'সঞ্চয়',
  'ডিপিএস',
  'dps',
  'এফডিআর',
  'fdr',
  'প্রভিডেন্ট ফান্ড',
  'provident fund',

  // Business & Investments
  'business',
  'business zakat',
  'business stock',
  'inventory',
  'ব্যবসা',
  'ব্যবসার যাকাত',
  'ব্যবসায়িক পণ্য',
  'দোকানের মাল',
  'পণ্য',
  'শেয়ার',
  'share',
  'shares',
  'stocks',
  'mutual fund',
  'মিউচুয়াল ফান্ড',
  'বিনিয়োগ',
  'investment',

  // Debts & Liabilities
  'debt',
  'debts',
  'loan',
  'loans',
  'liabilities',
  'ঋণ',
  'দেনা',
  'ধার',
  'করজ',
  'ঋণ পরিশোধ',
  'rin',
  'dena',

  // Islamic / Ramadan / Charity terms
  'রমজান',
  'রমযান',
  'ramadan',
  'ramzan',
  'ফিতরা',
  'fitra',
  'fitrah',
  'সদকা',
  'সাদকা',
  'sadaqah',
  'sadqah',
  'দান',
  'charity',
  'donation',
  'হিজরি',
  'hijri',
  'ফরজ',
  'fard',
  'ওয়াজিব',
  'wajib',
];

/**
 * Checks whether a given search query is related to Zakat.
 */
export function isZakatRelatedQuery(query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  if (q.length < 2) return false;

  for (const kw of ZAKAT_KEYWORDS) {
    const k = kw.toLowerCase();
    if (k === q || q.includes(k) || (q.length >= 3 && k.includes(q))) {
      return true;
    }
  }

  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    for (const kw of ZAKAT_KEYWORDS) {
      const k = kw.toLowerCase();
      if (k === token || (token.length >= 3 && k.includes(token))) {
        return true;
      }
    }
  }

  return false;
}
