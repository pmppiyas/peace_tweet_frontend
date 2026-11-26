'use client';

import React from 'react';
import Image from 'next/image';
import { X, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PostMediaGallery } from '../PostMediaGallery';

export interface MobileTextComposerProps {
  content: string;
  onChangeContent: (value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  mediaUrls: string[];
  mediaLayout: 'COLLAGE' | 'SWIPE';
  onChangeMediaLayout: (layout: 'COLLAGE' | 'SWIPE') => void;
  onRemoveMediaUrl: (index: number) => void;
  locale?: string;
}

export function MobileTextComposer({
  content,
  onChangeContent,
  textareaRef,
  mediaUrls,
  mediaLayout,
  onChangeMediaLayout,
  onRemoveMediaUrl,
  locale = 'bn',
}: MobileTextComposerProps) {
  return (
    <div className="space-y-4">
      {/* Borderless Open Canvas Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder={
          locale === 'bn'
            ? 'আপনার ভাবনা, কুরআন-হাদিসের সুন্দর নসিহত বা দোয়া শেয়ার করুন...'
            : "What's on your mind? Share a reflection, reminder, or story..."
        }
        rows={6}
        className="w-full resize-none border-none outline-none focus:outline-hidden focus:ring-0 bg-transparent text-[17px] sm:text-[18px] leading-relaxed text-[#050505] placeholder:text-[#8e8e93] dark:text-[#e4e6eb] dark:placeholder:text-[#6e6e73] p-0"
      />

      {/* Attached Photos Grid Preview */}
      {mediaUrls.length > 0 && (
        <div className="space-y-2.5 rounded-2xl border border-[#e4e6eb] dark:border-[#2d2e2f] p-3 bg-[#f8f9fa] dark:bg-[#1f2022]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
              {locale === 'bn'
                ? `সংযুক্ত ছবি (${mediaUrls.length}/10)`
                : `Attached Photos (${mediaUrls.length}/10)`}
            </span>
            {mediaUrls.length > 1 && (
              <div className="flex items-center gap-1 rounded-xl bg-[#e4e6eb] dark:bg-[#2d2e2f] p-0.5">
                <button
                  type="button"
                  onClick={() => onChangeMediaLayout('COLLAGE')}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
                    mediaLayout === 'COLLAGE'
                      ? 'bg-white text-primary-600 shadow-xs dark:bg-[#18191a] dark:text-primary-300'
                      : 'text-[#65676b] dark:text-[#b0b3b8]'
                  )}
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span>Collage</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMediaLayout('SWIPE')}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
                    mediaLayout === 'SWIPE'
                      ? 'bg-white text-primary-600 shadow-xs dark:bg-[#18191a] dark:text-primary-300'
                      : 'text-[#65676b] dark:text-[#b0b3b8]'
                  )}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Swipe</span>
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {mediaUrls.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-xs"
              >
                <Image
                  src={url}
                  alt={`Attachment ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => onRemoveMediaUrl(idx)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="h-3 w-3 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>

          {/* Live Collage / Swipe Gallery Preview */}
          {mediaUrls.length > 1 && (
            <PostMediaGallery
              mediaUrls={mediaUrls}
              layout={mediaLayout}
            />
          )}
        </div>
      )}
    </div>
  );
}
