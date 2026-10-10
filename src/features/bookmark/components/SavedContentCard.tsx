'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Clock,
  Trash2,
  Volume2,
  VolumeX,
  BookOpen,
  Share2,
} from 'lucide-react';
import { SavedFeedItem, TimeSlot } from '@/types/saved.types';
import { TimeSlotBadge, TimeSlotPicker } from './TimeSlotPicker';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';

interface SavedContentCardProps {
  item: SavedFeedItem;
  onUpdateSlot: (id: string, type: 'DUA' | 'POST', slot: TimeSlot | null) => void;
  onRemove: (id: string, type: 'DUA' | 'POST') => void;
}

export function SavedContentCard({
  item,
  onUpdateSlot,
  onRemove,
}: SavedContentCardProps) {
  const { locale } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const dua = item.dua;
  const isDuaItem =
    item.savedType === 'DUA' ||
    (item.type === 'DUA' && (!item.content || item.content === dua?.meaning));

  const meaning = dua?.meaningBangla || dua?.meaning || item.content;
  const arabicText = dua?.arabicText;
  const transliteration = dua?.transliteration;
  const audioUrl = dua?.audioUrl || dua?.audios?.[0]?.audioUrl;
  const categoryName = dua?.category?.name;

  const handleCopy = () => {
    const parts: string[] = [];
    if (dua?.title) parts.push(`🌙 ${dua.title}`);
    if (arabicText) parts.push(arabicText);
    if (transliteration) parts.push(`উচ্চারণ: ${transliteration}`);
    if (meaning) parts.push(`অর্থ: ${meaning}`);

    navigator.clipboard.writeText(parts.join('\n\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleAudio = () => {
    if (!audioUrl) return;
    if (!audioElement) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      setAudioElement(audio);
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play();
        setIsPlayingAudio(true);
      }
    }
  };

  const itemType: 'DUA' | 'POST' = item.savedType === 'DUA' ? 'DUA' : 'POST';

  return (
    <article className="rounded-2xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] transition-all hover:border-primary-200 dark:hover:border-primary-900/60">
      {/* 1. Header with Routine Slot & Action Buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e4e6eb]/80 dark:border-[#393a3b]/80 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {item.timeSlot ? (
            <TimeSlotBadge
              timeSlot={item.timeSlot}
              onClick={() => setIsPickerOpen(true)}
              size="md"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'রুটিন নির্ধারণ' : 'Set Routine'}</span>
            </button>
          )}

          {categoryName && (
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/50 px-2.5 py-0.5 rounded-full">
              #{categoryName}
            </span>
          )}
        </div>

        {/* Action Buttons: Audio, Copy, Change Slot, Delete */}
        <div className="flex items-center gap-1">
          {audioUrl && (
            <button
              type="button"
              onClick={toggleAudio}
              className={cn(
                'p-1.5 rounded-xl transition-colors cursor-pointer',
                isPlayingAudio
                  ? 'bg-primary-500 text-white'
                  : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
              )}
              title={isPlayingAudio ? 'অডিও থামান' : 'তেলাওয়াত শুনুন'}
            >
              {isPlayingAudio ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
            title={isCopied ? 'কপি হয়েছে!' : 'কপি করুন'}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="p-1.5 rounded-xl text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
            title={locale === 'bn' ? 'সময় পরিবর্তন' : 'Change Routine'}
          >
            <Clock className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playDelete();
              onRemove(item.id, itemType);
            }}
            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title={locale === 'bn' ? 'সংরক্ষণ তালিকা থেকে মুছুন' : 'Remove from Saved'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Dua Content Body */}
      <div className="pt-3 space-y-3">
        {dua?.title && (
          <h3 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] leading-snug">
            🌙 {dua.title}
          </h3>
        )}

        {/* Arabic Text */}
        {arabicText && (
          <p
            dir="rtl"
            className="font-arabic text-xl sm:text-2xl text-right text-[#050505] dark:text-primary-200 leading-loose select-text tracking-wide pt-1"
          >
            {arabicText}
          </p>
        )}

        {/* Transliteration (উচ্চারণ) */}
        {transliteration && (
          <div className="rounded-xl bg-[#f0f2f5]/60 dark:bg-[#3a3b3c]/40 p-2.5 text-xs sm:text-sm text-[#4b4f56] dark:text-[#b0b3b8] italic select-text leading-relaxed">
            “{transliteration}”
          </div>
        )}

        {/* Meaning (অর্থ) */}
        {meaning && (
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 block">
              {locale === 'bn' ? 'অর্থ:' : 'Meaning:'}
            </span>
            <p className="text-sm sm:text-base font-medium text-[#050505] dark:text-[#e4e6eb] leading-relaxed select-text">
              {meaning}
            </p>
          </div>
        )}

        {/* Fadilah or References */}
        {dua?.fadilah && (
          <div className="text-xs text-[#65676b] dark:text-[#b0b3b8] pt-1">
            <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
              {locale === 'bn' ? 'ফযিলত: ' : 'Benefit: '}
            </span>
            {dua.fadilah}
          </div>
        )}

        {dua?.references && dua.references.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span>
              {dua.references.map((r) => r.reference || r.source?.name).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Routine Time Slot Picker Modal */}
      <TimeSlotPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedSlot={item.timeSlot}
        onSelectSlot={(slot) => {
          onUpdateSlot(item.id, itemType, slot);
          setIsPickerOpen(false);
        }}
        onRemove={() => {
          onRemove(item.id, itemType);
          setIsPickerOpen(false);
        }}
        itemTitle={dua?.title || meaning?.slice(0, 40)}
      />
    </article>
  );
}
