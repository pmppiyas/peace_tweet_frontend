'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';

export interface SectionMobileTab {
  id: string;
  label: string;
  href: string;
  exact?: boolean;
  count?: number;
}

export interface SectionLayoutProps {
  sidebar: React.ReactNode;
  mobileTabs?: SectionMobileTab[];
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  contentClassName?: string;
}

export function SectionLayout({
  sidebar,
  mobileTabs = [],
  children,
  maxWidth = 'max-w-6xl',
  className,
  contentClassName,
}: SectionLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={cn('min-h-[calc(100vh-3.5rem)] bg-[#f0f2f5] dark:bg-[#18191a]', className)}>
      <Container size="xl" className="px-0 sm:px-4">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
          {/* Dedicated Section Sidebar */}
          {sidebar}

          {/* Mobile Sticky Top Horizontal Tab Navigation */}
          {mobileTabs.length > 0 && (
            <div className="lg:hidden sticky top-14 z-30 bg-white dark:bg-[#242526] border-b border-[#e4e6eb] dark:border-[#393a3b] p-2 flex gap-1 overflow-x-auto shadow-2xs select-none">
              {mobileTabs.map((tab) => {
                const isActive = tab.exact
                  ? pathname === tab.href
                  : pathname.startsWith(tab.href);

                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#f0f2f5] text-[#050505] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                    )}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {tab.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Main Content Area */}
          <main className={cn('flex-1 min-w-0 p-4 sm:p-6 lg:p-8', contentClassName)}>
            <div className={cn('mx-auto', maxWidth)}>{children}</div>
          </main>
        </div>
      </Container>
    </div>
  );
}
