import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  CreatePostInput,
  FeedFilters,
  FeedItem,
  FeedResponse,
  PostComment,
  UpdatePostInput,
} from '../types/feed.types';

export const feedApi = {
  /**
   * Fetch public feed with cursor pagination and optional type filter
   */
  getFeed: async (params?: FeedFilters): Promise<ApiResponse<FeedResponse>> => {
    const { data } = await apiClient.get<ApiResponse<FeedResponse>>(
      API_ENDPOINTS.FEED.GET,
      { params },
    );
    return data;
  },

  /**
   * Get single post by ID
   */
  getPost: async (id: string): Promise<ApiResponse<FeedItem>> => {
    const { data } = await apiClient.get<ApiResponse<FeedItem>>(
      API_ENDPOINTS.POSTS.DETAIL(id),
    );
    return data;
  },

  /**
   * Create a new post
   */
  createPost: async (input: CreatePostInput): Promise<ApiResponse<FeedItem>> => {
    const { data } = await apiClient.post<ApiResponse<FeedItem>>(
      API_ENDPOINTS.POSTS.CREATE,
      input,
    );
    return data;
  },

  /**
   * Update an existing post
   */
  updatePost: async (
    id: string,
    input: UpdatePostInput,
  ): Promise<ApiResponse<FeedItem>> => {
    const { data } = await apiClient.patch<ApiResponse<FeedItem>>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      input,
    );
    return data;
  },

  /**
   * Delete a post
   */
  deletePost: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      API_ENDPOINTS.POSTS.DELETE(id),
    );
    return data;
  },

  /**
   * React (LIKE) to a post
   */
  reactToPost: async (
    postId: string,
  ): Promise<ApiResponse<{ hasReacted: boolean; reactionCount: number }>> => {
    const { data } = await apiClient.post<
      ApiResponse<{ hasReacted: boolean; reactionCount: number }>
    >(API_ENDPOINTS.POSTS.REACTION(postId));
    return data;
  },

  /**
   * Remove reaction from a post
   */
  unreactToPost: async (
    postId: string,
  ): Promise<ApiResponse<{ hasReacted: boolean; reactionCount: number }>> => {
    const { data } = await apiClient.delete<
      ApiResponse<{ hasReacted: boolean; reactionCount: number }>
    >(API_ENDPOINTS.POSTS.UNREACTION(postId));
    return data;
  },

  /**
   * Save a post to bookmarks
   */
  savePost: async (
    postId: string,
  ): Promise<ApiResponse<{ hasSaved: boolean }>> => {
    const { data } = await apiClient.post<ApiResponse<{ hasSaved: boolean }>>(
      API_ENDPOINTS.POSTS.SAVE(postId),
    );
    return data;
  },

  /**
   * Remove a post from saved bookmarks
   */
  unsavePost: async (
    postId: string,
  ): Promise<ApiResponse<{ hasSaved: boolean }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ hasSaved: boolean }>>(
      API_ENDPOINTS.POSTS.UNSAVE(postId),
    );
    return data;
  },

  /**
   * Get comments for a post
   */
  getComments: async (
    postId: string,
    limit?: number,
  ): Promise<ApiResponse<PostComment[]>> => {
    const { data } = await apiClient.get<ApiResponse<PostComment[]>>(
      API_ENDPOINTS.POSTS.COMMENTS(postId),
      { params: { limit } },
    );
    return data;
  },

  /**
   * Add a comment to a post
   */
  createComment: async (
    postId: string,
    content: string,
  ): Promise<ApiResponse<{ comment: PostComment; commentCount: number }>> => {
    const { data } = await apiClient.post<
      ApiResponse<{ comment: PostComment; commentCount: number }>
    >(API_ENDPOINTS.POSTS.CREATE_COMMENT(postId), { content });
    return data;
  },
};
