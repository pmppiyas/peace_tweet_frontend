'use client';

import React, { useState } from 'react';
import { Search, X, MapPin, ChevronDown, Filter } from 'lucide-react';
import { BLOOD_GROUPS } from '../utils/blood-helpers';
import { BloodGroup } from '../types/blood.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { LocationSelector, LocationValue } from '@/components/ui/LocationSelector';
import { cn } from '@/lib/utils/cn';

export interface BloodFiltersProps {
  selectedGroup?: BloodGroup;
  onSelectGroup: (group?: BloodGroup) => void;
  search: string;
  onSearchChange: (search: string) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  locationValue?: LocationValue;
  onLocationValueChange?: (val: LocationValue) => void;
  placeholder?: string;
}

export function BloodFilters({
  selectedGroup,
  onSelectGroup,
  search,
  onSearchChange,
  location,
  onLocationChange,
  locationValue,
  onLocationValueChange,
  placeholder,
}: BloodFiltersProps) {
  const { locale } = useLanguage();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const hasActiveLocation = Boolean(locationValue?.location || location);
  const activeLocationText = locationValue?.location || location || '';

  const handleResetLocation = () => {
    if (onLocationValueChange) {
      onLocationValueChange({ country: '', countryCode: '', state: '', city: '', location: '' });
    }
    if (onLocationChange) {
      onLocationChange('');
    }
    setIsLocationOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar & Location Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              placeholder ||
              (locale === 'bn'
                ? 'রোগীর নাম, হাসপাতাল বা কি-ওয়ার্ড দিয়ে খুঁজুন...'
                : 'Search by patient, hospital or keyword...')
            }
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-[#e4e6eb] bg-white text-sm text-[#050505] placeholder-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:border-rose-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Location Filter Trigger Button */}
        {(onLocationValueChange || onLocationChange) && (
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className={cn(
              'h-10 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer select-none shrink-0',
              hasActiveLocation
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-[#242526] border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:bg-gray-50 dark:hover:bg-[#3a3b3c]',
              isLocationOpen && 'ring-2 ring-rose-500/20 border-rose-500',
            )}
          >
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className={cn('h-3.5 w-3.5 shrink-0', hasActiveLocation ? 'text-rose-600' : 'text-gray-400')} />
              <span className="truncate">
                {hasActiveLocation
                  ? activeLocationText
                  : locale === 'bn'
                  ? 'লোকেশন ফিল্টার'
                  : 'Location Filter'}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-gray-400 transition-transform duration-200',
                isLocationOpen && 'transform rotate-180 text-rose-500',
              )}
            />
          </button>
        )}
      </div>

      {/* Expandable Location Selector Panel */}
      {isLocationOpen && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f0f2f5]/80 dark:bg-[#1f2022] border border-[#e4e6eb] dark:border-[#393a3b] space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
              <MapPin className="h-4 w-4 text-rose-600" />
              <span>
                {locale === 'bn'
                  ? 'এলাকা বা দেশ অনুযায়ী রক্ত খুঁজুন'
                  : 'Filter Blood by Area / Country'}
              </span>
            </div>
            {hasActiveLocation && (
              <button
                type="button"
                onClick={handleResetLocation}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                {locale === 'bn' ? 'সব এলাকা দেখুন (রিসেট)' : 'View All Areas (Reset)'}
              </button>
            )}
          </div>

          <LocationSelector
            value={locationValue}
            onChange={(val) => {
              if (onLocationValueChange) onLocationValueChange(val);
              if (onLocationChange) onLocationChange(val.location);
            }}
            locale={locale}
          />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsLocationOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {locale === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filter'}
            </button>
          </div>
        </div>
      )}

      {/* Active Location Filter Pill & Blood Group Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {/* If Location is Active, Show Clearable Tag */}
        {hasActiveLocation && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 shrink-0">
            <MapPin className="h-3 w-3 text-rose-600 shrink-0" />
            <span className="truncate max-w-[160px]">{activeLocationText}</span>
            <button
              type="button"
              onClick={handleResetLocation}
              className="p-0.5 hover:bg-rose-200 dark:hover:bg-rose-900 rounded-full cursor-pointer ml-0.5"
              title={locale === 'bn' ? 'লোকেশন ফিল্টার সরান' : 'Remove location filter'}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelectGroup(undefined)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none shadow-2xs cursor-pointer',
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
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none shadow-2xs cursor-pointer',
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
