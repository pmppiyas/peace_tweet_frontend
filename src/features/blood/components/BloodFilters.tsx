'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { BLOOD_GROUPS } from '../utils/blood-helpers';
import { BloodGroup } from '../types/blood.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export interface BloodFiltersProps {
  selectedGroup?: BloodGroup;
  onSelectGroup: (group?: BloodGroup) => void;
  search: string;
  onSearchChange: (search: string) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
}

export function BloodFilters({
  selectedGroup,
  onSelectGroup,
  search,
  onSearchChange,
  location,
  onLocationChange,
  placeholder,
}: BloodFiltersProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Search Bar & Location Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              placeholder ||
              (locale === 'bn'
                ? 'রোগীর নাম, হাসপাতাল বা লোকেশন দিয়ে খুঁজুন...'
                : 'Search by patient, hospital or location...')
            }
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-[#e4e6eb] bg-white text-sm text-[#050505] placeholder-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:border-rose-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {onLocationChange && (
          <div className="relative sm:w-48">
            <input
              type="text"
              value={location || ''}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder={locale === 'bn' ? 'শহর / জেলা' : 'City / District'}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e4e6eb] bg-white text-sm text-[#050505] placeholder-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:border-rose-500 transition-colors"
            />
            {location && (
              <button
                type="button"
                onClick={() => onLocationChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Blood Group Chips Horizontal Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectGroup(undefined)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none shadow-2xs',
            !selectedGroup
              ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none'
              : 'bg-white text-[#050505] border border-[#e4e6eb] hover:bg-gray-100 dark:bg-[#242526] dark:text-[#e4e6eb] dark:border-[#393a3b] dark:hover:bg-[#3a3b3c]',
          )}
        >
          {locale === 'bn' ? 'সব গ্রুপ' : 'All Groups'}
        </button>

        {BLOOD_GROUPS.map((g) => {
          const isSelected = selectedGroup === g.value;
          return (
            <button
              key={g.value}
              type="button"
              onClick={() => onSelectGroup(isSelected ? undefined : g.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none shadow-2xs',
                isSelected
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-200 dark:shadow-none'
                  : 'bg-white text-[#050505] border border-[#e4e6eb] hover:bg-rose-50 hover:text-rose-600 dark:bg-[#242526] dark:text-[#e4e6eb] dark:border-[#393a3b] dark:hover:bg-[#3a3b3c] dark:hover:text-rose-400',
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
