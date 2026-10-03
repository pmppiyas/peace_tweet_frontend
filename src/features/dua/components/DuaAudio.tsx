'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { DuaAudio as DuaAudioType } from '@/types/dua.types';
import { cn } from '@/lib/utils/cn';

interface DuaAudioProps {
  duaId: string;
  duaTitle: string;
  audio?: DuaAudioType | null;
  audioUrl?: string | null;
  arabicText?: string | null;
  className?: string;
}

export function DuaAudio({
  duaId,
  duaTitle,
  audio,
  audioUrl,
  arabicText,
  className,
}: DuaAudioProps) {
  const { isPlaying, currentDua, play, pause, resume } = useAudioPlayer();

  const effectiveUrl = audio?.audioUrl || audioUrl;
  if (!effectiveUrl) return null;

  const isCurrentPlaying = isPlaying && currentDua?.id === duaId;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaying) {
      pause();
    } else if (currentDua?.id === duaId) {
      resume();
    } else {
      play(
        {
          id: duaId,
          title: duaTitle,
          arabicText: arabicText || '',
          fadilah: '',
          transliteration: '',
          meaningBangla: '',
          categoryId: '',
          createdById: '',
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any,
        {
          id: audio?.id || `audio-${duaId}`,
          duaId: duaId,
          audioUrl: effectiveUrl,
          reciterName: audio?.reciterName || 'Islamic Reciter',
          duration: audio?.duration || 0,
          language: audio?.language || 'ar',
          verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlayToggle}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[#e4e6eb] bg-white px-3 py-1 text-xs font-semibold shadow-2xs transition-all hover:border-primary-500 hover:text-primary-600 dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:border-primary-500',
        isCurrentPlaying
          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300'
          : 'text-[#050505]',
        className,
      )}
      title={isCurrentPlaying ? 'অডিও থামান' : 'তেলাওয়াত শুনুন'}
    >
      {isCurrentPlaying ? (
        <Pause className="h-3.5 w-3.5 fill-current text-primary-500" />
      ) : (
        <Play className="h-3.5 w-3.5 fill-current text-primary-500" />
      )}
      <span>{isCurrentPlaying ? 'অডিও থামান' : 'তেলাওয়াত শুনুন'}</span>
      {audio?.reciterName && (
        <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] font-normal">
          ({audio.reciterName})
        </span>
      )}
    </button>
  );
}
