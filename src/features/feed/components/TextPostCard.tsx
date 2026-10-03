'use client';

import React, { useState } from 'react';
import { FeedItem } from '../types/feed.types';
import { cn } from '@/lib/utils/cn';

interface TextPostCardProps {
  post: FeedItem;
}

export function TextPostCard({ post }: TextPostCardProps) {
  const images = post.mediaUrls || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {post.content && (
        <p className="text-[15px] sm:text-[16px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      )}

      {/* Photo Gallery Grid */}
      {images.length > 0 && (
        <div
          className={cn(
            'overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] grid gap-1',
            images.length === 1 && 'grid-cols-1 max-h-[500px]',
            images.length === 2 && 'grid-cols-2 max-h-[400px]',
            images.length === 3 && 'grid-cols-2 max-h-[420px]',
            images.length >= 4 && 'grid-cols-2 max-h-[420px]',
          )}
        >
          {images.slice(0, 4).map((url, idx) => {
            const isRemaining = idx === 3 && images.length > 4;
            const remainingCount = images.length - 4;

            return (
              <div
                key={idx}
                onClick={() => setSelectedImage(url)}
                className={cn(
                  'relative cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800 transition-transform duration-200 hover:opacity-95',
                  images.length === 1 && 'h-[320px] sm:h-[420px]',
                  images.length === 2 && 'h-[220px] sm:h-[280px]',
                  images.length === 3 && idx === 0 && 'row-span-2 h-[300px] sm:h-[360px]',
                  images.length === 3 && idx > 0 && 'h-[148px] sm:h-[178px]',
                  images.length >= 4 && 'h-[150px] sm:h-[180px]',
                )}
              >
                <img
                  src={url}
                  alt={`Post attachment ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {isRemaining && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-2xl font-black backdrop-blur-xs">
                    +{remainingCount + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-150"
        >
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
