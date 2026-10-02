'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';
import { FeedItem } from '../types/feed.types';
import { useLanguage } from '@/providers/LanguageProvider';

interface AnnouncementCardProps {
  post: FeedItem;
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-3 rounded-xl bg-primary-50/50 p-4 border border-primary-100 dark:bg-primary-900/20 dark:border-primary-800/40">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-800/80 dark:text-primary-300">
        <Megaphone className="h-3.5 w-3.5" />
        <span>{locale === 'bn' ? 'ঘোষণা' : 'Announcement'}</span>
      </div>

      <p className="text-[15px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
