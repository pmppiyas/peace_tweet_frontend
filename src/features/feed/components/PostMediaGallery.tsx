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

/* ──────────────────────────── SINGLE PHOTO ──────────────────────────── */

function SinglePhotoView({ src }: { src: string }) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    } else {
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
      };
    }
  }, [src]);

  // Clamp aspect ratio between 0.75 (3:4 portrait) and 1.85 (landscape)
  const clampedAspect = aspectRatio
    ? Math.max(0.75, Math.min(aspectRatio, 1.85))
    : undefined;

  return (
    <div
      style={clampedAspect ? { aspectRatio: clampedAspect } : undefined}
      className="relative w-full overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] dark:bg-[#18191a] min-h-[260px] max-h-[520px] sm:max-h-[560px]"
    >
      <img
        src={src}
        alt="Post photo"
        className="h-full w-full object-cover object-center"
        loading="lazy"
      />
    </div>
  );
}

/* ──────────────────────────── COLLAGE ──────────────────────────── */

function Tile({
  src,
  alt,
  className,
  overlay,
}: {
  src: string;
  alt: string;
  className?: string;
  overlay?: number;
}) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center"
        loading="lazy"
      />
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
    return <SinglePhotoView src={images[0]} />;
  }

  return (
    <div
      className={cn(
        'grid gap-1 overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] dark:bg-[#18191a]',
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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!images[0]) return;
    const img = new window.Image();
    img.src = images[0];
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    } else {
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
      };
    }
  }, [images]);

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

  // Clamp aspect ratio between 0.75 (3:4 portrait) and 1.85 (landscape)
  // This allows the height to responsively adjust to the photo, without becoming extreme tall
  const clampedAspect = aspectRatio
    ? Math.max(0.75, Math.min(aspectRatio, 1.85))
    : undefined;

  return (
    <div
      style={clampedAspect ? { aspectRatio: clampedAspect } : undefined}
      className="relative w-full overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] dark:bg-[#18191a] min-h-[260px] max-h-[520px] sm:max-h-[560px] select-none"
    >
      {/* Swipe track (native scroll-snap: works with touch, trackpad and mouse wheel) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative h-full w-full shrink-0 snap-center flex items-center justify-center overflow-hidden"
          >
            {/* Ambient blurred backdrop for soft visual depth */}
            <img
              src={url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
            />
            <img
              src={url}
              alt={`Photo ${idx + 1}`}
              draggable={false}
              className="relative z-10 h-full w-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white z-20 backdrop-blur-xs">
        {current + 1} / {total}
      </div>

      {/* Arrows (desktop) */}
      {current > 0 && (
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-all z-20 cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {current < total - 1 && (
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-all z-20 cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all cursor-pointer',
              idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            )}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
