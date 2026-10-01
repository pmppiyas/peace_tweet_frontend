'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { BookmarkList } from '@/features/bookmark/components/BookmarkList';
import { ProfileTabHeader } from './ProfileTabHeader';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function ProfileSavedTab() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { locale } = useLanguage();

  return (
    <div className="space-y-4">
      <ProfileTabHeader
        icon={Bookmark}
        iconColor="text-purple-600 dark:text-purple-400"
        title={locale === 'bn' ? 'সংরক্ষিত আইটেম' : 'Saved Bookmarks'}
        description={
          locale === 'bn'
            ? 'আপনার বুকমার্ক করা সকল দোয়া ও পোস্ট'
            : 'All your bookmarked Duas and posts for quick reference'
        }
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={locale === 'bn' ? 'বুকমার্ক খুঁজুন...' : 'Search bookmarks...'}
        action={
          <Link href={ROUTES.DUAS}>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs font-bold whitespace-nowrap">
              <Compass className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'দোয়া খুঁজুন' : 'Explore Duas'}</span>
            </Button>
          </Link>
        }
      />

      <BookmarkList searchQuery={debouncedSearch} hideSearch={true} />
    </div>
  );
}
