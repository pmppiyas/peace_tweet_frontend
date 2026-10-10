'use client';

import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { sharesApi } from '../api/shares.api';
import { CreateShareInput, FeedItem, FeedResponse, ShareResponse } from '../types/feed.types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useUiStore } from '@/stores/uiStore';
import { soundEffects } from '@/lib/sound/soundEffects';

export function useShare() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { setIsUploadingPost, triggerPostSuccess } = useUiStore();

  const shareMutation = useMutation({
    mutationFn: async (input: CreateShareInput): Promise<ShareResponse> => {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        throw new Error('Please login to share');
      }
      const response = await sharesApi.createShare(input);
      return response.data;
    },
    onMutate: async (variables) => {
      // 0. Instantly trigger loading spinner on user avatar in PostComposer
      setIsUploadingPost(
        true,
        variables.target === 'GROUP' ? 'Sharing to group...' : 'Sharing to your feed...',
      );

      // 1. Instantly cancel queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      // 2. Snapshot previous feeds
      const previousFeed = queryClient.getQueriesData({ queryKey: ['feed'] });
      const previousGroups = queryClient.getQueriesData({ queryKey: ['groups'] });

      // 3. Instantly increment share count on the post across all cached feeds
      const incrementCount = (oldData?: InfiniteData<FeedResponse>) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === variables.contentId || post.originalPostId === variables.contentId
                ? {
                    ...post,
                    stats: {
                      ...post.stats,
                      shareCount: (post.stats.shareCount || 0) + 1,
                    },
                  }
                : post,
            ),
          })),
        };
      };

      queryClient.setQueriesData<InfiniteData<FeedResponse>>({ queryKey: ['feed'] }, incrementCount);
      queryClient.setQueriesData<InfiniteData<FeedResponse>>({ queryKey: ['groups'] }, incrementCount);

      return { previousFeed, previousGroups };
    },
    onError: (err: any, _vars, context) => {
      // Rollback on failure
      context?.previousFeed?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousGroups?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      setIsUploadingPost(false);
      const message =
        err?.response?.data?.message || err?.message || 'Failed to share post. Please try again.';
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
    },
    onSuccess: (data, variables) => {
      soundEffects.playPost();
      setIsUploadingPost(false);
      triggerPostSuccess(
        variables.target === 'GROUP'
          ? 'Post shared to group successfully!'
          : 'Post shared to feed successfully!',
      );

      // If a shared post was created and target was FEED, prepend directly to top of feed!
      if (data?.post && variables.target === 'FEED') {
        const rawPost = data.post as any;
        const newPost: FeedItem = {
          ...rawPost,
          stats: rawPost.stats || {
            reactionCount: 0,
            commentCount: 0,
            saveCount: 0,
            shareCount: 0,
          },
          viewer: rawPost.viewer || {
            hasReacted: false,
            hasSaved: false,
          },
          author: {
            id: rawPost.author?.id,
            name: rawPost.author?.name || '',
            username: rawPost.author?.username || '',
            avatar: rawPost.author?.avatarUrl || rawPost.author?.avatar || null,
          },
        };

        queryClient.setQueriesData<InfiniteData<FeedResponse>>(
          { queryKey: ['feed'] },
          (oldData) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;
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

      // Invalidate queries in background so fresh data syncs
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      if (variables.target === 'GROUP') {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        if (variables.groupId) {
          queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
        }
      }
    },
  });

  return {
    share: shareMutation.mutateAsync,
    shareSync: shareMutation.mutate,
    isSharing: shareMutation.isPending,
    isSuccess: shareMutation.isSuccess,
    error: shareMutation.error,
  };
}
