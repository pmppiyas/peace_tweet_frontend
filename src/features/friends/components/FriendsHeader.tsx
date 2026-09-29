'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/providers/LanguageProvider';

export interface FriendsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showSearch?: boolean;
}

export function FriendsHeader({
  searchQuery,
  onSearchChange,
  showSearch = true,
}: FriendsHeaderProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-3 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#050505] dark:text-white">
          {locale === 'bn' ? 'বন্ধুরা' : 'Friends'}
        </h1>
      </div>

      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              locale === 'bn' ? 'বন্ধুদের খুঁজুন...' : 'Search friends...'
            }
            className="pl-10 pr-10 h-10 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-[#242526]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
