'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Feed } from '@/features/feed/components/Feed';
import { useCategory } from '@/features/category/hooks/useCategory';
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

          {category?.id && <Feed categoryId={category.id} />}
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
