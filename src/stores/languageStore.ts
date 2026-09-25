import { create } from 'zustand';
import { Locale, LOCALES } from '@/locales';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = 'peacetweet_locale';

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && (saved === 'en' || saved === 'bn' || saved === 'ar')) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale: Locale) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, locale);
        const dir = LOCALES[locale]?.dir || 'ltr';
        document.documentElement.lang = locale;
        document.documentElement.dir = dir;
      }
    } catch {
      // ignore
    }
    set({ locale });
  },
}));
