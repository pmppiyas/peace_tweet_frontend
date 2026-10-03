'use client';

import React from 'react';
import { FeedItem } from '../types/feed.types';
import { PostMediaGallery } from './PostMediaGallery';

interface TextPostCardProps {
  post: FeedItem;
}

export function TextPostCard({ post }: TextPostCardProps) {
  const images = post.mediaUrls || [];

  return (
    <div className="space-y-3">
      {post.content && (
        <p className="text-[15px] sm:text-[16px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      )}

      {/* Multi-Photo Interactive Gallery (Collage / Slide) */}
      {images.length > 0 && (
        <PostMediaGallery mediaUrls={images} layout={post.mediaLayout} />
      )}
    </div>
  );
}
