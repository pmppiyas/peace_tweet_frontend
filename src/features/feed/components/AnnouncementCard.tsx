'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';
import { FeedItem } from '../types/feed.types';

interface AnnouncementCardProps {
  post: FeedItem;
}

export function AnnouncementCard({ post }: AnnouncementCardProps) {
  return (
    <div className="space-y-3 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300">
        <Megaphone className="h-3.5 w-3.5" />
        <span>ঘোষণা (Announcement)</span>
      </div>

      <p className="text-[15px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
