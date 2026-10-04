import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  isSearchModalOpen: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  isUploadingPost: boolean;
  uploadingMessage?: string;
  isPostUploadSuccess: boolean;
  postSuccessMessage?: string;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  setIsUploadingPost: (isUploadingPost: boolean, message?: string) => void;
  triggerPostSuccess: (message?: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isSearchModalOpen: false,
  fontSize: 'normal',
  isUploadingPost: false,
  uploadingMessage: undefined,
  isPostUploadSuccess: false,
  postSuccessMessage: undefined,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setFontSize: (fontSize) => set({ fontSize }),
  setIsUploadingPost: (isUploadingPost, message) =>
    set({ isUploadingPost, uploadingMessage: message }),
  triggerPostSuccess: (message = 'Posted successfully!') => {
    set({ isPostUploadSuccess: true, postSuccessMessage: message });
    setTimeout(() => {
      set({ isPostUploadSuccess: false, postSuccessMessage: undefined });
    }, 4000);
  },
}));
