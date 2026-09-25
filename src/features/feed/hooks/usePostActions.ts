'use client';

import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { CreatePostInput, FeedItem, FeedResponse } from '../types/feed.types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function usePostActions() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  /**
   * Helper to optimistically update a post across all cached infinite feed pages
   */
  const updateFeedCache = (
    postId: string,
    updater: (post: FeedItem) => FeedItem,
  ) => {
    queryClient.setQueriesData<InfiniteData<FeedResponse>>(
      { queryKey: ['feed'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === postId ? updater(post) : post,
            ),
          })),
        };
      },
    );
  };

  /**
   * Optimistic Reaction Mutation (LIKE)
   */
  const reactMutation = useMutation({
    mutationFn: async ({
      postId,
      hasReacted,
    }: {
      postId: string;
      hasReacted: boolean;
    }) => {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        throw new Error('Please login to react to posts');
      }
      if (hasReacted) {
        return feedApi.unreactToPost(postId);
      } else {
        return feedApi.reactToPost(postId);
      }
    },
    onMutate: async ({ postId, hasReacted }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      // Snapshot previous feed state
      const previousFeed = queryClient.getQueriesData({ queryKey: ['feed'] });

      // Optimistically update
      updateFeedCache(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          reactionCount: Math.max(
            0,
            post.stats.reactionCount + (hasReacted ? -1 : 1),
          ),
        },
        viewer: {
          ...post.viewer,
          hasReacted: !hasReacted,
        },
      }));

      return { previousFeed };
    },
    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (context?.previousFeed) {
        context.previousFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  /**
   * Optimistic Save/Bookmark Mutation
   */
  const saveMutation = useMutation({
    mutationFn: async ({
      postId,
      hasSaved,
    }: {
      postId: string;
      hasSaved: boolean;
    }) => {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        throw new Error('Please login to save posts');
      }
      if (hasSaved) {
        return feedApi.unsavePost(postId);
      } else {
        return feedApi.savePost(postId);
      }
    },
    onMutate: async ({ postId, hasSaved }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousFeed = queryClient.getQueriesData({ queryKey: ['feed'] });

      // Optimistically update
      updateFeedCache(postId, (post) => ({
        ...post,
        viewer: {
          ...post.viewer,
          hasSaved: !hasSaved,
        },
      }));

      return { previousFeed };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  /**
   * Create Post Mutation
   */
  const createPostMutation = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      return feedApi.createPost(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  /**
   * Delete Post Mutation
   */
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return feedApi.deletePost(postId);
    },
    onSuccess: (_data, postId) => {
      queryClient.setQueriesData<InfiniteData<FeedResponse>>(
        { queryKey: ['feed'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((p) => p.id !== postId),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    toggleReaction: (postId: string, currentStatus: boolean) =>
      reactMutation.mutate({ postId, hasReacted: currentStatus }),
    toggleSave: (postId: string, currentStatus: boolean) =>
      saveMutation.mutate({ postId, hasSaved: currentStatus }),
    createPost: createPostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
  };
}
