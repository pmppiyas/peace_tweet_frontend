import { create } from 'zustand';
import { ActiveChat, ChatUser, TypingState } from '@/features/chat/types/chat.types';

interface ChatStoreState {
  activeChats: ActiveChat[];
  onlineUserIds: Set<string>;
  typingMap: Record<string, TypingState>;
  isMessengerDropdownOpen: boolean;
  currentActiveConversationId: string | null;

  openChat: (user: ChatUser, conversationId?: string) => void;
  closeChat: (identifier: string) => void;
  toggleMinimize: (identifier: string) => void;
  setOnlineUserIds: (ids: string[]) => void;
  setUserOnlineStatus: (userId: string, isOnline: boolean) => void;
  isUserOnline: (userId?: string) => boolean;
  setTyping: (conversationId: string, typing: TypingState) => void;
  setIsMessengerDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentActiveConversationId: (id: string | null) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  activeChats: [],
  onlineUserIds: new Set<string>(),
  typingMap: {},
  isMessengerDropdownOpen: false,
  currentActiveConversationId: null,

  openChat: (user: ChatUser, conversationId?: string) => {
    set((state) => {
      // Find existing chat by conversationId or user.id
      const existingIndex = state.activeChats.findIndex(
        (c) =>
          (conversationId && c.conversationId === conversationId) ||
          c.user.id === user.id,
      );

      if (existingIndex !== -1) {
        const updated = [...state.activeChats];
        const existing = updated[existingIndex];
        // Move to top/focused and unminimize
        updated.splice(existingIndex, 1);
        updated.push({
          ...existing,
          conversationId: conversationId || existing.conversationId,
          user: { ...existing.user, ...user },
          isMinimized: false,
        });
        return { activeChats: updated };
      }

      // Max 3 floating chat boxes at a time on desktop
      const newChats = [...state.activeChats];
      if (newChats.length >= 3) {
        newChats.shift(); // Remove oldest
      }

      newChats.push({
        conversationId: conversationId || `temp_${user.id}`,
        user,
        isMinimized: false,
      });

      return { activeChats: newChats };
    });
  },

  closeChat: (identifier: string) => {
    set((state) => ({
      activeChats: state.activeChats.filter(
        (c) => c.conversationId !== identifier && c.user.id !== identifier,
      ),
    }));
  },

  toggleMinimize: (identifier: string) => {
    set((state) => ({
      activeChats: state.activeChats.map((c) => {
        if (c.conversationId === identifier || c.user.id === identifier) {
          return { ...c, isMinimized: !c.isMinimized };
        }
        return c;
      }),
    }));
  },

  setOnlineUserIds: (ids: string[]) => {
    set({ onlineUserIds: new Set(ids) });
  },

  setUserOnlineStatus: (userId: string, isOnline: boolean) => {
    set((state) => {
      const next = new Set(state.onlineUserIds);
      if (isOnline) {
        next.add(userId);
      } else {
        next.delete(userId);
      }
      return { onlineUserIds: next };
    });
  },

  isUserOnline: (userId?: string) => {
    if (!userId) return false;
    return get().onlineUserIds.has(userId);
  },

  setTyping: (conversationId: string, typing: TypingState) => {
    set((state) => ({
      typingMap: {
        ...state.typingMap,
        [conversationId]: typing,
      },
    }));
  },

  setIsMessengerDropdownOpen: (open) => {
    set((state) => ({
      isMessengerDropdownOpen:
        typeof open === 'function' ? open(state.isMessengerDropdownOpen) : open,
    }));
  },

  setCurrentActiveConversationId: (id) => {
    set({ currentActiveConversationId: id });
  },
}));
