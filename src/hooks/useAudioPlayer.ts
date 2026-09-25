import { useAudioStore } from '@/stores/audioStore';

export function useAudioPlayer() {
  const store = useAudioStore();

  const isDuaPlaying = (duaId: string) => {
    return store.isPlaying && store.currentDua?.id === duaId;
  };

  const isCurrentDua = (duaId: string) => {
    return store.currentDua?.id === duaId;
  };

  return {
    ...store,
    isDuaPlaying,
    isCurrentDua,
  };
}
