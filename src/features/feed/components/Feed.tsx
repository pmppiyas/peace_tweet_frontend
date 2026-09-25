'use client';

import React, { useState } from 'react';
import { useFeed } from '../hooks/useFeed';
import { FeedList } from './FeedList';
import { FeedSkeleton } from './FeedSkeleton';
import { Button } from '@/components/ui/Button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/providers/LanguageProvider';

export interface FeedProps {
  categoryId?: string;
  initialSearch?: string;
}

export function Feed({ categoryId, initialSearch = '' }: FeedProps) {
  const { t, formatNumber } = useLanguage();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isError, error, isFetching } = useFeed({
    page,
    limit: 10,
    categoryId,
    search: debouncedSearch || undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Minimal Search Bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={t('feed.searchPlaceholder')}
          className="h-10 w-full rounded-2xl border border-gray-100 bg-white pl-10 pr-4 text-xs sm:text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        />
        {isFetching && !isLoading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-emerald-600 font-medium">
            {t('feed.loading')}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-6 text-center text-xs sm:text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
          {t('feed.failed')}
        </div>
      ) : (
        <>
          <FeedList duas={data?.duas || []} />

          {/* Pagination Controls */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                {t('feed.pageInfo', {
                  page: formatNumber(data.meta.page),
                  totalPages: formatNumber(data.meta.totalPages),
                  total: formatNumber(data.meta.total),
                })}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1 rounded-xl text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>{t('feed.prevPage')}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1 rounded-xl text-xs"
                >
                  <span>{t('feed.nextPage')}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
