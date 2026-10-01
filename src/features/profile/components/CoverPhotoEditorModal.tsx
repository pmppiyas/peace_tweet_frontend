'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Move,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export interface CoverPhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onSave: (croppedFile: File) => Promise<void> | void;
  isSaving?: boolean;
}

export function CoverPhotoEditorModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  isSaving: externalIsSaving,
}: CoverPhotoEditorModalProps) {
  const { locale } = useLanguage();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [internalIsSaving, setInternalIsSaving] = useState(false);

  const isSaving = externalIsSaving || internalIsSaving;

  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const offsetStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Convert remote image to local blob URL to prevent canvas CORS security tainting
  useEffect(() => {
    let active = true;
    let createdUrl = '';

    const prepareImage = async () => {
      if (!imageSrc) {
        setLoadedSrc(null);
        return;
      }
      if (imageSrc.startsWith('blob:') || imageSrc.startsWith('data:')) {
        setLoadedSrc(imageSrc);
        return;
      }

      try {
        const res = await fetch(imageSrc, { mode: 'cors' });
        const blob = await res.blob();
        if (active) {
          createdUrl = URL.createObjectURL(blob);
          setLoadedSrc(createdUrl);
        }
      } catch (err) {
        console.warn('Direct fetch failed, falling back to direct image URL', err);
        if (active) {
          setLoadedSrc(imageSrc);
        }
      }
    };

    if (isOpen && imageSrc) {
      prepareImage();
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, imageSrc]);

  // Track viewport container size on resize
  useEffect(() => {
    if (!isOpen) return;
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);

    return () => ro.disconnect();
  }, [isOpen, loadedSrc]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  const vw = viewportSize.width;
  const vh = viewportSize.height;
  const nw = naturalSize?.width || 1;
  const nh = naturalSize?.height || 1;

  // Base scale to cover viewport completely
  const baseScale = vw > 0 && vh > 0 ? Math.max(vw / nw, vh / nh) : 1;
  const renderedWidth = nw * baseScale * zoom;
  const renderedHeight = nh * baseScale * zoom;

  const clampOffset = useCallback(
    (x: number, y: number, z: number) => {
      if (vw <= 0 || vh <= 0) return { x: 0, y: 0 };
      const curW = nw * baseScale * z;
      const curH = nh * baseScale * z;
      const maxX = Math.max(0, (curW - vw) / 2);
      const maxY = Math.max(0, (curH - vh) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [vw, vh, nw, nh, baseScale]
  );

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Zoom control
  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(3, Math.max(1, Number(newZoom.toFixed(2))));
    setZoom(clampedZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, clampedZoom));
  };

  // Pointer drag events for smooth mouse and touch tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const targetX = offsetStartRef.current.x + deltaX;
    const targetY = offsetStartRef.current.y + deltaY;
    setOffset(clampOffset(targetX, targetY, zoom));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomStep = 0.08;
    const delta = e.deltaY < 0 ? zoomStep : -zoomStep;
    handleZoomChange(zoom + delta);
  };

  // Reset to original center & 1x zoom
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Export cropped canvas to File
  const handleSave = async () => {
    if (!imgRef.current || vw <= 0 || vh <= 0) return;
    setInternalIsSaving(true);

    try {
      // 1200 x 400 (aspect ratio 3:1) for crystal clear high-DPI rendering
      const exportWidth = 1200;
      const exportHeight = Math.round(1200 * (vh / vw));

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const scale = exportWidth / vw;
      const imgLeft = ((vw - renderedWidth) / 2 + offset.x) * scale;
      const imgTop = ((vh - renderedHeight) / 2 + offset.y) * scale;
      const imgW = renderedWidth * scale;
      const imgH = renderedHeight * scale;

      ctx.drawImage(imgRef.current, imgLeft, imgTop, imgW, imgH);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setInternalIsSaving(false);
            return;
          }
          const croppedFile = new File([blob], 'cover.jpg', {
            type: 'image/jpeg',
          });
          try {
            await onSave(croppedFile);
          } finally {
            setInternalIsSaving(false);
          }
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Failed to crop and export cover photo', err);
      setInternalIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => !isSaving && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] p-4 sm:p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              <Move className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                {locale === 'bn'
                  ? 'কভার ছবি পজিশন করুন'
                  : 'Adjust Cover Photo'}
              </h2>
              <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn'
                  ? 'ছবিটি উপরে-নিচে ড্র্যাগ করুন এবং প্রয়োজনমতো জুম করুন'
                  : 'Drag up/down to reposition and use the slider to zoom'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reposition Viewport */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 border-2 border-primary-500/40 select-none shadow-inner">
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className={cn(
              'relative w-full aspect-[3/1] min-h-[170px] sm:min-h-[220px] md:min-h-[250px] overflow-hidden select-none touch-none',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            title={
              locale === 'bn'
                ? 'পজিশন ঠিক করতে ড্র্যাগ করুন'
                : 'Drag to reposition'
            }
          >
            {loadedSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={loadedSrc}
                alt="Cover photo preview"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${renderedWidth}px`,
                  height: `${renderedHeight}px`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                className="transition-[transform] duration-75 ease-out select-none will-change-transform"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/50 gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">
                  {locale === 'bn'
                    ? 'ছবি লোড হচ্ছে...'
                    : 'Loading image...'}
                </span>
              </div>
            )}

            {/* Instruction Overlay Pill (Fades when dragging) */}
            <div
              className={cn(
                'absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold pointer-events-none transition-opacity duration-200 shadow-md',
                isDragging ? 'opacity-30' : 'opacity-90'
              )}
            >
              <Move className="h-3.5 w-3.5" />
              <span>
                {locale === 'bn'
                  ? 'পজিশন ঠিক করতে ড্র্যাগ করুন'
                  : 'Drag to reposition'}
              </span>
            </div>

            {/* Avatar Placement Reference Silhouette (Center Bottom) */}
            <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full border-2 border-dashed border-white/60 bg-black/20 backdrop-blur-[2px] flex items-center justify-center text-white/70 pointer-events-none">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center px-1">
                {locale === 'bn' ? 'প্রোফাইল' : 'Avatar'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Zoom Slider & Actions */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 border border-[#e4e6eb] dark:border-[#393a3b]">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => handleZoomChange(zoom - 0.1)}
              disabled={zoom <= 1 || isSaving}
              className="p-1 rounded-lg text-[#65676b] hover:bg-white dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                disabled={isSaving}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#e4e6eb] dark:bg-[#4e4f50] rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleZoomChange(zoom + 0.1)}
              disabled={zoom >= 3 || isSaving}
              className="p-1 rounded-lg text-[#65676b] hover:bg-white dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <span className="text-xs font-bold text-[#050505] dark:text-white min-w-[42px] text-right font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Reset Position & Zoom */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving || (zoom === 1 && offset.x === 0 && offset.y === 0)}
              className="rounded-xl px-3 py-1.5 text-xs font-bold gap-1.5 border-[#e4e6eb] dark:border-[#393a3b]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </Button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex items-center justify-end gap-2.5 pt-3 border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-4 py-2 text-xs font-bold border-[#e4e6eb] dark:border-[#393a3b]"
          >
            {locale === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !naturalSize}
            className="rounded-xl px-5 py-2 text-xs font-bold gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>
                  {locale === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                </span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>
                  {locale === 'bn' ? 'কভার সংরক্ষণ করুন' : 'Save Cover Photo'}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
