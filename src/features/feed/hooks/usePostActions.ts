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

  // Helper to optimistically update a post across all cached infinite feed and group pages
  const updateFeedCache = (
    postId: string,
    updater: (post: FeedItem) => FeedItem,
  ) => {
    const updateInfiniteData = (oldData?: InfiniteData<FeedResponse>) => {
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
    };

    queryClient.setQueriesData<InfiniteData<FeedResponse>>(
      { queryKey: ['feed'] },
      updateInfiniteData,
    );
    queryClient.setQueriesData<InfiniteData<FeedResponse>>(
      { queryKey: ['groups'] },
      updateInfiniteData,
    );
  };

  // Optimistic Reaction Mutation (LIKE)
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

  // Optimistic Save/Bookmark Mutation
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
        stats: {
          ...post.stats,
          saveCount: Math.max(0, (post.stats.saveCount || 0) + (hasSaved ? -1 : 1)),
        },
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

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      return feedApi.createPost(input);
    },
    onSuccess: (response) => {
      const newPost = response?.data;
      if (newPost) {
        queryClient.setQueriesData<InfiniteData<FeedResponse>>(
          { queryKey: ['feed'] },
          (oldData) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
            return {
              ...oldData,
              pages: oldData.pages.map((page, idx) => {
                if (idx === 0) {
                  const existingItems = page.items || [];
                  const filtered = existingItems.filter((p) => p.id !== newPost.id);
                  return {
                    ...page,
                    items: [newPost, ...filtered],
                  };
                }
                return page;
              }),
            };
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  // Delete Post Mutation (optimistic: hide immediately, roll back on failure)
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return feedApi.deletePost(postId);
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['groups'] });

      const previousFeed = queryClient.getQueriesData({ queryKey: ['feed'] });
      const previousGroups = queryClient.getQueriesData({ queryKey: ['groups'] });

      const removePost = (oldData?: InfiniteData<FeedResponse>) => {
        if (!oldData?.pages) return oldData;
        let originalPostId: string | null = null;
        for (const page of oldData.pages) {
          const found = (page.items || []).find((p) => p.id === postId);
          if (found?.originalPostId) {
            originalPostId = found.originalPostId;
            break;
          }
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: (page.items || [])
              .filter((p) => p.id !== postId)
              .map((p) => {
                if (originalPostId && (p.id === originalPostId || p.originalPostId === originalPostId)) {
                  return {
                    ...p,
                    stats: {
                      ...p.stats,
                      shareCount: Math.max(0, (p.stats.shareCount || 0) - 1),
                    },
                  };
                }
                return p;
              }),
          })),
        };
      };

      queryClient.setQueriesData<InfiniteData<FeedResponse>>({ queryKey: ['feed'] }, removePost);
      queryClient.setQueriesData<InfiniteData<FeedResponse>>({ queryKey: ['groups'] }, removePost);

      return { previousFeed, previousGroups };
    },
    onError: (err: any, _postId, context) => {
      // Restore the post if the delete failed
      context?.previousFeed?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousGroups?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      const message = err?.response
        ? err.response.data?.message || 'Failed to delete the post. Please try again.'
        : 'Cannot reach the server. Please check your connection and try again.';
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return {
    toggleReaction: (postId: string, currentStatus: boolean) =>
      reactMutation.mutate({ postId, hasReacted: currentStatus }),
    toggleSave: (postId: string, currentStatus: boolean) =>
      saveMutation.mutate({ postId, hasSaved: currentStatus }),
    createPost: createPostMutation.mutateAsync,
    // Uses mutate (not mutateAsync) so failures are handled in onError and never become unhandled rejections
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    isCreatingPost: createPostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
  };
}
