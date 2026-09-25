import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  isSearchModalOpen: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isSearchModalOpen: false,
  fontSize: 'normal',

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setFontSize: (fontSize) => set({ fontSize }),
}));
