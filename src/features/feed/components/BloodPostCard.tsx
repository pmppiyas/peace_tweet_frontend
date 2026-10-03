'use client';

import React from 'react';
import { FeedItem } from '../types/feed.types';
import { BloodRequestCard } from '@/features/blood/components/BloodRequestCard';

interface BloodPostCardProps {
  post: FeedItem;
}

export function BloodPostCard({ post }: BloodPostCardProps) {
  const { bloodRequest, content } = post;

  if (!bloodRequest) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
        Blood request details are unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {content && (
        <p className="text-[14px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed font-medium">
          {content}
        </p>
      )}

      {/* Render Full Blood Request Card */}
      <BloodRequestCard request={bloodRequest} className="border border-red-100 dark:border-red-950/40" />
    </div>
  );
}
