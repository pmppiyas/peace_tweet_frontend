'use client';

import React from 'react';
import { X, Check, Clock, Trash2 } from 'lucide-react';
import { TimeSlot, TIME_SLOTS } from '@/types/saved.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';

interface TimeSlotPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot?: TimeSlot | string | null;
  onSelectSlot: (slot: TimeSlot | null) => void;
  onRemove?: () => void;
  title?: string;
  itemTitle?: string;
}

export function TimeSlotPicker({
  isOpen,
  onClose,
  selectedSlot,
  onSelectSlot,
  onRemove,
  title,
  itemTitle,
}: TimeSlotPickerProps) {
  const { locale } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                {title ||
                  (locale === 'bn'
                    ? 'পড়ার নির্দিষ্ট সময় নির্ধারণ করুন'
                    : 'Choose reading routine')}
              </h3>
              {itemTitle && (
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate max-w-[260px] sm:max-w-[340px]">
                  {itemTitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Routine Slots Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  soundEffects.playTab();
                  onSelectSlot(slot.id);
                  onClose();
                }}
                className={cn(
                  'relative flex flex-col justify-between p-3 rounded-2xl transition-all border text-left cursor-pointer active:scale-95 min-h-[92px]',
                  isSelected
                    ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                    : 'border-[#e4e6eb]/80 dark:border-[#393a3b] hover:border-primary-300 dark:hover:border-primary-700 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-2xl">{slot.icon}</span>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#050505] dark:text-white line-clamp-1">
                    {locale === 'bn' ? slot.labelBn : slot.labelEn}
                  </div>
                  <div className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">
                    {locale === 'bn' ? slot.routineBn : slot.routineEn}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Any Time / General Option */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playTab();
              onSelectSlot(null);
              onClose();
            }}
            className={cn(
              'relative flex flex-col justify-between p-3 rounded-2xl transition-all border text-left cursor-pointer active:scale-95 min-h-[92px]',
              !selectedSlot
                ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                : 'border-[#e4e6eb]/80 dark:border-[#393a3b] hover:border-primary-300 dark:hover:border-primary-700 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-2xl">🗂️</span>
              {!selectedSlot && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-[#050505] dark:text-white line-clamp-1">
                {locale === 'bn' ? 'যেকোনো সময়' : 'Anytime'}
              </div>
              <div className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">
                {locale === 'bn' ? 'সাধারণ / কোনো ওয়াক্ত ছাড়া' : 'General / No routine'}
              </div>
            </div>
          </button>
        </div>

        {onRemove && (
          <div className="mt-4 pt-3 border-t border-[#e4e6eb] dark:border-[#393a3b]">
            <button
              type="button"
              onClick={() => {
                soundEffects.playDelete();
                onRemove();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer active:scale-98"
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {locale === 'bn'
                  ? 'সংরক্ষণ তালিকা থেকে বাদ দিন'
                  : 'Remove from Saved'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TimeSlotBadge({
  timeSlot,
  onClick,
  className,
  size = 'md',
}: {
  timeSlot?: TimeSlot | string | null;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const { locale } = useLanguage();
  if (!timeSlot) return null;

  const config = TIME_SLOTS.find((s) => s.id === timeSlot);
  if (!config) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold transition-all shadow-2xs cursor-pointer hover:opacity-90 active:scale-95 select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        config.badgeBg,
        config.badgeText,
        className
      )}
      title={
        locale === 'bn'
          ? `${config.labelBn}র আমল (সময় পরিবর্তন করতে ক্লিক করুন)`
          : `${config.labelEn} routine (Click to change)`
      }
    >
      <span>{config.icon}</span>
      <span>{locale === 'bn' ? config.labelBn : config.labelEn}</span>
    </button>
  );
}
