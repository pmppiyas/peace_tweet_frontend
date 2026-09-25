'use client';

import React from 'react';
import { FeedItem } from '../types/feed.types';

interface TextPostCardProps {
  post: FeedItem;
}

export function TextPostCard({ post }: TextPostCardProps) {
  return (
    <div className="space-y-2">
      <p className="text-[15px] sm:text-[16px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
