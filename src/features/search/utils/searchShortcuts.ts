export interface FeatureShortcut {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  badgeBn: string;
  badgeEn: string;
  href: string;
  theme: 'emerald' | 'rose' | 'primary' | 'blue';
  icon: 'calculator' | 'droplet' | 'sparkles' | 'layers';
}

const BRAND_KEYWORDS = [
  'peacetweet',
  'peace tweet',
  'peace-tweet',
  'peace',
  'pictuit',
  'pic tuit',
  'pic-tuit',
  'pictweet',
  'pic tweet',
  'pictwit',
  'pic twit',
  'piktuit',
  'pik tuit',
  'piktweet',
  'pik tweet',
  'pistuit',
  'pis tuit',
  'pis-tuit',
  'pistweet',
  'pis tweet',
  'pis-tweet',
  'pistwit',
  'pis twit',
  'peacetuit',
  'peace tuit',
  'peactweet',
  'peac tweet',
  'peacetwit',
  'peace twit',
  'peacetwt',
  'peace twt',
  'peastweet',
  'pestweet',
  'piecetweet',
  'piece tweet',
  'picetweet',
  'pice tweet',
  'peace teet',
  'peacetweat',
  'পিসটুইট',
  'পিস টুইট',
  'পিস্টুইট',
  'পিস্টুইত',
  'পিস্তুইট',
  'পিকটুইট',
  'পিক টুইট',
  'পিকটুইত',
  'পীস টুইট',
  'পীসটুইট',
  'পিসটুঈট',
  'পিস টুয়েট',
  'পিকটুয়েট',
  'পিক টুয়েট',
  'পিস টুইটার',
  'পিকটুইটার',
  'purpose',
  'about',
  'আমাদের উদ্দেশ্য',
  'উদ্দেশ্য',
  'লক্ষ্য',
  'শান্তির সোশ্যাল মিডিয়া',
];

const BLOOD_KEYWORDS = [
  'blood',
  'blood donation',
  'blood donor',
  'blood request',
  'donors',
  'donor',
  'emergency blood',
  'রক্ত',
  'রক্তদান',
  'রক্তদাতা',
  'ব্লাড',
  'ব্লাড ডোনেশন',
  'জরুরি রক্ত',
  'রক্তের গ্রুপ',
  'a+',
  'b+',
  'o+',
  'ab+',
  'a-',
  'b-',
  'o-',
  'ab-',
];

const DUA_CATEGORY_KEYWORDS = [
  'dua',
  'duas',
  'দোয়া',
  'দোয়া',
  'মুনাজাত',
  'munajat',
  'zikr',
  'জিকির',
  'আজকার',
  'azkar',
  'namaz',
  'নামাজ',
  'নামাজের দোয়া',
  'category',
  'categories',
  'ক্যাটাগরি',
  'হাদিস',
  'hadith',
  'হিসনুল মুসলিম',
  'hisnul muslim',
];

const SOCIAL_KEYWORDS = [
  'facebook',
  'fb',
  'ফেসবুক',
  'facebook alternative',
  'halal facebook',
  'islamic facebook',
  'instagram',
  'insta',
  'ig',
  'ইন্সটাগ্রাম',
  'ইনস্টাগ্রাম',
  'ইন্সটা',
  'ইনস্টা',
  'halal instagram',
  'islamic instagram',
  'twitter',
  'টুইটার',
  'halal twitter',
  'social media',
  'সোশ্যাল মিডিয়া',
];

function matchesKeywordList(query: string, keywords: string[]): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  if (q.length < 2) return false;

  // Exact or contains match
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (k === q || q.includes(k) || (q.length >= 3 && k.includes(q))) {
      return true;
    }
  }

  // Token match
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    for (const kw of keywords) {
      const k = kw.toLowerCase();
      if (k === token || (token.length >= 3 && k.includes(token))) {
        return true;
      }
    }
  }

  return false;
}

export function getFeatureShortcut(query: string): FeatureShortcut | null {
  if (!query || query.trim().length < 2) return null;
  const q = query.trim().toLowerCase();

  // 1. Brand / Purpose Match
  if (matchesKeywordList(q, BRAND_KEYWORDS)) {
    return {
      id: 'brand-purpose',
      titleBn: 'PeaceTweet — আমাদের উদ্দেশ্য ও পরিচিতি',
      titleEn: 'PeaceTweet — Our Purpose & Values',
      descBn:
        'একটি শান্তিপূর্ণ, অশ্লীলতামুক্ত ও ফলপ্রসূ ইসলামিক সোশ্যাল নেটওয়ার্কের লক্ষ্য জানুন',
      descEn:
        'Learn the vision of a wholesome, peaceful Islamic social media platform',
      badgeBn: 'শান্তির মঞ্চ',
      badgeEn: 'About PeaceTweet',
      href: '/purpose',
      theme: 'primary',
      icon: 'sparkles',
    };
  }

  // 2. Blood Match
  if (matchesKeywordList(q, BLOOD_KEYWORDS)) {
    return {
      id: 'blood-donation',
      titleBn: 'রক্তদান প্ল্যাটফর্ম (Blood Donation)',
      titleEn: 'PeaceTweet Blood Donation Network',
      descBn: 'জরুরি রক্তের আবেদন করুন অথবা রক্তদাতা হিসেবে নিবন্ধন করুন',
      descEn:
        'Request emergency blood or register as a life-saving blood donor',
      badgeBn: 'জরুরি সেবা',
      badgeEn: 'Emergency',
      href: '/blood',
      theme: 'rose',
      icon: 'droplet',
    };
  }

  // 3. Duas & Categories Match
  if (matchesKeywordList(q, DUA_CATEGORY_KEYWORDS)) {
    return {
      id: 'dua-categories',
      titleBn: 'বিষয়ভিত্তিক ক্যাটাগরি ও সহীহ দোয়া',
      titleEn: 'Categorized Authentic Duas & Dhikr',
      descBn:
        'দৈনন্দিন জীবন, নামাজ, বিপদমুক্তি ও সকাল-সন্ধ্যার প্রামাণিক দোয়া খুঁজুন',
      descEn:
        'Explore authentic Quran & Sunnah Duas organized by life situations',
      badgeBn: 'দোয়া ভাণ্ডার',
      badgeEn: 'Duas',
      href: '/categories',
      theme: 'blue',
      icon: 'layers',
    };
  }

  // 4. Social Media / Facebook / Instagram Alternative Match
  if (matchesKeywordList(q, SOCIAL_KEYWORDS)) {
    return {
      id: 'social-alternative',
      titleBn: 'PeaceTweet — হালাল ফেসবুক ও সোশ্যাল প্ল্যাটফর্ম',
      titleEn: 'PeaceTweet — Halal Facebook Alternative',
      descBn:
        'অশ্লীলতামুক্ত ও নিরাপদ ইসলামিক সোশ্যাল মিডিয়ায় বন্ধুদের সাথে যুক্ত থাকুন',
      descEn:
        'Connect with a wholesome community on a peaceful Islamic social media platform',
      badgeBn: 'সোশ্যাল মিডিয়া',
      badgeEn: 'Social Media',
      href: '/',
      theme: 'primary',
      icon: 'sparkles',
    };
  }

  return null;
}
