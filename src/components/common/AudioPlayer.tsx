'use client';

import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Dua, DuaAudio } from '@/types/dua.types';
import { Button } from '../ui/Button';
import { Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AudioPlayerProps {
  dua: Dua;
  audio?: DuaAudio;
  variant?: 'inline' | 'button' | 'icon';
  className?: string;
}

export function AudioPlayer({
  dua,
  audio,
  variant = 'button',
  className,
}: AudioPlayerProps) {
  const { isPlaying, currentDua, currentAudio, play, pause, resume } = useAudioPlayer();

  const selectedAudio = audio || dua.audios?.[0];

  if (!selectedAudio?.audioUrl) {
    return null;
  }

  const isThisAudioPlaying =
    isPlaying && currentDua?.id === dua.id && currentAudio?.id === selectedAudio.id;
  const isThisDuaSelected = currentDua?.id === dua.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisAudioPlaying) {
      pause();
    } else if (isThisDuaSelected && currentAudio?.id === selectedAudio.id) {
      resume();
    } else {
      play(dua, selectedAudio);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
          isThisAudioPlaying
            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
            : 'bg-emerald-50 text-brand-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300',
          className,
        )}
        title={isThisAudioPlaying ? 'অডিও বিরতি দিন' : 'তিলাওয়াত শুনুন'}
      >
        {isThisAudioPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current translate-x-0.5" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={isThisAudioPlaying ? 'primary' : 'secondary'}
      size="sm"
      onClick={handleToggle}
      className={cn('gap-2 rounded-xl text-xs font-medium', className)}
    >
      {isThisAudioPlaying ? (
        <>
          <Pause className="h-3.5 w-3.5 fill-current" />
          <span>থামুন</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          <span>তিলাওয়াত শুনুন</span>
        </>
      )}
    </Button>
  );
}
