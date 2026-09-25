'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { SearchBar } from '@/features/search/components/SearchBar';
import { Feed } from '@/features/feed/components/Feed';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs items={[{ label: 'Search' }]} />

          <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
            <h1 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
              Search PeaceTweet
            </h1>
            <SearchBar defaultValue={query} />
          </div>

          <Feed initialSearch={query} />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
