import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Feed } from '@/features/feed/components/Feed';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export const metadata = {
  title: 'Explore Duas & Feed | PeaceTweet',
  description: 'Authentic prophetic supplications and daily Islamic reminders.',
};

export default function DuasPage() {
  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs items={[{ label: 'All Duas & Dhikr' }]} />

          <div className="rounded-xl bg-white p-4 border border-[#e4e6eb] shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
            <h1 className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
              All Duas & Dhikr
            </h1>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
              Authentic prayers from the Holy Qur'an and Sunnah
            </p>
          </div>

          <Feed />
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
