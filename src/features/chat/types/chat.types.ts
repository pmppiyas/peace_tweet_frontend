export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  badge?: string | null;
  userStatus?: string;
}

export interface ConversationItem {
  id: string;
  participantOneId?: string;
  participantTwoId?: string;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  otherUser?: ChatUser;
  participant?: ChatUser;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  readAt: string | null;
  isEdited?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
}

export interface MessagesResponse {
  messages: ChatMessage[];
  items?: ChatMessage[];
  nextCursor: string | null;
  hasMore?: boolean;
}

export interface ActiveChat {
  conversationId: string;
  user: ChatUser;
  isMinimized: boolean;
}

export interface TypingState {
  senderId: string;
  senderName?: string;
  isTyping: boolean;
}
