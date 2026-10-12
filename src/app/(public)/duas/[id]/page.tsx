'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { useDua } from '@/features/dua/hooks/useDua';
import { DuaDetail } from '@/features/dua/components/DuaDetail';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SingleDuaPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: dua, isLoading, isError } = useDua(id);

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a]">
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full justify-between gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pb-20 sm:pb-8 space-y-4 px-2 sm:px-0">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-6 w-36 rounded-md" />
                <Skeleton className="h-80 w-full rounded-3xl" />
              </div>
            ) : isError || !dua ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-red-700">
                দোয়াটি পাওয়া যায়নি।
              </div>
            ) : (
              <DuaDetail dua={dua} />
            )}
          </main>

          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
