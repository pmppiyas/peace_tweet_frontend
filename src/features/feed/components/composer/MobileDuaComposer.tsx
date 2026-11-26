'use client';

import React from 'react';

export interface MobileDuaComposerProps {
  duaTitle: string;
  onChangeDuaTitle: (value: string) => void;
  duaMeaning: string;
  onChangeDuaMeaning: (value: string) => void;
  duaTransliteration: string;
  onChangeDuaTransliteration: (value: string) => void;
  duaFadilah: string;
  onChangeDuaFadilah: (value: string) => void;
  locale?: string;
}

export function MobileDuaComposer({
  duaTitle,
  onChangeDuaTitle,
  duaMeaning,
  onChangeDuaMeaning,
  duaTransliteration,
  onChangeDuaTransliteration,
  duaFadilah,
  onChangeDuaFadilah,
  locale = 'bn',
}: MobileDuaComposerProps) {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {locale === 'bn' ? 'দু’আর নাম বা বিষয়' : 'Dua Title / Theme'}
        </label>
        <input
          type="text"
          value={duaTitle}
          onChange={(e) => onChangeDuaTitle(e.target.value)}
          placeholder={
            locale === 'bn'
              ? 'যেমন: অন্তরের প্রশান্তির দু’আ'
              : 'e.g. Supplication for Inner Peace'
          }
          className="w-full rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] px-3.5 py-2.5 text-sm text-[#050505] dark:text-[#e4e6eb] focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:focus:bg-[#18191a] transition-all shadow-2xs"
        />
      </div>

      {/* Meaning (Required) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn'
              ? 'বাংলা অর্থ / অনুবাদ *'
              : 'Bangla Meaning (Required) *'}
          </label>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            Required
          </span>
        </div>
        <textarea
          value={duaMeaning}
          onChange={(e) => onChangeDuaMeaning(e.target.value)}
          placeholder={
            locale === 'bn'
              ? 'দু’আটির অর্থ সুন্দরভাবে বাংলায় লিখুন...'
              : 'Write the translation / meaning...'
          }
          rows={3}
          required
          className="w-full rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] p-3 text-sm text-[#050505] dark:text-[#e4e6eb] focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:focus:bg-[#18191a] transition-all shadow-2xs leading-relaxed"
        />
      </div>

      {/* Pronunciation */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {locale === 'bn'
            ? 'বাংলা উচ্চারণ (Transliteration)'
            : 'Pronunciation in Bengali'}
        </label>
        <input
          type="text"
          value={duaTransliteration}
          onChange={(e) => onChangeDuaTransliteration(e.target.value)}
          placeholder={
            locale === 'bn'
              ? 'যেমন: আল্লাহুম্মা ইন্নি আসআলুকাল আফওয়া...'
              : 'Transliteration in Bengali'
          }
          className="w-full rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] px-3.5 py-2.5 text-sm text-[#050505] dark:text-[#e4e6eb] focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:focus:bg-[#18191a] transition-all shadow-2xs"
        />
      </div>

      {/* Virtue & Source */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {locale === 'bn'
            ? 'ফজিলত ও হাদিস রেফারেন্স'
            : 'Virtue & Hadith Reference'}
        </label>
        <input
          type="text"
          value={duaFadilah}
          onChange={(e) => onChangeDuaFadilah(e.target.value)}
          placeholder={
            locale === 'bn'
              ? 'যেমন: তিরমিযী, হাদিস নং ৩৪৫৬'
              : 'e.g. Tirmidhi Hadith #3456'
          }
          className="w-full rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] px-3.5 py-2.5 text-sm text-[#050505] dark:text-[#e4e6eb] focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:focus:bg-[#18191a] transition-all shadow-2xs"
        />
      </div>
    </div>
  );
}
