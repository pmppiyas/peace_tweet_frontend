'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Sparkles, Heart, ShieldAlert, Compass, Plus } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function StoryBar() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const stories = [
    {
      title: t('stories.morningEvening'),
      slug: 'morning-evening',
      icon: Sun,
      gradient: 'from-amber-500/90 via-emerald-600 to-teal-900',
      tag: 'Sabah-Masa',
    },
    {
      title: t('stories.sleep'),
      slug: 'sleep',
      icon: Moon,
      gradient: 'from-indigo-600 via-purple-700 to-slate-900',
      tag: 'Sleep',
    },
    {
      title: t('stories.prayer'),
      slug: 'prayer',
      icon: Sparkles,
      gradient: 'from-emerald-600 via-teal-700 to-cyan-900',
      tag: 'Salah',
    },
    {
      title: t('stories.sustenance'),
      slug: 'sustenance',
      icon: Heart,
      gradient: 'from-rose-600 via-pink-700 to-red-950',
      tag: 'Rizq',
    },
    {
      title: t('stories.distress'),
      slug: 'distress',
      icon: ShieldAlert,
      gradient: 'from-amber-600 via-orange-700 to-slate-900',
      tag: 'Relief',
    },
    {
      title: t('stories.travel'),
      slug: 'travel',
      icon: Compass,
      gradient: 'from-blue-600 via-cyan-700 to-sky-950',
      tag: 'Travel',
    },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
      {/* 1. Create Story / Share Reminder Card (Like Facebook's First Story Card) */}
      <Link
        href={ROUTES.CATEGORIES}
        className="relative flex flex-col justify-between w-[105px] sm:w-[120px] h-[165px] sm:h-[185px] shrink-0 rounded-xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] overflow-hidden shadow-xs hover:shadow-md transition-all group"
      >
        <div className="h-[110px] sm:h-[125px] w-full bg-gradient-to-b from-emerald-100 to-emerald-50 dark:from-emerald-950/60 dark:to-gray-800 flex items-center justify-center overflow-hidden">
          <div className="h-12 w-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            {user?.name?.charAt(0) || '🕊️'}
          </div>
        </div>

        <div className="absolute top-[90px] sm:top-[105px] left-1/2 -translate-x-1/2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white border-[3px] border-white dark:border-[#242526] shadow-sm">
            <Plus className="h-4 w-4 stroke-[3]" />
          </div>
        </div>

        <div className="p-2 pb-2.5 text-center bg-white dark:bg-[#242526]">
          <span className="text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] leading-tight block">
            Explore Duas
          </span>
        </div>
      </Link>

      {/* 2. Other Facebook Story Cards */}
      {stories.map((story) => {
        const Icon = story.icon;
        return (
          <Link
            key={story.slug}
            href={ROUTES.CATEGORY_DETAIL(story.slug)}
            className="relative flex flex-col justify-between w-[105px] sm:w-[120px] h-[165px] sm:h-[185px] shrink-0 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group hover:scale-[1.02] border border-[#e4e6eb] dark:border-[#393a3b]"
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${story.gradient} transition-transform duration-300 group-hover:scale-105`}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

            {/* Top Left Icon Ring (Like Story Avatar) */}
            <div className="relative z-10 p-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-2 border-emerald-400 text-white shadow-sm">
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Bottom Title Label */}
            <div className="relative z-10 p-2.5">
              <span className="text-[10px] font-medium text-emerald-200 block uppercase tracking-wider">
                #{story.tag}
              </span>
              <p className="text-xs sm:text-[13px] font-bold text-white leading-tight drop-shadow-sm line-clamp-2">
                {story.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
