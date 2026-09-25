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
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
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
  );
}
