'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/features/bookmark/api/bookmark.api';
import { cn } from '@/lib/utils/cn';

export interface BookmarkButtonProps {
  duaId: string;
  initialIsSaved?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
  label?: string;
}

export function BookmarkButton({
  duaId,
  initialIsSaved = false,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label = 'Save',
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await bookmarkApi.unsaveDua(duaId);
        return false;
      } else {
        await bookmarkApi.saveDua(duaId);
        return true;
      }
    },
    onMutate: () => {
      // Optimistic update
      setIsSaved((prev) => !prev);
    },
    onSuccess: (newStatus) => {
      setIsSaved(newStatus);
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['dua', duaId] });
    },
    onError: () => {
      // Revert on error
      setIsSaved((prev) => !prev);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save this Dua to your bookmarks.');
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={mutation.isPending}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 focus:outline-hidden',
        size === 'sm' ? 'py-1.5 px-2 text-xs' : 'py-2 px-3 text-sm',
        isSaved
          ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 font-bold'
          : 'text-gray-500 hover:bg-emerald-50 hover:text-brand-700 dark:text-gray-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
        variant === 'ghost' && 'hover:bg-emerald-50/60 dark:hover:bg-gray-800',
        className,
      )}
      title={isSaved ? 'Remove from bookmarks' : 'Save to bookmarks'}
    >
      <Bookmark
        className={cn(
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          isSaved && 'fill-current text-amber-600',
        )}
      />
      {showLabel && <span>{isSaved ? 'Saved' : label}</span>}
    </button>
  );
}
