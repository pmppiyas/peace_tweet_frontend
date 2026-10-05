import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  ConversationItem,
  ChatMessage,
  MessagesResponse,
} from '../types/chat.types';

export const chatApi = {
  // Get all conversations for current user
  getConversations: async (): Promise<ApiResponse<ConversationItem[]>> => {
    const { data } = await apiClient.get<ApiResponse<ConversationItem[]>>(
      API_ENDPOINTS.CHAT.CONVERSATIONS,
    );
    return data;
  },

  // Get or create conversation with a user
  getOrCreateConversation: async (
    receiverId: string,
  ): Promise<ApiResponse<ConversationItem>> => {
    const { data } = await apiClient.post<ApiResponse<ConversationItem>>(
      API_ENDPOINTS.CHAT.CONVERSATION_CREATE,
      { receiverId },
    );
    return data;
  },

  // Get paginated messages for a conversation
  getMessages: async (
    conversationId: string,
    params?: { cursor?: string; limit?: number },
  ): Promise<ApiResponse<MessagesResponse>> => {
    const { data } = await apiClient.get<ApiResponse<MessagesResponse>>(
      API_ENDPOINTS.CHAT.MESSAGES(conversationId),
      { params },
    );
    return data;
  },

  // Send message via REST endpoint
  sendMessage: async (
    receiverId: string,
    text: string,
    conversationId?: string,
  ): Promise<ApiResponse<ChatMessage>> => {
    const { data } = await apiClient.post<ApiResponse<ChatMessage>>(
      API_ENDPOINTS.CHAT.SEND_MESSAGE,
      { receiverId, text, conversationId },
    );
    return data;
  },

  // Edit message
  editMessage: async (
    messageId: string,
    text: string,
  ): Promise<ApiResponse<ChatMessage>> => {
    const { data } = await apiClient.patch<ApiResponse<ChatMessage>>(
      API_ENDPOINTS.CHAT.EDIT_MESSAGE(messageId),
      { text },
    );
    return data;
  },

  // Delete message
  deleteMessage: async (
    messageId: string,
  ): Promise<ApiResponse<ChatMessage>> => {
    const { data } = await apiClient.delete<ApiResponse<ChatMessage>>(
      API_ENDPOINTS.CHAT.DELETE_MESSAGE(messageId),
    );
    return data;
  },

  // Mark all messages as read
  markAsRead: async (
    conversationId: string,
  ): Promise<ApiResponse<{ updatedCount: number }>> => {
    const { data } = await apiClient.patch<ApiResponse<{ updatedCount: number }>>(
      API_ENDPOINTS.CHAT.MARK_READ(conversationId),
    );
    return data;
  },
};
