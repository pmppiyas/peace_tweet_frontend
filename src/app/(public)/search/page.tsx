'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { SearchBar } from '@/features/search/components/SearchBar';
import { useDuas } from '@/features/dua/hooks/useDuas';
import { FeedItem } from '@/features/feed/components/FeedItem';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { EmptyFeed } from '@/features/feed/components/EmptyFeed';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="xl" className="h-full px-0 sm:px-4">
        <div className="flex h-full justify-center gap-4 lg:gap-6">
          <Sidebar />

          <main className="w-full max-w-2xl min-w-0 h-full overflow-y-auto overscroll-contain py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            <Breadcrumbs items={[{ label: 'Search' }]} />

            <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
              <h1 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                Search PeaceTweet
              </h1>
              <SearchBar defaultValue={query} />
            </div>

            <SearchResults query={query} />
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const { data, isLoading } = useDuas({ search: query || undefined });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <EmptyFeed
        message={
          query
            ? `"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি`
            : 'অনুসন্ধান করতে উপরে লিখুন'
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.items.map((dua: any) => (
        <FeedItem
          key={dua.id}
          post={{
            id: dua.id,
            type: 'DUA',
            content: null,
            createdAt: dua.createdAt || new Date().toISOString(),
            author: {
              id: dua.createdBy?.id || 'scholar',
              name: dua.createdBy?.name || 'PeaceTweet Scholar',
              username: dua.createdBy?.username || 'scholar',
              avatar: null,
            },
            dua: {
              id: dua.id,
              title: dua.title,
              fadilah: dua.fadilah,
              duaBangla: dua.duaBangla,
              meaningBangla: dua.meaningBangla,
              arabicText: dua.arabicText,
              transliteration: dua.transliteration,
              category: dua.category,
              references: dua.references || [],
              audios: dua.audios || [],
              audioUrl: dua.audios?.[0]?.audioUrl || null,
            },
            stats: {
              reactionCount: 0,
              commentCount: 0,
            },
            viewer: {
              hasReacted: false,
              hasSaved: false,
            },
          }}
        />
      ))}
    </div>
  );
}
