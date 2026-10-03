/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type MediaLayout = 'COLLAGE' | 'SWIPE';

interface PostMediaGalleryProps {
  mediaUrls: string[];
  /** Layout chosen by the author when posting. Defaults to COLLAGE. */
  layout?: MediaLayout | string | null;
}

export function PostMediaGallery({ mediaUrls, layout }: PostMediaGalleryProps) {
  const images = mediaUrls.filter((url) => Boolean(url && url.trim()));
  const total = images.length;

  if (total === 0) return null;

  return layout === 'SWIPE' && total > 1 ? (
    <SwipeView images={images} />
  ) : (
    <CollageView images={images} />
  );
}

/* ──────────────────────────── COLLAGE ──────────────────────────── */

function Tile({ src, alt, className, overlay }: { src: string; alt: string; className?: string; overlay?: number }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      {overlay !== undefined && overlay > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <span className="text-2xl sm:text-3xl font-black">+{overlay}</span>
        </div>
      )}
    </div>
  );
}

function CollageView({ images }: { images: string[] }) {
  const total = images.length;

  if (total === 1) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-gray-100 dark:bg-gray-800">
        <img src={images[0]} alt="Post photo" className="max-h-[480px] w-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-1 overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-gray-100 dark:bg-gray-800',
        total === 2 && 'grid-cols-2 h-[260px] sm:h-[340px]',
        total >= 3 && 'grid-cols-2 grid-rows-2 h-[280px] sm:h-[380px]'
      )}
    >
      {total === 2 && (
        <>
          <Tile src={images[0]} alt="Photo 1" />
          <Tile src={images[1]} alt="Photo 2" />
        </>
      )}

      {total === 3 && (
        <>
          <Tile src={images[0]} alt="Photo 1" className="row-span-2" />
          <Tile src={images[1]} alt="Photo 2" />
          <Tile src={images[2]} alt="Photo 3" />
        </>
      )}

      {total >= 4 &&
        [0, 1, 2, 3].map((idx) => (
          <Tile
            key={idx}
            src={images[idx]}
            alt={`Photo ${idx + 1}`}
            overlay={idx === 3 ? total - 4 : undefined}
          />
        ))}
    </div>
  );
}

/* ──────────────────────────── SWIPE ──────────────────────────── */

function SwipeView({ images }: { images: string[] }) {
  const total = images.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Keep the index valid if images are removed (e.g. in the composer preview)
  useEffect(() => {
    if (current > total - 1) setCurrent(Math.max(total - 1, 0));
  }, [current, total]);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== current) setCurrent(Math.min(Math.max(idx, 0), total - 1));
  };

  const goTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.min(Math.max(idx, 0), total - 1);
    el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-black select-none">
      {/* Swipe track (native scroll-snap: works with touch, trackpad and mouse wheel) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-[300px] sm:h-[420px] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative h-full w-full shrink-0 snap-center flex items-center justify-center"
          >
            <img
              src={url}
              alt={`Photo ${idx + 1}`}
              draggable={false}
              className="h-full w-full object-contain"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
        {current + 1} / {total}
      </div>

      {/* Arrows (desktop) */}
      {current > 0 && (
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-all"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {current < total - 1 && (
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-all"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            )}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
