'use client';

import React, { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { FeedItem } from '@/features/feed/components/FeedItem';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { Bookmark, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function BookmarkList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isError } = useBookmarks({
    search: debouncedSearch || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search within your saved bookmarks..."
          className="h-10 w-full rounded-xl border border-[#e4e6eb] bg-white pl-10 pr-4 text-xs sm:text-sm placeholder:text-[#65676b] focus:border-emerald-600 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8]"
        />
      </div>

      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-xs text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300">
          Failed to load your bookmarks.
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e4e6eb] bg-white p-12 text-center dark:border-[#393a3b] dark:bg-[#242526]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
            No saved bookmarks yet
          </h3>
          <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm">
            Click the Save button on any Dua in the feed to save it here for quick reference.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((item) => (
            <FeedItem
              key={item.id}
              post={{
                id: item.id,
                type: 'DUA',
                content: null,
                createdAt: item.createdAt || new Date().toISOString(),
                author: {
                  id: item.createdBy?.id || 'scholar',
                  name: item.createdBy?.name || 'PeaceTweet Scholar',
                  username: item.createdBy?.username || 'scholar',
                  avatar: null,
                },
                dua: {
                  id: item.id,
                  title: item.title,
                  fadilah: item.fadilah,
                  duaBangla: item.duaBangla,
                  meaningBangla: item.meaningBangla,
                  arabicText: item.arabicText,
                  transliteration: item.transliteration,
                  category: item.category,
                  references: item.references || [],
                  audios: item.audios || [],
                  audioUrl: item.audios?.[0]?.audioUrl || null,
                },
                stats: {
                  reactionCount: 0,
                  commentCount: 0,
                },
                viewer: {
                  hasReacted: false,
                  hasSaved: true,
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
