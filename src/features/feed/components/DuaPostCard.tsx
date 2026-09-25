'use client';

import React from 'react';
import Link from 'next/link';
import { FeedItem } from '../types/feed.types';
import { DuaContent } from '@/features/dua/components/DuaContent';
import { ROUTES } from '@/constants/routes';

interface DuaPostCardProps {
  post: FeedItem;
}

export function DuaPostCard({ post }: DuaPostCardProps) {
  const { dua, content } = post;

  return (
    <div className="space-y-3">
      {/* Optional Editorial/Author note above Dua */}
      {content && (
        <p className="text-[14px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed">
          {content}
        </p>
      )}

      {/* Dua Title Header */}
      {dua && (
        <div className="space-y-2.5">
          <Link
            href={ROUTES.DUA_DETAIL(dua.id)}
            className="group block"
          >
            <h2 className="text-[16px] sm:text-[17px] font-bold text-[#050505] group-hover:text-emerald-700 dark:text-[#e4e6eb] dark:group-hover:text-emerald-400 transition-colors">
              🌙 {dua.title}
            </h2>
          </Link>

          {/* Composed Reusable Dua Content */}
          <DuaContent dua={dua} showArabicCollapsible={true} />
        </div>
      )}
    </div>
  );
}
