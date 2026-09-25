'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Locale,
  LOCALES,
  LocaleInfo,
  dictionaries,
  getNestedTranslation,
  formatLocaleNumber,
} from '@/locales';
import { useLanguageStore } from '@/stores/languageStore';

interface LanguageContextType {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  currentLocaleInfo: LocaleInfo;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatNumber: (n: number | string) => string;
  availableLocales: LocaleInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dir = LOCALES[locale]?.dir || 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const activeLocale = mounted ? locale : 'en';
  const dir = LOCALES[activeLocale]?.dir || 'ltr';
  const isRTL = dir === 'rtl';
  const currentLocaleInfo = LOCALES[activeLocale];

  const value = useMemo(() => {
    const dict = dictionaries[activeLocale] || dictionaries.en;

    const t = (path: string, params?: Record<string, string | number>): string => {
      return getNestedTranslation(dict, path, params, activeLocale);
    };

    const formatNumber = (n: number | string): string => {
      return formatLocaleNumber(n, activeLocale);
    };

    const availableLocales = Object.values(LOCALES);

    return {
      locale: activeLocale,
      dir,
      isRTL,
      currentLocaleInfo,
      setLocale,
      t,
      formatNumber,
      availableLocales,
    };
  }, [activeLocale, dir, isRTL, currentLocaleInfo, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
