'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useSavedItems, useUpdateTimeSlotMutation } from '../hooks/useBookmarks';
import { bookmarkApi } from '../api/bookmark.api';
import { SavedContentCard } from './SavedContentCard';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { Bookmark, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/providers/LanguageProvider';
import { useQueryClient } from '@tanstack/react-query';
import {
  TimeSlot,
  TIME_SLOTS,
  getCurrentTimeSlot,
  SavedFeedItem,
} from '@/types/saved.types';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';

export interface BookmarkListProps {
  searchQuery?: string;
  hideSearch?: boolean;
  initialTimeSlot?: TimeSlot | 'all';
  initialType?: 'ALL' | 'DUA' | 'POST';
}

export function BookmarkList({
  searchQuery,
  hideSearch = false,
  initialTimeSlot = 'all',
  initialType = 'ALL',
}: BookmarkListProps = {}) {
  const { locale } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const urlSlot = searchParams?.get('slot') as TimeSlot | 'all' | null;

  const currentRoutineSlot = getCurrentTimeSlot();

  const [internalSearch, setInternalSearch] = useState('');
  const debouncedInternalSearch = useDebounce(internalSearch, 350);

  const effectiveSearch =
    searchQuery !== undefined ? searchQuery : debouncedInternalSearch;

  // Default to current routine time if no slot is in the URL
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | 'all'>(
    urlSlot
      ? urlSlot
      : (initialTimeSlot !== 'all' ? initialTimeSlot : currentRoutineSlot)
  );

  useEffect(() => {
    if (urlSlot) {
      setSelectedSlot(urlSlot);
    } else if (searchParams && !searchParams.get('slot')) {
      setSelectedSlot(currentRoutineSlot);
    }
  }, [urlSlot, searchParams, currentRoutineSlot]);

  const [selectedType, setSelectedType] = useState<'ALL' | 'DUA' | 'POST'>(
    initialType
  );

  const { data, isLoading, isError } = useSavedItems({
    search: effectiveSearch || undefined,
    timeSlot: selectedSlot,
    type: selectedType,
  });

  const updateTimeSlotMutation = useUpdateTimeSlotMutation();

  const handleUpdateSlot = (id: string, type: 'DUA' | 'POST', slot: TimeSlot | null) => {
    updateTimeSlotMutation.mutate({ id, type, timeSlot: slot });
  };

  const handleRemove = async (id: string, type: 'DUA' | 'POST') => {
    try {
      soundEffects.playDelete();
      if (type === 'DUA') {
        await bookmarkApi.unsaveDua(id);
      } else {
        await bookmarkApi.unsavePost(id);
      }
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['saved-duas'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    } catch (err) {
      console.error('Failed to remove saved item:', err);
    }
  };

  const savedItems = (data?.items || []) as SavedFeedItem[];

  return (
    <div className="space-y-4">
      {/* 1. Search Bar (if not hidden) */}
      {!hideSearch && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'সংরক্ষিত দোয়া ও পোস্টের মধ্যে খুঁজুন...'
                : 'Search within your saved collection...'
            }
            className="h-10 w-full rounded-2xl border border-[#e4e6eb] bg-white pl-10 pr-9 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] transition-all"
          />
          {internalSearch && (
            <button
              type="button"
              onClick={() => setInternalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 2. Content Type Filter (All / Duas / Posts) */}
      <div className="flex items-center gap-2 border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2 select-none">
        <button
          type="button"
          onClick={() => {
            if (selectedType !== 'ALL') soundEffects.playTab();
            setSelectedType('ALL');
          }}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer',
            selectedType === 'ALL'
              ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-white'
              : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-white'
          )}
        >
          {locale === 'bn' ? 'সকল সংরক্ষিত' : 'All Items'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (selectedType !== 'DUA') soundEffects.playTab();
            setSelectedType('DUA');
          }}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer',
            selectedType === 'DUA'
              ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-white'
              : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-white'
          )}
        >
          {locale === 'bn' ? 'দোয়া' : 'Duas'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (selectedType !== 'POST') soundEffects.playTab();
            setSelectedType('POST');
          }}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer',
            selectedType === 'POST'
              ? 'bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-white'
              : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-white'
          )}
        >
          {locale === 'bn' ? 'পোস্টসমূহ' : 'Posts'}
        </button>
      </div>

      {/* 3. Main Reading Feed of Saved Items */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center text-xs text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300">
          {locale === 'bn'
            ? 'সংরক্ষিত আইটেম লোড করা সম্ভব হয়নি।'
            : 'Failed to load your saved items.'}
        </div>
      ) : savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#e4e6eb] bg-white p-12 text-center dark:border-[#393a3b] dark:bg-[#242526] select-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-3 shadow-xs">
            <Bookmark className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
            {selectedSlot !== 'all'
              ? locale === 'bn'
                ? `${TIME_SLOTS.find((s) => s.id === selectedSlot)?.labelBn || ''}র কোনো সংরক্ষিত আইটেম নেই`
                : `No saved items for ${selectedSlot}`
              : locale === 'bn'
                ? 'এখনো কোনো আইটেম সংরক্ষণ করা হয়নি'
                : 'No saved items yet'}
          </h3>
          <p className="mt-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm leading-relaxed">
            {selectedSlot !== 'all'
              ? locale === 'bn'
                ? 'দোয়া বা পোস্ট সেভ করার সময় এই রুটিনটি নির্বাচন করলে তা এখানে সহজে পড়তে পারবেন।'
                : 'Save Duas or Posts with this routine slot to organize and read them here.'
              : locale === 'bn'
                ? 'ফিড বা দোয়ার পাতা থেকে আপনার পছন্দের দোয়া ও পোস্টগুলো সেভ করে রাখুন।'
                : 'Save your favorite duas and posts from the feed or dua library to review later.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {savedItems.map((item) => (
            <SavedContentCard
              key={item.savedId || item.id}
              item={item}
              onUpdateSlot={handleUpdateSlot}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
