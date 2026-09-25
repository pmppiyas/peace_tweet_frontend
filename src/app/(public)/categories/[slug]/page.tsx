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
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
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
