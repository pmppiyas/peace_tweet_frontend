'use client';

import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react';

export function FloatingAudioBar() {
  const {
    currentDua,
    currentAudio,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    pause,
    resume,
    stop,
    seek,
    setPlaybackRate,
    toggleMute,
  } = useAudioPlayer();

  if (!currentDua || !currentAudio) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const speeds = [1, 1.25, 1.5, 2];
  const cycleSpeed = () => {
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="rounded-2xl border border-gray-200 bg-white/95 p-3.5 sm:p-4 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
        <div className="flex items-center justify-between gap-3">
          {/* Dua Title & Reciter */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate dark:text-gray-100">
              {currentDua.title}
            </h4>
            <p className="text-[11px] text-emerald-600 truncate dark:text-emerald-400 font-medium">
              Reciter: {currentAudio.reciterName || 'Sheikh'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Toggle */}
            <button
              onClick={cycleSpeed}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? pause : resume}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Stop/Close Button */}
            <button
              onClick={stop}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Close Player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="mt-2.5 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-emerald-600 dark:bg-gray-800"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
