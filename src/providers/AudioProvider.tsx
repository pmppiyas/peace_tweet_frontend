'use client';

import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/audioStore';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentAudio,
    isPlaying,
    currentTime,
    volume,
    playbackRate,
    isMuted,
    pause,
    setDuration,
    setCurrentTime,
  } = useAudioStore();

  // Handle source and play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentAudio?.audioUrl) {
      if (audioRef.current.src !== currentAudio.audioUrl) {
        audioRef.current.src = currentAudio.audioUrl;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.warn('Audio play prevented or interrupted:', e);
          pause();
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [currentAudio, isPlaying, pause]);

  // Handle playback rate & volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [playbackRate, volume, isMuted]);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          pause();
        }}
      />
      {children}
    </>
  );
}

export const useAudio = useAudioStore;

