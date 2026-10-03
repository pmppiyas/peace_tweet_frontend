'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useGroupActions } from '../hooks/useGroupActions';
import { useDuas } from '@/features/dua/hooks/useDuas';
import { PostType } from '@/features/feed/types/feed.types';
import { GroupDetail } from '../types/groups.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dua } from '@/types/dua.types';
import {
  BookOpen,
  HelpCircle,
  PenTool,
  X,
  Search,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/providers/LanguageProvider';

export interface GroupComposerProps {
  group: GroupDetail;
}

export function GroupComposer({ group }: GroupComposerProps) {
  const { user, isAuthenticated } = useAuth();
  const { locale } = useLanguage();
  const { createGroupPost, isCreatingPost } = useGroupActions(group);

  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState<PostType>('TEXT');
  const [content, setContent] = useState('');
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [duaSearch, setDuaSearch] = useState('');
  const [showDuaPicker, setShowDuaPicker] = useState(false);

  const { data: duasData, isLoading: isLoadingDuas } = useDuas({
    search: duaSearch || undefined,
    limit: 10,
  });

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postType === 'DUA' && !selectedDua) return;
    if (postType !== 'DUA' && !content.trim()) return;

    try {
      await createGroupPost(group.id, {
        type: postType,
        content: content.trim() || undefined,
        duaId: selectedDua?.id,
      });

      // Reset form
      setContent('');
      setSelectedDua(null);
      setIsOpen(false);
      setPostType('TEXT');
    } catch {
      // Handled by query mutation
    }
  };

  return (
    <Card className="border border-[#e4e6eb] bg-white p-3.5 sm:p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl">
      {!isOpen ? (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-sm select-none overflow-hidden shadow-xs">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || 'User'}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="h-10 w-full rounded-full bg-[#f0f2f5] px-4 text-left text-xs sm:text-sm text-[#65676b] hover:bg-[#e4e6eb] transition-colors dark:bg-[#3a3b3c] dark:text-[#b0b3b8] dark:hover:bg-[#4e4f50]"
          >
            {user?.name ? `${user.name.split(' ')[0]}, ` : ''}
            {locale === 'bn'
              ? `"${group.name}" গ্রুপে একটি দোয়া বা চিন্তা শেয়ার করুন...`
              : `Share an Islamic thought or Dua in "${group.name}"...`}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3.5 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6eb] pb-2.5 dark:border-[#393a3b]">
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-xs select-none overflow-hidden shadow-xs">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] leading-none">
                  {user?.name}
                </p>
                <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">
                  {group.name}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSelectedDua(null);
                setContent('');
              }}
              className="text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1.5 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPostType('TEXT');
                setSelectedDua(null);
              }}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                postType === 'TEXT'
                  ? 'bg-primary-50 text-primary-800 border border-primary-500 dark:bg-primary-900/60 dark:text-primary-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]',
              )}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'টেক্সট / স্মরণ' : 'Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType('DUA');
                setShowDuaPicker(true);
              }}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                postType === 'DUA'
                  ? 'bg-primary-50 text-primary-800 border border-primary-500 dark:bg-primary-900/60 dark:text-primary-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]',
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'দোয়া শেয়ার' : 'Dua Post'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType('QUESTION');
                setSelectedDua(null);
              }}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                postType === 'QUESTION'
                  ? 'bg-amber-50 text-amber-900 border border-amber-500 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]',
              )}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{locale === 'bn' ? 'প্রশ্ন / জিজ্ঞাসা' : 'Question'}</span>
            </button>
          </div>

          {/* If DUA type selected, show chosen Dua or trigger picker */}
          {postType === 'DUA' && (
            <div className="space-y-2">
              {selectedDua ? (
                <div className="flex items-center justify-between rounded-xl bg-primary-50/60 p-3 border border-primary-200 dark:bg-primary-900/40 dark:border-primary-800">
                  <div>
                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">
                      {locale === 'bn' ? 'যুক্ত করা দোয়া:' : 'Attached Dua:'}
                    </span>
                    <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                      🌙 {selectedDua.title}
                    </p>
                    <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">
                      {selectedDua.meaningBangla || selectedDua.transliteration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDuaPicker(true)}
                    className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {locale === 'bn' ? 'পরিবর্তন' : 'Change'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDuaPicker(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 p-3 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/40"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {locale === 'bn'
                      ? 'একটি দোয়া নির্বাচন করুন'
                      : 'Select a Dua'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'DUA'
                ? locale === 'bn'
                  ? 'এই দোয়া সম্পর্কে কোনো বার্তা বা আলোচনা লিখুন...'
                  : 'Add your thoughts or reflections regarding this Dua...'
                : postType === 'QUESTION'
                  ? locale === 'bn'
                    ? 'গ্রুপে আপনার প্রশ্নটি লিখুন...'
                    : 'Write your question for the group...'
                  : locale === 'bn'
                    ? 'গ্রুপের সদস্যদের জন্য কিছু লিখুন...'
                    : 'Write something for the group members...'
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] dark:focus:bg-[#242526]"
          />

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              {content.length}/5000 {locale === 'bn' ? 'অক্ষর' : 'characters'}
            </span>

            <Button
              type="submit"
              disabled={
                isCreatingPost ||
                (postType === 'DUA' && !selectedDua) ||
                (postType !== 'DUA' && !content.trim())
              }
              isLoading={isCreatingPost}
              size="sm"
              className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold px-4"
            >
              {locale === 'bn' ? 'পোস্ট করুন' : 'Post'}
            </Button>
          </div>
        </form>
      )}

      {/* Dua Selector Modal */}
      {showDuaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl border border-[#e4e6eb] bg-white p-4 shadow-xl dark:border-[#393a3b] dark:bg-[#242526] space-y-3">
            <div className="flex items-center justify-between border-b border-[#e4e6eb] pb-2 dark:border-[#393a3b]">
              <h3 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                {locale === 'bn' ? 'দোয়া নির্বাচন করুন' : 'Select Dua'}
              </h3>
              <button
                type="button"
                onClick={() => setShowDuaPicker(false)}
                className="text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={duaSearch}
                onChange={(e) => setDuaSearch(e.target.value)}
                placeholder={
                  locale === 'bn'
                    ? 'দোয়ার নাম দিয়ে খুঁজুন...'
                    : 'Search Dua by title...'
                }
                className="h-9 w-full rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] pl-8 pr-3 text-xs text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]"
              />
            </div>

            {/* Dua List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {isLoadingDuas ? (
                <div className="py-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1 text-primary-500" />
                  {locale === 'bn' ? 'দোয়া লোড হচ্ছে...' : 'Loading Duas...'}
                </div>
              ) : !duasData?.items || duasData.items.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? 'কোনো দোয়া পাওয়া যায়নি।'
                    : 'No Duas found.'}
                </div>
              ) : (
                duasData.items.map((d: any) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDua(d);
                      setPostType('DUA');
                      setShowDuaPicker(false);
                    }}
                    className={cn(
                      'flex w-full items-start justify-between rounded-xl p-2.5 text-left text-xs transition-colors border',
                      selectedDua?.id === d.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/60'
                        : 'border-[#e4e6eb] hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:hover:bg-[#3a3b3c]',
                    )}
                  >
                    <div>
                      <p className="font-bold text-[#050505] dark:text-[#e4e6eb]">
                        {d.title}
                      </p>
                      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">
                        {d.meaningBangla || d.transliteration}
                      </p>
                    </div>
                    {selectedDua?.id === d.id && (
                      <Check className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
