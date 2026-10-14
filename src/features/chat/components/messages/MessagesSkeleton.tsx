'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';

export interface MessagesSkeletonProps {
  hasSelectedConversation?: boolean;
}

export function ConversationSidebarSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'w-full h-full flex flex-col bg-white dark:bg-[#18191a] md:bg-transparent overflow-hidden select-none py-2 sm:py-3 lg:py-4 pr-0 md:pr-1',
        className
      )}
    >
      {/* Top Header */}
      <div className="px-2 pb-2.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          <div className="h-7 w-24 rounded-lg bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
      </div>

      {/* Search Input Bar */}
      <div className="px-2 pb-2 shrink-0">
        <div className="h-9 w-full rounded-xl bg-gray-200/80 dark:bg-gray-700/50 animate-pulse" />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-1 space-y-1.5 overscroll-contain">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-2.5 py-2 rounded-xl animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/60 shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div
                  className="h-4 bg-gray-200 dark:bg-gray-700/60 rounded-md"
                  style={{ width: `${50 - (i % 3) * 10}%` }}
                />
                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700/60 rounded-md shrink-0" />
              </div>
              <div
                className="h-3 bg-gray-200 dark:bg-gray-700/60 rounded-md"
                style={{ width: `${75 - (i % 4) * 12}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function ChatViewSkeleton({
  onBack,
  className,
}: {
  onBack?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white dark:bg-[#18191a]',
        className
      )}
    >
      {/* Chat Top Header Skeleton */}
      <div className="h-14 sm:h-16 px-3.5 sm:px-4 border-b border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#1f2021] flex items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden p-1.5 text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="md:hidden h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          )}
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/60 rounded-md animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700/60 rounded-md animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
        </div>
      </div>

      {/* Messages Scroll Area Skeleton */}
      <div className="flex-1 overflow-hidden p-3 sm:p-5 space-y-4 flex flex-col justify-end bg-[#f8f9fa] dark:bg-[#18191a]">
        {/* Message 1 (Other) */}
        <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
          <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          <div className="h-12 w-52 sm:w-64 rounded-2xl rounded-bl-xs bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
        </div>

        {/* Message 2 (Me) */}
        <div className="flex items-end justify-end">
          <div className="h-10 w-40 sm:w-48 rounded-2xl rounded-br-xs bg-primary-100 dark:bg-primary-950/40 animate-pulse" />
        </div>

        {/* Message 3 (Other) */}
        <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
          <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          <div className="h-16 w-60 sm:w-72 rounded-2xl rounded-bl-xs bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
        </div>

        {/* Message 4 (Me) */}
        <div className="flex items-end justify-end">
          <div className="h-12 w-52 sm:w-60 rounded-2xl rounded-br-xs bg-primary-100 dark:bg-primary-950/40 animate-pulse" />
        </div>
      </div>

      {/* Message Input Bottom Bar Skeleton */}
      <div className="p-3 sm:p-4 border-t border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#1f2021] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse shrink-0" />
          <div className="h-10 flex-1 rounded-full bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-primary-200 dark:bg-primary-900/40 animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function EmptyPlaceholderSkeleton() {
  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f8f9fa] dark:bg-[#18191a] select-none">
      <div className="h-20 w-20 rounded-3xl bg-gray-200 dark:bg-gray-700/60 animate-pulse mb-4" />
      <div className="h-6 w-44 rounded-lg bg-gray-200 dark:bg-gray-700/60 animate-pulse mb-2" />
      <div className="h-4 w-64 rounded-md bg-gray-200 dark:bg-gray-700/60 animate-pulse mb-6" />
      <div className="h-10 w-36 rounded-2xl bg-gray-200 dark:bg-gray-700/60 animate-pulse" />
    </div>
  );
}

export function MessagesSkeleton({
  hasSelectedConversation = false,
}: MessagesSkeletonProps) {
  return (
    <div className="h-[100dvh] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]">
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full gap-4 lg:gap-6 2xl:gap-8">
          {/* 1. Left Column: Conversations Sidebar Skeleton */}
          <div
            className={cn(
              'w-full md:w-60 lg:w-60 xl:w-64 2xl:w-72 h-full shrink-0 flex flex-col',
              hasSelectedConversation ? 'hidden md:flex' : 'flex'
            )}
          >
            <ConversationSidebarSkeleton />
          </div>

          {/* 2. Main Area: Chat View Skeleton or Empty Placeholder Skeleton */}
          <main
            className={cn(
              'flex-1 w-full min-w-0 h-full py-0 sm:py-3 lg:py-4 px-0',
              hasSelectedConversation ? 'flex' : 'hidden md:flex'
            )}
          >
            <div className="w-full h-full flex bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden">
              {hasSelectedConversation ? (
                <ChatViewSkeleton />
              ) : (
                <EmptyPlaceholderSkeleton />
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
