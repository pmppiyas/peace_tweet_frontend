'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Locale } from '@/locales';
import { cn } from '@/lib/utils/cn';

interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
  description: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
    description: 'Read Islamic Duas and prayers in authentic English translation.',
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    flag: '🇧🇩',
    description: 'সহজ ও প্রাঞ্জল বাংলা উচ্চারণ ও অর্থসহ সকল দোয়াসমূহ।',
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    flag: '🇸🇦',
    description: 'تصفح الأدعية القرآنية والنبوية الشريفة باللغة العربية.',
  },
];

export function LanguageSettingsCard() {
  const { locale, setLocale } = useLanguage();

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Language Preferences'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার পছন্দের ভাষায় অ্যাপ্লিকেশনের কনটেন্ট দেখুন'
                : 'Select your preferred language for PeaceTweet interface and content'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5 space-y-3">
        {LANGUAGE_OPTIONS.map((item) => {
          const isSelected = locale === item.code;

          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLocale(item.code)}
              className={cn(
                'w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 dark:border-primary-700/80 shadow-2xs ring-2 ring-primary-500/20'
                  : 'border-[#e4e6eb] bg-[#f0f2f5]/50 hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c]/50 dark:hover:bg-[#3a3b3c]'
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-2xl select-none shrink-0">{item.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#050505] dark:text-white">
                      {item.nativeLabel}
                    </p>
                    <span className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                      ({item.label})
                    </span>
                  </div>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs ml-2">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
