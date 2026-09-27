'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FriendsLayout } from '@/features/friends/components/FriendsLayout';
import { MyFriends } from '@/features/friends/components/MyFriends';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/providers/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';

export default function AllFriendsRoutePage() {
  const { locale } = useLanguage();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  return (
    <FriendsLayout>
      <div className="space-y-4">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#050505] dark:text-white">
            {locale === 'bn' ? 'সকল বন্ধু' : 'All Friends'}
          </h1>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                locale === 'bn' ? 'বন্ধুদের খুঁজুন...' : 'Search friends...'
              }
              className="pl-10 pr-10 h-9 rounded-xl bg-[#e4e6eb]/60 dark:bg-[#3a3b3c] border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-[#242526]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <MyFriends searchQuery={debouncedSearch} />
      </div>
    </FriendsLayout>
  );
}
