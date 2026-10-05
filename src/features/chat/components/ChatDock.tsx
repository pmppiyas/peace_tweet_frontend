'use client';

import React from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { ChatBox } from './ChatBox';

export function ChatDock() {
  const { isAuthenticated } = useAuth();
  const activeChats = useChatStore((state) => state.activeChats);

  if (!isAuthenticated || activeChats.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-14 md:bottom-0 right-2 sm:right-6 z-50 flex items-end gap-2 sm:gap-3 pointer-events-none max-w-[100vw] overflow-x-hidden">
      {activeChats.map((activeChat) => (
        <div key={activeChat.user.id} className="pointer-events-auto">
          <ChatBox activeChat={activeChat} />
        </div>
      ))}
    </div>
  );
}
