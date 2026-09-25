import { en } from './en';
import { bn } from './bn';
import { ar } from './ar';

export type Locale = 'en' | 'bn' | 'ar';

export interface LocaleInfo {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LOCALES: Record<Locale, LocaleInfo> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
  },
  bn: {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    flag: '🇧🇩',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
  },
};

export const dictionaries = {
  en,
  bn,
  ar,
} as const;

export type TranslationSchema = typeof en;

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function formatLocaleNumber(num: number | string, locale: Locale): string {
  const str = String(num);
  if (locale === 'bn') {
    return str.replace(/[0-9]/g, (w) => bnDigits[+w]);
  }
  if (locale === 'ar') {
    return str.replace(/[0-9]/g, (w) => arDigits[+w]);
  }
  return str;
}

export function getNestedTranslation(
  dict: any,
  path: string,
  params?: Record<string, string | number>,
  locale: Locale = 'en'
): string {
  const keys = path.split('.');
  let current = dict;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English dictionary if key missing in target language
      let fallback = en as any;
      for (const fKey of keys) {
        if (fallback && typeof fallback === 'object' && fKey in fallback) {
          fallback = fallback[fKey];
        } else {
          return path;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return path;
  }

  let result = current;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      const formattedVal = typeof v === 'number' ? formatLocaleNumber(v, locale) : String(v);
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), formattedVal);
    });
  }

  return result;
}
