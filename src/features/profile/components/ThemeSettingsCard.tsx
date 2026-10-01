'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Sun, Moon, Type, Palette } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useUiStore } from '@/stores/uiStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useUiStore();
  const { locale } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Theme Appearance Card */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
        <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
                {locale === 'bn' ? 'থিম ও প্রদর্শন' : 'Theme & Appearance'}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'bn'
                  ? 'আপনার পছন্দমতো লাইট অথবা ডার্ক মোড বেছে নিন'
                  : 'Choose between Light and Dark mode for optimal viewing'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition-all',
                theme === 'light'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-2xs ring-2 ring-primary-500/20'
                  : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#242526] shadow-xs text-amber-500">
                <Sun className="h-5 w-5" />
              </div>
              <span className="text-sm">{locale === 'bn' ? 'লাইট মোড' : 'Light Mode'}</span>
              <span className="text-[11px] font-normal text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn' ? 'স্বাভাবিক উজ্জ্বল লুক' : 'Clean & bright appearance'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition-all',
                theme === 'dark'
                  ? 'border-primary-500 bg-[#3a3b3c] text-primary-400 shadow-2xs ring-2 ring-primary-500/20'
                  : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#242526] shadow-xs text-blue-400">
                <Moon className="h-5 w-5" />
              </div>
              <span className="text-sm">{locale === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</span>
              <span className="text-[11px] font-normal text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn' ? 'চোখের জন্য আরামদায়ক' : 'Comfortable for eyes at night'}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Arabic Font Size Card */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
        <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Type className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
                {locale === 'bn' ? 'আরবি ফন্ট সাইজ' : 'Arabic Dua Font Size'}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'bn'
                  ? 'দোয়া ও আরবি আয়াতের ফন্ট সাইজ নিজের সুবিধামতো পরিবর্তন করুন'
                  : 'Adjust Arabic calligraphy text size for comfortable reading'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            {(['normal', 'large', 'extra-large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={cn(
                  'rounded-xl border py-2.5 px-2 text-xs font-bold transition-all capitalize text-center',
                  fontSize === size
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300 shadow-2xs ring-2 ring-primary-500/20'
                    : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
                )}
              >
                {size === 'normal'
                  ? locale === 'bn' ? 'স্বাভাবিক (Normal)' : 'Normal'
                  : size === 'large'
                    ? locale === 'bn' ? 'বড় (Large)' : 'Large'
                    : locale === 'bn' ? 'অনেক বড় (X-Large)' : 'Extra Large'}
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] space-y-2 text-center">
            <p className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
              {locale === 'bn' ? 'লাইভ প্রিভিউ' : 'Live Preview'}
            </p>
            <p
              dir="rtl"
              className={cn(
                'font-amiri font-bold text-primary-700 dark:text-primary-300 leading-relaxed transition-all',
                fontSize === 'normal' && 'text-xl',
                fontSize === 'large' && 'text-2xl',
                fontSize === 'extra-large' && 'text-3xl'
              )}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।'
                : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
