import { create } from 'zustand';
import { Dua, DuaAudio } from '@/types/dua.types';

interface AudioState {
  currentDua: Dua | null;
  currentAudio: DuaAudio | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;

  play: (dua: Dua, audio: DuaAudio) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentDua: null,
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  volume: 1,
  isMuted: false,

  play: (dua, audio) => {
    set({
      currentDua: dua,
      currentAudio: audio,
      isPlaying: true,
      currentTime: 0,
      duration: audio.duration || 0,
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () =>
    set({
      currentDua: null,
      currentAudio: null,
      isPlaying: false,
      currentTime: 0,
    }),
  seek: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
