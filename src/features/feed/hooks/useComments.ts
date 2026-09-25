'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function useComments(postId: string, isEnabled = false) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await feedApi.getComments(postId);
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60, // 1 minute
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        throw new Error('Please sign in to comment.');
      }
      return feedApi.createComment(postId, content);
    },
    onSuccess: (res) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      // Invalidate feed to update comment counts
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    addComment: createCommentMutation.mutateAsync,
    isAddingComment: createCommentMutation.isPending,
  };
}
