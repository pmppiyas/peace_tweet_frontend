'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { useCategory } from '@/features/category/hooks/useCategory';
import { useDuas } from '@/features/dua/hooks/useDuas';
import { FeedItem } from '@/features/feed/components/FeedItem';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';
import { EmptyFeed } from '@/features/feed/components/EmptyFeed';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: category, isLoading } = useCategory(slug);

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]">
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full justify-between gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            <Breadcrumbs
              items={[
                { label: 'Categories', href: ROUTES.CATEGORIES },
                { label: category?.name || slug },
              ]}
            />

            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : (
              <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <h1 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                  {category?.name}
                </h1>
                {category?.description && (
                  <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            )}

            {category?.id && <CategoryDuaList categoryId={category.id} />}
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}

function CategoryDuaList({ categoryId }: { categoryId: string }) {
  const { data, isLoading } = useDuas({ categoryId });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (!data?.items || data.items.length === 0) {
    return <EmptyFeed message="এই ক্যাটাগরিতে এখনো কোনো দোয়া যুক্ত করা হয়নি" />;
  }

  return (
    <div className="w-full bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden">
      {data.items.map((dua: any, index: number) => (
        <React.Fragment key={dua.id}>
          {index > 0 && (
            <hr className="border-0 border-t border-[#e4e6eb] dark:border-[#393a3b]" />
          )}
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
              transliteration: dua.transliteration,
              meaningBangla: dua.meaningBangla,
              arabicText: dua.arabicText,
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
        </React.Fragment>
      ))}
    </div>
  );
}
