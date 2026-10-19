'use client';

import React from 'react';
import { FeedItem } from '../types/feed.types';
import { PostMediaGallery } from './PostMediaGallery';

import { PostContent } from './PostContent';

interface TextPostCardProps {
  post: FeedItem;
}

export function TextPostCard({ post }: TextPostCardProps) {
  const images = post.mediaUrls || [];

  return (
    <div className="space-y-3 sm:space-y-3.5">
      {post.content && <PostContent content={post.content} />}

      {/* Multi-Photo Interactive Gallery (Collage / Slide) */}
      {images.length > 0 && (
        <PostMediaGallery mediaUrls={images} layout={post.mediaLayout} />
      )}
    </div>
  );
}
