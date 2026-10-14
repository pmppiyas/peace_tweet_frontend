import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  isSearchModalOpen: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  isUploadingPost: boolean;
  uploadingMessage?: string;
  isPostUploadSuccess: boolean;
  postSuccessMessage?: string;
  isMobileComposerOpen: boolean;
  isMenuDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  setMenuDrawerOpen: (isOpen: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  setIsUploadingPost: (isUploadingPost: boolean, message?: string) => void;
  triggerPostSuccess: (message?: string) => void;
  setMobileComposerOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isSearchModalOpen: false,
  fontSize: 'normal',
  isUploadingPost: false,
  uploadingMessage: undefined,
  isPostUploadSuccess: false,
  postSuccessMessage: undefined,
  isMobileComposerOpen: false,
  isMenuDrawerOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setMenuDrawerOpen: (isMenuDrawerOpen) => set({ isMenuDrawerOpen }),
  setFontSize: (fontSize) => set({ fontSize }),
  setIsUploadingPost: (isUploadingPost, message) =>
    set({ isUploadingPost, uploadingMessage: message }),
  triggerPostSuccess: (message = 'Posted successfully!') => {
    set({ isPostUploadSuccess: true, postSuccessMessage: message });
    setTimeout(() => {
      set({ isPostUploadSuccess: false, postSuccessMessage: undefined });
    }, 4000);
  },
  setMobileComposerOpen: (isMobileComposerOpen) => set({ isMobileComposerOpen }),
}));
