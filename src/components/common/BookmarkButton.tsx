'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/features/bookmark/api/bookmark.api';
import { TimeSlotPicker, TimeSlotBadge } from '@/features/bookmark/components/TimeSlotPicker';
import { TimeSlot } from '@/types/saved.types';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';

export interface BookmarkButtonProps {
  duaId: string;
  initialIsSaved?: boolean;
  initialTimeSlot?: TimeSlot | null;
  duaTitle?: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
  label?: string;
}

export function BookmarkButton({
  duaId,
  initialIsSaved = false,
  initialTimeSlot = null,
  duaTitle,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label = 'Save',
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot | null>(initialTimeSlot);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (slot?: TimeSlot | null) => {
      await bookmarkApi.saveDua(duaId, slot || undefined);
    },
    onMutate: (slot) => {
      soundEffects.playSave();
      setIsSaved(true);
      if (slot !== undefined) setCurrentTimeSlot(slot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['dua', duaId] });
    },
    onError: () => {
      setIsSaved(false);
      setCurrentTimeSlot(null);
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      await bookmarkApi.unsaveDua(duaId);
    },
    onMutate: () => {
      soundEffects.playDelete();
      setIsSaved(false);
      setCurrentTimeSlot(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['dua', duaId] });
    },
    onError: () => {
      setIsSaved(true);
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: async (slot: TimeSlot | null) => {
      await bookmarkApi.updateTimeSlot({ id: duaId, type: 'DUA', timeSlot: slot });
    },
    onMutate: (slot) => {
      setCurrentTimeSlot(slot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['dua', duaId] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save this Dua.');
      return;
    }
    if (isSaved) {
      // Open routine time picker to modify slot or remove
      setIsPickerOpen(true);
    } else {
      // Save and open picker to choose routine time
      saveMutation.mutate(null);
      setIsPickerOpen(true);
    }
  };

  const handleSelectSlot = (slot: TimeSlot | null) => {
    updateSlotMutation.mutate(slot);
  };

  const handleRemove = () => {
    unsaveMutation.mutate();
  };

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleClick}
          disabled={saveMutation.isPending || unsaveMutation.isPending}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200 focus:outline-hidden',
            size === 'sm' ? 'py-1.5 px-2 text-xs' : 'py-2 px-3 text-sm',
            isSaved
              ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 font-bold'
              : 'text-gray-500 hover:bg-primary-50 hover:text-brand-700 dark:text-gray-400 dark:hover:bg-primary-900/40 dark:hover:text-primary-300',
            variant === 'ghost' && 'hover:bg-primary-50/60 dark:hover:bg-gray-800',
            className,
          )}
          title={isSaved ? 'সংরক্ষিত (রুটিন সময় পরিবর্তন করতে ক্লিক করুন)' : 'সংরক্ষণ করুন'}
        >
          <Bookmark
            className={cn(
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              isSaved && 'fill-current text-amber-600',
            )}
          />
          {showLabel && <span>{isSaved ? 'সংরক্ষিত' : label}</span>}
        </button>

        {isSaved && currentTimeSlot && (
          <TimeSlotBadge
            timeSlot={currentTimeSlot}
            onClick={() => setIsPickerOpen(true)}
            size="sm"
          />
        )}
      </div>

      <TimeSlotPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedSlot={currentTimeSlot}
        onSelectSlot={handleSelectSlot}
        onRemove={handleRemove}
        title="দোয়া রুটিনের সময় নির্ধারণ করুন"
        itemTitle={duaTitle}
      />
    </>
  );
}
