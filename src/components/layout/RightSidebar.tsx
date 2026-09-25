'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';

export function RightSidebar() {
  const { t, formatNumber } = useLanguage();
  const [tasbihCount, setTasbihCount] = useState(0);
  const [activeZikrIndex, setActiveZikrIndex] = useState(0);

  const zikrs = [
    { arabic: 'سُبْحَانَ اللَّهِ', text: t('tasbih.subhanallah') },
    { arabic: 'الْحَمْدُ لِلَّهِ', text: t('tasbih.alhamdulillah') },
    { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', text: t('tasbih.lailahaillallah') },
    { arabic: 'اللَّهُ أَكْبَرُ', text: t('tasbih.allahuakbar') },
    { arabic: 'أَسْتَغْفِرُ اللَّهَ', text: t('tasbih.astaghfirullah') },
  ];

  const currentZikr = zikrs[activeZikrIndex];

  const handleTasbihClick = () => {
    if (tasbihCount + 1 >= 33) {
      setTasbihCount(0);
      setActiveZikrIndex((prev) => (prev + 1) % zikrs.length);
    } else {
      setTasbihCount((prev) => prev + 1);
    }
  };

  const trendingTopics = [
    { title: t('stories.morningEvening'), category: 'morning-evening', count: 12 },
    { title: t('stories.sleep'), category: 'sleep', count: 8 },
    { title: t('stories.distress'), category: 'distress', count: 15 },
    { title: t('stories.sustenance'), category: 'sustenance', count: 9 },
    { title: t('stories.prayer'), category: 'prayer', count: 24 },
  ];

  return (
    <aside className="hidden xl:block w-72 shrink-0 space-y-3.5 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pl-2 select-none">
      {/* 1. Interactive Digital Tasbih Widget */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{t('tasbih.title')}</span>
          </div>
          <button
            onClick={() => setTasbihCount(0)}
            className="text-[#65676b] hover:text-[#050505] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1 rounded-full transition-colors"
            title={t('tasbih.reset')}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 text-center space-y-2">
          <p className="font-arabic text-2xl font-bold text-[#050505] dark:text-emerald-300">
            {currentZikr.arabic}
          </p>
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {currentZikr.text}
          </p>

          <button
            onClick={handleTasbihClick}
            className="w-full mt-2 rounded-xl bg-emerald-600 py-2.5 text-white font-bold hover:bg-emerald-700 active:scale-98 transition-all shadow-xs"
          >
            <span className="text-xl font-bold">{formatNumber(tasbihCount)}</span>
            <span className="text-[11px] opacity-90 block font-normal">{t('tasbih.countLabel')}</span>
          </button>
        </div>
      </div>

      {/* 2. Trending Topics / Duas (Like Facebook's Sponsored / Group list) */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-2">
        <div className="flex items-center gap-1.5 pb-2 border-b border-[#e4e6eb] dark:border-[#393a3b] text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>{t('trending.title')}</span>
        </div>

        <div className="space-y-1">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.title}
              href={ROUTES.CATEGORY_DETAIL(topic.category)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                  {topic.title}
                </p>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  #{topic.category}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#65676b] dark:text-[#b0b3b8]">
                {t('trending.views', { n: formatNumber(topic.count) })}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Footer / Community Tag */}
      <div className="px-2 text-[11px] text-[#65676b] dark:text-[#b0b3b8] space-y-1">
        <p className="flex items-center gap-1 font-semibold text-[#050505] dark:text-[#e4e6eb]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>{t('trending.footerSlogan')}</span>
        </p>
        <p>© 2026 PeaceTweet</p>
      </div>
    </aside>
  );
}
